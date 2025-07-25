import os
import csv
import requests
import shutil
from pathlib import Path
import logging
from importlib.metadata import distributions

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

logger = logging.getLogger(__name__)

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
                except logging as e:
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
                if file_exists(version_path):
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

def main():
    """Main function to orchestrate the download process."""
    try:
        # Process all categories
        process_visuals("All Visuals")
        process_visuals("Certified")
        process_visuals("Uncertified")
        
        # Handle unlisted visuals
        handle_unlisted_visuals()
        
        logger.info("Download process completed successfully")
        
    except Exception as e:
        logger.error(f"Main process error: {str(e)}")

if __name__ == "__main__":
    # Install requirements before running
    main()
