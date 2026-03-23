# Power BI Custom Visuals Security Scan -- 2026-03-23

> This scan uses [eslint-plugin-powerbi-visuals](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals), the same MIT-licensed ESLint plugin that Microsoft requires for AppSource certification ([Policy 1200.1.2](https://learn.microsoft.com/en-us/legal/marketplace/certification-policies#1200-power-bi-visuals-additional-certification)). Detected patterns represent code constructs flagged by Microsoft's certification process. **Their presence does not indicate a security vulnerability.** Many patterns originate from bundled open-source libraries. This project is not affiliated with Microsoft Corporation.

## Key Statistics

| Metric | Count |
|--------|-------|
| Visuals scanned | 1001 |
| Versions analyzed | 3157 |
| Certified visuals | 479 |
| Uncertified visuals | 522 |
| Visuals that resolved patterns in latest version | 96 |

## Findings by Certification Status

| Finding Level | Certified | Uncertified | Total |
|--------------|-----------|-------------|-------|
| High | 455 | 474 | 929 (92%) |
| Medium | 2 | 20 | 22 (2%) |
| Low | 7 | 10 | 17 (1%) |
| None | 15 | 18 | 33 (3%) |
| **Total** | **479** | **522** | **1001** |

## Top 50 Most Popular Visuals -- Security Scorecard

| # | Visual | Publisher | Certified | Finding Level | Permissions | Key Patterns |
|---|--------|-----------|-----------|---------------|-------------|-------------|
| 1 | Gantt | Microsoft Corporation | Yes | High | -- | DOM: 3 |
| 2 | Inforiver Analytics+ (100+ Charts, Gantt, Cards, Table) | xViz LLC dba Lumel | Yes | High | Export | Dynamic Code: 3; DOM: 46 |
| 3 | Text Filter | Microsoft Corporation | Yes | High | -- | DOM: 3 |
| 4 | Chiclet Slicer | Microsoft Corporation | Yes | High | WebAccess | Network: 1; DOM: 3 |
| 5 | Text search slicer | DataBrothers s.r.o. | Yes | High | -- | DOM: 3 |
| 6 | Word Cloud | Microsoft Corporation | Yes | High | -- | DOM: 3 |
| 7 | Zebra BI Tables | Zebra BI | Yes | High | Export, Storage | Dynamic Code: 5; DOM: 7 |
| 8 | Deneb: Declarative Visualization in Power BI | Daniel Marsh-Patrick | Yes | High | Export | Dynamic Code: 7; Network: 1 |
| 9 | Gantt Chart by MAQ Software | MAQ LLC | Yes | High | -- | Dynamic Code: 1; DOM: 10 |
| 10 | Inforiver Super Filter | xViz LLC dba Lumel | Yes | High | Export, Storage | Dynamic Code: 3; DOM: 8 |
| 11 | Sankey Chart | Microsoft Corporation | Yes | High | -- | DOM: 3 |
| 12 | Timeline Slicer | Microsoft Corporation | Yes | High | -- | DOM: 3 |
| 13 | Date Picker | TRUVIZ INC | Yes | High | -- | Dynamic Code: 4; DOM: 53 |
| 14 | HTML Content | Daniel Marsh-Patrick | No | High | WebAccess | Network: 1; DOM: 8 |
| 15 | Maps | relevantVisuals | Yes | High | -- | DOM: 3 |
| 16 | Mass Filter | Insiders.coop | Yes | High | -- | Dynamic Code: 1; DOM: 3 |
| 17 | Radar Chart | Microsoft Corporation | Yes | High | -- | Network: 1; DOM: 7 |
| 18 | Advance Card | Bhavesh Jadav | Yes | High | -- | Dynamic Code: 3; Network: 1 |
| 19 | Icon Map Pro | Tekantis | No | High | WebAccess, Storage | Dynamic Code: 5; Network: 105 |
| 20 | Simple Image | Vincent Faigt | No | None | -- | None |
| 21 | Tachometer | Annik Inc | Yes | High | -- | Dynamic Code: 1; Network: 3 |
| 22 | Box and Whisker chart by MAQ Software | MAQ LLC | Yes | High | -- | Dynamic Code: 2; DOM: 10 |
| 23 | Circle KPI Gauge | Paypal_ITA | No | High | -- | Dynamic Code: 1; Network: 3 |
| 24 | Power KPI Matrix | Microsoft Corporation | Yes | High | -- | Dynamic Code: 4; Network: 4 |
| 25 | Scroller | Fredrik Hedenström | Yes | High | -- | Dynamic Code: 1; Network: 3 |
| 26 | Calendar by MAQ Software | MAQ LLC | Yes | High | -- | Network: 4; DOM: 13 |
| 27 | Filter by Powerviz | TRUVIZ INC | Yes | High | Export, Storage | Dynamic Code: 3; Network: 2 |
| 28 | Gantt Timeline | PowerGraph | Yes | High | -- | Dynamic Code: 2; DOM: 9 |
| 29 | Infographic Designer | Microsoft Corporation | Yes | High | -- | Network: 4; DOM: 13 |
| 30 | Card with States by OKVIZ | OKVIZ Corp. | Yes | High | -- | Dynamic Code: 3; Network: 3 |
| 31 | Histogram Chart (Standard) | PBIVizEdit.com | No | High | -- | Network: 1; DOM: 12 |
| 32 | Play Axis (Dynamic Slicer) | mprozil | Yes | High | -- | Dynamic Code: 1; Network: 1 |
| 33 | Sunburst by Powerviz | TRUVIZ INC | Yes | High | -- | Dynamic Code: 4; Network: 1 |
| 34 | Bullet Chart | Microsoft Corporation | Yes | High | -- | Network: 1; DOM: 3 |
| 35 | Inforiver Reporting Matrix | xViz LLC dba Lumel | Yes | High | Export, Storage | Dynamic Code: 4; DOM: 40 |
| 36 | Sankey Diagram | VisioChart | Yes | High | -- | DOM: 6 |
| 37 | Synoptic Panel by OKVIZ | OKVIZ Corp. | No | High | WebAccess, Export, Storage, AAD | Network: 1; DOM: 10 |
| 38 | Tornado chart | Microsoft Corporation | Yes | None | -- | None |
| 39 | Based On Your Timeline Slicer | Based On | Yes | High | -- | DOM: 3 |
| 40 | HTML Content (lite) | Daniel Marsh-Patrick | Yes | High | -- | Network: 1; DOM: 5 |
| 41 | Heatmap | Weiwei Cui | No | High | -- | DOM: 3 |
| 42 | Sunburst | Microsoft Corporation | Yes | High | -- | DOM: 3 |
| 43 | Animated Bar Chart Race | Wishyoulization | No | High | -- | Dynamic Code: 2; Network: 4 |
| 44 | Dial Gauge | CloudFronts Technologies | Yes | High | -- | Dynamic Code: 1; Network: 1 |
| 45 | Gantt Chart - xViz | xViz LLC dba Lumel | Yes | High | Export | Dynamic Code: 4; DOM: 45 |
| 46 | Map by Squillion | Squillion Technology Private Limited | Yes | High | -- | DOM: 7 |
| 47 | Table Heatmap | Microsoft Corporation | Yes | High | -- | Network: 1; DOM: 3 |
| 48 | Icon Map Slicer | Tekantis | No | High | WebAccess | Dynamic Code: 7; Network: 78 |
| 49 | Performance Flow - xViz | xViz LLC dba Lumel | Yes | High | Export | Dynamic Code: 1; Network: 3 |
| 50 | Smart Filter by OKVIZ | OKVIZ Corp. | Yes | High | -- | Dynamic Code: 3; Network: 3 |

## 929 Visuals with Multiple Patterns (by popularity)

### 455 Certified Visuals

These visuals passed Microsoft's source code review. Patterns found in the compiled code most likely originate from bundled third-party libraries.

| Visual | Publisher | Popularity | Findings (Author) | Permissions | Libraries |
|--------|-----------|------------|-------------------|-------------|----------|
| Gantt | Microsoft Corporation | 1.00 | DOM: 3 | -- | Globalize |
| Inforiver Analytics+ (100+ Charts, Gantt, Cards, Table) | xViz LLC dba Lumel | 1.00 | Code: 3; DOM: 46 | Export | jQuery; Leaflet; DOMPurify; Quill; Globa... |
| Text Filter | Microsoft Corporation | 1.00 | DOM: 3 | -- | -- |
| Chiclet Slicer | Microsoft Corporation | 1.00 | Net: 1; DOM: 3 | Web | Globalize |
| Text search slicer | DataBrothers s.r.o. | 1.00 | DOM: 3 | -- | -- |
| Word Cloud 🟢-1 | Microsoft Corporation | 1.00 | DOM: 3 | -- | Globalize |
| Zebra BI Tables 🟢-1 | Zebra BI | 1.00 | Code: 5; DOM: 7 | Export | Leaflet; Quill; Globalize; JSZip |
| Deneb: Declarative Visualization in Power BI | Daniel Marsh-Patrick | 1.00 | Code: 7; Net: 1; DOM: 19 | Export | Leaflet; Vega; DOMPurify; Globalize; Top... |
| Gantt Chart by MAQ Software | MAQ LLC | 1.00 | Code: 1; DOM: 10 | -- | Leaflet; Globalize |
| Inforiver Super Filter | xViz LLC dba Lumel | 1.00 | Code: 3; DOM: 8 | Export | Leaflet; Globalize |
| Sankey Chart 🟢-1 | Microsoft Corporation | 1.00 | DOM: 3 | -- | Globalize |
| Timeline Slicer | Microsoft Corporation | 1.00 | DOM: 3 | -- | Globalize |
| Date Picker | TRUVIZ INC | 1.00 | Code: 4; DOM: 53 | -- | Leaflet; ag-Grid; jsrsasign |
| Maps | relevantVisuals | 1.00 | DOM: 3 | -- | jQuery; Globalize; TopToJSON / TopoJSON |
| Mass Filter | Insiders.coop | 1.00 | Code: 1; DOM: 3 | -- | Leaflet |
| Radar Chart 🟢-3 | Microsoft Corporation | 1.00 | Net: 1; DOM: 7 | -- | Globalize |
| Advance Card | Bhavesh Jadav | 0.99 | Code: 3; Net: 1; DOM: 3 | -- | -- |
| Tachometer | Annik Inc | 0.99 | Code: 1; Net: 3; DOM: 15 | -- | d3.js; jQuery; Leaflet; Globalize; Lodas... |
| Box and Whisker chart by MAQ Software 🟢-1 | MAQ LLC | 0.99 | Code: 2; DOM: 10 | -- | Leaflet; Globalize |
| Power KPI Matrix | Microsoft Corporation | 0.99 | Code: 4; Net: 4; DOM: 7 | -- | jQuery |
| Scroller | Fredrik Hedenström | 0.99 | Code: 1; Net: 3; DOM: 13 | -- | d3.js; jQuery; Leaflet; Globalize; Lodas... |
| Calendar by MAQ Software | MAQ LLC | 0.99 | Net: 4; DOM: 13 | -- | Globalize |
| Filter by Powerviz | TRUVIZ INC | 0.99 | Code: 3; Net: 2; DOM: 41 | Export | React; Leaflet; ag-Grid; Bootstrap; jsrs... |
| Gantt Timeline | PowerGraph | 0.99 | Code: 2; DOM: 9 | -- | Moment.js; Globalize |
| Infographic Designer | Microsoft Corporation | 0.99 | Net: 4; DOM: 13 | -- | jQuery; React; Globalize; TopToJSON / To... |
| Card with States by OKVIZ | OKVIZ Corp. | 0.99 | Code: 3; Net: 3; DOM: 15 | -- | jQuery; jsrsasign |
| Play Axis (Dynamic Slicer) | mprozil | 0.99 | Code: 1; Net: 1; DOM: 3 | -- | d3.js; Leaflet |
| Sunburst by Powerviz | TRUVIZ INC | 0.99 | Code: 4; Net: 1; DOM: 70 | -- | Leaflet; ag-Grid; jsrsasign; DOMPurify; ... |
| Bullet Chart 🟢-4 | Microsoft Corporation | 0.99 | Net: 1; DOM: 3 | -- | Globalize |
| Inforiver Reporting Matrix | xViz LLC dba Lumel | 0.99 | Code: 4; DOM: 40 | Export | jQuery; Leaflet; DOMPurify; Quill; Globa... |

### 474 Uncertified Visuals (most popular first)

These visuals have not been reviewed by Microsoft. Sorted by popularity so you can assess the most widely-used visuals first.

| Visual | Publisher | Popularity | Findings (Author) | Permissions | Libraries |
|--------|-----------|------------|-------------------|-------------|----------|
| HTML Content | Daniel Marsh-Patrick | 1.00 | Net: 1; DOM: 8 | Web | jQuery; Globalize |
| Icon Map Pro | Tekantis | 0.99 | Code: 5; Net: 105; DOM: 41 | Web | Leaflet; Mapbox GL JS; TopToJSON / TopoJ... |
| Circle KPI Gauge | Paypal_ITA | 0.99 | Code: 1; Net: 3; DOM: 12 | -- | d3.js; jQuery; Leaflet; Globalize; Lodas... |
| Histogram Chart (Standard) | PBIVizEdit.com | 0.99 | Net: 1; DOM: 12 | -- | jQuery; Leaflet; Plotly.js; Globalize; T... |
| Synoptic Panel by OKVIZ | OKVIZ Corp. | 0.99 | Net: 1; DOM: 10 | Web, Export | jQuery; Leaflet; jsrsasign; DOMPurify; G... |
| Heatmap | Weiwei Cui | 0.99 | DOM: 3 | -- | -- |
| Animated Bar Chart Race | Wishyoulization | 0.99 | Code: 2; Net: 4; DOM: 7 | -- | -- |
| Icon Map Slicer | Tekantis | 0.99 | Code: 7; Net: 78; DOM: 13 | Web | Leaflet; Mapbox GL JS; Globalize; TopToJ... |
| Sankey Diagram for Power BI by ChartExpo | polyvista.com | 0.99 | Code: 4; Net: 3; DOM: 63 | Web, Export | jQuery; Leaflet |
| Water Cup | Daniel Szentimrey-Harrach | 0.99 | DOM: 3 | -- | -- |
| Image Grid | Fredrik Hedenström | 0.98 | Code: 1; Net: 3; DOM: 13 | -- | d3.js; jQuery; Leaflet; Lodash |
| Flow map | Weiwei Cui | 0.98 | Code: 3; Net: 1; DOM: 3 | -- | -- |
| Mapbox Custom Visual | Starschema Kereskedelmi es Szolgaltato Korlatolt Felelossegu Tarsasag | 0.98 | Code: 8; Net: 2; DOM: 13 | -- | Leaflet; Mapbox GL JS |
| Heatmap Visual | DEFTEAM SOLUTIONS PRIVATE LIMITED | 0.98 | Code: 1; Net: 7; DOM: 37 | -- | jQuery; Globalize |
| Multi Info Cards | Portfolio Consultoria Empresarial | 0.98 | Code: 2; DOM: 6 | -- | Leaflet |
| Smart Filter Pro by OKVIZ | OKVIZ Corp. | 0.98 | Code: 1; Net: 5; DOM: 15 | -- | d3.js; jQuery; jsrsasign; Globalize |
| Radar Chart by Clear Peaks | CLEAR PEAKS SL | 0.97 | Code: 3; DOM: 15 | -- | ECharts |
| Bar Chart With Top N Selection | Office Solution AI Labs | 0.97 | Code: 2; Net: 1; DOM: 10 | -- | -- |
| Acterys Gantt for Project Management | Managility | 0.97 | Code: 3; Net: 4; DOM: 49 | Web, Export | jQuery; Moment.js; Leaflet; Globalize; D... |
| Box Ploty by Devlup Funnels | Devlup Funnels | 0.97 | Code: 2; Net: 2; DOM: 12 | -- | jQuery; Leaflet; Mapbox GL JS; Plotly.js... |
| Google Maps for Power BI | Dynamica Labs LTD | 0.97 | Code: 2; DOM: 1 | Web | -- |
| PieChart by iFour | iFour Technolab Pvt. Ltd. | 0.97 | Code: 1; Net: 4; DOM: 3 | -- | Leaflet; Globalize |
| Histogram by PQ Systems | PQ Systems | 0.97 | Code: 4; Net: 5; DOM: 7 | -- | -- |
| Charticulator Visual Community (Editor) | Ilfat Galiev | 0.97 | Code: 2; Net: 47; DOM: 17 | Web, Export | React; Leaflet |
| Enlighten Storyteller | ENLIGHTEN DESIGNS | 0.97 | Net: 1; DOM: 3 | Web | jsrsasign; Globalize |
| Route map | Weiwei Cui | 0.97 | DOM: 3 | -- | -- |
| graphomate matrix | graphomate | 0.97 | Code: 4; Net: 4; DOM: 18 | -- | jQuery; Leaflet; DOMPurify; Globalize; N... |
| Galigeo Maps | GALIGEO | 0.96 | Net: 3 | Web, Export | -- |
| Clustered Stacked Column (Standard) 🟢-1 | PBIVizEdit.com | 0.96 | DOM: 12 | -- | jQuery; Leaflet; Plotly.js; Globalize; T... |
| Multi Axis Line Chart for Power BI by ChartExpo | polyvista.com | 0.96 | Code: 4; Net: 3; DOM: 101 | Web, Export | jQuery; Leaflet |

## What do these patterns mean?

| Category | Patterns Checked | What it means | Severity |
|----------|-----------------|---------------|----------|
| Dynamic Code Execution | eval(), Function(), setTimeout/setInterval with strings | Flagged by Microsoft's certification rules | High |
| Network Access | XMLHttpRequest, fetch(), WebSocket | Flagged by Microsoft's certification rules | High |
| DOM Manipulation | innerHTML, outerHTML, document.write(), .html() | Flagged by Microsoft's certification rules | Medium |
| Sensitive Access | document.domain, document.cookie | Flagged by Microsoft's certification rules | Medium |
| Informational | HTTP URLs, Math.random() | Flagged by Microsoft's certification rules | Low |

*Counts reflect only patterns attributed to the visual's own code. Patterns from bundled libraries (d3, jQuery, React, etc.) are excluded where possible.*

## How this scan works

1. We download all visual packages (.pbiviz) from Microsoft AppSource
2. We temporarily extract the compiled JavaScript (no code is stored or published)
3. We run the same [ESLint rules](https://www.npmjs.com/package/eslint-plugin-powerbi-visuals) Microsoft requires for certification
4. We filter out patterns from known libraries (d3, jQuery, React, webpack, etc.)
5. We read the visual's declared permissions from metadata

Full methodology and column definitions: [Scanner User Guide](https://github.com/DataChant/PowerBI-Visuals-AppSource/blob/feature/security-scanning/Automation%20tools/scanner-user-guide.md)

Detailed CSV files: `visual_security_scores.csv`, `security_findings_detail.csv`, `oss_licenses.csv`
