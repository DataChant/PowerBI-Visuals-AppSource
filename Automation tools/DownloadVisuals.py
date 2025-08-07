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
import filecmp

DOWNLOAD_ALL = False  # Set to True to download all visuals, False to only process changes since last run

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

g_workspace_path = os.getcwd()
g_all_visuals_path = os.path.join(g_workspace_path, "All Visuals")
g_all_listed_path = os.path.join(g_workspace_path, "All Listed")
g_unlisted_path = os.path.join(g_workspace_path, "Unlisted")
g_certified_path = os.path.join(g_workspace_path, "Certified")
g_uncertified_path = os.path.join(g_workspace_path, "Uncertified")

g_extracted_path = os.path.join(g_workspace_path, "Extcracted")

VERSIONS_SUBFOLDER = "PBIVIZ with versions"
PBIVIZ_GUIDS_SUBFOLDER = "PBIVIZ with guid"
PBIVIZ_SIMPLE_NAMES_SUBFOLDER = "PBIVIZ"
PBIX_SUBFOLDER = "PBIX"
IMAGES_SUBFOLDER = "Images"

g_snapshot_data = []
g_known_simple_filenames = set()
g_known_guids = set()
g_known_versioned_filenames = dict()

def load_external_js_files():
    """Load existing external JS files from CSV if it exists."""
    csv_path = os.path.join(g_workspace_path, "external_js_files.csv")

    if not path_exists(csv_path):
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

def path_exists(file_path: str) -> bool:
    """Check if a file exists at the given path."""
    return Path(file_path).exists()

def ensure_directories() -> None:
    """Create necessary directories if they don't exist."""
    # Ensure the main directories exist
    paths = [
        g_all_visuals_path, g_all_listed_path, g_unlisted_path, g_certified_path, g_uncertified_path
    ]
    for path in paths:
        ensure_directories_by_folder(path)

