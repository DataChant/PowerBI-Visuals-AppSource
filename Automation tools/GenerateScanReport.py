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

# Report generator for Power BI custom visual security and OSS scans.
#
# Produces a tiered output designed by stakeholder panel:
#   Tier 1: security_scan_summary.md -- Executive summary (~35 KB), GitHub Discussion-ready
#   Tier 2: visual_security_scores.csv -- One row per visual, 25 human-readable columns
#   Tier 3: security_findings_detail.csv -- One row per finding per visual, for power users
#   Tier 4: oss_licenses.csv -- One row per library per visual, for compliance teams
#
# Key design principles:
#   - Latest version only (no version-per-row noise)
#   - Sorted by popularity (most impactful first)
#   - Human-readable column names throughout
#   - Author vs library distinction drives scoring
#   - Certification status prominently displayed

import csv
import json
import logging
import os
import sys
from concurrent.futures import ProcessPoolExecutor, as_completed
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ScanOSS import LIBRARY_SIGNATURES, scan_oss_content
from ScanSecurity import (
    scan_js_content, scan_privileges_data, get_metadata_from_data,
    calculate_risk_score, parse_folder_name, load_metadata,
    SECURITY_CHECKS, CSV_COLUMNS as SECURITY_CSV_COLUMNS,
)

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
# Pattern categories -- group 15 individual SEC checks into 5 categories
# ---------------------------------------------------------------------------
PATTERN_CATEGORIES = {
    "Dynamic Code Execution": {
        "checks": ["SEC-001", "SEC-002", "SEC-010", "SEC-011"],
        "description": "eval(), Function(), setTimeout/setInterval with strings",
        "severity": "High",
    },
    "Network Access": {
        "checks": ["SEC-003", "SEC-004", "SEC-005"],
        "description": "XMLHttpRequest, fetch(), WebSocket",
        "severity": "High",
    },
    "DOM Manipulation": {
        "checks": ["SEC-006", "SEC-007", "SEC-008", "SEC-009"],
        "description": "innerHTML, outerHTML, document.write(), .html()",
        "severity": "Medium",
    },
    "Sensitive Access": {
        "checks": ["SEC-012", "SEC-013"],
        "description": "document.domain, document.cookie",
        "severity": "Medium",
    },
    "Informational": {
        "checks": ["SEC-014", "SEC-015"],
        "description": "HTTP URLs, Math.random()",
        "severity": "Low",
    },
}

# Individual pattern names for the findings detail CSV
PATTERN_NAMES = {
    "SEC-001": ("eval()", "Dynamic Code Execution", "no-banned-terms"),
    "SEC-002": ("Function()", "Dynamic Code Execution", "no-banned-terms"),
    "SEC-003": ("XMLHttpRequest", "Network Access", "(certification requirement)"),
    "SEC-004": ("fetch()", "Network Access", "(certification requirement)"),
    "SEC-005": ("WebSocket", "Network Access", "(certification requirement)"),
    "SEC-006": ("document.write()", "DOM Manipulation", "no-document-write"),
    "SEC-007": ("innerHTML =", "DOM Manipulation", "no-inner-outer-html"),
    "SEC-008": ("outerHTML =", "DOM Manipulation", "no-inner-outer-html"),
    "SEC-009": (".html(data)", "DOM Manipulation", "no-implied-inner-html"),
    "SEC-010": ("setTimeout(string)", "Dynamic Code Execution", "no-string-based-set-immediate"),
    "SEC-011": ("setInterval(string)", "Dynamic Code Execution", "no-string-based-set-immediate"),
    "SEC-012": ("document.domain", "Sensitive Access", "no-document-domain"),
    "SEC-013": ("document.cookie", "Sensitive Access", "no-banned-terms"),
    "SEC-014": ("http:// URL", "Informational", "no-http-string"),
    "SEC-015": ("Math.random()", "Informational", "insecure-random"),
}

RISK_LABELS = {
    "Critical": "High", "High": "High", "Medium": "Medium", "Low": "Low", "Clean": "None"
}

DISCLAIMER = (
    "This scan uses [eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals), "
    "the same MIT-licensed ESLint plugin that Microsoft requires for AppSource certification "
    "([Policy 1200.1.2](https://learn.microsoft.com/en-us/legal/marketplace/certification-policies"
    "#1200-power-bi-visuals-additional-certification)). "
    "Detected patterns represent code constructs flagged by Microsoft's certification process. "
    "**Their presence does not indicate a security vulnerability.** "
    "Many patterns originate from bundled open-source libraries. "
    "This project is not affiliated with Microsoft Corporation."
)


# ---------------------------------------------------------------------------
# Data processing
# ---------------------------------------------------------------------------

def compare_versions(v1, v2):
    try:
        p1 = [int(x) for x in v1.split('.')]
        p2 = [int(x) for x in v2.split('.')]
        for a, b in zip(p1, p2):
            if a != b:
                return a - b
        return len(p1) - len(p2)
    except (ValueError, AttributeError):
        return 0


def get_category_author_count(row, category_name):
    """Sum author-code findings for all checks in a category."""
    cat = PATTERN_CATEGORIES[category_name]
    total = 0
    for check_id in cat["checks"]:
        total += int(row.get(f"{check_id} Author", 0) or 0)
    return total


