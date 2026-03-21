# Copyright (c) 2025 DataChant Consulting LLC
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be
# included in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
# NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
# LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
# OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
# WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

# ESLint scanner for Power BI custom visuals.
#
# Uses Microsoft's official eslint-plugin-powerbi-visuals to scan the
# compiled JavaScript bundles of custom visuals. This is the SAME tool
# Microsoft uses during their certification process (Policy 1200.1.2).
#
# Workflow:
#   1. Beautify minified internal.js using js-beautify (makes it parseable)
#   2. Run ESLint with powerbi-visuals recommended rules
#   3. Parse JSON output and aggregate findings per visual
#   4. Filter out noise (e.g., 'arguments' keyword from transpiled code)
#
# Prerequisites (install once):
#   cd "Automation tools" && npm install
#
# This uses the node_modules installed in the Automation tools directory.

import csv
import json
import logging
import os
import re
import subprocess
import sys
import tempfile
from concurrent.futures import ThreadPoolExecutor, as_completed

# Configure logging
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setLevel(logging.INFO)
console_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))

if sys.platform.startswith('win') and hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)
logger.handlers.clear()
logger.addHandler(console_handler)
logger.propagate = False

# Directory where node_modules and eslint config live
TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))

# ESLint rules from eslint-plugin-powerbi-visuals that we track
# Grouped by what they mean for a non-technical audience
ESLINT_RULES = {
    "powerbi-visuals/no-banned-terms": {
        "plain": "Uses forbidden code patterns",
        "category": "Certification Blocker",
        # Sub-terms: eval, callee, caller, arguments, cookie, setInnerHTMLUnsafe, execUnsafeLocalFunction
        # We filter out 'arguments' since it's normal in compiled code
    },
    "powerbi-visuals/no-document-domain": {
        "plain": "Changes browser security boundary",
        "category": "Certification Blocker",
    },
    "powerbi-visuals/no-document-write": {
        "plain": "Overwrites page content unsafely",
        "category": "Certification Blocker",
    },
    "powerbi-visuals/no-http-string": {
        "plain": "Uses unencrypted HTTP connections",
        "category": "Security Concern",
    },
    "powerbi-visuals/no-implied-inner-html": {
        "plain": "Injects HTML via jQuery .html()",
        "category": "Certification Blocker",
    },
    "powerbi-visuals/no-inner-outer-html": {
        "plain": "Injects HTML directly into page",
        "category": "Certification Blocker",
    },
    "powerbi-visuals/no-string-based-set-immediate": {
        "plain": "Runs text as code via setImmediate",
        "category": "Certification Blocker",
    },
    "powerbi-visuals/non-literal-fs-path": {
        "plain": "Accesses files with variable paths",
        "category": "Security Concern",
    },
    "powerbi-visuals/non-literal-require": {
        "plain": "Loads modules dynamically",
        "category": "Security Concern",
    },
    "powerbi-visuals/insecure-random": {
        "plain": "Uses weak random number generator",
        "category": "Informational",
    },
}

# Banned terms that are normal in compiled/transpiled code and should be excluded
NOISE_BANNED_TERMS = {"arguments"}

# CSV columns
CSV_COLUMNS = [
    "Folder", "Simple Name", "Visual GUID", "Version",
    "ESLint Total", "ESLint Meaningful",
    "no-banned-terms (excl. arguments)", "no-document-domain", "no-document-write",
    "no-http-string", "no-implied-inner-html", "no-inner-outer-html",
    "no-string-based-set-immediate", "non-literal-fs-path", "non-literal-require",
    "insecure-random",
    "Banned Terms Detail",
    "ESLint Error",
]


def parse_folder_name(folder_name):
    """Extract simple_name, guid, version from folder name."""
    parts = folder_name.split('.')
    if len(parts) >= 5:
        try:
            version_parts = parts[-4:]
            [int(p) for p in version_parts]
            version = '.'.join(version_parts)
            name_parts = '.'.join(parts[:-4])
        except ValueError:
            version = 'unknown'
            name_parts = folder_name
    else:
        version = 'unknown'
        name_parts = folder_name

    guid_match = re.search(r'(?:^|[^A-Fa-f0-9])([A-Fa-f0-9]{32})$', name_parts)
    if guid_match:
        guid = guid_match.group(1)
        simple_name = name_parts[:guid_match.start(1)].rstrip('.')
    else:
        guid = ''
        simple_name = name_parts

    # Fallback: read cleaned.json for GUID
    return simple_name, guid, version


