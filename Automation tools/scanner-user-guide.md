# Power BI Custom Visuals Scanner -- User Guide

## What does this scanner do?

This scanner checks Power BI custom visuals from Microsoft AppSource for **the same code patterns that Microsoft checks during certification**. It uses Microsoft's own open-source tool ([eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals)) to scan the compiled visual packages.

Think of it as an **independent certification check** you can run on any visual before deploying it in your organization.

### Who is this for?

- **Power BI administrators** evaluating which visuals to allow in their tenant
- **Security teams** assessing third-party code running inside Power BI reports
- **BI developers** wanting to understand what a visual does before using it
- **Visual publishers** wanting to pre-check their visual before submitting for certification

### What does it check?

The scanner performs three types of analysis:

| Analysis | What it checks | Why it matters |
|----------|---------------|----------------|
| **Pattern Scan** | Code patterns Microsoft flags during certification (eval, innerHTML, fetch, etc.) | These patterns can indicate network access, dynamic code execution, or unsafe DOM manipulation |
| **Permission Scan** | What capabilities the visual requests (WebAccess, ExportContent, LocalStorage, AADAuthentication) | Permissions are declared by the developer and are the most reliable indicator of what a visual can do |
| **Open Source Scan** | What third-party libraries are bundled and their licenses | Identifies libraries with GPL or other restrictive licenses that may create obligations |

---

## Understanding the output

The scanner produces five output files. Here's what each one contains and how to use it.

### 1. security_scan_summary.md -- The executive summary

**Who should read this:** Everyone. This is the human-readable summary (~14 KB, ~178 lines).

The report is organized into these sections:

| Section | What it shows |
|---------|--------------|
| **Disclaimer** | Legal context -- this is pattern detection, not a vulnerability assessment |
| **Top 50 Scorecard** | The 50 most popular visuals with their risk levels and key findings |
| **Findings Dashboard** | Summary table: how many visuals have patterns, split by certified/uncertified |
| **Certified Visuals** | Certified visuals with detected patterns, sorted by pattern count |
| **Uncertified Visuals** | Uncertified visuals sorted by popularity (most-used first) |
| **Pattern Reference** | What each pattern category means, linking to Microsoft's ESLint rules |
| **Bundled Libraries** | Which open-source libraries appear most frequently |
| **GPL Dependencies** | Visuals bundling GPL-licensed code (potential license obligations) |
| **Methodology** | How the scan works, tools used, scoring formula |

Each visual appears as a card showing:

```
Visual Name ✅ Certified
Publisher: Company Name | Risk Level: Medium (45 pts)
Findings: Network Access (Author: 3), DOM Manipulation (Author: 2)
Permissions requested: Can access ANY external website; Can export your data
Bundled libraries: jQuery; d3.js; DOMPurify
Licenses: MIT; Apache-2.0
🟢 Resolved: Dynamic Code Execution (resolved in v2.1.0)
Version: 2.1.0 | GUID: abc123...
```

The 🟢 **Resolved** line appears when a finding was present in a previous version but is no longer detected in the latest version -- showing the visual improved over time.

### 2. visual_security_scores.csv -- One row per visual (latest version)

**Who should read this:** Administrators building allow/block lists, data analysts who want to query the data.

One row per visual (latest version only, 1,000+ rows). Columns (25 total):

| Column group | Columns | Description |
|-------------|---------|-------------|
| **Identity** | Visual Name, Publisher, GUID, Latest Version | Which visual and version |
| **Context** | Is Certified, Popularity | Metadata from AppSource |
| **Risk** | Risk Level, Risk Score | Composite risk assessment (High / Medium / Low / None) |
| **Author findings** | Author Findings, Dynamic Code (Author), Network Access (Author), DOM Manipulation (Author), Sensitive Access (Author), Informational (Author) | Pattern counts attributed to the visual's own code |
| **Library findings** | Library Findings | Total pattern count from known library code |
| **Permissions** | Web Access Permission, Export Content Permission, Local Storage Permission, AAD Auth Permission | Declared privileges from the visual's capabilities |
| **Libraries** | External JS Count, Detected Libraries | Third-party code bundled in the visual |
| **Metadata** | API Version, Has GPL License, Versions Scanned, Findings Resolved in Latest | Additional context |

### 3. security_findings_detail.csv -- One row per finding per visual

**Who should read this:** Security teams wanting granular finding-level data.

One row per finding per visual (Author and Library findings listed separately). Columns (14 total):