def build_visual_data(security_rows, oss_index, metadata):
    """Build one enriched record per visual (latest version), with version history."""
    # Group by GUID
    by_guid = {}
    for row in security_rows:
        guid = row.get("Visual GUID", "")
        if not guid:
            continue
        if guid not in by_guid:
            by_guid[guid] = []
        by_guid[guid].append(row)

    # Sort versions and pick latest
    visuals = []
    for guid, versions in by_guid.items():
        versions.sort(key=lambda x: [int(p) for p in x.get("Version", "0.0.0.0").split('.')]
                      if all(p.isdigit() for p in x.get("Version", "0").split('.')) else [0])
        latest = versions[-1]
        folder = latest.get("Folder", "")
        meta = metadata.get(guid, {})
        oss = oss_index.get(folder, {})

        # Compute resolved patterns (was in previous version, not in latest)
        resolved = []
        if len(versions) >= 2:
            prev = versions[-2]
            for check_id, (name, cat, rule) in PATTERN_NAMES.items():
                prev_count = int(prev.get(f"{check_id} Author", 0) or 0)
                curr_count = int(latest.get(f"{check_id} Author", 0) or 0)
                if prev_count > 0 and curr_count == 0:
                    resolved.append(name)

        # Category counts
        cat_counts = {}
        for cat_name in PATTERN_CATEGORIES:
            cat_counts[cat_name] = get_category_author_count(latest, cat_name)

        author_total = sum(cat_counts.values())
        library_total = sum(int(latest.get(f"{cid} Library", 0) or 0)
                           for cid in PATTERN_NAMES)

        # Risk level (simplified: High/Medium/Low/None)
        raw_level = latest.get("Risk Level", "Clean")
        risk_level = RISK_LABELS.get(raw_level, "None")

        visual = {
            "Visual Name": meta.get("Name", latest.get("Simple Name", "")),
            "Publisher": meta.get("Publisher", latest.get("Publisher", "")),
            "GUID": guid,
            "Latest Version": latest.get("Version", ""),
            "Is Certified": latest.get("Is Certified", "No") == "Yes",
            "Popularity": float(latest.get("Popularity", 0) or 0),
            "Risk Level": risk_level,
            "Risk Score": int(latest.get("Risk Score", 0) or 0),
            "Author Findings": author_total,
            "Library Findings": library_total,
            "Dynamic Code (Author)": cat_counts.get("Dynamic Code Execution", 0),
            "Network Access (Author)": cat_counts.get("Network Access", 0),
            "DOM Manipulation (Author)": cat_counts.get("DOM Manipulation", 0),
            "Sensitive Access (Author)": cat_counts.get("Sensitive Access", 0),
            "Informational (Author)": cat_counts.get("Informational", 0),
            "Web Access Permission": latest.get("WebAccess", "") == "Yes",
            "Export Content Permission": latest.get("ExportContent", "") == "Yes",
            "Local Storage Permission": latest.get("LocalStorage", "") == "Yes",
            "AAD Auth Permission": latest.get("AADAuthentication", "") == "Yes",
            "External JS Count": int(latest.get("External JS Count", 0) or 0),
            "Detected Libraries": oss.get("Detected Libraries", ""),
            "API Version": latest.get("API Version", ""),
            "Has GPL License": oss.get("Has GPL", "No") == "Yes",
            "Versions Scanned": len(versions),
            "Findings Resolved in Latest": len(resolved),
            # Extra fields for report generation (not in CSV)
            "_resolved_names": resolved,
            "_raw_row": latest,
            "_meta": meta,
            "_folder": folder,
            "_oss": oss,
        }
        visuals.append(visual)

    # Sort by popularity descending
    visuals.sort(key=lambda v: (-v["Popularity"], v["Visual Name"]))
    return visuals


def build_findings_detail(visuals):
    """Build one row per finding per visual for the detail CSV."""
    findings = []
    for v in visuals:
        row = v["_raw_row"]
        for check_id, (name, category, eslint_rule) in PATTERN_NAMES.items():
            author = int(row.get(f"{check_id} Author", 0) or 0)
            library = int(row.get(f"{check_id} Library", 0) or 0)
            if author > 0:
                findings.append({
                    "GUID": v["GUID"],
                    "Visual Name": v["Visual Name"],
                    "Latest Version": v["Latest Version"],
                    "Is Certified": v["Is Certified"],
                    "Popularity": v["Popularity"],
                    "Finding Category": category,
                    "Finding Pattern": name,
                    "Detection Method": "Regex",
                    "ESLint Rule": eslint_rule,
                    "Code Origin": "Author",
                    "Library Name": "",
                    "Occurrence Count": author,
                    "Severity": PATTERN_CATEGORIES[category]["severity"],
                    "Present in Prior Version": "",
                })
            if library > 0:
                findings.append({
                    "GUID": v["GUID"],
                    "Visual Name": v["Visual Name"],
                    "Latest Version": v["Latest Version"],
                    "Is Certified": v["Is Certified"],
                    "Popularity": v["Popularity"],
                    "Finding Category": category,
                    "Finding Pattern": name,
                    "Detection Method": "Regex",
                    "ESLint Rule": eslint_rule,
                    "Code Origin": "Library",
                    "Library Name": "(bundled)",
                    "Occurrence Count": library,
                    "Severity": PATTERN_CATEGORIES[category]["severity"],
                    "Present in Prior Version": "",
                })
    return findings