def get_guid_from_json(folder_path):
    """Read GUID from cleaned.json."""
    try:
        with open(os.path.join(folder_path, 'cleaned.json'), 'r',
                  encoding='utf-8', errors='ignore') as f:
            data = json.load(f)
        return data.get('visual', {}).get('guid', '')
    except Exception:
        return ''


def beautify_js(input_path, output_path):
    """Beautify a minified JS file using js-beautify."""
    cmd = f'npx js-beautify --type js -f "{input_path}" -o "{output_path}"'
    result = subprocess.run(
        cmd, cwd=TOOLS_DIR,
        capture_output=True, text=True, timeout=180,
        shell=True,
    )
    return result.returncode == 0


def run_eslint(js_path, output_json_path):
    """Run ESLint with powerbi-visuals rules on a JS file."""
    cmd = f'npx eslint "{js_path}" --format json -o "{output_json_path}"'
    result = subprocess.run(
        cmd, cwd=TOOLS_DIR,
        capture_output=True, text=True, timeout=180,
        shell=True,
    )
    # ESLint returns 1 when lint errors found (expected), 2 for fatal errors
    return result.returncode in (0, 1)


def parse_eslint_results(json_path):
    """Parse ESLint JSON output and aggregate findings.

    Returns a dict with rule counts, filtering out noise.
    """
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
    except Exception:
        return None

    if not data or not data[0].get('messages'):
        return {"total": 0, "meaningful": 0, "rules": {}, "banned_terms": {}}

    messages = data[0]['messages']
    rule_counts = {}
    banned_terms = {}
    meaningful_count = 0

    for msg in messages:
        rule_id = msg.get('ruleId', '')
        if not rule_id or rule_id not in ESLINT_RULES:
            continue

        if rule_id == 'powerbi-visuals/no-banned-terms':
            # Parse which term was banned
            term_match = re.search(r'banned term: (\w+)', msg.get('message', ''))
            term = term_match.group(1) if term_match else 'unknown'
            banned_terms[term] = banned_terms.get(term, 0) + 1

            if term in NOISE_BANNED_TERMS:
                continue  # Skip 'arguments' etc. -- normal in compiled code

        rule_counts[rule_id] = rule_counts.get(rule_id, 0) + 1
        meaningful_count += 1

    return {
        "total": len(messages),
        "meaningful": meaningful_count,
        "rules": rule_counts,
        "banned_terms": banned_terms,
    }


def scan_single_visual(args):
    """Beautify and lint a single visual's internal.js."""
    extracted_path, folder = args
    folder_path = os.path.abspath(os.path.join(extracted_path, folder))
    js_path = os.path.join(folder_path, 'internal.js')

    simple_name, guid, version = parse_folder_name(folder)
    if not guid:
        guid = get_guid_from_json(folder_path)

    row = {
        "Folder": folder,
        "Simple Name": simple_name,
        "Visual GUID": guid,
        "Version": version,
        "ESLint Total": 0,
        "ESLint Meaningful": 0,
        "ESLint Error": "",
    }
    for col in CSV_COLUMNS:
        if col not in row:
            row[col] = 0

    if not os.path.exists(js_path):
        row["ESLint Error"] = "No internal.js"
        return row

    # Use temp files for beautified JS and ESLint output.
    # ESLint requires the file to be inside its base path (TOOLS_DIR),
    # so we create temp files there and clean up after.
    try:
        beautified_path = os.path.join(TOOLS_DIR, f"_scan_{os.getpid()}_{id(folder)}.js")
        lint_output_path = beautified_path.replace('.js', '_lint.json')

        # Step 1: Beautify
        if not beautify_js(js_path, beautified_path):
            row["ESLint Error"] = "Beautify failed"
            return row

        # Step 2: Run ESLint
        if not run_eslint(beautified_path, lint_output_path):
            row["ESLint Error"] = "ESLint failed"
            return row

        # Step 3: Parse results
        results = parse_eslint_results(lint_output_path)
        if results is None:
            row["ESLint Error"] = "Parse failed"
            return row

        row["ESLint Total"] = results["total"]
        row["ESLint Meaningful"] = results["meaningful"]

        # Map rule counts to CSV columns
        rule_to_col = {
            "powerbi-visuals/no-banned-terms": "no-banned-terms (excl. arguments)",
            "powerbi-visuals/no-document-domain": "no-document-domain",
            "powerbi-visuals/no-document-write": "no-document-write",
            "powerbi-visuals/no-http-string": "no-http-string",
            "powerbi-visuals/no-implied-inner-html": "no-implied-inner-html",
            "powerbi-visuals/no-inner-outer-html": "no-inner-outer-html",
            "powerbi-visuals/no-string-based-set-immediate": "no-string-based-set-immediate",
            "powerbi-visuals/non-literal-fs-path": "non-literal-fs-path",
            "powerbi-visuals/non-literal-require": "non-literal-require",
            "powerbi-visuals/insecure-random": "insecure-random",
        }
        for rule_id, col_name in rule_to_col.items():
            row[col_name] = results["rules"].get(rule_id, 0)

        # Banned terms detail (excluding 'arguments')
        meaningful_terms = {k: v for k, v in results["banned_terms"].items()
                          if k not in NOISE_BANNED_TERMS}
        if meaningful_terms:
            row["Banned Terms Detail"] = "; ".join(
                f"{k}: {v}" for k, v in sorted(meaningful_terms.items(), key=lambda x: -x[1]))

    finally:
        # Cleanup temp files
        for path in [beautified_path, lint_output_path]:
            try:
                os.unlink(path)
            except Exception:
                pass

    return row


