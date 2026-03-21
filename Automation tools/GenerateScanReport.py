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
# Merges security_scan_results.csv + oss_scan_results.csv + Custom Visuals.csv
# to produce community-facing markdown reports.
#
# Key design decisions:
#   - Reports certified and uncertified visuals SEPARATELY
#   - Uses popularity ranking for uncertified visuals
#   - Tracks version-over-version changes (resolved violations)
#   - Written for a non-technical audience (security teams, Power BI admins)
#   - Only reports AUTHOR-CODE findings (library code is excluded)

import csv
import logging
import os
import sys
from datetime import datetime

# Ensure sibling scripts are importable
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from ScanOSS import LIBRARY_SIGNATURES

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

# Pattern descriptions -- written for a non-technical audience
# Language uses "pattern detected" / "finding" rather than "vulnerability" per legal guidance
SECURITY_CHECKS = {
    "SEC-001": {"name": "eval()", "plain": "Runs code from text strings",
                "why": "This pattern is flagged by Microsoft because it allows dynamic code execution"},
    "SEC-002": {"name": "Function()", "plain": "Creates code at runtime",
                "why": "Similar to eval -- allows the visual to construct and execute code dynamically"},
    "SEC-003": {"name": "XMLHttpRequest", "plain": "Can communicate with external servers",
                "why": "Enables the visual to send or receive data from servers outside Power BI"},
    "SEC-004": {"name": "fetch()", "plain": "Can communicate with external servers",
                "why": "Same as XMLHttpRequest -- enables network calls outside Power BI"},
    "SEC-005": {"name": "WebSocket", "plain": "Can open persistent server connection",
                "why": "Maintains an ongoing connection to an external server"},
    "SEC-006": {"name": "document.write()", "plain": "Modifies page content directly",
                "why": "Flagged by Microsoft's certification rules as an unsafe DOM manipulation method"},
    "SEC-007": {"name": "innerHTML =", "plain": "Sets HTML content directly",
                "why": "Flagged by Microsoft's eslint no-inner-outer-html rule; safe when used with sanitizers like DOMPurify"},
    "SEC-008": {"name": "outerHTML =", "plain": "Replaces page elements with HTML",
                "why": "Same as innerHTML -- flagged by Microsoft's eslint no-inner-outer-html rule"},
    "SEC-009": {"name": ".html(data)", "plain": "Sets HTML content via jQuery/D3",
                "why": "Flagged by Microsoft's eslint no-implied-inner-html rule"},
    "SEC-010": {"name": "setTimeout(string)", "plain": "Runs text as code after a delay",
                "why": "Flagged because passing a string to setTimeout acts like eval()"},
    "SEC-011": {"name": "setInterval(string)", "plain": "Runs text as code repeatedly",
                "why": "Flagged because passing a string to setInterval acts like eval()"},
    "SEC-012": {"name": "document.domain", "plain": "Accesses browser security setting",
                "why": "Flagged by Microsoft's eslint no-document-domain rule"},
    "SEC-013": {"name": "document.cookie", "plain": "Accesses browser cookies",
                "why": "Flagged by Microsoft's eslint no-banned-terms rule"},
    "SEC-014": {"name": "http:// URL", "plain": "Uses unencrypted connection",
                "why": "Flagged by Microsoft's eslint no-http-string rule; HTTPS is preferred"},
    "SEC-015": {"name": "Math.random()", "plain": "Uses standard random numbers",
                "why": "Flagged by Microsoft's eslint insecure-random rule; not suitable for cryptographic use"},
}

# Mapping from old "Risk Level" to new neutral "Finding Level" labels
FINDING_LEVELS = {
    "Critical": "Multiple Certification-Relevant Patterns",
    "High": "Several Certification-Relevant Patterns",
    "Medium": "Some Patterns Detected",
    "Low": "Minor Patterns Detected",
    "Clean": "No Patterns Detected",
}

# Policy reference for non-technical audience
POLICY_REFERENCE = (
    "Microsoft requires certified visuals to pass specific checks before receiving certification "
    "([Policy 1200.1.3](https://learn.microsoft.com/en-us/legal/marketplace/certification-policies#1200-power-bi-visuals-additional-certification)). "
    "These checks are enforced by [eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals), "
    "an MIT-licensed ESLint plugin published by Microsoft. "
    "The full list of [certification requirements is here]"
    "(https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified)."
)

