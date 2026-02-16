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

# Script to download Power BI Custom Visuals metadata from the Power Automate API
# and generate the output CSV/MD files. Replaces the Excel Power Query workbook.
#
# Configuration (environment variables or .env file):
#   SUBSCRIPTION_EMAIL      - Email address for API authentication
#
# Usage:
#   python DownloadMetadata.py
#
# The script generates 4 files in the workspace root:
#   - Custom Visuals.csv       (31 columns, full AppSource metadata)
#   - Visuals Summary.csv      (12 columns, summary view)
#   - Visuals Summary.md       (Markdown table for wiki)
#   - Unlisted Visuals.csv     (4 columns, visuals removed from AppSource)

import os
import csv
import logging
import sys
import unicodedata
import requests

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Ensure UTF-8 console output on Windows
if sys.platform.startswith('win'):
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')

# --------------------------------------------------------------------------
# Constants
# --------------------------------------------------------------------------

GITHUB_PBIVIZ_VERSIONS_URL = (
    "https://github.com/DataChant/PowerBI-Visuals-AppSource/blob/main/"
    "All%20Visuals/PBIVIZ%20with%20versions/"
)

CUSTOM_VISUALS_COLUMNS = [
    "ID", "Name", "Description", "Long Summary", "Description Full",
    "Publisher", "Version", "LegalTerms", "PrivacyPolicyUrl", "SupportLink",
    "Categories", "Image", "LargeIconUri", "Keywords", "Popularity",
    "HasFreePlans", "Release Date", "PBIVIZ", "PBIX", "App Free Type",
    "Link", "Is Certified", "Certified", "# of Ratings", "Average Rating",
    "CSAT", "NPS", "Favorite New", "Filename", "Simple Filename",
    "Visual GUID"
]

VISUALS_SUMMARY_CSV_COLUMNS = [
    "Custom Visual", "Publisher", "Description", "Version",
    "LegalTerms", "PrivacyPolicyUrl", "SupportLink", "Release Date",
    "AppSource Link", "Is Certified", "Versioned pbiviz", "Visual GUID"
]

VISUALS_SUMMARY_MD_COLUMNS = [
    "Custom Visual", "Publisher", "Description", "Version",
    "LegalTerms", "PrivacyPolicyUrl", "SupportLink", "Release Date",
    "AppSource Link", "Is Certified", "Visual GUID", "Versioned pbiviz"
]

UNLISTED_COLUMNS = ["Custom Visual", "Publisher", "Description", "GUID"]

# Fields treated as Int64 in the Power Query (truncated to int)
INT_FIELDS = {"# of Ratings", "Average Rating", "CSAT", "NPS", "Favorite New"}

# --------------------------------------------------------------------------
# Configuration loading
# --------------------------------------------------------------------------

def load_config():
    """Load API URL and email from environment variables or .env file."""
    # Try loading from .env file if python-dotenv is available
    try:
        from dotenv import load_dotenv
        # Search for .env in the current working directory and script directory
        script_dir = os.path.dirname(os.path.abspath(__file__))
        env_paths = [
            os.path.join(os.getcwd(), '.env'),
            os.path.join(script_dir, '.env'),
            os.path.join(script_dir, '..', '.env'),
            os.path.join(script_dir, '..', '..', '.env'),
        ]
        for env_path in env_paths:
            if os.path.exists(env_path):
                load_dotenv(env_path)
                logger.info(f"Loaded .env from {env_path}")
                break
    except ImportError:
        pass  # python-dotenv not installed, use env vars directly

    api_url = os.environ.get(
        'POWERBI_VISUALS_API_URL',
        'https://default2273c41bb8d045afbee6e08496ae67.18.environment.api.powerplatform.com'
        '/powerautomate/automations/direct/workflows/126319d395d1453e8b229b11a7037e32'
        '/triggers/manual/paths/invoke/LicenseKey/{email}'
        '?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0'
        '&sig=0u8mxUYW2rKnQR0nUke6LI_PGCeuqqkKwtJR8Gf1d8c'
    )
    email = os.environ.get('SUBSCRIPTION_EMAIL', '')

    if not email:
        logger.error("SUBSCRIPTION_EMAIL environment variable is not set.")
        sys.exit(1)

    return api_url, email


# --------------------------------------------------------------------------
# API fetch
# --------------------------------------------------------------------------

