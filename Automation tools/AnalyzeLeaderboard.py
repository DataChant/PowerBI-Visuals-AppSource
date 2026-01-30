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

import logging
import csv
import io
import os
import subprocess
from datetime import datetime
from turtle import title

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

REPO_NAME = 'PowerBI-Visuals-AppSource'
FILENAME_TO_ANALYZE = "Custom Visuals.csv"  # Summary file

_leaderboard_data = dict()


def get_all_commit_shas():
    repo_path = os.getcwd()
    
    result = subprocess.run(
        ['git', '-C', repo_path, 'log', '--pretty=format:%H|%cI', FILENAME_TO_ANALYZE],
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
        commit = {
            "sha": sha,
            "date": iso_date
        }
        commits.append(commit)  # iso_date format is YYYY-MM-DDTHH:MM:SS±HH:MM
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

    content = result.stdout
    if content.startswith('\ufeff'):
        content = content.lstrip('\ufeff')

    return content


_previous_snapshot = dict()  # Track previous state for diff comparison
_comparison_fields = ["Popularity", "# of Ratings", "Average Rating"]


def parse_numeric(value):
    """Parse a string value to float, returning None if invalid."""
    if value is None or value == "":
        return None
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def format_delta(delta):
    """Format a delta value with +/- sign."""
    if delta is None:
        return ""
    if delta > 0:
        return f"+{delta:g}"
    elif delta < 0:
        return f"{delta:g}"
    return "0"


def calculate_deltas(old_row, new_row):
    """Calculate numeric deltas between old and new row."""
    deltas = {}
    for field in _comparison_fields:
        old_val = parse_numeric(old_row.get(field) if old_row else None)
        new_val = parse_numeric(new_row.get(field))

        if new_val is not None and old_val is not None:
            deltas[f"{field} Change"] = new_val - old_val
        
    return deltas


def has_visual_changed(old_row, new_row):
    """Check if any tracked field has changed between two snapshots."""
    if old_row is None:
        return True  # New visual
    for field in _comparison_fields:
        if old_row.get(field, "") != new_row.get(field, ""):
            return True
    return False


# Main execution
def process_file(content, date, is_first_commit):
    global _previous_snapshot
    csv_dict_reader = csv.DictReader(io.StringIO(content))
    current_snapshot = {}
    changes_in_data = {}

    for row in csv_dict_reader:
        guid = row.get("Visual GUID")
        if not guid:
            continue
        current_snapshot[guid] = row

        if is_first_commit:
            # First commit: include everything as baseline (no deltas)
            row_with_deltas = dict(row)
            row_with_deltas["_deltas"] = {f"{field} Change": None for field in _comparison_fields}
            changes_in_data[guid] = row_with_deltas
        else:
            # Subsequent commits: only include if changed
            old_row = _previous_snapshot.get(guid)
            if has_visual_changed(old_row, row):
                row_with_deltas = dict(row)
                
                deltas = calculate_deltas(old_row, row)
                if deltas:
                    row_with_deltas["_deltas"] = deltas
                    changes_in_data[guid] = row_with_deltas
                else:
                    pass

    # Track removed visuals (existed before, not in current)
    if not is_first_commit:
        for guid in _previous_snapshot:
            if guid not in current_snapshot:
                # Mark as removed by including with empty values
                changes_in_data[guid] = {
                    "Visual GUID": guid,
                    "Name": _previous_snapshot[guid].get("Name", ""),
                    "Publisher": _previous_snapshot[guid].get("Publisher", ""),
                    "Version": "",
                    "Popularity": "",
                    "# of Ratings": "",
                    "Average Rating": "",
                    "Is Certified": "",
                    "_removed": True,
                    "_deltas": {f"{field} Change": None for field in _comparison_fields}
                }

    if changes_in_data:
        _leaderboard_data[date] = changes_in_data
    else:
        pass
    # Update previous snapshot for next iteration
    _previous_snapshot = current_snapshot
               

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
    
    img_tag = f'<img src="{img_src}" width="{width}" alt="{alt_text}" style="max-width: 100%; height: auto;"/>'
    if not url:
        return img_tag
    
    # Simple link that GitHub allows
    return f'<a href="{url}">{img_tag}\n</a>'


def generate_leadership_file():

    try:

        with open('leaderboard_data.csv', 'w', encoding='utf-8', newline='') as file:
            csv_dict_writer = csv.DictWriter(file, fieldnames=[
                "Snapshot Date", "Visual GUID", "Name", "Publisher", "Version",
                "Popularity", "Popularity Change",
                "# of Ratings", "# of Ratings Change",
                "Average Rating", "Average Rating Change",
                "Is Certified", "Is Removed"
            ])
            csv_dict_writer.writeheader()

            # Sort dates chronologically for consistent output
            sorted_dates = sorted(_leaderboard_data.keys())

            for date in sorted_dates:
                visuals = _leaderboard_data[date]
                for guid, row in visuals.items():
                    is_removed = row.get("_removed", False)
                    deltas = row.get("_deltas", {})
                    output_row = {
                        "Snapshot Date": date,
                        "Visual GUID": guid,
                        "Name": row.get("Name", ""),
                        "Publisher": row.get("Publisher", ""),
                        "Version": row.get("Version", ""),
                        "Popularity": row.get("Popularity", ""),
                        "Popularity Change": format_delta(deltas.get("Popularity Change")),
                        "# of Ratings": row.get("# of Ratings", ""),
                        "# of Ratings Change": format_delta(deltas.get("# of Ratings Change")),
                        "Average Rating": row.get("Average Rating", ""),
                        "Average Rating Change": format_delta(deltas.get("Average Rating Change")),
                        "Is Certified": row.get("Is Certified", ""),
                        "Is Removed": "Yes" if is_removed else "",
                    }
                    csv_dict_writer.writerow(output_row)

        logger.info("Created leaderboard_data.csv successfully.")
    except Exception as e:
        logger.error("Failed to write leaderboard_data.csv file: %s", str(e))


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

    # Process commits in chronological order (oldest first)
    commits_chronological = list(reversed(commits))

    for i, commit in enumerate(commits_chronological):
        sha = commit.get("sha")
        date = commit.get("date")
        file_content = get_file_from_git(FILENAME_TO_ANALYZE, sha)

        if file_content:
            is_first_commit = (i == 0)
            process_file(file_content, date, is_first_commit)

    generate_leadership_file()

if __name__ == "__main__":
    main()