| Column | Description |
|--------|-------------|
| GUID | Visual identifier |
| Visual Name | Display name |
| Latest Version | Version scanned |
| Is Certified | Whether the visual is Microsoft-certified |
| Popularity | Usage popularity |
| Finding Category | Pattern category (see below) |
| Finding Pattern | Specific pattern detected (e.g., eval, innerHTML) |
| Detection Method | How the finding was detected (regex or ESLint) |
| ESLint Rule | Microsoft ESLint rule name, if applicable |
| Code Origin | Whether the finding is in **Author** code or **Library** code |
| Library Name | Which library, if the finding is in library code |
| Occurrence Count | Number of times this pattern was found |
| Severity | Severity level of the finding |
| Present in Prior Version | Whether this finding also appeared in a previous version |

**Finding categories:**

| Category | Patterns | Microsoft ESLint Rules |
|----------|----------|----------------------|
| Dynamic Code Execution | eval(), Function(), setTimeout/setInterval with strings | no-banned-terms, no-string-based-set-immediate |
| Network Access | XMLHttpRequest, fetch(), WebSocket | (certification requirement) |
| DOM Manipulation | innerHTML =, outerHTML =, document.write(), .html(data) | no-inner-outer-html, no-document-write, no-implied-inner-html |
| Sensitive Access | document.domain, document.cookie | no-document-domain, no-banned-terms |
| Informational | HTTP URLs, Math.random() | no-http-string, insecure-random |

**How Author vs Library findings work:**

Each finding row has a `Code Origin` column indicating whether the pattern was found in:
- **Author** code -- attributed to the visual developer's own code. These contribute to the risk score.
- **Library** code -- attributed to a known third-party library (d3, jQuery, React, etc.). These do not contribute to the risk score.

### 4. oss_licenses.csv -- Library and license details

**Who should read this:** Legal/compliance teams reviewing open-source obligations.

One row per library per visual. Columns (9 total):

| Column | Description |
|--------|-------------|
| GUID | Visual identifier |
| Visual Name | Display name |
| Latest Version | Version scanned |
| Library Name | Detected library (e.g., "jQuery", "d3.js", "React") |
| Library Version | Detected version, if available |
| License Type | License (e.g., "MIT", "Apache-2.0", "GPL-3.0") |
| Is GPL Family | Whether this is a copyleft license (GPL, LGPL, AGPL, etc.) |
| Is Certified | Whether the visual is Microsoft-certified |
| Popularity | Usage popularity |

### 5. scan_metadata.json -- Machine-readable scan metadata

**Who should read this:** Automation pipelines and tools that consume scanner output programmatically.

Contains metadata about the scan run: timestamp, visual counts, scanner version, and configuration details.

---

## How to run the scanner

### Prerequisites

1. **Python 3.9+** installed
2. **Node.js 18+** installed (for ESLint scanning)
3. The `Extracted/` folder populated (run `DownloadVisuals.py` first)

### Quick start

```bash
# 1. Clone the repo
git clone https://github.com/DataChant/PowerBI-Visuals-AppSource.git
cd PowerBI-Visuals-AppSource

# 2. Install Node.js dependencies (one-time)
cd "Automation tools"
npm install
cd ..

# 3. Download and extract visuals (if not already done)
python "Automation tools/DownloadVisuals.py"

# 4. Run the security pattern scanner (~9 minutes)
python "Automation tools/ScanSecurity.py"

# 5. Run the open-source library scanner (~28 minutes)
python "Automation tools/ScanOSS.py"

# 6. Run Microsoft's ESLint rules (~1-2 hours)
python "Automation tools/ScanESLint.py"

# 7. Generate the report
python "Automation tools/GenerateScanReport.py"
```

### Run the full pipeline at once

```bash
python "Automation tools/Private/run_security_scan.py"
```

This runs steps 4-7 in sequence.

### Run only specific scanners

Each scanner is independent. You can run any combination:

```bash
# Just the pattern scan (fastest, ~9 minutes)
python "Automation tools/ScanSecurity.py"
python "Automation tools/GenerateScanReport.py"

# Pattern scan + library detection (~37 minutes)
python "Automation tools/ScanSecurity.py"
python "Automation tools/ScanOSS.py"
python "Automation tools/GenerateScanReport.py"

# Full scan with ESLint (~2 hours total)
python "Automation tools/Private/run_security_scan.py"
```

### Incremental scanning

After the first full scan, subsequent runs are fast because:
- `ScanSecurity.py` and `ScanOSS.py` scan all folders in `Extracted/` each time (they process metadata, which is fast)
- `ScanESLint.py` can be configured to skip already-scanned visuals
- New visuals appear automatically when `DownloadVisuals.py` downloads them

### Output files