def fetch_custom_visuals(api_url, email):
    """
    Fetch custom visuals metadata from the Power Automate API.

    Args:
        api_url: Full API URL with {email} placeholder
        email: Subscription email to insert into the URL

    Returns:
        List of dicts, each with 31 fields describing a custom visual.
    """
    url = api_url.replace('{email}', email)

    logger.info("Fetching custom visuals from API...")
    response = requests.get(url, timeout=120)
    response.raise_for_status()

    data = response.json()

    # Navigate the nested JSON: Dataset -> results[0] -> tables[0] -> rows
    rows = data["Dataset"]["results"][0]["tables"][0]["rows"]
    logger.info(f"API returned {len(rows)} rows")

    # Strip the "Custom Visuals[...]" prefix from field names
    visuals = []
    for row in rows:
        cleaned = {}
        for key, value in row.items():
            clean_key = key
            if clean_key.startswith("Custom Visuals[") and clean_key.endswith("]"):
                clean_key = clean_key[len("Custom Visuals["):-1]
            cleaned[clean_key] = value
        visuals.append(cleaned)

    # Filter out test visual
    visuals = [v for v in visuals if v.get("Name") != "powerbivisual-int-test01"]

    logger.info(f"Processed {len(visuals)} visuals (after filtering)")
    return visuals


# --------------------------------------------------------------------------
# Type formatting helpers
# --------------------------------------------------------------------------

def format_bool(value):
    """Format a value as TRUE/FALSE for CSV output."""
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, str):
        return "TRUE" if value.lower() in ('true', '1') else "FALSE"
    return "TRUE" if value else "FALSE"


def format_datetime(value):
    """Format a datetime value as M/D/YYYY H:MM for CSV output.
    Handles ISO 8601 from the API, epoch timestamps, and already-formatted strings."""
    import re
    from datetime import datetime, timezone

    if not value and value != 0:
        return ""

    # Handle numeric (epoch milliseconds from JSON)
    if isinstance(value, (int, float)):
        try:
            dt = datetime.fromtimestamp(value / 1000, tz=timezone.utc)
            return f"{dt.month}/{dt.day}/{dt.year} {dt.hour}:{dt.minute:02d}"
        except (OSError, ValueError, OverflowError):
            return str(value)

    s = str(value).strip()
    if not s:
        return ""

    # Already in M/D/YYYY format — return as-is
    if '/' in s and 'T' not in s:
        return s

    # ISO 8601: strip timezone and fractional seconds, then parse
    try:
        # Remove timezone suffix (Z, +HH:MM, -HH:MM) and fractional seconds
        clean = re.sub(r'(\.\d+)?(Z|[+-]\d{2}:\d{2})?$', '', s)
        dt = datetime.fromisoformat(clean)
        return f"{dt.month}/{dt.day}/{dt.year} {dt.hour}:{dt.minute:02d}"
    except (ValueError, TypeError):
        pass

    return s


def format_date_only(value):
    """Format a datetime value as M/D/YYYY for CSV/MD output."""
    dt_str = format_datetime(value)
    if dt_str and ' ' in dt_str:
        return dt_str.split(' ')[0]
    return dt_str


def format_int(value):
    """Format a value as integer (round to nearest, matching Power Query Int64.From)."""
    if value is None or value == "":
        return ""
    try:
        return str(round(float(value)))
    except (ValueError, TypeError):
        return str(value)


def format_number(value):
    """Format a numeric value, preserving decimals. Whole numbers drop the .0."""
    if value is None or value == "":
        return ""
    try:
        f = float(value)
        # If it's a whole number, format without decimals
        if f == int(f):
            return str(int(f))
        return str(f)
    except (ValueError, TypeError):
        return str(value)


def clean_text(value):
    """Remove control characters from text (matching Power Query Text.Clean)."""
    if not value:
        return value
    return ''.join(c for c in str(value) if unicodedata.category(c) != 'Cc' or c in ('\n', '\r', '\t'))


def strip_newlines(value):
    """Remove newline/carriage-return characters (matching Excel CSV export behavior)."""
    if not value:
        return value
    return str(value).replace('\r\n', ' ').replace('\n', ' ').replace('\r', ' ')


def safe_str(value):
    """Convert a value to string, handling None."""
    if value is None:
        return ""
    return str(value)


# --------------------------------------------------------------------------
# CSV Generation
# --------------------------------------------------------------------------

def format_row_for_custom_visuals_csv(visual):
    """Format a single visual's data for Custom Visuals.csv output."""
    row = {}
    for col in CUSTOM_VISUALS_COLUMNS:
        val = visual.get(col, "")
        if col == "Popularity":
            row[col] = format_number(val)
        elif col in ("HasFreePlans", "Certified"):
            row[col] = format_bool(val)
        elif col == "Release Date":
            row[col] = format_datetime(val)
        elif col in INT_FIELDS:
            row[col] = format_int(val)
        else:
            row[col] = safe_str(val)
    return row


def generate_custom_visuals_csv(data, output_path):
    """
    Generate Custom Visuals.csv with all 31 columns.

    Args:
        data: List of visual dicts from the API
        output_path: Path to write the CSV file
    """
    logger.info(f"Writing Custom Visuals.csv ({len(data)} rows)...")

    with open(output_path, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=CUSTOM_VISUALS_COLUMNS)
        writer.writeheader()
        for visual in data:
            row = format_row_for_custom_visuals_csv(visual)
            writer.writerow(row)

    logger.info(f"Written: {output_path}")


