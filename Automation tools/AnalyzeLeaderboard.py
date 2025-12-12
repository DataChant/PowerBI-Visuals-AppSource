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


# Main execution
def process_file(content, date):
    csv_dict_reader = csv.DictReader(io.StringIO(content))
    visuals_in_date = _leaderboard_data.get(date, {})
    
    for i, row in enumerate(csv_dict_reader, 1):
        guid = row.get("Visual GUID")
        if not guid:
            continue
        
        visuals_in_date[guid] = row

    _leaderboard_data[date] = visuals_in_date
               

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
                "Snapshot Date", "Visual GUID", "Name", "Publisher", "Version", "Popularity", "# of Ratings", "Average Rating", "Is Certified"
            ])
            csv_dict_writer.writeheader()
            for date, visuals in _leaderboard_data.items():
                for guid, row in visuals.items():
                    output_row = {
                        "Snapshot Date": date,
                        "Visual GUID": guid,
                        "Name": row.get("Name", ""),
                        "Publisher": row.get("Publisher", ""),
                        "Version": row.get("Version", ""),
                        "Popularity": row.get("Popularity", ""),
                        "# of Ratings": row.get("# of Ratings", "0"),
                        "Average Rating": row.get("Average Rating", "0"),
                        "Is Certified": row.get("Is Certified", "No"),
                    }
                    csv_dict_writer.writerow(output_row)

        logger.info("Created leaderboard_date.csv successfully.")
    except Exception as e:
        logger.error("Failed to write leaderboard_date.csv file: %s", str(e))


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

    for commit in commits:
        sha = commit.get("sha")
        date = commit.get("date")
        file_content = get_file_from_git(FILENAME_TO_ANALYZE, sha)
        
        if file_content:
            process_file(file_content, date)

    generate_leadership_file()

if __name__ == "__main__":
    main()


