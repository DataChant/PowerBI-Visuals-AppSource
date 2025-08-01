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

# Script to download and update all custom visuals and their content from DataChant's snapshot of AppSource
# and extract the content of the pbiviz files for security auditing purposes.
import os
import csv
import requests
import shutil
from pathlib import Path
import logging
import zipfile
import json
import base64
from urllib.parse import urljoin


DOWNLOAD_ALL = False  # Set to True to download all visuals, False to only process existing files

# Global set for unique external JS files
EXTERNAL_JS_FILES = set()

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Add file handler to also write logs to a file
logger = logging.getLogger(__name__)
file_handler = logging.FileHandler('visual_extraction.log')
file_handler.setFormatter(logging.Formatter('%(asctime)s - %(levelname)s - %(message)s'))
logger.addHandler(file_handler)

def load_external_js_files():
    """Load existing external JS files from CSV if it exists."""
    workspace_path = get_workspace_path()
    csv_path = os.path.join(workspace_path, "external_js_files.csv")
    
    if not os.path.exists(csv_path):
        logger.debug("No existing external_js_files.csv found. Starting with empty set.")
        return
        
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
            if not content.strip():
                logger.debug("CSV file is empty")
                return
                
            f.seek(0)  # Reset file pointer to start
            reader = csv.DictReader(f)
            
            for row in reader:
                if "JavaScript File" in row:
                    EXTERNAL_JS_FILES.add(row["JavaScript File"])
                else:
                    logger.warning("Row missing 'JavaScript File' column")
                    
    except Exception as e:
        logger.error(f"Error loading external JS files from CSV: {str(e)}")
        logger.exception("Detailed error:")

def file_exists(file_path: str) -> bool:
    """Check if a file exists at the given path."""
    return Path(file_path).exists()

def get_workspace_path() -> str:
    """Get the workspace path, similar to ReplaceSharePointPathWithLocal in VBA."""
    # For now, we'll use the current working directory
    return os.getcwd()

def ensure_directories(base_folder: str) -> None:
    """Create necessary directories if they don't exist."""
    subdirs = [
        "",
        "PBIX",
        "PBIVIZ",
        "PBIVIZ with versions",
        "PBIVIZ with guid",
        "Images"
    ]

    for subdir in subdirs:
        dir_path = os.path.join(base_folder, subdir)
        os.makedirs(dir_path, exist_ok=True)