def build_oss_detail(visuals):
    """Build one row per library per visual for the license CSV."""
    rows = []
    for v in visuals:
        libs_str = v.get("Detected Libraries", "")
        if not libs_str:
            continue
        licenses_str = v["_oss"].get("Licenses Found", "")
        for lib_name in libs_str.split("; "):
            lib_name = lib_name.strip()
            if not lib_name:
                continue
            # Find known license for this library
            known_license = ""
            for sig in LIBRARY_SIGNATURES:
                if sig["name"] == lib_name:
                    known_license = sig["license"]
                    break
            is_gpl = "GPL" in known_license.upper()
            rows.append({
                "GUID": v["GUID"],
                "Visual Name": v["Visual Name"],
                "Latest Version": v["Latest Version"],
                "Library Name": lib_name,
                "Library Version": "",
                "License Type": known_license,
                "Is GPL Family": is_gpl,
                "Is Certified": v["Is Certified"],
                "Popularity": v["Popularity"],
            })
    return rows


# ---------------------------------------------------------------------------
# Output writers
# ---------------------------------------------------------------------------

SCORES_COLUMNS = [
    "Visual Name", "Publisher", "GUID", "Latest Version",
    "Is Certified", "Popularity", "Risk Level", "Risk Score",
    "Author Findings", "Library Findings",
    "Dynamic Code (Author)", "Network Access (Author)",
    "DOM Manipulation (Author)", "Sensitive Access (Author)", "Informational (Author)",
    "Web Access Permission", "Export Content Permission",
    "Local Storage Permission", "AAD Auth Permission",
    "External JS Count", "Detected Libraries", "API Version",
    "Has GPL License", "Versions Scanned", "Findings Resolved in Latest",
]

FINDINGS_COLUMNS = [
    "GUID", "Visual Name", "Latest Version", "Is Certified", "Popularity",
    "Finding Category", "Finding Pattern", "Detection Method", "ESLint Rule",
    "Code Origin", "Library Name", "Occurrence Count", "Severity",
    "Present in Prior Version",
]

OSS_COLUMNS = [
    "GUID", "Visual Name", "Latest Version", "Library Name",
    "Library Version", "License Type", "Is GPL Family",
    "Is Certified", "Popularity",
]


def write_csv(rows, columns, path):
    with open(path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction='ignore')
        writer.writeheader()
        for row in rows:
            writer.writerow(row)
    logger.info(f"Wrote {len(rows)} rows to {path}")