def generate_visuals_summary_csv(data, output_path):
    """
    Generate Visuals Summary.csv with 12 derived columns.

    Args:
        data: List of visual dicts from the API
        output_path: Path to write the CSV file
    """
    logger.info(f"Writing Visuals Summary.csv ({len(data)} rows)...")

    # Build summary rows
    summary_rows = []
    for visual in data:
        filename = safe_str(visual.get("Filename", ""))
        versioned_pbiviz = GITHUB_PBIVIZ_VERSIONS_URL + filename if filename else ""

        row = {
            "Custom Visual": clean_text(safe_str(visual.get("Name", ""))),
            "Publisher": safe_str(visual.get("Publisher", "")),
            "Description": clean_text(safe_str(visual.get("Description", ""))),
            "Version": safe_str(visual.get("Version", "")),
            "LegalTerms": safe_str(visual.get("LegalTerms", "")),
            "PrivacyPolicyUrl": safe_str(visual.get("PrivacyPolicyUrl", "")),
            "SupportLink": safe_str(visual.get("SupportLink", "")),
            "Release Date": format_date_only(visual.get("Release Date", "")),
            "AppSource Link": safe_str(visual.get("Link", "")),
            "Is Certified": safe_str(visual.get("Is Certified", "")),
            "Versioned pbiviz": versioned_pbiviz,
            "Visual GUID": safe_str(visual.get("Visual GUID", "")),
        }
        summary_rows.append(row)

    # Sort by Release Date descending (newest first), then by name A-Z as tie-breaker
    from datetime import datetime
    def parse_date_for_sort(date_str):
        try:
            return datetime.strptime(date_str, "%m/%d/%Y")
        except (ValueError, TypeError):
            return datetime.min
    summary_rows.sort(key=lambda r: (-parse_date_for_sort(r["Release Date"]).toordinal(),
                                      r["Custom Visual"]))

    with open(output_path, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=VISUALS_SUMMARY_CSV_COLUMNS)
        writer.writeheader()
        for row in summary_rows:
            writer.writerow(row)

    logger.info(f"Written: {output_path}")


# --------------------------------------------------------------------------
# Markdown Generation
# --------------------------------------------------------------------------

def escape_md_description(text):
    """Escape special characters in description for markdown table cells.
    Matches the Power Query escaping rules exactly."""
    if not text:
        return text
    text = text.replace("[", "/[")
    text = text.replace("(", "\\(")
    text = text.replace(")", "/)")
    text = text.replace("|", "\\|")
    return text


def wrap_md_link(text, url):
    """Wrap a URL in markdown link syntax."""
    if not url:
        return text
    return f"[{text}]({url})"


def generate_visuals_summary_md(data, output_path):
    """
    Generate Visuals Summary.md as a markdown pipe-table.

    Args:
        data: List of visual dicts from the API
        output_path: Path to write the MD file
    """
    logger.info(f"Writing Visuals Summary.md ({len(data)} rows)...")

    # Build rows with markdown formatting
    md_rows = []
    for visual in data:
        filename = safe_str(visual.get("Filename", ""))
        simple_filename = safe_str(visual.get("Simple Filename", ""))

        # URL-encode the simple filename for the image URL
        encoded_simple = simple_filename.replace("(", "/(").replace(")", "/)").replace(" ", "%20")

        versioned_pbiviz_url = GITHUB_PBIVIZ_VERSIONS_URL + filename if filename else ""

        row = {
            "Custom Visual": clean_text(safe_str(visual.get("Name", ""))),
            "Publisher": safe_str(visual.get("Publisher", "")),
            "Description": escape_md_description(
                clean_text(safe_str(visual.get("Description", "")))
            ),
            "Version": safe_str(visual.get("Version", "")),
            "LegalTerms": wrap_md_link("legal terms", safe_str(visual.get("LegalTerms", ""))),
            "PrivacyPolicyUrl": wrap_md_link("privacy", safe_str(visual.get("PrivacyPolicyUrl", ""))),
            "SupportLink": wrap_md_link("support", safe_str(visual.get("SupportLink", ""))),
            "Release Date": format_date_only(visual.get("Release Date", "")),
            "AppSource Link": wrap_md_link(
                "AppSource page", safe_str(visual.get("Link", ""))
            ),
            "Is Certified": safe_str(visual.get("Is Certified", "")),
            "Visual GUID": safe_str(visual.get("Visual GUID", "")),
            "Versioned pbiviz": wrap_md_link("Versioned pbiviz", versioned_pbiviz_url),
        }
        md_rows.append(row)

    # Sort by Custom Visual name ascending (A-Z)
    md_rows.sort(key=lambda r: r["Custom Visual"])

    with open(output_path, 'w', encoding='utf-8') as f:
        # Header row
        header = "| " + " | ".join(VISUALS_SUMMARY_MD_COLUMNS) + " |"
        f.write(header + "\n")

        # Delimiter row
        delim = "| " + " | ".join(["-"] * len(VISUALS_SUMMARY_MD_COLUMNS)) + " |"
        f.write(delim + "\n")

        # Data rows
        for row in md_rows:
            cells = [row.get(col, "") for col in VISUALS_SUMMARY_MD_COLUMNS]
            line = "| " + " | ".join(cells) + " |"
            f.write(line + "\n")

    logger.info(f"Written: {output_path}")


