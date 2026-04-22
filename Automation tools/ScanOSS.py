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

# Open-source library and license scanner for Power BI custom visuals.
# Detects bundled OSS libraries via banner comments, API signatures,
# and external JS references. Flags license compliance risks (GPL, LGPL).

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
# Library signature definitions
# ---------------------------------------------------------------------------
# Each entry: name, patterns to detect in code, version regex, known license.
# Patterns are chosen for uniqueness -- they survive minification and are
# unlikely to false-positive on other libraries.

LIBRARY_SIGNATURES = [
    {"name": "d3.js", "license": "ISC",
     "patterns": [r'\bd3\.select\b', r'\bd3\.scaleLinear\b', r'\bd3\.axis\b',
                  r'\bd3\.svg\b', r'\bd3\.layout\b'],
     "version_re": r'd3[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "jQuery", "license": "MIT",
     "patterns": [r'\bjQuery\b', r'\$\.fn\.jquery\b'],
     "version_re": r'jQuery\s+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "React", "license": "MIT",
     "patterns": [r'\breact\.production\b', r'\bReact\.createElement\b',
                  r'\bReactDOM\.render\b', r'\breact-dom\.production\b'],
     "version_re": r'react[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Lodash", "license": "MIT",
     "patterns": [r'\blodash\b.*\b_\.VERSION\b|\blodash\.js\b'],
     "version_re": r'lodash[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Moment.js", "license": "MIT",
     "patterns": [r'\bmomentjs\.com\b', r'\bmoment\.version\b'],
     "version_re": r'moment[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "ECharts", "license": "Apache-2.0",
     "patterns": [r'\becharts\.init\b', r'\becharts\b.*\bsetOption\b'],
     "version_re": r'echarts[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Highcharts", "license": "Commercial/CC-BY-NC",
     "patterns": [r'\bHighcharts\b', r'\bHighstock\b'],
     "version_re": r'Highcharts[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Leaflet", "license": "BSD-2-Clause",
     "patterns": [r'\bL\.map\b', r'\bL\.tileLayer\b', r'\bleafletjs\.com\b'],
     "version_re": r'Leaflet\s+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Mapbox GL JS", "license": "BSD-3-Clause",
     "patterns": [r'\bmapboxgl\.Map\b', r'\bmapbox-gl\b'],
     "version_re": r'mapbox-gl[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "ag-Grid", "license": "Commercial/MIT",
     "patterns": [r'\bag-grid\b', r'\bagGrid\b', r'\bAG Grid\b'],
     "version_re": r'ag-grid[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Bootstrap", "license": "MIT",
     "patterns": [r'\bbootstrap\b.*\bmodal\b|\bBootstrap\s+v'],
     "version_re": r'Bootstrap\s+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Vega", "license": "BSD-3-Clause",
     "patterns": [r'\bvega-lite\b', r'\bvega\.version\b', r'\bvegalite\b'],
     "version_re": r'vega[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Plotly.js", "license": "MIT",
     "patterns": [r'\bPlotly\.newPlot\b', r'\bplotly\.js\b'],
     "version_re": r'plotly\.js\s+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "jsrsasign", "license": "MIT",
     "patterns": [r'\bKJUR\b', r'\bjsrsasign\b'],
     "version_re": r'jsrsasign[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "DOMPurify", "license": "Apache-2.0/MPL-2.0",
     "patterns": [r'\bDOMPurify\b', r'\bpurify\.min\b'],
     "version_re": r'DOMPurify\s+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Quill", "license": "BSD-3-Clause",
     "patterns": [r'\bQuill\b.*\beditor\b|\bquilljs\.com\b'],
     "version_re": r'Quill\s+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "PowerBI Visuals Utils", "license": "MIT",
     "patterns": [r'\bpowerbi-visuals-utils\b'],
     "version_re": r'powerbi-visuals-utils[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Globalize", "license": "MIT",
     "patterns": [r'\bGlobalize\b.*\bculture\b'],
     "version_re": r'Globalize[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "NumPy / Numeral.js", "license": "MIT",
     "patterns": [r'\bnumeral\.js\b|\bnumeraljs\b'],
     "version_re": r'numeral[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "TopToJSON / TopoJSON", "license": "ISC",
     "patterns": [r'\btopojson\b'],
     "version_re": r'topojson[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "NVD3", "license": "Apache-2.0",
     "patterns": [r'\bnv\.d3\b|\bnvd3\b'],
     "version_re": r'nvd3[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "CodeMirror", "license": "MIT",
     "patterns": [r'\bCodeMirror\b'],
     "version_re": r'CodeMirror[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Snap.svg", "license": "Apache-2.0",
     "patterns": [r'\bSnap\.svg\b|\bsnap\.svg\b'],
     "version_re": r'Snap\.svg[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "wangEditor", "license": "MIT",
     "patterns": [r'\bwangEditor\b'],
     "version_re": r'wangEditor[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "JSZip", "license": "MIT/GPL-3.0",
     "patterns": [r'\bJSZip\b'],
     "version_re": r'JSZip[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Turf.js", "license": "MIT",
     "patterns": [r'\bturf\.(point|polygon|buffer)\b'],
     "version_re": r'turf[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Chart.js", "license": "MIT",
     "patterns": [r'\bChart\.js\b|\bnew Chart\b'],
     "version_re": r'Chart\.js[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "Syncfusion", "license": "Commercial",
     "patterns": [r'\bej\.core\b|\bsyncfusion\b', r'\bej\.diagram\b'],
     "version_re": r'syncfusion[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
    {"name": "DevExtreme", "license": "Commercial",
     "patterns": [r'\bdx\.custom\b|\bDevExpress\b|\bdevextreme\b'],
     "version_re": r'DevExtreme[.\s/-]+v?([\d]+\.[\d]+\.[\d]+)'},
]

# License detection patterns applied to the full file content
LICENSE_PATTERNS = [
    (r'MIT License|Permission is hereby granted,?\s*free of charge', 'MIT'),
    (r'Apache License[,\s]+Version 2\.0', 'Apache-2.0'),
    (r'BSD[\s-]2[\s-]Clause', 'BSD-2-Clause'),
    (r'BSD[\s-]3[\s-]Clause|Redistribution and use in source and binary', 'BSD-3-Clause'),
    (r'\bISC License\b', 'ISC'),
    (r'GNU General Public License.*version\s*3|GPL[\s-]?3\.0', 'GPL-3.0'),
    (r'GNU General Public License.*version\s*2|GPL[\s-]?2\.0', 'GPL-2.0'),
    (r'GNU Lesser General Public License|LGPL', 'LGPL'),
    (r'Mozilla Public License.*2\.0|MPL[\s-]?2\.0', 'MPL-2.0'),
    (r'Creative Commons', 'CC'),
    (r'Server Side Public License|SSPL', 'SSPL'),
    (r'Business Source License|BSL', 'BSL'),
]

LICENSE_RISK = {
    'MIT': 'Low', 'ISC': 'Low', 'BSD-2-Clause': 'Low', 'BSD-3-Clause': 'Low',
    'Apache-2.0': 'Low', 'CC': 'Low',
    'MPL-2.0': 'Medium', 'LGPL': 'Medium',
    'GPL-2.0': 'High', 'GPL-3.0': 'High',
    'SSPL': 'High', 'BSL': 'High',
}

CSV_COLUMNS = [
    "Folder", "Simple Name", "Visual GUID", "Version",
    "Detected Libraries", "Library Versions", "Library Count",
    "Licenses Found", "License Risk",
    "Has GPL", "Has Restrictive License",
    "External JS Files", "External JS Count",
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

    guid_match = re.search(r'([A-Fa-f0-9]{32})$', name_parts)
    if guid_match:
        guid = name_parts[guid_match.start():]
        simple_name = name_parts[:guid_match.start()].rstrip('.')
    else:
        guid = ''
        simple_name = name_parts

    return simple_name, guid, version


def detect_libraries(content):
    """Detect known libraries via API signatures and version banners.

    Returns list of (library_name, version_or_empty, known_license).
    """
    detected = []
    for lib in LIBRARY_SIGNATURES:
        found = False
        for pattern in lib["patterns"]:
            if re.search(pattern, content, re.IGNORECASE):
                found = True
                break

        if not found:
            continue

        # Try to extract version
        version = ''
        if lib.get("version_re"):
            m = re.search(lib["version_re"], content, re.IGNORECASE)
            if m:
                version = m.group(1)

        detected.append((lib["name"], version, lib["license"]))

    return detected


def detect_licenses(content):
    """Detect license types mentioned in the file content.

    Scans both JS and CSS files for license banners.
    Returns a set of license identifiers.
    """
    found = set()
    for pattern, license_id in LICENSE_PATTERNS:
        if re.search(pattern, content, re.IGNORECASE):
            found.add(license_id)
    return found


def read_cleaned_json(cleaned_path):
    """Read cleaned.json and return parsed data, or empty dict on failure."""
    try:
        with open(cleaned_path, 'r', encoding='utf-8', errors='ignore') as f:
            return json.load(f)
    except Exception:
        return {}


def scan_oss_content(js_content, css_content, cleaned_data, folder, simple_name, guid, version):
    """Scan pre-read content for OSS libraries and licenses.

    This is the core scanning function -- accepts pre-read content strings
    so callers can share I/O with other scanners (read-once optimization).

    Args:
        js_content: internal.js content string (or empty)
        css_content: visual.css content string (or empty)
        cleaned_data: Parsed cleaned.json dict
        folder: Folder name (for row identification)
        simple_name, guid, version: Pre-parsed folder identity
    """
    external_js = cleaned_data.get('externalJS', []) or []

    combined_content = (js_content or '') + '\n' + (css_content or '')

    # Detect libraries from code signatures
    libraries = detect_libraries(js_content or '')

    # Detect licenses from both JS and CSS
    licenses = detect_licenses(combined_content)

    # Infer additional libraries from external JS filenames
    ext_js_lower = ' '.join(external_js).lower()
    for lib in LIBRARY_SIGNATURES:
        lib_name_lower = lib["name"].lower().replace('.js', '').replace(' ', '')
        already = any(l[0] == lib["name"] for l in libraries)
        if not already and lib_name_lower in ext_js_lower:
            libraries.append((lib["name"], '', lib["license"]))

    # Determine license risk
    has_gpl = any(lic in ('GPL-2.0', 'GPL-3.0') for lic in licenses)
    has_restrictive = any(LICENSE_RISK.get(lic, 'Low') in ('High', 'Medium')
                         for lic in licenses)
    for _, _, lib_lic in libraries:
        if 'GPL' in lib_lic:
            has_gpl = True
            has_restrictive = True

    risk_level = 'Low'
    for lic in licenses:
        lr = LICENSE_RISK.get(lic, 'Low')
        if lr == 'High':
            risk_level = 'High'
            break
        elif lr == 'Medium' and risk_level != 'High':
            risk_level = 'Medium'

    lib_names = "; ".join(l[0] for l in libraries)
    lib_versions = "; ".join(f"{l[0]} {l[1]}" if l[1] else l[0] for l in libraries)

    return {
        "Folder": folder,
        "Simple Name": simple_name,
        "Visual GUID": guid,
        "Version": version,
        "Detected Libraries": lib_names,
        "Library Versions": lib_versions,
        "Library Count": len(libraries),
        "Licenses Found": "; ".join(sorted(licenses)),
        "License Risk": risk_level,
        "Has GPL": "Yes" if has_gpl else "No",
        "Has Restrictive License": "Yes" if has_restrictive else "No",
        "External JS Files": "; ".join(external_js) if external_js else "",
        "External JS Count": len(external_js),
    }


def scan_single_visual(args):
    """Scan a single visual folder for OSS libraries and licenses.

    Standalone entry point for ProcessPoolExecutor. For the read-once pipeline,
    use scan_oss_content() directly with pre-read content.
    """
    extracted_path, folder = args

    folder_path = os.path.join(extracted_path, folder)
    if not os.path.isdir(folder_path):
        return None

    simple_name, guid, version = parse_folder_name(folder)

    cleaned_path = os.path.join(folder_path, 'cleaned.json')
    cleaned_data = read_cleaned_json(cleaned_path)

    if not guid:
        guid = cleaned_data.get('visual', {}).get('guid', '')

    # Read files
    js_content = ''
    js_path = os.path.join(folder_path, 'internal.js')
    if os.path.exists(js_path):
        try:
            with open(js_path, 'r', encoding='utf-8', errors='ignore') as f:
                js_content = f.read()
        except Exception:
            pass

    css_content = ''
    css_path = os.path.join(folder_path, 'visual.css')
    if os.path.exists(css_path):
        try:
            with open(css_path, 'r', encoding='utf-8', errors='ignore') as f:
                css_content = f.read()
        except Exception:
            pass

    return scan_oss_content(js_content, css_content, cleaned_data,
                            folder, simple_name, guid, version)


def scan_all(extracted_path=None):
    """Scan all extracted visuals for OSS libraries and return results in memory.

    This is the primary entry point when called from GenerateScanReport.py.

    Args:
        extracted_path: Path to Extracted/ folder. Defaults to cwd/Extracted.

    Returns:
        List of dicts, one per visual version, with all OSS scan columns.
    """
    if extracted_path is None:
        extracted_path = os.path.join(os.getcwd(), "Extracted")

    if not os.path.isdir(extracted_path):
        logger.error(f"Extracted directory not found: {extracted_path}")
        return []

    folders = [f for f in os.listdir(extracted_path)
               if os.path.isdir(os.path.join(extracted_path, f))]
    logger.info(f"OSS scan: {len(folders)} visual folders")

    results = []
    total = len(folders)
    completed = 0

    args_list = [(extracted_path, folder) for folder in folders]

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

    logger.info(f"OSS scan complete: {len(results)} visuals")
    return results


def main():
    """Standalone entry point -- scans and writes CSV for debugging."""
    workspace_path = os.getcwd()
    output_path = os.path.join(workspace_path, "oss_scan_results.csv")

    results = scan_all()
    if not results:
        return

    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=CSV_COLUMNS)
        writer.writeheader()
        for row in sorted(results, key=lambda r: r.get("Folder", "")):
            writer.writerow(row)

    logger.info(f"Wrote {len(results)} results to {output_path}")


if __name__ == "__main__":
    main()