DISCLAIMER = (
    "### Disclaimer\n\n"
    "This project performs automated static analysis of publicly available Power BI "
    "custom visual packages using [eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals), "
    "the same MIT-licensed ESLint plugin that Microsoft requires for AppSource certification "
    "([Policy 1200.1.2](https://learn.microsoft.com/en-us/legal/marketplace/certification-policies"
    "#1200-power-bi-visuals-additional-certification)).\n\n"
    "Detected patterns represent code constructs that Microsoft's certification process "
    "flags for review. **Their presence does not necessarily indicate a security vulnerability.** "
    "Many patterns originate from well-known open-source libraries (d3, jQuery, Lodash, React) "
    "that are standard practice in web development.\n\n"
    "Findings are provided for informational purposes to help the Power BI community "
    "make informed decisions. Publishers who wish to discuss findings are welcome to "
    "[open an issue](https://github.com/DataChant/PowerBI-Visuals-AppSource/issues).\n\n"
    "This project is independent and **not affiliated with, endorsed by, or sponsored "
    "by Microsoft Corporation**. Microsoft, Power BI, and AppSource are trademarks of "
    "Microsoft Corporation.\n\n"
    "No beautified, decompiled, or transformed source code is stored or published by this project. "
    "Only scan results (pattern counts and metadata) are retained.\n\n"
)


