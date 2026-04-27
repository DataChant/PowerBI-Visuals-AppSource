# Copyright (c) 2026 DataChant Consulting LLC
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

"""Import every PBIX sample from All Listed/PBIX/ into three Power BI workspaces.

Auth: delegated via Azure CLI (`az account get-access-token`). No secrets are
stored. Run `az login` first.

Buckets (by first character of filename, uppercased):
    A-F (digits and symbols land here)   -> "Custom Visuals Samples - A-F"
    G-O                                  -> "Custom Visuals Samples - G-O"
    P-Z (plus non-ASCII)                 -> "Custom Visuals Samples - P-Z"

Idempotency log: Automation tools/Private/custom_visuals_samples_imports.csv
    On re-run:
      - SKIP if SHA-256 and workspace match a prior "Succeeded" row
      - RE-IMPORT (CreateOrOverwrite) if the repo PBIX hash differs, or if
        the workspace was recreated, or if the prior row is not Succeeded
      - NEW IMPORT for files never seen before
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import logging
import shutil
import subprocess
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

# -- Configuration ---------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
PBIX_DIR = REPO_ROOT / "All Listed" / "PBIX"
STATE_CSV = REPO_ROOT / "Automation tools" / "Private" / "custom_visuals_samples_imports.csv"

POWERBI_API_BASE = "https://api.powerbi.com/v1.0/myorg"
POWERBI_RESOURCE = "https://analysis.windows.net/powerbi/api"
POWERBI_PORTAL = "https://app.powerbi.com"

WORKSPACES = {
    "A-F": "Custom Visuals Samples - A-F",
    "G-O": "Custom Visuals Samples - G-O",
    "P-Z": "Custom Visuals Samples - P-Z",
}

STATE_COLUMNS = [
    "filename", "sha256", "bucket",
    "workspace_id", "workspace_name",
    "report_id", "semantic_model_id", "report_url",
    "imported_at", "status", "error",
    "datasources_cleaned_at",
]

IMPORT_POLL_INTERVAL_SEC = 3
IMPORT_POLL_TIMEOUT_SEC = 600  # 10 minutes per PBIX

# -- Logging ---------------------------------------------------------------

if sys.platform.startswith("win") and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("import-pbix")


# -- Azure CLI token holder ------------------------------------------------

class AzToken:
    """Delegated Power BI bearer token, sourced from Azure CLI on demand.

    Tracks expiry so callers can refresh proactively. Azure CLI caches access
    tokens and may return one with very little life remaining, so we refresh
    whenever the current token has less than REFRESH_MARGIN_SEC left.
    """

    REFRESH_MARGIN_SEC = 300  # refresh if <5 min of life remains

    def __init__(self) -> None:
        self._az_path = shutil.which("az")
        if not self._az_path:
            raise SystemExit(
                "Azure CLI (`az`) not found on PATH. Install from "
                "https://aka.ms/installazurecliwindows and run `az login`."
            )
        self._token: str | None = None
        self._expires_at: float = 0.0
        self.refresh()

    def refresh(self) -> None:
        try:
            proc = subprocess.run(
                [self._az_path, "account", "get-access-token",
                 "--resource", POWERBI_RESOURCE, "-o", "json"],
                capture_output=True, text=True, encoding="utf-8", check=True,
            )
        except subprocess.CalledProcessError as e:
            raise SystemExit(
                "`az account get-access-token` failed: "
                f"{(e.stderr or '').strip()}\n"
                "Run `az login` and ensure your account has Power BI access."
            )
        data = json.loads(proc.stdout)
        self._token = data["accessToken"]
        # Prefer the epoch-seconds field when present; fall back to the
        # local-time string. On stale caches, subtract margin so ensure_fresh
        # will force another refresh next call if we got a near-expiry token.
        exp = data.get("expires_on")
        if isinstance(exp, (int, float)):
            self._expires_at = float(exp)
        elif isinstance(exp, str) and exp.isdigit():
            self._expires_at = float(exp)
        else:
            try:
                dt = datetime.strptime(data["expiresOn"], "%Y-%m-%d %H:%M:%S.%f")
                self._expires_at = dt.timestamp()
            except Exception:
                self._expires_at = time.time() + 600.0

    def ensure_fresh(self) -> None:
        if time.time() + self.REFRESH_MARGIN_SEC >= self._expires_at:
            self.refresh()

    def header(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {self._token}"}


def _is_token_expired(resp: requests.Response) -> bool:
    """True if the response indicates the bearer token is stale.

    Power BI returns HTTP 403 with error.code == 'TokenExpired' for an
    expired bearer, NOT 401. Generic 401 also counts.
    """
    if resp.status_code == 401:
        return True
    if resp.status_code != 403:
        return False
    try:
        err_code = (resp.json().get("error") or {}).get("code", "")
    except ValueError:
        err_code = resp.text or ""
    return "TokenExpired" in err_code or "ExpiredAuthenticationToken" in err_code


# -- HTTP helpers ----------------------------------------------------------

def api_request(session: requests.Session, method: str, path: str,
                token: AzToken, *, retries: int = 3,
                **kwargs) -> requests.Response:
    url = path if path.startswith("http") else f"{POWERBI_API_BASE}{path}"
    extra_headers = kwargs.pop("headers", None) or {}
    resp: requests.Response | None = None
    for attempt in range(retries):
        token.ensure_fresh()
        headers = {**extra_headers, **token.header()}
        resp = session.request(method, url, headers=headers, **kwargs)
        if _is_token_expired(resp) and attempt == 0:
            log.info("  %d token-expired -- refreshing az token",
                     resp.status_code)
            token.refresh()
            continue
        if resp.status_code == 429:
            delay = int(resp.headers.get("Retry-After", "30"))
            log.warning("  429 throttled -- sleeping %ds", min(delay, 120))
            time.sleep(min(delay, 120))
            continue
        if 500 <= resp.status_code < 600 and attempt < retries - 1:
            time.sleep(2 ** attempt)
            continue
        return resp
    assert resp is not None
    return resp


# -- Datasource cleanup ----------------------------------------------------

def cleanup_dataset_datasources(session: requests.Session, token: AzToken,
                                workspace_id: str,
                                dataset_id: str) -> tuple[int, int, int, list[str]]:
    """Delete every datasource registered to a dataset. Frees per-user quota.

    Returns (found, deleted_now, already_cleaned, errors).
    already_cleaned: datasource had no gatewayId/datasourceId because a prior
    delete (possibly from another dataset sharing the same connection string)
    already removed the cloud-connection registration.
    """
    path = f"/groups/{workspace_id}/datasets/{dataset_id}/datasources"
    r = api_request(session, "GET", path, token)
    if not r.ok:
        return 0, 0, 0, [f"GET datasources: HTTP {r.status_code} {r.text[:200]}"]
    datasources = (r.json() or {}).get("value", [])
    if not datasources:
        return 0, 0, 0, []

    deleted = 0
    already = 0
    errors: list[str] = []
    for ds in datasources:
        gid = ds.get("gatewayId")
        dsid = ds.get("datasourceId")
        if not (gid and dsid):
            already += 1
            continue
        del_path = f"/gateways/{gid}/datasources/{dsid}"
        r = api_request(session, "DELETE", del_path, token)
        if r.status_code in (200, 204, 404):
            deleted += 1
        else:
            errors.append(f"DELETE {dsid}: HTTP {r.status_code} {r.text[:200]}")
    return len(datasources), deleted, already, errors


# -- Workspace resolution --------------------------------------------------

def get_or_create_workspace(session: requests.Session, token: AzToken,
                            name: str) -> tuple[str, bool]:
    """Return (workspace_id, created_now)."""
    r = api_request(session, "GET", "/groups", token,
                    params={"$filter": f"name eq '{name}'"})
    r.raise_for_status()
    groups = r.json().get("value", [])
    if groups:
        return groups[0]["id"], False
    r = api_request(session, "POST", "/groups", token, json={"name": name})
    r.raise_for_status()
    return r.json()["id"], True


# -- State CSV (read/write) ------------------------------------------------

def load_state() -> dict[str, dict]:
    if not STATE_CSV.exists():
        return {}
    state: dict[str, dict] = {}
    with STATE_CSV.open("r", encoding="utf-8-sig", newline="") as f:
        for row in csv.DictReader(f):
            state[row["filename"]] = row
    return state


def save_state(state: dict[str, dict]) -> None:
    STATE_CSV.parent.mkdir(parents=True, exist_ok=True)
    rows = sorted(state.values(), key=lambda r: r["filename"].casefold())
    with STATE_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=STATE_COLUMNS)
        writer.writeheader()
        for row in rows:
            writer.writerow({k: row.get(k, "") for k in STATE_COLUMNS})


# -- Bucketing & hashing ---------------------------------------------------

def bucket_for(filename: str) -> str:
    c = filename[:1].upper()
    if c and c < "G":
        return "A-F"
    if c and c < "P":
        return "G-O"
    return "P-Z"


def sha256_of(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


# -- Power BI import -------------------------------------------------------

def upload_pbix(session: requests.Session, token: AzToken,
                workspace_id: str, pbix_path: Path,
                display_name: str) -> str:
    """POST the PBIX as a new import; return the importId for polling."""
    url = f"{POWERBI_API_BASE}/groups/{workspace_id}/imports"
    params = {
        "datasetDisplayName": display_name,
        "nameConflict": "CreateOrOverwrite",
    }
    resp: requests.Response | None = None
    for attempt in range(3):
        token.ensure_fresh()
        with pbix_path.open("rb") as fh:
            files = {"file": (pbix_path.name, fh, "application/octet-stream")}
            resp = session.post(url, headers=token.header(), params=params,
                                files=files, timeout=600)
        if _is_token_expired(resp) and attempt == 0:
            log.info("  %d token-expired on upload -- refreshing az token",
                     resp.status_code)
            token.refresh()
            continue
        if resp.status_code == 429:
            time.sleep(min(int(resp.headers.get("Retry-After", "30")), 120))
            continue
        if 500 <= resp.status_code < 600 and attempt < 2:
            time.sleep(2 ** attempt)
            continue
        break
    assert resp is not None
    resp.raise_for_status()
    return resp.json()["id"]


def poll_import(session: requests.Session, token: AzToken,
                workspace_id: str, import_id: str) -> dict:
    deadline = time.monotonic() + IMPORT_POLL_TIMEOUT_SEC
    path = f"/groups/{workspace_id}/imports/{import_id}"
    while time.monotonic() < deadline:
        r = api_request(session, "GET", path, token)
        r.raise_for_status()
        body = r.json()
        if body.get("importState") in ("Succeeded", "Failed"):
            return body
        time.sleep(IMPORT_POLL_INTERVAL_SEC)
    raise TimeoutError(
        f"Import {import_id} did not finish within {IMPORT_POLL_TIMEOUT_SEC}s"
    )


# -- Main driver -----------------------------------------------------------

def decide_action(prev: dict | None, sha: str, ws_id: str) -> str:
    """Return 'skip', 'new', or 'update'."""
    if prev is None:
        return "new"
    if prev.get("status") != "Succeeded":
        return "update"
    if prev.get("sha256") != sha:
        return "update"
    if prev.get("workspace_id") != ws_id:
        return "update"
    return "skip"


def main() -> int:
    ap = argparse.ArgumentParser(description="Import PBIX samples into Power BI.")
    ap.add_argument("--limit", type=int, default=0,
                    help="Process at most N PBIX files (0 = no limit).")
    ap.add_argument("--bucket", choices=list(WORKSPACES.keys()), default=None,
                    help="Restrict to a single bucket.")
    args = ap.parse_args()

    if not PBIX_DIR.is_dir():
        log.error("PBIX directory not found: %s", PBIX_DIR)
        return 1

    state = load_state()
    log.info("Prior state: %d entries from %s", len(state),
             STATE_CSV if STATE_CSV.exists() else "<none>")

    session = requests.Session()
    token = AzToken()
    log.info("Acquired Power BI token via Azure CLI")

    # Step 1: resolve workspaces (check; create if missing)
    ws_id: dict[str, str] = {}
    for key, name in WORKSPACES.items():
        wid, created = get_or_create_workspace(session, token, name)
        ws_id[key] = wid
        log.info("Workspace %s: %s  id=%s%s",
                 key, name, wid, "  [created]" if created else "")

    # Step 2: enumerate PBIX files
    pbix_files = sorted(PBIX_DIR.glob("*.pbix"),
                        key=lambda p: p.name.casefold())
    if args.bucket:
        pbix_files = [p for p in pbix_files if bucket_for(p.name) == args.bucket]
    if args.limit:
        pbix_files = pbix_files[: args.limit]

    total = len(pbix_files)
    log.info("Queue: %d PBIX file(s)", total)

    skipped = new_ok = updated_ok = failed = 0
    for idx, pbix in enumerate(pbix_files, 1):
        filename = pbix.name
        bucket = bucket_for(filename)
        ws_name = WORKSPACES[bucket]
        wid = ws_id[bucket]

        sha = sha256_of(pbix)
        prev = state.get(filename)
        action = decide_action(prev, sha, wid)

        if action == "skip":
            skipped += 1
            log.info("[%d/%d] SKIP   (%s) %s", idx, total, bucket, filename)
            continue

        tag = "NEW   " if action == "new" else "UPDATE"
        log.info("[%d/%d] %s (%s) %s", idx, total, tag, bucket, filename)

        row: dict = {
            "filename": filename,
            "sha256": sha,
            "bucket": bucket,
            "workspace_id": wid,
            "workspace_name": ws_name,
            "report_id": "",
            "semantic_model_id": "",
            "report_url": "",
            "imported_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
            "status": "",
            "error": "",
        }
        try:
            import_id = upload_pbix(session, token, wid, pbix, pbix.stem)
            final = poll_import(session, token, wid, import_id)
            if final.get("importState") == "Succeeded":
                reports = final.get("reports") or []
                datasets = final.get("datasets") or []
                if reports:
                    row["report_id"] = reports[0]["id"]
                    row["report_url"] = (
                        f"{POWERBI_PORTAL}/groups/{wid}/reports/{reports[0]['id']}"
                    )
                if datasets:
                    row["semantic_model_id"] = datasets[0]["id"]
                row["status"] = "Succeeded"
                if action == "new":
                    new_ok += 1
                else:
                    updated_ok += 1
                log.info("         -> Succeeded  %s", row["report_url"])

                # Immediately clean the just-registered datasources so we
                # don't accumulate against the 1,000-per-user quota.
                if row["semantic_model_id"]:
                    _, deleted, already, cerrs = cleanup_dataset_datasources(
                        session, token, wid, row["semantic_model_id"])
                    if cerrs:
                        log.warning("         cleanup errors: %s", cerrs[:2])
                    else:
                        row["datasources_cleaned_at"] = datetime.now(
                            timezone.utc).isoformat(timespec="seconds")
                        log.info("         cleaned  deleted=%d already=%d",
                                 deleted, already)
            else:
                row["status"] = "Failed"
                row["error"] = json.dumps(
                    final.get("error") or final, ensure_ascii=False
                )[:800]
                failed += 1
                log.warning("         -> Failed: %s", row["error"])
        except requests.HTTPError as ex:
            row["status"] = "Failed"
            body = ""
            if ex.response is not None:
                body = ex.response.text[:400]
            row["error"] = f"HTTP {getattr(ex.response, 'status_code', '?')}: {body}"
            failed += 1
            log.warning("         -> HTTPError: %s", row["error"])
        except Exception as ex:  # noqa: BLE001 -- surface any upload error into the log
            row["status"] = "Failed"
            row["error"] = f"{type(ex).__name__}: {ex}"[:800]
            failed += 1
            log.warning("         -> %s", row["error"])

        state[filename] = row
        save_state(state)

    log.info("Done. new=%d  updated=%d  skipped=%d  failed=%d",
             new_ok, updated_ok, skipped, failed)
    log.info("Log CSV: %s", STATE_CSV)
    return 0 if failed == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
