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

# Security scanner for Power BI custom visuals extracted from AppSource.
#
# This scanner analyzes compiled webpack bundles (internal.js) and metadata
# (cleaned.json) from Power BI custom visuals. It detects patterns that
# Microsoft's certification process checks:
#   https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified
#
# IMPORTANT: Microsoft's certification runs eslint-plugin-powerbi-visuals
# on the TypeScript SOURCE code, not on compiled bundles. Our scanner works
# on compiled bundles, which merge the visual's code with all dependencies.
# This means patterns like innerHTML, Function(), XMLHttpRequest will appear
# from bundled libraries (d3, jQuery, core-js, webpack runtime), NOT from
# the visual author's code.
#
# To handle this, the scanner uses two tiers of analysis:
#   Tier 1 (Reliable): Privilege declarations from cleaned.json -- these are
#     authored by the visual developer and reliably indicate capabilities.
#   Tier 2 (Context-aware): Code pattern detection with library-exclusion
#     zones -- identifies known library banners/signatures and suppresses
#     matches that fall within library code regions.
#
# Microsoft certification policies enforced by eslint-plugin-powerbi-visuals:
#   Policy 1200.1.2 -- Code quality (ESLint must pass)
#   Policy 1200.1.3 -- Code security (no eval, no XSS vectors, no CSP bypass)
#   eslint rules: no-banned-terms, no-document-domain, no-document-write,
#     no-http-string, no-implied-inner-html, no-inner-outer-html,
#     no-string-based-set-immediate, non-literal-fs-path, non-literal-require,
#     insecure-random, mocha-avoid-only

import os
import re
import csv
import json
import logging
import sys
from concurrent.futures import ProcessPoolExecutor, as_completed

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

# ---------------------------------------------------------------------------
# Known library fingerprints for false-positive exclusion
# ---------------------------------------------------------------------------
# When a match falls within LIBRARY_CONTEXT_RADIUS characters of one of these
# known library signatures, it is classified as "library" rather than "author".
# This is a conservative approach: if in doubt, attribute to the library.

LIBRARY_CONTEXT_RADIUS = 1500  # chars to search around each match

# Patterns that identify known library code regions in minified bundles
LIBRARY_FINGERPRINTS = [
    # Webpack runtime
    r'__webpack_require__', r'__webpack_modules__', r'__webpack_exports__',
    r'webpackBootstrap', r'webpack/runtime',
    # d3 library family
    r'd3-selection', r'd3\.select', r'd3\.scaleLinear', r'd3-fetch', r'd3-request',
    # jQuery
    r'jQuery\s+v[\d.]', r'\$\.fn\.jquery', r'jQuery\.fn\.init',
    # React / ReactDOM
    r'react\.production', r'ReactDOM', r'React\.createElement',
    # Lodash
    r'lodash\.js', r'lodash v[\d.]',
    # core-js / Babel polyfills
    r'core-js', r'regeneratorRuntime', r'regenerator-runtime',
    # Moment.js
    r'momentjs\.com', r'moment\.version',
    # PapaParse (CSV parser)
    r'PapaParse', r'Papa\.parse',
    # Froala Editor
    r'froala', r'FroalaEditor', r'fr-marker',
    # Monaco Editor / Ace Editor
    r'monaco-editor', r'MonacoEnvironment', r'ace/mode',
    # Vega
    r'vega-lite', r'vega\.version', r'vega-embed',
    # DOMPurify (sanitizer -- safe innerHTML usage)
    r'DOMPurify', r'purify\.min',
    # ECharts
    r'echarts\.init', r'ECharts',
    # Plotly.js
    r'Plotly\.newPlot', r'plotly\.js',
    # Mapbox GL
    r'mapboxgl', r'mapbox-gl',
    # Leaflet
    r'leafletjs\.com', r'L\.tileLayer',
    # FileSaver.js
    r'FileSaver', r'saveAs',
    # Highcharts
    r'Highcharts', r'Highstock',
    # Bootstrap
    r'Bootstrap\s+v[\d.]',
    # ag-Grid
    r'ag-grid', r'AG Grid',
    # CodeMirror
    r'CodeMirror',
    # Quill editor
    r'quilljs\.com', r'Quill',
    # jsrsasign
    r'jsrsasign', r'KJUR',
    # PowerBI Visuals Utils (Microsoft's own library)
    r'powerbi-visuals-utils', r'powerbi-visuals-tools',
    # Globalize
    r'Globalize',
    # TopoJSON
    r'topojson',
    # NVD3
    r'nv\.d3',
    # flexsearch
    r'flexsearch',
    # es-abstract / function-bind polyfill
    r'es-abstract', r'function-bind',
    # Syncfusion
    r'ej\.core', r'syncfusion',
    # DevExtreme
    r'DevExpress', r'devextreme',
    # Known safe patterns for Function()
    r'Function\("return this"\)', r'Function\("r","regeneratorRuntime',
    # Known safe patterns for innerHTML (sanitized usage)
    r'DOMPurify\.sanitize', r'sanitize\(',
]