def ensure_directories_by_folder(base_folder: str) -> None:
    
    """Create necessary directories if they don't exist."""
    subdirs = [
        "",
        VERSIONS_SUBFOLDER,
        PBIVIZ_GUIDS_SUBFOLDER,
        PBIVIZ_SIMPLE_NAMES_SUBFOLDER,
        PBIX_SUBFOLDER,
        IMAGES_SUBFOLDER
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


def copy_file(src: str, dst: str, overwrite: bool = False) -> None:
    """Copy a file from source to destination."""
    if not path_exists(src):
        raise FileNotFoundError(f"Source file does not exist: {src}")
    
    if path_exists(dst):
        if not overwrite:
            return
        if filecmp.cmp(src, dst, shallow=False):
            logger.debug(f"File {dst} already exists and is the same as {src}, skipping copy.")
            return
        else:
            logger.debug(f"File {dst} exists but differs from {src}, overwriting.")

    try:
        # compare files using md5 and copy only if files are not the same
        shutil.copy2(src, dst)
        logger.info(f"Copied {src} to {dst}")
    except Exception as e:
        logger.error(f"Failed to copy {src} to {dst}: {str(e)}")


def handle_visual_files(versioned_pbiviz: str, guid_filename:str, simple_filename: str, pbix_filename: str, image_filename: str, is_certified: bool) -> None:

    global g_all_visuals_path, g_all_listed_path, g_certified_path, g_uncertified_path

    src_pbiviz_path = os.path.join(g_all_visuals_path, VERSIONS_SUBFOLDER, versioned_pbiviz)
    src_pbix_path = os.path.join(g_all_visuals_path, PBIX_SUBFOLDER, pbix_filename)
    src_image_path = os.path.join(g_all_visuals_path, IMAGES_SUBFOLDER, image_filename)

    certified_or_uncertified_path = g_certified_path if is_certified else g_uncertified_path
    clean_certified_or_uncertified_path = g_certified_path if not is_certified else g_uncertified_path

    overwrite = True
    copy_paths = [
        (overwrite, src_pbiviz_path, os.path.join(g_all_visuals_path, PBIVIZ_GUIDS_SUBFOLDER, guid_filename)),
        (overwrite, src_pbiviz_path, os.path.join(g_all_visuals_path, PBIVIZ_SIMPLE_NAMES_SUBFOLDER, simple_filename)),
        
        (not overwrite, src_pbiviz_path, os.path.join(g_all_listed_path, VERSIONS_SUBFOLDER, versioned_pbiviz)),
        (overwrite, src_pbiviz_path, os.path.join(g_all_listed_path, PBIVIZ_GUIDS_SUBFOLDER, guid_filename)),
        (overwrite, src_pbiviz_path, os.path.join(g_all_listed_path, PBIVIZ_SIMPLE_NAMES_SUBFOLDER, simple_filename)),

        (not overwrite, src_pbiviz_path, os.path.join(certified_or_uncertified_path, VERSIONS_SUBFOLDER, versioned_pbiviz)),
        (overwrite, src_pbiviz_path, os.path.join(certified_or_uncertified_path, PBIVIZ_GUIDS_SUBFOLDER, guid_filename)),
        (overwrite, src_pbiviz_path, os.path.join(certified_or_uncertified_path, PBIVIZ_SIMPLE_NAMES_SUBFOLDER, simple_filename)),    
        
        (overwrite, src_pbix_path, os.path.join(g_all_listed_path, PBIX_SUBFOLDER, pbix_filename)),
        (overwrite, src_pbix_path, os.path.join(certified_or_uncertified_path, PBIX_SUBFOLDER, pbix_filename)),

        (overwrite, src_image_path, os.path.join(g_all_listed_path, IMAGES_SUBFOLDER, image_filename)),
        (overwrite,src_image_path, os.path.join(certified_or_uncertified_path, IMAGES_SUBFOLDER, image_filename))
    ]   
    
    for overwrite, src, dst in copy_paths:
        copy_file(src, dst, overwrite)

    delete_paths = [
        os.path.join(clean_certified_or_uncertified_path, PBIVIZ_GUIDS_SUBFOLDER, guid_filename),
        os.path.join(clean_certified_or_uncertified_path, PBIVIZ_SIMPLE_NAMES_SUBFOLDER, simple_filename),
        os.path.join(clean_certified_or_uncertified_path, PBIX_SUBFOLDER, pbix_filename),
        os.path.join(clean_certified_or_uncertified_path, IMAGES_SUBFOLDER, image_filename),
    ]

    # Remove files that are no longer needed
    for file_to_delete in delete_paths:
        try:
            if path_exists(file_to_delete):
                os.remove(file_to_delete)
                logger.debug(f"Removed file: {file_to_delete}")
        except Exception as e:
            logger.error(f"Failed to remove {file_to_delete}: {str(e)}")


def cleanup_unlisted(versioned_filename: str, guid: str, simple_filename: str) -> None:
    """Clean up files from other directories based on certification status changes."""
    # Clean up from Unlisted if file exists in All Visuals
    unlisted_paths = [
        os.path.join(g_unlisted_path, PBIX_SUBFOLDER, f"{simple_filename}.pbix"),
        os.path.join(g_unlisted_path, IMAGES_SUBFOLDER, f"{simple_filename}.png"),
        os.path.join(g_unlisted_path, PBIVIZ_SIMPLE_NAMES_SUBFOLDER, f"{simple_filename}.pbiviz"),
        os.path.join(g_unlisted_path, PBIVIZ_GUIDS_SUBFOLDER, f"{guid}.pbiviz"),
        os.path.join(g_unlisted_path, VERSIONS_SUBFOLDER, f"{versioned_filename}")
    ]
    for path in unlisted_paths:
        if path_exists(path):
            try:
                os.remove(path)
                logging.info(f"Cleaned up unlisted file: {path}")
            except Exception as e:
                logging.error(f"Failed to clean up {path}: {str(e)}")

def initialize_snapshot_data() -> None:
    # Read the CSV file

    global g_snapshot_data, g_known_simple_filenames, g_known_guids, g_known_versioned_filenames
    csv_path = os.path.join(g_workspace_path, "Custom Visuals.csv")
    
    try:

        with open(csv_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                g_snapshot_data.append(row)
    
    except Exception as e:
        raise (f"Error processing file {csv_path}: {str(e)}")
    
    for row in g_snapshot_data:
        simple_filename = row.get('Simple Filename', '').lower()  # Convert to lowercase
        guid = row.get('Visual GUID', '').lower()  # Convert to lowercase
        versioned_filename = row.get('Filename', '')
        if simple_filename:
            g_known_simple_filenames.add(simple_filename)
        if guid:
            g_known_guids.add(guid)
            if versioned_filename:
                g_known_versioned_filenames[versioned_filename] = guid
       

def process_visuals() -> None:
    """Process visuals based on mode (All Visuals/Certified/Uncertified)."""
    
    i = 0
    total_rows = len(g_snapshot_data)

    for row in g_snapshot_data:
        i += 1
        
        # Get values from the correct columns as per VBA
        pbiviz_url = row.get('PBIVIZ', '')
        pbix_url = row.get('PBIX', '')
        simple_filename = row.get('Simple Filename', '')  # Short filename without version
        is_certified = row.get('Certified', '').lower() == 'true'
        versioned_filename = row.get('Filename', '')  # Full filename with version
        image_url = row.get('Image', '')
        guid = row.get('Visual GUID', '')
        pbix_filename = f"{simple_filename}.pbix"
        image_filename = f"{simple_filename}.png"
        version_path = os.path.join(g_all_visuals_path, VERSIONS_SUBFOLDER, versioned_filename)
        
        if not simple_filename or not versioned_filename:
            logger.error(f"Missing filename information, skipping row {i}")
            continue

        # Check if file already exists
        new_download = False
        downloaded = False
        if not path_exists(version_path) or DOWNLOAD_ALL:  
            if pbiviz_url:
                # Download versioned PBIVIZ
                logger.info(f"Downloading files for {simple_filename}")
                download_file(pbiviz_url, version_path)
                extract_new_visual(version_path)
                new_download = True
                downloaded = True
            
        # Download PBIX file
        if pbix_url:
            pbix_path = os.path.join(g_all_visuals_path, PBIX_SUBFOLDER, f"{pbix_filename}")
            if new_download or (not path_exists(pbix_path)) or DOWNLOAD_ALL:
                logger.info(f"Downloading PBIX file for {simple_filename}")
                download_file(pbix_url, pbix_path)
                downloaded = True
        
        # Download Image
        if image_url:
            image_path = os.path.join(g_all_visuals_path, IMAGES_SUBFOLDER, f"{image_filename}")
            if new_download or (not path_exists(image_path)) or DOWNLOAD_ALL:
                logger.info(f"Downloading Image file for {simple_filename}")
                download_file(image_url, image_path)
                downloaded = True  

            
        if downloaded:
            handle_visual_files(versioned_filename, guid, simple_filename, pbix_filename, image_filename, is_certified)
        

def move_file_to_unlisted(all_dir, listed_dir, unlisted_dir, folder, filename):
    # Move PBIVIZ file
    all_path = os.path.join(all_dir, folder, filename)
    listed_path = os.path.join(listed_dir, folder, filename)
    unlisted_path = os.path.join(unlisted_dir, folder, filename)
    try:
        if not path_exists(unlisted_path):
            logger.info(f"Copying {folder} file {filename} to Unlisted")
            shutil.copy2(all_path, unlisted_path)
        if path_exists(listed_path):
            logger.info(f"Removing {folder} file {filename} from Listed folder")
            os.remove(listed_path)
    except Exception as e:
        logger.error(f"Error moving {folder} file {filename}: {str(e)}")

def move_files(all_visuals_path, listed_path, unlisted_path, filename, subfolder, extension):
    # Move associated file by extension
    # Search for file by extension case-insensitively
    file_base = f"{filename[:-7]}.{extension}"
    src_dir = os.path.join(all_visuals_path, subfolder)
    if path_exists(src_dir):
        for filename in os.listdir(src_dir):
            if filename.lower() != file_base.lower():
                continue
            
            move_file_to_unlisted(all_visuals_path, listed_path, unlisted_path, subfolder, filename)
            
    

def handle_unlisted_visuals() -> None:
    """Move visuals that are not in the CSV to the Unlisted folder."""
    
    # Process regular PBIVIZ files and associated files
    pbiviz_dir = os.path.join(g_all_visuals_path, PBIVIZ_SIMPLE_NAMES_SUBFOLDER)
    if not path_exists(pbiviz_dir):
        return
    
    for filename in os.listdir(pbiviz_dir):
        if not filename.lower().endswith('.pbiviz'):  # Case-insensitive check
            continue
            
        simple_filename = filename[:-7].lower()  # Remove .pbiviz extension and convert to lowercase
        if simple_filename in g_known_simple_filenames:
            continue

        # Move PBIVIZ file
        move_file_to_unlisted(g_all_visuals_path, g_all_listed_path, g_unlisted_path, "PBIVIZ", filename)
        
        # Move associated PNG and PBIX files
        move_files(g_all_visuals_path, g_all_listed_path, g_unlisted_path, filename, "Images", "png")
        move_files(g_all_visuals_path, g_all_listed_path, g_unlisted_path, filename, "PBIX", "pbix")
               
    # Process GUID-based PBIVIZ files
    guid_dir = os.path.join(g_all_visuals_path, PBIVIZ_GUIDS_SUBFOLDER)
    
    for filename in os.listdir(guid_dir):
        if not filename.lower().endswith('.pbiviz'):  # Case-insensitive check
            continue
            
        guid = filename[:-7].lower()  # Remove .pbiviz extension and convert to lowercase
        if guid not in g_known_guids:
            logger.info(f"Moving unlisted GUID visual: {filename}")
            
            move_file_to_unlisted(g_all_visuals_path, g_all_listed_path, g_unlisted_path, PBIVIZ_GUIDS_SUBFOLDER, filename)
            
            
    # Process versioned PBIVIZ files
    versioned_pbiviz_dir = os.path.join(g_all_visuals_path, VERSIONS_SUBFOLDER)
    for filename in os.listdir(versioned_pbiviz_dir):
        if not filename.lower().endswith('.pbiviz'):  # Case-insensitive check
            continue
        
        guid_found = g_known_versioned_filenames.get(filename, None)
        
        if guid_found and guid_found in g_known_guids:
            # This versioned visual is known. We skip it
            continue
            
        move_file_to_unlisted(g_all_visuals_path, g_all_listed_path, g_unlisted_path, VERSIONS_SUBFOLDER, filename)

    


def scan_unarchived_visuals(parent_folder) -> None:
    """Scan for unarchived visuals and extract their versions."""
    all_visuals_path = os.path.join(g_workspace_path, parent_folder, VERSIONS_SUBFOLDER)
    
    # Ensure the destination directory exists
    os.makedirs(g_extracted_path, exist_ok=True)
    
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
    destination_path = os.path.join(g_workspace_path, "Extracted")

    if not path_exists(destination_path):
        os.makedirs(destination_path)

    base_name = ""
    # The extracted folder will be named after the pbiviz file (without extension)
    base_name = os.path.basename(filename)[:-7]  # Remove '.pbiviz' extension
    
    unzip_folder = os.path.join(destination_path, base_name)

    # If already extracted, skip
    if path_exists(unzip_folder) and not DOWNLOAD_ALL:
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
    
    # Create the CSV file
    csv_path = os.path.join(g_workspace_path, "external_js_files.csv")
    
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

def collect_existing_external_js():
    """One-time function to collect all external JS files from extracted visuals."""
    extracted_path = os.path.join(g_workspace_path, "Extracted")
    
    if not path_exists(extracted_path):
        logger.info("No Extracted directory found.")
        return
    
    # Collect all external JS files
    for visual_dir in os.listdir(extracted_path):
        js_file_path = os.path.join(extracted_path, visual_dir, "externalJs.txt")
        if path_exists(js_file_path):
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


def main():
    """Main function to orchestrate the download process."""
    try:
        ensure_directories()

        initialize_snapshot_data()

        # Load existing external JS files from root folder
        load_external_js_files()

        # Collect existing external JS files
        collect_existing_external_js()
        
        # Process all categories
        process_visuals()
        
        # Handle unlisted visuals
        handle_unlisted_visuals()

        scan_unarchived_visuals("All Visuals")
        scan_unarchived_visuals("Unlisted")
        
        # Save the external JS list
        save_external_js_list()
        
        logger.info("Download process completed successfully")
        
    except Exception as e:
        logger.error(f"Main process error: {str(e)}")


if __name__ == "__main__":
    
    # Run the script
    main()