After running the scanner, these files appear in the repo root:

| File | Size (typical) | Updated by |
|------|---------------|------------|
| `security_scan_summary.md` | ~14 KB | GenerateScanReport.py |
| `visual_security_scores.csv` | ~250 KB | GenerateScanReport.py |
| `security_findings_detail.csv` | ~700 KB | GenerateScanReport.py |
| `oss_licenses.csv` | ~600 KB | GenerateScanReport.py |
| `scan_metadata.json` | ~1 KB | GenerateScanReport.py |

---

## Understanding risk scoring

### How scores are calculated

The score reflects how many certification-relevant patterns were attributed to the visual's **own code** (not bundled libraries):

| Category | Points per pattern | Examples |
|----------|-------------------|----------|
| Dynamic Code Execution | 10 pts (max 3x = 30) | eval(), Function(), setTimeout/setInterval with strings |
| Network Access | 10 pts (max 3x = 30) | XMLHttpRequest, fetch(), WebSocket |
| DOM Manipulation | 5 pts (max 3x = 15) | innerHTML =, outerHTML =, document.write(), .html(data) |
| Sensitive Access | 5 pts (max 3x = 15) | document.domain, document.cookie |
| Informational | 1 pt (max 3x = 3) | HTTP URLs, Math.random() |

Permissions add to the score:
- Wildcard WebAccess (`*`) = +8 pts
- Scoped WebAccess = +3 pts

### Risk levels

| Risk Level | What it means |
|------------|---------------|
| **High** | Many patterns from multiple categories, significant risk surface |
| **Medium** | Several patterns detected, moderate risk surface |
| **Low** | A few patterns, possibly from permissions only |
| **None** | Clean -- no patterns found outside library code |

### Important: risk levels are not vulnerability ratings

A High risk level does **not** mean the visual is dangerous. It means the compiled code contains patterns that Microsoft's certification process flags for review. Many of these patterns:

- Come from well-known libraries (d3, jQuery, React) despite our library-exclusion filter
- Are used safely with proper sanitization (e.g., innerHTML + DOMPurify)
- Are standard web development practice

The most reliable indicators are the **permission declarations** (WebAccess, ExportContent, LocalStorage) because they are explicitly chosen by the developer.

---

## Frequently asked questions

### Why are certified visuals showing patterns?

Microsoft's certification reviews **TypeScript source code**, not compiled webpack bundles. Our scanner analyzes the compiled bundle, which merges the visual's code with all its dependencies (d3, jQuery, React, etc.) into a single file. Patterns from these libraries appear in the scan even though the visual author didn't write them.

We filter out patterns near known library signatures, but some library code is too far from any identifiable banner to be excluded.

### Can I use this to decide which visuals to allow?

Yes, with context. We recommend:
1. **Check permissions first** -- a visual with wildcard WebAccess (`*`) can communicate with any server
2. **Compare certified vs uncertified** -- certified visuals have been reviewed by Microsoft
3. **Look at the publisher** -- established publishers (Microsoft, Akvelon, MAQ Software) have track records
4. **Check version history** -- visuals that resolved findings over time show active maintenance

### How does this compare to Microsoft's certification?

| Aspect | Microsoft Certification | This Scanner |
|--------|----------------------|--------------|
| What is analyzed | TypeScript source code | Compiled JavaScript bundle |
| Tool used | eslint-plugin-powerbi-visuals | Same plugin + regex patterns |
| Library code | Excluded (only visual's code is reviewed) | Filtered but some may remain |
| Manual review | Yes | No |
| Access to source | Required (private repo access) | Not needed |
| Covers uncertified visuals | No | Yes |

### What is the `mocha-avoid-only` rule and why don't you check it?

The `eslint-plugin-powerbi-visuals` includes 11 rules. We check 10 of them. The excluded rule is `mocha-avoid-only`, which prevents accidentally committing `it.only()` or `describe.only()` in test files. It is irrelevant for compiled bundles because test files are not included in the package.

---

## Tools and references

- [eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals) -- Microsoft's ESLint rules (MIT license)
- [Microsoft certification requirements](https://learn.microsoft.com/en-us/power-bi/developer/visuals/power-bi-custom-visuals-certified)
- [Certification policy 1200](https://learn.microsoft.com/en-us/legal/marketplace/certification-policies#1200-power-bi-visuals-additional-certification)
- [js-beautify](https://www.npmjs.com/package/js-beautify) -- Formats minified code for ESLint analysis
- [powerbi-visuals-tools](https://github.com/microsoft/PowerBI-visuals-tools) -- Microsoft's open-source visual packaging tool