def main():
    workspace_path = os.getcwd()
    extracted_path = os.path.join(workspace_path, "Extracted")
    output_path = os.path.join(workspace_path, "eslint_scan_results.csv")

    if not os.path.isdir(extracted_path):
        logger.error(f"Extracted directory not found: {extracted_path}")
        return

    # Verify Node.js dependencies are installed
    node_modules = os.path.join(TOOLS_DIR, 'node_modules')
    if not os.path.isdir(node_modules):
        logger.error(f"Node modules not found at {node_modules}. Run: cd \"{TOOLS_DIR}\" && npm install")
        return

    folders = [f for f in os.listdir(extracted_path)
               if os.path.isdir(os.path.join(extracted_path, f))]
    logger.info(f"Found {len(folders)} extracted visual folders to scan")

    results = []
    total = len(folders)
    completed = 0
    error_count = 0

    args_list = [(extracted_path, folder) for folder in folders]

    # Use ThreadPoolExecutor (not Process) since we're calling subprocess
    max_workers = min(os.cpu_count() or 4, 6)  # Slightly fewer for I/O-heavy work
    logger.info(f"Scanning with {max_workers} workers...")
    logger.info("This scan beautifies and lints each visual -- expect ~10s per visual")

    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(scan_single_visual, args): args[1]
                   for args in args_list}

        for future in as_completed(futures):
            completed += 1
            if completed % 50 == 0 or completed == total:
                logger.info(f"Scanned {completed}/{total} ({100*completed/total:.1f}%) "
                           f"[{error_count} errors]")
            try:
                row = future.result()
                if row:
                    results.append(row)
                    if row.get("ESLint Error"):
                        error_count += 1
            except Exception as e:
                folder_name = futures[future]
                logger.error(f"Error scanning {folder_name}: {e}")
                error_count += 1

    # Write results
    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        for row in sorted(results, key=lambda r: r.get("Folder", "")):
            writer.writerow(row)

    logger.info(f"Wrote {len(results)} results to {output_path}")

    # Summary
    total_meaningful = sum(r.get("ESLint Meaningful", 0) for r in results)
    visuals_with_findings = sum(1 for r in results if r.get("ESLint Meaningful", 0) > 0)

    logger.info("=== ESLint Scan Summary ===")
    logger.info(f"  Total visuals scanned: {len(results)}")
    logger.info(f"  Visuals with meaningful findings: {visuals_with_findings}")
    logger.info(f"  Total meaningful findings: {total_meaningful}")
    logger.info(f"  Errors: {error_count}")

    # Per-rule summary
    for col in CSV_COLUMNS:
        if col.startswith("no-") or col.startswith("non-") or col == "insecure-random":
            rule_total = sum(r.get(col, 0) for r in results)
            rule_visuals = sum(1 for r in results if r.get(col, 0) > 0)
            if rule_total > 0:
                logger.info(f"  {col}: {rule_visuals} visuals, {rule_total} findings")


if __name__ == "__main__":
    main()
