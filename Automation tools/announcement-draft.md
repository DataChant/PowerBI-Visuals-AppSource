# Announcement Draft -- Do Not Publish Yet

*This is a local draft for the GitHub Discussion announcement. Review before publishing.*

---

## Title: New: Scan Power BI custom visuals with the same rules Microsoft uses for certification

---

## Body:

We're excited to share a new capability in this repository: **an automated scanner that checks every Power BI custom visual on AppSource using Microsoft's own certification rules.**

### What is this?

When a visual publisher wants the "Certified" badge on AppSource, Microsoft requires them to pass a set of code checks using [eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals). This tool scans the visual's code for patterns like:

- **Network access** -- Can the visual send your data to an external server?
- **Dynamic code execution** -- Can the visual run code that wasn't part of the original package?
- **Unsafe HTML injection** -- Could the visual modify page content in unexpected ways?
- **Insecure connections** -- Does the visual use HTTP instead of HTTPS?

Our scanner runs these **same checks** on **every visual on AppSource** -- including the ones that aren't certified. This gives Power BI administrators and BI teams visibility into what custom visuals actually do before deploying them.

### What does the scanner produce?

The scanner generates five output files, organized into tiers for different audiences:

**For everyone** -- start here:

| Output | What it tells you |
|--------|------------------|
| **Executive Summary** (`security_scan_summary.md`) | A scannable overview with a **Top 50 Most Popular Visuals scorecard**, risk-level breakdown (High / Medium / Low / None), and key statistics. Ready to share in a GitHub Discussion or paste into Teams. |

**For admins and managers** -- build your allow-list:

| Output | What it tells you |
|--------|------------------|
| **Visual Scores** (`visual_security_scores.csv`) | One row per visual with 25 columns: risk level, pattern counts, permissions, certification status, popularity rank. Import into Excel or Power BI to filter and build your organizational allow-list. |

**For security teams** -- dig into the details:

| Output | What it tells you |
|--------|------------------|
| **Findings Detail** (`security_findings_detail.csv`) | One row per finding per visual -- every pattern the scanner detected, with rule name, severity, and source context. |
| **Library Inventory** (`oss_licenses.csv`) | One row per library per visual -- what open-source libraries each visual bundles and their licenses. |
| **Scan Metadata** (`scan_metadata.json`) | Machine-readable metadata about the scan run (timestamps, counts, configuration). |

### Key things to know

**1. Patterns are not vulnerabilities.** The scanner detects code patterns that Microsoft flags for review during certification. Most patterns come from well-known libraries (d3, jQuery, React) and are perfectly safe. The scanner filters these out where possible.

**2. Risk levels give you a quick signal.** Each visual is assigned a risk level -- **High**, **Medium**, **Low**, or **None** -- based on the number and severity of findings. Start with the Top 50 scorecard in the summary report to see which popular visuals need a closer look.

**3. Permissions are the most reliable signal.** Each visual declares what it needs: network access, data export, local storage, Azure AD authentication. These are chosen by the developer and tell you exactly what the visual can do.

**4. Certified vs. uncertified matters.** Certified visuals have been reviewed by Microsoft's team. Patterns found in certified visuals almost always come from bundled library code, not from the visual author. Uncertified visuals have had no independent review.

### How to run it yourself

```bash
# Install dependencies (one time)
cd "Automation tools" && npm install && cd ..

# Run the full scan pipeline
python "Automation tools/Private/run_security_scan.py"
```

This scans all visuals in your local `Extracted/` folder and generates the reports. Takes about 30-40 minutes for the pattern and library scans, plus 1-2 hours for the full ESLint scan.

### For security teams

We've written a detailed [Scanner User Guide](https://github.com/DataChant/PowerBI-Visuals-AppSource/blob/feature/security-scanning/Automation%20tools/scanner-user-guide.md) that covers:

- Every output column explained
- How pattern scoring works
- How library-code filtering works
- What each Microsoft ESLint rule checks
- How to interpret findings for certified vs. uncertified visuals
- Comparison with Microsoft's certification process

### Tools used

- [eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals) (MIT license) -- Microsoft's official ESLint rules for Power BI visual certification
- [js-beautify](https://www.npmjs.com/package/js-beautify) -- Formats compiled code for ESLint analysis (beautified files are temporary and never stored)

### Important disclaimer

This project performs automated pattern detection on publicly available visual packages. Detected patterns represent code constructs that Microsoft's certification process flags for review -- their presence does not necessarily indicate a security issue. This project is independent and not affiliated with, endorsed by, or sponsored by Microsoft Corporation.

Publishers who wish to discuss findings are welcome to [open an issue](https://github.com/DataChant/PowerBI-Visuals-AppSource/issues).

---

*Track progress and review the code: [PR #65](https://github.com/DataChant/PowerBI-Visuals-AppSource/pull/65)*