def download_file(url: str, target_path: str) -> bool:
    """Download a file from URL to the target path."""
    if not url:
        logger.warning(f"Empty URL provided for {target_path}")
        return False
        
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        with open(target_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
                
        logger.info(f"Successfully downloaded: {target_path}")
        return True
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Failed to download {url}: {str(e)}")
        return False
    except IOError as e:
        logger.error(f"Failed to save file {target_path}: {str(e)}")
        return False

def cleanup_files(workspace_path: str, mode: str, simple_filename: str, guid: str, is_certified: bool) -> None:
    """Clean up files from other directories based on certification status changes."""
    if mode == "All Visuals":
        # Clean up from Unlisted if file exists in All Visuals
        unlisted_paths = [
            os.path.join(workspace_path, "Unlisted", "PBIX", f"{simple_filename}.pbix"),
            os.path.join(workspace_path, "Unlisted", "Images", f"{simple_filename}.png"),
            os.path.join(workspace_path, "Unlisted", "PBIVIZ", f"{simple_filename}.pbiviz"),
            os.path.join(workspace_path, "Unlisted", "PBIVIZ with guid", f"{guid}.pbiviz")
        ]
        for path in unlisted_paths:
            if file_exists(path):
                try:
                    os.remove(path)
                    logging.info(f"Cleaned up unlisted file: {path}")
                except Exception as e:
                    logging.error(f"Failed to clean up {path}: {str(e)}")
    
    elif mode == "Certified" and is_certified:
        # Clean up from Uncertified if file is now certified
        uncert_paths = [
            os.path.join(workspace_path, "Uncertified", "PBIX", f"{simple_filename}.pbix"),
            os.path.join(workspace_path, "Uncertified", "Images", f"{simple_filename}.png"),
            os.path.join(workspace_path, "Uncertified", "PBIVIZ", f"{simple_filename}.pbiviz"),
            os.path.join(workspace_path, "Uncertified", "PBIVIZ with guid", f"{guid}.pbiviz")
        ]
        for path in uncert_paths:
            if file_exists(path):
                try:
                    os.remove(path)
                    logger.info(f"Cleaned up uncertified file: {path}")
                except Exception as e:
                    logger.error(f"Failed to clean up {path}: {str(e)}")
    
    elif mode == "Uncertified" and not is_certified:
        # Clean up from Certified if file is now uncertified
        cert_paths = [
            os.path.join(workspace_path, "Certified", "PBIX", f"{simple_filename}.pbix"),
            os.path.join(workspace_path, "Certified", "Images", f"{simple_filename}.png"),
            os.path.join(workspace_path, "Certified", "PBIVIZ", f"{simple_filename}.pbiviz"),
            os.path.join(workspace_path, "Certified", "PBIVIZ with guid", f"{guid}.pbiviz")
        ]
        for path in cert_paths:
            if file_exists(path):
                try:
                    os.remove(path)
                    logger.info(f"Cleaned up certified file: {path}")
                except Exception as e:
                    logger.error(f"Failed to clean up {path}: {str(e)}")

def copy_files_from_all_visuals(workspace_path: str, mode: str, simple_filename: str, guid: str, versioned_filename: str) -> None:
    """Copy files from All Visuals directory instead of downloading again."""
    try:
        source_paths = {
            "PBIVIZ with versions": (
                os.path.join(workspace_path, "All Visuals", "PBIVIZ with versions", versioned_filename),
                os.path.join(workspace_path, mode, "PBIVIZ with versions", versioned_filename)
            ),
            "PBIVIZ": (
                os.path.join(workspace_path, "All Visuals", "PBIVIZ", f"{simple_filename}.pbiviz"),
                os.path.join(workspace_path, mode, "PBIVIZ", f"{simple_filename}.pbiviz")
            ),
            "PBIVIZ with guid": (
                os.path.join(workspace_path, "All Visuals", "PBIVIZ with guid", f"{guid}.pbiviz"),
                os.path.join(workspace_path, mode, "PBIVIZ with guid", f"{guid}.pbiviz")
            ),
            "PBIX": (
                os.path.join(workspace_path, "All Visuals", "PBIX", f"{simple_filename}.pbix"),
                os.path.join(workspace_path, mode, "PBIX", f"{simple_filename}.pbix")
            ),
            "Images": (
                os.path.join(workspace_path, "All Visuals", "Images", f"{simple_filename}.png"),
                os.path.join(workspace_path, mode, "Images", f"{simple_filename}.png")
            )
        }

        for file_type, (src, dst) in source_paths.items():
            if file_exists(src):
                shutil.copy2(src, dst)
                logger.info(f"Copied {file_type} from All Visuals to {mode}")
            else:
                logger.warning(f"Source file not found: {src}")

    except Exception as e:
        logger.error(f"Failed to copy files from All Visuals: {str(e)}")


def process_visuals(mode: str) -> None:
    """Process visuals based on mode (All Visuals/Certified/Uncertified)."""
    workspace_path = get_workspace_path()
    base_folder = os.path.join(workspace_path, mode)
    
    # Ensure all required directories exist
    ensure_directories(base_folder)
    
    # Read the CSV file
    csv_path = os.path.join(workspace_path, "Custom Visuals.csv")
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            total_rows = sum(1 for row in reader)  # Count total rows
            f.seek(0)  # Reset file pointer
            next(reader)  # Skip header row
            
            for i, row in enumerate(reader, 1):
                # Get values from the correct columns as per VBA
                pbiviz_url = row.get('PBIVIZ', '')
                pbix_url = row.get('PBIX', '')
                simple_filename = row.get('Simple Filename', '')  # Short filename without version
                is_certified = row.get('Certified', '').lower() == 'true'
                versioned_filename = row.get('Filename', '')  # Full filename with version
                image_url = row.get('Image', '')
                guid = row.get('Visual GUID', '')

                if not simple_filename or not versioned_filename:
                    logger.error(f"Missing filename information, skipping row {i}")
                    continue

                # Skip rows based on certification status for specific modes
                if (mode == "Certified" and not is_certified) or \
                   (mode == "Uncertified" and is_certified):
                    continue

                # Check if file already exists
                version_path = os.path.join(base_folder, 'PBIVIZ with versions', versioned_filename)
                if file_exists(version_path) and not DOWNLOAD_ALL:
                    logger.debug(f"Skipping existing file: {simple_filename} ({i}/{total_rows})")
                    cleanup_files(workspace_path, mode, simple_filename, guid, is_certified)
                    continue

                # Process based on mode
                if mode != "All Visuals":
                    logger.info(f"Copying files for {simple_filename} ({i}/{total_rows})")
                    copy_files_from_all_visuals(workspace_path, mode, simple_filename, guid, versioned_filename)
                else:
                    # Download files for All Visuals mode
                    logger.info(f"Downloading files for {simple_filename} ({i}/{total_rows})")
                    
                    # Download versioned PBIVIZ
                    if pbiviz_url:
                        download_file(pbiviz_url, version_path)
                        
                        # Copy to regular PBIVIZ and GUID folders
                        pbiviz_path = os.path.join(base_folder, 'PBIVIZ', f"{simple_filename}.pbiviz")
                        guid_path = os.path.join(base_folder, 'PBIVIZ with guid', f"{guid}.pbiviz")
                        shutil.copy2(version_path, pbiviz_path)
                        shutil.copy2(version_path, guid_path)

                        extract_new_visual(version_path)

                    # Download PBIX file
                    if pbix_url:
                        pbix_path = os.path.join(base_folder, 'PBIX', f"{simple_filename}.pbix")
                        download_file(pbix_url, pbix_path)
                    
                    # Download Image
                    if image_url:
                        image_path = os.path.join(base_folder, 'Images', f"{simple_filename}.png")
                        download_file(image_url, image_path)

                # Clean up files from other directories based on certification status
                cleanup_files(workspace_path, mode, simple_filename, guid, is_certified)
                    
    except Exception as e:
        logger.error(f"Error processing {mode}: {str(e)}")

def handle_unlisted_visuals() -> None:
    """Move visuals that are not in the CSV to the Unlisted folder."""
    workspace_path = get_workspace_path()
    all_visuals_path = os.path.join(workspace_path, "All Visuals")
    unlisted_path = os.path.join(workspace_path, "Unlisted")
    
    # Ensure Unlisted directories exist
    ensure_directories(unlisted_path)
    
    # Read the CSV file to get the list of known visuals
    csv_path = os.path.join(workspace_path, "Custom Visuals.csv")
    known_simple_filenames = set()
    known_guids = set()
    
    try:
        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                simple_filename = row.get('Simple Filename', '').lower()  # Convert to lowercase
                guid = row.get('Visual GUID', '').lower()  # Convert to lowercase
                if simple_filename:
                    known_simple_filenames.add(simple_filename)
                if guid:
                    known_guids.add(guid)
    except Exception as e:
        logger.error(f"Error reading CSV file: {str(e)}")
        return

    # Process regular PBIVIZ files and associated files
    pbiviz_dir = os.path.join(all_visuals_path, "PBIVIZ")
    if os.path.exists(pbiviz_dir):
        for filename in os.listdir(pbiviz_dir):
            if not filename.lower().endswith('.pbiviz'):  # Case-insensitive check
                continue
                
            simple_filename = filename[:-7].lower()  # Remove .pbiviz extension and convert to lowercase
            if simple_filename not in known_simple_filenames:
                logger.info(f"Moving unlisted visual: {filename}")
                
                # Move PBIVIZ file
                src_pbiviz = os.path.join(pbiviz_dir, filename)
                dst_pbiviz = os.path.join(unlisted_path, "PBIVIZ", filename)
                try:
                    shutil.copy2(src_pbiviz, dst_pbiviz)
                    os.remove(src_pbiviz)
                except Exception as e:
                    logger.error(f"Error moving PBIVIZ file {filename}: {str(e)}")
                    continue
                
                # Move associated PNG file
                # Search for PNG file case-insensitively
                png_base = f"{filename[:-7]}.png"
                images_dir = os.path.join(all_visuals_path, "Images")
                if os.path.exists(images_dir):
                    for img_file in os.listdir(images_dir):
                        if img_file.lower() == png_base.lower():
                            src_png = os.path.join(images_dir, img_file)
                            dst_png = os.path.join(unlisted_path, "Images", img_file)
                            try:
                                shutil.copy2(src_png, dst_png)
                                os.remove(src_png)
                            except Exception as e:
                                logger.error(f"Error moving PNG file {img_file}: {str(e)}")
                            break
                
                # Move associated PBIX file
                # Search for PBIX file case-insensitively
                pbix_base = f"{filename[:-7]}.pbix"
                pbix_dir = os.path.join(all_visuals_path, "PBIX")
                if os.path.exists(pbix_dir):
                    for pbix_file in os.listdir(pbix_dir):
                        if pbix_file.lower() == pbix_base.lower():
                            src_pbix = os.path.join(pbix_dir, pbix_file)
                            dst_pbix = os.path.join(unlisted_path, "PBIX", pbix_file)
                            try:
                                shutil.copy2(src_pbix, dst_pbix)
                                os.remove(src_pbix)
                            except Exception as e:
                                logger.error(f"Error moving PBIX file {pbix_file}: {str(e)}")
                            break

    # Process GUID-based PBIVIZ files
    guid_dir = os.path.join(all_visuals_path, "PBIVIZ with guid")
    if os.path.exists(guid_dir):
        for filename in os.listdir(guid_dir):
            if not filename.lower().endswith('.pbiviz'):  # Case-insensitive check
                continue
                
            guid = filename[:-7].lower()  # Remove .pbiviz extension and convert to lowercase
            if guid not in known_guids:
                logger.info(f"Moving unlisted GUID visual: {filename}")
                
                src_guid = os.path.join(guid_dir, filename)
                dst_guid = os.path.join(unlisted_path, "PBIVIZ with guid", filename)
                try:
                    shutil.copy2(src_guid, dst_guid)
                    os.remove(src_guid)
                except Exception as e:
                    logger.error(f"Error moving GUID file {filename}: {str(e)}")


def scan_unarchived_visuals(parent_folder) -> None:
    """Scan for unarchived visuals and extract their versions."""
    workspace_path = get_workspace_path()
    all_visuals_path = os.path.join(workspace_path, parent_folder, "PBIVIZ with versions")
    
    # Ensure the destination directory exists
    destination_path = os.path.join(workspace_path,"Extracted")
    os.makedirs(destination_path, exist_ok=True)
    
    # Scan for .pbiviz files in the All Visuals directory
    for root, _, files in os.walk(all_visuals_path):
        for filename in files:
            if filename.lower().endswith('.pbiviz'):
                file_path = os.path.join(all_visuals_path, filename)
                extract_new_visual(file_path)
                
            else:
                logger.warning(f"File {filename} does not have a .pbiviz extension, skipping extraction.")


def extract_new_visual(filename: str) -> str:
  
    # Define the root and repo folders as in the PowerShell script
    workspace_path = get_workspace_path()
    destination_path = os.path.join(workspace_path, "Extracted")

    if not os.path.exists(destination_path):
        os.makedirs(destination_path)

    base_name = ""
    # The extracted folder will be named after the pbiviz file (without extension)
    base_name = os.path.basename(filename)[:-7]  # Remove '.pbiviz' extension
    
    unzip_folder = os.path.join(destination_path, base_name)

    # If already extracted, skip
    if os.path.exists(unzip_folder) and not DOWNLOAD_ALL:
        logger.debug(f"Skipping {os.path.basename(filename)} - already extracted.")
        return unzip_folder

    logger.info(f"Extracting visual: {base_name}")
    
    # Copy .pbiviz file to .zip file
    zip_filename = os.path.splitext(filename)[0] + ".zip"
    shutil.copy2(filename, zip_filename)

    # Create the unzip folder
    os.makedirs(unzip_folder, exist_ok=True)

    # Unzip .zip file into the destination folder
    try:
        with zipfile.ZipFile(zip_filename, 'r') as zip_ref:
            zip_ref.extractall(unzip_folder)
    except Exception as e:
        logger.warning(f"Failed to unzip {zip_filename}: {e}")
        os.remove(zip_filename)
        return ""

    # Cleanup: Delete the temporary .zip file
    os.remove(zip_filename)

    resources_path = os.path.join(unzip_folder, "resources")
    # find the first pbiviz.json file in the resources folder and return its path
    json_path = ""
    for root, _, files in os.walk(resources_path):
        for file in files:
            if file.lower().endswith('.pbiviz.json'):
                json_path = os.path.join(root, file)
                break
        if json_path:
            break
    
    if json_path:
        extract_and_save(json_path, unzip_folder)
        os.remove(json_path)  # Remove the pbiviz.json file after extraction
        os.removedirs(resources_path)  # Remove the resources folder if empty

    return unzip_folder


def extract_and_save(file_path, parent_dir):
    """Extract JavaScript from the pbiviz.json file and save it to the parent directory."""
    data = None
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    
    if not data:
        logger.warning(f"No data found in {file_path}")
    
    content = data.get("content", {})
    external_js_files = data.get("externalJS", [])
    if external_js_files and external_js_files != []:
        handle_external_javascripts(external_js_files, parent_dir)
    
    javascript_data = content.get("js")
    if javascript_data:
        extract_javascript(javascript_data, parent_dir, "internal")

    css_data = content.get("css")
    if css_data and css_data != "\n":
        extract_css(css_data, parent_dir, "visual")

    # remove the extracted content from the file and save it as a new json file cleaned_for_scan.
    # json file should be in the same folder as the original pbiviz.json file
    cleaned_for_scan_path = os.path.join(parent_dir, "cleaned.json")
    data.pop("content", None)
    with open(cleaned_for_scan_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)


def handle_external_javascripts(external_js_files, parent_dir):
    """Handle external JavaScript files and maintain a global list."""
    # Create externalJs.txt file in the parent_dir (extracted visual folder)
    external_js_file_path = os.path.join(parent_dir, "externalJs.txt")
    
    # Update global set
    EXTERNAL_JS_FILES.update(external_js_files)
    
    # Ensure the parent directory exists
    os.makedirs(parent_dir, exist_ok=True)
    
    # Write the external JS files list to the file (create if doesn't exist)
    with open(external_js_file_path, "w", encoding="utf-8") as f:
        for external_js_file in external_js_files:
            f.write(external_js_file + "\n")

def save_external_js_list():
    """Save the list of all unique external JS files with their URLs."""
    workspace_path = get_workspace_path()
    
    # Create the CSV file
    csv_path = os.path.join(workspace_path, "external_js_files.csv")
    
    with open(csv_path, "w", encoding="utf-8", newline='') as f:
        writer = csv.writer(f)
        writer.writerow(["JavaScript File", "Type", "CDN URL", "URL Status"])
        
        # Sort files for better readability
        sorted_files = sorted(EXTERNAL_JS_FILES)
        
        for js_file in sorted_files:
            writer.writerow([js_file])
            

def extract_javascript(javascript, target_dir, filename):
    """Extract JavaScript code from the given base64 encoded or non-encoded string and save it to a file."""   
    try:
        decoded = base64.b64decode(javascript).decode("utf-8")
        javascript = decoded
    except Exception:
        pass
    
    path = os.path.join(target_dir,f"{filename}.js")
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(javascript)
    except Exception as e:
        logger.error(f"Error saving JavaScript file {path}: {str(e)}")


def extract_css(css, target_dir, filename):
    """Extract JavaScript code from the given base64 encoded or non-encoded string and save it to a file."""   
    try:
        decoded = base64.b64decode(css).decode("utf-8")
        css = decoded
    except Exception:
        pass
    
    path = os.path.join(target_dir,f"{filename}.css")
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(css)
    except Exception as e:
        logger.error(f"Error saving CSS file {path}: {str(e)}")



def main():
    """Main function to orchestrate the download process."""
    try:
        # Load existing external JS files from root folder
        load_external_js_files()

        # Collect existing external JS files
        collect_existing_external_js()
        
        # Process all categories
        process_visuals("All Visuals")
        process_visuals("Certified")
        process_visuals("Uncertified")
        
        # Handle unlisted visuals
        handle_unlisted_visuals()
        
        scan_unarchived_visuals("All Visuals")
        scan_unarchived_visuals("Unlisted")
        
        # Save the external JS list
        save_external_js_list()
        
        logger.info("Download process completed successfully")
        
    except Exception as e:
        logger.error(f"Main process error: {str(e)}")

def collect_existing_external_js():
    """One-time function to collect all external JS files from extracted visuals."""
    workspace_path = get_workspace_path()
    extracted_path = os.path.join(workspace_path, "Extracted")
    
    if not os.path.exists(extracted_path):
        logger.info("No Extracted directory found.")
        return
    
    # Collect all external JS files
    for visual_dir in os.listdir(extracted_path):
        js_file_path = os.path.join(extracted_path, visual_dir, "externalJs.txt")
        if os.path.exists(js_file_path):
            try:
                with open(js_file_path, 'r', encoding='utf-8') as f:
                    js_files = f.read().splitlines()
                    # Add non-empty lines to the global set
                    EXTERNAL_JS_FILES.update(line.strip() for line in js_files if line.strip())
            except Exception as e:
                logger.error(f"Error reading {js_file_path}: {str(e)}")
    
    # Save the collected files
    if EXTERNAL_JS_FILES:
        save_external_js_list()

if __name__ == "__main__":
    
    # Run the script
    main()
