import logging
import csv
import io
import os
import subprocess


# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)


REPO_NAME = 'PowerBI-Visuals-AppSource'

FILENAME_TO_ANALYZE = "Visuals Summary.csv"  # Summary file
LATEST_DATA_FILE = "Custom Visuals.csv" # Detailed snapshot of all visuals on AppSource including more fields

LATEST_COMMIT_INDEX = 2
PREVIOUS_COMMIT_INDEX = 3

_latest_data = dict()
_previous_data = dict()
_version_changes = set()
_other_changes = dict()
_new_certs = set()
_removed_certs = set()
_new_visuals = set()
_removed_visuals = set()
_latest_all_data = dict()


def get_all_commit_shas():
    repo_path = os.getcwd()
    
    result = subprocess.run(
        ['git', '-C', repo_path, 'log', '--pretty=format:%H|%cI'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        encoding='utf-8'
    )
    if result.returncode != 0:
        raise Exception(f"Git error: {result.stderr}")
    
    lines = result.stdout.splitlines()
    commits = []
    for line in lines:
        sha, iso_date = line.split("|")
        commits.append((sha, iso_date))  # iso_date format is YYYY-MM-DDTHH:MM:SS±HH:MM
    return commits


def get_file_from_git(file_path, commit_sha):
    repo_path = os.getcwd()
    result = subprocess.run(
        ['git', '-C', repo_path, 'show', f'{commit_sha}:{file_path}'],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        encoding='utf-8'
    )
    if result.returncode != 0:
        raise Exception(f"Git error: {result.stderr}")
    return result.stdout


# Main execution
def compare_csv(old_csv_content, new_csv_content):
    
    # Load Custom Visuals.csv into latest_all_data
    latest_data_file_path = os.path.join(os.getcwd(), LATEST_DATA_FILE)
    if os.path.exists(latest_data_file_path):
        with open(latest_data_file_path, encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                guid = row.get("Visual GUID")
                if guid:
                    _latest_all_data[guid] = row
    else:
        logger.warning(f"{latest_data_file_path} not found in workspace.")

    old_csv_dict_reader = csv.DictReader(io.StringIO(old_csv_content))
    for i, row in enumerate(old_csv_dict_reader, 1):
        _previous_data[row["Visual GUID"]] = row

    
    latest_csv_dict_reader = csv.DictReader(io.StringIO(new_csv_content))
    for i, row in enumerate(latest_csv_dict_reader, 1):
        _latest_data[row["Visual GUID"]] = row

    # Determining new visuals
    global _new_visuals
    _new_visuals = set(_latest_data.keys()) - set(_previous_data.keys())
    
    # Determining removed visuals
    global _removed_visuals
    _removed_visuals = set(_previous_data.keys()) - set(_latest_data.keys())

    # Comparing rows that exist in both versions
    common_visuals = set(_latest_data.keys()) & set(_previous_data.keys())
       
    for visual in common_visuals:
        old_row = _previous_data[visual]
        new_row = _latest_data[visual]
        major_change = False

        old_version = old_row.get("Version")
        new_version = new_row.get("Version")
        if old_version != new_version:
            _version_changes.add(visual)
            major_change = True
        
        old_certified = old_row.get("Is Certified")
        new_certified = new_row.get("Is Certified")
        
        if old_certified != new_certified:
            major_change = True
            if new_certified == "Certified":
                _new_certs.add(visual)
            else:
                _removed_certs.add(visual)

        if major_change:
            continue

        for key, new_value in new_row.items():
            old_value = old_row.get(key)
            if old_value == new_value:
                continue
            change = {
                "Old Value": old_value,
                "New Value": new_value
            }
            changes = _other_changes.get(visual, {})
            changes[key] = change
            _other_changes[visual] = changes

    return

def get_workspace_path() -> str:
    """Get the workspace path, similar to ReplaceSharePointPathWithLocal in VBA."""
    # For now, we'll use the current working directory
    return os.getcwd()

def create_github_link(url: str, text: str, class_name: str = "") -> str:
    """
    Create a GitHub Discussions-compatible link.
    """
    if not url or not text:
        return text  # Return just the text if URL is empty
    
    # Use simple, clean HTML with visual indicator
    return f'<a href="{url}">{text}</a>'

def create_github_image_link(url: str, img_src: str, alt_text: str, width: int = 100) -> str:
    """Create a GitHub Discussions-compatible image link."""
    if not url or not img_src:
        return f'<img src="{img_src}" width="{width}" alt="{alt_text}" style="max-width: 100%; height: auto;"/>' if img_src else "No thumbnail"
    
    img_tag = f'<img src="{img_src}" width="{width}" alt="{alt_text}" style="max-width: 100%; height: auto;"/>'
    
    # Simple link that GitHub allows
    return f'<a href="{url}">{img_tag}\n</a>'


def writeDiff(file, title, set_of_changes, data_dict):
    
    if not set_of_changes:
        return
    
    length_of_changes = len(set_of_changes)
    if length_of_changes == 0:
        return
    
    
    title_str = title
    if length_of_changes == 1:
        title_str = title[:-1]

    if title == "Other Changes":
        title_str = "Changes in Listings or Terms"

    file.write(f"\n## {length_of_changes} {title_str}: ##\n")
    file.write('\n<table style="width: 800px; border: none !important; border-collapse: collapse; border-spacing: 0;">\n')
    
    version_line = ""

    items = set_of_changes.keys() if isinstance(set_of_changes, dict) else set_of_changes
    for guid in items:
        visual = data_dict.get(guid, {})

        version = visual.get("Version", "")
        thumbnail_url = _latest_all_data.get(guid, {}).get("Image", "")
        
        visual_name = visual.get("Custom Visual", "")
        publisher = visual.get("Publisher", "")
        publisher_link = visual.get("SupportLink", "")

        publisher_line  = f"Publisher: {create_github_link(publisher_link, publisher)}"     
        description = visual.get("Description", "")
        guid_line = f"Direct Download: {create_github_link(f'https://github.com/DataChant/PowerBI-Visuals-AppSource/raw/refs/heads/main/All%20Visuals/PBIVIZ%20with%20guid/{guid}.pbiviz', f'{guid}.pbiviz')}"
        change_lines = []

        if title == "New Versions":
            # For version changes, we need to show the old version
            old_version = _previous_data.get(guid, {}).get("Version", "")
            version_line = f"Version Change: {old_version} ➔ {version}"
        elif title == "Other Changes":
            # For other changes, we need to show the old version
            changes = _other_changes.get(guid, {})
            for key, value in changes.items():
                if key == "PrivacyPolicyUrl":
                    key = "Privacy Policy"
                elif key == "SupportLink":
                    key = "Support Link"
                elif key == "LegalTerms":
                    key = "Legal Terms"
                elif key == "Custom Visual":
                    key = "Name"
                if isinstance(value, dict):
                    change_lines.append(f"{key}: {value['Old Value']} ➔ {value['New Value']}")  
        else:    
            version_line = f"Version: {version}"

        # Get AppSource URL from the data dictionary
        app_source_url = visual.get("AppSource Link", "")
        file.write('<tr>\n')
        
        # First column (image) - spans all 5 rows

        rowspan = 5
        if change_lines:
            rowspan = len(change_lines) + 4
        if thumbnail_url and app_source_url:
            image_link = create_github_image_link(app_source_url, thumbnail_url, visual_name, 100)
            file.write(f'  <td rowspan="{rowspan}" style="width: 120px; border: none !important; vertical-align: top; text-align: center;">{image_link}</td>\n')
        else:
            file.write(f'  <td rowspan="{rowspan}" style="width: 120px; border: none !important; vertical-align: top; text-align: center;">No thumbnail</td>\n')

        # Second column, first row (visual name)
        file.write(f'  <td style="width: 680px; border: none !important; padding: 4px;"><b>{visual_name}</b></td>\n')
        file.write('</tr>\n')
        
        # Second column, remaining rows
        file.write(f'<tr><td style="border: none !important; padding: 4px;">{publisher_line}</td></tr>\n')
        file.write(f'<tr><td style="border: none !important; padding: 4px;">{description}</td></tr>\n')
        file.write(f'<tr><td style="border: none !important; padding: 4px;">{guid_line}</td></tr>\n')
        if version_line:
            file.write(f'<tr><td style="border: none !important; padding: 4px;">{version_line}</td></tr>\n')
        
        elif change_lines:
            for change_line in change_lines:
                file.write(f'<tr><td style="border: none !important; padding: 4px;">{change_line}</td></tr>\n')

        file.write(f'<tr><td style="border: none !important; padding: 4px;"></td></tr>\n')
    file.write('</table>\n\n')


def generate_diff_file(previous_commit_date, latest_commit_date):
    new_count_str = ""
    if _new_visuals:
        new_count = len(_new_visuals)
        if new_count == 1:
            new_count_str = f"{new_count} new visual"
        else:
            new_count_str = f"{new_count} new visuals"
    else:
        new_count_str = "No new visuals"

    removed_count_str = ""
    if _removed_visuals:
        removed_count = len(_removed_visuals)
        removed_count_str = f", {removed_count} removed"

    versions_count_str = ""
    if _version_changes:
        versions_count = len(_version_changes)
        if versions_count == 1:
            versions_count_str = f", {versions_count} new version"
        else:
            versions_count_str = f", {versions_count} new versions"
    else:
        new_count_str = ", no new versions"

    certified_count_str = ""
    if _new_certs:
        certified_count = len(_new_certs)
        certified_count_str = f", {certified_count} certified"

    title = f"[{latest_commit_date}] {new_count_str}{removed_count_str}{versions_count_str}{certified_count_str}\n\n"

    try:
        with open('visual_summary_diff.txt', 'w', encoding='utf-8') as file:
            
            file.write(title)

            if _new_visuals or _removed_visuals or _other_changes:
                file.write(f"Here are the latest updates to the Power BI Visuals on Microsoft AppSource between {previous_commit_date} and {latest_commit_date}:")
                file.write("\n\n> **Note**: Links marked with 🔗 are external. Ctrl+click or right-click → 'Open in new tab' to open them in a new tab.")

            if _new_visuals:
                writeDiff(file, "New Custom Visuals", _new_visuals, _latest_data)

            if _new_certs:
                writeDiff(file, "Newly-Certified Visuals", _new_certs, _latest_data)

            if _removed_certs:
                writeDiff(file, "No Longer Certified", _removed_certs, _latest_data)
                
            if _removed_visuals:
                writeDiff(file, "Removed Custom Visuals", _removed_visuals, _previous_data)

            if _version_changes:
                writeDiff(file, "New Versions", _version_changes, _latest_data)
                
            if _other_changes:
                writeDiff(file, "Other Changes", _other_changes, _latest_data)
                

        logger.info("Summary written to visual_summary_diff.txt")
    except Exception as e:
        logger.error("Failed to write summary file: %s", str(e))


# Main execution
def main():
    """
    Main function that generates a GitHub Discussions-compatible summary of Power BI visual changes.
    
    The generated HTML uses simple markup that GitHub allows. Links include visual 
    indicators (🔗) to show they're external. Users can Ctrl+click or right-click to open in new tabs.
    """
    commits = get_all_commit_shas()
    if not commits or len(commits) < 2:
        logger.error("Not enough commits found or error fetching commits.")
        return

    # unpack (sha, date)
    latest_sha, latest_commit_date = commits[LATEST_COMMIT_INDEX]
    prev_sha, previous_commit_date = commits[PREVIOUS_COMMIT_INDEX]

    latest_content = get_file_from_git(FILENAME_TO_ANALYZE, latest_sha)
    previous_content = get_file_from_git(FILENAME_TO_ANALYZE, prev_sha)

    # Remove BOM if present
    if latest_content.startswith('\ufeff'):
        latest_content = latest_content.lstrip('\ufeff')
    if previous_content.startswith('\ufeff'):
        previous_content = previous_content.lstrip('\ufeff')

    # trim commit dates to YYYY-MM-DD
    latest_commit_date = latest_commit_date[:10]
    previous_commit_date = previous_commit_date[:10]

    if latest_content and previous_content:
        compare_csv(previous_content, latest_content)
        generate_diff_file(previous_commit_date, latest_commit_date)

if __name__ == "__main__":
    main()