def write_summary_markdown(visuals, scan_date, total_versions, path):
    """Write the executive summary markdown (~35 KB target)."""

    total = len(visuals)
    certified = [v for v in visuals if v["Is Certified"]]
    uncertified = [v for v in visuals if not v["Is Certified"]]

    # Risk counts
    risk_counts = {"High": 0, "Medium": 0, "Low": 0, "None": 0}
    cert_risk = {"High": 0, "Medium": 0, "Low": 0, "None": 0}
    uncert_risk = {"High": 0, "Medium": 0, "Low": 0, "None": 0}
    for v in visuals:
        lvl = v["Risk Level"]
        risk_counts[lvl] = risk_counts.get(lvl, 0) + 1
        if v["Is Certified"]:
            cert_risk[lvl] = cert_risk.get(lvl, 0) + 1
        else:
            uncert_risk[lvl] = uncert_risk.get(lvl, 0) + 1

    resolved_count = sum(v["Findings Resolved in Latest"] for v in visuals)
    resolved_visuals = sum(1 for v in visuals if v["Findings Resolved in Latest"] > 0)

    with open(path, 'w', encoding='utf-8') as f:
        f.write(f"# Power BI Custom Visuals Security Scan -- {scan_date}\n\n")
        f.write(f"> {DISCLAIMER}\n\n")

        # Key statistics
        f.write("## Key Statistics\n\n")
        f.write(f"| Metric | Count |\n")
        f.write(f"|--------|-------|\n")
        f.write(f"| Visuals scanned | {total} |\n")
        f.write(f"| Versions analyzed | {total_versions} |\n")
        f.write(f"| Certified visuals | {len(certified)} |\n")
        f.write(f"| Uncertified visuals | {len(uncertified)} |\n")
        if resolved_count:
            f.write(f"| Visuals that resolved patterns in latest version | {resolved_visuals} |\n")
        f.write("\n")

        # Risk by certification
        f.write("## Findings by Certification Status\n\n")
        f.write("| Finding Level | Certified | Uncertified | Total |\n")
        f.write("|--------------|-----------|-------------|-------|\n")
        for lvl in ["High", "Medium", "Low", "None"]:
            c = cert_risk.get(lvl, 0)
            u = uncert_risk.get(lvl, 0)
            t = risk_counts.get(lvl, 0)
            pct = f" ({100*t//total}%)" if total else ""
            f.write(f"| {lvl} | {c} | {u} | {t}{pct} |\n")
        f.write(f"| **Total** | **{len(certified)}** | **{len(uncertified)}** | **{total}** |\n\n")

        # Top 50 most popular visuals scorecard
        f.write("## Top 50 Most Popular Visuals -- Security Scorecard\n\n")
        f.write("| # | Visual | Publisher | Certified | Finding Level | Permissions | Key Patterns |\n")
        f.write("|---|--------|-----------|-----------|---------------|-------------|-------------|\n")
        for i, v in enumerate(visuals[:50], 1):
            cert = "Yes" if v["Is Certified"] else "No"
            perms = []
            if v["Web Access Permission"]:
                perms.append("WebAccess")
            if v["Export Content Permission"]:
                perms.append("Export")
            if v["Local Storage Permission"]:
                perms.append("Storage")
            if v["AAD Auth Permission"]:
                perms.append("AAD")
            perm_str = ", ".join(perms) if perms else "--"

            patterns = []
            if v["Dynamic Code (Author)"]:
                patterns.append(f"Dynamic Code: {v['Dynamic Code (Author)']}")
            if v["Network Access (Author)"]:
                patterns.append(f"Network: {v['Network Access (Author)']}")
            if v["DOM Manipulation (Author)"]:
                patterns.append(f"DOM: {v['DOM Manipulation (Author)']}")
            pattern_str = "; ".join(patterns[:2]) if patterns else "None"

            f.write(f"| {i} | {v['Visual Name']} | {v['Publisher']} | {cert} | "
                    f"{v['Risk Level']} | {perm_str} | {pattern_str} |\n")
        f.write("\n")

        # High risk visuals (sorted by popularity)
        high_risk = [v for v in visuals if v["Risk Level"] == "High"]
        if high_risk:
            f.write(f"## {len(high_risk)} Visuals with Multiple Patterns (by popularity)\n\n")

            # Split certified vs uncertified
            high_cert = [v for v in high_risk if v["Is Certified"]]
            high_uncert = [v for v in high_risk if not v["Is Certified"]]

            if high_cert:
                f.write(f"### {len(high_cert)} Certified Visuals\n\n")
                f.write("These visuals passed Microsoft's source code review. Patterns found in the compiled code ")
                f.write("most likely originate from bundled third-party libraries.\n\n")
                _write_visual_table(f, high_cert[:30])

            if high_uncert:
                f.write(f"### {len(high_uncert)} Uncertified Visuals (most popular first)\n\n")
                f.write("These visuals have not been reviewed by Microsoft. ")
                f.write("Sorted by popularity so you can assess the most widely-used visuals first.\n\n")
                _write_visual_table(f, high_uncert[:30])

        # Pattern glossary
        f.write("## What do these patterns mean?\n\n")
        f.write("| Category | Patterns Checked | What it means | Severity |\n")
        f.write("|----------|-----------------|---------------|----------|\n")
        for cat_name, cat_info in PATTERN_CATEGORIES.items():
            f.write(f"| {cat_name} | {cat_info['description']} | "
                    f"Flagged by Microsoft's certification rules | {cat_info['severity']} |\n")
        f.write("\n")
        f.write("*Counts reflect only patterns attributed to the visual's own code. "
                "Patterns from bundled libraries (d3, jQuery, React, etc.) are excluded where possible.*\n\n")

        # Methodology
        f.write("## How this scan works\n\n")
        f.write("1. We download all visual packages (.pbiviz) from Microsoft AppSource\n")
        f.write("2. We temporarily extract the compiled JavaScript (no code is stored or published)\n")
        f.write("3. We run the same [ESLint rules](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals) "
                "Microsoft requires for certification\n")
        f.write("4. We filter out patterns from known libraries (d3, jQuery, React, webpack, etc.)\n")
        f.write("5. We read the visual's declared permissions from metadata\n\n")
        f.write("Full methodology and column definitions: "
                "[Scanner User Guide](https://github.com/DataChant/PowerBI-Visuals-AppSource/blob/"
                "feature/security-scanning/Automation%20tools/scanner-user-guide.md)\n\n")
        f.write("Detailed CSV files: `visual_security_scores.csv`, `security_findings_detail.csv`, "
                "`oss_licenses.csv`\n")

    logger.info(f"Wrote summary to {path}")


def _write_visual_table(f, visuals):
    """Write a compact visual table for the summary report."""
    f.write("| Visual | Publisher | Popularity | Findings (Author) | Permissions | Libraries |\n")
    f.write("|--------|-----------|------------|-------------------|-------------|----------|\n")
    for v in visuals:
        pop = f"{v['Popularity']:.2f}" if v['Popularity'] else "--"
        perms = []
        if v["Web Access Permission"]:
            perms.append("Web")
        if v["Export Content Permission"]:
            perms.append("Export")
        perm_str = ", ".join(perms) if perms else "--"

        findings = []
        if v["Dynamic Code (Author)"]:
            findings.append(f"Code: {v['Dynamic Code (Author)']}")
        if v["Network Access (Author)"]:
            findings.append(f"Net: {v['Network Access (Author)']}")
        if v["DOM Manipulation (Author)"]:
            findings.append(f"DOM: {v['DOM Manipulation (Author)']}")
        finding_str = "; ".join(findings) if findings else "None"

        libs = v.get("Detected Libraries", "")
        lib_short = libs[:40] + "..." if len(libs) > 40 else libs
        if not lib_short:
            lib_short = "--"

        resolved = ""
        if v["Findings Resolved in Latest"]:
            resolved = f" 🟢-{v['Findings Resolved in Latest']}"

        f.write(f"| {v['Visual Name']}{resolved} | {v['Publisher']} | {pop} | "
                f"{finding_str} | {perm_str} | {lib_short} |\n")
    f.write("\n")