# Compile library fingerprint patterns for performance
_LIBRARY_RE = [re.compile(p, re.IGNORECASE) for p in LIBRARY_FINGERPRINTS]

# ---------------------------------------------------------------------------
# Security check definitions -- Tier 2 (code pattern detection)
# ---------------------------------------------------------------------------
# Severity levels reflect what Microsoft's certification actually blocks:
#   - "Certification Blocker" = pattern forbidden for certified visuals
#   - "Security Concern" = pattern raises security questions
#   - "Informational" = noteworthy but not a policy violation
#
# All checks include library-aware context filtering.

SECURITY_CHECKS = [
    # Certification blockers (Microsoft policy 1200.1.3)
    {"id": "SEC-001", "name": "eval()", "severity": "Certification Blocker",
     "pattern": r'\beval\s*\(',
     "description": "Dynamic code execution via eval() -- forbidden by eslint no-banned-terms rule"},
    {"id": "SEC-002", "name": "Function()", "severity": "Certification Blocker",
     "pattern": r'(?<!\.)\bFunction\s*\(',
     "description": "Dynamic code execution via Function constructor"},
    {"id": "SEC-003", "name": "XMLHttpRequest", "severity": "Certification Blocker",
     "pattern": r'\bXMLHttpRequest\b',
     "description": "Network access via XMLHttpRequest -- forbidden for certified visuals"},
    {"id": "SEC-004", "name": "fetch()", "severity": "Certification Blocker",
     "pattern": r'(?<![.\w])fetch\s*\(',
     "description": "Network access via fetch API -- forbidden for certified visuals"},
    {"id": "SEC-005", "name": "WebSocket", "severity": "Certification Blocker",
     "pattern": r'\bnew\s+WebSocket\b',
     "description": "Network access via WebSocket -- forbidden for certified visuals"},
    {"id": "SEC-006", "name": "document.write()", "severity": "Certification Blocker",
     "pattern": r'\bdocument\.write\s*\(',
     "description": "Unsafe DOM manipulation -- forbidden by eslint no-document-write rule"},
    # Security concerns
    {"id": "SEC-007", "name": "innerHTML =", "severity": "Security Concern",
     "pattern": r'\.innerHTML\s*[+]?=',
     "description": "Direct innerHTML assignment -- forbidden by eslint no-inner-outer-html rule unless sanitized"},
    {"id": "SEC-008", "name": "outerHTML =", "severity": "Security Concern",
     "pattern": r'\.outerHTML\s*[+]?=',
     "description": "outerHTML assignment -- forbidden by eslint no-inner-outer-html rule"},
    {"id": "SEC-009", "name": ".html(data)", "severity": "Security Concern",
     "pattern": r'\.html\s*\([^)]+\)',
     "description": "jQuery/D3 .html() with arguments -- forbidden by eslint no-implied-inner-html rule"},
    {"id": "SEC-010", "name": "setTimeout(string)", "severity": "Security Concern",
     "pattern": r'\bsetTimeout\s*\(\s*["\']',
     "description": "setTimeout with string argument -- acts like eval()"},
    {"id": "SEC-011", "name": "setInterval(string)", "severity": "Security Concern",
     "pattern": r'\bsetInterval\s*\(\s*["\']',
     "description": "setInterval with string argument -- acts like eval()"},
    # Informational
    {"id": "SEC-012", "name": "document.domain", "severity": "Informational",
     "pattern": r'\bdocument\.domain\b',
     "description": "document.domain access -- flagged by eslint no-document-domain rule"},
    {"id": "SEC-013", "name": "document.cookie", "severity": "Informational",
     "pattern": r'\bdocument\.cookie\b',
     "description": "Cookie access"},
    {"id": "SEC-014", "name": "http:// URL", "severity": "Informational",
     "pattern": r'["\']http://(?!localhost|127\.0\.0\.1|www\.w3\.org)[^"\']{5,}["\']',
     "description": "Insecure HTTP URL -- flagged by eslint no-http-string rule"},
    {"id": "SEC-015", "name": "Math.random()", "severity": "Informational",
     "pattern": r'\bMath\.random\s*\(', "description": "Insecure random number generation"},
]