# --------------------------------------------------------------------------
# Unlisted Visuals
# --------------------------------------------------------------------------

def load_csv_as_dict(file_path, key_field):
    """Load a CSV file into a dict keyed by the specified field."""
    result = {}
    if not os.path.exists(file_path):
        return result
    try:
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for row in reader:
                key = row.get(key_field, "").strip()
                if key:
                    result[key] = row
    except Exception as e:
        logger.warning(f"Could not read {file_path}: {e}")
    return result


def generate_unlisted_visuals_csv(new_data, output_path):
    """
    Generate Unlisted Visuals.csv by comparing new API data with previous snapshot.

    Visuals present in the previous Custom Visuals.csv but absent from the new API
    data are considered "unlisted" (removed from AppSource).

    Args:
        new_data: List of visual dicts from the API (current data)
        output_path: Path to write the Unlisted Visuals CSV
    """
    workspace = os.path.dirname(output_path)
    custom_visuals_path = os.path.join(workspace, "Custom Visuals.csv")

    # Load previous Custom Visuals.csv (before it gets overwritten)
    previous_data = load_csv_as_dict(custom_visuals_path, "Visual GUID")

    # Load existing Unlisted Visuals.csv
    existing_unlisted = load_csv_as_dict(output_path, "GUID")

    # Build set of current GUIDs from the new API data
    current_guids = {safe_str(v.get("Visual GUID", "")) for v in new_data if v.get("Visual GUID")}

    # Find newly unlisted visuals (in previous but not in current)
    newly_unlisted = {}
    for guid, row in previous_data.items():
        if guid and guid not in current_guids:
            newly_unlisted[guid] = {
                "Custom Visual": row.get("Name", ""),
                "Publisher": row.get("Publisher", ""),
                "Description": row.get("Description", ""),
                "GUID": guid,
            }

    # Merge: existing unlisted + newly unlisted, minus any that reappeared
    merged = {}
    for guid, row in existing_unlisted.items():
        if guid not in current_guids:
            merged[guid] = row
    for guid, row in newly_unlisted.items():
        if guid not in merged:
            merged[guid] = row

    # Count changes
    new_count = len(set(newly_unlisted.keys()) - set(existing_unlisted.keys()))
    reappeared_count = len([g for g in existing_unlisted if g in current_guids])
    if new_count > 0:
        logger.info(f"Unlisted Visuals: {new_count} newly unlisted")
    if reappeared_count > 0:
        logger.info(f"Unlisted Visuals: {reappeared_count} reappeared on AppSource")

    # Write output
    logger.info(f"Writing Unlisted Visuals.csv ({len(merged)} rows)...")
    with open(output_path, 'w', encoding='utf-8-sig', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=UNLISTED_COLUMNS)
        writer.writeheader()
        for guid in sorted(merged.keys(), key=str.lower):
            writer.writerow(merged[guid])

    logger.info(f"Written: {output_path}")


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def main():
    """Main entry point - fetches data and generates all output files."""
    api_url, email = load_config()

    workspace = os.getcwd()

    # Fetch data from API
    data = fetch_custom_visuals(api_url, email)

    if not data:
        logger.error("No data returned from API. Aborting.")
        sys.exit(1)

    # Define output paths
    custom_visuals_path = os.path.join(workspace, "Custom Visuals.csv")
    visuals_summary_csv_path = os.path.join(workspace, "Visuals Summary.csv")
    visuals_summary_md_path = os.path.join(workspace, "Visuals Summary.md")
    unlisted_path = os.path.join(workspace, "Unlisted Visuals.csv")

    # Generate Unlisted Visuals FIRST (reads previous Custom Visuals.csv before overwrite)
    generate_unlisted_visuals_csv(data, unlisted_path)

    # Generate output files
    generate_custom_visuals_csv(data, custom_visuals_path)
    generate_visuals_summary_csv(data, visuals_summary_csv_path)
    generate_visuals_summary_md(data, visuals_summary_md_path)

    # Summary
    logger.info(f"Done. {len(data)} visuals processed.")


if __name__ == "__main__":
    main()