def load_csv_list(path):
    """Load a CSV file and return a list of dicts."""
    rows = []
    try:
        with open(path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                rows.append(row)
    except Exception as e:
        logger.warning(f"Could not load {path}: {e}")
    return rows


def load_csv_indexed(path, key_field):
    """Load a CSV file and return a dict keyed by key_field."""
    data = {}
    try:
        with open(path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                key = row.get(key_field, '').strip()
                if key:
                    data[key] = row
    except Exception as e:
        logger.warning(f"Could not load {path}: {e}")
    return data


def compare_versions(v1, v2):
    """Compare two version strings. Returns >0 if v1 > v2."""
    try:
        parts1 = [int(x) for x in v1.split('.')]
        parts2 = [int(x) for x in v2.split('.')]
        for a, b in zip(parts1, parts2):
            if a != b:
                return a - b
        return len(parts1) - len(parts2)
    except (ValueError, AttributeError):
        return 0


def get_author_findings(row):
    """Get a list of author-code findings with plain-language descriptions."""
    findings = []
    for check_id, info in SECURITY_CHECKS.items():
        author_col = f"{check_id} Author"
        count = int(row.get(author_col, 0) or 0)
        if count > 0:
            findings.append({
                "id": check_id,
                "name": info["name"],
                "plain": info["plain"],
                "why": info["why"],
                "count": count,
            })
    return findings


def get_privilege_summary(row):
    """Get a plain-language summary of declared privileges."""
    privs = []
    if row.get("WebAccess Wildcard") == "Yes":
        privs.append("Can access ANY external website")
    elif row.get("WebAccess") == "Yes":
        urls = row.get("WebAccess URLs", "")
        if urls:
            privs.append(f"Can access: {urls}")
        else:
            privs.append("Can access external websites")
    if row.get("ExportContent") == "Yes":
        privs.append("Can export your data")
    if row.get("LocalStorage") == "Yes":
        privs.append("Stores data in your browser")
    if row.get("AADAuthentication") == "Yes":
        privs.append("Uses your Azure AD identity")
    return privs


def build_version_history(security_rows):
    """Build version history per visual GUID.

    Returns dict: GUID -> list of {version, folder, findings, risk_score, risk_level}
    sorted by version ascending.
    """
    by_guid = {}
    for row in security_rows:
        guid = row.get("Visual GUID", "")
        if not guid:
            continue
        version = row.get("Version", "0.0.0.0")
        entry = {
            "version": version,
            "folder": row.get("Folder", ""),
            "findings": get_author_findings(row),
            "risk_score": int(row.get("Risk Score", 0) or 0),
            "risk_level": row.get("Risk Level", "Clean"),
            "row": row,
        }
        if guid not in by_guid:
            by_guid[guid] = []
        by_guid[guid].append(entry)

    # Sort each visual's versions
    for guid in by_guid:
        by_guid[guid].sort(key=lambda x: [int(p) for p in x["version"].split('.')]
                           if all(p.isdigit() for p in x["version"].split('.')) else [0])

    return by_guid


def compute_resolved_violations(version_history):
    """For each visual, compute which violations were resolved between versions.

    Returns dict: GUID -> {
        "latest": latest_entry,
        "resolved": [{"finding_name", "resolved_in_version", "was_in_version"}],
        "new_in_latest": [findings new in latest that weren't in previous],
    }
    """
    results = {}
    for guid, versions in version_history.items():
        if len(versions) < 1:
            continue

        latest = versions[-1]
        latest_finding_ids = {f["id"] for f in latest["findings"]}

        resolved = []
        if len(versions) >= 2:
            previous = versions[-2]
            prev_finding_ids = {f["id"] for f in previous["findings"]}

            # Findings that were in previous but NOT in latest = resolved
            for f in previous["findings"]:
                if f["id"] not in latest_finding_ids:
                    resolved.append({
                        "finding_name": f["name"],
                        "finding_plain": f["plain"],
                        "resolved_in_version": latest["version"],
                        "was_in_version": previous["version"],
                    })

            # Findings new in latest
            new_in_latest = [f for f in latest["findings"]
                            if f["id"] not in prev_finding_ids]
        else:
            new_in_latest = latest["findings"]

        results[guid] = {
            "latest": latest,
            "resolved": resolved,
            "new_in_latest": new_in_latest,
            "version_count": len(versions),
        }

    return results


def get_thumbnail_url(simple_filename):
    if not simple_filename:
        return ""
    return f"../blob/main/All%20Visuals/Images/{simple_filename}.png?raw=true"


def create_link(url, text):
    if url:
        return f'<a href="{url}">{text}</a>'
    return text


def write_visual_card(f, visual_row, metadata_row, oss_info, resolved=None, new_findings=None):
    """Write an HTML table card for a visual, using non-technical language."""
    name = metadata_row.get("Name", visual_row.get("Simple Name", "Unknown"))
    publisher = metadata_row.get("Publisher", visual_row.get("Publisher", "Unknown"))
    support_link = metadata_row.get("SupportLink", "")
    simple_filename = metadata_row.get("Simple Filename", visual_row.get("Simple Name", ""))
    app_source_url = metadata_row.get("Link", "")
    guid = visual_row.get("Visual GUID", "")
    version = visual_row.get("Version", "")
    risk_level = visual_row.get("Risk Level", "Clean")
    risk_score = visual_row.get("Risk Score", "0")
    is_certified = visual_row.get("Is Certified", "No")
    popularity = visual_row.get("Popularity", "")

    thumbnail_url = get_thumbnail_url(simple_filename)
    publisher_line = f"Publisher: {create_link(support_link, publisher)}" if support_link else f"Publisher: {publisher}"

    # Build findings description in plain language
    findings = get_author_findings(visual_row)
    privileges = get_privilege_summary(visual_row)

    finding_lines = []
    for f_item in findings[:5]:
        finding_lines.append(f"{f_item['plain']} ({f_item['name']})")

    findings_text = ", ".join(finding_lines) if finding_lines else "No certification-relevant patterns detected"
    priv_text = "; ".join(privileges) if privileges else "No special permissions requested"

    libs = oss_info if oss_info else "None detected"
    licenses = visual_row.get("Licenses Found", "")
    license_risk = visual_row.get("License Risk", "")

    # Resolved patterns (improvements between versions)
    resolved_text = ""
    if resolved:
        resolved_items = [f"{r['finding_name']} (resolved in v{r['resolved_in_version']})" for r in resolved]
        resolved_text = f"Resolved: {', '.join(resolved_items)}"

    rowspan = 6
    if resolved_text:
        rowspan += 1
    if privileges:
        rowspan += 1

    f.write('<tr>\n')
    if thumbnail_url:
        img_tag = f'<img src="{thumbnail_url}" width="100" alt="{name}" style="max-width:100%;height:auto;"/>'
        if app_source_url:
            img_tag = f'<a href="{app_source_url}">{img_tag}</a>'
        f.write(f'  <td rowspan="{rowspan}" style="width: 120px; border: none !important; vertical-align: top; text-align: center;">{img_tag}</td>\n')
    else:
        f.write(f'  <td rowspan="{rowspan}" style="width: 120px; border: none !important; vertical-align: top; text-align: center;">No thumbnail</td>\n')

    cert_badge = " ✅ Certified" if is_certified == "Yes" else ""
    pop_text = f" | Popularity: {popularity}" if popularity else ""
    f.write(f'  <td style="width: 680px; border: none !important; padding: 4px;"><b>{name}</b>{cert_badge}</td>\n')
    f.write('</tr>\n')
    finding_label = FINDING_LEVELS.get(risk_level, risk_level)
    f.write(f'<tr><td style="border: none !important; padding: 4px;">{publisher_line} | {finding_label} ({risk_score} pts){pop_text}</td></tr>\n')
    f.write(f'<tr><td style="border: none !important; padding: 4px;">Patterns detected: {findings_text}</td></tr>\n')
    if privileges:
        f.write(f'<tr><td style="border: none !important; padding: 4px;">Permissions requested: {priv_text}</td></tr>\n')
    f.write(f'<tr><td style="border: none !important; padding: 4px;">Bundled libraries: {libs}</td></tr>\n')

    license_line = f"Licenses: {licenses}" if licenses else "Licenses: None detected"
    if license_risk and license_risk != "Low":
        license_line += f" | License risk: {license_risk}"
    f.write(f'<tr><td style="border: none !important; padding: 4px;">{license_line}</td></tr>\n')

    if resolved_text:
        f.write(f'<tr><td style="border: none !important; padding: 4px;">🟢 {resolved_text}</td></tr>\n')

    f.write(f'<tr><td style="border: none !important; padding: 4px;">Version: {version} | GUID: {guid}</td></tr>\n')
    f.write('<tr><td colspan="2" style="border: none !important; padding: 0; height: 8px;"></td></tr>\n')


def write_section(f, title, visuals_list, metadata, oss_index, version_data=None, preamble=None):
    """Write a report section with visual cards."""
    count = len(visuals_list)
    if count == 0:
        return

    f.write(f"\n## {count} {title}: ##\n\n")
    if preamble:
        f.write(preamble)
    f.write('<table style="width: 800px; border: none !important; border-collapse: collapse; border-spacing: 0;">\n')

    for entry in visuals_list:
        row = entry if isinstance(entry, dict) and "Visual GUID" in entry else entry.get("row", entry)
        guid = row.get("Visual GUID", "")
        meta = metadata.get(guid, {})
        folder = row.get("Folder", "")
        oss_row = oss_index.get(folder, {})
        oss_info = oss_row.get("Detected Libraries", "")

        resolved = None
        if version_data and guid in version_data:
            resolved = version_data[guid].get("resolved", [])

        write_visual_card(f, row, meta, oss_info, resolved=resolved)

    f.write('</table>\n')


def write_summary_csv(latest_data, oss_index, output_path):
    """Write a one-row-per-visual summary CSV."""
    if not latest_data:
        return

    rows = []
    for guid, vdata in latest_data.items():
        row = dict(vdata["latest"]["row"])
        folder = row.get("Folder", "")
        oss = oss_index.get(folder, {})
        row["Detected Libraries"] = oss.get("Detected Libraries", "")
        row["Licenses Found"] = oss.get("Licenses Found", "")
        row["License Risk"] = oss.get("License Risk", "")
        row["Has GPL"] = oss.get("Has GPL", "No")
        row["Resolved Count"] = len(vdata.get("resolved", []))
        rows.append(row)

    if not rows:
        return

    columns = list(rows[0].keys())
    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=columns)
        writer.writeheader()
        for r in sorted(rows, key=lambda x: x.get("Visual GUID", "")):
            writer.writerow(r)

    logger.info(f"Wrote summary CSV: {output_path}")


def main():
    workspace_path = os.getcwd()
    security_csv = os.path.join(workspace_path, "security_scan_results.csv")
    oss_csv = os.path.join(workspace_path, "oss_scan_results.csv")
    metadata_csv = os.path.join(workspace_path, "Custom Visuals.csv")
    report_path = os.path.join(workspace_path, "security_scan_report.md")
    summary_csv_path = os.path.join(workspace_path, "security_scan_summary.csv")

    # Load data
    security_rows = load_csv_list(security_csv)
    oss_rows = load_csv_list(oss_csv)
    metadata = load_csv_indexed(metadata_csv, "Visual GUID")

    logger.info(f"Loaded {len(security_rows)} security scan rows")
    logger.info(f"Loaded {len(oss_rows)} OSS scan rows")
    logger.info(f"Loaded {len(metadata)} visual metadata entries")

    if not security_rows:
        logger.error("No security scan results found. Run ScanSecurity.py first.")
        return

    oss_index = {row.get("Folder", ""): row for row in oss_rows}

    # Build version history and compute resolved violations
    version_history = build_version_history(security_rows)
    version_data = compute_resolved_violations(version_history)

    # Get latest version per visual
    latest_rows = {}
    for guid, vdata in version_data.items():
        latest_rows[guid] = vdata["latest"]["row"]
        # Merge OSS data
        folder = latest_rows[guid].get("Folder", "")
        oss = oss_index.get(folder, {})
        latest_rows[guid]["Detected Libraries"] = oss.get("Detected Libraries", "")
        latest_rows[guid]["Licenses Found"] = oss.get("Licenses Found", "")
        latest_rows[guid]["License Risk"] = oss.get("License Risk", "Low")
        latest_rows[guid]["Has GPL"] = oss.get("Has GPL", "No")

    logger.info(f"Unique visuals (latest version): {len(latest_rows)}")

    # Separate certified vs uncertified
    certified_with_findings = []
    uncertified_with_findings = []
    certified_clean = []
    uncertified_clean = []
    gpl_visuals = []

    for guid, row in latest_rows.items():
        is_certified = row.get("Is Certified") == "Yes"
        risk_level = row.get("Risk Level", "Clean")
        has_findings = risk_level not in ("Clean",)

        if is_certified:
            if has_findings:
                certified_with_findings.append(row)
            else:
                certified_clean.append(row)
        else:
            if has_findings:
                uncertified_with_findings.append(row)
            else:
                uncertified_clean.append(row)

        if row.get("Has GPL") == "Yes":
            gpl_visuals.append(row)

    # Sort: certified by risk score desc, uncertified by popularity desc then risk
    certified_with_findings.sort(key=lambda x: -int(x.get("Risk Score", 0) or 0))
    uncertified_with_findings.sort(
        key=lambda x: (-float(x.get("Popularity", 0) or 0), -int(x.get("Risk Score", 0) or 0)))

    # Risk level counts
    level_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Clean": 0}
    cert_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Clean": 0}
    uncert_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0, "Clean": 0}

    for guid, row in latest_rows.items():
        lvl = row.get("Risk Level", "Clean")
        level_counts[lvl] = level_counts.get(lvl, 0) + 1
        if row.get("Is Certified") == "Yes":
            cert_counts[lvl] = cert_counts.get(lvl, 0) + 1
        else:
            uncert_counts[lvl] = uncert_counts.get(lvl, 0) + 1

    total_visuals = len(latest_rows)
    total_versions = len(security_rows)
    scan_date = datetime.now().strftime("%Y-%m-%d")

    # Count resolved violations
    total_resolved = sum(len(vdata.get("resolved", []))
                         for vdata in version_data.values())
    visuals_with_resolved = sum(1 for vdata in version_data.values()
                                 if vdata.get("resolved"))

    # Check distribution
    check_dist = {}
    for check_id, info in SECURITY_CHECKS.items():
        author_col = f"{check_id} Author"
        total_flagged = sum(1 for r in latest_rows.values() if int(r.get(author_col, 0) or 0) > 0)
        cert_flagged = sum(1 for r in latest_rows.values()
                          if r.get("Is Certified") == "Yes" and int(r.get(author_col, 0) or 0) > 0)
        check_dist[check_id] = {"total": total_flagged, "certified": cert_flagged}

    # Library distribution
    lib_counts = {}
    for r in latest_rows.values():
        for lib in r.get("Detected Libraries", "").split("; "):
            lib = lib.strip()
            if lib:
                lib_counts[lib] = lib_counts.get(lib, 0) + 1

    # ----- Write report -----
    with open(report_path, 'w', encoding='utf-8') as f:
        f.write("# Power BI Custom Visuals: Security & Open Source Scan Report\n\n")
        f.write(f"**Scan date:** {scan_date} | **Visuals analyzed:** {total_visuals} | "
                f"**Versions scanned:** {total_versions}\n\n")

        # Disclaimer first
        f.write(DISCLAIMER)

        # Introduction for non-technical audience
        f.write("## What is this report?\n\n")
        f.write("Power BI custom visuals are third-party add-ins that run JavaScript code inside your Power BI reports. ")
        f.write("They have access to the data displayed in the visual. This report scans those visuals for:\n\n")
        f.write("1. **Certification-relevant patterns** -- Does the visual's compiled code contain patterns that ")
        f.write("Microsoft's certification process flags for review?\n")
        f.write("2. **Permission declarations** -- What capabilities does the visual request? (network access, data export, etc.)\n")
        f.write("3. **Open-source libraries** -- What third-party libraries are bundled, and what are their licenses?\n\n")
        f.write(POLICY_REFERENCE + "\n\n")

        f.write("### How to read this report\n\n")
        f.write("- **Certified visuals** have been reviewed by Microsoft. Patterns found in certified visuals ")
        f.write("typically originate from bundled third-party libraries, not from the visual's own code.\n")
        f.write("- **Uncertified visuals** have NOT been reviewed by Microsoft. They may be perfectly safe, ")
        f.write("but there is no independent verification. Findings are sorted by popularity so you can assess ")
        f.write("the most widely-used visuals first.\n")
        f.write("- **Pattern counts** reflect only matches attributed to the visual's **own code** (not bundled libraries). ")
        f.write("Library code patterns are excluded to reduce false positives.\n")
        f.write("- **Resolved patterns** show improvements between versions -- visuals that addressed patterns in newer releases.\n\n")

        f.write("### Important caveats\n\n")
        f.write("- This scan analyzes **compiled code** (webpack bundles), not source code. ")
        f.write("Microsoft's certification process reviews the TypeScript source code.\n")
        f.write("- Our library-exclusion filter removes patterns from known libraries (d3, jQuery, React, etc.), ")
        f.write("but some library patterns may still appear as false positives.\n")
        f.write("- The **permissions** section (WebAccess, ExportContent, etc.) is the most reliable indicator ")
        f.write("because these are explicitly declared by the visual developer.\n")
        f.write("- **The presence of a pattern does not mean the visual is unsafe.** ")
        f.write("Many patterns are standard practice and are used safely with proper sanitization.\n\n")

        # Findings Dashboard
        f.write("## Findings Dashboard\n\n")
        f.write("| Finding Level | All Visuals | Certified | Uncertified |\n")
        f.write("|---------------|-------------|-----------|-------------|\n")
        for lvl in ["Critical", "High", "Medium", "Low", "Clean"]:
            total = level_counts.get(lvl, 0)
            cert = cert_counts.get(lvl, 0)
            uncert = uncert_counts.get(lvl, 0)
            label = FINDING_LEVELS.get(lvl, lvl)
            pct = f" ({100*total/total_visuals:.0f}%)" if total_visuals else ""
            f.write(f"| {label} | {total}{pct} | {cert} | {uncert} |\n")
        f.write(f"| **Total** | **{total_visuals}** | "
                f"**{sum(cert_counts.values())}** | "
                f"**{sum(uncert_counts.values())}** |\n\n")

        if total_resolved > 0:
            f.write(f"**Version improvements:** {visuals_with_resolved} visuals resolved "
                    f"{total_resolved} patterns in their latest version.\n\n")

        # === CERTIFIED VISUALS SECTION ===
        f.write("---\n\n")
        f.write("# Certified Visuals\n\n")
        f.write("These visuals carry Microsoft's certification badge. Customers and organizations trust ")
        f.write("this certification as a signal that Microsoft has reviewed the source code. ")
        f.write("Patterns detected here most likely originate from bundled third-party libraries ")
        f.write("rather than the visual author's own code.\n\n")

        if certified_with_findings:
            # Group certified by finding level
            cert_critical = [r for r in certified_with_findings if r.get("Risk Level") == "Critical"]
            cert_high = [r for r in certified_with_findings if r.get("Risk Level") == "High"]
            cert_medium = [r for r in certified_with_findings if r.get("Risk Level") == "Medium"]
            cert_low = [r for r in certified_with_findings if r.get("Risk Level") == "Low"]

            if cert_critical:
                write_section(f, "Certified Visuals -- Multiple Certification-Relevant Patterns",
                              cert_critical, metadata, oss_index, version_data,
                              preamble="These certified visuals have the highest concentration of certification-relevant patterns "
                                       "in their compiled code. Most patterns likely originate from bundled libraries.\n\n")
            if cert_high:
                write_section(f, "Certified Visuals -- Several Certification-Relevant Patterns",
                              cert_high, metadata, oss_index, version_data)
            if cert_medium:
                write_section(f, "Certified Visuals -- Some Patterns Detected",
                              cert_medium, metadata, oss_index, version_data)
            if cert_low:
                write_section(f, "Certified Visuals -- Minor Patterns Detected",
                              cert_low, metadata, oss_index, version_data)
        else:
            f.write("No certification-relevant patterns detected in certified visuals.\n\n")

        f.write(f"\n**{len(certified_clean)} certified visuals** had no patterns detected.\n\n")

        # === UNCERTIFIED VISUALS SECTION ===
        f.write("---\n\n")
        f.write("# Uncertified Visuals\n\n")
        f.write("These visuals have **not been reviewed by Microsoft**. They are sorted by popularity ")
        f.write("(most popular first) so you can focus on the visuals most likely to be in use across your organization.\n\n")

        if uncertified_with_findings:
            # Group uncertified by finding level, sorted by popularity within each
            uncert_critical = [r for r in uncertified_with_findings if r.get("Risk Level") == "Critical"]
            uncert_high = [r for r in uncertified_with_findings if r.get("Risk Level") == "High"]
            uncert_medium_low = [r for r in uncertified_with_findings
                                  if r.get("Risk Level") in ("Medium", "Low")]

            if uncert_critical:
                write_section(f, "Most Popular Uncertified Visuals -- Multiple Certification-Relevant Patterns",
                              uncert_critical, metadata, oss_index, version_data,
                              preamble="These uncertified visuals are widely used and contain multiple patterns that "
                                       "Microsoft's certification process would flag for review.\n\n")
            if uncert_high:
                write_section(f, "Most Popular Uncertified Visuals -- Several Patterns",
                              uncert_high, metadata, oss_index, version_data)
            if uncert_medium_low:
                write_section(f, "Uncertified Visuals -- Some/Minor Patterns",
                              uncert_medium_low, metadata, oss_index, version_data)
        else:
            f.write("No certification-relevant patterns detected in uncertified visuals.\n\n")

        f.write(f"\n**{len(uncertified_clean)} uncertified visuals** had no patterns detected.\n\n")

        # === PATTERN REFERENCE ===
        f.write("---\n\n")
        f.write("## What patterns does this scan check?\n\n")
        f.write("These are the same patterns that Microsoft's [eslint-plugin-powerbi-visuals]"
                "(https://www.npmjs.com/package/eslint-plugin-powerbi-visuals) checks during certification.\n\n")
        f.write("| Pattern | What it does | Microsoft's ESLint rule | Visuals with pattern | In certified |\n")
        f.write("|---------|-------------|------------------------|---------------------|---------------|\n")
        for check_id in sorted(SECURITY_CHECKS.keys()):
            info = SECURITY_CHECKS[check_id]
            dist = check_dist.get(check_id, {})
            f.write(f"| {info['name']} | {info['plain']} | {info['why']} | "
                    f"{dist.get('total', 0)} | {dist.get('certified', 0)} |\n")
        f.write("\n")
        f.write("*Note: These counts reflect only matches attributed to the visual's own code. "
                "Patterns from bundled libraries (d3, jQuery, React, webpack runtime, etc.) are excluded "
                "where possible, but some library patterns may still appear.*\n\n")

        # === OSS LIBRARY LANDSCAPE ===
        f.write("## Bundled Open-Source Libraries\n\n")
        f.write("These libraries are embedded inside the visuals' compiled code. Their licenses may ")
        f.write("create obligations for organizations using the visual.\n\n")
        f.write("| Library | Visuals | % | License |\n")
        f.write("|---------|---------|---|--------|\n")
        for lib, count in sorted(lib_counts.items(), key=lambda x: -x[1]):
            pct = f"{100*count/total_visuals:.1f}" if total_visuals else "0"
            known_license = ""
            for sig in LIBRARY_SIGNATURES:
                if sig["name"] == lib:
                    known_license = sig["license"]
                    break
            f.write(f"| {lib} | {count} | {pct}% | {known_license} |\n")
        f.write("\n")

        # GPL section
        if gpl_visuals:
            write_section(f, "Visuals with GPL-Licensed Dependencies",
                          gpl_visuals, metadata, oss_index, version_data,
                          preamble="GPL licenses require that derivative works also be open-sourced. "
                                   "Organizations with proprietary code policies should review these visuals.\n\n")

        # === METHODOLOGY ===
        f.write("\n## How this scan works\n\n")
        f.write("1. **Download:** We download all custom visual packages (.pbiviz files) from Microsoft AppSource.\n")
        f.write("2. **Extract:** Each package is temporarily unzipped to access the compiled JavaScript and metadata. "
                "**No extracted or beautified code is stored or published** -- only scan results are retained.\n")
        f.write("3. **Pattern scan:** We search the JavaScript for the same patterns that Microsoft's "
                "[eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals) "
                "checks during certification: network access patterns (`fetch`, `XMLHttpRequest`), "
                "dynamic code execution (`eval`, `Function`), DOM manipulation (`innerHTML`), and others.\n")
        f.write("4. **Library filtering:** We identify known library code (d3, jQuery, React, webpack runtime, etc.) "
                "and exclude matches from these libraries. Only patterns attributable to the visual's own code are reported.\n")
        f.write("5. **Privilege analysis:** We read the visual's declared permissions (WebAccess, ExportContent, etc.) "
                "from the metadata. These are the most reliable indicators because they are explicitly declared by the developer.\n")
        f.write("6. **Version tracking:** We compare patterns across versions of each visual to identify improvements.\n")
        f.write("7. **OSS detection:** We identify bundled open-source libraries and their licenses.\n\n")

        f.write("**Pattern scoring:** Certification Blocker = 10 points, Certification Concern = 5, Informational = 1. ")
        f.write("Only patterns attributed to the visual's own code count. Wildcard WebAccess adds 8 points.\n\n")

        f.write("**Tools used:**\n")
        f.write("- [eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals) "
                "(MIT license) -- the same ESLint plugin that Microsoft requires for AppSource certification\n")
        f.write("- [js-beautify](https://www.npmjs.com/package/js-beautify) -- formats minified code for analysis "
                "(beautified files are temporary and not stored)\n\n")

        f.write("**References:**\n")
        f.write("- [Microsoft certification requirements](https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified)\n")
        f.write("- [Certification policy 1200](https://learn.microsoft.com/en-us/legal/marketplace/certification-policies#1200-power-bi-visuals-additional-certification)\n")
        f.write("- [eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals) -- Microsoft's official ESLint rules\n")
        f.write("- [pbiviz package --certification-audit](https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified#compiling-requirements) -- built-in audit tool\n")

    logger.info(f"Wrote report to {report_path}")

    # Write summary CSV
    write_summary_csv(version_data, oss_index, summary_csv_path)

    # Print summary
    logger.info("=== Report Summary ===")
    logger.info(f"  Total visuals: {total_visuals}")
    for lvl in ["Critical", "High", "Medium", "Low", "Clean"]:
        logger.info(f"  {lvl}: {level_counts.get(lvl, 0)} (cert: {cert_counts.get(lvl, 0)}, uncert: {uncert_counts.get(lvl, 0)})")
    logger.info(f"  Visuals with resolved violations: {visuals_with_resolved}")
    logger.info(f"  GPL dependencies: {len(gpl_visuals)}")


if __name__ == "__main__":
    main()