SEVERITY_WEIGHTS = {"Certification Blocker": 10, "Security Concern": 5, "Informational": 1}

# CSV output columns
CSV_COLUMNS = [
    "Folder", "Simple Name", "Visual GUID", "Version",
    "Is Certified", "Publisher", "API Version", "Popularity",
]
for check in SECURITY_CHECKS:
    CSV_COLUMNS.append(f"{check['id']} Total")
    CSV_COLUMNS.append(f"{check['id']} Library")
    CSV_COLUMNS.append(f"{check['id']} Author")
CSV_COLUMNS.extend([
    "WebAccess", "WebAccess Wildcard", "WebAccess URLs",
    "ExportContent", "LocalStorage", "AADAuthentication",
    "All Privileges",
    "Has ExternalJS", "External JS Count",
    "Risk Score", "Risk Level",
])


def load_metadata(csv_path):
    """Load Custom Visuals.csv and index by Visual GUID."""
    metadata = {}
    try:
        with open(csv_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                guid = row.get('Visual GUID', '').strip()
                if guid:
                    metadata[guid] = row
    except Exception as e:
        logger.warning(f"Could not load metadata from {csv_path}: {e}")
    return metadata


def parse_folder_name(folder_name):
    """Extract simple_name, guid, version from folder name.

    Handles patterns:
      SimpleName{GUID32hex}.v1.v2.v3.v4
      Prefix.SimpleName{GUID32hex}.v1.v2.v3.v4
      SimpleName.v1.v2.v3.v4  (no GUID in name)
    """
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

    # Try to separate simple_name from GUID in name_parts
    # GUIDs are 32 hex chars, always at the end, preceded by a non-hex char or start
    guid_match = re.search(r'(?:^|[^A-Fa-f0-9])([A-Fa-f0-9]{32})$', name_parts)
    if guid_match:
        guid = guid_match.group(1)
        prefix_end = guid_match.start(1)
        simple_name = name_parts[:prefix_end].rstrip('.')
    else:
        guid = ''
        simple_name = name_parts

    return simple_name, guid, version


def is_library_context(content, match_pos, radius=LIBRARY_CONTEXT_RADIUS):
    """Check if a regex match position falls within a known library code region.

    Searches for library fingerprints within `radius` characters on each side
    of the match. If any library fingerprint is found nearby, the match is
    classified as library code (likely a false positive).
    """
    start = max(0, match_pos - radius)
    end = min(len(content), match_pos + radius)
    context = content[start:end]
    for lib_re in _LIBRARY_RE:
        if lib_re.search(context):
            return True
    return False


def scan_js_file(js_path):
    """Scan internal.js for security patterns with library-aware filtering.

    For each check, reports:
      total  = raw regex match count
      library = matches near known library fingerprints (false positives)
      author  = matches NOT near any known library (potential real findings)
    """
    try:
        with open(js_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
    except Exception as e:
        logger.warning(f"Could not read {js_path}: {e}")
        return {}

    results = {}
    for check in SECURITY_CHECKS:
        matches = list(re.finditer(check["pattern"], content))
        total = len(matches)

        if total == 0:
            results[check["id"]] = {"total": 0, "library": 0, "author": 0}
            continue

        library_count = 0
        author_count = 0
        for m in matches:
            if is_library_context(content, m.start()):
                library_count += 1
            else:
                author_count += 1

        results[check["id"]] = {
            "total": total, "library": library_count, "author": author_count
        }

    return results


def scan_privileges(cleaned_json_path):
    """Scan cleaned.json for privilege declarations.

    Returns a dict of privilege details.
    """
    priv_info = {
        "WebAccess": False, "WebAccess Wildcard": False, "WebAccess URLs": "",
        "ExportContent": False, "LocalStorage": False, "AADAuthentication": False,
        "All Privileges": "",
    }

    try:
        with open(cleaned_json_path, 'r', encoding='utf-8', errors='ignore') as f:
            data = json.load(f)
    except Exception:
        return priv_info

    privileges = data.get('capabilities', {}).get('privileges', [])
    priv_names = []
    for priv in privileges:
        name = priv.get('name', '')
        params = priv.get('parameters', [])
        priv_names.append(name)

        if name == 'WebAccess':
            priv_info["WebAccess"] = True
            if '*' in params:
                priv_info["WebAccess Wildcard"] = True
            else:
                priv_info["WebAccess URLs"] = "; ".join(params)
        elif name == 'ExportContent':
            priv_info["ExportContent"] = True
        elif name == 'LocalStorage':
            priv_info["LocalStorage"] = True
        elif name == 'AADAuthentication':
            priv_info["AADAuthentication"] = True

    priv_info["All Privileges"] = "; ".join(priv_names)
    return priv_info


def get_visual_metadata_from_json(cleaned_json_path):
    """Extract visual metadata from cleaned.json."""
    try:
        with open(cleaned_json_path, 'r', encoding='utf-8', errors='ignore') as f:
            data = json.load(f)
        visual = data.get('visual', {})
        author = data.get('author', {})
        return {
            'guid': visual.get('guid', ''),
            'name': visual.get('displayName', visual.get('name', '')),
            'version': visual.get('version', ''),
            'api_version': data.get('apiVersion', ''),
            'publisher': author.get('name', ''),
        }
    except Exception:
        return {}


def calculate_risk_score(js_findings, priv_info):
    """Calculate risk score based on AUTHOR-CODE matches only.

    Library matches are excluded from the score. Only patterns that
    could NOT be attributed to a known bundled library contribute.
    Privilege declarations (Tier 1) are the most reliable indicators.
    """
    score = 0

    # Tier 1: Privilege-based risk (most reliable)
    if priv_info.get("WebAccess Wildcard"):
        score += 8  # Wildcard WebAccess is a strong signal
    elif priv_info.get("WebAccess"):
        score += 3  # Scoped WebAccess is less concerning

    # Tier 2: Author-code pattern matches
    for check in SECURITY_CHECKS:
        cid = check["id"]
        result = js_findings.get(cid, {"author": 0})
        author_count = result.get("author", 0)
        if author_count > 0:
            weight = SEVERITY_WEIGHTS[check["severity"]]
            score += weight * min(author_count, 3)

    if score >= 25:
        level = "Critical"
    elif score >= 15:
        level = "High"
    elif score >= 8:
        level = "Medium"
    elif score >= 1:
        level = "Low"
    else:
        level = "Clean"

    return score, level


def scan_single_visual(args):
    """Scan a single visual folder."""
    extracted_path, folder, metadata = args

    folder_path = os.path.join(extracted_path, folder)
    if not os.path.isdir(folder_path):
        return None

    simple_name, guid_from_folder, version = parse_folder_name(folder)

    # Read metadata from cleaned.json
    cleaned_path = os.path.join(folder_path, 'cleaned.json')
    json_meta = get_visual_metadata_from_json(cleaned_path)

    guid = json_meta.get('guid', '') or guid_from_folder
    api_version = json_meta.get('api_version', '')
    publisher = json_meta.get('publisher', '')

    # Cross-reference with Custom Visuals.csv
    csv_meta = metadata.get(guid, {})
    is_certified = csv_meta.get('Is Certified', '').strip().lower() == 'certified'
    popularity = csv_meta.get('Popularity', '')
    if not publisher and csv_meta:
        publisher = csv_meta.get('Publisher', '')

    # Scan internal.js with library-aware filtering
    js_path = os.path.join(folder_path, 'internal.js')
    js_findings = {}
    if os.path.exists(js_path):
        js_findings = scan_js_file(js_path)

    # Scan privileges (Tier 1 -- most reliable)
    priv_info = scan_privileges(cleaned_path)

    # External JS -- read from cleaned.json (authoritative source)
    try:
        with open(cleaned_path, 'r', encoding='utf-8', errors='ignore') as f:
            cleaned_data = json.load(f)
        external_js_list = cleaned_data.get('externalJS', []) or []
    except Exception:
        external_js_list = []
    has_external_js = len(external_js_list) > 0
    external_js_count = len(external_js_list)

    # Calculate risk score (uses author-code matches only)
    score, level = calculate_risk_score(js_findings, priv_info)

    # Build row
    row = {
        "Folder": folder,
        "Simple Name": simple_name,
        "Visual GUID": guid,
        "Version": version,
        "Is Certified": "Yes" if is_certified else "No",
        "Publisher": publisher,
        "API Version": api_version,
        "Popularity": popularity,
    }

    for check in SECURITY_CHECKS:
        cid = check["id"]
        result = js_findings.get(cid, {"total": 0, "library": 0, "author": 0})
        row[f"{cid} Total"] = result["total"]
        row[f"{cid} Library"] = result["library"]
        row[f"{cid} Author"] = result["author"]

    row["WebAccess"] = "Yes" if priv_info["WebAccess"] else ""
    row["WebAccess Wildcard"] = "Yes" if priv_info["WebAccess Wildcard"] else ""
    row["WebAccess URLs"] = priv_info["WebAccess URLs"]
    row["ExportContent"] = "Yes" if priv_info["ExportContent"] else ""
    row["LocalStorage"] = "Yes" if priv_info["LocalStorage"] else ""
    row["AADAuthentication"] = "Yes" if priv_info["AADAuthentication"] else ""
    row["All Privileges"] = priv_info["All Privileges"]
    row["Has ExternalJS"] = "Yes" if has_external_js else ""
    row["External JS Count"] = external_js_count
    row["Risk Score"] = score
    row["Risk Level"] = level

    return row


def write_results_csv(results, output_path):
    """Write scan results to CSV."""
    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        for row in sorted(results, key=lambda r: r.get("Folder", "")):
            writer.writerow(row)


def main():
    workspace_path = os.getcwd()
    extracted_path = os.path.join(workspace_path, "Extracted")
    csv_path = os.path.join(workspace_path, "Custom Visuals.csv")
    output_path = os.path.join(workspace_path, "security_scan_results.csv")

    if not os.path.isdir(extracted_path):
        logger.error(f"Extracted directory not found: {extracted_path}")
        return

    metadata = load_metadata(csv_path)
    logger.info(f"Loaded metadata for {len(metadata)} visuals from Custom Visuals.csv")

    folders = [f for f in os.listdir(extracted_path)
               if os.path.isdir(os.path.join(extracted_path, f))]
    logger.info(f"Found {len(folders)} extracted visual folders to scan")

    results = []
    total = len(folders)
    completed = 0

    args_list = [(extracted_path, folder, metadata) for folder in folders]

    max_workers = min(os.cpu_count() or 4, 8)
    logger.info(f"Scanning with {max_workers} workers...")

    with ProcessPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(scan_single_visual, args): args[1]
                   for args in args_list}

        for future in as_completed(futures):
            completed += 1
            if completed % 200 == 0 or completed == total:
                logger.info(f"Scanned {completed}/{total} ({100*completed/total:.1f}%)")
            try:
                row = future.result()
                if row:
                    results.append(row)
            except Exception as e:
                folder_name = futures[future]
                logger.error(f"Error scanning {folder_name}: {e}")

    write_results_csv(results, output_path)
    logger.info(f"Wrote {len(results)} results to {output_path}")

    # Print summary
    level_counts = {}
    for r in results:
        lvl = r.get("Risk Level", "Unknown")
        level_counts[lvl] = level_counts.get(lvl, 0) + 1

    logger.info("=== Risk Level Summary ===")
    for lvl in ["Critical", "High", "Medium", "Low", "Clean"]:
        count = level_counts.get(lvl, 0)
        pct = 100 * count / len(results) if results else 0
        logger.info(f"  {lvl:10s}: {count:5d} ({pct:.1f}%)")

    # Author-code findings summary
    for check in SECURITY_CHECKS:
        cid = check["id"]
        author_total = sum(int(r.get(f"{cid} Author", 0) or 0) for r in results)
        library_total = sum(int(r.get(f"{cid} Library", 0) or 0) for r in results)
        visuals_with = sum(1 for r in results if int(r.get(f"{cid} Author", 0) or 0) > 0)
        if author_total > 0 or library_total > 0:
            logger.info(f"  {check['name']:22s}: {visuals_with:4d} visuals "
                        f"(author: {author_total:5d}, library: {library_total:5d})")


if __name__ == "__main__":
    main()