def write_scan_metadata(visuals, scan_date, total_versions, path):
    """Write machine-readable scan metadata JSON."""
    risk_counts = {}
    for v in visuals:
        lvl = v["Risk Level"]
        risk_counts[lvl] = risk_counts.get(lvl, 0) + 1

    cert_count = sum(1 for v in visuals if v["Is Certified"])
    cert_with_findings = sum(1 for v in visuals
                             if v["Is Certified"] and v["Risk Level"] != "None")

    meta = {
        "scan_date": scan_date,
        "scanner_version": "2.0.0",
        "visuals_scanned": len(visuals),
        "versions_analyzed": total_versions,
        "certified_visuals": cert_count,
        "uncertified_visuals": len(visuals) - cert_count,
        "certified_with_findings": cert_with_findings,
        "by_risk_level": risk_counts,
        "methodology": {
            "tool": "eslint-plugin-powerbi-visuals (MIT license)",
            "policy": "Microsoft Certification Policy 1200.1.2 and 1200.1.3",
            "library_filtering": "Patterns near known library signatures are excluded from scoring",
            "scoring": "Author-code findings only. High=10pts, Medium=5pts, Low=1pt. "
                       "WebAccess wildcard adds 8pts.",
        },
    }

    with open(path, 'w', encoding='utf-8') as f:
        json.dump(meta, f, indent=2)
    logger.info(f"Wrote metadata to {path}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def _scan_single_visual_unified(args):
    """Read files ONCE per visual, run both security and OSS scans on the content.

    This is the read-once optimization: instead of ScanSecurity reading internal.js
    and then ScanOSS reading it again (12+ GB total I/O), we read each file once
    and pass the content string to both scanners.
    """
    extracted_path, folder, metadata = args

    folder_path = os.path.join(extracted_path, folder)
    if not os.path.isdir(folder_path):
        return None, None

    simple_name, guid_from_folder, version = parse_folder_name(folder)

    # Read cleaned.json ONCE -- used by both scanners
    cleaned_path = os.path.join(folder_path, 'cleaned.json')
    cleaned_data = {}
    try:
        with open(cleaned_path, 'r', encoding='utf-8', errors='ignore') as f:
            cleaned_data = json.load(f)
    except Exception:
        pass

    json_meta = get_metadata_from_data(cleaned_data)
    guid = json_meta.get('guid', '') or guid_from_folder
    api_version = json_meta.get('api_version', '')
    publisher = json_meta.get('publisher', '')

    csv_meta = metadata.get(guid, {})
    is_certified = csv_meta.get('Is Certified', '').strip().lower() == 'certified'
    popularity = csv_meta.get('Popularity', '')
    if not publisher and csv_meta:
        publisher = csv_meta.get('Publisher', '')

    # Read internal.js ONCE -- shared by both scanners
    js_content = ''
    js_path = os.path.join(folder_path, 'internal.js')
    if os.path.exists(js_path):
        try:
            with open(js_path, 'r', encoding='utf-8', errors='ignore') as f:
                js_content = f.read()
        except Exception:
            pass

    # Read visual.css ONCE -- used by OSS scanner only
    css_content = ''
    css_path = os.path.join(folder_path, 'visual.css')
    if os.path.exists(css_path):
        try:
            with open(css_path, 'r', encoding='utf-8', errors='ignore') as f:
                css_content = f.read()
        except Exception:
            pass

    # --- Security scan (on pre-read js_content) ---
    js_findings = scan_js_content(js_content)
    priv_info = scan_privileges_data(cleaned_data)
    external_js_list = cleaned_data.get('externalJS', []) or []
    score, level = calculate_risk_score(js_findings, priv_info)

    sec_row = {
        "Folder": folder, "Simple Name": simple_name, "Visual GUID": guid,
        "Version": version, "Is Certified": "Yes" if is_certified else "No",
        "Publisher": publisher, "API Version": api_version, "Popularity": popularity,
    }
    for check in SECURITY_CHECKS:
        cid = check["id"]
        result = js_findings.get(cid, {"total": 0, "library": 0, "author": 0})
        sec_row[f"{cid} Total"] = result["total"]
        sec_row[f"{cid} Library"] = result["library"]
        sec_row[f"{cid} Author"] = result["author"]

    sec_row["WebAccess"] = "Yes" if priv_info["WebAccess"] else ""
    sec_row["WebAccess Wildcard"] = "Yes" if priv_info["WebAccess Wildcard"] else ""
    sec_row["WebAccess URLs"] = priv_info["WebAccess URLs"]
    sec_row["ExportContent"] = "Yes" if priv_info["ExportContent"] else ""
    sec_row["LocalStorage"] = "Yes" if priv_info["LocalStorage"] else ""
    sec_row["AADAuthentication"] = "Yes" if priv_info["AADAuthentication"] else ""
    sec_row["All Privileges"] = priv_info["All Privileges"]
    sec_row["Has ExternalJS"] = "Yes" if external_js_list else ""
    sec_row["External JS Count"] = len(external_js_list)
    sec_row["Risk Score"] = score
    sec_row["Risk Level"] = level

    # --- OSS scan (on same pre-read js_content + css_content) ---
    oss_row = scan_oss_content(js_content, css_content, cleaned_data,
                                folder, simple_name, guid, version)

    return sec_row, oss_row


def load_previous_scores(scores_csv_path):
    """Load the previous visual_security_scores.csv for diffing.

    Returns dict keyed by GUID -> row dict, or empty dict if file doesn't exist.
    """
    prev = {}
    if not os.path.exists(scores_csv_path):
        return prev
    try:
        with open(scores_csv_path, 'r', encoding='utf-8-sig') as f:
            for row in csv.DictReader(f):
                guid = row.get("GUID", "")
                if guid:
                    prev[guid] = row
    except Exception:
        pass
    return prev


def write_diff_markdown(visuals, previous_scores, scan_date, path):
    """Write a What's New security diff report comparing current vs previous scan.

    Categories:
      - New visuals scanned (not in previous)
      - Visuals that improved (lower risk or resolved findings)
      - Visuals that got worse (higher risk or new findings)
      - Certification changes
      - Removed visuals (in previous but not current)
    """
    RISK_ORDER = {"High": 3, "Medium": 2, "Low": 1, "None": 0}
    current_by_guid = {v["GUID"]: v for v in visuals}
    prev_guids = set(previous_scores.keys())
    curr_guids = set(current_by_guid.keys())

    new_visuals = []
    improved = []
    worsened = []
    newly_certified = []
    lost_certification = []
    removed_visuals = []

    # New visuals
    for guid in sorted(curr_guids - prev_guids):
        new_visuals.append(current_by_guid[guid])

    # Removed visuals
    for guid in sorted(prev_guids - curr_guids):
        removed_visuals.append(previous_scores[guid])

    # Changed visuals
    for guid in curr_guids & prev_guids:
        curr = current_by_guid[guid]
        prev = previous_scores[guid]

        curr_risk = RISK_ORDER.get(curr["Risk Level"], 0)
        prev_risk = RISK_ORDER.get(prev.get("Risk Level", "None"), 0)

        curr_cert = curr["Is Certified"]
        prev_cert = prev.get("Is Certified", "").lower() in ("true", "yes")

        if curr_cert and not prev_cert:
            newly_certified.append(curr)
        elif not curr_cert and prev_cert:
            lost_certification.append(curr)

        if curr_risk < prev_risk or curr.get("Findings Resolved in Latest", 0) > 0:
            improved.append(curr)
        elif curr_risk > prev_risk:
            worsened.append(curr)

    # Don't write if nothing changed
    total_changes = (len(new_visuals) + len(improved) + len(worsened) +
                     len(newly_certified) + len(lost_certification) + len(removed_visuals))
    if total_changes == 0 and previous_scores:
        logger.info("No security changes detected -- skipping diff report")
        # Write a minimal diff file
        with open(path, 'w', encoding='utf-8') as f:
            f.write(f"# Security Scan Diff -- {scan_date}\n\n")
            f.write("No changes detected since the previous scan.\n")
        return

    with open(path, 'w', encoding='utf-8') as f:
        # Title line matching SummarizeDiff.py style
        parts = []
        if new_visuals:
            parts.append(f"{len(new_visuals)} new visual{'s' if len(new_visuals) != 1 else ''}")
        if improved:
            parts.append(f"{len(improved)} improved")
        if worsened:
            parts.append(f"{len(worsened)} worsened")
        if newly_certified:
            parts.append(f"{len(newly_certified)} newly certified")
        if removed_visuals:
            parts.append(f"{len(removed_visuals)} removed")
        title_summary = ", ".join(parts) if parts else "no changes"

        f.write(f"# [{scan_date}] Security Scan: {title_summary}\n\n")
        f.write(f"> {DISCLAIMER}\n\n")

        if not previous_scores:
            f.write("*This is the first scan -- all visuals are listed as new.*\n\n")

        # New visuals scanned
        if new_visuals:
            # Sort by popularity descending
            new_visuals.sort(key=lambda v: (-v["Popularity"], v["Visual Name"]))
            f.write(f"## {len(new_visuals)} New Visual{'s' if len(new_visuals) != 1 else ''} Scanned: ##\n\n")
            _write_diff_table(f, new_visuals, change_type="new")

        # Improved
        if improved:
            improved.sort(key=lambda v: (-v["Popularity"], v["Visual Name"]))
            f.write(f"## {len(improved)} Visual{'s' if len(improved) != 1 else ''} Improved: ##\n\n")
            f.write("Visuals that resolved findings or reduced their risk level.\n\n")
            _write_diff_table(f, improved, change_type="improved", prev=previous_scores)

        # Worsened
        if worsened:
            worsened.sort(key=lambda v: (-v["Popularity"], v["Visual Name"]))
            f.write(f"## {len(worsened)} Visual{'s' if len(worsened) != 1 else ''} Worsened: ##\n\n")
            f.write("Visuals with a higher finding level than the previous scan.\n\n")
            _write_diff_table(f, worsened, change_type="worsened", prev=previous_scores)

        # Certification changes
        if newly_certified:
            f.write(f"## {len(newly_certified)} Newly Certified: ##\n\n")
            _write_diff_table(f, newly_certified, change_type="certified")

        if lost_certification:
            f.write(f"## {len(lost_certification)} Lost Certification: ##\n\n")
            _write_diff_table(f, lost_certification, change_type="decertified")

        # Removed
        if removed_visuals:
            f.write(f"## {len(removed_visuals)} Removed: ##\n\n")
            f.write("Visuals no longer on AppSource.\n\n")
            f.write("| Visual | Publisher | Previous Level |\n")
            f.write("|--------|-----------|----------------|\n")
            for v in removed_visuals:
                f.write(f"| {v.get('Visual Name', '')} | {v.get('Publisher', '')} | "
                        f"{v.get('Risk Level', '')} |\n")
            f.write("\n")

    logger.info(f"Wrote diff report to {path} ({total_changes} changes)")


def _write_diff_table(f, visuals, change_type="new", prev=None):
    """Write an HTML table for diff entries, matching SummarizeDiff.py style."""
    f.write('<table style="width: 800px; border: none !important; border-collapse: collapse; border-spacing: 0;">\n')

    for v in visuals:
        name = v["Visual Name"]
        publisher = v.get("Publisher", "")
        guid = v["GUID"]
        cert = "Certified" if v["Is Certified"] else "Uncertified"
        risk = v["Risk Level"]
        version = v.get("Latest Version", "")

        thumbnail_filename = v.get("_meta", {}).get("Simple Filename", "")
        if thumbnail_filename:
            thumbnail_url = f"../blob/main/All%20Visuals/Images/{thumbnail_filename}.png?raw=true"
            image_html = f'<a href="https://appsource.microsoft.com/product/power-bi-visuals/{guid}"><img src="{thumbnail_url}" width="100" alt="{name}" style="max-width:100%;height:auto;"/></a>'
        else:
            image_html = "No thumbnail"

        # Build detail lines based on change type
        detail_lines = [f"<b>{name}</b>"]
        detail_lines.append(f"Publisher: {publisher} | {cert}")

        if change_type == "new":
            detail_lines.append(f"Finding Level: {risk} | Version: {version}")
            findings = _format_findings_short(v)
            if findings:
                detail_lines.append(f"Patterns: {findings}")

        elif change_type in ("improved", "worsened") and prev:
            prev_v = prev.get(guid, {})
            prev_risk = prev_v.get("Risk Level", "?")
            detail_lines.append(f"Finding Level: {prev_risk} ➔ {risk}")
            if v.get("Findings Resolved in Latest", 0):
                detail_lines.append(f"Resolved {v['Findings Resolved in Latest']} pattern(s) in latest version")

        elif change_type == "certified":
            detail_lines.append(f"Now certified by Microsoft | Finding Level: {risk}")

        elif change_type == "decertified":
            detail_lines.append(f"Certification removed | Finding Level: {risk}")

        rowspan = len(detail_lines)
        f.write('<tr>\n')
        f.write(f'  <td rowspan="{rowspan}" style="width: 120px; border: none !important; '
                f'vertical-align: top; text-align: center;">{image_html}</td>\n')
        f.write(f'  <td style="width: 680px; border: none !important; padding: 4px;">'
                f'{detail_lines[0]}</td>\n')
        f.write('</tr>\n')
        for line in detail_lines[1:]:
            f.write(f'<tr><td style="border: none !important; padding: 4px;">{line}</td></tr>\n')
        f.write('<tr><td style="border: none !important; padding: 4px;"></td></tr>\n')

    f.write('</table>\n\n')


def _format_findings_short(v):
    """Format a visual's findings as a short string for diff tables."""
    parts = []
    if v.get("Dynamic Code (Author)"):
        parts.append(f"Dynamic Code: {v['Dynamic Code (Author)']}")
    if v.get("Network Access (Author)"):
        parts.append(f"Network: {v['Network Access (Author)']}")
    if v.get("DOM Manipulation (Author)"):
        parts.append(f"DOM: {v['DOM Manipulation (Author)']}")
    return "; ".join(parts[:2]) if parts else ""


SCAN_CACHE_FILE = ".scan_cache.json"


def load_scan_cache(cache_path):
    """Load cached scan results from previous runs.

    Returns dict: {folder_name: {"sec": sec_row_dict, "oss": oss_row_dict}}.
    """
    if not os.path.exists(cache_path):
        return {}
    try:
        with open(cache_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        logger.warning(f"Could not load scan cache: {e}")
        return {}


def save_scan_cache(cache, cache_path):
    """Save scan results cache for incremental runs."""
    with open(cache_path, 'w', encoding='utf-8') as f:
        json.dump(cache, f, separators=(',', ':'))
    size_mb = os.path.getsize(cache_path) / (1024 * 1024)
    logger.info(f"Saved scan cache ({len(cache)} entries, {size_mb:.1f} MB)")


def main():
    """Run the full pipeline with incremental scanning.

    On first run: scans all folders (~43 min), saves results to cache.
    On subsequent runs: loads cache, scans ONLY new folders (~30 sec for ~30 new visuals),
    merges results, regenerates all outputs.

    Use --full to force a complete rescan ignoring the cache.
    """
    import argparse
    parser = argparse.ArgumentParser(description='Generate security scan report')
    parser.add_argument('--full', action='store_true',
                        help='Force full rescan, ignoring cache')
    args = parser.parse_args()

    workspace = os.getcwd()
    extracted_path = os.path.join(workspace, "Extracted")

    # Output paths
    summary_md = os.path.join(workspace, "security_scan_summary.md")
    diff_md = os.path.join(workspace, "security_scan_diff.md")
    scores_csv = os.path.join(workspace, "visual_security_scores.csv")
    findings_csv = os.path.join(workspace, "security_findings_detail.csv")
    oss_out_csv = os.path.join(workspace, "oss_licenses.csv")
    metadata_json = os.path.join(workspace, "scan_metadata.json")
    cache_path = os.path.join(workspace, SCAN_CACHE_FILE)

    if not os.path.isdir(extracted_path):
        logger.error(f"Extracted directory not found: {extracted_path}")
        return

    # Load shared metadata
    metadata_csv = os.path.join(workspace, "Custom Visuals.csv")
    metadata = load_metadata(metadata_csv)
    logger.info(f"Loaded metadata for {len(metadata)} visuals")

    # Load scan cache (unless --full)
    cache = {} if args.full else load_scan_cache(cache_path)

    # Determine which folders need scanning
    all_folders = [f for f in os.listdir(extracted_path)
                   if os.path.isdir(os.path.join(extracted_path, f))]
    new_folders = [f for f in all_folders if f not in cache]
    cached_folders = [f for f in all_folders if f in cache]

    logger.info(f"Total folders: {len(all_folders)} | "
                f"Cached: {len(cached_folders)} | "
                f"New to scan: {len(new_folders)}")

    # Scan only new folders
    if new_folders:
        completed = 0
        total_new = len(new_folders)
        args_list = [(extracted_path, folder, metadata) for folder in new_folders]
        max_workers = min(os.cpu_count() or 4, 8)

        with ProcessPoolExecutor(max_workers=max_workers) as executor:
            futures = {executor.submit(_scan_single_visual_unified, a): a[1]
                       for a in args_list}
            for future in as_completed(futures):
                completed += 1
                if completed % 200 == 0 or completed == total_new:
                    logger.info(f"Scanned {completed}/{total_new} new folders "
                               f"({100*completed/total_new:.1f}%)")
                try:
                    sec_row, oss_row = future.result()
                    folder_name = futures[future]
                    if sec_row and oss_row:
                        cache[folder_name] = {"sec": sec_row, "oss": oss_row}
                except Exception as e:
                    logger.error(f"Error scanning {futures[future]}: {e}")

        logger.info(f"Scanned {len(new_folders)} new folders")

    # Also remove cache entries for folders that no longer exist
    all_folder_set = set(all_folders)
    removed = [f for f in cache if f not in all_folder_set]
    for f in removed:
        del cache[f]
    if removed:
        logger.info(f"Removed {len(removed)} stale cache entries")

    # Save updated cache
    save_scan_cache(cache, cache_path)

    # Assemble full results from cache
    security_rows = [entry["sec"] for entry in cache.values()]
    oss_rows = [entry["oss"] for entry in cache.values()]

    logger.info(f"Total results: {len(security_rows)} security, {len(oss_rows)} OSS")

    # Index OSS data by folder for merging
    oss_index = {row.get("Folder", ""): row for row in oss_rows}
    scan_date = datetime.now().strftime("%Y-%m-%d")

    # Build enriched visual data (latest version, sorted by popularity)
    visuals = build_visual_data(security_rows, oss_index, metadata)
    logger.info(f"Built data for {len(visuals)} unique visuals")

    # Load previous scores BEFORE overwriting (for diff)
    previous_scores = load_previous_scores(scores_csv)

    # Generate all final outputs
    write_csv(visuals, SCORES_COLUMNS, scores_csv)
    write_csv(build_findings_detail(visuals), FINDINGS_COLUMNS, findings_csv)
    write_csv(build_oss_detail(visuals), OSS_COLUMNS, oss_out_csv)
    write_summary_markdown(visuals, scan_date, len(security_rows), summary_md)
    write_diff_markdown(visuals, previous_scores, scan_date, diff_md)
    write_scan_metadata(visuals, scan_date, len(security_rows), metadata_json)

    # Summary
    risk_counts = {}
    for v in visuals:
        lvl = v["Risk Level"]
        risk_counts[lvl] = risk_counts.get(lvl, 0) + 1

    logger.info("=== Output Summary ===")
    for lvl in ["High", "Medium", "Low", "None"]:
        logger.info(f"  {lvl}: {risk_counts.get(lvl, 0)}")
    cert_with = sum(1 for v in visuals if v["Is Certified"] and v["Risk Level"] != "None")
    logger.info(f"  Certified with findings: {cert_with}")
    logger.info(f"  GPL dependencies: {sum(1 for v in visuals if v['Has GPL License'])}")


if __name__ == "__main__":
    main()
