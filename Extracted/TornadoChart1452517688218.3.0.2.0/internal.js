var TornadoChart1452517688218;
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 4805:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EB: () => (/* binding */ DefaultDy),
/* harmony export */   Pq: () => (/* binding */ StandardFontFamily)
/* harmony export */ });
/* unused harmony exports maxLabelWidth, defaultLabelDensity, DefaultFontSizeInPt, LabelTextProperties, defaultLabelColor, defaultInsideLabelColor, hundredPercentFormat, defaultLabelPrecision, updateLabelSettingsFromLabelsObject, getDefaultLabelSettings, getDefaultColumnLabelSettings, getDefaultPointLabelSettings, getLabelPrecision, drawDefaultLabelsForDataPointChart, cleanDataLabels, setHighlightedLabelsOpacity, getLabelFormattedText, enumerateDataLabels, enumerateCategoryLabels, createColumnFormatterCacheManager, getOptionsForLabelFormatter, isTextWidthOverflows, isTextHeightOverflows */
/* harmony import */ var powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4732);
/* harmony import */ var powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4776);
/* harmony import */ var powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6060);
// powerbi.extensibility.utils.type

// powerbi.extensibility.utils.formatting

var font = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_0__/* .font */ .LZ;
var numberFormat = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_0__/* .formattingService */ .dx.numberFormat;
var formattingService = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_0__/* .formattingService */ .dx.formattingService;
var textMeasurementService = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_0__/* .textMeasurementService */ .yF;
var valueFormatter = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_0__/* .valueFormatter */ .wD;
var DisplayUnitSystemType = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_0__/* .displayUnitSystemType */ .Z6.DisplayUnitSystemType;
// powerbi.extensibility.utils.svg

var createClassAndSelector = powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_1__/* .createClassAndSelector */ .CH;


const maxLabelWidth = 50;
const defaultLabelDensity = "50";
const DefaultDy = "-0.15em";
const DefaultFontSizeInPt = 9;
const StandardFontFamily = font.Family.regular.css;
const LabelTextProperties = {
    fontFamily: font.Family.regularSecondary.css,
    fontSize: powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_2__.fromPoint(DefaultFontSizeInPt),
    fontWeight: "normal",
};
const defaultLabelColor = "#777777";
const defaultInsideLabelColor = "#ffffff";
const hundredPercentFormat = "0.00 %;-0.00 %;0.00 %";
const defaultLabelPrecision = (/* unused pure expression or super */ null && (undefined));
const defaultCountLabelPrecision = 0;
const labelGraphicsContextClass = createClassAndSelector("labels");
const linesGraphicsContextClass = createClassAndSelector("lines");
const labelsClass = createClassAndSelector("data-labels");
const lineClass = createClassAndSelector("line-label");
const DimmedOpacity = 0.4;
const DefaultOpacity = 1.0;
function getFillOpacity(selected, highlight, hasSelection, hasPartialHighlights) {
    if ((hasPartialHighlights && !highlight) || (hasSelection && !selected)) {
        return DimmedOpacity;
    }
    return DefaultOpacity;
}
function updateLabelSettingsFromLabelsObject(labelsObj, labelSettings) {
    if (labelsObj) {
        if (labelsObj.show !== undefined) {
            labelSettings.show = labelsObj.show;
        }
        if (labelsObj.showSeries !== undefined) {
            labelSettings.show = labelsObj.showSeries;
        }
        if (labelsObj.color !== undefined) {
            labelSettings.labelColor = labelsObj.color.solid.color;
        }
        if (labelsObj.labelDisplayUnits !== undefined) {
            labelSettings.displayUnits = labelsObj.labelDisplayUnits;
        }
        if (labelsObj.labelPrecision !== undefined) {
            labelSettings.precision = (labelsObj.labelPrecision >= 0)
                ? labelsObj.labelPrecision
                : defaultLabelPrecision;
        }
        if (labelsObj.fontSize !== undefined) {
            labelSettings.fontSize = labelsObj.fontSize;
        }
        if (labelsObj.showAll !== undefined) {
            labelSettings.showLabelPerSeries = labelsObj.showAll;
        }
        if (labelsObj.labelStyle !== undefined) {
            labelSettings.labelStyle = labelsObj.labelStyle;
        }
        if (labelsObj.labelPosition) {
            labelSettings.position = labelsObj.labelPosition;
        }
    }
}
function getDefaultLabelSettings(show = false, labelColor, fontSize) {
    return {
        show: show,
        position: dataLabelInterfaces.PointLabelPosition.Above,
        displayUnits: 0,
        precision: defaultLabelPrecision,
        labelColor: labelColor || defaultLabelColor,
        fontSize: fontSize || DefaultFontSizeInPt,
    };
}
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
function getDefaultColumnLabelSettings(isLabelPositionInside) {
    const labelSettings = getDefaultLabelSettings(false, undefined);
    labelSettings.position = null;
    labelSettings.labelColor = undefined;
    return labelSettings;
}
function getDefaultPointLabelSettings() {
    return {
        show: false,
        position: dataLabelInterfaces.PointLabelPosition.Above,
        displayUnits: 0,
        precision: defaultLabelPrecision,
        labelColor: defaultLabelColor,
        fontSize: DefaultFontSizeInPt,
    };
}
function getLabelPrecision(precision, format) {
    if (precision !== defaultLabelPrecision) {
        return precision;
    }
    if (format === "g" || format === "G") {
        return;
    }
    if (format) {
        // Calculate precision from positive format by default
        const positiveFormat = numberFormat.getComponents(format).positive, formatMetadata = numberFormat.getCustomFormatMetadata(positiveFormat, true /*calculatePrecision*/);
        if (formatMetadata.hasDots) {
            return formatMetadata.precision;
        }
    }
    // For count fields we do not want a precision by default
    return defaultCountLabelPrecision;
}
function drawDefaultLabelsForDataPointChart(data, context, layout, viewport, isAnimator = false, animationDuration, hasSelection, hideCollidedLabels = true) {
    // Hide and reposition labels that overlap
    const dataLabelManager = new DataLabelManager();
    const filteredData = dataLabelManager.hideCollidedLabels(viewport, data, layout, false, hideCollidedLabels);
    const hasAnimation = isAnimator && !!animationDuration;
    let selectedLabels = selectLabels(filteredData, context, false, hasAnimation, animationDuration);
    if (!selectedLabels) {
        return;
    }
    if (hasAnimation) {
        selectedLabels
            .text((d) => d.labeltext)
            .transition("")
            .duration(animationDuration)
            // .style(layout.style as any)
            .style("opacity", (hasSelection ? (d) => getFillOpacity(d.selected, false, hasSelection, false) : 1))
            .attr("x", (d) => d.labelX)
            .attr("y", (d) => d.labelY);
        layout && layout.style && Object.keys(layout.style).forEach(style => selectedLabels = selectedLabels.style(style, layout.style[style]));
    }
    else {
        selectedLabels
            .attr("x", (d) => d.labelX)
            .attr("y", (d) => d.labelY)
            .text((d) => d.labeltext)
            .style(layout.style);
        layout && layout.style && Object.keys(layout.style).forEach(style => selectedLabels = selectedLabels.style(style, layout.style[style]));
    }
    return selectedLabels;
}
function selectLabels(filteredData, context, isDonut = false, forAnimation = false, animationDuration) {
    // Check for a case where resizing leaves no labels - then we need to remove the labels "g"
    if (filteredData.length === 0) {
        cleanDataLabels(context, true);
        return null;
    }
    if (context.select(labelGraphicsContextClass.selectorName).empty()) {
        context.append("g").classed(labelGraphicsContextClass.className, true);
    }
    // line chart ViewModel has a special "key" property for point identification since the "identity" field is set to the series identity
    const hasKey = filteredData[0].key != null;
    const hasDataPointIdentity = filteredData[0].identity != null;
    const getIdentifier = hasKey ?
        (d) => d.key
        : hasDataPointIdentity ?
            (d) => d.identity.getKey()
            : undefined;
    const labels = isDonut ?
        context.select(labelGraphicsContextClass.selectorName).selectAll(labelsClass.selectorName).data(filteredData, (d) => d.data.identity.getKey())
        : getIdentifier != null ?
            context.select(labelGraphicsContextClass.selectorName).selectAll(labelsClass.selectorName).data(filteredData, getIdentifier)
            : context.select(labelGraphicsContextClass.selectorName).selectAll(labelsClass.selectorName).data(filteredData);
    if (forAnimation) {
        labels
            .exit()
            .transition()
            .duration(animationDuration)
            .style("opacity", 0) // fade out labels that are removed
            .remove();
    }
    else {
        labels.exit().remove();
    }
    const allLabels = labels.enter()
        .append("text")
        .classed(labelsClass.className, true)
        .merge(labels);
    if (forAnimation) {
        allLabels.style("opacity", 0);
    }
    return allLabels;
}
function cleanDataLabels(context, removeLines = false) {
    const empty = [], labels = context.selectAll(labelsClass.selectorName).data(empty);
    labels
        .exit()
        .remove();
    context
        .selectAll(labelGraphicsContextClass.selectorName)
        .remove();
    if (removeLines) {
        const lines = context
            .selectAll(lineClass.selectorName)
            .data(empty);
        lines
            .exit()
            .remove();
        context
            .selectAll(linesGraphicsContextClass.selectorName)
            .remove();
    }
}
function setHighlightedLabelsOpacity(context, hasSelection, hasHighlights) {
    context
        .selectAll(labelsClass.selectorName)
        .style("fill-opacity", (d) => {
        const labelOpacity = getFillOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && hasHighlights) < 1 ? 0 : 1;
        return labelOpacity;
    });
}
function getLabelFormattedText(options) {
    const properties = {
        text: options.formatter
            ? options.formatter.format(options.label)
            : formattingService.formatValue(options.label, options.format),
        fontFamily: LabelTextProperties.fontFamily,
        fontSize: PixelConverter.fromPoint(options.fontSize),
        fontWeight: LabelTextProperties.fontWeight,
    };
    return textMeasurementService.getTailoredTextOrDefault(properties, options.maxWidth
        ? options.maxWidth
        : maxLabelWidth);
}
function enumerateDataLabels(options) {
    if (!options.dataLabelsSettings) {
        return;
    }
    const instance = {
        objectName: "labels",
        selector: options.selector,
        properties: {},
    };
    if (options.show && options.selector) {
        instance.properties["showSeries"] = options.dataLabelsSettings.show;
    }
    else if (options.show) {
        instance.properties["show"] = options.dataLabelsSettings.show;
    }
    instance.properties["color"] = options.dataLabelsSettings.labelColor || defaultLabelColor;
    if (options.displayUnits) {
        instance.properties["labelDisplayUnits"] = options.dataLabelsSettings.displayUnits;
    }
    if (options.precision) {
        const precision = options.dataLabelsSettings.precision;
        instance.properties["labelPrecision"] = precision === defaultLabelPrecision ? null : precision;
    }
    if (options.position) {
        instance.properties["labelPosition"] = options.dataLabelsSettings.position;
        if (options.positionObject) {
            instance.validValues = { "labelPosition": options.positionObject };
        }
    }
    if (options.labelStyle) {
        instance.properties["labelStyle"] = options.dataLabelsSettings.labelStyle;
    }
    if (options.fontSize) {
        instance.properties["fontSize"] = options.dataLabelsSettings.fontSize;
    }
    if (options.labelDensity) {
        const lineChartSettings = options.dataLabelsSettings;
        if (lineChartSettings) {
            instance.properties["labelDensity"] = lineChartSettings.labelDensity;
        }
    }
    // Keep show all as the last property of the instance.
    if (options.showAll) {
        instance.properties["showAll"] = options.dataLabelsSettings.showLabelPerSeries;
    }
    options.instances.push(instance);
    return instance;
}
function enumerateCategoryLabels(enumeration, dataLabelsSettings, withFill, isShowCategory = false, fontSize) {
    const labelSettings = (dataLabelsSettings)
        ? dataLabelsSettings
        : getDefaultPointLabelSettings();
    const instance = {
        objectName: "categoryLabels",
        selector: null,
        properties: {
            show: isShowCategory
                ? labelSettings.showCategory
                : labelSettings.show,
            fontSize: dataLabelsSettings ? dataLabelsSettings.fontSize : DefaultFontSizeInPt,
        },
    };
    if (withFill) {
        instance.properties["color"] = labelSettings.categoryLabelColor
            ? labelSettings.categoryLabelColor
            : labelSettings.labelColor;
    }
    if (fontSize) {
        instance.properties["fontSize"] = fontSize;
    }
    enumeration.instances.push(instance);
}
function createColumnFormatterCacheManager() {
    return {
        cache: { defaultFormatter: null },
        getOrCreate(formatString, labelSetting, value2) {
            if (formatString) {
                const cacheKeyObject = {
                    formatString: formatString,
                    displayUnits: labelSetting.displayUnits,
                    precision: getLabelPrecision(labelSetting.precision, formatString),
                    value2: value2
                };
                const cacheKey = JSON.stringify(cacheKeyObject);
                if (!this.cache[cacheKey]) {
                    this.cache[cacheKey] = valueFormatter.create(getOptionsForLabelFormatter(labelSetting, formatString, value2, cacheKeyObject.precision));
                }
                return this.cache[cacheKey];
            }
            if (!this.cache.defaultFormatter) {
                this.cache.defaultFormatter = valueFormatter.create(getOptionsForLabelFormatter(labelSetting, formatString, value2, labelSetting.precision));
            }
            return this.cache.defaultFormatter;
        }
    };
}
function getOptionsForLabelFormatter(labelSetting, formatString, value2, precision) {
    return {
        displayUnitSystemType: DisplayUnitSystemType.DataLabels,
        format: formatString,
        precision: precision,
        value: labelSetting.displayUnits,
        value2: value2,
        allowFormatBeautification: true,
    };
}
function isTextWidthOverflows(textWidth, maxTextWidth) {
    return textWidth > maxTextWidth;
}
function isTextHeightOverflows(textHeight, innerChordLength) {
    return textHeight > innerChordLength;
}
//# sourceMappingURL=dataLabelUtils.js.map

/***/ }),

/***/ 7661:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   q: () => (/* binding */ LegendBehavior)
/* harmony export */ });
/* harmony import */ var powerbi_visuals_utils_interactivityutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1101);
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/

class LegendBehavior {
    bindEvents(options, selectionHandler) {
        const legendItems = options.legendItems;
        this.legendIcons = options.legendIcons;
        const clearCatcher = options.clearCatcher;
        powerbi_visuals_utils_interactivityutils__WEBPACK_IMPORTED_MODULE_0__/* .registerStandardSelectionHandler */ .YG(legendItems, selectionHandler);
        clearCatcher.on("click", () => {
            selectionHandler.handleClearSelection();
        });
    }
    renderSelection(hasSelection) {
        if (hasSelection) {
            this.legendIcons.style("fill", (d) => {
                if (!d.selected) {
                    return LegendBehavior.dimmedLegendColor;
                }
                else {
                    return d.color;
                }
            });
        }
        else {
            this.legendIcons.style("fill", (d) => {
                return d.color;
            });
        }
    }
}
LegendBehavior.dimmedLegendColor = "#A6A6A6";
//# sourceMappingURL=legendBehavior.js.map

/***/ }),

/***/ 651:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ OpacityLegendBehavior)
/* harmony export */ });
/* harmony import */ var _legendBehavior__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7661);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

class OpacityLegendBehavior extends _legendBehavior__WEBPACK_IMPORTED_MODULE_0__/* .LegendBehavior */ .q {
    renderSelection(hasSelection) {
        if (hasSelection) {
            this.legendIcons.style("fill", (d) => {
                return d.color;
            })
                .style("fill-opacity", (d) => {
                if (!d.selected) {
                    return OpacityLegendBehavior.dimmedOpacity;
                }
                else {
                    return OpacityLegendBehavior.defaultOpacity;
                }
            });
        }
        else {
            this.legendIcons.style("fill", (d) => {
                return d.color;
            })
                .style("fill-opacity", OpacityLegendBehavior.defaultOpacity);
        }
    }
}
OpacityLegendBehavior.dimmedOpacity = 0.4;
OpacityLegendBehavior.defaultOpacity = 1;
//# sourceMappingURL=opacityLegendBehavior.js.map

/***/ }),

/***/ 8413:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ InteractiveLegend)
/* harmony export */ });
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3838);
/* harmony import */ var powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4776);
/* harmony import */ var _legendInterfaces__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8081);
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
/* eslint-disable powerbi-visuals/no-implied-inner-html */



class InteractiveLegend {
    constructor(element) {
        this.legendContainerParent = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(element);
    }
    getMargins() {
        return {
            height: InteractiveLegend.LegendHeight,
            width: 0
        };
    }
    drawLegend(legendData) {
        const data = legendData.dataPoints;
        if (data.length < 1) {
            return;
        }
        let legendContainerDiv = this.legendContainerParent.select(InteractiveLegend.LegendContainerSelector);
        if (legendContainerDiv.empty()) {
            if (!data.length) {
                return;
            }
            legendContainerDiv = this.legendContainerParent
                .insert("div", ":first-child")
                .style("height", this.getMargins().height)
                .classed(InteractiveLegend.LegendContainerClass, true);
        }
        this.legendContainerDiv = legendContainerDiv;
        // Construct the legend title and items.
        this.drawTitle(data);
        this.drawLegendItems(data);
    }
    reset() {
        if (this.legendContainerDiv) {
            this.legendContainerDiv.remove();
            this.legendContainerDiv = null;
        }
    }
    isVisible() {
        return true;
    }
    /**
     * Not supported
     */
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
    changeOrientation(orientation) { }
    getOrientation() {
        return _legendInterfaces__WEBPACK_IMPORTED_MODULE_1__/* .LegendPosition */ .tV.Top;
    }
    /**
     * Draw the legend title
     */
    drawTitle(data) {
        const titleDiv = this.legendContainerDiv.selectAll(`div.${InteractiveLegend.LegendTitleClass}`), item = titleDiv.data([data[0]]);
        // Enter
        const itemEnter = item.enter(), titleDivEnter = itemEnter
            .append("div")
            .attr("class", InteractiveLegend.LegendTitleClass);
        titleDivEnter
            .filter((d) => d.iconOnlyOnLabel)
            .append("span")
            .attr("class", InteractiveLegend.legendIconClass)
            .html(InteractiveLegend.legendPlaceSelector);
        titleDivEnter.append("span");
        // Update
        item.filter((d) => d.iconOnlyOnLabel)
            .merge(itemEnter)
            .select("span." + InteractiveLegend.legendIconClass)
            .style(InteractiveLegend.legendColorCss, (d) => d.color);
        item
            .merge(itemEnter)
            .select("span:last-child")
            .text((d) => d.category);
    }
    /**
     * Draw the legend items
     */
    drawLegendItems(data) {
        // Add Mesaures - the items of the category in the legend
        this.ensureLegendTableCreated();
        const dataPointsMatrix = [data];
        const legendItemsContainer = this.legendContainerDiv
            .select("tbody")
            .selectAll("tr")
            .data(dataPointsMatrix);
        // Enter
        const legendItemsEnter = legendItemsContainer.enter(), rowEnter = legendItemsEnter.append("tr");
        const cellEnter = rowEnter
            .selectAll("td")
            .data((d) => d, (d) => d.label)
            .enter()
            .append("td")
            .attr("class", InteractiveLegend.LegendItem);
        const cellSpanEnter = cellEnter.append("span");
        cellSpanEnter.filter((d) => !d.iconOnlyOnLabel)
            .append("span")
            .html(InteractiveLegend.legendPlaceSelector)
            .attr("class", InteractiveLegend.legendIconClass)
            .attr("white-space", "nowrap")
            .style("font-size", "20px" // this creates a circle of 10px
        )
            .style("margin-bottom", "7px");
        cellSpanEnter
            .append("span")
            .attr("class", InteractiveLegend.legendItemNameClass);
        cellSpanEnter
            .append("span")
            .attr("class", InteractiveLegend.legendItemMeasureClass);
        // Update
        const legendCells = legendItemsContainer
            .merge(legendItemsEnter)
            .selectAll("td")
            .data((d) => d, (d) => d.label);
        legendCells
            .merge(legendItemsEnter)
            .select(`span.${InteractiveLegend.legendItemNameClass}`)
            .html((d) => powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_2__/* .textUtil */ .QX.removeBreakingSpaces(d.label));
        legendCells
            .merge(legendItemsEnter)
            .select(`span.${InteractiveLegend.legendItemMeasureClass}`)
            .html((d) => `&nbsp;${d.measure}`);
        legendCells
            .merge(legendItemsEnter)
            .select("span." + InteractiveLegend.legendIconClass)
            .style("color", (d) => d.color);
        // Exit
        legendCells
            .exit()
            .remove();
    }
    /**
     * Ensure legend table is created and set horizontal pan gestures on it
     */
    ensureLegendTableCreated() {
        if (this.legendContainerDiv.select("div table").empty()) {
            const legendTable = this.legendContainerDiv
                .append("div")
                .append("table");
            legendTable.style("table-layout", "fixed").append("tbody");
            // Setup Pan Gestures of the legend
            // this.setPanGestureOnLegend(legendTable);
        }
    }
    /**
     * Set Horizontal Pan gesture for the legend
     */
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    setPanGestureOnLegend(legendTable) {
        throw "Not implemented";
        // let parentNode = <HTMLElement>this.legendContainerParent.node();
        // let viewportWidth: number = parentNode.getBoundingClientRect().width;
        // let xscale: d3.ScaleLinear<number, number> = d3.scaleLinear()
        //     .domain([0, viewportWidth])
        //     .range([0, viewportWidth]);
        // let legendZoom: d3.ZoomBehavior<any, any> = d3.zoom()
        //     .scaleExtent([1, 1]) // disable scaling
        //     // .x(xscale) ? ? ?
        //     .on("zoom", () => {
        //         // horizontal pan is valid only in case the legend items width are bigger than the viewport width
        //         if ($(legendTable[0]).width() > viewportWidth) {
        //             let t: number[] = legendZoom;
        //             let tx: number = t[0];
        //             let ty: number = t[1];
        //             tx = Math.min(tx, 0);
        //             tx = Math.max(tx, viewportWidth - $(legendTable[0]).width());
        //             legendZoom.translate([tx, ty]);
        //             legendTable.style("-ms-transform", () => { /* IE 9 */
        //                 return translateXWithPixels(tx);
        //             });
        //             legendTable.style("-webkit-transform", () => { /* Safari */
        //                 return translateXWithPixels(tx);
        //             });
        //             legendTable.style("transform", () => {
        //                 return translateXWithPixels(tx);
        //             });
        //         }
        //     });
        // if (this.legendContainerDiv) {
        //     this.legendContainerDiv.call(legendZoom);
        // } else {
        //     legendTable.call(legendZoom);
        // }
    }
}
InteractiveLegend.LegendHeight = 70;
InteractiveLegend.LegendContainerClass = "interactive-legend";
InteractiveLegend.LegendContainerSelector = ".interactive-legend";
InteractiveLegend.LegendTitleClass = "title";
InteractiveLegend.LegendItem = "item";
InteractiveLegend.legendPlaceSelector = "\u25CF";
InteractiveLegend.legendIconClass = "icon";
InteractiveLegend.legendColorCss = "color";
InteractiveLegend.legendItemNameClass = "itemName";
InteractiveLegend.legendItemMeasureClass = "itemMeasure";
//# sourceMappingURL=interactiveLegend.js.map

/***/ }),

/***/ 6674:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   OG: () => (/* binding */ createLegend)
/* harmony export */ });
/* unused harmony exports isLeft, isTop, positionChartArea */
/* harmony import */ var _legendInterfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8081);
/* harmony import */ var _interactiveLegend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8413);
/* harmony import */ var _svgLegend__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1292);



function createLegend(legendParentElement, interactive, interactivityService, isScrollable = false, legendPosition = _legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .LegendPosition */ .tV.Top, interactiveBehavior) {
    if (interactive) {
        return new _interactiveLegend__WEBPACK_IMPORTED_MODULE_1__/* .InteractiveLegend */ .c(legendParentElement);
    }
    return new _svgLegend__WEBPACK_IMPORTED_MODULE_2__/* .SVGLegend */ .N(legendParentElement, legendPosition, interactivityService, isScrollable, interactiveBehavior);
}
function isLeft(orientation) {
    switch (orientation) {
        case LegendPosition.Left:
        case LegendPosition.LeftCenter:
            return true;
        default:
            return false;
    }
}
function isTop(orientation) {
    switch (orientation) {
        case LegendPosition.Top:
        case LegendPosition.TopCenter:
            return true;
        default:
            return false;
    }
}
function positionChartArea(chartArea, legend) {
    const legendMargins = legend.getMargins(), legendOrientation = legend.getOrientation();
    chartArea.style("margin-left", isLeft(legendOrientation)
        ? legendMargins.width + "px"
        : null);
    chartArea.style("margin-top", isTop(legendOrientation)
        ? legendMargins.height + "px"
        : null);
}
//# sourceMappingURL=legend.js.map

/***/ }),

/***/ 7410:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DefaultLegendLabelFillColor: () => (/* binding */ DefaultLegendLabelFillColor),
/* harmony export */   update: () => (/* binding */ update)
/* harmony export */ });
/* harmony import */ var _legendInterfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8081);
/* harmony import */ var _legendPosition__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2002);
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/


const DefaultLegendLabelFillColor = "#666666";
function update(legendData, legendObject) {
    if (legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.show] == null) {
        legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.show] = true;
    }
    if (legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.show] === false) {
        legendData.dataPoints = [];
    }
    if (legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.show] === true && legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.position] == null) {
        legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.position] = _legendPosition__WEBPACK_IMPORTED_MODULE_1__/* .top */ .we;
    }
    if (legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.fontSize] !== undefined) {
        legendData.fontSize = legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.fontSize];
    }
    if (legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.labelColor] !== undefined) {
        const fillColor = legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.labelColor];
        if (fillColor != null) {
            legendData.labelColor = fillColor.solid.color;
        }
    }
    if (legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.showTitle] === false) {
        legendData.title = "";
    }
    else if (legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.titleText] !== undefined) {
        legendData.title = legendObject[_legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .legendProps */ .D$.titleText];
    }
}
//# sourceMappingURL=legendData.js.map

/***/ }),

/***/ 8081:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D$: () => (/* binding */ legendProps),
/* harmony export */   TD: () => (/* binding */ LineStyle),
/* harmony export */   ZO: () => (/* binding */ MarkerShape),
/* harmony export */   tV: () => (/* binding */ LegendPosition)
/* harmony export */ });
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
var LegendPosition;
(function (LegendPosition) {
    LegendPosition[LegendPosition["Top"] = 0] = "Top";
    LegendPosition[LegendPosition["Bottom"] = 1] = "Bottom";
    LegendPosition[LegendPosition["Right"] = 2] = "Right";
    LegendPosition[LegendPosition["Left"] = 3] = "Left";
    LegendPosition[LegendPosition["None"] = 4] = "None";
    LegendPosition[LegendPosition["TopCenter"] = 5] = "TopCenter";
    LegendPosition[LegendPosition["BottomCenter"] = 6] = "BottomCenter";
    LegendPosition[LegendPosition["RightCenter"] = 7] = "RightCenter";
    LegendPosition[LegendPosition["LeftCenter"] = 8] = "LeftCenter";
})(LegendPosition || (LegendPosition = {}));
var MarkerShape;
(function (MarkerShape) {
    MarkerShape["circle"] = "circle";
    MarkerShape["square"] = "square";
    MarkerShape["longDash"] = "longDash";
})(MarkerShape || (MarkerShape = {}));
var LineStyle;
(function (LineStyle) {
    LineStyle["dashed"] = "dashed";
    LineStyle["solid"] = "solid";
    LineStyle["dotted"] = "dotted";
    LineStyle["dotdash"] = "dotdash";
    LineStyle["dashdot"] = "dashdot";
})(LineStyle || (LineStyle = {}));
const legendProps = {
    show: "show",
    position: "position",
    titleText: "titleText",
    showTitle: "showTitle",
    labelColor: "labelColor",
    fontSize: "fontSize",
};
//# sourceMappingURL=legendInterfaces.js.map

/***/ }),

/***/ 2002:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   we: () => (/* binding */ top)
/* harmony export */ });
/* unused harmony exports bottom, left, right, topCenter, bottomCenter, leftCenter, rightCenter */
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
const top = "Top";
const bottom = "Bottom";
const left = "Left";
const right = "Right";
const topCenter = "TopCenter";
const bottomCenter = "BottomCenter";
const leftCenter = "LeftCenter";
const rightCenter = "RightCenter";
//# sourceMappingURL=legendPosition.js.map

/***/ }),

/***/ 8710:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BO: () => (/* binding */ LegendIconLineTotalWidth),
/* harmony export */   DW: () => (/* binding */ getPath),
/* harmony export */   F: () => (/* binding */ getStrokeWidth),
/* harmony export */   zm: () => (/* binding */ defaultSize)
/* harmony export */ });
/* harmony import */ var _legendInterfaces__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8081);

const defaultSize = 5;
const LegendIconLineTotalWidth = 31;
const circlePath = "M 0 0 m -5 0 a 5 5 0 1 0 10 0 a 5 5 0 1 0 -10 0";
const squarePath = "M 0 0 m -5 -5 l 10 0 l 0 10 l -10 0 z";
const longDashPath = "M -" + (LegendIconLineTotalWidth / 2) + " 0 L " + (LegendIconLineTotalWidth / 2) + " 0";
const shapeStroke = 0;
const thickStroke = 2;
function getPath(shape) {
    switch (shape) {
        case _legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .MarkerShape */ .ZO.circle: {
            return circlePath;
        }
        case _legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .MarkerShape */ .ZO.square: {
            return squarePath;
        }
        case _legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .MarkerShape */ .ZO.longDash: {
            return longDashPath;
        }
        default: {
            return undefined;
        }
    }
}
function getStrokeWidth(shape) {
    switch (shape) {
        case _legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .MarkerShape */ .ZO.longDash: {
            return thickStroke;
        }
        case _legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .MarkerShape */ .ZO.circle:
        case _legendInterfaces__WEBPACK_IMPORTED_MODULE_0__/* .MarkerShape */ .ZO.square:
        default: {
            return shapeStroke;
        }
    }
}
//# sourceMappingURL=markers.js.map

/***/ }),

/***/ 1292:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   N: () => (/* binding */ SVGLegend)
/* harmony export */ });
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3838);
/* harmony import */ var powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(4776);
/* harmony import */ var powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4732);
/* harmony import */ var powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7281);
/* harmony import */ var powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6060);
/* harmony import */ var powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9280);
/* harmony import */ var _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8081);
/* harmony import */ var _behavior_legendBehavior__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7661);
/* harmony import */ var powerbi_visuals_utils_interactivityutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9406);
/* harmony import */ var _markers__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(8710);
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/









var createClassAndSelector = powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_0__/* .createClassAndSelector */ .CH;
// powerbi.extensibility.utils.interactivity
var appendClearCatcher = powerbi_visuals_utils_interactivityutils__WEBPACK_IMPORTED_MODULE_1__/* .appendClearCatcher */ .EX;
var dataHasSelection = powerbi_visuals_utils_interactivityutils__WEBPACK_IMPORTED_MODULE_1__/* .dataHasSelection */ .G6;
class SVGLegend {
    constructor(element, legendPosition, interactivityService, isScrollable, interactiveBehavior) {
        this.legendDataStartIndex = 0;
        this.arrowPosWindow = 1;
        this.lastCalculatedWidth = 0;
        this.visibleLegendWidth = 0;
        this.visibleLegendHeight = 0;
        this.legendFontSizeMarginDifference = 0;
        this.legendFontSizeMarginValue = 0;
        this.svg = (0,d3_selection__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z)(element)
            .append("svg")
            .style("position", "absolute");
        this.svg.style("display", "inherit");
        this.svg.classed("legend", true);
        if (interactivityService) {
            this.clearCatcher = appendClearCatcher(this.svg);
        }
        this.group = this.svg
            .append("g")
            .attr("id", "legendGroup");
        this.interactiveBehavior = interactiveBehavior ? interactiveBehavior : new _behavior_legendBehavior__WEBPACK_IMPORTED_MODULE_3__/* .LegendBehavior */ .q();
        this.interactivityService = interactivityService;
        this.isScrollable = isScrollable;
        this.element = element;
        this.changeOrientation(legendPosition);
        this.parentViewport = { height: 0, width: 0 };
        this.calculateViewport();
        this.updateLayout();
    }
    updateLayout() {
        const legendViewport = this.viewport;
        const orientation = this.orientation;
        this.svg.attr("height", legendViewport.height || (orientation === _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.None ? 0 : this.parentViewport.height));
        this.svg.attr("width", legendViewport.width || (orientation === _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.None ? 0 : this.parentViewport.width));
        const isRight = orientation === _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.Right || orientation === _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.RightCenter, isBottom = orientation === _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.Bottom || orientation === _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.BottomCenter;
        this.svg.style("margin-left", isRight ? (this.parentViewport.width - legendViewport.width) + "px" : null);
        this.svg.style("margin-top", isBottom ? (this.parentViewport.height - legendViewport.height) + "px" : null);
    }
    calculateViewport() {
        switch (this.orientation) {
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.Top:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.Bottom:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.TopCenter:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.BottomCenter:
                const pixelHeight = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_5__.fromPointToPixel(this.data && this.data.fontSize
                    ? this.data.fontSize
                    : SVGLegend.DefaultFontSizeInPt);
                const fontHeightSize = SVGLegend.TopLegendHeight + (pixelHeight - SVGLegend.DefaultFontSizeInPt);
                this.viewport = { height: fontHeightSize, width: 0 };
                return;
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.Right:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.Left:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.RightCenter:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.LeftCenter:
                const width = this.lastCalculatedWidth
                    ? this.lastCalculatedWidth
                    : this.parentViewport.width * SVGLegend.LegendMaxWidthFactor;
                this.viewport = { height: 0, width: width };
                return;
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.None:
                this.viewport = { height: 0, width: 0 };
        }
    }
    getMargins() {
        return this.viewport;
    }
    isVisible() {
        return this.orientation !== _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.None;
    }
    changeOrientation(orientation) {
        if (orientation) {
            this.orientation = orientation;
        }
        else {
            this.orientation = _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.Top;
        }
        this.svg.attr("orientation", orientation);
    }
    getOrientation() {
        return this.orientation;
    }
    drawLegend(data, viewport) {
        // clone because we modify legend item label with ellipsis if it is truncated
        const clonedData = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_6__.inherit(data), newDataPoints = [];
        for (const dp of data.dataPoints) {
            newDataPoints.push(powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_6__.inherit(dp));
        }
        clonedData.dataPoints = newDataPoints;
        this.setTooltipToLegendItems(clonedData);
        this.drawLegendInternal(clonedData, viewport, true /* perform auto width */);
    }
    /* eslint-disable-next-line max-lines-per-function */
    drawLegendInternal(data, viewport, autoWidth) {
        this.parentViewport = viewport;
        this.data = data;
        if (this.interactivityService)
            this.interactivityService.applySelectionStateToData(data.dataPoints);
        if (data.dataPoints.length === 0) {
            this.changeOrientation(_legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.None);
        }
        if (this.getOrientation() === _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.None) {
            data.dataPoints = [];
        }
        // Adding back the workaround for Legend Left/Right position for Map
        const mapControls = this.element.getElementsByClassName("mapControl");
        if (mapControls.length > 0 && !this.isTopOrBottom(this.orientation)) {
            for (let i = 0; i < mapControls.length; ++i) {
                const element = mapControls[i];
                element.style.display = "inline-block";
            }
        }
        this.calculateViewport();
        const layout = this.calculateLayout(data, autoWidth);
        const titleLayout = layout.title;
        const titleData = titleLayout ? [titleLayout] : [];
        const hasSelection = this.interactivityService && dataHasSelection(data.dataPoints);
        const group = this.group;
        // transform the wrapping group if position is centered
        if (this.isCentered(this.orientation)) {
            let centerOffset = 0;
            if (this.isTopOrBottom(this.orientation)) {
                centerOffset = Math.max(0, (this.parentViewport.width - this.visibleLegendWidth) / 2);
                group.attr("transform", powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_7__.translate(centerOffset, 0));
            }
            else {
                centerOffset = Math.max((this.parentViewport.height - this.visibleLegendHeight) / 2);
                group.attr("transform", powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_7__.translate(0, centerOffset));
            }
        }
        else {
            group.attr("transform", null);
        }
        const legendTitle = group
            .selectAll(SVGLegend.LegendTitle.selectorName);
        const legendTitleData = legendTitle.data(titleData);
        const enteredLegendTitle = legendTitleData
            .enter()
            .append("text")
            .classed(SVGLegend.LegendTitle.className, true);
        legendTitleData
            .merge(enteredLegendTitle)
            .style("fill", data.labelColor)
            .style("font-size", powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_5__.fromPoint(data.fontSize))
            .style("font-family", data.fontFamily)
            .text((d) => d.text)
            .attr("x", (d) => d.x)
            .attr("y", (d) => d.y)
            .append("title")
            .text(data.title);
        legendTitleData
            .exit()
            .remove();
        const virtualizedDataPoints = data.dataPoints.slice(this.legendDataStartIndex, this.legendDataStartIndex + layout.numberOfItems);
        const legendItems = group
            .selectAll(SVGLegend.LegendItem.selectorName)
            .data(virtualizedDataPoints, (d) => {
            return d.identity.getKey() + (d.layerNumber != null ? d.layerNumber : "");
        });
        const itemsEnter = legendItems.enter()
            .append("g")
            .classed(SVGLegend.LegendItem.className, true);
        itemsEnter
            .append("path")
            .classed(SVGLegend.LegendIcon.className, true);
        itemsEnter
            .append("text")
            .classed(SVGLegend.LegendText.className, true);
        itemsEnter
            .append("title")
            .text((d) => d.tooltip);
        const mergedLegendIcons = legendItems
            .merge(itemsEnter)
            .select(SVGLegend.LegendIcon.selectorName)
            .attr("transform", (dataPoint) => {
            return powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_7__.translateAndScale(dataPoint.glyphPosition.x, dataPoint.glyphPosition.y, this.getIconScale(dataPoint.markerShape));
        })
            .attr("d", (dataPoint) => {
            return _markers__WEBPACK_IMPORTED_MODULE_8__/* .getPath */ .DW(dataPoint.markerShape || _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .MarkerShape */ .ZO.circle);
        })
            .attr("stroke-width", (dataPoint) => {
            if (dataPoint.lineStyle) {
                return 2;
            }
            return _markers__WEBPACK_IMPORTED_MODULE_8__/* .getStrokeWidth */ .F(dataPoint.markerShape || _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .MarkerShape */ .ZO.circle);
        })
            .style("fill", (dataPoint) => {
            if (dataPoint.lineStyle) {
                return null;
            }
            return dataPoint.color;
        })
            .style("stroke", (dataPoint) => dataPoint.color)
            .style("stroke-dasharray", (dataPoint) => {
            if (dataPoint.lineStyle) {
                return SVGLegend.getStrokeDashArrayForLegend(dataPoint.lineStyle);
            }
            return null;
        })
            .style("stroke-linejoin", "round");
        legendItems
            .merge(itemsEnter)
            .select("title")
            .text((dataPoint) => dataPoint.tooltip);
        const mergedLegendItems = legendItems.merge(itemsEnter);
        mergedLegendItems
            .select(SVGLegend.LegendText.selectorName)
            .attr("x", (dataPoint) => dataPoint.textPosition.x)
            .attr("y", (dataPoint) => dataPoint.textPosition.y)
            .text((d) => d.label)
            .style("fill", data.labelColor)
            .style("font-size", powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_5__.fromPoint(data.fontSize))
            .style("font-family", data.fontFamily);
        if (this.interactivityService) {
            const behaviorOptions = {
                legendItems: mergedLegendItems,
                legendIcons: mergedLegendIcons,
                clearCatcher: this.clearCatcher,
                dataPoints: data.dataPoints,
                behavior: this.interactiveBehavior,
                interactivityServiceOptions: {
                    isLegend: true
                }
            };
            this.interactivityService.bind(behaviorOptions);
            this.interactiveBehavior.renderSelection(hasSelection);
        }
        legendItems
            .exit()
            .remove();
        this.drawNavigationArrows(layout.navigationArrows);
        this.updateLayout();
    }
    static getStrokeDashArrayForLegend(style) {
        switch (style) {
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LineStyle */ .TD.dashed: {
                return "7,5";
            }
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LineStyle */ .TD.dotted: {
                return "2.5,3.1";
            }
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LineStyle */ .TD.dotdash: {
                return "2.5,3.1,7,3.1";
            }
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LineStyle */ .TD.dashdot: {
                return "7,3.1,2.5,3.1";
            }
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LineStyle */ .TD.solid: {
                return null;
            }
        }
    }
    normalizePosition(points) {
        if (this.legendDataStartIndex >= points.length) {
            this.legendDataStartIndex = points.length - 1;
        }
        if (this.legendDataStartIndex < 0) {
            this.legendDataStartIndex = 0;
        }
    }
    calculateTitleLayout(title) {
        let width = 0;
        const hasTitle = !!title;
        if (hasTitle) {
            const isHorizontal = this.isTopOrBottom(this.orientation);
            const textProperties = SVGLegend.getTextProperties(title, this.data.fontSize, this.data.fontFamily);
            let text = title;
            width = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.measureSvgTextWidth(textProperties);
            if (isHorizontal) {
                width += SVGLegend.TitlePadding;
            }
            else {
                text = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.getTailoredTextOrDefault(textProperties, this.viewport.width);
            }
            return {
                text,
                width,
                x: 0,
                y: 0,
                height: powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.estimateSvgTextHeight(textProperties)
            };
        }
        return null;
    }
    /** Performs layout offline for optimal perfomance */
    calculateLayout(data, autoWidth) {
        let dataPoints = data.dataPoints;
        if (data.dataPoints.length === 0) {
            return {
                numberOfItems: 0,
                title: null,
                navigationArrows: []
            };
        }
        this.legendFontSizeMarginValue = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_5__.fromPointToPixel(this.data && this.data.fontSize !== undefined ? this.data.fontSize : SVGLegend.DefaultFontSizeInPt);
        this.legendFontSizeMarginDifference = (this.legendFontSizeMarginValue - SVGLegend.DefaultTextMargin);
        this.normalizePosition(dataPoints);
        if (this.legendDataStartIndex < dataPoints.length) {
            dataPoints = dataPoints.slice(this.legendDataStartIndex);
        }
        const title = this.calculateTitleLayout(data.title);
        let navArrows;
        let numberOfItems;
        if (this.isTopOrBottom(this.orientation)) {
            navArrows = this.isScrollable ? this.calculateHorizontalNavigationArrowsLayout(title) : [];
            numberOfItems = this.calculateHorizontalLayout(dataPoints, title, navArrows);
        }
        else {
            navArrows = this.isScrollable ? this.calculateVerticalNavigationArrowsLayout(title) : [];
            numberOfItems = this.calculateVerticalLayout(dataPoints, title, navArrows, autoWidth);
        }
        return {
            numberOfItems,
            title,
            navigationArrows: navArrows
        };
    }
    updateNavigationArrowLayout(navigationArrows, remainingDataLength, visibleDataLength) {
        if (this.legendDataStartIndex === 0) {
            navigationArrows.shift();
        }
        const lastWindow = this.arrowPosWindow;
        this.arrowPosWindow = visibleDataLength;
        if (navigationArrows && navigationArrows.length > 0 && this.arrowPosWindow === remainingDataLength) {
            this.arrowPosWindow = lastWindow;
            navigationArrows.length = navigationArrows.length - 1;
        }
    }
    calculateHorizontalNavigationArrowsLayout(title) {
        const height = SVGLegend.LegendArrowHeight;
        const width = SVGLegend.LegendArrowWidth;
        const translateY = (this.viewport.height / 2) - (height / 2);
        const data = [];
        const rightShift = title ? title.x + title.width : 0;
        const arrowLeft = powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_7__.createArrow(width, height, 180 /*angle*/);
        const arrowRight = powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_7__.createArrow(width, height, 0 /*angle*/);
        data.push({
            x: rightShift,
            y: translateY,
            path: arrowLeft.path,
            rotateTransform: arrowLeft.transform,
            dataType: 1 /* NavigationArrowType.Decrease */
        });
        data.push({
            x: this.parentViewport.width - width,
            y: translateY,
            path: arrowRight.path,
            rotateTransform: arrowRight.transform,
            dataType: 0 /* NavigationArrowType.Increase */
        });
        return data;
    }
    calculateVerticalNavigationArrowsLayout(title) {
        const height = SVGLegend.LegendArrowHeight;
        const width = SVGLegend.LegendArrowWidth;
        const verticalCenter = this.viewport.height / 2;
        const data = [];
        const rightShift = verticalCenter + height / 2;
        const arrowTop = powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_7__.createArrow(width, height, 270 /*angle*/);
        const arrowBottom = powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_7__.createArrow(width, height, 90 /*angle*/);
        const titleHeight = title ? title.height : 0;
        data.push({
            x: rightShift,
            y: width + titleHeight,
            path: arrowTop.path,
            rotateTransform: arrowTop.transform,
            dataType: 1 /* NavigationArrowType.Decrease */
        });
        data.push({
            x: rightShift,
            y: this.parentViewport.height - height,
            path: arrowBottom.path,
            rotateTransform: arrowBottom.transform,
            dataType: 0 /* NavigationArrowType.Increase */
        });
        return data;
    }
    /**
     * Calculates the widths for each horizontal legend item.
     */
    static calculateHorizontalLegendItemsWidths(dataPoints, availableWidth, iconPadding, fontSize, fontFamily) {
        const dataPointsLength = dataPoints.length;
        // Set the maximum amount of space available to each item. They can use less, but can"t go over this number.
        let maxItemWidth = dataPointsLength > 0 ? availableWidth / dataPointsLength | 0 : 0;
        let maxItemTextWidth = maxItemWidth - iconPadding;
        // Makes sure the amount of space available to each item is at least SVGLegend.MaxTextLength wide.
        // If you had many items and/or a narrow amount of available width, the availableTextWidthPerItem would be small, essentially making everything ellipsis.
        // This prevents that from happening by giving each item at least SVGLegend.MaxTextLength of space.
        if (maxItemTextWidth < SVGLegend.MaxTextLength) {
            maxItemTextWidth = SVGLegend.MaxTextLength;
            maxItemWidth = maxItemTextWidth + iconPadding;
        }
        // Make sure the availableWidthPerItem is less than the availableWidth. This lets the long text properly add ellipsis when we"re displaying one item at a time.
        if (maxItemWidth > availableWidth) {
            maxItemWidth = availableWidth;
            maxItemTextWidth = maxItemWidth - iconPadding;
        }
        let occupiedWidth = 0;
        const legendItems = [];
        // Add legend items until we can"t fit any more (the last one doesn"t fit) or we"ve added all of them
        for (const dataPoint of dataPoints) {
            const textProperties = SVGLegend.getTextProperties(dataPoint.label, fontSize, fontFamily);
            const itemTextWidth = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.measureSvgTextWidth(textProperties);
            const desiredWidth = itemTextWidth + iconPadding;
            const overMaxWidth = desiredWidth > maxItemWidth;
            const actualWidth = overMaxWidth ? maxItemWidth : desiredWidth;
            occupiedWidth += actualWidth;
            if (occupiedWidth >= availableWidth) {
                // Always add at least 1 element
                if (legendItems.length === 0) {
                    legendItems.push({
                        dataPoint: dataPoint,
                        textProperties: textProperties,
                        desiredWidth: desiredWidth,
                        desiredOverMaxWidth: true,
                        width: desiredWidth
                    });
                    // Set the width to the amount of space we actually have
                    occupiedWidth = availableWidth;
                }
                else {
                    // Subtract the width from what was just added since it won"t fit
                    occupiedWidth -= actualWidth;
                }
                break;
            }
            legendItems.push({
                dataPoint: dataPoint,
                textProperties: textProperties,
                desiredWidth: desiredWidth,
                desiredOverMaxWidth: overMaxWidth,
                width: desiredWidth
            });
        }
        // If there are items at max width, evenly redistribute the extra space to them
        const itemsOverMax = legendItems.filter((li) => li.desiredOverMaxWidth);
        let numItemsOverMax = itemsOverMax.length;
        if (numItemsOverMax > 0) {
            let extraWidth = availableWidth - occupiedWidth;
            for (const item of itemsOverMax) {
                // Divvy up the extra space and add it to the max
                // We need to do this calculation in every loop since the remainingWidth may not be changed by the same amount every time
                const extraWidthPerItem = extraWidth / numItemsOverMax;
                const newMaxItemWidth = maxItemWidth + extraWidthPerItem;
                let usedExtraWidth;
                if (item.desiredWidth <= newMaxItemWidth) {
                    // If the item doesn"t need all the extra space, it"s not at max anymore
                    item.desiredOverMaxWidth = false;
                    usedExtraWidth = item.desiredWidth - maxItemWidth;
                }
                else {
                    // Otherwise the item is taking up all the extra space so update the actual width to indicate that
                    item.width = newMaxItemWidth;
                    usedExtraWidth = newMaxItemWidth - maxItemWidth;
                }
                extraWidth -= usedExtraWidth;
                numItemsOverMax--;
            }
        }
        return legendItems;
    }
    calculateHorizontalLayout(dataPoints, title, navigationArrows) {
        const fontSizeBiggerThanDefault = this.legendFontSizeMarginDifference > 0;
        const fontSizeMargin = fontSizeBiggerThanDefault
            ? SVGLegend.TextAndIconPadding + this.legendFontSizeMarginDifference
            : SVGLegend.TextAndIconPadding;
        let occupiedWidth = 0;
        const firstDataPointMarkerShape = dataPoints && dataPoints[0] && dataPoints[0].markerShape;
        const iconTotalItemPadding = this.getMarkerShapeWidth(firstDataPointMarkerShape) + fontSizeMargin * 1.5;
        let numberOfItems = dataPoints.length;
        // get the Y coordinate which is the middle of the container + the middle of the text height - the delta of the text
        const defaultTextProperties = SVGLegend.getTextProperties("", this.data.fontSize, this.data.fontFamily);
        const verticalCenter = this.viewport.height / 2;
        const textYCoordinate = verticalCenter + powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.estimateSvgTextHeight(defaultTextProperties) / 2
            - powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.estimateSvgTextBaselineDelta(defaultTextProperties);
        if (title) {
            occupiedWidth += title.width;
            // get the Y coordinate which is the middle of the container + the middle of the text height - the delta of the text
            title.y = verticalCenter
                + title.height / 2
                - powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.estimateSvgTextBaselineDelta(SVGLegend.getTextProperties(title.text, this.data.fontSize, this.data.fontFamily));
        }
        // if an arrow should be added, we add space for it
        if (this.legendDataStartIndex > 0) {
            occupiedWidth += SVGLegend.LegendArrowOffset;
        }
        // Calculate the width for each of the legend items
        const dataPointsLength = dataPoints.length;
        let availableWidth = this.parentViewport.width - occupiedWidth;
        let legendItems = SVGLegend.calculateHorizontalLegendItemsWidths(dataPoints, availableWidth, iconTotalItemPadding, this.data.fontSize, this.data.fontFamily);
        numberOfItems = legendItems.length;
        // If we can"t show all the legend items, subtract the "next" arrow space from the available space and re-run the width calculations
        if (numberOfItems !== dataPointsLength) {
            availableWidth -= SVGLegend.LegendArrowOffset;
            legendItems = SVGLegend.calculateHorizontalLegendItemsWidths(dataPoints, availableWidth, iconTotalItemPadding, this.data.fontSize, this.data.fontFamily);
            numberOfItems = legendItems.length;
        }
        for (const legendItem of legendItems) {
            const { dataPoint } = legendItem;
            const markerShapeWidth = this.getMarkerShapeWidth(dataPoint.markerShape);
            dataPoint.glyphPosition = {
                // the space taken so far + the radius + the margin / radiusFactor to prevent huge spaces
                x: occupiedWidth + markerShapeWidth / 2 + (this.legendFontSizeMarginDifference / this.getLegendIconFactor(dataPoint.markerShape)),
                // The middle of the container but a bit lower due to text not being in the middle (qP for example making middle between q and P)
                y: this.viewport.height * SVGLegend.LegendIconYRatio,
            };
            const fixedTextShift = (fontSizeMargin / (this.getLegendIconFactor(dataPoint.markerShape) / 2)) + markerShapeWidth;
            dataPoint.textPosition = {
                x: occupiedWidth + fixedTextShift,
                y: textYCoordinate,
            };
            // If we're over the max width, process it so it fits
            if (legendItem.desiredOverMaxWidth) {
                const textWidth = legendItem.width - iconTotalItemPadding;
                dataPoint.label = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.getTailoredTextOrDefault(legendItem.textProperties, textWidth);
            }
            occupiedWidth += legendItem.width;
        }
        this.visibleLegendWidth = occupiedWidth;
        this.updateNavigationArrowLayout(navigationArrows, dataPointsLength, numberOfItems);
        return numberOfItems;
    }
    getMarkerShapeWidth(markerShape) {
        switch (markerShape) {
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .MarkerShape */ .ZO.longDash: {
                return _markers__WEBPACK_IMPORTED_MODULE_8__/* .LegendIconLineTotalWidth */ .BO;
            }
            default: {
                return SVGLegend.LegendIconRadius * 2;
            }
        }
    }
    getLegendIconFactor(markerShape) {
        switch (markerShape) {
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .MarkerShape */ .ZO.circle:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .MarkerShape */ .ZO.square: {
                return 5;
            }
            default: {
                return 6;
            }
        }
    }
    getIconScale(markerShape) {
        switch (markerShape) {
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .MarkerShape */ .ZO.circle:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .MarkerShape */ .ZO.square: {
                return SVGLegend.LegendIconRadius / _markers__WEBPACK_IMPORTED_MODULE_8__/* .defaultSize */ .zm;
            }
            default: {
                return 1;
            }
        }
    }
    calculateVerticalLayout(dataPoints, title, navigationArrows, autoWidth) {
        // check if we need more space for the margin, or use the default text padding
        const fontSizeBiggerThenDefault = this.legendFontSizeMarginDifference > 0;
        const fontFactor = fontSizeBiggerThenDefault ? this.legendFontSizeMarginDifference : 0;
        // calculate the size needed after font size change
        const verticalLegendHeight = 20 + fontFactor;
        const spaceNeededByTitle = 15 + fontFactor;
        const extraShiftForTextAlignmentToIcon = 4 + fontFactor;
        let totalSpaceOccupiedThusFar = verticalLegendHeight;
        // the default space for text and icon radius + the margin after the font size change
        const firstDataPointMarkerShape = dataPoints && dataPoints[0] && dataPoints[0].markerShape;
        const fixedHorizontalIconShift = SVGLegend.TextAndIconPadding
            + this.getMarkerShapeWidth(firstDataPointMarkerShape) / 2
            + this.legendFontSizeMarginDifference;
        const fixedHorizontalTextShift = fixedHorizontalIconShift * 2;
        // check how much space is needed
        const maxHorizontalSpaceAvaliable = autoWidth
            ? this.parentViewport.width * SVGLegend.LegendMaxWidthFactor
                - fixedHorizontalTextShift - SVGLegend.LegendEdgeMariginWidth
            : this.lastCalculatedWidth
                - fixedHorizontalTextShift - SVGLegend.LegendEdgeMariginWidth;
        let numberOfItems = dataPoints.length;
        let maxHorizontalSpaceUsed = 0;
        const parentHeight = this.parentViewport.height;
        if (title) {
            totalSpaceOccupiedThusFar += spaceNeededByTitle;
            title.x = SVGLegend.TextAndIconPadding;
            title.y = spaceNeededByTitle;
            maxHorizontalSpaceUsed = title.width || 0;
        }
        // if an arrow should be added, we add space for it
        if (this.legendDataStartIndex > 0)
            totalSpaceOccupiedThusFar += SVGLegend.LegendArrowOffset;
        const dataPointsLength = dataPoints.length;
        for (let i = 0; i < dataPointsLength; i++) {
            const dp = dataPoints[i];
            const textProperties = SVGLegend.getTextProperties(dp.label, this.data.fontSize, this.data.fontFamily);
            dp.glyphPosition = {
                x: fixedHorizontalIconShift,
                y: (totalSpaceOccupiedThusFar + extraShiftForTextAlignmentToIcon) - powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.estimateSvgTextBaselineDelta(textProperties)
            };
            dp.textPosition = {
                x: fixedHorizontalTextShift,
                y: totalSpaceOccupiedThusFar + extraShiftForTextAlignmentToIcon
            };
            // TODO: [PERF] Get rid of this extra measurement, and modify
            // getTailoredTextToReturnWidth + Text
            const width = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.measureSvgTextWidth(textProperties);
            if (width > maxHorizontalSpaceUsed) {
                maxHorizontalSpaceUsed = width;
            }
            if (width > maxHorizontalSpaceAvaliable) {
                const text = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_9__/* .textMeasurementService */ .yF.getTailoredTextOrDefault(textProperties, maxHorizontalSpaceAvaliable);
                dp.label = text;
            }
            totalSpaceOccupiedThusFar += verticalLegendHeight;
            if (totalSpaceOccupiedThusFar > parentHeight) {
                numberOfItems = i;
                break;
            }
        }
        if (autoWidth) {
            if (maxHorizontalSpaceUsed < maxHorizontalSpaceAvaliable) {
                this.lastCalculatedWidth = this.viewport.width = Math.ceil(maxHorizontalSpaceUsed + fixedHorizontalTextShift + SVGLegend.LegendEdgeMariginWidth);
            }
            else {
                this.lastCalculatedWidth = this.viewport.width = Math.ceil(this.parentViewport.width * SVGLegend.LegendMaxWidthFactor);
            }
        }
        else {
            this.viewport.width = this.lastCalculatedWidth;
        }
        this.visibleLegendHeight = totalSpaceOccupiedThusFar;
        navigationArrows.forEach(d => d.x = this.lastCalculatedWidth / 2);
        this.updateNavigationArrowLayout(navigationArrows, dataPointsLength, numberOfItems);
        return numberOfItems;
    }
    drawNavigationArrows(layout) {
        let arrows = this.group.selectAll(SVGLegend.NavigationArrow.selectorName)
            .data(layout);
        arrows.exit().remove();
        arrows = arrows.merge(arrows
            .enter()
            .append("g")
            .classed(SVGLegend.NavigationArrow.className, true))
            .on("click", (event, d) => {
            const pos = this.legendDataStartIndex;
            this.legendDataStartIndex = d.dataType === 0 /* NavigationArrowType.Increase */
                ? pos + this.arrowPosWindow : pos - this.arrowPosWindow;
            this.drawLegendInternal(this.data, this.parentViewport, false);
        })
            .attr("transform", (d) => powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_7__.translate(d.x, d.y));
        let path = arrows.selectAll("path")
            .data((data) => [data]);
        path.exit().remove();
        path = path
            .enter()
            .append("path")
            .merge(path);
        path.attr("d", (d) => d.path)
            .attr("transform", (d) => d.rotateTransform);
    }
    isTopOrBottom(orientation) {
        switch (orientation) {
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.Top:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.Bottom:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.BottomCenter:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.TopCenter:
                return true;
            default:
                return false;
        }
    }
    isCentered(orientation) {
        switch (orientation) {
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.BottomCenter:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.LeftCenter:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.RightCenter:
            case _legendInterfaces__WEBPACK_IMPORTED_MODULE_4__/* .LegendPosition */ .tV.TopCenter:
                return true;
            default:
                return false;
        }
    }
    /* eslint-disable-next-line @typescript-eslint/no-empty-function */
    reset() { }
    static getTextProperties(text, fontSize, fontFamily) {
        return {
            fontFamily,
            fontSize: powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_5__.fromPoint(fontSize || SVGLegend.DefaultFontSizeInPt),
            text,
        };
    }
    setTooltipToLegendItems(data) {
        // we save the values to tooltip before cut
        for (const dataPoint of data.dataPoints) {
            dataPoint.tooltip = dataPoint.label;
        }
    }
}
SVGLegend.DefaultFontSizeInPt = 8;
SVGLegend.LegendIconRadius = 5;
SVGLegend.MaxTextLength = 60;
SVGLegend.TextAndIconPadding = 5;
SVGLegend.TitlePadding = 15;
SVGLegend.LegendEdgeMariginWidth = 10;
SVGLegend.LegendMaxWidthFactor = 0.3;
SVGLegend.TopLegendHeight = 24;
SVGLegend.DefaultTextMargin = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_5__.fromPointToPixel(SVGLegend.DefaultFontSizeInPt);
SVGLegend.LegendIconYRatio = 0.52;
// Navigation Arrow constants
SVGLegend.LegendArrowOffset = 10;
SVGLegend.LegendArrowHeight = 15;
SVGLegend.LegendArrowWidth = 7.5;
SVGLegend.LegendItem = createClassAndSelector("legendItem");
SVGLegend.LegendText = createClassAndSelector("legendText");
SVGLegend.LegendIcon = createClassAndSelector("legendIcon");
SVGLegend.LegendTitle = createClassAndSelector("legendTitle");
SVGLegend.NavigationArrow = createClassAndSelector("navArrow");
//# sourceMappingURL=svgLegend.js.map

/***/ }),

/***/ 663:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   v: () => (/* binding */ ColorHelper)
/* harmony export */ });
/* harmony import */ var powerbi_visuals_utils_dataviewutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(982);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

class ColorHelper {
    constructor(colors, fillProp, defaultDataPointColor) {
        this.colorPalette = colors;
        this.fillProp = fillProp;
        this.defaultDataPointColor = defaultDataPointColor;
    }
    /**
     * Gets the color for the given series value.
     * If no explicit color or default color has been set then the color is
     * allocated from the color scale for this series.
     */
    getColorForSeriesValue(objects, value, themeColorName) {
        if (this.isHighContrast) {
            return this.getThemeColor(themeColorName);
        }
        return (this.fillProp && powerbi_visuals_utils_dataviewutils__WEBPACK_IMPORTED_MODULE_0__.getFillColor(objects, this.fillProp))
            || this.defaultDataPointColor
            || this.colorPalette.getColor(String(value)).value;
    }
    /**
     * Gets the color for the given measure.
     */
    getColorForMeasure(objects, measureKey, themeColorName) {
        if (this.isHighContrast) {
            return this.getThemeColor(themeColorName);
        }
        // Note, this allocates the color from the scale regardless of if we use it or not which helps keep colors stable.
        const scaleColor = this.colorPalette.getColor(measureKey).value;
        return (this.fillProp && powerbi_visuals_utils_dataviewutils__WEBPACK_IMPORTED_MODULE_0__.getFillColor(objects, this.fillProp))
            || this.defaultDataPointColor
            || scaleColor;
    }
    static normalizeSelector(selector, isSingleSeries) {
        // For dynamic series charts, colors are set per category.  So, exclude any measure (metadata repetition) from the selector.
        if (selector && (isSingleSeries || selector.data)) {
            return { data: selector.data };
        }
        return selector;
    }
    get isHighContrast() {
        return !!(this.colorPalette && this.colorPalette.isHighContrast);
    }
    getThemeColor(themeColorName = "background") {
        return this.colorPalette
            && this.colorPalette[themeColorName]
            && this.colorPalette[themeColorName].value;
    }
    getHighContrastColor(themeColorName = "background", defaultColor) {
        return this.isHighContrast
            ? this.getThemeColor(themeColorName)
            : defaultColor;
    }
}
//# sourceMappingURL=colorHelper.js.map

/***/ }),

/***/ 686:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   $Q: () => (/* binding */ createLinearColorScale),
/* harmony export */   Bx: () => (/* binding */ hexString),
/* harmony export */   HO: () => (/* binding */ shadeColor),
/* harmony export */   SE: () => (/* binding */ channelBlend),
/* harmony export */   U1: () => (/* binding */ rotate),
/* harmony export */   U8: () => (/* binding */ rgbString),
/* harmony export */   WV: () => (/* binding */ parseColorString),
/* harmony export */   _j: () => (/* binding */ darken),
/* harmony export */   cD: () => (/* binding */ hexToRGBString),
/* harmony export */   jd: () => (/* binding */ calculateHighlightColor),
/* harmony export */   ok: () => (/* binding */ hexBlend),
/* harmony export */   qH: () => (/* binding */ rgbBlend),
/* harmony export */   s1: () => (/* binding */ normalizeToHexString)
/* harmony export */ });
/* harmony import */ var powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7802);
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/

function hexToRGBString(hex, transparency) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
        return r + r + g + g + b + b;
    });
    // Hex format which return the format r-g-b
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const rgb = result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
    // Wrong input
    if (rgb === null) {
        return "";
    }
    if (!transparency && transparency !== 0) {
        return "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
    }
    else {
        return "rgba(" + rgb.r + "," + rgb.g + "," + rgb.b + "," + transparency + ")";
    }
}
function rotate(rgbString, rotateFactor) {
    if (rotateFactor === 0)
        return rgbString;
    const originalRgb = parseColorString(rgbString);
    const originalHsv = rgbToHsv(originalRgb);
    const rotatedHsv = rotateHsv(originalHsv, rotateFactor);
    const rotatedRgb = hsvToRgb(rotatedHsv);
    return hexString(rotatedRgb);
}
function normalizeToHexString(color) {
    const rgb = parseColorString(color);
    return hexString(rgb);
}
function parseColorString(color) {
    if (color.indexOf("#") >= 0) {
        if (color.length === 7) {
            // #RRGGBB
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
            if (result == null || result.length < 4)
                return;
            return {
                R: parseInt(result[1], 16),
                G: parseInt(result[2], 16),
                B: parseInt(result[3], 16),
            };
        }
        else if (color.length === 4) {
            // #RGB
            const result = /^#?([a-f\d])([a-f\d])([a-f\d])$/i.exec(color);
            if (result == null || result.length < 4)
                return;
            return {
                R: parseInt(result[1] + result[1], 16),
                G: parseInt(result[2] + result[2], 16),
                B: parseInt(result[3] + result[3], 16),
            };
        }
    }
    else if (color.indexOf("rgb(") >= 0) {
        // rgb(R, G, B)
        const result = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(color);
        if (result == null || result.length < 4)
            return;
        return {
            R: parseInt(result[1], 10),
            G: parseInt(result[2], 10),
            B: parseInt(result[3], 10),
        };
    }
    else if (color.indexOf("rgba(") >= 0) {
        // rgba(R, G, B, A)
        const result = /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/.exec(color);
        if (result == null || result.length < 5)
            return;
        return {
            R: parseInt(result[1], 10),
            G: parseInt(result[2], 10),
            B: parseInt(result[3], 10),
            A: parseFloat(result[4]),
        };
    }
}
function rgbToHsv(rgbColor) {
    let s, h;
    const r = rgbColor.R / 255, g = rgbColor.G / 255, b = rgbColor.B / 255;
    const min = Math.min(r, Math.min(g, b));
    const max = Math.max(r, Math.max(g, b));
    const v = max;
    const delta = max - min;
    if (max === 0 || delta === 0) {
        // R, G, and B must be 0.0, or all the same.
        // In this case, S is 0.0, and H is undefined.
        // Using H = 0.0 is as good as any...
        s = 0;
        h = 0;
    }
    else {
        s = delta / max;
        if (r === max) {
            // Between Yellow and Magenta
            h = (g - b) / delta;
        }
        else if (g === max) {
            // Between Cyan and Yellow
            h = 2 + (b - r) / delta;
        }
        else {
            // Between Magenta and Cyan
            h = 4 + (r - g) / delta;
        }
    }
    // Scale h to be between 0.0 and 1.
    // This may require adding 1, if the value
    // is negative.
    h /= 6;
    if (h < 0) {
        h += 1;
    }
    return {
        H: h,
        S: s,
        V: v,
    };
}
function hsvToRgb(hsvColor) {
    let r, g, b;
    const h = hsvColor.H, s = hsvColor.S, v = hsvColor.V;
    if (s === 0) {
        // If s is 0, all colors are the same.
        // This is some flavor of gray.
        r = v;
        g = v;
        b = v;
    }
    else {
        // The color wheel consists of 6 sectors.
        // Figure out which sector you//re in.
        const sectorPos = h * 6;
        const sectorNumber = Math.floor(sectorPos);
        // get the fractional part of the sector.
        // That is, how many degrees into the sector
        // are you?
        const fractionalSector = sectorPos - sectorNumber;
        // Calculate values for the three axes
        // of the color.
        const p = v * (1.0 - s);
        const q = v * (1.0 - (s * fractionalSector));
        const t = v * (1.0 - (s * (1 - fractionalSector)));
        // Assign the fractional colors to r, g, and b
        // based on the sector the angle is in.
        switch (sectorNumber) {
            case 0:
                r = v;
                g = t;
                b = p;
                break;
            case 1:
                r = q;
                g = v;
                b = p;
                break;
            case 2:
                r = p;
                g = v;
                b = t;
                break;
            case 3:
                r = p;
                g = q;
                b = v;
                break;
            case 4:
                r = t;
                g = p;
                b = v;
                break;
            case 5:
                r = v;
                g = p;
                b = q;
                break;
        }
    }
    return {
        R: Math.floor(r * 255),
        G: Math.floor(g * 255),
        B: Math.floor(b * 255),
    };
}
function rotateHsv(hsvColor, rotateFactor) {
    const newH = hsvColor.H + rotateFactor;
    return {
        H: newH > 1 ? newH - 1 : newH,
        S: hsvColor.S,
        V: hsvColor.V,
    };
}
function darken(color, diff) {
    const flooredNumber = Math.floor(diff);
    return {
        R: Math.max(0, color.R - flooredNumber),
        G: Math.max(0, color.G - flooredNumber),
        B: Math.max(0, color.B - flooredNumber),
    };
}
function rgbString(color) {
    if (color.A == null)
        return "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    return "rgba(" + color.R + "," + color.G + "," + color.B + "," + color.A + ")";
}
function hexString(color) {
    return "#" + componentToHex(color.R) + componentToHex(color.G) + componentToHex(color.B);
}
/**
 * Overlays a color with opacity over a background color
 * @param {string} foreColor Color to overlay
 * @param {number} opacity number between 0 (transparent) to 1 (opaque)
 * @param {string} backColor Background color
 * @returns Result color
 */
function hexBlend(foreColor, opacity, backColor) {
    return hexString(rgbBlend(parseColorString(foreColor), opacity, parseColorString(backColor)));
}
/**
 * Overlays a color with opacity over a background color. Any alpha-channel is ignored.
 * @param {RgbColor} foreColor Color to overlay
 * @param {number} opacity number between 0 (transparent) to 1 (opaque). Any value out of range will be corrected.
 * @param {RgbColor} backColor Background color
 * @returns
 */
function rgbBlend(foreColor, opacity, backColor) {
    // correct opacity
    opacity = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(opacity, 0, 1);
    return {
        R: channelBlend(foreColor.R, opacity, backColor.R),
        G: channelBlend(foreColor.G, opacity, backColor.G),
        B: channelBlend(foreColor.B, opacity, backColor.B)
    };
}
/**
 * Blend a single channel for two colors
 * @param {number} foreChannel Channel of foreground color. Will be enforced to be between 0 and 255.
 * @param {number} opacity opacity of the foreground color. Will be enforced to be between 0 and 1.
 * @param {number} backChannel channel of the background color. Will be enforced to be between 0 and 255.
 * @returns result channel value
 */
function channelBlend(foreChannel, opacity, backChannel) {
    opacity = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(opacity, 0, 1);
    foreChannel = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(foreChannel, 0, 255);
    backChannel = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(backChannel, 0, 255);
    return Math.round((opacity * foreChannel) +
        ((1 - opacity) * backChannel));
}
/**
 * Calculate the highlight color from the rgbColor based on the lumianceThreshold and delta.
 * @param {RgbColor} rgbColor The original color.
 * @param {number} lumianceThreshold The lumiance threshold used, the highlight color will be brighter when the lumiance is smaller the threshold, otherwise the highlight color will be darker. Will be enforced to be between 0 and 1.
 * @param {number} delta the highlight color will be calculated based on the delta. Will be enforced to be between 0 and 1. lumianceThreshold + delta cannot greater than 1.
 * @returns result highlight color value
 */
function calculateHighlightColor(rgbColor, lumianceThreshold, delta) {
    const hsvColor = rgbToHsv(rgbColor);
    // For invalid lumianceThreshold and delta value, use default.
    if (lumianceThreshold + delta > 1 || lumianceThreshold <= 0 || delta <= 0) {
        lumianceThreshold = 0.8;
        delta = 0.2;
    }
    // Make it lighter when the lumianceValue is less than 200, otherwise make it darker.
    if (hsvColor.V < lumianceThreshold)
        hsvColor.V = hsvColor.V + delta;
    else
        hsvColor.V = hsvColor.V - delta;
    return hexString(hsvToRgb(hsvColor));
}
function componentToHex(hexComponent) {
    const clamped = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(hexComponent, 0, 255);
    const hex = clamped.toString(16).toUpperCase();
    return hex.length === 1 ? "0" + hex : hex;
}
function createLinearColorScale(domain, range, clamp) {
    const rangeColors = range.map(v => parseColorString(v));
    return value => {
        // treat undefined and NULL as 0
        if (value == null)
            value = 0;
        // Returns undefined for NaN values
        if (isNaN(value))
            return undefined;
        if (clamp) {
            if (value >= domain[domain.length - 1])
                return range[range.length - 1];
            if (value <= domain[0])
                return range[0];
        }
        let domainMin, domainMax, rangeMin, rangeMax;
        for (let i = 1, len = domain.length; i < len; i++) {
            domainMin = domain[i - 1];
            domainMax = domain[i];
            if (domainMax === value) {
                return range[i];
            }
            else if (value >= domainMin && value <= domainMax) {
                rangeMin = rangeColors[i - 1];
                rangeMax = rangeColors[i];
                break;
            }
        }
        const newValue = {
            R: Math.round((((value - domainMin) * (rangeMax.R - rangeMin.R)) / (domainMax - domainMin)) + rangeMin.R),
            G: Math.round((((value - domainMin) * (rangeMax.G - rangeMin.G)) / (domainMax - domainMin)) + rangeMin.G),
            B: Math.round((((value - domainMin) * (rangeMax.B - rangeMin.B)) / (domainMax - domainMin)) + rangeMin.B)
        };
        return hexString(newValue);
    };
}
/**
 * Convert string hex expression to number, calculate percentage and R, G, B channels.
 * Apply percentage for each channel and return back hex value as string with pound sign.
 */
function shadeColor(color, percent) {
    const hexNum = parseInt(color.slice(1), 16);
    const t = percent < 0 ? 0 : 255;
    const p = percent < 0 ? percent * -1 : percent;
    const R = hexNum >> 16;
    const G = hexNum >> 8 & 0x00FF;
    const B = hexNum & 0x0000FF;
    const hexString = "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    return hexString;
}
//# sourceMappingURL=colorUtils.js.map

/***/ }),

/***/ 6188:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   vH: () => (/* reexport safe */ _colorHelper__WEBPACK_IMPORTED_MODULE_1__.v)
/* harmony export */ });
/* unused harmony exports calculateHighlightColor, channelBlend, createLinearColorScale, darken, hexBlend, hexString, hexToRGBString, normalizeToHexString, parseColorString, rgbBlend, rgbString, rotate, shadeColor */
/* harmony import */ var _colorHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(663);
/* harmony import */ var _colorUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(686);


var calculateHighlightColor = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .calculateHighlightColor */ .jd;
var channelBlend = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .channelBlend */ .SE;
var createLinearColorScale = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .createLinearColorScale */ .$Q;
var darken = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .darken */ ._j;
var hexBlend = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .hexBlend */ .ok;
var hexString = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .hexString */ .Bx;
var hexToRGBString = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .hexToRGBString */ .cD;
var normalizeToHexString = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .normalizeToHexString */ .s1;
var parseColorString = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .parseColorString */ .WV;
var rgbBlend = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .rgbBlend */ .qH;
var rgbString = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .rgbString */ .U8;
var rotate = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .rotate */ .U1;
var shadeColor = _colorUtils__WEBPACK_IMPORTED_MODULE_0__/* .shadeColor */ .HO;

//# sourceMappingURL=index.js.map

/***/ }),

/***/ 7701:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   categoryIsAlsoSeriesRole: () => (/* binding */ categoryIsAlsoSeriesRole),
/* harmony export */   getMiscellaneousTypeDescriptor: () => (/* binding */ getMiscellaneousTypeDescriptor),
/* harmony export */   getSeriesName: () => (/* binding */ getSeriesName),
/* harmony export */   hasImageUrlColumn: () => (/* binding */ hasImageUrlColumn),
/* harmony export */   isImageUrlColumn: () => (/* binding */ isImageUrlColumn),
/* harmony export */   isWebUrlColumn: () => (/* binding */ isWebUrlColumn)
/* harmony export */ });
/* harmony import */ var _dataRoleHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6070);
// powerbi.extensibility.utils.dataview

function categoryIsAlsoSeriesRole(dataView, seriesRoleName, categoryRoleName) {
    if (dataView.categories && dataView.categories.length > 0) {
        // Need to pivot data if our category soure is a series role
        const category = dataView.categories[0];
        return category.source &&
            _dataRoleHelper__WEBPACK_IMPORTED_MODULE_0__.hasRole(category.source, seriesRoleName) &&
            _dataRoleHelper__WEBPACK_IMPORTED_MODULE_0__.hasRole(category.source, categoryRoleName);
    }
    return false;
}
function getSeriesName(source) {
    return (source.groupName !== undefined)
        ? source.groupName
        : source.queryName;
}
function isImageUrlColumn(column) {
    const misc = getMiscellaneousTypeDescriptor(column);
    return misc != null && misc.imageUrl === true;
}
function isWebUrlColumn(column) {
    const misc = getMiscellaneousTypeDescriptor(column);
    return misc != null && misc.webUrl === true;
}
function getMiscellaneousTypeDescriptor(column) {
    return column
        && column.type
        && column.type.misc;
}
function hasImageUrlColumn(dataView) {
    if (!dataView || !dataView.metadata || !dataView.metadata.columns || !dataView.metadata.columns.length) {
        return false;
    }
    return dataView.metadata.columns.some((column) => isImageUrlColumn(column) === true);
}
//# sourceMappingURL=converterHelper.js.map

/***/ }),

/***/ 6070:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCategoryIndexOfRole: () => (/* binding */ getCategoryIndexOfRole),
/* harmony export */   getMeasureIndexOfRole: () => (/* binding */ getMeasureIndexOfRole),
/* harmony export */   hasRole: () => (/* binding */ hasRole),
/* harmony export */   hasRoleInDataView: () => (/* binding */ hasRoleInDataView),
/* harmony export */   hasRoleInValueColumn: () => (/* binding */ hasRoleInValueColumn)
/* harmony export */ });
function getMeasureIndexOfRole(grouped, roleName) {
    if (!grouped || !grouped.length) {
        return -1;
    }
    const firstGroup = grouped[0];
    if (firstGroup.values && firstGroup.values.length > 0) {
        for (let i = 0, len = firstGroup.values.length; i < len; ++i) {
            const value = firstGroup.values[i];
            if (value && value.source) {
                if (hasRole(value.source, roleName)) {
                    return i;
                }
            }
        }
    }
    return -1;
}
function getCategoryIndexOfRole(categories, roleName) {
    if (categories && categories.length) {
        for (let i = 0, ilen = categories.length; i < ilen; i++) {
            if (hasRole(categories[i].source, roleName)) {
                return i;
            }
        }
    }
    return -1;
}
function hasRole(column, name) {
    const roles = column.roles;
    return roles && roles[name];
}
function hasRoleInDataView(dataView, name) {
    return dataView != null
        && dataView.metadata != null
        && dataView.metadata.columns
        && dataView.metadata.columns.some((c) => c.roles && c.roles[name] !== undefined); // any is an alias of some
}
function hasRoleInValueColumn(valueColumn, name) {
    return valueColumn
        && valueColumn.source
        && valueColumn.source.roles
        && (valueColumn.source.roles[name] === true);
}
//# sourceMappingURL=dataRoleHelper.js.map

/***/ }),

/***/ 9567:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFillColorByPropertyName: () => (/* binding */ getFillColorByPropertyName),
/* harmony export */   getValue: () => (/* binding */ getValue)
/* harmony export */ });
function getValue(object, propertyName, defaultValue) {
    if (!object) {
        return defaultValue;
    }
    const propertyValue = object[propertyName];
    if (propertyValue === undefined) {
        return defaultValue;
    }
    return propertyValue;
}
/** Gets the solid color from a fill property using only a propertyName */
function getFillColorByPropertyName(object, propertyName, defaultColor) {
    const value = getValue(object, propertyName);
    if (!value || !value.solid) {
        return defaultColor;
    }
    return value.solid.color;
}
//# sourceMappingURL=dataViewObject.js.map

/***/ }),

/***/ 982:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCommonValue: () => (/* binding */ getCommonValue),
/* harmony export */   getFillColor: () => (/* binding */ getFillColor),
/* harmony export */   getObject: () => (/* binding */ getObject),
/* harmony export */   getValue: () => (/* binding */ getValue)
/* harmony export */ });
/* harmony import */ var _dataViewObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9567);

/** Gets the value of the given object/property pair. */
function getValue(objects, propertyId, defaultValue) {
    if (!objects) {
        return defaultValue;
    }
    return _dataViewObject__WEBPACK_IMPORTED_MODULE_0__.getValue(objects[propertyId.objectName], propertyId.propertyName, defaultValue);
}
/** Gets an object from objects. */
function getObject(objects, objectName, defaultValue) {
    if (objects && objects[objectName]) {
        return objects[objectName];
    }
    return defaultValue;
}
/** Gets the solid color from a fill property. */
function getFillColor(objects, propertyId, defaultColor) {
    const value = getValue(objects, propertyId);
    if (!value || !value.solid) {
        return defaultColor;
    }
    return value.solid.color;
}
function getCommonValue(objects, propertyId, defaultValue) {
    const value = getValue(objects, propertyId, defaultValue);
    if (value && value.solid) {
        return value.solid.color;
    }
    if (value === undefined
        || value === null
        || (typeof value === "object" && !value.solid)) {
        return defaultValue;
    }
    return value;
}
//# sourceMappingURL=dataViewObjects.js.map

/***/ }),

/***/ 4554:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DataViewObjectsParser: () => (/* binding */ DataViewObjectsParser)
/* harmony export */ });
/* harmony import */ var _dataViewObjects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(982);

class DataViewObjectsParser {
    static getDefault() {
        return new this();
    }
    static createPropertyIdentifier(objectName, propertyName) {
        return {
            objectName,
            propertyName
        };
    }
    static parse(dataView) {
        const dataViewObjectParser = this.getDefault();
        if (!dataView || !dataView.metadata || !dataView.metadata.objects) {
            return dataViewObjectParser;
        }
        const properties = dataViewObjectParser.getProperties();
        for (const objectName in properties) {
            for (const propertyName in properties[objectName]) {
                const defaultValue = dataViewObjectParser[objectName][propertyName];
                dataViewObjectParser[objectName][propertyName] = _dataViewObjects__WEBPACK_IMPORTED_MODULE_0__.getCommonValue(dataView.metadata.objects, properties[objectName][propertyName], defaultValue);
            }
        }
        return dataViewObjectParser;
    }
    static isPropertyEnumerable(propertyName) {
        return !DataViewObjectsParser.InnumerablePropertyPrefix.test(propertyName);
    }
    static enumerateObjectInstances(dataViewObjectParser, options) {
        const dataViewProperties = dataViewObjectParser && dataViewObjectParser[options.objectName];
        if (!dataViewProperties) {
            return [];
        }
        const instance = {
            objectName: options.objectName,
            selector: null,
            properties: {}
        };
        for (const key in dataViewProperties) {
            if (Object.prototype.hasOwnProperty.call(dataViewProperties, key)) {
                instance.properties[key] = dataViewProperties[key];
            }
        }
        return {
            instances: [instance]
        };
    }
    getProperties() {
        const properties = {}, objectNames = Object.keys(this);
        objectNames.forEach((objectName) => {
            if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                const propertyNames = Object.keys(this[objectName]);
                properties[objectName] = {};
                propertyNames.forEach((propertyName) => {
                    if (DataViewObjectsParser.isPropertyEnumerable(objectName)) {
                        properties[objectName][propertyName] =
                            DataViewObjectsParser.createPropertyIdentifier(objectName, propertyName);
                    }
                });
            }
        });
        return properties;
    }
}
DataViewObjectsParser.InnumerablePropertyPrefix = /^_/;
//# sourceMappingURL=dataViewObjectsParser.js.map

/***/ }),

/***/ 989:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createValueColumns: () => (/* binding */ createValueColumns),
/* harmony export */   groupValues: () => (/* binding */ groupValues),
/* harmony export */   setGrouped: () => (/* binding */ setGrouped)
/* harmony export */ });
// TODO: refactor & focus DataViewTransform into a service with well-defined dependencies.
// TODO: refactor this, setGrouped, and groupValues to a test helper to stop using it in the product
function createValueColumns(values = [], valueIdentityFields, source) {
    const result = values;
    setGrouped(result);
    if (valueIdentityFields) {
        result.identityFields = valueIdentityFields;
    }
    if (source) {
        result.source = source;
    }
    return result;
}
function setGrouped(values, groupedResult) {
    values.grouped = groupedResult
        ? () => groupedResult
        : () => groupValues(values);
}
/** Group together the values with a common identity. */
function groupValues(values) {
    const groups = [];
    let currentGroup;
    for (let i = 0, len = values.length; i < len; i++) {
        const value = values[i];
        if (!currentGroup || currentGroup.identity !== value.identity) {
            currentGroup = {
                values: []
            };
            if (value.identity) {
                currentGroup.identity = value.identity;
                const source = value.source;
                // allow null, which will be formatted as (Blank).
                if (source.groupName !== undefined) {
                    currentGroup.name = source.groupName;
                }
                else if (source.displayName) {
                    currentGroup.name = source.displayName;
                }
            }
            groups.push(currentGroup);
        }
        currentGroup.values.push(value);
    }
    return groups;
}
//# sourceMappingURL=dataViewTransform.js.map

/***/ }),

/***/ 2581:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDataViewWildcardSelector: () => (/* binding */ createDataViewWildcardSelector)
/* harmony export */ });
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
function createDataViewWildcardSelector(dataViewWildcardMatchingOption) {
    if (dataViewWildcardMatchingOption == null) {
        dataViewWildcardMatchingOption = 0 /* DataViewWildcardMatchingOption.InstancesAndTotals */;
    }
    const selector = {
        data: [
            {
                dataViewWildcard: {
                    matchingOption: dataViewWildcardMatchingOption
                }
            }
        ]
    };
    return selector;
}
//# sourceMappingURL=dataViewWildcard.js.map

/***/ }),

/***/ 1706:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   converterHelper: () => (/* reexport module object */ _converterHelper__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   dataRoleHelper: () => (/* reexport module object */ _dataRoleHelper__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   dataViewObject: () => (/* reexport module object */ _dataViewObject__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   dataViewObjects: () => (/* reexport module object */ _dataViewObjects__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   dataViewObjectsParser: () => (/* reexport module object */ _dataViewObjectsParser__WEBPACK_IMPORTED_MODULE_4__),
/* harmony export */   dataViewTransform: () => (/* reexport module object */ _dataViewTransform__WEBPACK_IMPORTED_MODULE_5__),
/* harmony export */   dataViewWildcard: () => (/* reexport module object */ _dataViewWildcard__WEBPACK_IMPORTED_MODULE_6__),
/* harmony export */   validationHelper: () => (/* reexport module object */ _validationHelper__WEBPACK_IMPORTED_MODULE_7__)
/* harmony export */ });
/* harmony import */ var _converterHelper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7701);
/* harmony import */ var _dataRoleHelper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6070);
/* harmony import */ var _dataViewObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9567);
/* harmony import */ var _dataViewObjects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(982);
/* harmony import */ var _dataViewObjectsParser__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(4554);
/* harmony import */ var _dataViewTransform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(989);
/* harmony import */ var _dataViewWildcard__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2581);
/* harmony import */ var _validationHelper__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(5250);









//# sourceMappingURL=index.js.map

/***/ }),

/***/ 5250:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isFileImage: () => (/* binding */ isFileImage),
/* harmony export */   isImageUrlAllowed: () => (/* binding */ isImageUrlAllowed)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
function isImageUrlAllowed(url) {
    // Excludes all URLs that don't contain .gif .jpg .png or .svg extensions and don't start from "http(s)://".
    // Base64 incoded images are allowable too.
    return (/^https?:\/\/.+\.(gif|jpg|png|svg)$/i).test(url) || (/^data:image\/(gif|jpeg|png|svg\+xml);base64,/i).test(url);
}
function isFileImage(url, imageCheckResultCallBack) {
    const request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState !== this.HEADERS_RECEIVED) {
            return;
        }
        const contentType = request.getResponseHeader("Content-Type"), supportedTypes = ["image/png", "image/jpeg", "image/gif", "image/svg+xml"];
        if (supportedTypes.indexOf(contentType) > -1) {
            return imageCheckResultCallBack(true, contentType);
        }
        return imageCheckResultCallBack(false, contentType);
    };
    request.open("HEAD", url, true);
    request.send();
}
//# sourceMappingURL=validationHelper.js.map

/***/ }),

/***/ 6084:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DP: () => (/* binding */ CompositeCard),
/* harmony export */   GN: () => (/* binding */ AutoDropdown),
/* harmony export */   Hn: () => (/* binding */ Model),
/* harmony export */   L_: () => (/* binding */ NumUpDown),
/* harmony export */   Zh: () => (/* binding */ ToggleSwitch),
/* harmony export */   oi: () => (/* binding */ TextInput),
/* harmony export */   sF: () => (/* binding */ SimpleCard),
/* harmony export */   v5: () => (/* binding */ FontControl),
/* harmony export */   xp: () => (/* binding */ FontPicker),
/* harmony export */   zH: () => (/* binding */ ColorPicker),
/* harmony export */   zt: () => (/* binding */ ItemDropdown)
/* harmony export */ });
/* unused harmony exports CardGroupEntity, Group, SimpleSlice, AlignmentGroup, Slider, DatePicker, DurationPicker, ErrorRangeControl, FieldPicker, ItemFlagsSelection, AutoFlagsSelection, TextArea, GradientBar, ImageUpload, ListEditor, ReadOnlyText, ShapeMapSelector, CompositeSlice, MarginPadding, Container, ContainerItem */
/* harmony import */ var _utils_FormattingSettingsUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3827);
/**
 * Powerbi utils components classes for custom visual formatting pane objects
 *
 */

class NamedEntity {
}
class CardGroupEntity extends NamedEntity {
}
class Model {
}
/** CompositeCard is use to populate a card into the formatting pane with multiple groups */
class CompositeCard extends NamedEntity {
}
class Group extends (/* unused pure expression or super */ null && (CardGroupEntity)) {
    constructor(object) {
        super();
        Object.assign(this, object);
    }
}
/** SimpleCard is use to populate a card into the formatting pane in a single group */
class SimpleCard extends CardGroupEntity {
}
class SimpleSlice extends NamedEntity {
    constructor(object) {
        super();
        Object.assign(this, object);
    }
    getFormattingSlice(objectName, localizationManager) {
        const controlType = this.type;
        const propertyName = this.name;
        const sliceDisplayName = (localizationManager && this.displayNameKey) ? localizationManager.getDisplayName(this.displayNameKey) : this.displayName;
        const sliceDescription = (localizationManager && this.descriptionKey) ? localizationManager.getDisplayName(this.descriptionKey) : this.description;
        const componentDisplayName = {
            displayName: sliceDisplayName,
            description: sliceDescription,
            uid: objectName + '-' + propertyName,
        };
        return Object.assign(Object.assign({}, componentDisplayName), { control: {
                type: controlType,
                properties: this.getFormattingComponent(objectName, localizationManager)
            } });
    }
    getFormattingComponent(objectName, localizationManager) {
        return {
            descriptor: _utils_FormattingSettingsUtils__WEBPACK_IMPORTED_MODULE_0__/* .getDescriptor */ .B(objectName, this),
            value: this.value,
        };
    }
    getRevertToDefaultDescriptor(objectName) {
        return [{
                objectName: objectName,
                propertyName: this.name
            }];
    }
    setPropertiesValues(dataViewObjects, objectName) {
        var _a;
        let newValue = (_a = dataViewObjects === null || dataViewObjects === void 0 ? void 0 : dataViewObjects[objectName]) === null || _a === void 0 ? void 0 : _a[this.name];
        this.value = _utils_FormattingSettingsUtils__WEBPACK_IMPORTED_MODULE_0__/* .getPropertyValue */ .S(this, newValue, this.value);
    }
}
class AlignmentGroup extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor(object) {
        super(object);
        this.type = "AlignmentGroup" /* visuals.FormattingComponent.AlignmentGroup */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { mode: this.mode, supportsNoSelection: this.supportsNoSelection });
    }
}
class ToggleSwitch extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "ToggleSwitch" /* visuals.FormattingComponent.ToggleSwitch */;
    }
}
class ColorPicker extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "ColorPicker" /* visuals.FormattingComponent.ColorPicker */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { defaultColor: this.defaultColor, isNoFillItemSupported: this.isNoFillItemSupported });
    }
}
class NumUpDown extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "NumUpDown" /* visuals.FormattingComponent.NumUpDown */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { options: this.options });
    }
}
class Slider extends (/* unused pure expression or super */ null && (NumUpDown)) {
    constructor() {
        super(...arguments);
        this.type = "Slider" /* visuals.FormattingComponent.Slider */;
    }
}
class DatePicker extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor(object) {
        super(object);
        this.type = "DatePicker" /* visuals.FormattingComponent.DatePicker */;
    }
    getFormattingComponent(objectName, localizationManager) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { placeholder: (localizationManager && this.placeholderKey) ? localizationManager.getDisplayName(this.placeholderKey) : this.placeholder, validators: this.validators });
    }
}
class ItemDropdown extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "Dropdown" /* visuals.FormattingComponent.Dropdown */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { items: this.items });
    }
}
class AutoDropdown extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "Dropdown" /* visuals.FormattingComponent.Dropdown */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { mergeValues: this.mergeValues, filterValues: this.filterValues });
    }
}
class DurationPicker extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor(object) {
        super(object);
        this.type = "DurationPicker" /* visuals.FormattingComponent.DurationPicker */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { validators: this.validators });
    }
}
class ErrorRangeControl extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor(object) {
        super(object);
        this.type = "ErrorRangeControl" /* visuals.FormattingComponent.ErrorRangeControl */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { validators: this.validators });
    }
}
class FieldPicker extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor(object) {
        super(object);
        this.type = "FieldPicker" /* visuals.FormattingComponent.FieldPicker */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { validators: this.validators, allowMultipleValues: this.allowMultipleValues });
    }
}
class ItemFlagsSelection extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor(object) {
        super(object);
        this.type = "FlagsSelection" /* visuals.FormattingComponent.FlagsSelection */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { items: this.items });
    }
}
class AutoFlagsSelection extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor() {
        super(...arguments);
        this.type = "FlagsSelection" /* visuals.FormattingComponent.FlagsSelection */;
    }
}
class TextInput extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "TextInput" /* visuals.FormattingComponent.TextInput */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { placeholder: this.placeholder });
    }
}
class TextArea extends (/* unused pure expression or super */ null && (TextInput)) {
    constructor() {
        super(...arguments);
        this.type = "TextArea" /* visuals.FormattingComponent.TextArea */;
    }
}
class FontPicker extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "FontPicker" /* visuals.FormattingComponent.FontPicker */;
    }
}
class GradientBar extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor() {
        super(...arguments);
        this.type = "GradientBar" /* visuals.FormattingComponent.GradientBar */;
    }
}
class ImageUpload extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor() {
        super(...arguments);
        this.type = "ImageUpload" /* visuals.FormattingComponent.ImageUpload */;
    }
}
class ListEditor extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor() {
        super(...arguments);
        this.type = "ListEditor" /* visuals.FormattingComponent.ListEditor */;
    }
}
class ReadOnlyText extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor() {
        super(...arguments);
        this.type = "ReadOnlyText" /* visuals.FormattingComponent.ReadOnlyText */;
    }
}
class ShapeMapSelector extends (/* unused pure expression or super */ null && (SimpleSlice)) {
    constructor(object) {
        super(object);
        this.type = "ShapeMapSelector" /* visuals.FormattingComponent.ShapeMapSelector */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { isAzMapReferenceSelector: this.isAzMapReferenceSelector });
    }
}
class CompositeSlice extends NamedEntity {
    constructor(object) {
        super();
        Object.assign(this, object);
    }
    getFormattingSlice(objectName, localizationManager) {
        const controlType = this.type;
        const propertyName = this.name;
        const componentDisplayName = {
            displayName: (localizationManager && this.displayNameKey) ? localizationManager.getDisplayName(this.displayNameKey) : this.displayName,
            description: (localizationManager && this.descriptionKey) ? localizationManager.getDisplayName(this.descriptionKey) : this.description,
            uid: objectName + '-' + propertyName,
        };
        return Object.assign(Object.assign({}, componentDisplayName), { control: {
                type: controlType,
                properties: this.getFormattingComponent(objectName)
            } });
    }
}
class FontControl extends CompositeSlice {
    constructor(object) {
        super(object);
        this.type = "FontControl" /* visuals.FormattingComponent.FontControl */;
    }
    getFormattingComponent(objectName) {
        var _a, _b, _c;
        return {
            fontFamily: this.fontFamily.getFormattingComponent(objectName),
            fontSize: this.fontSize.getFormattingComponent(objectName),
            bold: (_a = this.bold) === null || _a === void 0 ? void 0 : _a.getFormattingComponent(objectName),
            italic: (_b = this.italic) === null || _b === void 0 ? void 0 : _b.getFormattingComponent(objectName),
            underline: (_c = this.underline) === null || _c === void 0 ? void 0 : _c.getFormattingComponent(objectName)
        };
    }
    getRevertToDefaultDescriptor(objectName) {
        return this.fontFamily.getRevertToDefaultDescriptor(objectName)
            .concat(this.fontSize.getRevertToDefaultDescriptor(objectName))
            .concat(this.bold ? this.bold.getRevertToDefaultDescriptor(objectName) : [])
            .concat(this.italic ? this.italic.getRevertToDefaultDescriptor(objectName) : [])
            .concat(this.underline ? this.underline.getRevertToDefaultDescriptor(objectName) : []);
    }
    setPropertiesValues(dataViewObjects, objectName) {
        var _a, _b, _c;
        this.fontFamily.setPropertiesValues(dataViewObjects, objectName);
        this.fontSize.setPropertiesValues(dataViewObjects, objectName);
        (_a = this.bold) === null || _a === void 0 ? void 0 : _a.setPropertiesValues(dataViewObjects, objectName);
        (_b = this.italic) === null || _b === void 0 ? void 0 : _b.setPropertiesValues(dataViewObjects, objectName);
        (_c = this.underline) === null || _c === void 0 ? void 0 : _c.setPropertiesValues(dataViewObjects, objectName);
    }
}
class MarginPadding extends (/* unused pure expression or super */ null && (CompositeSlice)) {
    constructor(object) {
        super(object);
        this.type = "MarginPadding" /* visuals.FormattingComponent.MarginPadding */;
    }
    getFormattingComponent(objectName) {
        return {
            left: this.left.getFormattingComponent(objectName),
            right: this.right.getFormattingComponent(objectName),
            top: this.top.getFormattingComponent(objectName),
            bottom: this.bottom.getFormattingComponent(objectName)
        };
    }
    getRevertToDefaultDescriptor(objectName) {
        return this.left.getRevertToDefaultDescriptor(objectName)
            .concat(this.right.getRevertToDefaultDescriptor(objectName))
            .concat(this.top.getRevertToDefaultDescriptor(objectName))
            .concat(this.bottom.getRevertToDefaultDescriptor(objectName));
    }
    setPropertiesValues(dataViewObjects, objectName) {
        this.left.setPropertiesValues(dataViewObjects, objectName);
        this.right.setPropertiesValues(dataViewObjects, objectName);
        this.top.setPropertiesValues(dataViewObjects, objectName);
        this.bottom.setPropertiesValues(dataViewObjects, objectName);
    }
}
class Container extends (/* unused pure expression or super */ null && (NamedEntity)) {
    constructor(object) {
        super();
        Object.assign(this, object);
    }
}
class ContainerItem extends (/* unused pure expression or super */ null && (NamedEntity)) {
}
//# sourceMappingURL=FormattingSettingsComponents.js.map

/***/ }),

/***/ 4261:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export FormattingSettingsService */
/* harmony import */ var _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6084);

class FormattingSettingsService {
    constructor(localizationManager) {
        this.localizationManager = localizationManager;
    }
    /**
     * Build visual formatting settings model from metadata dataView
     *
     * @param dataViews metadata dataView object
     * @returns visual formatting settings model
     */
    populateFormattingSettingsModel(typeClass, dataView) {
        var _a, _b;
        let defaultSettings = new typeClass();
        let dataViewObjects = (_a = dataView === null || dataView === void 0 ? void 0 : dataView.metadata) === null || _a === void 0 ? void 0 : _a.objects;
        if (dataViewObjects) {
            // loop over each formatting property and set its new value if exists
            (_b = defaultSettings.cards) === null || _b === void 0 ? void 0 : _b.forEach((card) => {
                var _a;
                if (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__/* .CompositeCard */ .DP)
                    (_a = card.topLevelSlice) === null || _a === void 0 ? void 0 : _a.setPropertiesValues(dataViewObjects, card.name);
                const cardGroupInstances = (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__/* .SimpleCard */ .sF ? [card] : card.groups);
                cardGroupInstances.forEach((cardGroupInstance) => {
                    var _a, _b, _c, _d;
                    // Set current top level toggle value
                    (_a = cardGroupInstance.topLevelSlice) === null || _a === void 0 ? void 0 : _a.setPropertiesValues(dataViewObjects, card.name);
                    (_b = cardGroupInstance === null || cardGroupInstance === void 0 ? void 0 : cardGroupInstance.slices) === null || _b === void 0 ? void 0 : _b.forEach((slice) => {
                        slice === null || slice === void 0 ? void 0 : slice.setPropertiesValues(dataViewObjects, card.name);
                    });
                    (_d = (_c = cardGroupInstance === null || cardGroupInstance === void 0 ? void 0 : cardGroupInstance.container) === null || _c === void 0 ? void 0 : _c.containerItems) === null || _d === void 0 ? void 0 : _d.forEach((containerItem) => {
                        var _a;
                        (_a = containerItem === null || containerItem === void 0 ? void 0 : containerItem.slices) === null || _a === void 0 ? void 0 : _a.forEach((slice) => {
                            slice === null || slice === void 0 ? void 0 : slice.setPropertiesValues(dataViewObjects, card.name);
                        });
                    });
                });
            });
        }
        return defaultSettings;
    }
    /**
     * Build formatting model by parsing formatting settings model object
     *
     * @returns powerbi visual formatting model
     */
    buildFormattingModel(formattingSettingsModel) {
        let formattingModel = {
            cards: []
        };
        formattingSettingsModel.cards
            .filter(({ visible = true }) => visible)
            .forEach((card) => {
            var _a;
            let formattingCard = {
                displayName: (this.localizationManager && card.displayNameKey) ? this.localizationManager.getDisplayName(card.displayNameKey) : card.displayName,
                description: (this.localizationManager && card.descriptionKey) ? this.localizationManager.getDisplayName(card.descriptionKey) : card.description,
                groups: [],
                uid: card.name + "-card",
                analyticsPane: card.analyticsPane,
            };
            const objectName = card.name;
            if (card.topLevelSlice) {
                let topLevelToggleSlice = card.topLevelSlice.getFormattingSlice(objectName, this.localizationManager);
                topLevelToggleSlice.suppressDisplayName = true;
                formattingCard.topLevelToggle = topLevelToggleSlice;
            }
            (_a = card.onPreProcess) === null || _a === void 0 ? void 0 : _a.call(card);
            const isSimpleCard = card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__/* .SimpleCard */ .sF;
            const cardGroupInstances = (isSimpleCard ?
                [card].filter(({ visible = true }) => visible) :
                card.groups.filter(({ visible = true }) => visible));
            cardGroupInstances
                .forEach((cardGroupInstance) => {
                const groupUid = cardGroupInstance.name + "-group";
                // Build formatting group for each group
                const formattingGroup = {
                    displayName: isSimpleCard ? undefined : (this.localizationManager && cardGroupInstance.displayNameKey)
                        ? this.localizationManager.getDisplayName(cardGroupInstance.displayNameKey) : cardGroupInstance.displayName,
                    description: isSimpleCard ? undefined : (this.localizationManager && cardGroupInstance.descriptionKey)
                        ? this.localizationManager.getDisplayName(cardGroupInstance.descriptionKey) : cardGroupInstance.description,
                    slices: [],
                    uid: groupUid,
                    collapsible: cardGroupInstance.collapsible,
                    delaySaveSlices: cardGroupInstance.delaySaveSlices,
                    disabled: cardGroupInstance.disabled,
                    disabledReason: cardGroupInstance.disabledReason,
                };
                formattingCard.groups.push(formattingGroup);
                // In case formatting model adds data points or top categories (Like when you modify specific visual category color).
                // these categories use same object name and property name from capabilities and the generated uid will be the same for these formatting categories properties
                // Solution => Save slice names to modify each slice uid to be unique by adding counter value to the new slice uid
                const sliceNames = {};
                // Build formatting container slice for each property
                if (cardGroupInstance.container) {
                    const container = cardGroupInstance.container;
                    const containerUid = groupUid + "-container";
                    const formattingContainer = {
                        displayName: (this.localizationManager && container.displayNameKey)
                            ? this.localizationManager.getDisplayName(container.displayNameKey) : container.displayName,
                        description: (this.localizationManager && container.descriptionKey)
                            ? this.localizationManager.getDisplayName(container.descriptionKey) : container.description,
                        containerItems: [],
                        uid: containerUid
                    };
                    container.containerItems.forEach((containerItem) => {
                        // Build formatting container item object
                        const containerIemName = containerItem.displayNameKey ? containerItem.displayNameKey : containerItem.displayName;
                        const containerItemUid = containerUid + containerIemName;
                        let formattingContainerItem = {
                            displayName: (this.localizationManager && containerItem.displayNameKey)
                                ? this.localizationManager.getDisplayName(containerItem.displayNameKey) : containerItem.displayName,
                            slices: [],
                            uid: containerItemUid
                        };
                        // Build formatting slices and add them to current formatting container item
                        this.buildFormattingSlices({ slices: containerItem.slices, objectName, sliceNames, formattingSlices: formattingContainerItem.slices });
                        formattingContainer.containerItems.push(formattingContainerItem);
                    });
                    formattingGroup.container = formattingContainer;
                }
                if (cardGroupInstance.slices) {
                    if (cardGroupInstance.topLevelSlice) {
                        let topLevelToggleSlice = cardGroupInstance.topLevelSlice.getFormattingSlice(objectName, this.localizationManager);
                        topLevelToggleSlice.suppressDisplayName = true;
                        (formattingGroup.displayName == undefined ? formattingCard : formattingGroup).topLevelToggle = topLevelToggleSlice;
                    }
                    // Build formatting slice for each property
                    this.buildFormattingSlices({ slices: cardGroupInstance.slices, objectName, sliceNames, formattingSlices: formattingGroup.slices });
                }
            });
            formattingCard.revertToDefaultDescriptors = this.getRevertToDefaultDescriptor(card);
            formattingModel.cards.push(formattingCard);
        });
        return formattingModel;
    }
    buildFormattingSlices({ slices, objectName, sliceNames, formattingSlices }) {
        // Filter slices based on their visibility
        slices === null || slices === void 0 ? void 0 : slices.filter(({ visible = true }) => visible).forEach((slice) => {
            let formattingSlice = slice === null || slice === void 0 ? void 0 : slice.getFormattingSlice(objectName, this.localizationManager);
            if (formattingSlice) {
                // Modify formatting slice uid if needed
                if (sliceNames[slice.name] === undefined) {
                    sliceNames[slice.name] = 0;
                }
                else {
                    sliceNames[slice.name]++;
                    formattingSlice.uid = `${formattingSlice.uid}-${sliceNames[slice.name]}`;
                }
                formattingSlices.push(formattingSlice);
            }
        });
    }
    getRevertToDefaultDescriptor(card) {
        var _a;
        // Proceeded slice names are saved to prevent duplicated default descriptors in case of using 
        // formatting categories & selectors, since they have the same descriptor objectName and propertyName
        const sliceNames = {};
        let revertToDefaultDescriptors = [];
        let cardSlicesDefaultDescriptors;
        let cardContainerSlicesDefaultDescriptors = [];
        if (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__/* .CompositeCard */ .DP && card.topLevelSlice)
            revertToDefaultDescriptors.push(...(_a = card.topLevelSlice) === null || _a === void 0 ? void 0 : _a.getRevertToDefaultDescriptor(card.name));
        const cardGroupInstances = (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__/* .SimpleCard */ .sF ?
            [card].filter(({ visible = true }) => visible) :
            card.groups.filter(({ visible = true }) => visible));
        cardGroupInstances.forEach((cardGroupInstance) => {
            var _a, _b;
            cardSlicesDefaultDescriptors = this.getSlicesRevertToDefaultDescriptor(card.name, cardGroupInstance.slices, sliceNames, cardGroupInstance.topLevelSlice);
            (_b = (_a = cardGroupInstance.container) === null || _a === void 0 ? void 0 : _a.containerItems) === null || _b === void 0 ? void 0 : _b.forEach((containerItem) => {
                cardContainerSlicesDefaultDescriptors = cardContainerSlicesDefaultDescriptors.concat(this.getSlicesRevertToDefaultDescriptor(card.name, containerItem.slices, sliceNames));
            });
            revertToDefaultDescriptors.push(...cardSlicesDefaultDescriptors.concat(cardContainerSlicesDefaultDescriptors));
        });
        return revertToDefaultDescriptors;
    }
    getSlicesRevertToDefaultDescriptor(cardName, slices, sliceNames, topLevelSlice) {
        let revertToDefaultDescriptors = [];
        if (topLevelSlice) {
            sliceNames[topLevelSlice.name] = true;
            revertToDefaultDescriptors = revertToDefaultDescriptors.concat(topLevelSlice.getRevertToDefaultDescriptor(cardName));
        }
        slices === null || slices === void 0 ? void 0 : slices.forEach((slice) => {
            if (slice && !sliceNames[slice.name]) {
                sliceNames[slice.name] = true;
                revertToDefaultDescriptors = revertToDefaultDescriptors.concat(slice.getRevertToDefaultDescriptor(cardName));
            }
        });
        return revertToDefaultDescriptors;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormattingSettingsService);
//# sourceMappingURL=FormattingSettingsService.js.map

/***/ }),

/***/ 3827:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ getDescriptor),
/* harmony export */   S: () => (/* binding */ getPropertyValue)
/* harmony export */ });
/**
 * Build and return formatting descriptor for simple slice
 *
 * @param objectName Object name from capabilities
 * @param slice formatting simple slice
 * @returns simple slice formatting descriptor
 */
function getDescriptor(objectName, slice) {
    return {
        objectName: objectName,
        propertyName: slice.name,
        selector: slice.selector,
        altConstantValueSelector: slice.altConstantSelector,
        instanceKind: slice.instanceKind
    };
}
/**
 * Get property value from dataview objects if exists
 * Else return the default value from formatting settings object
 *
 * @param value dataview object value
 * @param defaultValue formatting settings default value
 * @returns formatting property value
 */
function getPropertyValue(slice, value, defaultValue) {
    if (value == null || (typeof value === "object" && !value.solid)) {
        return defaultValue;
    }
    if (value.solid) {
        return { value: value === null || value === void 0 ? void 0 : value.solid.color };
    }
    if (slice === null || slice === void 0 ? void 0 : slice.items) {
        let itemsArray = slice.items;
        return itemsArray.find(item => item.value == value);
    }
    return value;
}
//# sourceMappingURL=FormattingSettingsUtils.js.map

/***/ }),

/***/ 9538:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
/*
 * Globalize Cultures
 *
 * http://github.com/jquery/globalize
 *
 * Copyright Software Freedom Conservancy, Inc.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * This file was generated by the Globalize Culture Generator
 * Translation: bugs found in this file need to be fixed in the generator
 */
var powerbiGlobalizeLocales_1 = __webpack_require__(6265);
function injectCultures(Globalize) {
    Object.keys(powerbiGlobalizeLocales_1.locales).forEach(function (locale) { return Globalize.addCultureInfo.apply(Globalize, powerbiGlobalizeLocales_1.locales[locale]); });
}
exports["default"] = injectCultures;
//# sourceMappingURL=globalize.cultures.js.map

/***/ }),

/***/ 4818:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseNegativePattern = exports.parseExact = exports.getEraYear = exports.getEra = exports.getTokenRegExp = exports.formatNumber = exports.formatDate = exports.expandFormat = exports.appendPreOrPostMatch = exports.zeroPad = exports.trim = exports.startsWith = exports.isObject = exports.isFunction = exports.isArray = exports.extend = exports.endsWith = exports.arrayIndexOf = exports.regexTrim = exports.regexParseFloat = exports.regexInfinity = exports.regexHex = exports.Globalize = void 0;
// Global variable (Globalize) or CommonJS module (globalize)
exports.Globalize = function (cultureSelector) {
    return new exports.Globalize.prototype.init(cultureSelector);
};
exports.Globalize.cultures = {};
exports.Globalize.prototype = {
    constructor: exports.Globalize,
    init: function (cultureSelector) {
        this.cultures = exports.Globalize.cultures;
        this.cultureSelector = cultureSelector;
        return this;
    }
};
exports.Globalize.prototype.init.prototype = exports.Globalize.prototype;
// 1.	 When defining a culture, all fields are required except the ones stated as optional.
// 2.	 Each culture should have a ".calendars" object with at least one calendar named "standard"
//		 which serves as the default calendar in use by that culture.
// 3.	 Each culture should have a ".calendar" object which is the current calendar being used,
//		 it may be dynamically changed at any time to one of the calendars in ".calendars".
exports.Globalize.cultures["default"] = {
    // A unique name for the culture in the form <language code>-<country/region code>
    name: "en",
    // the name of the culture in the english language
    englishName: "English",
    // the name of the culture in its own language
    nativeName: "English",
    // whether the culture uses right-to-left text
    isRTL: false,
    // "language" is used for so-called "specific" cultures.
    // For example, the culture "es-CL" means "Spanish, in Chili".
    // It represents the Spanish-speaking culture as it is in Chili,
    // which might have different formatting rules or even translations
    // than Spanish in Spain. A "neutral" culture is one that is not
    // specific to a region. For example, the culture "es" is the generic
    // Spanish culture, which may be a more generalized version of the language
    // that may or may not be what a specific culture expects.
    // For a specific culture like "es-CL", the "language" field refers to the
    // neutral, generic culture information for the language it is using.
    // This is not always a simple matter of the string before the dash.
    // For example, the "zh-Hans" culture is netural (Simplified Chinese).
    // And the "zh-SG" culture is Simplified Chinese in Singapore, whose lanugage
    // field is "zh-CHS", not "zh".
    // This field should be used to navigate from a specific culture to it's
    // more general, neutral culture. If a culture is already as general as it
    // can get, the language may refer to itself.
    language: "en",
    // numberFormat defines general number formatting rules, like the digits in
    // each grouping, the group separator, and how negative numbers are displayed.
    numberFormat: {
        // [negativePattern]
        // Note, numberFormat.pattern has no "positivePattern" unlike percent and currency,
        // but is still defined as an array for consistency with them.
        //   negativePattern: one of "(n)|-n|- n|n-|n -"
        pattern: ["-n"],
        // number of decimal places normally shown
        decimals: 2,
        // string that separates number groups, as in 1,000,000
        ",": ",",
        // string that separates a number from the fractional portion, as in 1.99
        ".": ".",
        // array of numbers indicating the size of each number group.
        // TODO: more detailed description and example
        groupSizes: [3],
        // symbol used for positive numbers
        "+": "+",
        // symbol used for negative numbers
        "-": "-",
        percent: {
            // [negativePattern, positivePattern]
            //   negativePattern: one of "-n %|-n%|-%n|%-n|%n-|n-%|n%-|-% n|n %-|% n-|% -n|n- %"
            //   positivePattern: one of "n %|n%|%n|% n"
            pattern: ["-n %", "n %"],
            // number of decimal places normally shown
            decimals: 2,
            // array of numbers indicating the size of each number group.
            // TODO: more detailed description and example
            groupSizes: [3],
            // string that separates number groups, as in 1,000,000
            ",": ",",
            // string that separates a number from the fractional portion, as in 1.99
            ".": ".",
            // symbol used to represent a percentage
            symbol: "%"
        },
        currency: {
            // [negativePattern, positivePattern]
            //   negativePattern: one of "($n)|-$n|$-n|$n-|(n$)|-n$|n-$|n$-|-n $|-$ n|n $-|$ n-|$ -n|n- $|($ n)|(n $)"
            //   positivePattern: one of "$n|n$|$ n|n $"
            pattern: ["($n)", "$n"],
            // number of decimal places normally shown
            decimals: 2,
            // array of numbers indicating the size of each number group.
            // TODO: more detailed description and example
            groupSizes: [3],
            // string that separates number groups, as in 1,000,000
            ",": ",",
            // string that separates a number from the fractional portion, as in 1.99
            ".": ".",
            // symbol used to represent currency
            symbol: "$"
        }
    },
    // calendars defines all the possible calendars used by this culture.
    // There should be at least one defined with name "standard", and is the default
    // calendar used by the culture.
    // A calendar contains information about how dates are formatted, information about
    // the calendar's eras, a standard set of the date formats,
    // translations for day and month names, and if the calendar is not based on the Gregorian
    // calendar, conversion functions to and from the Gregorian calendar.
    calendars: {
        standard: {
            // name that identifies the type of calendar this is
            name: "Gregorian_USEnglish",
            // separator of parts of a date (e.g. "/" in 11/05/1955)
            "/": "/",
            // separator of parts of a time (e.g. ":" in 05:44 PM)
            ":": ":",
            // the first day of the week (0 = Sunday, 1 = Monday, etc)
            firstDay: 0,
            days: {
                // full day names
                names: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                // abbreviated day names
                namesAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                // shortest day names
                namesShort: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]
            },
            months: {
                // full month names (13 months for lunar calendards -- 13th month should be "" if not lunar)
                names: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ""],
                // abbreviated month names
                namesAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", ""]
            },
            // AM and PM designators in one of these forms:
            // The usual view, and the upper and lower case versions
            //   [ standard, lowercase, uppercase ]
            // The culture does not use AM or PM (likely all standard date formats use 24 hour time)
            //   null
            AM: ["AM", "am", "AM"],
            PM: ["PM", "pm", "PM"],
            eras: [
                // eras in reverse chronological order.
                // name: the name of the era in this culture (e.g. A.D., C.E.)
                // start: when the era starts in ticks (gregorian, gmt), null if it is the earliest supported era.
                // offset: offset in years from gregorian calendar
                {
                    "name": "A.D.",
                    "start": null,
                    "offset": 0
                }
            ],
            // when a two digit year is given, it will never be parsed as a four digit
            // year greater than this year (in the appropriate era for the culture)
            // Set it as a full year (e.g. 2029) or use an offset format starting from
            // the current year: "+19" would correspond to 2029 if the current year 2010.
            twoDigitYearMax: 2029,
            // set of predefined date and time patterns used by the culture
            // these represent the format someone in this culture would expect
            // to see given the portions of the date that are shown.
            patterns: {
                // short date pattern
                d: "M/d/yyyy",
                // long date pattern
                D: "dddd, MMMM dd, yyyy",
                // short time pattern
                t: "h:mm tt",
                // long time pattern
                T: "h:mm:ss tt",
                // long date, short time pattern
                f: "dddd, MMMM dd, yyyy h:mm tt",
                // long date, long time pattern
                F: "dddd, MMMM dd, yyyy h:mm:ss tt",
                // month/day pattern
                M: "MMMM dd",
                // month/year pattern
                Y: "yyyy MMMM",
                // S is a sortable format that does not vary by culture
                S: "yyyy\u0027-\u0027MM\u0027-\u0027dd\u0027T\u0027HH\u0027:\u0027mm\u0027:\u0027ss"
            }
            // optional fields for each calendar:
            /*
            monthsGenitive:
                Same as months but used when the day preceeds the month.
                Omit if the culture has no genitive distinction in month names.
                For an explaination of genitive months, see http://blogs.msdn.com/michkap/archive/2004/12/25/332259.aspx
            convert:
                Allows for the support of non-gregorian based calendars. This convert object is used to
                to convert a date to and from a gregorian calendar date to handle parsing and formatting.
                The two functions:
                    fromGregorian( date )
                        Given the date as a parameter, return an array with parts [ year, month, day ]
                        corresponding to the non-gregorian based year, month, and day for the calendar.
                    toGregorian( year, month, day )
                        Given the non-gregorian year, month, and day, return a new Date() object
                        set to the corresponding date in the gregorian calendar.
            */
        }
    },
    // For localized strings
    messages: {}
};
exports.Globalize.cultures["default"].calendar = exports.Globalize.cultures["default"].calendars.standard;
exports.Globalize.cultures.en = exports.Globalize.cultures["default"];
exports.Globalize.cultureSelector = "en";
//
// private variables
//
exports.regexHex = /^0x[a-f0-9]+$/i;
exports.regexInfinity = /^[+-]?infinity$/i;
exports.regexParseFloat = /^[+-]?\d*\.?\d*(e[+-]?\d+)?$/;
exports.regexTrim = /^\s+|\s+$/g;
//
// private JavaScript utility functions
//
exports.arrayIndexOf = function (array, item) {
    if (array.indexOf) {
        return array.indexOf(item);
    }
    for (var i = 0, length = array.length; i < length; i++) {
        if (array[i] === item) {
            return i;
        }
    }
    return -1;
};
exports.endsWith = function (value, pattern) {
    return value.substring(value.length - pattern.length) === pattern;
};
exports.extend = function (deep) {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
    // Handle a deep copy situation
    if (typeof target === "boolean") {
        deep = target;
        target = arguments[1] || {};
        // skip the boolean and the target
        i = 2;
    }
    // Handle case when target is a string or something (possible in deep copy)
    if (typeof target !== "object" && !(0, exports.isFunction)(target)) {
        target = {};
    }
    for (; i < length; i++) {
        // Only deal with non-null/undefined values
        if ((options = arguments[i]) != null) {
            // Extend the base object
            for (name in options) {
                src = target[name];
                copy = options[name];
                // Prevent never-ending loop
                if (target === copy) {
                    continue;
                }
                // Recurse if we're merging plain objects or arrays
                if (deep && copy && ((0, exports.isObject)(copy) || (copyIsArray = (0, exports.isArray)(copy)))) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && (0, exports.isArray)(src) ? src : [];
                    }
                    else {
                        clone = src && (0, exports.isObject)(src) ? src : {};
                    }
                    // Never move original objects, clone them
                    target[name] = (0, exports.extend)(deep, clone, copy);
                    // Don't bring in undefined values
                }
                else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }
    // Return the modified object
    return target;
};
exports.isArray = Array.isArray || function (obj) {
    return Object.prototype.toString.call(obj) === "[object Array]";
};
exports.isFunction = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Function]";
};
exports.isObject = function (obj) {
    return Object.prototype.toString.call(obj) === "[object Object]";
};
exports.startsWith = function (value, pattern) {
    return value.indexOf(pattern) === 0;
};
exports.trim = function (value) {
    return (value + "").replace(exports.regexTrim, "");
};
exports.zeroPad = function (str, count, left) {
    var l;
    for (l = str.length; l < count; l += 1) {
        str = (left ? ("0" + str) : (str + "0"));
    }
    return str;
};
//
// private Globalization utility functions
//
exports.appendPreOrPostMatch = function (preMatch, strings) {
    // appends pre- and post- token match strings while removing escaped characters.
    // Returns a single quote count which is used to determine if the token occurs
    // in a string literal.
    var quoteCount = 0, escaped = false;
    for (var i = 0, il = preMatch.length; i < il; i++) {
        var c = preMatch.charAt(i);
        switch (c) {
            case "\'":
                if (escaped) {
                    strings.push("\'");
                }
                else {
                    quoteCount++;
                }
                escaped = false;
                break;
            case "\\":
                if (escaped) {
                    strings.push("\\");
                }
                escaped = !escaped;
                break;
            default:
                strings.push(c);
                escaped = false;
                break;
        }
    }
    return quoteCount;
};
exports.expandFormat = function (cal, format) {
    // expands unspecified or single character date formats into the full pattern.
    format = format || "F";
    var pattern, patterns = cal.patterns, len = format.length;
    if (len === 1) {
        pattern = patterns[format];
        if (!pattern) {
            throw "Invalid date format string \'" + format + "\'.";
        }
        format = pattern;
    }
    else if (len === 2 && format.charAt(0) === "%") {
        // %X escape format -- intended as a custom format string that is only one character, not a built-in format.
        format = format.charAt(1);
    }
    return format;
};
exports.formatDate = function (value, format, culture) {
    var cal = culture.calendar, convert = cal.convert;
    if (!format || !format.length || format === "i") {
        var ret;
        if (culture && culture.name.length) {
            if (convert) {
                // non-gregorian calendar, so we cannot use built-in toLocaleString()
                ret = (0, exports.formatDate)(value, cal.patterns.F, culture);
            }
            else {
                var eraDate = new Date(value.getTime()), era = (0, exports.getEra)(value, cal.eras);
                eraDate.setFullYear((0, exports.getEraYear)(value, cal, era));
                ret = eraDate.toLocaleString();
            }
        }
        else {
            ret = value.toString();
        }
        return ret;
    }
    var eras = cal.eras, sortable = format === "s";
    format = (0, exports.expandFormat)(cal, format);
    // Start with an empty string
    ret = [];
    var hour, zeros = ["0", "00", "000"], foundDay, checkedDay, dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g, quoteCount = 0, tokenRegExp = (0, exports.getTokenRegExp)(), converted;
    function padZeros(num, c) {
        var r, s = num + "";
        if (c > 1 && s.length < c) {
            r = (zeros[c - 2] + s);
            return r.substring(r.length - c, r.length);
        }
        else {
            r = s;
        }
        return r;
    }
    function hasDay() {
        if (foundDay || checkedDay) {
            return foundDay;
        }
        foundDay = dayPartRegExp.test(format);
        checkedDay = true;
        return foundDay;
    }
    function getPart(date, part) {
        if (converted) {
            return converted[part];
        }
        switch (part) {
            case 0: return date.getFullYear();
            case 1: return date.getMonth();
            case 2: return date.getDate();
        }
    }
    if (!sortable && convert) {
        converted = convert.fromGregorian(value);
    }
    for (;;) {
        // Save the current index
        var index = tokenRegExp.lastIndex, 
        // Look for the next pattern
        ar = tokenRegExp.exec(format);
        // Append the text before the pattern (or the end of the string if not found)
        var preMatch = format.slice(index, ar ? ar.index : format.length);
        quoteCount += (0, exports.appendPreOrPostMatch)(preMatch, ret);
        if (!ar) {
            break;
        }
        // do not replace any matches that occur inside a string literal.
        if (quoteCount % 2) {
            ret.push(ar[0]);
            continue;
        }
        var current = ar[0], clength = current.length;
        switch (current) {
            case "ddd":
            //Day of the week, as a three-letter abbreviation
            case "dddd":
                // Day of the week, using the full name
                var names = (clength === 3) ? cal.days.namesAbbr : cal.days.names;
                ret.push(names[value.getDay()]);
                break;
            case "d":
            // Day of month, without leading zero for single-digit days
            case "dd":
                // Day of month, with leading zero for single-digit days
                foundDay = true;
                ret.push(padZeros(getPart(value, 2), clength));
                break;
            case "MMM":
            // Month, as a three-letter abbreviation
            case "MMMM":
                // Month, using the full name
                var part = getPart(value, 1);
                ret.push((cal.monthsGenitive && hasDay())
                    ?
                        cal.monthsGenitive[clength === 3 ? "namesAbbr" : "names"][part]
                    :
                        cal.months[clength === 3 ? "namesAbbr" : "names"][part]);
                break;
            case "M":
            // Month, as digits, with no leading zero for single-digit months
            case "MM":
                // Month, as digits, with leading zero for single-digit months
                ret.push(padZeros(getPart(value, 1) + 1, clength));
                break;
            case "y":
            // Year, as two digits, but with no leading zero for years less than 10
            case "yy":
            // Year, as two digits, with leading zero for years less than 10
            case "yyyy":
                // Year represented by four full digits
                part = converted ? converted[0] : (0, exports.getEraYear)(value, cal, (0, exports.getEra)(value, eras), sortable);
                if (clength < 4) {
                    part = part % 100;
                }
                ret.push(padZeros(part, clength));
                break;
            case "h":
            // Hours with no leading zero for single-digit hours, using 12-hour clock
            case "hh":
                // Hours with leading zero for single-digit hours, using 12-hour clock
                hour = value.getHours() % 12;
                if (hour === 0)
                    hour = 12;
                ret.push(padZeros(hour, clength));
                break;
            case "H":
            // Hours with no leading zero for single-digit hours, using 24-hour clock
            case "HH":
                // Hours with leading zero for single-digit hours, using 24-hour clock
                ret.push(padZeros(value.getHours(), clength));
                break;
            case "m":
            // Minutes with no leading zero for single-digit minutes
            case "mm":
                // Minutes with leading zero for single-digit minutes
                ret.push(padZeros(value.getMinutes(), clength));
                break;
            case "s":
            // Seconds with no leading zero for single-digit seconds
            case "ss":
                // Seconds with leading zero for single-digit seconds
                ret.push(padZeros(value.getSeconds(), clength));
                break;
            case "t":
            // One character am/pm indicator ("a" or "p")
            case "tt":
                // Multicharacter am/pm indicator
                part = value.getHours() < 12 ? (cal.AM ? cal.AM[0] : " ") : (cal.PM ? cal.PM[0] : " ");
                ret.push(clength === 1 ? part.charAt(0) : part);
                break;
            case "f":
            // Deciseconds
            case "ff":
            // Centiseconds
            case "fff":
                // Milliseconds
                ret.push(padZeros(value.getMilliseconds(), 3).substring(0, clength));
                break;
            case "z":
            // Time zone offset, no leading zero
            case "zz":
                // Time zone offset with leading zero
                hour = value.getTimezoneOffset() / 60;
                ret.push((hour <= 0 ? "+" : "-") + padZeros(Math.floor(Math.abs(hour)), clength));
                break;
            case "zzz":
                // Time zone offset with leading zero
                hour = value.getTimezoneOffset() / 60;
                ret.push((hour <= 0 ? "+" : "-") + padZeros(Math.floor(Math.abs(hour)), 2)
                    // Hard coded ":" separator, rather than using cal.TimeSeparator
                    // Repeated here for consistency, plus ":" was already assumed in date parsing.
                    + ":" + padZeros(Math.abs(value.getTimezoneOffset() % 60), 2));
                break;
            case "g":
            case "gg":
                if (cal.eras) {
                    ret.push(cal.eras[(0, exports.getEra)(value, eras)].name);
                }
                break;
            case "/":
                ret.push(cal["/"]);
                break;
            default:
                throw "Invalid date format pattern \'" + current + "\'.";
        }
    }
    return ret.join("");
};
// formatNumber
(function () {
    var expandNumber;
    expandNumber = function (number, precision, formatInfo) {
        var groupSizes = formatInfo.groupSizes, curSize = groupSizes[0], curGroupIndex = 1, factor = Math.pow(10, precision), rounded = Math.round(number * factor) / factor;
        if (!isFinite(rounded)) {
            rounded = number;
        }
        number = rounded;
        var numberString = number + "", right = "", split = numberString.split(/e/i), exponent = split.length > 1 ? parseInt(split[1], 10) : 0;
        numberString = split[0];
        split = numberString.split(".");
        numberString = split[0];
        right = split.length > 1 ? split[1] : "";
        var l;
        if (exponent > 0) {
            right = (0, exports.zeroPad)(right, exponent, false);
            numberString += right.slice(0, exponent);
            right = right.substring(exponent);
        }
        else if (exponent < 0) {
            exponent = -exponent;
            numberString = (0, exports.zeroPad)(numberString, exponent + 1);
            right = numberString.slice(-exponent, numberString.length) + right;
            numberString = numberString.slice(0, -exponent);
        }
        if (precision > 0) {
            right = formatInfo["."] +
                ((right.length > precision) ? right.slice(0, precision) : (0, exports.zeroPad)(right, precision));
        }
        else {
            right = "";
        }
        var stringIndex = numberString.length - 1, sep = formatInfo[","], ret = "";
        while (stringIndex >= 0) {
            if (curSize === 0 || curSize > stringIndex) {
                return numberString.slice(0, stringIndex + 1) + (ret.length ? (sep + ret + right) : right);
            }
            ret = numberString.slice(stringIndex - curSize + 1, stringIndex + 1) + (ret.length ? (sep + ret) : "");
            stringIndex -= curSize;
            if (curGroupIndex < groupSizes.length) {
                curSize = groupSizes[curGroupIndex];
                curGroupIndex++;
            }
        }
        return numberString.slice(0, stringIndex + 1) + sep + ret + right;
    };
    exports.formatNumber = function (value, format, culture) {
        if (!format || format === "i") {
            return culture.name.length ? value.toLocaleString() : value.toString();
        }
        format = format || "D";
        var nf = culture.numberFormat, number = Math.abs(value), precision = -1, pattern;
        if (format.length > 1)
            precision = parseInt(format.slice(1), 10);
        var current = format.charAt(0).toUpperCase(), formatInfo;
        switch (current) {
            case "D":
                pattern = "n";
                if (precision !== -1) {
                    number = (0, exports.zeroPad)("" + number, precision, true);
                }
                if (value < 0)
                    number = -number;
                break;
            case "N":
                formatInfo = nf;
            // fall through
            case "C":
                formatInfo = formatInfo || nf.currency;
            // fall through
            case "P":
                formatInfo = formatInfo || nf.percent;
                pattern = value < 0 ? formatInfo.pattern[0] : (formatInfo.pattern[1] || "n");
                if (precision === -1)
                    precision = formatInfo.decimals;
                number = expandNumber(number * (current === "P" ? 100 : 1), precision, formatInfo);
                break;
            default:
                throw "Bad number format specifier: " + current;
        }
        var patternParts = /n|\$|-|%/g, ret = "";
        for (;;) {
            var index = patternParts.lastIndex, ar = patternParts.exec(pattern);
            ret += pattern.slice(index, ar ? ar.index : pattern.length);
            if (!ar) {
                break;
            }
            switch (ar[0]) {
                case "n":
                    ret += number;
                    break;
                case "$":
                    ret += nf.currency.symbol;
                    break;
                case "-":
                    // don't make 0 negative
                    if (/[1-9]/.test(number.toString())) {
                        ret += nf["-"];
                    }
                    break;
                case "%":
                    ret += nf.percent.symbol;
                    break;
            }
        }
        return ret;
    };
}());
exports.getTokenRegExp = function () {
    // regular expression for matching date and time tokens in format strings.
    return /\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g;
};
exports.getEra = function (date, eras) {
    if (!eras)
        return 0;
    var start, ticks = date.getTime();
    for (var i = 0, l = eras.length; i < l; i++) {
        start = eras[i].start;
        if (start === null || ticks >= start) {
            return i;
        }
    }
    return 0;
};
exports.getEraYear = function (date, cal, era, sortable) {
    var year = date.getFullYear();
    if (!sortable && cal.eras) {
        // convert normal gregorian year to era-shifted gregorian
        // year by subtracting the era offset
        year -= cal.eras[era].offset;
    }
    return year;
};
// parseExact
(function () {
    var expandYear, getDayIndex, getMonthIndex, getParseRegExp, outOfRange, toUpper, toUpperArray;
    expandYear = function (cal, year) {
        // expands 2-digit year into 4 digits.
        var now = new Date(), era = (0, exports.getEra)(now);
        if (year < 100) {
            var twoDigitYearMax = cal.twoDigitYearMax;
            twoDigitYearMax = typeof twoDigitYearMax === "string" ? new Date().getFullYear() % 100 + parseInt(twoDigitYearMax, 10) : twoDigitYearMax;
            var curr = (0, exports.getEraYear)(now, cal, era);
            year += curr - (curr % 100);
            if (year > twoDigitYearMax) {
                year -= 100;
            }
        }
        return year;
    };
    getDayIndex = function (cal, value, abbr) {
        var ret, days = cal.days, upperDays = cal._upperDays;
        if (!upperDays) {
            cal._upperDays = upperDays = [
                toUpperArray(days.names),
                toUpperArray(days.namesAbbr),
                toUpperArray(days.namesShort)
            ];
        }
        value = toUpper(value);
        if (abbr) {
            ret = (0, exports.arrayIndexOf)(upperDays[1], value);
            if (ret === -1) {
                ret = (0, exports.arrayIndexOf)(upperDays[2], value);
            }
        }
        else {
            ret = (0, exports.arrayIndexOf)(upperDays[0], value);
        }
        return ret;
    };
    getMonthIndex = function (cal, value, abbr) {
        var months = cal.months, monthsGen = cal.monthsGenitive || cal.months, upperMonths = cal._upperMonths, upperMonthsGen = cal._upperMonthsGen;
        if (!upperMonths) {
            cal._upperMonths = upperMonths = [
                toUpperArray(months.names),
                toUpperArray(months.namesAbbr)
            ];
            cal._upperMonthsGen = upperMonthsGen = [
                toUpperArray(monthsGen.names),
                toUpperArray(monthsGen.namesAbbr)
            ];
        }
        value = toUpper(value);
        var i = (0, exports.arrayIndexOf)(abbr ? upperMonths[1] : upperMonths[0], value);
        if (i < 0) {
            i = (0, exports.arrayIndexOf)(abbr ? upperMonthsGen[1] : upperMonthsGen[0], value);
        }
        return i;
    };
    getParseRegExp = function (cal, format) {
        // converts a format string into a regular expression with groups that
        // can be used to extract date fields from a date string.
        // check for a cached parse regex.
        var re = cal._parseRegExp;
        if (!re) {
            cal._parseRegExp = re = {};
        }
        else {
            var reFormat = re[format];
            if (reFormat) {
                return reFormat;
            }
        }
        // expand single digit formats, then escape regular expression characters.
        var expFormat = (0, exports.expandFormat)(cal, format).replace(/([\^\$\.\*\+\?\|\[\]\(\)\{\}])/g, "\\\\$1"), regexp = ["^"], groups = [], index = 0, quoteCount = 0, tokenRegExp = (0, exports.getTokenRegExp)(), match;
        // iterate through each date token found.
        while ((match = tokenRegExp.exec(expFormat)) !== null) {
            var preMatch = expFormat.slice(index, match.index);
            index = tokenRegExp.lastIndex;
            // don't replace any matches that occur inside a string literal.
            quoteCount += (0, exports.appendPreOrPostMatch)(preMatch, regexp);
            if (quoteCount % 2) {
                regexp.push(match[0]);
                continue;
            }
            // add a regex group for the token.
            var m = match[0], len = m.length, add;
            switch (m) {
                case "dddd":
                case "ddd":
                case "MMMM":
                case "MMM":
                case "gg":
                case "g":
                    add = "(\\D+)";
                    break;
                case "tt":
                case "t":
                    add = "(\\D*)";
                    break;
                case "yyyy":
                case "fff":
                case "ff":
                case "f":
                    add = "(\\d{" + len + "})";
                    break;
                case "dd":
                case "d":
                case "MM":
                case "M":
                case "yy":
                case "y":
                case "HH":
                case "H":
                case "hh":
                case "h":
                case "mm":
                case "m":
                case "ss":
                case "s":
                    add = "(\\d\\d?)";
                    break;
                case "zzz":
                    add = "([+-]?\\d\\d?:\\d{2})";
                    break;
                case "zz":
                case "z":
                    add = "([+-]?\\d\\d?)";
                    break;
                case "/":
                    add = "(\\" + cal["/"] + ")";
                    break;
                default:
                    throw "Invalid date format pattern \'" + m + "\'.";
            }
            if (add) {
                regexp.push(add);
            }
            groups.push(match[0]);
        }
        (0, exports.appendPreOrPostMatch)(expFormat.slice(index), regexp);
        regexp.push("$");
        // allow whitespace to differ when matching formats.
        var regexpStr = regexp.join("").replace(/\s+/g, "\\s+"), parseRegExp = { "regExp": regexpStr, "groups": groups };
        // cache the regex for this format.
        return re[format] = parseRegExp;
    };
    outOfRange = function (value, low, high) {
        return value < low || value > high;
    };
    toUpper = function (value) {
        // "he-IL" has non-breaking space in weekday names.
        return value.split("\u00A0").join(" ").toUpperCase();
    };
    toUpperArray = function (arr) {
        var results = [];
        for (var i = 0, l = arr.length; i < l; i++) {
            results[i] = toUpper(arr[i]);
        }
        return results;
    };
    exports.parseExact = function (value, format, culture) {
        // try to parse the date string by matching against the format string
        // while using the specified culture for date field names.
        value = (0, exports.trim)(value);
        var cal = culture.calendar, 
        // convert date formats into regular expressions with groupings.
        // use the regexp to determine the input format and extract the date fields.
        parseInfo = getParseRegExp(cal, format), match = new RegExp(parseInfo.regExp).exec(value);
        if (match === null) {
            return null;
        }
        // found a date format that matches the input.
        var groups = parseInfo.groups, era = null, year = null, month = null, date = null, weekDay = null, hour = 0, hourOffset, min = 0, sec = 0, msec = 0, tzMinOffset = null, pmHour = false;
        // iterate the format groups to extract and set the date fields.
        for (var j = 0, jl = groups.length; j < jl; j++) {
            var matchGroup = match[j + 1];
            if (matchGroup) {
                var current = groups[j], clength = current.length, matchInt = parseInt(matchGroup, 10);
                switch (current) {
                    case "dd":
                    case "d":
                        // Day of month.
                        date = matchInt;
                        // check that date is generally in valid range, also checking overflow below.
                        if (outOfRange(date, 1, 31))
                            return null;
                        break;
                    case "MMM":
                    case "MMMM":
                        month = getMonthIndex(cal, matchGroup, clength === 3);
                        if (outOfRange(month, 0, 11))
                            return null;
                        break;
                    case "M":
                    case "MM":
                        // Month.
                        month = matchInt - 1;
                        if (outOfRange(month, 0, 11))
                            return null;
                        break;
                    case "y":
                    case "yy":
                    case "yyyy":
                        year = clength < 4 ? expandYear(cal, matchInt) : matchInt;
                        if (outOfRange(year, 0, 9999))
                            return null;
                        break;
                    case "h":
                    case "hh":
                        // Hours (12-hour clock).
                        hour = matchInt;
                        if (hour === 12)
                            hour = 0;
                        if (outOfRange(hour, 0, 11))
                            return null;
                        break;
                    case "H":
                    case "HH":
                        // Hours (24-hour clock).
                        hour = matchInt;
                        if (outOfRange(hour, 0, 23))
                            return null;
                        break;
                    case "m":
                    case "mm":
                        // Minutes.
                        min = matchInt;
                        if (outOfRange(min, 0, 59))
                            return null;
                        break;
                    case "s":
                    case "ss":
                        // Seconds.
                        sec = matchInt;
                        if (outOfRange(sec, 0, 59))
                            return null;
                        break;
                    case "tt":
                    case "t":
                        // AM/PM designator.
                        // see if it is standard, upper, or lower case PM. If not, ensure it is at least one of
                        // the AM tokens. If not, fail the parse for this format.
                        pmHour = cal.PM && (matchGroup === cal.PM[0] || matchGroup === cal.PM[1] || matchGroup === cal.PM[2]);
                        if (!pmHour && (!cal.AM || (matchGroup !== cal.AM[0] && matchGroup !== cal.AM[1] && matchGroup !== cal.AM[2])))
                            return null;
                        break;
                    case "f":
                    // Deciseconds.
                    case "ff":
                    // Centiseconds.
                    case "fff":
                        // Milliseconds.
                        msec = matchInt * Math.pow(10, 3 - clength);
                        if (outOfRange(msec, 0, 999))
                            return null;
                        break;
                    case "ddd":
                    // Day of week.
                    case "dddd":
                        // Day of week.
                        weekDay = getDayIndex(cal, matchGroup, clength === 3);
                        if (outOfRange(weekDay, 0, 6))
                            return null;
                        break;
                    case "zzz":
                        // Time zone offset in +/- hours:min.
                        var offsets = matchGroup.split(/:/);
                        if (offsets.length !== 2)
                            return null;
                        hourOffset = parseInt(offsets[0], 10);
                        if (outOfRange(hourOffset, -12, 13))
                            return null;
                        var minOffset = parseInt(offsets[1], 10);
                        if (outOfRange(minOffset, 0, 59))
                            return null;
                        tzMinOffset = (hourOffset * 60) + ((0, exports.startsWith)(matchGroup, "-") ? -minOffset : minOffset);
                        break;
                    case "z":
                    case "zz":
                        // Time zone offset in +/- hours.
                        hourOffset = matchInt;
                        if (outOfRange(hourOffset, -12, 13))
                            return null;
                        tzMinOffset = hourOffset * 60;
                        break;
                    case "g":
                    case "gg":
                        var eraName = matchGroup;
                        if (!eraName || !cal.eras)
                            return null;
                        eraName = (0, exports.trim)(eraName.toLowerCase());
                        for (var i = 0, l = cal.eras.length; i < l; i++) {
                            if (eraName === cal.eras[i].name.toLowerCase()) {
                                era = i;
                                break;
                            }
                        }
                        // could not find an era with that name
                        if (era === null)
                            return null;
                        break;
                }
            }
        }
        var result = new Date(), defaultYear, convert = cal.convert;
        defaultYear = convert ? convert.fromGregorian(result)[0] : result.getFullYear();
        if (year === null) {
            year = defaultYear;
        }
        else if (cal.eras) {
            // year must be shifted to normal gregorian year
            // but not if year was not specified, its already normal gregorian
            // per the main if clause above.
            year += cal.eras[(era || 0)].offset;
        }
        // set default day and month to 1 and January, so if unspecified, these are the defaults
        // instead of the current day/month.
        if (month === null) {
            month = 0;
        }
        if (date === null) {
            date = 1;
        }
        // now have year, month, and date, but in the culture's calendar.
        // convert to gregorian if necessary
        if (convert) {
            result = convert.toGregorian(year, month, date);
            // conversion failed, must be an invalid match
            if (result === null)
                return null;
        }
        else {
            // have to set year, month and date together to avoid overflow based on current date.
            result.setFullYear(year, month, date);
            // check to see if date overflowed for specified month (only checked 1-31 above).
            if (result.getDate() !== date)
                return null;
            // invalid day of week.
            if (weekDay !== null && result.getDay() !== weekDay) {
                return null;
            }
        }
        // if pm designator token was found make sure the hours fit the 24-hour clock.
        if (pmHour && hour < 12) {
            hour += 12;
        }
        result.setHours(hour, min, sec, msec);
        if (tzMinOffset !== null) {
            // adjust timezone to utc before applying local offset.
            var adjustedMin = result.getMinutes() - (tzMinOffset + result.getTimezoneOffset());
            // Safari limits hours and minutes to the range of -127 to 127.	 We need to use setHours
            // to ensure both these fields will not exceed this range.	adjustedMin will range
            // somewhere between -1440 and 1500, so we only need to split this into hours.
            result.setHours(result.getHours() + parseInt((adjustedMin / 60).toString(), 10), adjustedMin % 60);
        }
        return result;
    };
}());
exports.parseNegativePattern = function (value, nf, negativePattern) {
    var neg = nf["-"], pos = nf["+"], ret;
    switch (negativePattern) {
        case "n -":
            neg = " " + neg;
            pos = " " + pos;
        // fall through
        case "n-":
            if ((0, exports.endsWith)(value, neg)) {
                ret = ["-", value.substring(0, value.length - neg.length)];
            }
            else if ((0, exports.endsWith)(value, pos)) {
                ret = ["+", value.substring(0, value.length - pos.length)];
            }
            break;
        case "- n":
            neg += " ";
            pos += " ";
        // fall through
        case "-n":
            if ((0, exports.startsWith)(value, neg)) {
                ret = ["-", value.substring(neg.length)];
            }
            else if ((0, exports.startsWith)(value, pos)) {
                ret = ["+", value.substring(pos.length)];
            }
            break;
        case "(n)":
            if ((0, exports.startsWith)(value, "(") && (0, exports.endsWith)(value, ")")) {
                ret = ["-", value.substring(1, value.length - 1)];
            }
            break;
    }
    return ret || ["", value];
};
//
// public instance functions
//
exports.Globalize.prototype.findClosestCulture = function (cultureSelector) {
    return exports.Globalize.findClosestCulture.call(this, cultureSelector);
};
exports.Globalize.prototype.format = function (value, format, cultureSelector) {
    return exports.Globalize.format.call(this, value, format, cultureSelector);
};
exports.Globalize.prototype.localize = function (key, cultureSelector) {
    return exports.Globalize.localize.call(this, key, cultureSelector);
};
exports.Globalize.prototype.parseInt = function (value, radix, cultureSelector) {
    return exports.Globalize.parseInt.call(this, value, radix, cultureSelector);
};
exports.Globalize.prototype.parseFloat = function (value, radix, cultureSelector) {
    return exports.Globalize.parseFloat.call(this, value, radix, cultureSelector);
};
exports.Globalize.prototype.culture = function (cultureSelector) {
    return exports.Globalize.culture.call(this, cultureSelector);
};
//
// public singleton functions
//
exports.Globalize.addCultureInfo = function (cultureName, baseCultureName, info) {
    var base = {}, isNew = false;
    if (typeof cultureName !== "string") {
        // cultureName argument is optional string. If not specified, assume info is first
        // and only argument. Specified info deep-extends current culture.
        info = cultureName;
        cultureName = this.culture().name;
        base = this.cultures[cultureName];
    }
    else if (typeof baseCultureName !== "string") {
        // baseCultureName argument is optional string. If not specified, assume info is second
        // argument. Specified info deep-extends specified culture.
        // If specified culture does not exist, create by deep-extending default
        info = baseCultureName;
        isNew = (this.cultures[cultureName] == null);
        base = this.cultures[cultureName] || this.cultures["default"];
    }
    else {
        // cultureName and baseCultureName specified. Assume a new culture is being created
        // by deep-extending an specified base culture
        isNew = true;
        base = this.cultures[baseCultureName];
    }
    this.cultures[cultureName] = (0, exports.extend)(true, {}, base, info);
    // Make the standard calendar the current culture if it's a new culture
    if (isNew) {
        this.cultures[cultureName].calendar = this.cultures[cultureName].calendars.standard;
    }
};
exports.Globalize.findClosestCulture = function (name) {
    var match;
    if (!name) {
        return this.cultures[this.cultureSelector] || this.cultures["default"];
    }
    if (typeof name === "string") {
        name = name.split(",");
    }
    if ((0, exports.isArray)(name)) {
        var lang, cultures = this.cultures, list = name, i, l = list.length, prioritized = [];
        for (i = 0; i < l; i++) {
            name = (0, exports.trim)(list[i]);
            var pri, parts = name.split(";");
            lang = (0, exports.trim)(parts[0]);
            if (parts.length === 1) {
                pri = 1;
            }
            else {
                name = (0, exports.trim)(parts[1]);
                if (name.indexOf("q=") === 0) {
                    name = name.substring(2);
                    pri = parseFloat(name);
                    pri = isNaN(pri) ? 0 : pri;
                }
                else {
                    pri = 1;
                }
            }
            prioritized.push({ lang: lang, pri: pri });
        }
        prioritized.sort(function (a, b) {
            return a.pri < b.pri ? 1 : -1;
        });
        // exact match
        for (i = 0; i < l; i++) {
            lang = prioritized[i].lang;
            match = cultures[lang];
            if (match) {
                return match;
            }
        }
        // neutral language match
        for (i = 0; i < l; i++) {
            lang = prioritized[i].lang;
            do {
                var index = lang.lastIndexOf("-");
                if (index === -1) {
                    break;
                }
                // strip off the last part. e.g. en-US => en
                lang = lang.substring(0, index);
                match = cultures[lang];
                if (match) {
                    return match;
                }
            } while (1);
        }
        // last resort: match first culture using that language
        for (i = 0; i < l; i++) {
            lang = prioritized[i].lang;
            for (var cultureKey in cultures) {
                var culture = cultures[cultureKey];
                if (culture.language == lang) {
                    return culture;
                }
            }
        }
    }
    else if (typeof name === "object") {
        return name;
    }
    return match || null;
};
exports.Globalize.format = function (value, format, cultureSelector) {
    var culture = this.findClosestCulture(cultureSelector);
    if (value instanceof Date) {
        value = (0, exports.formatDate)(value, format, culture);
    }
    else if (typeof value === "number") {
        value = (0, exports.formatNumber)(value, format, culture);
    }
    return value;
};
exports.Globalize.localize = function (key, cultureSelector) {
    return (this.findClosestCulture(cultureSelector).messages[key]
        ||
            this.cultures["default"].messages["key"]);
};
exports.Globalize.parseDate = function (value, formats, culture) {
    culture = this.findClosestCulture(culture);
    var date, prop, patterns;
    if (formats) {
        if (typeof formats === "string") {
            formats = [formats];
        }
        if (formats.length) {
            for (var i = 0, l = formats.length; i < l; i++) {
                var format = formats[i];
                if (format) {
                    date = (0, exports.parseExact)(value, format, culture);
                    if (date) {
                        break;
                    }
                }
            }
        }
    }
    else {
        patterns = culture.calendar.patterns;
        for (prop in patterns) {
            date = (0, exports.parseExact)(value, patterns[prop], culture);
            if (date) {
                break;
            }
        }
    }
    return date || null;
};
exports.Globalize.parseInt = function (value, radix, cultureSelector) {
    return Math.floor(exports.Globalize.parseFloat(value, radix, cultureSelector));
};
exports.Globalize.parseFloat = function (value, radix, cultureSelector) {
    // radix argument is optional
    if (typeof radix !== "number") {
        cultureSelector = radix;
        radix = 10;
    }
    var culture = this.findClosestCulture(cultureSelector);
    var ret = NaN, nf = culture.numberFormat;
    if (value.indexOf(culture.numberFormat.currency.symbol) > -1) {
        // remove currency symbol
        value = value.replace(culture.numberFormat.currency.symbol, "");
        // replace decimal seperator
        value = value.replace(culture.numberFormat.currency["."], culture.numberFormat["."]);
    }
    // trim leading and trailing whitespace
    value = (0, exports.trim)(value);
    // allow infinity or hexidecimal
    if (exports.regexInfinity.test(value)) {
        ret = parseFloat(value);
    }
    else if (!radix && exports.regexHex.test(value)) {
        ret = parseInt(value, 16);
    }
    else {
        var signInfo = (0, exports.parseNegativePattern)(value, nf, nf.pattern[0]), sign = signInfo[0], num = signInfo[1];
        // determine sign and number
        if (sign === "" && nf.pattern[0] !== "-n") {
            signInfo = (0, exports.parseNegativePattern)(value, nf, "-n");
            sign = signInfo[0];
            num = signInfo[1];
        }
        sign = sign || "+";
        // determine exponent and number
        var exponent, intAndFraction, exponentPos = num.indexOf("e");
        if (exponentPos < 0)
            exponentPos = num.indexOf("E");
        if (exponentPos < 0) {
            intAndFraction = num;
            exponent = null;
        }
        else {
            intAndFraction = num.substring(0, exponentPos);
            exponent = num.substring(exponentPos + 1);
        }
        // determine decimal position
        var integer, fraction, decSep = nf["."], decimalPos = intAndFraction.indexOf(decSep);
        if (decimalPos < 0) {
            integer = intAndFraction;
            fraction = null;
        }
        else {
            integer = intAndFraction.substring(0, decimalPos);
            fraction = intAndFraction.substring(decimalPos + decSep.length);
        }
        // handle groups (e.g. 1,000,000)
        var groupSep = nf[","];
        integer = integer.split(groupSep).join("");
        var altGroupSep = groupSep.replace(/\u00A0/g, " ");
        if (groupSep !== altGroupSep) {
            integer = integer.split(altGroupSep).join("");
        }
        // build a natively parsable number string
        var p = sign + integer;
        if (fraction !== null) {
            p += "." + fraction;
        }
        if (exponent !== null) {
            // exponent itself may have a number patternd
            var expSignInfo = (0, exports.parseNegativePattern)(exponent, nf, "-n");
            p += "e" + (expSignInfo[0] || "+") + expSignInfo[1];
        }
        if (exports.regexParseFloat.test(p)) {
            ret = parseFloat(p);
        }
    }
    return ret;
};
exports.Globalize.culture = function (cultureSelector) {
    // setter
    if (typeof cultureSelector !== "undefined") {
        this.cultureSelector = cultureSelector;
    }
    // getter
    return this.findClosestCulture(cultureSelector) || this.culture["default"];
};
//# sourceMappingURL=globalize.js.map

/***/ }),

/***/ 2594:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateTimeSequence = void 0;
var dateUtils = __webpack_require__(7042);
// powerbi.extensibility.utils.type
var powerbi_visuals_utils_typeutils_1 = __webpack_require__(2170);
var NumericSequence = powerbi_visuals_utils_typeutils_1.numericSequence.NumericSequence;
var NumericSequenceRange = powerbi_visuals_utils_typeutils_1.numericSequenceRange.NumericSequenceRange;
// powerbi.extensibility.utils.formatting
var iFormattingService_1 = __webpack_require__(1497);
// Repreasents the sequence of the dates/times
var DateTimeSequence = /** @class */ (function () {
    // Constructors
    // Creates new instance of the DateTimeSequence
    function DateTimeSequence(unit) {
        this.unit = unit;
        this.sequence = [];
        this.min = new Date("9999-12-31T23:59:59.999");
        this.max = new Date("0001-01-01T00:00:00.000");
    }
    // Methods
    /**
     * Add a new Date to a sequence.
     * @param date - date to add
     */
    DateTimeSequence.prototype.add = function (date) {
        if (date < this.min) {
            this.min = date;
        }
        if (date > this.max) {
            this.max = date;
        }
        this.sequence.push(date);
    };
    // Methods
    /**
     * Extends the sequence to cover new date range
     * @param min - new min to be covered by sequence
     * @param max - new max to be covered by sequence
     */
    DateTimeSequence.prototype.extendToCover = function (min, max) {
        var x = this.min;
        while (min < x) {
            x = DateTimeSequence.ADD_INTERVAL(x, -this.interval, this.unit);
            this.sequence.splice(0, 0, x);
        }
        this.min = x;
        x = this.max;
        while (x < max) {
            x = DateTimeSequence.ADD_INTERVAL(x, this.interval, this.unit);
            this.sequence.push(x);
        }
        this.max = x;
    };
    /**
     * Move the sequence to cover new date range
     * @param min - new min to be covered by sequence
     * @param max - new max to be covered by sequence
     */
    DateTimeSequence.prototype.moveToCover = function (min, max) {
        var delta = DateTimeSequence.getDelta(min, max, this.unit);
        var count = Math.floor(delta / this.interval);
        this.min = DateTimeSequence.ADD_INTERVAL(this.min, count * this.interval, this.unit);
        this.sequence = [];
        this.sequence.push(this.min);
        this.max = this.min;
        while (this.max < max) {
            this.max = DateTimeSequence.ADD_INTERVAL(this.max, this.interval, this.unit);
            this.sequence.push(this.max);
        }
    };
    // Static
    /**
     * Calculate a new DateTimeSequence
     * @param dataMin - Date representing min of the data range
     * @param dataMax - Date representing max of the data range
     * @param expectedCount - expected number of intervals in the sequence
     * @param unit - of the intervals in the sequence
     */
    DateTimeSequence.CALCULATE = function (dataMin, dataMax, expectedCount, unit) {
        if (!unit) {
            unit = DateTimeSequence.GET_INTERVAL_UNIT(dataMin, dataMax, expectedCount);
        }
        switch (unit) {
            case iFormattingService_1.DateTimeUnit.Year:
                return DateTimeSequence.CALCULATE_YEARS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Month:
                return DateTimeSequence.CALCULATE_MONTHS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Week:
                return DateTimeSequence.CALCULATE_WEEKS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Day:
                return DateTimeSequence.CALCULATE_DAYS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Hour:
                return DateTimeSequence.CALCULATE_HOURS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Minute:
                return DateTimeSequence.CALCULATE_MINUTES(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Second:
                return DateTimeSequence.CALCULATE_SECONDS(dataMin, dataMax, expectedCount);
            case iFormattingService_1.DateTimeUnit.Millisecond:
                return DateTimeSequence.CALCULATE_MILLISECONDS(dataMin, dataMax, expectedCount);
        }
    };
    DateTimeSequence.CALCULATE_YEARS = function (dataMin, dataMax, expectedCount) {
        // Calculate range and sequence
        var yearsRange = NumericSequenceRange.calculateDataRange(dataMin.getFullYear(), dataMax.getFullYear(), false);
        // Calculate year sequence
        var sequence = NumericSequence.calculate(NumericSequenceRange.calculate(0, yearsRange.max - yearsRange.min), expectedCount, 0, null, null, [1, 2, 5]);
        var newMinYear = Math.floor(yearsRange.min / sequence.interval) * sequence.interval;
        var date = new Date(newMinYear, 0, 1);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Year);
    };
    DateTimeSequence.CALCULATE_MONTHS = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var minYear = dataMin.getFullYear();
        var maxYear = dataMax.getFullYear();
        var minMonth = dataMin.getMonth();
        var maxMonth = (maxYear - minYear) * 12 + dataMax.getMonth();
        var date = new Date(minYear, 0, 1);
        // Calculate month sequence
        var sequence = NumericSequence.calculateUnits(minMonth, maxMonth, expectedCount, [1, 2, 3, 6, 12]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Month);
    };
    DateTimeSequence.CALCULATE_WEEKS = function (dataMin, dataMax, expectedCount) {
        var firstDayOfWeek = 0;
        var minDayOfWeek = dataMin.getDay();
        var dayOffset = (minDayOfWeek - firstDayOfWeek + 7) % 7;
        var minDay = dataMin.getDate() - dayOffset;
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), minDay);
        var min = 0;
        var max = powerbi_visuals_utils_typeutils_1.double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, iFormattingService_1.DateTimeUnit.Week));
        // Calculate week sequence
        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 4, 8]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Week);
    };
    DateTimeSequence.CALCULATE_DAYS = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate());
        var min = 0;
        var max = powerbi_visuals_utils_typeutils_1.double.ceilWithPrecision(DateTimeSequence.getDelta(dataMin, dataMax, iFormattingService_1.DateTimeUnit.Day));
        // Calculate day sequence
        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 7, 14]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Day);
    };
    DateTimeSequence.CALCULATE_HOURS = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate());
        var min = powerbi_visuals_utils_typeutils_1.double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, iFormattingService_1.DateTimeUnit.Hour));
        var max = powerbi_visuals_utils_typeutils_1.double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, iFormattingService_1.DateTimeUnit.Hour));
        // Calculate hour sequence
        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 3, 6, 12, 24]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Hour);
    };
    DateTimeSequence.CALCULATE_MINUTES = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours());
        var min = powerbi_visuals_utils_typeutils_1.double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, iFormattingService_1.DateTimeUnit.Minute));
        var max = powerbi_visuals_utils_typeutils_1.double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, iFormattingService_1.DateTimeUnit.Minute));
        // Calculate minutes numeric sequence
        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 5, 10, 15, 30, 60, 60 * 2, 60 * 3, 60 * 6, 60 * 12, 60 * 24]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Minute);
    };
    DateTimeSequence.CALCULATE_SECONDS = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours(), dataMin.getMinutes());
        var min = powerbi_visuals_utils_typeutils_1.double.floorWithPrecision(DateTimeSequence.getDelta(date, dataMin, iFormattingService_1.DateTimeUnit.Second));
        var max = powerbi_visuals_utils_typeutils_1.double.ceilWithPrecision(DateTimeSequence.getDelta(date, dataMax, iFormattingService_1.DateTimeUnit.Second));
        // Calculate minutes numeric sequence
        var sequence = NumericSequence.calculateUnits(min, max, expectedCount, [1, 2, 5, 10, 15, 30, 60, 60 * 2, 60 * 5, 60 * 10, 60 * 15, 60 * 30, 60 * 60]);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Second);
    };
    DateTimeSequence.CALCULATE_MILLISECONDS = function (dataMin, dataMax, expectedCount) {
        // Calculate range
        var date = new Date(dataMin.getFullYear(), dataMin.getMonth(), dataMin.getDate(), dataMin.getHours(), dataMin.getMinutes(), dataMin.getSeconds());
        var min = DateTimeSequence.getDelta(date, dataMin, iFormattingService_1.DateTimeUnit.Millisecond);
        var max = DateTimeSequence.getDelta(date, dataMax, iFormattingService_1.DateTimeUnit.Millisecond);
        // Calculate milliseconds numeric sequence
        var sequence = NumericSequence.calculate(NumericSequenceRange.calculate(min, max), expectedCount, 0);
        // Convert to date sequence
        return DateTimeSequence.fromNumericSequence(date, sequence, iFormattingService_1.DateTimeUnit.Millisecond);
    };
    DateTimeSequence.ADD_INTERVAL = function (value, interval, unit) {
        interval = Math.round(interval);
        switch (unit) {
            case iFormattingService_1.DateTimeUnit.Year:
                return dateUtils.addYears(value, interval);
            case iFormattingService_1.DateTimeUnit.Month:
                return dateUtils.addMonths(value, interval);
            case iFormattingService_1.DateTimeUnit.Week:
                return dateUtils.addWeeks(value, interval);
            case iFormattingService_1.DateTimeUnit.Day:
                return dateUtils.addDays(value, interval);
            case iFormattingService_1.DateTimeUnit.Hour:
                return dateUtils.addHours(value, interval);
            case iFormattingService_1.DateTimeUnit.Minute:
                return dateUtils.addMinutes(value, interval);
            case iFormattingService_1.DateTimeUnit.Second:
                return dateUtils.addSeconds(value, interval);
            case iFormattingService_1.DateTimeUnit.Millisecond:
                return dateUtils.addMilliseconds(value, interval);
        }
    };
    DateTimeSequence.fromNumericSequence = function (date, sequence, unit) {
        var result = new DateTimeSequence(unit);
        for (var i = 0; i < sequence.sequence.length; i++) {
            var x = sequence.sequence[i];
            var d = DateTimeSequence.ADD_INTERVAL(date, x, unit);
            result.add(d);
        }
        result.interval = sequence.interval;
        result.intervalOffset = sequence.intervalOffset;
        return result;
    };
    DateTimeSequence.getDelta = function (min, max, unit) {
        var delta = 0;
        switch (unit) {
            case iFormattingService_1.DateTimeUnit.Year:
                delta = max.getFullYear() - min.getFullYear();
                break;
            case iFormattingService_1.DateTimeUnit.Month:
                delta = (max.getFullYear() - min.getFullYear()) * 12 + max.getMonth() - min.getMonth();
                break;
            case iFormattingService_1.DateTimeUnit.Week:
                delta = (max.getTime() - min.getTime()) / (7 * 24 * 3600000);
                break;
            case iFormattingService_1.DateTimeUnit.Day:
                delta = (max.getTime() - min.getTime()) / (24 * 3600000);
                break;
            case iFormattingService_1.DateTimeUnit.Hour:
                delta = (max.getTime() - min.getTime()) / 3600000;
                break;
            case iFormattingService_1.DateTimeUnit.Minute:
                delta = (max.getTime() - min.getTime()) / 60000;
                break;
            case iFormattingService_1.DateTimeUnit.Second:
                delta = (max.getTime() - min.getTime()) / 1000;
                break;
            case iFormattingService_1.DateTimeUnit.Millisecond:
                delta = max.getTime() - min.getTime();
                break;
        }
        return delta;
    };
    DateTimeSequence.GET_INTERVAL_UNIT = function (min, max, maxCount) {
        maxCount = Math.max(maxCount, 2);
        var totalDays = DateTimeSequence.getDelta(min, max, iFormattingService_1.DateTimeUnit.Day);
        if (totalDays > 356 && totalDays >= 30 * 6 * maxCount)
            return iFormattingService_1.DateTimeUnit.Year;
        if (totalDays > 60 && totalDays > 7 * maxCount)
            return iFormattingService_1.DateTimeUnit.Month;
        if (totalDays > 14 && totalDays > 2 * maxCount)
            return iFormattingService_1.DateTimeUnit.Week;
        var totalHours = DateTimeSequence.getDelta(min, max, iFormattingService_1.DateTimeUnit.Hour);
        if (totalDays > 2 && totalHours > 12 * maxCount)
            return iFormattingService_1.DateTimeUnit.Day;
        if (totalHours >= 24 && totalHours >= maxCount)
            return iFormattingService_1.DateTimeUnit.Hour;
        var totalMinutes = DateTimeSequence.getDelta(min, max, iFormattingService_1.DateTimeUnit.Minute);
        if (totalMinutes > 2 && totalMinutes >= maxCount)
            return iFormattingService_1.DateTimeUnit.Minute;
        var totalSeconds = DateTimeSequence.getDelta(min, max, iFormattingService_1.DateTimeUnit.Second);
        if (totalSeconds > 2 && totalSeconds >= 0.8 * maxCount)
            return iFormattingService_1.DateTimeUnit.Second;
        var totalMilliseconds = DateTimeSequence.getDelta(min, max, iFormattingService_1.DateTimeUnit.Millisecond);
        if (totalMilliseconds > 0)
            return iFormattingService_1.DateTimeUnit.Millisecond;
        // If the size of the range is 0 we need to guess the unit based on the date's non-zero values starting with milliseconds
        var date = min;
        if (date.getMilliseconds() !== 0)
            return iFormattingService_1.DateTimeUnit.Millisecond;
        if (date.getSeconds() !== 0)
            return iFormattingService_1.DateTimeUnit.Second;
        if (date.getMinutes() !== 0)
            return iFormattingService_1.DateTimeUnit.Minute;
        if (date.getHours() !== 0)
            return iFormattingService_1.DateTimeUnit.Hour;
        if (date.getDate() !== 1)
            return iFormattingService_1.DateTimeUnit.Day;
        if (date.getMonth() !== 0)
            return iFormattingService_1.DateTimeUnit.Month;
        return iFormattingService_1.DateTimeUnit.Year;
    };
    // Constants
    DateTimeSequence.MIN_COUNT = 1;
    DateTimeSequence.MAX_COUNT = 1000;
    return DateTimeSequence;
}());
exports.DateTimeSequence = DateTimeSequence;
//# sourceMappingURL=dateTimeSequence.js.map

/***/ }),

/***/ 7042:
/***/ ((__unused_webpack_module, exports) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.addMilliseconds = exports.addSeconds = exports.addMinutes = exports.addHours = exports.addDays = exports.addWeeks = exports.addMonths = exports.addYears = void 0;
// dateUtils module provides DateTimeSequence with set of additional date manipulation routines
var MonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
var MonthDaysLeap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
/**
 * Returns bool indicating weither the provided year is a leap year.
 * @param year - year value
 */
function isLeap(year) {
    return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
}
/**
 * Returns number of days in the provided year/month.
 * @param year - year value
 * @param month - month value
 */
function getMonthDays(year, month) {
    return isLeap(year) ? MonthDaysLeap[month] : MonthDays[month];
}
/**
 * Adds a specified number of years to the provided date.
 * @param date - date value
 * @param yearDelta - number of years to add
 */
function addYears(date, yearDelta) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var isLeapDay = month === 2 && day === 29;
    var result = new Date(date.getTime());
    year = year + yearDelta;
    if (isLeapDay && !isLeap(year)) {
        day = 28;
    }
    result.setFullYear(year, month, day);
    return result;
}
exports.addYears = addYears;
/**
 * Adds a specified number of months to the provided date.
 * @param date - date value
 * @param monthDelta - number of months to add
 */
function addMonths(date, monthDelta) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var result = new Date(date.getTime());
    year += (monthDelta - (monthDelta % 12)) / 12;
    month += monthDelta % 12;
    // VSTS 1325771: Certain column charts don't display any data
    // Wrap arround the month if is after december (value 11)
    if (month > 11) {
        month = month % 12;
        year++;
    }
    day = Math.min(day, getMonthDays(year, month));
    result.setFullYear(year, month, day);
    return result;
}
exports.addMonths = addMonths;
/**
 * Adds a specified number of weeks to the provided date.
 * @param date - date value
 * @param weeks - number of weeks to add
 */
function addWeeks(date, weeks) {
    return addDays(date, weeks * 7);
}
exports.addWeeks = addWeeks;
/**
 * Adds a specified number of days to the provided date.
 * @param date - date value
 * @param days - number of days to add
 */
function addDays(date, days) {
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    var result = new Date(date.getTime());
    result.setFullYear(year, month, day + days);
    return result;
}
exports.addDays = addDays;
/**
 * Adds a specified number of hours to the provided date.
 * @param date - date value
 * @param hours - number of hours to add
 */
function addHours(date, hours) {
    return new Date(date.getTime() + hours * 3600000);
}
exports.addHours = addHours;
/**
 * Adds a specified number of minutes to the provided date.
 * @param date - date value
 * @param minutes - number of minutes to add
 */
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}
exports.addMinutes = addMinutes;
/**
 * Adds a specified number of seconds to the provided date.
 * @param date - date value
 * @param seconds - number of seconds to add
 */
function addSeconds(date, seconds) {
    return new Date(date.getTime() + seconds * 1000);
}
exports.addSeconds = addSeconds;
/**
 * Adds a specified number of milliseconds to the provided date.
 * @param date - date value
 * @param milliseconds - number of milliseconds to add
 */
function addMilliseconds(date, milliseconds) {
    return new Date(date.getTime() + milliseconds);
}
exports.addMilliseconds = addMilliseconds;
//# sourceMappingURL=dateUtils.js.map

/***/ }),

/***/ 7254:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DataLabelsDisplayUnitSystem = exports.WholeUnitsDisplayUnitSystem = exports.DefaultDisplayUnitSystem = exports.NoDisplayUnitSystem = exports.DisplayUnitSystem = exports.DisplayUnit = void 0;
/* eslint-disable no-useless-escape */
var formattingService_1 = __webpack_require__(5394);
var powerbi_visuals_utils_typeutils_1 = __webpack_require__(2170);
// Constants
var maxExponent = 24;
var defaultScientificBigNumbersBoundary = 1E15;
var scientificSmallNumbersBoundary = 1E-4;
var PERCENTAGE_FORMAT = "%";
var SCIENTIFIC_FORMAT = "E+0";
var DEFAULT_SCIENTIFIC_FORMAT = "0.##" + SCIENTIFIC_FORMAT;
// Regular expressions
/**
 * This regex looks for strings that match one of the following conditions:
 *   - Optionally contain "0", "#", followed by a period, followed by at least one "0" or "#" (Ex. ###,000.###)
 *   - Contains at least one of "0", "#", or "," (Ex. ###,000)
 *   - Contain a "g" (indicates to use the general .NET numeric format string)
 * The entire string (start to end) must match, and the match is not case-sensitive.
 */
var SUPPORTED_SCIENTIFIC_FORMATS = /^([0\#,]*\.[0\#]+|[0\#,]+|g)$/i;
var DisplayUnit = /** @class */ (function () {
    function DisplayUnit() {
    }
    // Methods
    DisplayUnit.prototype.project = function (value) {
        if (this.value) {
            return powerbi_visuals_utils_typeutils_1.double.removeDecimalNoise(value / this.value);
        }
        else {
            return value;
        }
    };
    DisplayUnit.prototype.reverseProject = function (value) {
        if (this.value) {
            return value * this.value;
        }
        else {
            return value;
        }
    };
    DisplayUnit.prototype.isApplicableTo = function (value) {
        value = Math.abs(value);
        var precision = powerbi_visuals_utils_typeutils_1.double.getPrecision(value, 3);
        return powerbi_visuals_utils_typeutils_1.double.greaterOrEqualWithPrecision(value, this.applicableRangeMin, precision) && powerbi_visuals_utils_typeutils_1.double.lessWithPrecision(value, this.applicableRangeMax, precision);
    };
    DisplayUnit.prototype.isScaling = function () {
        return this.value > 1;
    };
    return DisplayUnit;
}());
exports.DisplayUnit = DisplayUnit;
var DisplayUnitSystem = /** @class */ (function () {
    // Constructor
    function DisplayUnitSystem(units) {
        this.units = units ? units : [];
    }
    Object.defineProperty(DisplayUnitSystem.prototype, "title", {
        // Properties
        get: function () {
            return this.displayUnit ? this.displayUnit.title : undefined;
        },
        enumerable: false,
        configurable: true
    });
    // Methods
    DisplayUnitSystem.prototype.update = function (value) {
        if (value === undefined)
            return;
        this.unitBaseValue = value;
        this.displayUnit = this.findApplicableDisplayUnit(value);
    };
    DisplayUnitSystem.prototype.findApplicableDisplayUnit = function (value) {
        for (var _i = 0, _a = this.units; _i < _a.length; _i++) {
            var unit = _a[_i];
            if (unit.isApplicableTo(value))
                return unit;
        }
        return undefined;
    };
    DisplayUnitSystem.prototype.format = function (value, format, decimals, trailingZeros, cultureSelector) {
        decimals = this.getNumberOfDecimalsForFormatting(format, decimals);
        var nonScientificFormat = "";
        if (this.isFormatSupported(format)
            && !this.hasScientitifcFormat(format)
            && this.isScalingUnit()
            && this.shouldRespectScalingUnit(format)) {
            value = this.displayUnit.project(value);
            nonScientificFormat = this.displayUnit.labelFormat;
        }
        return this.formatHelper({
            value: value,
            nonScientificFormat: nonScientificFormat,
            format: format,
            decimals: decimals,
            trailingZeros: trailingZeros,
            cultureSelector: cultureSelector
        });
    };
    DisplayUnitSystem.prototype.isFormatSupported = function (format) {
        return !DisplayUnitSystem.UNSUPPORTED_FORMATS.test(format);
    };
    DisplayUnitSystem.prototype.isPercentageFormat = function (format) {
        return format && format.indexOf(PERCENTAGE_FORMAT) >= 0;
    };
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    DisplayUnitSystem.prototype.shouldRespectScalingUnit = function (format) {
        return true;
    };
    DisplayUnitSystem.prototype.getNumberOfDecimalsForFormatting = function (format, decimals) {
        return decimals;
    };
    DisplayUnitSystem.prototype.isScalingUnit = function () {
        return this.displayUnit && this.displayUnit.isScaling();
    };
    DisplayUnitSystem.prototype.formatHelper = function (options) {
        var value = options.value, cultureSelector = options.cultureSelector, decimals = options.decimals, trailingZeros = options.trailingZeros;
        var nonScientificFormat = options.nonScientificFormat, format = options.format;
        // If the format is "general" and we want to override the number of decimal places then use the default numeric format string.
        if ((format === "g" || format === "G") && decimals != null) {
            format = "#,0.00";
        }
        format = formattingService_1.numberFormat.addDecimalsToFormat(format, decimals, trailingZeros);
        if (format && !formattingService_1.formattingService.isStandardNumberFormat(format)) {
            return formattingService_1.formattingService.formatNumberWithCustomOverride(value, format, nonScientificFormat, cultureSelector);
        }
        if (!format) {
            format = "G";
        }
        if (!nonScientificFormat) {
            nonScientificFormat = "{0}";
        }
        var text = formattingService_1.formattingService.formatValue(value, format, cultureSelector);
        return formattingService_1.formattingService.format(nonScientificFormat, [text]);
    };
    //  Formats a single value by choosing an appropriate base for the DisplayUnitSystem before formatting.
    DisplayUnitSystem.prototype.formatSingleValue = function (value, format, decimals, trailingZeros, cultureSelector) {
        // Change unit base to a value appropriate for this value
        this.update(this.shouldUseValuePrecision(value) ? powerbi_visuals_utils_typeutils_1.double.getPrecision(value, 8) : value);
        return this.format(value, format, decimals, trailingZeros, cultureSelector);
    };
    DisplayUnitSystem.prototype.shouldUseValuePrecision = function (value) {
        if (this.units.length === 0)
            return true;
        // Check if the value is big enough to have a valid unit by checking against the smallest unit (that it's value bigger than 1).
        var applicableRangeMin = 0;
        for (var i = 0; i < this.units.length; i++) {
            if (this.units[i].isScaling()) {
                applicableRangeMin = this.units[i].applicableRangeMin;
                break;
            }
        }
        return Math.abs(value) < applicableRangeMin;
    };
    DisplayUnitSystem.prototype.isScientific = function (value) {
        return value < -defaultScientificBigNumbersBoundary || value > defaultScientificBigNumbersBoundary ||
            (-scientificSmallNumbersBoundary < value && value < scientificSmallNumbersBoundary && value !== 0);
    };
    DisplayUnitSystem.prototype.hasScientitifcFormat = function (format) {
        return format && format.toUpperCase().indexOf("E") !== -1;
    };
    DisplayUnitSystem.prototype.supportsScientificFormat = function (format) {
        if (format)
            return SUPPORTED_SCIENTIFIC_FORMATS.test(format);
        return true;
    };
    DisplayUnitSystem.prototype.shouldFallbackToScientific = function (value, format) {
        return !this.hasScientitifcFormat(format)
            && this.supportsScientificFormat(format)
            && this.isScientific(value);
    };
    DisplayUnitSystem.prototype.getScientificFormat = function (data, format, decimals, trailingZeros) {
        // Use scientific format outside of the range
        if (this.isFormatSupported(format) && this.shouldFallbackToScientific(data, format)) {
            var numericFormat = formattingService_1.numberFormat.getNumericFormat(data, format);
            if (decimals)
                numericFormat = formattingService_1.numberFormat.addDecimalsToFormat(numericFormat ? numericFormat : "0", Math.abs(decimals), trailingZeros);
            if (numericFormat)
                return numericFormat + SCIENTIFIC_FORMAT;
            else
                return DEFAULT_SCIENTIFIC_FORMAT;
        }
        return format;
    };
    DisplayUnitSystem.UNSUPPORTED_FORMATS = /^(p\d*)|(e\d*)$/i;
    return DisplayUnitSystem;
}());
exports.DisplayUnitSystem = DisplayUnitSystem;
// Provides a unit system that is defined by formatting in the model, and is suitable for visualizations shown in single number visuals in explore mode.
var NoDisplayUnitSystem = /** @class */ (function (_super) {
    __extends(NoDisplayUnitSystem, _super);
    // Constructor
    function NoDisplayUnitSystem() {
        return _super.call(this, []) || this;
    }
    return NoDisplayUnitSystem;
}(DisplayUnitSystem));
exports.NoDisplayUnitSystem = NoDisplayUnitSystem;
/** Provides a unit system that creates a more concise format for displaying values. This is suitable for most of the cases where
    we are showing values (chart axes) and as such it is the default unit system. */
var DefaultDisplayUnitSystem = /** @class */ (function (_super) {
    __extends(DefaultDisplayUnitSystem, _super);
    // Constructor
    function DefaultDisplayUnitSystem(unitLookup) {
        return _super.call(this, DefaultDisplayUnitSystem.getUnits(unitLookup)) || this;
    }
    // Methods
    DefaultDisplayUnitSystem.prototype.format = function (data, format, decimals, trailingZeros, cultureSelector) {
        format = this.getScientificFormat(data, format, decimals, trailingZeros);
        return _super.prototype.format.call(this, data, format, decimals, trailingZeros, cultureSelector);
    };
    DefaultDisplayUnitSystem.RESET = function () {
        DefaultDisplayUnitSystem.units = null;
    };
    DefaultDisplayUnitSystem.getUnits = function (unitLookup) {
        if (!DefaultDisplayUnitSystem.units) {
            DefaultDisplayUnitSystem.units = createDisplayUnits(unitLookup, function (value, previousUnitValue, min) {
                // When dealing with millions/billions/trillions we need to switch to millions earlier: for example instead of showing 100K 200K 300K we should show 0.1M 0.2M 0.3M etc
                if (value - previousUnitValue >= 1000) {
                    return value / 10;
                }
                return min;
            });
            // Ensure last unit has max of infinity
            DefaultDisplayUnitSystem.units[DefaultDisplayUnitSystem.units.length - 1].applicableRangeMax = Infinity;
        }
        return DefaultDisplayUnitSystem.units;
    };
    return DefaultDisplayUnitSystem;
}(DisplayUnitSystem));
exports.DefaultDisplayUnitSystem = DefaultDisplayUnitSystem;
/** Provides a unit system that creates a more concise format for displaying values, but only allows showing a unit if we have at least
    one of those units (e.g. 0.9M is not allowed since it's less than 1 million). This is suitable for cases such as dashboard tiles
    where we have restricted space but do not want to show partial units. */
var WholeUnitsDisplayUnitSystem = /** @class */ (function (_super) {
    __extends(WholeUnitsDisplayUnitSystem, _super);
    // Constructor
    function WholeUnitsDisplayUnitSystem(unitLookup) {
        return _super.call(this, WholeUnitsDisplayUnitSystem.getUnits(unitLookup)) || this;
    }
    WholeUnitsDisplayUnitSystem.RESET = function () {
        WholeUnitsDisplayUnitSystem.units = null;
    };
    WholeUnitsDisplayUnitSystem.getUnits = function (unitLookup) {
        if (!WholeUnitsDisplayUnitSystem.units) {
            WholeUnitsDisplayUnitSystem.units = createDisplayUnits(unitLookup);
            // Ensure last unit has max of infinity
            WholeUnitsDisplayUnitSystem.units[WholeUnitsDisplayUnitSystem.units.length - 1].applicableRangeMax = Infinity;
        }
        return WholeUnitsDisplayUnitSystem.units;
    };
    WholeUnitsDisplayUnitSystem.prototype.format = function (data, format, decimals, trailingZeros, cultureSelector) {
        format = this.getScientificFormat(data, format, decimals, trailingZeros);
        return _super.prototype.format.call(this, data, format, decimals, trailingZeros, cultureSelector);
    };
    return WholeUnitsDisplayUnitSystem;
}(DisplayUnitSystem));
exports.WholeUnitsDisplayUnitSystem = WholeUnitsDisplayUnitSystem;
var DataLabelsDisplayUnitSystem = /** @class */ (function (_super) {
    __extends(DataLabelsDisplayUnitSystem, _super);
    function DataLabelsDisplayUnitSystem(unitLookup) {
        return _super.call(this, DataLabelsDisplayUnitSystem.getUnits(unitLookup)) || this;
    }
    DataLabelsDisplayUnitSystem.prototype.isFormatSupported = function (format) {
        return !DataLabelsDisplayUnitSystem.UNSUPPORTED_FORMATS.test(format);
    };
    DataLabelsDisplayUnitSystem.getUnits = function (unitLookup) {
        if (!DataLabelsDisplayUnitSystem.units) {
            var units = [];
            var adjustMinBasedOnPreviousUnit = function (value, previousUnitValue, min) {
                // Never returns true, we are always ignoring
                // We do not early switch (e.g. 100K instead of 0.1M)
                // Intended? If so, remove this function, otherwise, remove if statement
                if (value === -1)
                    if (value - previousUnitValue >= 1000) {
                        return value / 10;
                    }
                return min;
            };
            // Add Auto & None
            var names = unitLookup(-1);
            addUnitIfNonEmpty(units, DataLabelsDisplayUnitSystem.AUTO_DISPLAYUNIT_VALUE, names.title, names.format, adjustMinBasedOnPreviousUnit);
            names = unitLookup(0);
            addUnitIfNonEmpty(units, DataLabelsDisplayUnitSystem.NONE_DISPLAYUNIT_VALUE, names.title, names.format, adjustMinBasedOnPreviousUnit);
            // Add normal units
            DataLabelsDisplayUnitSystem.units = units.concat(createDisplayUnits(unitLookup, adjustMinBasedOnPreviousUnit));
            // Ensure last unit has max of infinity
            DataLabelsDisplayUnitSystem.units[DataLabelsDisplayUnitSystem.units.length - 1].applicableRangeMax = Infinity;
        }
        return DataLabelsDisplayUnitSystem.units;
    };
    DataLabelsDisplayUnitSystem.prototype.format = function (data, format, decimals, trailingZeros, cultureSelector) {
        format = this.getScientificFormat(data, format, decimals, trailingZeros);
        return _super.prototype.format.call(this, data, format, decimals, trailingZeros, cultureSelector);
    };
    // Constants
    DataLabelsDisplayUnitSystem.AUTO_DISPLAYUNIT_VALUE = 0;
    DataLabelsDisplayUnitSystem.NONE_DISPLAYUNIT_VALUE = 1;
    DataLabelsDisplayUnitSystem.UNSUPPORTED_FORMATS = /^(e\d*)$/i;
    return DataLabelsDisplayUnitSystem;
}(DisplayUnitSystem));
exports.DataLabelsDisplayUnitSystem = DataLabelsDisplayUnitSystem;
function createDisplayUnits(unitLookup, adjustMinBasedOnPreviousUnit) {
    var units = [];
    for (var i = 3; i < maxExponent; i++) {
        var names = unitLookup(i);
        if (names)
            addUnitIfNonEmpty(units, powerbi_visuals_utils_typeutils_1.double.pow10(i), names.title, names.format, adjustMinBasedOnPreviousUnit);
    }
    return units;
}
function addUnitIfNonEmpty(units, value, title, labelFormat, adjustMinBasedOnPreviousUnit) {
    if (title || labelFormat) {
        var min = value;
        if (units.length > 0) {
            var previousUnit = units[units.length - 1];
            if (adjustMinBasedOnPreviousUnit)
                min = adjustMinBasedOnPreviousUnit(value, previousUnit.value, min);
            previousUnit.applicableRangeMax = min;
        }
        var unit = new DisplayUnit();
        unit.value = value;
        unit.applicableRangeMin = min;
        unit.applicableRangeMax = min * 1000;
        unit.title = title;
        unit.labelFormat = labelFormat;
        units.push(unit);
    }
}
//# sourceMappingURL=displayUnitSystem.js.map

/***/ }),

/***/ 6585:
/***/ ((__unused_webpack_module, exports) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DisplayUnitSystemType = void 0;
// The system used to determine display units used during formatting
var DisplayUnitSystemType;
(function (DisplayUnitSystemType) {
    // Default display unit system, which saves space by using units such as K, M, bn with PowerView rules for when to pick a unit. Suitable for chart axes.
    DisplayUnitSystemType[DisplayUnitSystemType["Default"] = 0] = "Default";
    // A verbose display unit system that will only respect the formatting defined in the model. Suitable for explore mode single-value cards.
    DisplayUnitSystemType[DisplayUnitSystemType["Verbose"] = 1] = "Verbose";
    /**
     * A display unit system that uses units such as K, M, bn if we have at least one of those units (e.g. 0.9M is not valid as it's less than 1 million).
     * Suitable for dashboard tile cards
     */
    DisplayUnitSystemType[DisplayUnitSystemType["WholeUnits"] = 2] = "WholeUnits";
    // A display unit system that also contains Auto and None units for data labels
    DisplayUnitSystemType[DisplayUnitSystemType["DataLabels"] = 3] = "DataLabels";
})(DisplayUnitSystemType = exports.DisplayUnitSystemType || (exports.DisplayUnitSystemType = {}));
//# sourceMappingURL=displayUnitSystemType.js.map

/***/ }),

/***/ 9078:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Family = exports.fallbackFonts = void 0;
var familyInfo_1 = __webpack_require__(8069);
exports.fallbackFonts = ["helvetica", "arial", "sans-serif"];
exports.Family = {
    light: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    semilight: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    regular: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    semibold: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    bold: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    lightSecondary: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    regularSecondary: new familyInfo_1.FamilyInfo(exports.fallbackFonts),
    boldSecondary: new familyInfo_1.FamilyInfo(exports.fallbackFonts)
};
//# sourceMappingURL=family.js.map

/***/ }),

/***/ 8069:
/***/ ((__unused_webpack_module, exports) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FamilyInfo = void 0;
var FamilyInfo = /** @class */ (function () {
    function FamilyInfo(families) {
        this.families = families;
    }
    Object.defineProperty(FamilyInfo.prototype, "family", {
        /**
         * Gets the first font "wf_" font family since it will always be loaded.
         */
        get: function () {
            return this.getFamily();
        },
        enumerable: false,
        configurable: true
    });
    /**
    * Gets the first font family that matches regex (if provided).
    * Default regex looks for "wf_" fonts which are always loaded.
    */
    FamilyInfo.prototype.getFamily = function (regex) {
        if (regex === void 0) { regex = /^wf_/; }
        if (!this.families) {
            return null;
        }
        if (regex) {
            for (var _i = 0, _a = this.families; _i < _a.length; _i++) {
                var fontFamily = _a[_i];
                if (regex.test(fontFamily)) {
                    return fontFamily;
                }
            }
        }
        return this.families[0];
    };
    Object.defineProperty(FamilyInfo.prototype, "css", {
        /**
         * Gets the CSS string for the "font-family" CSS attribute.
         */
        get: function () {
            return this.getCSS();
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Gets the CSS string for the "font-family" CSS attribute.
     */
    FamilyInfo.prototype.getCSS = function () {
        return this.families ? this.families.map((function (font) { return font.indexOf(" ") > 0 ? "'" + font + "'" : font; })).join(", ") : null;
    };
    return FamilyInfo;
}());
exports.FamilyInfo = FamilyInfo;
//# sourceMappingURL=familyInfo.js.map

/***/ }),

/***/ 9297:
/***/ ((__unused_webpack_module, exports) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
/* eslint-disable no-useless-escape */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.fixDateTimeFormat = exports.findDateFormat = void 0;
var regexCache;
/**
 * Translate .NET format into something supported by Globalize.
 */
function findDateFormat(value, format, cultureName) {
    switch (format) {
        case "m":
            // Month + day
            format = "M";
            break;
        case "O":
        case "o":
            // Roundtrip
            format = "yyyy'-'MM'-'dd'T'HH':'mm':'ss'.'fff'0000'";
            break;
        case "R":
        case "r":
            // RFC1123 pattern - - time must be converted to UTC before formatting
            value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
            format = "ddd, dd MMM yyyy HH':'mm':'ss 'GMT'";
            break;
        case "s":
            // Sortable - should use invariant culture
            format = "S";
            break;
        case "u":
            // Universal sortable - should convert to UTC before applying the "yyyy'-'MM'-'dd HH':'mm':'ss'Z' format.
            value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
            format = "yyyy'-'MM'-'dd HH':'mm':'ss'Z'";
            break;
        case "U":
            // Universal full - the pattern is same as F but the time must be converted to UTC before formatting
            value = new Date(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), value.getUTCSeconds(), value.getUTCMilliseconds());
            format = "F";
            break;
        case "y":
        case "Y":
            // Year and month
            switch (cultureName) {
                case "default":
                case "en":
                case "en-US":
                    format = "MMMM, yyyy"; // Fix the default year-month pattern for english
                    break;
                default:
                    format = "Y"; // For other cultures - use the localized pattern
            }
            break;
    }
    return { value: value, format: format };
}
exports.findDateFormat = findDateFormat;
/**
 * Translates unsupported .NET custom format expressions to the custom expressions supported by Globalize.
 */
function fixDateTimeFormat(format) {
    // Fix for the "K" format (timezone):
    // T he js dates don't have a kind property so we'll support only local kind which is equavalent to zzz format.
    format = format.replace(/%K/g, "zzz");
    format = format.replace(/K/g, "zzz");
    format = format.replace(/fffffff/g, "fff0000");
    format = format.replace(/ffffff/g, "fff000");
    format = format.replace(/fffff/g, "fff00");
    format = format.replace(/ffff/g, "fff0");
    // Fix for the 5 digit year: "yyyyy" format.
    // The Globalize doesn't support dates greater than 9999 so we replace the "yyyyy" with "0yyyy".
    format = format.replace(/yyyyy/g, "0yyyy");
    // Fix for the 3 digit year: "yyy" format.
    // The Globalize doesn't support this formatting so we need to replace it with the 4 digit year "yyyy" format.
    format = format.replace(/(^y|^)yyy(^y|$)/g, "yyyy");
    if (!regexCache) {
        // Creating Regexes for cases "Using single format specifier"
        // - http://msdn.microsoft.com/en-us/library/8kb3ddd4.aspx#UsingSingleSpecifiers
        // This is not supported from The Globalize.
        // The case covers all single "%" lead specifier (like "%d" but not %dd)
        // The cases as single "%d" are filtered in if the bellow.
        // (?!S) where S is the specifier make sure that we only one symbol for specifier.
        regexCache = ["d", "f", "F", "g", "h", "H", "K", "m", "M", "s", "t", "y", "z", ":", "/"].map(function (s) {
            return { r: new RegExp("\%" + s + "(?!" + s + ")", "g"), s: s };
        });
    }
    if (format.indexOf("%") !== -1 && format.length > 2) {
        for (var i = 0; i < regexCache.length; i++) {
            format = format.replace(regexCache[i].r, regexCache[i].s);
        }
    }
    return format;
}
exports.fixDateTimeFormat = fixDateTimeFormat;
//# sourceMappingURL=formatting.js.map

/***/ }),

/***/ 41:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.format = exports.canFormat = void 0;
var formatting_1 = __webpack_require__(9297);
var formattingEncoder = __webpack_require__(4249);
var stringExtensions = __webpack_require__(7918);
var globalize_1 = __webpack_require__(4818);
var _currentCachedFormat;
var _currentCachedProcessedFormat;
// Evaluates if the value can be formatted using the NumberFormat
function canFormat(value) {
    return value instanceof Date;
}
exports.canFormat = canFormat;
// Formats the date using provided format and culture
function format(value, format, culture) {
    format = format || "G";
    var isStandard = format.length === 1;
    try {
        if (isStandard) {
            return formatDateStandard(value, format, culture);
        }
        else {
            return formatDateCustom(value, format, culture);
        }
    }
    catch (e) {
        return formatDateStandard(value, "G", culture);
    }
}
exports.format = format;
// Formats the date using standard format expression
function formatDateStandard(value, format, culture) {
    // In order to provide parity with .NET we have to support additional set of DateTime patterns.
    var patterns = culture.calendar.patterns;
    // Extend supported set of patterns
    ensurePatterns(culture.calendar);
    // Handle extended set of formats
    var output = (0, formatting_1.findDateFormat)(value, format, culture.name);
    if (output.format.length === 1)
        format = patterns[output.format];
    else
        format = output.format;
    // need to revisit when globalization is enabled
    if (!culture) {
        culture = this.getCurrentCulture();
    }
    return globalize_1.Globalize.format(output.value, format, culture);
}
// Formats the date using custom format expression
function formatDateCustom(value, format, culture) {
    var result;
    var literals = [];
    format = formattingEncoder.preserveLiterals(format, literals);
    if (format.indexOf("F") > -1) {
        // F is not supported so we need to replace the F with f based on the milliseconds
        // Replace all sequences of F longer than 3 with "FFF"
        format = stringExtensions.replaceAll(format, "FFFF", "FFF");
        // Based on milliseconds update the format to use fff
        var milliseconds = value.getMilliseconds();
        if (milliseconds % 10 >= 1) {
            format = stringExtensions.replaceAll(format, "FFF", "fff");
        }
        format = stringExtensions.replaceAll(format, "FFF", "FF");
        if ((milliseconds % 100) / 10 >= 1) {
            format = stringExtensions.replaceAll(format, "FF", "ff");
        }
        format = stringExtensions.replaceAll(format, "FF", "F");
        if ((milliseconds % 1000) / 100 >= 1) {
            format = stringExtensions.replaceAll(format, "F", "f");
        }
        format = stringExtensions.replaceAll(format, "F", "");
        if (format === "" || format === "%")
            return "";
    }
    format = processCustomDateTimeFormat(format);
    result = globalize_1.Globalize.format(value, format, culture);
    result = localize(result, culture.calendar);
    result = formattingEncoder.restoreLiterals(result, literals, false);
    return result;
}
// Translates unsupported .NET custom format expressions to the custom expressions supported by JQuery.Globalize
function processCustomDateTimeFormat(format) {
    if (format === _currentCachedFormat) {
        return _currentCachedProcessedFormat;
    }
    _currentCachedFormat = format;
    format = (0, formatting_1.fixDateTimeFormat)(format);
    _currentCachedProcessedFormat = format;
    return format;
}
// Localizes the time separator symbol
function localize(value, dictionary) {
    var timeSeparator = dictionary[":"];
    if (timeSeparator === ":") {
        return value;
    }
    var result = "";
    var count = value.length;
    for (var i = 0; i < count; i++) {
        var char = value.charAt(i);
        switch (char) {
            case ":":
                result += timeSeparator;
                break;
            default:
                result += char;
                break;
        }
    }
    return result;
}
function ensurePatterns(calendar) {
    var patterns = calendar.patterns;
    if (patterns["g"] === undefined) {
        patterns["g"] = patterns["f"].replace(patterns["D"], patterns["d"]); // Generic: Short date, short time
        patterns["G"] = patterns["F"].replace(patterns["D"], patterns["d"]); // Generic: Short date, long time
    }
}
//# sourceMappingURL=dateTimeFormat.js.map

/***/ }),

/***/ 4249:
/***/ ((__unused_webpack_module, exports) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.restoreLiterals = exports.preserveLiterals = exports.removeLiterals = void 0;
// quoted and escaped literal patterns
// NOTE: the final three cases match .NET behavior
var literalPatterns = [
    "'[^']*'",
    "\"[^\"]*\"",
    "\\\\.",
    "'[^']*$",
    "\"[^\"]*$",
    "\\\\$", // backslash at end of string
];
var literalMatcher = new RegExp(literalPatterns.join("|"), "g");
// Unicode U+E000 - U+F8FF is a private area and so we can use the chars from the range to encode the escaped sequences
function removeLiterals(format) {
    literalMatcher.lastIndex = 0;
    // just in case consecutive non-literals have some meaning
    return format.replace(literalMatcher, "\uE100");
}
exports.removeLiterals = removeLiterals;
function preserveLiterals(format, literals) {
    literalMatcher.lastIndex = 0;
    for (;;) {
        var match = literalMatcher.exec(format);
        if (!match)
            break;
        var literal = match[0];
        var literalOffset = literalMatcher.lastIndex - literal.length;
        var token = String.fromCharCode(0xE100 + literals.length);
        literals.push(literal);
        format = format.substring(0, literalOffset) + token + format.substring(literalMatcher.lastIndex);
        // back to avoid skipping due to removed literal substring
        literalMatcher.lastIndex = literalOffset + 1;
    }
    return format;
}
exports.preserveLiterals = preserveLiterals;
function restoreLiterals(format, literals, quoted) {
    if (quoted === void 0) { quoted = true; }
    var count = literals.length;
    for (var i = 0; i < count; i++) {
        var token = String.fromCharCode(0xE100 + i);
        var literal = literals[i];
        if (!quoted) {
            // caller wants literals to be re-inserted without escaping
            var firstChar = literal[0];
            if (firstChar === "\\" || literal.length === 1 || literal[literal.length - 1] !== firstChar) {
                // either escaped literal OR quoted literal that's missing the trailing quote
                // in either case we only remove the leading character
                literal = literal.substring(1);
            }
            else {
                // so must be a quoted literal with both starting and ending quote
                literal = literal.substring(1, literal.length - 1);
            }
        }
        format = format.replace(token, literal);
    }
    return format;
}
exports.restoreLiterals = restoreLiterals;
//# sourceMappingURL=formattingEncoder.js.map

/***/ }),

/***/ 5394:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/* eslint-disable no-useless-escape */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.formattingEncoder = exports.dateTimeFormat = exports.numberFormat = exports.formattingService = exports.FormattingService = void 0;
var globalize_1 = __webpack_require__(4818);
var globalize_cultures_1 = __webpack_require__(9538);
(0, globalize_cultures_1.default)(globalize_1.Globalize);
var dateTimeFormat = __webpack_require__(41);
exports.dateTimeFormat = dateTimeFormat;
var numberFormat = __webpack_require__(5451);
exports.numberFormat = numberFormat;
var formattingEncoder = __webpack_require__(4249);
exports.formattingEncoder = formattingEncoder;
var iFormattingService_1 = __webpack_require__(1497);
var IndexedTokensRegex = /({{)|(}})|{(\d+[^}]*)}/g;
// Formatting Service
var FormattingService = /** @class */ (function () {
    function FormattingService() {
    }
    FormattingService.prototype.formatValue = function (value, formatValue, cultureSelector) {
        // Handle special cases
        if (value === undefined || value === null) {
            return "";
        }
        var gculture = this.getCulture(cultureSelector);
        if (dateTimeFormat.canFormat(value)) {
            // Dates
            return dateTimeFormat.format(value, formatValue, gculture);
        }
        else if (numberFormat.canFormat(value)) {
            // Numbers
            return numberFormat.format(value, formatValue, gculture);
        }
        // Other data types - return as string
        return value.toString();
    };
    FormattingService.prototype.format = function (formatWithIndexedTokens, args, culture) {
        var _this = this;
        if (!formatWithIndexedTokens) {
            return "";
        }
        return formatWithIndexedTokens.replace(IndexedTokensRegex, function (match, left, right, argToken) {
            if (left) {
                return "{";
            }
            else if (right) {
                return "}";
            }
            else {
                var parts = argToken.split(":");
                var argIndex = parseInt(parts[0], 10);
                var argFormat = parts[1];
                return _this.formatValue(args[argIndex], argFormat, culture);
            }
        });
    };
    FormattingService.prototype.isStandardNumberFormat = function (format) {
        return numberFormat.isStandardFormat(format);
    };
    FormattingService.prototype.formatNumberWithCustomOverride = function (value, format, nonScientificOverrideFormat, culture) {
        var gculture = this.getCulture(culture);
        return numberFormat.formatWithCustomOverride(value, format, nonScientificOverrideFormat, gculture);
    };
    FormattingService.prototype.dateFormatString = function (unit) {
        if (!this._dateTimeScaleFormatInfo)
            this.initialize();
        return this._dateTimeScaleFormatInfo.getFormatString(unit);
    };
    /**
     * Sets the current localization culture
     * @param cultureSelector - name of a culture: "en", "en-UK", "fr-FR" etc. (See National Language Support (NLS) for full lists. Use "default" for invariant culture).
     */
    FormattingService.prototype.setCurrentCulture = function (cultureSelector) {
        if (this._currentCultureSelector !== cultureSelector) {
            this._currentCulture = this.getCulture(cultureSelector);
            this._currentCultureSelector = cultureSelector;
            this._dateTimeScaleFormatInfo = new DateTimeScaleFormatInfo(this._currentCulture);
        }
    };
    /**
     * Gets the culture assotiated with the specified cultureSelector ("en", "en-US", "fr-FR" etc).
     * @param cultureSelector - name of a culture: "en", "en-UK", "fr-FR" etc. (See National Language Support (NLS) for full lists. Use "default" for invariant culture).
     * Exposing this function for testability of unsupported cultures
     */
    FormattingService.prototype.getCulture = function (cultureSelector) {
        if (cultureSelector == null) {
            if (this._currentCulture == null) {
                this.initialize();
            }
            return this._currentCulture;
        }
        else {
            var culture = globalize_1.Globalize.findClosestCulture(cultureSelector);
            if (!culture)
                culture = globalize_1.Globalize.culture("en-US");
            return culture;
        }
    };
    // By default the Globalization module initializes to the culture/calendar provided in the language/culture URL params
    FormattingService.prototype.initialize = function () {
        var cultureName = this.getCurrentCulture();
        this.setCurrentCulture(cultureName);
        var calendarName = this.getUrlParam("calendar");
        if (calendarName) {
            var culture = this._currentCulture;
            var c = culture.calendars[calendarName];
            if (c) {
                culture.calendar = c;
            }
        }
    };
    /**
     *  Exposing this function for testability
     */
    FormattingService.prototype.getCurrentCulture = function () {
        if (window === null || window === void 0 ? void 0 : window.navigator) {
            return window.navigator.userLanguage || window.navigator["language"];
        }
        return "en-US";
    };
    /**
     *  Exposing this function for testability
     *  @param name: queryString name
     */
    FormattingService.prototype.getUrlParam = function (name) {
        var param = window.location.search.match(RegExp("[?&]" + name + "=([^&]*)"));
        return param ? param[1] : undefined;
    };
    return FormattingService;
}());
exports.FormattingService = FormattingService;
// DateTimeScaleFormatInfo is used to calculate and keep the Date formats used for different units supported by the DateTimeScaleModel
var DateTimeScaleFormatInfo = /** @class */ (function () {
    // Constructor
    /**
     * Creates new instance of the DateTimeScaleFormatInfo class.
     * @param culture - culture which calendar info is going to be used to derive the formats.
     */
    function DateTimeScaleFormatInfo(culture) {
        var calendar = culture.calendar;
        var patterns = calendar.patterns;
        var monthAbbreviations = calendar["months"]["namesAbbr"];
        var cultureHasMonthAbbr = monthAbbreviations && monthAbbreviations[0];
        var yearMonthPattern = patterns["Y"];
        var monthDayPattern = patterns["M"];
        var fullPattern = patterns["f"];
        var longTimePattern = patterns["T"];
        var shortTimePattern = patterns["t"];
        var separator = fullPattern.indexOf(",") > -1 ? ", " : " ";
        var hasYearSymbol = yearMonthPattern.indexOf("yyyy'") === 0 && yearMonthPattern.length > 6 && yearMonthPattern[6] === "\'";
        this.YearPattern = hasYearSymbol ? yearMonthPattern.substring(0, 7) : "yyyy";
        var yearPos = fullPattern.indexOf("yy");
        var monthPos = fullPattern.indexOf("MMMM");
        this.MonthPattern = cultureHasMonthAbbr && monthPos > -1 ? (yearPos > monthPos ? "MMM yyyy" : "yyyy MMM") : yearMonthPattern;
        this.DayPattern = cultureHasMonthAbbr ? monthDayPattern.replace("MMMM", "MMM") : monthDayPattern;
        var minutePos = fullPattern.indexOf("mm");
        var pmPos = fullPattern.indexOf("tt");
        var shortHourPattern = pmPos > -1 ? shortTimePattern.replace(":mm ", "") : shortTimePattern;
        this.HourPattern = yearPos < minutePos ? this.DayPattern + separator + shortHourPattern : shortHourPattern + separator + this.DayPattern;
        this.MinutePattern = shortTimePattern;
        this.SecondPattern = longTimePattern;
        this.MillisecondPattern = longTimePattern.replace("ss", "ss.fff");
        // Special cases
        switch (culture.name) {
            case "fi-FI":
                this.DayPattern = this.DayPattern.replace("'ta'", ""); // Fix for finish 'ta' suffix for month names.
                this.HourPattern = this.HourPattern.replace("'ta'", "");
                break;
        }
    }
    // Methods
    /**
     * Returns the format string of the provided DateTimeUnit.
     * @param unit - date or time unit
     */
    DateTimeScaleFormatInfo.prototype.getFormatString = function (unit) {
        switch (unit) {
            case iFormattingService_1.DateTimeUnit.Year:
                return this.YearPattern;
            case iFormattingService_1.DateTimeUnit.Month:
                return this.MonthPattern;
            case iFormattingService_1.DateTimeUnit.Week:
            case iFormattingService_1.DateTimeUnit.Day:
                return this.DayPattern;
            case iFormattingService_1.DateTimeUnit.Hour:
                return this.HourPattern;
            case iFormattingService_1.DateTimeUnit.Minute:
                return this.MinutePattern;
            case iFormattingService_1.DateTimeUnit.Second:
                return this.SecondPattern;
            case iFormattingService_1.DateTimeUnit.Millisecond:
                return this.MillisecondPattern;
        }
    };
    return DateTimeScaleFormatInfo;
}());
var formattingService = new FormattingService();
exports.formattingService = formattingService;
//# sourceMappingURL=formattingService.js.map

/***/ }),

/***/ 1497:
/***/ ((__unused_webpack_module, exports) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DateTimeUnit = void 0;
// Enumeration of DateTimeUnits
var DateTimeUnit;
(function (DateTimeUnit) {
    DateTimeUnit[DateTimeUnit["Year"] = 0] = "Year";
    DateTimeUnit[DateTimeUnit["Month"] = 1] = "Month";
    DateTimeUnit[DateTimeUnit["Week"] = 2] = "Week";
    DateTimeUnit[DateTimeUnit["Day"] = 3] = "Day";
    DateTimeUnit[DateTimeUnit["Hour"] = 4] = "Hour";
    DateTimeUnit[DateTimeUnit["Minute"] = 5] = "Minute";
    DateTimeUnit[DateTimeUnit["Second"] = 6] = "Second";
    DateTimeUnit[DateTimeUnit["Millisecond"] = 7] = "Millisecond";
})(DateTimeUnit = exports.DateTimeUnit || (exports.DateTimeUnit = {}));
//# sourceMappingURL=iFormattingService.js.map

/***/ }),

/***/ 5451:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCustomFormatMetadata = exports.formatWithCustomOverride = exports.format = exports.isStandardFormat = exports.canFormat = exports.getComponents = exports.hasFormatComponents = exports.addDecimalsToFormat = exports.getNumericFormat = exports.NumberFormatComponentsDelimeter = void 0;
/**
 * NumberFormat module contains the static methods for formatting the numbers.
 * It extends the Globalize functionality to support complete set of .NET
 * formatting expressions for numeric types including custom formats.
 */
/* eslint-disable no-useless-escape */
var globalize_1 = __webpack_require__(4818);
// powerbi.extensibility.utils.type
var powerbi_visuals_utils_typeutils_1 = __webpack_require__(2170);
// powerbi.extensibility.utils.formatting
var stringExtensions = __webpack_require__(7918);
var formattingEncoder = __webpack_require__(4249);
var formattingService_1 = __webpack_require__(5394);
var NumericalPlaceHolderRegex = /\{.+\}/;
var ScientificFormatRegex = /e[+-]*[0#]+/i;
var StandardFormatRegex = /^[a-z]\d{0,2}$/i; // a letter + up to 2 digits for precision specifier
var TrailingZerosRegex = /0+$/;
var DecimalFormatRegex = /\.([0#]*)/g;
var NumericFormatRegex = /[0#,\.]+[0,#]*/g;
// (?=...) is a positive lookahead assertion. The RE is asking for the last digit placeholder, [0#],
// which is followed by non-digit placeholders and the end of string, [^0#]*$. But it only matches
// the last digit placeholder, not anything that follows because the positive lookahead isn"t included
// in the match - it is only a condition.
var LastNumericPlaceholderRegex = /([0#])(?=[^0#]*$)/;
var DecimalFormatCharacter = ".";
var ZeroPlaceholder = "0";
var DigitPlaceholder = "#";
var ExponentialFormatChar = "E";
var NumericPlaceholders = [ZeroPlaceholder, DigitPlaceholder];
var NumericPlaceholderRegex = new RegExp(NumericPlaceholders.join("|"), "g");
exports.NumberFormatComponentsDelimeter = ";";
function getNonScientificFormatWithPrecision(baseFormat, numericFormat) {
    if (!numericFormat || baseFormat === undefined)
        return baseFormat;
    var newFormat = "{0:" + numericFormat + "}";
    return baseFormat.replace("{0}", newFormat);
}
function getNumericFormat(value, baseFormat) {
    if (baseFormat == null)
        return baseFormat;
    if (hasFormatComponents(baseFormat)) {
        var _a = getComponents(baseFormat), positive = _a.positive, negative = _a.negative, zero = _a.zero;
        if (value > 0)
            return getNumericFormatFromComponent(value, positive);
        else if (value === 0)
            return getNumericFormatFromComponent(value, zero);
        return getNumericFormatFromComponent(value, negative);
    }
    return getNumericFormatFromComponent(value, baseFormat);
}
exports.getNumericFormat = getNumericFormat;
function getNumericFormatFromComponent(value, format) {
    var match = powerbi_visuals_utils_typeutils_1.regExpExtensions.run(NumericFormatRegex, format);
    if (match)
        return match[0];
    return format;
}
function addDecimalsToFormat(baseFormat, decimals, trailingZeros) {
    if (decimals == null)
        return baseFormat;
    // Default format string
    if (baseFormat == null)
        baseFormat = ZeroPlaceholder;
    if (hasFormatComponents(baseFormat)) {
        var _a = getComponents(baseFormat), positive = _a.positive, negative = _a.negative, zero = _a.zero;
        var formats = [positive, negative, zero];
        for (var i = 0; i < formats.length; i++) {
            // Update format in formats array
            formats[i] = addDecimalsToFormatComponent(formats[i], decimals, trailingZeros);
        }
        return formats.join(exports.NumberFormatComponentsDelimeter);
    }
    return addDecimalsToFormatComponent(baseFormat, decimals, trailingZeros);
}
exports.addDecimalsToFormat = addDecimalsToFormat;
function addDecimalsToFormatComponent(format, decimals, trailingZeros) {
    decimals = Math.abs(decimals);
    if (decimals >= 0) {
        var literals = [];
        format = formattingEncoder.preserveLiterals(format, literals);
        var placeholder = trailingZeros ? ZeroPlaceholder : DigitPlaceholder;
        var decimalPlaceholders = stringExtensions.repeat(placeholder, Math.abs(decimals));
        var match = powerbi_visuals_utils_typeutils_1.regExpExtensions.run(DecimalFormatRegex, format);
        if (match) {
            var beforeDecimal = format.substring(0, match.index);
            var formatDecimal = format.substring(match.index + 1, match[1].length + match.index + 1);
            var afterDecimal = format.substring(match.index + match[0].length);
            if (trailingZeros)
                // Use explicit decimals argument as placeholders
                formatDecimal = decimalPlaceholders;
            else {
                var decimalChange = decimalPlaceholders.length - formatDecimal.length;
                if (decimalChange > 0)
                    // Append decimalPlaceholders to existing decimal portion of format string
                    formatDecimal = formatDecimal + decimalPlaceholders.slice(-decimalChange);
                else if (decimalChange < 0)
                    // Remove decimals from formatDecimal
                    formatDecimal = formatDecimal.slice(0, decimalChange);
            }
            if (formatDecimal.length > 0)
                formatDecimal = DecimalFormatCharacter + formatDecimal;
            format = beforeDecimal + formatDecimal + afterDecimal;
        }
        else if (decimalPlaceholders.length > 0) {
            // Replace last numeric placeholder with decimal portion
            format = format.replace(LastNumericPlaceholderRegex, "$1" + DecimalFormatCharacter + decimalPlaceholders);
        }
        if (literals.length !== 0)
            format = formattingEncoder.restoreLiterals(format, literals);
    }
    return format;
}
function hasFormatComponents(format) {
    return formattingEncoder.removeLiterals(format).indexOf(exports.NumberFormatComponentsDelimeter) !== -1;
}
exports.hasFormatComponents = hasFormatComponents;
function getComponents(format) {
    var signFormat = {
        hasNegative: false,
        positive: format,
        negative: format,
        zero: format,
    };
    // escape literals so semi-colon in a literal isn't interpreted as a delimiter
    // NOTE: OK to use the literals extracted here for all three components before since the literals are indexed.
    // For example, "'pos-lit';'neg-lit'" will get preserved as "\uE000;\uE001" and the literal array will be
    // ['pos-lit', 'neg-lit']. When the negative components is restored, its \uE001 will select the second
    // literal.
    var literals = [];
    format = formattingEncoder.preserveLiterals(format, literals);
    var signSpecificFormats = format.split(exports.NumberFormatComponentsDelimeter);
    var formatCount = signSpecificFormats.length;
    if (formatCount > 1) {
        if (literals.length !== 0)
            signSpecificFormats = signSpecificFormats.map(function (signSpecificFormat) { return formattingEncoder.restoreLiterals(signSpecificFormat, literals); });
        signFormat.hasNegative = true;
        signFormat.positive = signFormat.zero = signSpecificFormats[0];
        signFormat.negative = signSpecificFormats[1];
        if (formatCount > 2)
            signFormat.zero = signSpecificFormats[2];
    }
    return signFormat;
}
exports.getComponents = getComponents;
var _lastCustomFormatMeta;
// Evaluates if the value can be formatted using the NumberFormat
function canFormat(value) {
    return typeof (value) === "number";
}
exports.canFormat = canFormat;
function isStandardFormat(format) {
    return StandardFormatRegex.test(format);
}
exports.isStandardFormat = isStandardFormat;
// Formats the number using specified format expression and culture
function format(value, format, culture) {
    format = format || "G";
    try {
        if (isStandardFormat(format))
            return formatNumberStandard(value, format, culture);
        return formatNumberCustom(value, format, culture);
    }
    catch (e) {
        return globalize_1.Globalize.format(value, undefined, culture);
    }
}
exports.format = format;
// Performs a custom format with a value override.  Typically used for custom formats showing scaled values.
function formatWithCustomOverride(value, format, nonScientificOverrideFormat, culture) {
    return formatNumberCustom(value, format, culture, nonScientificOverrideFormat);
}
exports.formatWithCustomOverride = formatWithCustomOverride;
// Formats the number using standard format expression
function formatNumberStandard(value, format, culture) {
    var result;
    var precision = (format.length > 1 ? parseInt(format.substring(1, format.length), 10) : undefined);
    var numberFormatInfo = culture.numberFormat;
    var formatChar = format.charAt(0);
    var abs = Math.abs(value);
    switch (formatChar) {
        case "e":
        case "E":
            if (precision === undefined) {
                precision = 6;
            }
            format = "0." + stringExtensions.repeat("0", precision) + formatChar + "+000";
            result = formatNumberCustom(value, format, culture);
            break;
        case "f":
        case "F":
            result = precision !== undefined ? value.toFixed(precision) : value.toFixed(numberFormatInfo.decimals);
            result = localize(result, numberFormatInfo);
            break;
        case "g":
        case "G":
            if (abs === 0 || (1E-4 <= abs && abs < 1E15)) {
                // For the range of 0.0001 to 1,000,000,000,000,000 - use the normal form
                result = precision !== undefined ? value.toPrecision(precision) : value.toString();
            }
            else {
                // Otherwise use exponential
                // Assert that value is a number and fall back on returning value if it is not
                if (typeof (value) !== "number")
                    return String(value);
                result = precision !== undefined ? value.toExponential(precision) : value.toExponential();
                result = result.replace("e", "E");
            }
            result = localize(result, numberFormatInfo);
            break;
        case "r":
        case "R":
            result = value.toString();
            result = localize(result, numberFormatInfo);
            break;
        case "x":
        case "X":
            result = value.toString(16);
            if (formatChar === "X") {
                result = result.toUpperCase();
            }
            if (precision !== undefined) {
                var actualPrecision = result.length;
                var isNegative = value < 0;
                if (isNegative) {
                    actualPrecision--;
                }
                var paddingZerosCount = precision - actualPrecision;
                var paddingZeros = undefined;
                if (paddingZerosCount > 0) {
                    paddingZeros = stringExtensions.repeat("0", paddingZerosCount);
                }
                if (isNegative) {
                    result = "-" + paddingZeros + result.substring(1);
                }
                else {
                    result = paddingZeros + result;
                }
            }
            result = localize(result, numberFormatInfo);
            break;
        default:
            result = globalize_1.Globalize.format(value, format, culture);
    }
    return result;
}
// Formats the number using custom format expression
function formatNumberCustom(value, format, culture, nonScientificOverrideFormat) {
    var result;
    var numberFormatInfo = culture.numberFormat;
    if (isFinite(value)) {
        // Split format by positive[;negative;zero] pattern
        var formatComponents = getComponents(format);
        // Pick a format based on the sign of value
        if (value > 0) {
            format = formatComponents.positive;
        }
        else if (value === 0) {
            format = formatComponents.zero;
        }
        else {
            format = formatComponents.negative;
        }
        // Normalize value if we have an explicit negative format
        if (formatComponents.hasNegative)
            value = Math.abs(value);
        // Get format metadata
        var formatMeta = getCustomFormatMetadata(format, true /*calculatePrecision*/);
        // Preserve literals and escaped chars
        var literals = [];
        if (formatMeta.hasLiterals) {
            format = formattingEncoder.preserveLiterals(format, literals);
        }
        // Scientific format
        if (formatMeta.hasE && !nonScientificOverrideFormat) {
            var scientificMatch = powerbi_visuals_utils_typeutils_1.regExpExtensions.run(ScientificFormatRegex, format);
            if (scientificMatch) {
                // Case 2.1. Scientific custom format
                var formatM = format.substring(0, scientificMatch.index);
                var formatE = format.substring(scientificMatch.index + 2); // E(+|-)
                var precision = getCustomFormatPrecision(formatM, formatMeta);
                var scale = getCustomFormatScale(formatM, formatMeta);
                if (scale !== 1) {
                    value = value * scale;
                }
                // Assert that value is a number and fall back on returning value if it is not
                if (typeof (value) !== "number")
                    return String(value);
                var s = value.toExponential(precision);
                var indexOfE = s.indexOf("e");
                var mantissa = s.substring(0, indexOfE);
                var exp = s.substring(indexOfE + 1);
                var resultM = fuseNumberWithCustomFormat(mantissa, formatM, numberFormatInfo);
                var resultE = fuseNumberWithCustomFormat(exp, formatE, numberFormatInfo);
                if (resultE.charAt(0) === "+" && scientificMatch[0].charAt(1) !== "+") {
                    resultE = resultE.substring(1);
                }
                var e = scientificMatch[0].charAt(0);
                result = resultM + e + resultE;
            }
        }
        // Non scientific format
        if (result === undefined) {
            var valueFormatted = void 0;
            var isValueGlobalized = false;
            var precision = getCustomFormatPrecision(format, formatMeta);
            var scale = getCustomFormatScale(format, formatMeta);
            if (scale !== 1)
                value = value * scale;
            // Rounding
            value = parseFloat(toNonScientific(value, precision));
            if (!isFinite(value)) {
                // very large and small finite values can become infinite by parseFloat(toNonScientific())
                return globalize_1.Globalize.format(value, undefined);
            }
            if (nonScientificOverrideFormat) {
                // Get numeric format from format string
                var numericFormat = getNumericFormat(value, format);
                // Add separators and decimalFormat to nonScientificFormat
                nonScientificOverrideFormat = getNonScientificFormatWithPrecision(nonScientificOverrideFormat, numericFormat);
                // Format the value
                valueFormatted = formattingService_1.formattingService.format(nonScientificOverrideFormat, [value], culture.name);
                isValueGlobalized = true;
            }
            else
                valueFormatted = toNonScientific(value, precision);
            result = fuseNumberWithCustomFormat(valueFormatted, format, numberFormatInfo, nonScientificOverrideFormat, isValueGlobalized);
        }
        if (formatMeta.hasLiterals) {
            result = formattingEncoder.restoreLiterals(result, literals, false);
        }
        _lastCustomFormatMeta = formatMeta;
    }
    else {
        return globalize_1.Globalize.format(value, undefined);
    }
    return result;
}
// Returns string with the fixed point respresentation of the number
function toNonScientific(value, precision) {
    var result = "";
    var precisionZeros = 0;
    // Double precision numbers support actual 15-16 decimal digits of precision.
    if (precision > 16) {
        precisionZeros = precision - 16;
        precision = 16;
    }
    var digitsBeforeDecimalPoint = powerbi_visuals_utils_typeutils_1.double.log10(Math.abs(value));
    if (digitsBeforeDecimalPoint < 16) {
        if (digitsBeforeDecimalPoint > 0) {
            var maxPrecision = 16 - digitsBeforeDecimalPoint;
            if (precision > maxPrecision) {
                precisionZeros += precision - maxPrecision;
                precision = maxPrecision;
            }
        }
        result = value.toFixed(precision);
    }
    else if (digitsBeforeDecimalPoint === 16) {
        result = value.toFixed(0);
        precisionZeros += precision;
        if (precisionZeros > 0) {
            result += ".";
        }
    }
    else { // digitsBeforeDecimalPoint > 16
        // Different browsers have different implementations of the toFixed().
        // In IE it returns fixed format no matter what's the number. In FF and Chrome the method returns exponential format for numbers greater than 1E21.
        // So we need to check for range and convert the to exponential with the max precision.
        // Then we convert exponential string to fixed by removing the dot and padding with "power" zeros.
        // Assert that value is a number and fall back on returning value if it is not
        if (typeof (value) !== "number")
            return String(value);
        result = value.toExponential(15);
        var indexOfE = result.indexOf("e");
        if (indexOfE > 0) {
            var indexOfDot = result.indexOf(".");
            var mantissa = result.substring(0, indexOfE);
            var exp = result.substring(indexOfE + 1);
            var powerZeros = parseInt(exp, 10) - (mantissa.length - indexOfDot - 1);
            result = mantissa.replace(".", "") + stringExtensions.repeat("0", powerZeros);
            if (precision > 0) {
                result = result + "." + stringExtensions.repeat("0", precision);
            }
        }
    }
    if (precisionZeros > 0) {
        result = result + stringExtensions.repeat("0", precisionZeros);
    }
    return result;
}
/**
 * Returns the formatMetadata of the format
 * When calculating precision and scale, if format string of
 * positive[;negative;zero] => positive format will be used
 * @param (required) format - format string
 * @param (optional) calculatePrecision - calculate precision of positive format
 * @param (optional) calculateScale - calculate scale of positive format
 */
function getCustomFormatMetadata(format, calculatePrecision, calculateScale, calculatePartsPerScale) {
    if (_lastCustomFormatMeta !== undefined && format === _lastCustomFormatMeta.format) {
        return _lastCustomFormatMeta;
    }
    var literals = [];
    var escaped = formattingEncoder.preserveLiterals(format, literals);
    var result = {
        format: format,
        hasLiterals: literals.length !== 0,
        hasE: false,
        hasCommas: false,
        hasDots: false,
        hasPercent: false,
        hasPermile: false,
        precision: undefined,
        scale: undefined,
        partsPerScale: undefined,
    };
    for (var i = 0, length_1 = escaped.length; i < length_1; i++) {
        var c = escaped.charAt(i);
        switch (c) {
            case "e":
            case "E":
                result.hasE = true;
                break;
            case ",":
                result.hasCommas = true;
                break;
            case ".":
                result.hasDots = true;
                break;
            case "%":
                result.hasPercent = true;
                break;
            case "\u2030": // ‰
                result.hasPermile = true;
                break;
        }
    }
    // Use positive format for calculating these values
    var formatComponents = getComponents(format);
    if (calculatePrecision)
        result.precision = getCustomFormatPrecision(formatComponents.positive, result);
    if (calculatePartsPerScale)
        result.partsPerScale = getCustomFormatPartsPerScale(formatComponents.positive, result);
    if (calculateScale)
        result.scale = getCustomFormatScale(formatComponents.positive, result);
    return result;
}
exports.getCustomFormatMetadata = getCustomFormatMetadata;
/** Returns the decimal precision of format based on the number of # and 0 chars after the decimal point
     * Important: The input format string needs to be split to the appropriate pos/neg/zero portion to work correctly */
function getCustomFormatPrecision(format, formatMeta) {
    if (formatMeta.precision > -1) {
        return formatMeta.precision;
    }
    var result = 0;
    if (formatMeta.hasDots) {
        if (formatMeta.hasLiterals) {
            format = formattingEncoder.removeLiterals(format);
        }
        var dotIndex = format.indexOf(".");
        if (dotIndex > -1) {
            var count = format.length;
            for (var i = dotIndex; i < count; i++) {
                var char = format.charAt(i);
                if (char.match(NumericPlaceholderRegex))
                    result++;
                // 0.00E+0 :: Break before counting 0 in
                // exponential portion of format string
                if (char === ExponentialFormatChar)
                    break;
            }
            result = Math.min(19, result);
        }
    }
    formatMeta.precision = result;
    return result;
}
function getCustomFormatPartsPerScale(format, formatMeta) {
    if (formatMeta.partsPerScale != null)
        return formatMeta.partsPerScale;
    var result = 1;
    if (formatMeta.hasPercent && format.indexOf("%") > -1) {
        result = result * 100;
    }
    if (formatMeta.hasPermile && format.indexOf(/* ‰ */ "\u2030") > -1) {
        result = result * 1000;
    }
    formatMeta.partsPerScale = result;
    return result;
}
// Returns the scale factor of the format based on the "%" and scaling "," chars in the format
function getCustomFormatScale(format, formatMeta) {
    if (formatMeta.scale > -1) {
        return formatMeta.scale;
    }
    var result = getCustomFormatPartsPerScale(format, formatMeta);
    if (formatMeta.hasCommas) {
        var dotIndex = format.indexOf(".");
        if (dotIndex === -1) {
            dotIndex = format.length;
        }
        for (var i = dotIndex - 1; i > -1; i--) {
            var char = format.charAt(i);
            if (char === ",") {
                result = result / 1000;
            }
            else {
                break;
            }
        }
    }
    formatMeta.scale = result;
    return result;
}
function fuseNumberWithCustomFormat(value, format, numberFormatInfo, nonScientificOverrideFormat, isValueGlobalized) {
    var suppressModifyValue = !!nonScientificOverrideFormat;
    var formatParts = format.split(".", 2);
    if (formatParts.length === 2) {
        var wholeFormat = formatParts[0];
        var fractionFormat = formatParts[1];
        var displayUnit = "";
        // Remove display unit from value before splitting on "." as localized display units sometimes end with "."
        if (nonScientificOverrideFormat) {
            displayUnit = nonScientificOverrideFormat.replace(NumericalPlaceHolderRegex, "");
            value = value.replace(displayUnit, "");
        }
        var globalizedDecimalSeparator = numberFormatInfo["."];
        var decimalSeparator = isValueGlobalized ? globalizedDecimalSeparator : ".";
        var valueParts = value.split(decimalSeparator, 2);
        var wholeValue = valueParts.length === 1 ? valueParts[0] + displayUnit : valueParts[0];
        var fractionValue = valueParts.length === 2 ? valueParts[1] + displayUnit : "";
        fractionValue = fractionValue.replace(TrailingZerosRegex, "");
        var wholeFormattedValue = fuseNumberWithCustomFormatLeft(wholeValue, wholeFormat, numberFormatInfo, suppressModifyValue);
        var fractionFormattedValue = fuseNumberWithCustomFormatRight(fractionValue, fractionFormat, suppressModifyValue);
        if (fractionFormattedValue.fmtOnly || fractionFormattedValue.value === "")
            return wholeFormattedValue + fractionFormattedValue.value;
        return wholeFormattedValue + globalizedDecimalSeparator + fractionFormattedValue.value;
    }
    return fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue);
}
function fuseNumberWithCustomFormatLeft(value, format, numberFormatInfo, suppressModifyValue) {
    var groupSymbolIndex = format.indexOf(",");
    var enableGroups = groupSymbolIndex > -1 && groupSymbolIndex < Math.max(format.lastIndexOf("0"), format.lastIndexOf("#")) && numberFormatInfo[","];
    var groupDigitCount = 0;
    var groupIndex = 0;
    var groupSizes = numberFormatInfo.groupSizes || [3];
    var groupSize = groupSizes[0];
    var groupSeparator = numberFormatInfo[","];
    var sign = "";
    var firstChar = value.charAt(0);
    if (firstChar === "+" || firstChar === "-") {
        sign = numberFormatInfo[firstChar];
        value = value.substring(1);
    }
    var isZero = value === "0";
    var result = "";
    var leftBuffer = "";
    var vi = value.length - 1;
    var fmtOnly = true;
    // Iterate through format chars and replace 0 and # with the digits from the value string
    for (var fi = format.length - 1; fi > -1; fi--) {
        var formatChar = format.charAt(fi);
        switch (formatChar) {
            case ZeroPlaceholder:
            case DigitPlaceholder:
                fmtOnly = false;
                if (leftBuffer !== "") {
                    result = leftBuffer + result;
                    leftBuffer = "";
                }
                if (!suppressModifyValue) {
                    if (vi > -1 || formatChar === ZeroPlaceholder) {
                        if (enableGroups) {
                            // If the groups are enabled we'll need to keep track of the current group index and periodically insert group separator,
                            if (groupDigitCount === groupSize) {
                                result = groupSeparator + result;
                                groupIndex++;
                                if (groupIndex < groupSizes.length) {
                                    groupSize = groupSizes[groupIndex];
                                }
                                groupDigitCount = 1;
                            }
                            else {
                                groupDigitCount++;
                            }
                        }
                    }
                    if (vi > -1) {
                        if (isZero && formatChar === DigitPlaceholder) {
                            // Special case - if we need to format a zero value and the # symbol is used - we don't copy it into the result)
                        }
                        else {
                            result = value.charAt(vi) + result;
                        }
                        vi--;
                    }
                    else if (formatChar !== DigitPlaceholder) {
                        result = formatChar + result;
                    }
                }
                break;
            case ",":
                // We should skip all the , chars
                break;
            default:
                leftBuffer = formatChar + leftBuffer;
                break;
        }
    }
    // If the value didn't fit into the number of zeros provided in the format then we should insert the missing part of the value into the result
    if (!suppressModifyValue) {
        if (vi > -1 && result !== "") {
            if (enableGroups) {
                while (vi > -1) {
                    if (groupDigitCount === groupSize) {
                        result = groupSeparator + result;
                        groupIndex++;
                        if (groupIndex < groupSizes.length) {
                            groupSize = groupSizes[groupIndex];
                        }
                        groupDigitCount = 1;
                    }
                    else {
                        groupDigitCount++;
                    }
                    result = value.charAt(vi) + result;
                    vi--;
                }
            }
            else {
                result = value.substring(0, vi + 1) + result;
            }
        }
        // Insert sign in front of the leftBuffer and result
        return sign + leftBuffer + result;
    }
    if (fmtOnly)
        // If the format doesn't specify any digits to be displayed, then just return the format we've parsed up until now.
        return sign + leftBuffer + result;
    return sign + leftBuffer + value + result;
}
function fuseNumberWithCustomFormatRight(value, format, suppressModifyValue) {
    var formatLength = format.length;
    var valueLength = value.length;
    if (suppressModifyValue) {
        var lastChar = format.charAt(formatLength - 1);
        if (!lastChar.match(NumericPlaceholderRegex))
            return {
                value: value + lastChar,
                fmtOnly: value === "",
            };
        return {
            value: value,
            fmtOnly: value === "",
        };
    }
    var result = "", fmtOnly = true, vi = 0;
    for (var fi = 0; fi < formatLength; fi++) {
        var formatChar = format.charAt(fi);
        if (vi < valueLength) {
            switch (formatChar) {
                case ZeroPlaceholder:
                case DigitPlaceholder:
                    result += value[vi++];
                    fmtOnly = false;
                    break;
                default:
                    result += formatChar;
            }
        }
        else {
            if (formatChar !== DigitPlaceholder) {
                result += formatChar;
                fmtOnly = fmtOnly && (formatChar !== ZeroPlaceholder);
            }
        }
    }
    return {
        value: result,
        fmtOnly: fmtOnly,
    };
}
function localize(value, dictionary) {
    var plus = dictionary["+"];
    var minus = dictionary["-"];
    var dot = dictionary["."];
    var comma = dictionary[","];
    if (plus === "+" && minus === "-" && dot === "." && comma === ",") {
        return value;
    }
    var count = value.length;
    var result = "";
    for (var i = 0; i < count; i++) {
        var char = value.charAt(i);
        switch (char) {
            case "+":
                result = result + plus;
                break;
            case "-":
                result = result + minus;
                break;
            case ".":
                result = result + dot;
                break;
            case ",":
                result = result + comma;
                break;
            default:
                result = result + char;
                break;
        }
    }
    return result;
}
//# sourceMappingURL=numberFormat.js.map

/***/ }),

/***/ 4776:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_unused_export__ = exports.LZ = exports.dx = exports.Z6 = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = __webpack_unused_export__ = exports.QX = exports.yF = __webpack_unused_export__ = exports.wD = __webpack_unused_export__ = __webpack_unused_export__ = void 0;
var formatting = __webpack_require__(9297);
__webpack_unused_export__ = formatting;
var valueFormatter = __webpack_require__(9987);
exports.wD = valueFormatter;
var stringExtensions = __webpack_require__(7918);
__webpack_unused_export__ = stringExtensions;
var textMeasurementService = __webpack_require__(9246);
exports.yF = textMeasurementService;
var interfaces = __webpack_require__(6003);
__webpack_unused_export__ = interfaces;
var font = __webpack_require__(9078);
exports.LZ = font;
var familyInfo = __webpack_require__(8069);
__webpack_unused_export__ = familyInfo;
var textUtil = __webpack_require__(4158);
exports.QX = textUtil;
var dateUtils = __webpack_require__(7042);
__webpack_unused_export__ = dateUtils;
var dateTimeSequence = __webpack_require__(2594);
__webpack_unused_export__ = dateTimeSequence;
var displayUnitSystem = __webpack_require__(7254);
__webpack_unused_export__ = displayUnitSystem;
var displayUnitSystemType = __webpack_require__(6585);
exports.Z6 = displayUnitSystemType;
var formattingService = __webpack_require__(5394);
exports.dx = formattingService;
var wordBreaker = __webpack_require__(1363);
__webpack_unused_export__ = wordBreaker;
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6003:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
//# sourceMappingURL=interfaces.js.map

/***/ }),

/***/ 6116:
/***/ ((__unused_webpack_module, exports) => {


/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ephemeralStorageService = exports.EphemeralStorageService = void 0;
var EphemeralStorageService = /** @class */ (function () {
    function EphemeralStorageService(clearCacheInterval) {
        this.cache = {};
        this.clearCacheInterval = (clearCacheInterval != null)
            ? clearCacheInterval
            : EphemeralStorageService.defaultClearCacheInterval;
        this.clearCache();
    }
    EphemeralStorageService.prototype.getData = function (key) {
        return this.cache[key];
    };
    EphemeralStorageService.prototype.setData = function (key, data) {
        var _this = this;
        this.cache[key] = data;
        if (this.clearCacheTimerId == null) {
            this.clearCacheTimerId = setTimeout(function () { return _this.clearCache(); }, this.clearCacheInterval);
        }
    };
    EphemeralStorageService.prototype.clearCache = function () {
        this.cache = {};
        this.clearCacheTimerId = undefined;
    };
    EphemeralStorageService.defaultClearCacheInterval = (1000 * 60 * 60 * 24); // 1 day
    return EphemeralStorageService;
}());
exports.EphemeralStorageService = EphemeralStorageService;
exports.ephemeralStorageService = new EphemeralStorageService();
//# sourceMappingURL=ephemeralStorageService.js.map

/***/ }),

/***/ 7918:
/***/ ((__unused_webpack_module, exports) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.stripTagDelimiters = exports.deriveClsCompliantName = exports.stringifyAsPrettyJSON = exports.normalizeFileName = exports.escapeStringForRegex = exports.constructNameFromList = exports.findUniqueName = exports.ensureUniqueNames = exports.replaceAll = exports.repeat = exports.getLengthDifference = exports.trimWhitespace = exports.trimTrailingWhitespace = exports.isWhitespace = exports.containsWhitespace = exports.isNullOrUndefinedOrWhiteSpaceString = exports.isNullOrEmpty = exports.stringToArrayBuffer = exports.normalizeCase = exports.containsIgnoreCase = exports.contains = exports.startsWith = exports.startsWithIgnoreCase = exports.equalIgnoreCase = exports.format = exports.endsWith = void 0;
/* eslint-disable no-useless-escape */
var HtmlTagRegex = new RegExp("[<>]", "g");
/**
 * Checks if a string ends with a sub-string.
 */
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
exports.endsWith = endsWith;
function format() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var s = args[0];
    if (isNullOrUndefinedOrWhiteSpaceString(s))
        return s;
    for (var i = 0; i < args.length - 1; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        s = s.replace(reg, args[i + 1]);
    }
    return s;
}
exports.format = format;
/**
 * Compares two strings for equality, ignoring case.
 */
function equalIgnoreCase(a, b) {
    return normalizeCase(a) === normalizeCase(b);
}
exports.equalIgnoreCase = equalIgnoreCase;
function startsWithIgnoreCase(a, b) {
    var normalizedSearchString = normalizeCase(b);
    return normalizeCase(a).indexOf(normalizedSearchString) === 0;
}
exports.startsWithIgnoreCase = startsWithIgnoreCase;
function startsWith(a, b) {
    return a.indexOf(b) === 0;
}
exports.startsWith = startsWith;
// Determines whether a string contains a specified substring (by case-sensitive comparison).
function contains(source, substring) {
    if (source == null)
        return false;
    return source.indexOf(substring) !== -1;
}
exports.contains = contains;
// Determines whether a string contains a specified substring (while ignoring case).
function containsIgnoreCase(source, substring) {
    if (source == null)
        return false;
    return contains(normalizeCase(source), normalizeCase(substring));
}
exports.containsIgnoreCase = containsIgnoreCase;
/**
 * Normalizes case for a string.
 * Used by equalIgnoreCase method.
 */
function normalizeCase(value) {
    return value.toUpperCase();
}
exports.normalizeCase = normalizeCase;
/**
 * Receives a string and returns an ArrayBuffer of its characters.
 * @return An ArrayBuffer of the string's characters.
 * If the string is empty or null or undefined - returns null.
 */
function stringToArrayBuffer(str) {
    if (isNullOrEmpty(str)) {
        return null;
    }
    var buffer = new ArrayBuffer(str.length);
    var bufferView = new Uint8Array(buffer);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufferView[i] = str.charCodeAt(i);
    }
    return bufferView;
}
exports.stringToArrayBuffer = stringToArrayBuffer;
/**
 * Is string null or empty or undefined?
 * @return True if the value is null or undefined or empty string,
 * otherwise false.
 */
function isNullOrEmpty(value) {
    return (value == null) || (value.length === 0);
}
exports.isNullOrEmpty = isNullOrEmpty;
/**
 * Returns true if the string is null, undefined, empty, or only includes white spaces.
 * @return True if the str is null, undefined, empty, or only includes white spaces,
 * otherwise false.
 */
function isNullOrUndefinedOrWhiteSpaceString(str) {
    return isNullOrEmpty(str) || isNullOrEmpty(str.trim());
}
exports.isNullOrUndefinedOrWhiteSpaceString = isNullOrUndefinedOrWhiteSpaceString;
/**
 * Returns a value indicating whether the str contains any whitespace.
 */
function containsWhitespace(str) {
    var expr = /\s/;
    return expr.test(str);
}
exports.containsWhitespace = containsWhitespace;
/**
 * Returns a value indicating whether the str is a whitespace string.
 */
function isWhitespace(str) {
    return str.trim() === "";
}
exports.isWhitespace = isWhitespace;
/**
 * Returns the string with any trailing whitespace from str removed.
 */
function trimTrailingWhitespace(str) {
    return str.replace(/\s+$/, "");
}
exports.trimTrailingWhitespace = trimTrailingWhitespace;
/**
 * Returns the string with any leading and trailing whitespace from str removed.
 */
function trimWhitespace(str) {
    return str.replace(/^\s+/, "").replace(/\s+$/, "");
}
exports.trimWhitespace = trimWhitespace;
/**
 * Returns length difference between the two provided strings.
 */
function getLengthDifference(left, right) {
    return Math.abs(left.length - right.length);
}
exports.getLengthDifference = getLengthDifference;
/**
 * Repeat char or string several times.
 * @param char The string to repeat.
 * @param count How many times to repeat the string.
 */
function repeat(char, count) {
    var result = "";
    for (var i = 0; i < count; i++) {
        result += char;
    }
    return result;
}
exports.repeat = repeat;
/**
 * Replace all the occurrences of the textToFind in the text with the textToReplace.
 * @param text The original string.
 * @param textToFind Text to find in the original string.
 * @param textToReplace New text replacing the textToFind.
 */
function replaceAll(text, textToFind, textToReplace) {
    if (!textToFind)
        return text;
    var pattern = escapeStringForRegex(textToFind);
    return text.replace(new RegExp(pattern, "gi"), textToReplace);
}
exports.replaceAll = replaceAll;
function ensureUniqueNames(names) {
    var usedNames = {};
    // Make sure we are giving fair chance for all columns to stay with their original name
    // First we fill the used names map to contain all the original unique names from the list.
    for (var _i = 0, names_1 = names; _i < names_1.length; _i++) {
        var name_1 = names_1[_i];
        usedNames[name_1] = false;
    }
    var uniqueNames = [];
    // Now we go over all names and find a unique name for each
    for (var _a = 0, names_2 = names; _a < names_2.length; _a++) {
        var name_2 = names_2[_a];
        var uniqueName = name_2;
        // If the (original) column name is already taken lets try to find another name
        if (usedNames[uniqueName]) {
            var counter = 0;
            // Find a name that is not already in the map
            while (usedNames[uniqueName] !== undefined) {
                uniqueName = name_2 + "." + (++counter);
            }
        }
        uniqueNames.push(uniqueName);
        usedNames[uniqueName] = true;
    }
    return uniqueNames;
}
exports.ensureUniqueNames = ensureUniqueNames;
/**
 * Returns a name that is not specified in the values.
 */
function findUniqueName(usedNames, baseName) {
    // Find a unique name
    var i = 0, uniqueName = baseName;
    while (usedNames[uniqueName]) {
        uniqueName = baseName + (++i);
    }
    return uniqueName;
}
exports.findUniqueName = findUniqueName;
function constructNameFromList(list, separator, maxCharacter) {
    var labels = [];
    var exceeded;
    var length = 0;
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var item = list_1[_i];
        if (length + item.length > maxCharacter && labels.length > 0) {
            exceeded = true;
            break;
        }
        labels.push(item);
        length += item.length;
    }
    var separatorWithSpace = " " + separator + " ";
    var name = labels.join(separatorWithSpace);
    if (exceeded)
        name += separatorWithSpace + "...";
    return name;
}
exports.constructNameFromList = constructNameFromList;
function escapeStringForRegex(s) {
    return s.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1");
}
exports.escapeStringForRegex = escapeStringForRegex;
/**
 * Remove file name reserved characters <>:"/\|?* from input string.
 */
function normalizeFileName(fileName) {
    return fileName.replace(/[\<\>\:"\/\\\|\?*]/g, "");
}
exports.normalizeFileName = normalizeFileName;
/**
 * Similar to JSON.stringify, but strips away escape sequences so that the resulting
 * string is human-readable (and parsable by JSON formatting/validating tools).
 */
function stringifyAsPrettyJSON(object) {
    // let specialCharacterRemover = (key: string, value: string) => value.replace(/[^\w\s]/gi, "");
    return JSON.stringify(object /*, specialCharacterRemover*/);
}
exports.stringifyAsPrettyJSON = stringifyAsPrettyJSON;
/**
 * Derive a CLS-compliant name from a specified string.  If no allowed characters are present, return a fallback string instead.
 * (6708134): this should have a fully Unicode-aware implementation
 */
function deriveClsCompliantName(input, fallback) {
    var result = input.replace(/^[^A-Za-z]*/g, "").replace(/[ :\.\/\\\-\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]/g, "_").replace(/[\W]/g, "");
    return result.length > 0 ? result : fallback;
}
exports.deriveClsCompliantName = deriveClsCompliantName;
// Performs cheap sanitization by stripping away HTML tag (<>) characters.
function stripTagDelimiters(s) {
    return s.replace(HtmlTagRegex, "");
}
exports.stripTagDelimiters = stripTagDelimiters;
//# sourceMappingURL=stringExtensions.js.map

/***/ }),

/***/ 9246:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wordBreakOverflowingText = exports.wordBreak = exports.svgEllipsis = exports.getTailoredTextOrDefault = exports.getDivElementWidth = exports.getSvgMeasurementProperties = exports.getMeasurementProperties = exports.measureSvgTextElementWidth = exports.estimateSvgTextHeight = exports.estimateSvgTextBaselineDelta = exports.measureSvgTextHeight = exports.measureSvgTextRect = exports.measureSvgTextWidth = exports.removeSpanElement = void 0;
// powerbi.extensibility.utils.type
var powerbi_visuals_utils_typeutils_1 = __webpack_require__(2170);
// powerbi.extensibility.utils.formatting
var wordBreaker = __webpack_require__(1363);
var ephemeralStorageService_1 = __webpack_require__(6116);
var ellipsis = "...";
var spanElement;
var svgTextElement;
var canvasCtx;
var fallbackFontFamily;
/**
 * Idempotent function for adding the elements to the DOM.
 */
function ensureDOM() {
    if (spanElement) {
        return;
    }
    spanElement = document.createElement("span");
    document.body.appendChild(spanElement);
    // The style hides the svg element from the canvas, preventing canvas from scrolling down to show svg black square.
    /* eslint-disable-next-line powerbi-visuals/no-http-string */
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("height", "0");
    svgElement.setAttribute("width", "0");
    svgElement.setAttribute("position", "absolute");
    svgElement.style.top = "0px";
    svgElement.style.left = "0px";
    svgElement.style.position = "absolute";
    svgElement.style.height = "0px";
    svgElement.style.width = "0px";
    /* eslint-disable-next-line powerbi-visuals/no-http-string */
    svgTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svgElement.appendChild(svgTextElement);
    document.body.appendChild(svgElement);
    var canvasElement = document.createElement("canvas");
    canvasCtx = canvasElement.getContext("2d");
    var style = window.getComputedStyle(svgTextElement);
    if (style) {
        fallbackFontFamily = style.fontFamily;
    }
    else {
        fallbackFontFamily = "";
    }
}
/**
 * Removes spanElement from DOM.
 */
function removeSpanElement() {
    if (spanElement && spanElement.remove) {
        spanElement.remove();
    }
    spanElement = null;
}
exports.removeSpanElement = removeSpanElement;
/**
 * Measures the width of the text with the given SVG text properties.
 * @param textProperties The text properties to use for text measurement.
 * @param text The text to measure.
 */
function measureSvgTextWidth(textProperties, text) {
    ensureDOM();
    canvasCtx.font =
        (textProperties.fontStyle || "") + " " +
            (textProperties.fontVariant || "") + " " +
            (textProperties.fontWeight || "") + " " +
            textProperties.fontSize + " " +
            (textProperties.fontFamily || fallbackFontFamily);
    return canvasCtx.measureText(text || textProperties.text).width;
}
exports.measureSvgTextWidth = measureSvgTextWidth;
/**
 * Return the rect with the given SVG text properties.
 * @param textProperties The text properties to use for text measurement.
 * @param text The text to measure.
 */
function measureSvgTextRect(textProperties, text) {
    ensureDOM();
    // Removes DOM elements faster than innerHTML
    while (svgTextElement.firstChild) {
        svgTextElement.removeChild(svgTextElement.firstChild);
    }
    svgTextElement.setAttribute("style", null);
    svgTextElement.style.visibility = "hidden";
    svgTextElement.style.fontFamily = textProperties.fontFamily || fallbackFontFamily;
    svgTextElement.style.fontVariant = textProperties.fontVariant;
    svgTextElement.style.fontSize = textProperties.fontSize;
    svgTextElement.style.fontWeight = textProperties.fontWeight;
    svgTextElement.style.fontStyle = textProperties.fontStyle;
    svgTextElement.style.whiteSpace = textProperties.whiteSpace || "nowrap";
    svgTextElement.appendChild(document.createTextNode(text || textProperties.text));
    // We're expecting the browser to give a synchronous measurement here
    // We're using SVGTextElement because it works across all browsers
    return svgTextElement.getBBox();
}
exports.measureSvgTextRect = measureSvgTextRect;
/**
 * Measures the height of the text with the given SVG text properties.
 * @param textProperties The text properties to use for text measurement.
 * @param text The text to measure.
 */
function measureSvgTextHeight(textProperties, text) {
    return measureSvgTextRect(textProperties, text).height;
}
exports.measureSvgTextHeight = measureSvgTextHeight;
/**
 * Returns the text Rect with the given SVG text properties.
 * Does NOT return text width; obliterates text value
 * @param {TextProperties} textProperties - The text properties to use for text measurement
 */
function estimateSvgTextRect(textProperties) {
    var propertiesKey = textProperties.fontFamily + textProperties.fontSize;
    var rect = ephemeralStorageService_1.ephemeralStorageService.getData(propertiesKey);
    if (rect == null) {
        // To estimate we check the height of a particular character, once it is cached, subsequent
        // calls should always get the height from the cache (regardless of the text).
        var estimatedTextProperties = {
            fontFamily: textProperties.fontFamily,
            fontSize: textProperties.fontSize,
            text: "M",
        };
        rect = exports.measureSvgTextRect(estimatedTextProperties);
        // NOTE: In some cases (disconnected/hidden DOM) we may provide incorrect measurement results (zero sized bounding-box), so
        // we only store values in the cache if we are confident they are correct.
        if (rect.height > 0)
            ephemeralStorageService_1.ephemeralStorageService.setData(propertiesKey, rect);
    }
    return rect;
}
/**
 * Returns the text Rect with the given SVG text properties.
 * @param {TextProperties} textProperties - The text properties to use for text measurement
 */
function estimateSvgTextBaselineDelta(textProperties) {
    var rect = estimateSvgTextRect(textProperties);
    return rect.y + rect.height;
}
exports.estimateSvgTextBaselineDelta = estimateSvgTextBaselineDelta;
/**
 * Estimates the height of the text with the given SVG text properties.
 * @param {TextProperties} textProperties - The text properties to use for text measurement
 */
function estimateSvgTextHeight(textProperties, tightFightForNumeric) {
    if (tightFightForNumeric === void 0) { tightFightForNumeric = false; }
    var height = estimateSvgTextRect(textProperties).height;
    // replace it with new baseline calculation
    if (tightFightForNumeric)
        height *= 0.7;
    return height;
}
exports.estimateSvgTextHeight = estimateSvgTextHeight;
/**
 * Measures the width of the svgElement.
 * @param svgElement The SVGTextElement to be measured.
 */
function measureSvgTextElementWidth(svgElement) {
    return measureSvgTextWidth(getSvgMeasurementProperties(svgElement));
}
exports.measureSvgTextElementWidth = measureSvgTextElementWidth;
/**
 * Fetches the text measurement properties of the given DOM element.
 * @param element The selector for the DOM Element.
 */
function getMeasurementProperties(element) {
    var style = window.getComputedStyle(element);
    return {
        text: element.value || element.textContent,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        fontStyle: style.fontStyle,
        fontVariant: style.fontVariant,
        whiteSpace: style.whiteSpace
    };
}
exports.getMeasurementProperties = getMeasurementProperties;
/**
 * Fetches the text measurement properties of the given SVG text element.
 * @param element The SVGTextElement to be measured.
 */
function getSvgMeasurementProperties(element) {
    var style = window.getComputedStyle(element);
    if (style) {
        return {
            text: element.textContent,
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            fontStyle: style.fontStyle,
            fontVariant: style.fontVariant,
            whiteSpace: style.whiteSpace
        };
    }
    else {
        return {
            text: element.textContent,
            fontFamily: "",
            fontSize: "0",
        };
    }
}
exports.getSvgMeasurementProperties = getSvgMeasurementProperties;
/**
 * Returns the width of a div element.
 * @param element The div element.
 */
function getDivElementWidth(element) {
    var style = window.getComputedStyle(element);
    if (style)
        return style.width;
    else
        return "0";
}
exports.getDivElementWidth = getDivElementWidth;
/**
 * Compares labels text size to the available size and renders ellipses when the available size is smaller.
 * @param textProperties The text properties (including text content) to use for text measurement.
 * @param maxWidth The maximum width available for rendering the text.
 */
function getTailoredTextOrDefault(textProperties, maxWidth) {
    ensureDOM();
    var strLength = textProperties.text.length;
    if (strLength === 0) {
        return textProperties.text;
    }
    var width = measureSvgTextWidth(textProperties);
    if (width < maxWidth) {
        return textProperties.text;
    }
    // Create a copy of the textProperties so we don't modify the one that's passed in.
    var copiedTextProperties = powerbi_visuals_utils_typeutils_1.prototype.inherit(textProperties);
    // Take the properties and apply them to svgTextElement
    // Then, do the binary search to figure out the substring we want
    // Set the substring on textElement argument
    var text = copiedTextProperties.text = ellipsis + copiedTextProperties.text;
    var min = 1;
    var max = text.length;
    var i = ellipsis.length;
    while (min <= max) {
        // num | 0 prefered to Math.floor(num) for performance benefits
        i = (min + max) / 2 | 0;
        copiedTextProperties.text = text.substring(0, i);
        width = measureSvgTextWidth(copiedTextProperties);
        if (maxWidth > width) {
            min = i + 1;
        }
        else if (maxWidth < width) {
            max = i - 1;
        }
        else {
            break;
        }
    }
    // Since the search algorithm almost never finds an exact match,
    // it will pick one of the closest two, which could result in a
    // value bigger with than 'maxWidth' thus we need to go back by
    // one to guarantee a smaller width than 'maxWidth'.
    copiedTextProperties.text = text.substring(0, i);
    width = measureSvgTextWidth(copiedTextProperties);
    if (width > maxWidth) {
        i--;
    }
    return text.substring(ellipsis.length, i) + ellipsis;
}
exports.getTailoredTextOrDefault = getTailoredTextOrDefault;
/**
 * Compares labels text size to the available size and renders ellipses when the available size is smaller.
 * @param textElement The SVGTextElement containing the text to render.
 * @param maxWidth The maximum width available for rendering the text.
 */
function svgEllipsis(textElement, maxWidth) {
    var properties = getSvgMeasurementProperties(textElement);
    var originalText = properties.text;
    var tailoredText = getTailoredTextOrDefault(properties, maxWidth);
    if (originalText !== tailoredText) {
        textElement.textContent = tailoredText;
    }
}
exports.svgEllipsis = svgEllipsis;
/**
 * Word break textContent of <text> SVG element into <tspan>s
 * Each tspan will be the height of a single line of text
 * @param textElement - the SVGTextElement containing the text to wrap
 * @param maxWidth - the maximum width available
 * @param maxHeight - the maximum height available (defaults to single line)
 * @param linePadding - (optional) padding to add to line height
 */
function wordBreak(textElement, maxWidth, maxHeight, linePadding) {
    if (linePadding === void 0) { linePadding = 0; }
    var properties = getSvgMeasurementProperties(textElement);
    var height = estimateSvgTextHeight(properties) + linePadding;
    var maxNumLines = Math.max(1, Math.floor(maxHeight / height));
    // Save y of parent textElement to apply as first tspan dy
    var firstDY = textElement ? textElement.getAttribute("y") : null;
    // Store and clear text content
    var labelText = textElement ? textElement.textContent : null;
    textElement.textContent = null;
    // Append a tspan for each word broken section
    var words = wordBreaker.splitByWidth(labelText, properties, measureSvgTextWidth, maxWidth, maxNumLines);
    var fragment = document.createDocumentFragment();
    for (var i = 0, ilen = words.length; i < ilen; i++) {
        var dy = i === 0 ? firstDY : height;
        properties.text = words[i];
        /* eslint-disable-next-line powerbi-visuals/no-http-string */
        var textElement_1 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        textElement_1.setAttribute("x", "0");
        textElement_1.setAttribute("dy", dy ? dy.toString() : null);
        textElement_1.appendChild(document.createTextNode(getTailoredTextOrDefault(properties, maxWidth)));
        fragment.appendChild(textElement_1);
    }
    textElement.appendChild(fragment);
}
exports.wordBreak = wordBreak;
/**
 * Word break textContent of span element into <span>s
 * Each span will be the height of a single line of text
 * @param textElement - the element containing the text to wrap
 * @param maxWidth - the maximum width available
 * @param maxHeight - the maximum height available (defaults to single line)
 * @param linePadding - (optional) padding to add to line height
 */
function wordBreakOverflowingText(textElement, maxWidth, maxHeight, linePadding) {
    if (linePadding === void 0) { linePadding = 0; }
    var properties = getSvgMeasurementProperties(textElement);
    var height = estimateSvgTextHeight(properties) + linePadding;
    var maxNumLines = Math.max(1, Math.floor(maxHeight / height));
    // Store and clear text content
    var labelText = textElement.textContent;
    textElement.textContent = null;
    // Append a span for each word broken section
    var words = wordBreaker.splitByWidth(labelText, properties, measureSvgTextWidth, maxWidth, maxNumLines);
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < words.length; i++) {
        var span = document.createElement("span");
        span.style.overflow = "hidden";
        span.style.whiteSpace = "nowrap";
        span.style.textOverflow = "ellipsis";
        span.style.display = "block";
        span.style.width = powerbi_visuals_utils_typeutils_1.pixelConverter.toString(maxWidth);
        span.appendChild(document.createTextNode(words[i]));
        span.appendChild(document.createTextNode(getTailoredTextOrDefault(properties, maxWidth)));
        fragment.appendChild(span);
    }
    textElement.appendChild(fragment);
}
exports.wordBreakOverflowingText = wordBreakOverflowingText;
//# sourceMappingURL=textMeasurementService.js.map

/***/ }),

/***/ 4158:
/***/ ((__unused_webpack_module, exports) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.replaceSpaceWithNBSP = exports.removeEllipses = exports.removeBreakingSpaces = void 0;
/**
 * Contains functions/constants to aid in text manupilation.
 */
/**
 * Remove breaking spaces from given string and replace by none breaking space (&nbsp).
 */
function removeBreakingSpaces(str) {
    return str.toString().replace(new RegExp(" ", "g"), "&nbsp");
}
exports.removeBreakingSpaces = removeBreakingSpaces;
/**
 * Remove ellipses from a given string
 */
function removeEllipses(str) {
    return str.replace(/(…)|(\.\.\.)/g, "");
}
exports.removeEllipses = removeEllipses;
/**
* Replace every whitespace (0x20) with Non-Breaking Space (0xA0)
    * @param {string} txt String to replace White spaces
    * @returns Text after replcing white spaces
    */
function replaceSpaceWithNBSP(txt) {
    if (txt != null) {
        return txt.replace(/ /g, "\xA0");
    }
}
exports.replaceSpaceWithNBSP = replaceSpaceWithNBSP;
//# sourceMappingURL=textUtil.js.map

/***/ }),

/***/ 9987:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.calculateExactDigitsPrecision = exports.getDisplayUnits = exports.formatListOr = exports.formatListAnd = exports.getFormatStringByColumn = exports.getFormatString = exports.createDisplayUnitSystem = exports.formatVariantMeasureValue = exports.format = exports.create = exports.checkValueInBounds = exports.createDefaultFormatter = exports.setLocaleOptions = exports.getFormatMetadata = exports.getLocalizedString = exports.DefaultDateFormat = exports.DefaultNumericFormat = exports.DefaultIntegerFormat = void 0;
var displayUnitSystem_1 = __webpack_require__(7254);
var displayUnitSystemType_1 = __webpack_require__(6585);
var stringExtensions = __webpack_require__(7918);
var formattingService_1 = __webpack_require__(5394);
var dateTimeSequence_1 = __webpack_require__(2594);
var powerbi_visuals_utils_typeutils_1 = __webpack_require__(2170);
var powerbi_visuals_utils_dataviewutils_1 = __webpack_require__(1706);
// powerbi.extensibility.utils.type
var ValueType = powerbi_visuals_utils_typeutils_1.valueType.ValueType;
var PrimitiveType = powerbi_visuals_utils_typeutils_1.valueType.PrimitiveType;
var StringExtensions = stringExtensions;
var BeautifiedFormat = {
    "0.00 %;-0.00 %;0.00 %": "Percentage",
    "0.0 %;-0.0 %;0.0 %": "Percentage1",
};
exports.DefaultIntegerFormat = "g";
exports.DefaultNumericFormat = "#,0.00";
exports.DefaultDateFormat = "d";
var defaultLocalizedStrings = {
    "NullValue": "(Blank)",
    "BooleanTrue": "True",
    "BooleanFalse": "False",
    "NaNValue": "NaN",
    "InfinityValue": "+Infinity",
    "NegativeInfinityValue": "-Infinity",
    "RestatementComma": "{0}, {1}",
    "RestatementCompoundAnd": "{0} and {1}",
    "RestatementCompoundOr": "{0} or {1}",
    "DisplayUnitSystem_EAuto_Title": "Auto",
    "DisplayUnitSystem_E0_Title": "None",
    "DisplayUnitSystem_E3_LabelFormat": "{0}K",
    "DisplayUnitSystem_E3_Title": "Thousands",
    "DisplayUnitSystem_E6_LabelFormat": "{0}M",
    "DisplayUnitSystem_E6_Title": "Millions",
    "DisplayUnitSystem_E9_LabelFormat": "{0}bn",
    "DisplayUnitSystem_E9_Title": "Billions",
    "DisplayUnitSystem_E12_LabelFormat": "{0}T",
    "DisplayUnitSystem_E12_Title": "Trillions",
    "Percentage": "#,0.##%",
    "Percentage1": "#,0.#%",
    "TableTotalLabel": "Total",
    "Tooltip_HighlightedValueDisplayName": "Highlighted",
    "Funnel_PercentOfFirst": "Percent of first",
    "Funnel_PercentOfPrevious": "Percent of previous",
    "Funnel_PercentOfFirst_Highlight": "Percent of first (highlighted)",
    "Funnel_PercentOfPrevious_Highlight": "Percent of previous (highlighted)",
    // Geotagging strings
    "GeotaggingString_Continent": "continent",
    "GeotaggingString_Continents": "continents",
    "GeotaggingString_Country": "country",
    "GeotaggingString_Countries": "countries",
    "GeotaggingString_State": "state",
    "GeotaggingString_States": "states",
    "GeotaggingString_City": "city",
    "GeotaggingString_Cities": "cities",
    "GeotaggingString_Town": "town",
    "GeotaggingString_Towns": "towns",
    "GeotaggingString_Province": "province",
    "GeotaggingString_Provinces": "provinces",
    "GeotaggingString_County": "county",
    "GeotaggingString_Counties": "counties",
    "GeotaggingString_Village": "village",
    "GeotaggingString_Villages": "villages",
    "GeotaggingString_Post": "post",
    "GeotaggingString_Zip": "zip",
    "GeotaggingString_Code": "code",
    "GeotaggingString_Place": "place",
    "GeotaggingString_Places": "places",
    "GeotaggingString_Address": "address",
    "GeotaggingString_Addresses": "addresses",
    "GeotaggingString_Street": "street",
    "GeotaggingString_Streets": "streets",
    "GeotaggingString_Longitude": "longitude",
    "GeotaggingString_Longitude_Short": "lon",
    "GeotaggingString_Longitude_Short2": "long",
    "GeotaggingString_Latitude": "latitude",
    "GeotaggingString_Latitude_Short": "lat",
    "GeotaggingString_PostalCode": "postal code",
    "GeotaggingString_PostalCodes": "postal codes",
    "GeotaggingString_ZipCode": "zip code",
    "GeotaggingString_ZipCodes": "zip codes",
    "GeotaggingString_Territory": "territory",
    "GeotaggingString_Territories": "territories",
};
function beautify(format) {
    var key = BeautifiedFormat[format];
    if (key)
        return defaultLocalizedStrings[key] || format;
    return format;
}
function describeUnit(exponent) {
    var exponentLookup = (exponent === -1) ? "Auto" : exponent.toString();
    var title = defaultLocalizedStrings["DisplayUnitSystem_E" + exponentLookup + "_Title"];
    var format = (exponent <= 0) ? "{0}" : defaultLocalizedStrings["DisplayUnitSystem_E" + exponentLookup + "_LabelFormat"];
    if (title || format)
        return { title: title, format: format };
}
function getLocalizedString(stringId) {
    return defaultLocalizedStrings[stringId];
}
exports.getLocalizedString = getLocalizedString;
// NOTE: Define default locale options, but these can be overriden by setLocaleOptions.
var localizationOptions = {
    nullValue: defaultLocalizedStrings["NullValue"],
    trueValue: defaultLocalizedStrings["BooleanTrue"],
    falseValue: defaultLocalizedStrings["BooleanFalse"],
    NaN: defaultLocalizedStrings["NaNValue"],
    infinity: defaultLocalizedStrings["InfinityValue"],
    negativeInfinity: defaultLocalizedStrings["NegativeInfinityValue"],
    beautify: function (format) { return beautify(format); },
    describe: function (exponent) { return describeUnit(exponent); },
    restatementComma: defaultLocalizedStrings["RestatementComma"],
    restatementCompoundAnd: defaultLocalizedStrings["RestatementCompoundAnd"],
    restatementCompoundOr: defaultLocalizedStrings["RestatementCompoundOr"],
};
var MaxScaledDecimalPlaces = 2;
var MaxValueForDisplayUnitRounding = 1000;
var MinIntegerValueForDisplayUnits = 10000;
var MinPrecisionForDisplayUnits = 2;
var DateTimeMetadataColumn = {
    displayName: "",
    type: ValueType.fromPrimitiveTypeAndCategory(PrimitiveType.DateTime),
};
function getFormatMetadata(format) {
    return formattingService_1.numberFormat.getCustomFormatMetadata(format);
}
exports.getFormatMetadata = getFormatMetadata;
function setLocaleOptions(options) {
    localizationOptions = options;
    displayUnitSystem_1.DefaultDisplayUnitSystem.RESET();
    displayUnitSystem_1.WholeUnitsDisplayUnitSystem.RESET();
}
exports.setLocaleOptions = setLocaleOptions;
function createDefaultFormatter(formatString, allowFormatBeautification, cultureSelector) {
    var formatBeautified = allowFormatBeautification
        ? localizationOptions.beautify(formatString)
        : formatString;
    return {
        format: function (value) {
            if (value == null) {
                return localizationOptions.nullValue;
            }
            return formatCore({
                value: value,
                cultureSelector: cultureSelector,
                format: formatBeautified
            });
        }
    };
}
exports.createDefaultFormatter = createDefaultFormatter;
/**
 * Check that provided value is in provided bounds. If not -- replace it by minimal or maximal replacement value
 * @param targetNum checking value
 * @param min minimal bound of value
 * @param max maximal bound of value
 * @param lessMinReplacement value that will be returned if checking value is lesser than minimal
 * @param greaterMaxReplacement value that will be returned if checking value is greater than maximal
 */
function checkValueInBounds(targetNum, min, max, lessMinReplacement, greaterMaxReplacement) {
    if (lessMinReplacement === void 0) { lessMinReplacement = min; }
    if (greaterMaxReplacement === void 0) { greaterMaxReplacement = max; }
    if (max !== undefined && max !== null) {
        targetNum = targetNum <= max ? targetNum : greaterMaxReplacement;
    }
    if (min !== undefined && min !== null) {
        targetNum = targetNum > min ? targetNum : lessMinReplacement;
    }
    return targetNum;
}
exports.checkValueInBounds = checkValueInBounds;
// Creates an IValueFormatter to be used for a range of values.
function create(options) {
    var format = options.allowFormatBeautification
        ? localizationOptions.beautify(options.format)
        : options.format;
    var cultureSelector = options.cultureSelector;
    if (shouldUseNumericDisplayUnits(options)) {
        var displayUnitSystem_2 = createDisplayUnitSystem(options.displayUnitSystemType);
        var singleValueFormattingMode_1 = !!options.formatSingleValues;
        displayUnitSystem_2.update(Math.max(Math.abs(options.value || 0), Math.abs(options.value2 || 0)));
        var forcePrecision_1 = options.precision != null;
        var decimals_1;
        if (forcePrecision_1)
            decimals_1 = -options.precision;
        else if (displayUnitSystem_2.displayUnit && displayUnitSystem_2.displayUnit.value > 1)
            decimals_1 = -MaxScaledDecimalPlaces;
        return {
            format: function (value) {
                var formattedValue = getStringFormat(value, true /*nullsAreBlank*/);
                if (!StringExtensions.isNullOrUndefinedOrWhiteSpaceString(formattedValue)) {
                    return formattedValue;
                }
                // Round to Double.DEFAULT_PRECISION
                if (value
                    && !displayUnitSystem_2.isScalingUnit()
                    && Math.abs(value) < MaxValueForDisplayUnitRounding
                    && !forcePrecision_1) {
                    value = powerbi_visuals_utils_typeutils_1.double.roundToPrecision(value);
                }
                if (singleValueFormattingMode_1) {
                    return displayUnitSystem_2.formatSingleValue(value, format, decimals_1, forcePrecision_1, cultureSelector);
                }
                else {
                    return displayUnitSystem_2.format(value, format, decimals_1, forcePrecision_1, cultureSelector);
                }
            },
            displayUnit: displayUnitSystem_2.displayUnit,
            options: options
        };
    }
    if (shouldUseDateUnits(options.value, options.value2, options.tickCount)) {
        var unit_1 = dateTimeSequence_1.DateTimeSequence.GET_INTERVAL_UNIT(options.value /* minDate */, options.value2 /* maxDate */, options.tickCount);
        return {
            format: function (value) {
                if (value == null) {
                    return localizationOptions.nullValue;
                }
                var formatString = formattingService_1.formattingService.dateFormatString(unit_1);
                return formatCore({
                    value: value,
                    cultureSelector: cultureSelector,
                    format: formatString,
                });
            },
            options: options
        };
    }
    return createDefaultFormatter(format, false, cultureSelector);
}
exports.create = create;
function format(value, format, allowFormatBeautification, cultureSelector) {
    if (value == null) {
        return localizationOptions.nullValue;
    }
    var formatString = allowFormatBeautification
        ? localizationOptions.beautify(format)
        : format;
    return formatCore({
        value: value,
        cultureSelector: cultureSelector,
        format: formatString
    });
}
exports.format = format;
/**
 * Value formatting function to handle variant measures.
 * For a Date/Time value within a non-date/time field, it's formatted with the default date/time formatString instead of as a number
 * @param {any} value Value to be formatted
 * @param {DataViewMetadataColumn} column Field which the value belongs to
 * @param {DataViewObjectPropertyIdentifier} formatStringProp formatString Property ID
 * @param {boolean} nullsAreBlank? Whether to show "(Blank)" instead of empty string for null values
 * @returns Formatted value
 */
function formatVariantMeasureValue(value, column, formatStringProp, nullsAreBlank, cultureSelector) {
    // If column type is not datetime, but the value is of time datetime,
    // then use the default date format string
    if (!(column && column.type && column.type.dateTime) && value instanceof Date) {
        var valueFormat = getFormatString(DateTimeMetadataColumn, null, false);
        return formatCore({
            value: value,
            nullsAreBlank: nullsAreBlank,
            cultureSelector: cultureSelector,
            format: valueFormat
        });
    }
    else {
        var valueFormat = getFormatString(column, formatStringProp);
        return formatCore({
            value: value,
            nullsAreBlank: nullsAreBlank,
            cultureSelector: cultureSelector,
            format: valueFormat
        });
    }
}
exports.formatVariantMeasureValue = formatVariantMeasureValue;
function createDisplayUnitSystem(displayUnitSystemType) {
    if (displayUnitSystemType == null)
        return new displayUnitSystem_1.DefaultDisplayUnitSystem(localizationOptions.describe);
    switch (displayUnitSystemType) {
        case displayUnitSystemType_1.DisplayUnitSystemType.Default:
            return new displayUnitSystem_1.DefaultDisplayUnitSystem(localizationOptions.describe);
        case displayUnitSystemType_1.DisplayUnitSystemType.WholeUnits:
            return new displayUnitSystem_1.WholeUnitsDisplayUnitSystem(localizationOptions.describe);
        case displayUnitSystemType_1.DisplayUnitSystemType.Verbose:
            return new displayUnitSystem_1.NoDisplayUnitSystem();
        case displayUnitSystemType_1.DisplayUnitSystemType.DataLabels:
            return new displayUnitSystem_1.DataLabelsDisplayUnitSystem(localizationOptions.describe);
        default:
            return new displayUnitSystem_1.DefaultDisplayUnitSystem(localizationOptions.describe);
    }
}
exports.createDisplayUnitSystem = createDisplayUnitSystem;
function shouldUseNumericDisplayUnits(options) {
    var value = options.value;
    var value2 = options.value2;
    var format = options.format;
    // For singleValue visuals like card, gauge we don't want to roundoff data to the nearest thousands so format the whole number / integers below 10K to not use display units
    if (options.formatSingleValues && format) {
        if (Math.abs(value) < MinIntegerValueForDisplayUnits) {
            var isCustomFormat = !formattingService_1.numberFormat.isStandardFormat(format);
            if (isCustomFormat) {
                var precision = formattingService_1.numberFormat.getCustomFormatMetadata(format, true /*calculatePrecision*/).precision;
                if (precision < MinPrecisionForDisplayUnits)
                    return false;
            }
            else if (powerbi_visuals_utils_typeutils_1.double.isInteger(value))
                return false;
        }
    }
    if ((typeof value === "number") || (typeof value2 === "number")) {
        return true;
    }
}
function shouldUseDateUnits(value, value2, tickCount) {
    // must check both value and value2 because we'll need to get an interval for date units
    return (value instanceof Date) && (value2 instanceof Date) && (tickCount !== undefined && tickCount !== null);
}
/*
    * Get the column format. Order of precendence is:
    *  1. Column format
    *  2. Default PowerView policy for column type
    */
function getFormatString(column, formatStringProperty, suppressTypeFallback) {
    if (column) {
        if (formatStringProperty) {
            var propertyValue = powerbi_visuals_utils_dataviewutils_1.dataViewObjects.getValue(column.objects, formatStringProperty);
            if (propertyValue)
                return propertyValue;
        }
        if (!suppressTypeFallback) {
            var columnType = column.type;
            if (columnType) {
                if (columnType.dateTime)
                    return exports.DefaultDateFormat;
                if (columnType.integer) {
                    if (columnType.temporal && columnType.temporal.year)
                        return "0";
                    return exports.DefaultIntegerFormat;
                }
                if (columnType.numeric)
                    return exports.DefaultNumericFormat;
            }
        }
    }
}
exports.getFormatString = getFormatString;
function getFormatStringByColumn(column, suppressTypeFallback) {
    if (column) {
        if (column.format) {
            return column.format;
        }
        if (!suppressTypeFallback) {
            var columnType = column.type;
            if (columnType) {
                if (columnType.dateTime) {
                    return exports.DefaultDateFormat;
                }
                if (columnType.integer) {
                    if (columnType.temporal && columnType.temporal.year) {
                        return "0";
                    }
                    return exports.DefaultIntegerFormat;
                }
                if (columnType.numeric) {
                    return exports.DefaultNumericFormat;
                }
            }
        }
    }
    return undefined;
}
exports.getFormatStringByColumn = getFormatStringByColumn;
function formatListCompound(strings, conjunction) {
    var result;
    if (!strings) {
        return null;
    }
    var length = strings.length;
    if (length > 0) {
        result = strings[0];
        var lastIndex = length - 1;
        for (var i = 1, len = lastIndex; i < len; i++) {
            var value = strings[i];
            result = StringExtensions.format(localizationOptions.restatementComma, result, value);
        }
        if (length > 1) {
            var value = strings[lastIndex];
            result = StringExtensions.format(conjunction, result, value);
        }
    }
    else {
        result = null;
    }
    return result;
}
// The returned string will look like 'A, B, ..., and C'
function formatListAnd(strings) {
    return formatListCompound(strings, localizationOptions.restatementCompoundAnd);
}
exports.formatListAnd = formatListAnd;
// The returned string will look like 'A, B, ..., or C'
function formatListOr(strings) {
    return formatListCompound(strings, localizationOptions.restatementCompoundOr);
}
exports.formatListOr = formatListOr;
function formatCore(options) {
    var value = options.value, format = options.format, nullsAreBlank = options.nullsAreBlank, cultureSelector = options.cultureSelector;
    var formattedValue = getStringFormat(value, nullsAreBlank ? nullsAreBlank : false);
    if (!StringExtensions.isNullOrUndefinedOrWhiteSpaceString(formattedValue)) {
        return formattedValue;
    }
    return formattingService_1.formattingService.formatValue(value, format, cultureSelector);
}
function getStringFormat(value, nullsAreBlank) {
    if (value == null && nullsAreBlank) {
        return localizationOptions.nullValue;
    }
    if (value === true) {
        return localizationOptions.trueValue;
    }
    if (value === false) {
        return localizationOptions.falseValue;
    }
    if (typeof value === "number" && isNaN(value)) {
        return localizationOptions.NaN;
    }
    if (value === Number.NEGATIVE_INFINITY) {
        return localizationOptions.negativeInfinity;
    }
    if (value === Number.POSITIVE_INFINITY) {
        return localizationOptions.infinity;
    }
    return "";
}
function getDisplayUnits(displayUnitSystemType) {
    var displayUnitSystem = createDisplayUnitSystem(displayUnitSystemType);
    return displayUnitSystem.units;
}
exports.getDisplayUnits = getDisplayUnits;
/**
 * Precision calculating function to build values showing minimum 3 digits as 3.56 or 25.7 or 754 or 2345
 * @param {number} inputValue Value to be basement for precision calculation
 * @param {string} format Format that will be used for value formatting (to detect percentage values)
 * @param {number} displayUnits Dispaly units that will be used for value formatting (to correctly calculate precision)
 * @param {number} digitsNum Number of visible digits, including digits before separator
 * @returns calculated precision
 */
function calculateExactDigitsPrecision(inputValue, format, displayUnits, digitsNum) {
    if (!inputValue && inputValue !== 0) {
        return 0;
    }
    var precision = 0;
    var inPercent = format && format.indexOf("%") !== -1;
    var value = inPercent ? inputValue * 100 : inputValue;
    value = displayUnits > 0 ? value / displayUnits : value;
    var leftPartLength = parseInt(value).toString().length;
    if ((inPercent || displayUnits > 0) && leftPartLength >= digitsNum) {
        return 0;
    }
    // Auto units, calculate final value 
    if (displayUnits === 0) {
        var unitsDegree = Math.floor(leftPartLength / 3);
        unitsDegree = leftPartLength % 3 === 0 ? unitsDegree - 1 : unitsDegree;
        var divider = Math.pow(1000, unitsDegree);
        if (divider > 0) {
            value = value / divider;
        }
    }
    leftPartLength = parseInt(value).toString().length;
    var restOfDiv = leftPartLength % digitsNum;
    if (restOfDiv === 0) {
        precision = 0;
    }
    else {
        precision = digitsNum - restOfDiv;
    }
    return precision;
}
exports.calculateExactDigitsPrecision = calculateExactDigitsPrecision;
//# sourceMappingURL=valueFormatter.js.map

/***/ }),

/***/ 1363:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.splitByWidth = exports.getMaxWordWidth = exports.wordCount = exports.hasBreakers = exports.find = void 0;
var SPACE = " ";
var BREAKERS_REGEX = /[\s\n]+/g;
function search(index, content, backward) {
    if (backward) {
        for (var i = index - 1; i > -1; i--) {
            if (hasBreakers(content[i]))
                return i + 1;
        }
    }
    else {
        for (var i = index, ilen = content.length; i < ilen; i++) {
            if (hasBreakers(content[i]))
                return i;
        }
    }
    return backward ? 0 : content.length;
}
/**
 * Find the word nearest the cursor specified within content
 * @param index - point within content to search forward/backward from
 * @param content - string to search
*/
function find(index, content) {
    var result = { start: 0, end: 0 };
    if (content.length === 0) {
        return result;
    }
    result.start = search(index, content, true);
    result.end = search(index, content, false);
    return result;
}
exports.find = find;
/**
 * Test for presence of breakers within content
 * @param content - string to test
*/
function hasBreakers(content) {
    BREAKERS_REGEX.lastIndex = 0;
    return BREAKERS_REGEX.test(content);
}
exports.hasBreakers = hasBreakers;
/**
 * Count the number of pieces when broken by BREAKERS_REGEX
 * ~2.7x faster than WordBreaker.split(content).length
 * @param content - string to break and count
*/
function wordCount(content) {
    var count = 1;
    BREAKERS_REGEX.lastIndex = 0;
    BREAKERS_REGEX.exec(content);
    while (BREAKERS_REGEX.lastIndex !== 0) {
        count++;
        BREAKERS_REGEX.exec(content);
    }
    return count;
}
exports.wordCount = wordCount;
function getMaxWordWidth(content, textWidthMeasurer, properties) {
    var words = split(content);
    var maxWidth = 0;
    for (var _i = 0, words_1 = words; _i < words_1.length; _i++) {
        var w = words_1[_i];
        properties.text = w;
        maxWidth = Math.max(maxWidth, textWidthMeasurer(properties));
    }
    return maxWidth;
}
exports.getMaxWordWidth = getMaxWordWidth;
function split(content) {
    return content.split(BREAKERS_REGEX);
}
function getWidth(content, properties, textWidthMeasurer) {
    properties.text = content;
    return textWidthMeasurer(properties);
}
function truncate(content, properties, truncator, maxWidth) {
    properties.text = content;
    return truncator(properties, maxWidth);
}
/**
 * Split content by breakers (words) and greedy fit as many words
 * into each index in the result based on max width and number of lines
 * e.g. Each index in result corresponds to a line of content
 *      when used by AxisHelper.LabelLayoutStrategy.wordBreak
 * @param content - string to split
 * @param properties - text properties to be used by @param:textWidthMeasurer
 * @param textWidthMeasurer - function to calculate width of given text content
 * @param maxWidth - maximum allowed width of text content in each result
 * @param maxNumLines - maximum number of results we will allow, valid values must be greater than 0
 * @param truncator - (optional) if specified, used as a function to truncate content to a given width
*/
function splitByWidth(content, properties, textWidthMeasurer, maxWidth, maxNumLines, truncator) {
    // Default truncator returns string as-is
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    truncator = truncator ? truncator : function (properties, maxWidth) { return properties.text; };
    var result = [];
    var words = split(content);
    var usedWidth = 0;
    var wordsInLine = [];
    for (var _i = 0, words_2 = words; _i < words_2.length; _i++) {
        var word = words_2[_i];
        // Last line? Just add whatever is left
        if ((maxNumLines > 0) && (result.length >= maxNumLines - 1)) {
            wordsInLine.push(word);
            continue;
        }
        // Determine width if we add this word
        // Account for SPACE we will add when joining...
        var wordWidth = wordsInLine.length === 0
            ? getWidth(word, properties, textWidthMeasurer)
            : getWidth(SPACE + word, properties, textWidthMeasurer);
        // If width would exceed max width,
        // then push used words and start new split result
        if (usedWidth + wordWidth > maxWidth) {
            // Word alone exceeds max width, just add it.
            if (wordsInLine.length === 0) {
                result.push(truncate(word, properties, truncator, maxWidth));
                usedWidth = 0;
                wordsInLine = [];
                continue;
            }
            result.push(truncate(wordsInLine.join(SPACE), properties, truncator, maxWidth));
            usedWidth = 0;
            wordsInLine = [];
        }
        // ...otherwise, add word and continue
        wordsInLine.push(word);
        usedWidth += wordWidth;
    }
    // Push remaining words onto result (if any)
    if (wordsInLine && wordsInLine.length) {
        result.push(truncate(wordsInLine.join(SPACE), properties, truncator, maxWidth));
    }
    return result;
}
exports.splitByWidth = splitByWidth;
//# sourceMappingURL=wordBreaker.js.map

/***/ }),

/***/ 9406:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EX: () => (/* binding */ appendClearCatcher),
/* harmony export */   G6: () => (/* binding */ dataHasSelection),
/* harmony export */   H_: () => (/* binding */ InteractivityBaseService)
/* harmony export */ });
/* unused harmony export FilterAction */
var FilterAction;
(function (FilterAction) {
    FilterAction[FilterAction["merge"] = 0] = "merge";
    FilterAction[FilterAction["remove"] = 1] = "remove";
})(FilterAction || (FilterAction = {}));
/**
* Creates a clear an svg rect to catch clear clicks.
*/
function appendClearCatcher(selection) {
    return selection
        .append("rect")
        .classed("clearCatcher", true)
        .attr("width", "100%")
        .attr("height", "100%");
}
function dataHasSelection(data) {
    for (let i = 0, ilen = data.length; i < ilen; i++) {
        if (data[i].selected) {
            return true;
        }
    }
    return false;
}
class InteractivityBaseService {
    constructor() {
        // References
        /* eslint-disable @typescript-eslint/no-empty-function */
        this.renderSelectionInVisual = () => { };
        this.renderSelectionInLegend = () => { };
        this.renderSelectionInLabels = () => { };
        /* eslint-enable @typescript-eslint/no-empty-function */
        // Selection state
        this.isInvertedSelectionMode = false;
    }
    // IInteractivityService Implementation
    //  Binds the visual to the interactivityService
    bind(options) {
        // Bind the data
        if (options.interactivityServiceOptions && options.interactivityServiceOptions.overrideSelectionFromData) {
            // Override selection state from data points if needed
            this.takeSelectionStateFromDataPoints(options.dataPoints);
        }
        if (options.interactivityServiceOptions) {
            if (options.interactivityServiceOptions.isLegend) {
                // Bind to legend data instead of normal data if isLegend
                this.selectableLegendDataPoints = options.dataPoints;
                this.renderSelectionInLegend = () => options.behavior.renderSelection(this.legendHasSelection());
            }
            else if (options.interactivityServiceOptions.isLabels) {
                // Bind to label data instead of normal data if isLabels
                this.selectableLabelsDataPoints = options.dataPoints;
                this.renderSelectionInLabels = () => options.behavior.renderSelection(this.labelsHasSelection());
            }
            else {
                this.selectableDataPoints = options.dataPoints;
                this.renderSelectionInVisual = () => options.behavior.renderSelection(this.hasSelection());
            }
        }
        else {
            this.selectableDataPoints = options.dataPoints;
            this.renderSelectionInVisual = () => options.behavior.renderSelection(this.hasSelection());
        }
        options.behavior.bindEvents(options, this);
        // Sync data points with current selection state
        this.syncSelectionState();
    }
    /**
     * Sets the selected state of all selectable data points to false and invokes the behavior's select command.
     */
    clearSelection() {
        this.applyToAllSelectableDataPoints((dataPoint) => dataPoint.selected = false);
        this.renderAll();
    }
    legendHasSelection() {
        return this.selectableLegendDataPoints ? dataHasSelection(this.selectableLegendDataPoints) : false;
    }
    labelsHasSelection() {
        return this.selectableLabelsDataPoints ? dataHasSelection(this.selectableLabelsDataPoints) : false;
    }
    isSelectionModeInverted() {
        return this.isInvertedSelectionMode;
    }
    handleSelection(dataPoints, multiSelect) {
        if (!dataPoints) {
            return;
        }
        this.select(dataPoints, multiSelect);
        this.sendSelectionToHost();
        this.renderAll();
    }
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    handleContextMenu(dataPoint, point) {
        // don't need to handle context menu here.
        // see InteractivitySelectionService class
        return;
    }
    handleClearSelection() {
        this.clearSelection();
        this.sendSelectionToHost();
    }
    renderAll() {
        this.renderSelectionInVisual();
        this.renderSelectionInLegend();
        this.renderSelectionInLabels();
    }
    applyToAllSelectableDataPoints(action) {
        const selectableDataPoints = this.selectableDataPoints;
        const selectableLegendDataPoints = this.selectableLegendDataPoints;
        const selectableLabelsDataPoints = this.selectableLabelsDataPoints;
        if (selectableDataPoints) {
            for (const dataPoint of selectableDataPoints) {
                action(dataPoint);
            }
        }
        if (selectableLegendDataPoints) {
            for (const dataPoint of selectableLegendDataPoints) {
                action(dataPoint);
            }
        }
        if (selectableLabelsDataPoints) {
            for (const dataPoint of selectableLabelsDataPoints) {
                action(dataPoint);
            }
        }
    }
}
//# sourceMappingURL=interactivityBaseService.js.map

/***/ }),

/***/ 8482:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   L: () => (/* binding */ createInteractivitySelectionService)
/* harmony export */ });
/* unused harmony export InteractivitySelectionService */
/* harmony import */ var powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1085);
/* harmony import */ var _interactivityBaseService__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9406);
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
// powerbi.extensibility.utils.type


class InteractivitySelectionService extends _interactivityBaseService__WEBPACK_IMPORTED_MODULE_0__/* .InteractivityBaseService */ .H_ {
    constructor(hostServices) {
        super();
        this.selectionManager = hostServices.createSelectionManager();
        if (this.selectionManager.registerOnSelectCallback) {
            // when selecton was updated on Power BI side need to display actual selection state on the visual
            this.selectionManager.registerOnSelectCallback(() => {
                this.restoreSelection();
            });
        }
    }
    /**
     * Sets the selected state of all selectable data points to false and invokes the behavior's select command.
     */
    clearSelection() {
        this.selectionManager.clear();
        super.clearSelection();
    }
    handleContextMenu(dataPoint, point) {
        this.selectionManager.showContextMenu(dataPoint && dataPoint.identity ? dataPoint.identity : {}, point);
    }
    applySelectionStateToData(dataPoints, hasHighlights) {
        if (hasHighlights && this.hasSelection()) {
            this.selectionManager.clear();
        }
        const selectedIds = this.selectionManager.getSelectionIds();
        for (const dataPoint of dataPoints) {
            dataPoint.selected = this.isDataPointSelected(dataPoint, selectedIds);
        }
        return this.hasSelection();
    }
    /**
     * Apply new selections to change internal state of interactivity service
     */
    restoreSelection() {
        // syncSelectionState gets actual selectedIds
        // from selection manager and updates selectable datapoints state to correspond state
        this.syncSelectionState();
        // render new state of selection
        this.renderAll();
    }
    /**
     * Checks whether there is at least one item selected.
     */
    hasSelection() {
        return this.selectionManager.getSelectionIds().length > 0;
    }
    /**
     * Syncs the selection state for all data points that have the same category. Returns
     * true if the selection state was out of sync and corrections were made; false if
     * the data is already in sync with the service.
     *
     * If the data is not compatible with the current service's current selection state,
     * the state is cleared and the cleared selection is sent to the host.
     *
     * Ignores series for now, since we don't support series selection at the moment.
     */
    syncSelectionState() {
        if (this.isInvertedSelectionMode) {
            return this.syncSelectionStateInverted();
        }
        if (!this.selectableDataPoints && !this.selectableLegendDataPoints) {
            return;
        }
        // get current state of selections from selection manager
        const selectedIds = this.selectionManager.getSelectionIds();
        if (this.selectableDataPoints) {
            // update datapoints (set selection state for datapoint, update `selected` property of datapoint)
            this.updateSelectableDataPointsBySelectedIds(this.selectableDataPoints, selectedIds);
        }
        if (this.selectableLegendDataPoints) {
            // update datapoints for legend datapoint (set selection state for datapoint, update `selected` property of datapoint)
            this.updateSelectableDataPointsBySelectedIds(this.selectableLegendDataPoints, selectedIds);
        }
        if (this.selectableLabelsDataPoints) {
            // update datapoints for label datapoints
            for (const labelsDataPoint of this.selectableLabelsDataPoints) {
                labelsDataPoint.selected = selectedIds.some((value) => {
                    return value.includes(labelsDataPoint.identity);
                });
            }
        }
    }
    // Marks a data point as selected and syncs selection with the host.
    select(dataPoints, multiSelect) {
        const selectableDataPoints = [].concat(dataPoints);
        const originalSelectedIds = [...this.selectionManager.getSelectionIds()];
        if (!multiSelect || !selectableDataPoints.length) {
            // if multiselect isn't active need to reset curent selections
            // or clear selection by passing empty array of selection in dataPoints parameter
            this.selectionManager.clear();
        }
        // array of selection of selected datapoints
        const selectionIdsToSelect = [];
        selectableDataPoints.forEach((dataPoint) => {
            if (!dataPoint || !dataPoint.identity) {
                return;
            }
            const shouldDataPointBeSelected = !this.isDataPointSelected(dataPoint, originalSelectedIds);
            // update state of datapoint, set as selected and acumulate selectionId in temp array
            if (shouldDataPointBeSelected) {
                dataPoint.selected = true;
                selectionIdsToSelect.push(dataPoint.identity);
            }
            else {
                // set selection as false if datapoint isn't selected
                dataPoint.selected = false;
                if (multiSelect) {
                    selectionIdsToSelect.push(dataPoint.identity);
                }
            }
        });
        // if multiselect isn't active selection manager resets current state of selection and applies new selections
        this.selectionManager.select(selectionIdsToSelect, multiSelect);
        this.syncSelectionState();
    }
    takeSelectionStateFromDataPoints(dataPoints) {
        const selectedIds = this.selectionManager.getSelectionIds();
        // Replace the existing selectedIds rather than merging.
        powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_1__.clear(selectedIds);
        for (const dataPoint of dataPoints) {
            if (dataPoint.selected) {
                selectedIds.push(dataPoint.identity);
            }
        }
    }
    sendSelectionToHost() {
        // don't need to send to host something, selectionManager responsible for that
        return;
    }
    syncSelectionStateInverted() {
        const selectedIds = this.selectionManager.getSelectionIds();
        const selectableDataPoints = this.selectableDataPoints;
        if (!selectableDataPoints) {
            return;
        }
        if (selectedIds.length === 0) {
            for (const dataPoint of selectableDataPoints) {
                dataPoint.selected = false;
            }
        }
        else {
            for (const dataPoint of selectableDataPoints) {
                if (selectedIds.some((value) => value.includes(dataPoint.identity))) {
                    dataPoint.selected = true;
                }
                else if (dataPoint.selected) {
                    dataPoint.selected = false;
                }
            }
        }
    }
    updateSelectableDataPointsBySelectedIds(selectableDataPoints, selectedIds) {
        let foundMatchingId = false;
        for (const dataPoint of selectableDataPoints) {
            dataPoint.selected = this.isDataPointSelected(dataPoint, selectedIds);
            if (dataPoint.selected)
                foundMatchingId = true;
        }
        return foundMatchingId;
    }
    isDataPointSelected(dataPoint, selectedIds) {
        return selectedIds.some((value) => value.includes(dataPoint.identity));
    }
}
/**
 * Factory method to create an IInteractivityService instance.
 */
function createInteractivitySelectionService(hostServices) {
    return new InteractivitySelectionService(hostServices);
}
//# sourceMappingURL=interactivitySelectionService.js.map

/***/ }),

/***/ 1101:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   YG: () => (/* binding */ registerStandardSelectionHandler)
/* harmony export */ });
/* unused harmony exports getPositionOfLastInputEvent, registerGroupSelectionHandler */
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4264);
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/

function getPositionOfLastInputEvent() {
    return {
        x: event.clientX,
        y: event.clientY
    };
}
function registerStandardSelectionHandler(selection, selectionHandler) {
    const internalSelection = (0,d3_selection__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(selection.nodes());
    internalSelection.on("click", (event, d) => {
        selectionHandler.handleSelection(d, event.ctrlKey);
    });
}
function registerGroupSelectionHandler(group, selectionHandler) {
    const internalSelection = selectAll(group.nodes());
    internalSelection.on("click", (event) => {
        const target = event.target;
        const d = select(target).datum();
        selectionHandler.handleSelection(d, event.ctrlKey);
    });
}
//# sourceMappingURL=interactivityUtils.js.map

/***/ }),

/***/ 6060:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CH: () => (/* binding */ createClassAndSelector)
/* harmony export */ });
/* unused harmony exports styleAttribute, pixelUnits, heightProperty, widthProperty, topProperty, bottomProperty, leftProperty, rightProperty, marginTopProperty, marginLeftProperty, displayProperty, backgroundProperty, backgroundColorProperty, backgroundRepeatProperty, backgroundSizeProperty, backgroundImageProperty, textShadowProperty, textAlignProperty, borderProperty, borderTopWidthProperty, borderBottomWidthProperty, borderLeftWidthProperty, borderRightWidthProperty, fontSizeProperty, fontWeightProperty, colorProperty, opacityProperty, paddingLeftProperty, paddingRightProperty, positionProperty, maxWidthProperty, minWidthProperty, overflowProperty, overflowXProperty, overflowYProperty, transformProperty, webkitTransformProperty, cursorProperty, visibilityProperty, absoluteValue, zeroPixelValue, autoValue, hiddenValue, noneValue, blockValue, inlineBlockValue, transparentValue, boldValue, visibleValue, tableRowValue, coverValue, pointerValue, scrollValue */
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
function createClassAndSelector(className) {
    return {
        className: className,
        selectorName: "." + className,
    };
}
const styleAttribute = "style";
const pixelUnits = "px";
const heightProperty = "height";
const widthProperty = "width";
const topProperty = "top";
const bottomProperty = "bottom";
const leftProperty = "left";
const rightProperty = "right";
const marginTopProperty = "margin-top";
const marginLeftProperty = "margin-left";
const displayProperty = "display";
const backgroundProperty = "background";
const backgroundColorProperty = "background-color";
const backgroundRepeatProperty = "background-repeat";
const backgroundSizeProperty = "background-size";
const backgroundImageProperty = "background-image";
const textShadowProperty = "text-shadow";
const textAlignProperty = "text-align";
const borderProperty = "border";
const borderTopWidthProperty = "border-top-width";
const borderBottomWidthProperty = "border-bottom-width";
const borderLeftWidthProperty = "border-left-width";
const borderRightWidthProperty = "border-right-width";
const fontSizeProperty = "font-size";
const fontWeightProperty = "font-weight";
const colorProperty = "color";
const opacityProperty = "opacity";
const paddingLeftProperty = "padding-left";
const paddingRightProperty = "padding-right";
const positionProperty = "position";
const maxWidthProperty = "max-width";
const minWidthProperty = "min-width";
const overflowProperty = "overflow";
const overflowXProperty = "overflow-x";
const overflowYProperty = "overflow-y";
const transformProperty = "transform";
const webkitTransformProperty = "-webkit-transform";
const cursorProperty = "cursor";
const visibilityProperty = "visibility";
const absoluteValue = "absolute";
const zeroPixelValue = "0px";
const autoValue = "auto";
const hiddenValue = "hidden";
const noneValue = "none";
const blockValue = "block";
const inlineBlockValue = "inline-block";
const transparentValue = "transparent";
const boldValue = "bold";
const visibleValue = "visible";
const tableRowValue = "table-row";
const coverValue = "cover";
const pointerValue = "pointer";
const scrollValue = "scroll";
//# sourceMappingURL=cssConstants.js.map

/***/ }),

/***/ 9280:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AlmostZero: () => (/* binding */ AlmostZero),
/* harmony export */   createArrow: () => (/* binding */ createArrow),
/* harmony export */   ensureDAttribute: () => (/* binding */ ensureDAttribute),
/* harmony export */   ensureValidSVGPoint: () => (/* binding */ ensureValidSVGPoint),
/* harmony export */   flushAllD3Transitions: () => (/* binding */ flushAllD3Transitions),
/* harmony export */   flushAllD3TransitionsIfNeeded: () => (/* binding */ flushAllD3TransitionsIfNeeded),
/* harmony export */   getTransformScaleRatios: () => (/* binding */ getTransformScaleRatios),
/* harmony export */   parseTranslateTransform: () => (/* binding */ parseTranslateTransform),
/* harmony export */   scale: () => (/* binding */ scale),
/* harmony export */   transformOrigin: () => (/* binding */ transformOrigin),
/* harmony export */   translate: () => (/* binding */ translate),
/* harmony export */   translateAndRotate: () => (/* binding */ translateAndRotate),
/* harmony export */   translateAndScale: () => (/* binding */ translateAndScale),
/* harmony export */   translateWithPixels: () => (/* binding */ translateWithPixels),
/* harmony export */   translateXWithPixels: () => (/* binding */ translateXWithPixels)
/* harmony export */ });
/* harmony import */ var d3_timer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1739);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

/**
 * Very small values, when stringified, may be converted to scientific notation and cause a temporarily
 * invalid attribute or style property value.
 * For example, the number 0.0000001 is converted to the string "1e-7".
 * This is particularly noticeable when interpolating opacity values.
 * To avoid scientific notation, start or end the transition at 1e-6,
 * which is the smallest value that is not stringified in exponential notation.
 */
const AlmostZero = 1e-6;
/**
     * Creates a translate string for use with the SVG transform call.
     */
function translate(x, y) {
    return "translate(" + x + "," + y + ")";
}
/**
 * Creates a translateX string for use with the SVG transform call.
 */
function translateXWithPixels(x) {
    return "translateX(" + x + "px)";
}
function translateWithPixels(x, y) {
    return "translate(" + x + "px," + y + "px)";
}
/**
 * Creates a translate + rotate string for use with the SVG transform call.
 */
function translateAndRotate(x, y, px, py, angle) {
    return "translate("
        + x + "," + y + ")"
        + " rotate(" + angle + "," + px + "," + py + ")";
}
/**
 * Creates a scale string for use in a CSS transform property.
 */
function scale(scale) {
    return `scale(${scale})`;
}
/**
 * Creates a translate + scale string for use with the SVG transform call.
 */
function translateAndScale(x, y, ratio) {
    return "translate("
        + x + "," + y + ")"
        + " scale(" + ratio + ")";
}
/**
 * Creates a transform origin string for use in a CSS transform-origin property.
 */
function transformOrigin(xOffset, yOffset) {
    return `${xOffset} ${yOffset}`;
}
/**
 * Forces all D3 transitions to complete.
 * Normally, zero-delay transitions are executed after an instantaneous delay (<10ms).
 * This can cause a brief flicker if the browser renders the page twice: once at the end of the first event loop,
 * then again immediately on the first timer callback. By flushing the timer queue at the end of the first event loop,
 * you can run any zero-delay transitions immediately and avoid the flicker.
 *
 * These flickers are noticable on IE, and with a large number of webviews(not recommend you ever do this) on iOS.
 */
function flushAllD3Transitions() {
    const now = Date.now;
    Date.now = function () { return Infinity; };
    (0,d3_timer__WEBPACK_IMPORTED_MODULE_0__/* .timerFlush */ .R8)();
    Date.now = now;
}
/**
 * Wrapper for flushAllD3Transitions.
 */
function flushAllD3TransitionsIfNeeded(options) {
    if (!options)
        return;
    const animationOptions = options;
    if (animationOptions && animationOptions.transitionImmediate) {
        flushAllD3Transitions();
    }
}
/**
 * There is a known bug in IE10 that causes cryptic crashes for SVG elements with a null "d" attribute:
 * https://github.com/mbostock/d3/issues/1737
 */
function ensureDAttribute(pathElement) {
    if (!pathElement.getAttribute("d")) {
        pathElement.setAttribute("d", "");
    }
}
/**
 * In IE10, it is possible to return SVGPoints with NaN members.
 */
function ensureValidSVGPoint(point) {
    if (isNaN(point.x)) {
        point.x = 0;
    }
    if (isNaN(point.y)) {
        point.y = 0;
    }
}
/**
 * Parse the Transform string with value "translate(x,y)".
 * In Chrome for the translate(position) string the delimiter
 * is a comma and in IE it is a spaceso checking for both.
 */
function parseTranslateTransform(input) {
    if (!input || input.length === 0) { // Interpet falsy and empty string as a no-op translate
        return {
            x: "0",
            y: "0",
        };
    }
    const translateCoordinates = input.split(/[\s,]+/);
    let yValue = "0";
    let xValue;
    const xCoord = translateCoordinates[0];
    // Y coordinate is ommited in I.E if it is 0, so need to check against that
    if (translateCoordinates.length === 1) {
        // 10 refers to the length of "translate("
        xValue = xCoord.substring(10, xCoord.length - 1);
    }
    else {
        const yCoord = translateCoordinates[1];
        yValue = yCoord.substring(0, yCoord.length - 1);
        // 10 refers to the length of "translate("
        xValue = xCoord.substring(10, xCoord.length);
    }
    return {
        x: xValue,
        y: yValue
    };
}
/**
 * Create an arrow.
 */
function createArrow(width, height, rotate) {
    const transform = "rotate(" + rotate + " " + width / 2 + " " + height / 2 + ")";
    let path = "M0 0";
    path += "L0 " + height;
    path += "L" + width + " " + height / 2 + " Z";
    return {
        path: path,
        transform: transform
    };
}
/**
 * Use the ratio of the scaled bounding rect and the SVG DOM bounding box to get the x and y transform scale values
 * @deprecated This function is unreliable across browser implementations, prefer to use SVGScaleDetector if needed.
 */
function getTransformScaleRatios(svgElement) {
    if (svgElement != null) {
        const scaledRect = svgElement.getBoundingClientRect();
        const domRect = svgElement.getBBox();
        if (domRect.height > 0 && domRect.width > 0) {
            return {
                x: scaledRect.width / domRect.width,
                y: scaledRect.height / domRect.height
            };
        }
    }
    return { x: 1, y: 1 };
}
//# sourceMappingURL=manipulation.js.map

/***/ }),

/***/ 8297:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   a: () => (/* binding */ DefaultHandleTouchDelay)
/* harmony export */ });
const DefaultHandleTouchDelay = 500;
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 9472:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   p: () => (/* binding */ createTooltipServiceWrapper)
/* harmony export */ });
/* unused harmony export TooltipServiceWrapper */
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4264);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8297);


function createTooltipServiceWrapper(tooltipService, rootElement, // this argument is deprecated and is optional now, just to maintain visuals with tooltiputils logic written for versions bellow 3.0.0
handleTouchDelay = _constants__WEBPACK_IMPORTED_MODULE_0__/* .DefaultHandleTouchDelay */ .a) {
    return new TooltipServiceWrapper({
        tooltipService: tooltipService,
        handleTouchDelay: handleTouchDelay,
    });
}
class TooltipServiceWrapper {
    constructor(options) {
        this.visualHostTooltipService = options.tooltipService;
        this.handleTouchDelay = options.handleTouchDelay;
    }
    addTooltip(selection, getTooltipInfoDelegate, getDataPointIdentity, reloadTooltipDataOnMouseMove) {
        if (!selection || !this.visualHostTooltipService.enabled()) {
            return;
        }
        const internalSelection = (0,d3_selection__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(selection.nodes());
        const callTooltip = (func, event, tooltipInfo, selectionIds) => {
            const coordinates = [event.clientX, event.clientY];
            func.call(this.visualHostTooltipService, {
                coordinates: coordinates,
                isTouchEvent: event.pointerType === "touch",
                dataItems: tooltipInfo,
                identities: selectionIds
            });
        };
        internalSelection.on("pointerover", (event, data) => {
            const tooltipInfo = getTooltipInfoDelegate(data);
            if (tooltipInfo == null) {
                return;
            }
            const selectionIds = getDataPointIdentity ? [getDataPointIdentity(data)] : [];
            if (event.pointerType === "mouse") {
                callTooltip(this.visualHostTooltipService.show, event, tooltipInfo, selectionIds);
            }
            if (event.pointerType === "touch") {
                this.handleTouchTimeoutId = window.setTimeout(() => {
                    callTooltip(this.visualHostTooltipService.show, event, tooltipInfo, selectionIds);
                    this.handleTouchTimeoutId = undefined;
                }, this.handleTouchDelay);
            }
        });
        internalSelection.on("pointerout", (event) => {
            if (event.pointerType === "mouse") {
                this.visualHostTooltipService.hide({
                    isTouchEvent: false,
                    immediately: false,
                });
            }
            if (event.pointerType === "touch") {
                this.cancelTouchTimeoutEvents();
            }
        });
        internalSelection.on("pointermove", (event, data) => {
            if (event.pointerType === "mouse") {
                let tooltipInfo;
                if (reloadTooltipDataOnMouseMove) {
                    tooltipInfo = getTooltipInfoDelegate(data);
                    if (tooltipInfo == null) {
                        return;
                    }
                }
                const selectionIds = getDataPointIdentity ? [getDataPointIdentity(data)] : [];
                callTooltip(this.visualHostTooltipService.move, event, tooltipInfo, selectionIds);
            }
        });
    }
    cancelTouchTimeoutEvents() {
        if (this.handleTouchTimeoutId) {
            clearTimeout(this.handleTouchTimeoutId);
        }
    }
    hide() {
        this.visualHostTooltipService.hide({ immediately: true, isTouchEvent: false });
    }
}
//# sourceMappingURL=tooltipService.js.map

/***/ }),

/***/ 7802:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_PRECISION: () => (/* binding */ DEFAULT_PRECISION),
/* harmony export */   DEFAULT_PRECISION_IN_DECIMAL_DIGITS: () => (/* binding */ DEFAULT_PRECISION_IN_DECIMAL_DIGITS),
/* harmony export */   EPSILON: () => (/* binding */ EPSILON),
/* harmony export */   LOG_E_10: () => (/* binding */ LOG_E_10),
/* harmony export */   MAX_EXP: () => (/* binding */ MAX_EXP),
/* harmony export */   MAX_VALUE: () => (/* binding */ MAX_VALUE),
/* harmony export */   MIN_EXP: () => (/* binding */ MIN_EXP),
/* harmony export */   MIN_VALUE: () => (/* binding */ MIN_VALUE),
/* harmony export */   NEGATIVE_POWERS: () => (/* binding */ NEGATIVE_POWERS),
/* harmony export */   POSITIVE_POWERS: () => (/* binding */ POSITIVE_POWERS),
/* harmony export */   ceilToPrecision: () => (/* binding */ ceilToPrecision),
/* harmony export */   ceilWithPrecision: () => (/* binding */ ceilWithPrecision),
/* harmony export */   detectPrecision: () => (/* binding */ detectPrecision),
/* harmony export */   ensureInRange: () => (/* binding */ ensureInRange),
/* harmony export */   equalWithPrecision: () => (/* binding */ equalWithPrecision),
/* harmony export */   floorToPrecision: () => (/* binding */ floorToPrecision),
/* harmony export */   floorWithPrecision: () => (/* binding */ floorWithPrecision),
/* harmony export */   getPrecision: () => (/* binding */ getPrecision),
/* harmony export */   greaterOrEqualWithPrecision: () => (/* binding */ greaterOrEqualWithPrecision),
/* harmony export */   greaterWithPrecision: () => (/* binding */ greaterWithPrecision),
/* harmony export */   isInteger: () => (/* binding */ isInteger),
/* harmony export */   lessOrEqualWithPrecision: () => (/* binding */ lessOrEqualWithPrecision),
/* harmony export */   lessWithPrecision: () => (/* binding */ lessWithPrecision),
/* harmony export */   log10: () => (/* binding */ log10),
/* harmony export */   pow10: () => (/* binding */ pow10),
/* harmony export */   project: () => (/* binding */ project),
/* harmony export */   removeDecimalNoise: () => (/* binding */ removeDecimalNoise),
/* harmony export */   round: () => (/* binding */ round),
/* harmony export */   roundToPrecision: () => (/* binding */ roundToPrecision),
/* harmony export */   toIncrement: () => (/* binding */ toIncrement)
/* harmony export */ });
/*
*  Power BI Visualizations
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
/**
 * Module Double contains a set of constants and precision based utility methods
 * for dealing with doubles and their decimal garbage in the javascript.
 */
// Constants.
const MIN_VALUE = -Number.MAX_VALUE;
const MAX_VALUE = Number.MAX_VALUE;
const MIN_EXP = -308;
const MAX_EXP = 308;
const EPSILON = 1E-323;
const DEFAULT_PRECISION = 0.0001;
const DEFAULT_PRECISION_IN_DECIMAL_DIGITS = 12;
const LOG_E_10 = Math.log(10);
const POSITIVE_POWERS = [
    1E0, 1E1, 1E2, 1E3, 1E4, 1E5, 1E6, 1E7, 1E8, 1E9, 1E10, 1E11, 1E12, 1E13, 1E14, 1E15, 1E16, 1E17, 1E18, 1E19, 1E20, 1E21, 1E22, 1E23, 1E24, 1E25, 1E26, 1E27, 1E28, 1E29, 1E30, 1E31, 1E32, 1E33, 1E34, 1E35, 1E36, 1E37, 1E38, 1E39, 1E40, 1E41, 1E42, 1E43, 1E44, 1E45, 1E46, 1E47, 1E48, 1E49, 1E50, 1E51, 1E52, 1E53, 1E54, 1E55, 1E56, 1E57, 1E58, 1E59, 1E60, 1E61, 1E62, 1E63, 1E64, 1E65, 1E66, 1E67, 1E68, 1E69, 1E70, 1E71, 1E72, 1E73, 1E74, 1E75, 1E76, 1E77, 1E78, 1E79, 1E80, 1E81, 1E82, 1E83, 1E84, 1E85, 1E86, 1E87, 1E88, 1E89, 1E90, 1E91, 1E92, 1E93, 1E94, 1E95, 1E96, 1E97, 1E98, 1E99,
    1E100, 1E101, 1E102, 1E103, 1E104, 1E105, 1E106, 1E107, 1E108, 1E109, 1E110, 1E111, 1E112, 1E113, 1E114, 1E115, 1E116, 1E117, 1E118, 1E119, 1E120, 1E121, 1E122, 1E123, 1E124, 1E125, 1E126, 1E127, 1E128, 1E129, 1E130, 1E131, 1E132, 1E133, 1E134, 1E135, 1E136, 1E137, 1E138, 1E139, 1E140, 1E141, 1E142, 1E143, 1E144, 1E145, 1E146, 1E147, 1E148, 1E149, 1E150, 1E151, 1E152, 1E153, 1E154, 1E155, 1E156, 1E157, 1E158, 1E159, 1E160, 1E161, 1E162, 1E163, 1E164, 1E165, 1E166, 1E167, 1E168, 1E169, 1E170, 1E171, 1E172, 1E173, 1E174, 1E175, 1E176, 1E177, 1E178, 1E179, 1E180, 1E181, 1E182, 1E183, 1E184, 1E185, 1E186, 1E187, 1E188, 1E189, 1E190, 1E191, 1E192, 1E193, 1E194, 1E195, 1E196, 1E197, 1E198, 1E199,
    1E200, 1E201, 1E202, 1E203, 1E204, 1E205, 1E206, 1E207, 1E208, 1E209, 1E210, 1E211, 1E212, 1E213, 1E214, 1E215, 1E216, 1E217, 1E218, 1E219, 1E220, 1E221, 1E222, 1E223, 1E224, 1E225, 1E226, 1E227, 1E228, 1E229, 1E230, 1E231, 1E232, 1E233, 1E234, 1E235, 1E236, 1E237, 1E238, 1E239, 1E240, 1E241, 1E242, 1E243, 1E244, 1E245, 1E246, 1E247, 1E248, 1E249, 1E250, 1E251, 1E252, 1E253, 1E254, 1E255, 1E256, 1E257, 1E258, 1E259, 1E260, 1E261, 1E262, 1E263, 1E264, 1E265, 1E266, 1E267, 1E268, 1E269, 1E270, 1E271, 1E272, 1E273, 1E274, 1E275, 1E276, 1E277, 1E278, 1E279, 1E280, 1E281, 1E282, 1E283, 1E284, 1E285, 1E286, 1E287, 1E288, 1E289, 1E290, 1E291, 1E292, 1E293, 1E294, 1E295, 1E296, 1E297, 1E298, 1E299,
    1E300, 1E301, 1E302, 1E303, 1E304, 1E305, 1E306, 1E307, 1E308
];
const NEGATIVE_POWERS = [
    1E0, 1E-1, 1E-2, 1E-3, 1E-4, 1E-5, 1E-6, 1E-7, 1E-8, 1E-9, 1E-10, 1E-11, 1E-12, 1E-13, 1E-14, 1E-15, 1E-16, 1E-17, 1E-18, 1E-19, 1E-20, 1E-21, 1E-22, 1E-23, 1E-24, 1E-25, 1E-26, 1E-27, 1E-28, 1E-29, 1E-30, 1E-31, 1E-32, 1E-33, 1E-34, 1E-35, 1E-36, 1E-37, 1E-38, 1E-39, 1E-40, 1E-41, 1E-42, 1E-43, 1E-44, 1E-45, 1E-46, 1E-47, 1E-48, 1E-49, 1E-50, 1E-51, 1E-52, 1E-53, 1E-54, 1E-55, 1E-56, 1E-57, 1E-58, 1E-59, 1E-60, 1E-61, 1E-62, 1E-63, 1E-64, 1E-65, 1E-66, 1E-67, 1E-68, 1E-69, 1E-70, 1E-71, 1E-72, 1E-73, 1E-74, 1E-75, 1E-76, 1E-77, 1E-78, 1E-79, 1E-80, 1E-81, 1E-82, 1E-83, 1E-84, 1E-85, 1E-86, 1E-87, 1E-88, 1E-89, 1E-90, 1E-91, 1E-92, 1E-93, 1E-94, 1E-95, 1E-96, 1E-97, 1E-98, 1E-99,
    1E-100, 1E-101, 1E-102, 1E-103, 1E-104, 1E-105, 1E-106, 1E-107, 1E-108, 1E-109, 1E-110, 1E-111, 1E-112, 1E-113, 1E-114, 1E-115, 1E-116, 1E-117, 1E-118, 1E-119, 1E-120, 1E-121, 1E-122, 1E-123, 1E-124, 1E-125, 1E-126, 1E-127, 1E-128, 1E-129, 1E-130, 1E-131, 1E-132, 1E-133, 1E-134, 1E-135, 1E-136, 1E-137, 1E-138, 1E-139, 1E-140, 1E-141, 1E-142, 1E-143, 1E-144, 1E-145, 1E-146, 1E-147, 1E-148, 1E-149, 1E-150, 1E-151, 1E-152, 1E-153, 1E-154, 1E-155, 1E-156, 1E-157, 1E-158, 1E-159, 1E-160, 1E-161, 1E-162, 1E-163, 1E-164, 1E-165, 1E-166, 1E-167, 1E-168, 1E-169, 1E-170, 1E-171, 1E-172, 1E-173, 1E-174, 1E-175, 1E-176, 1E-177, 1E-178, 1E-179, 1E-180, 1E-181, 1E-182, 1E-183, 1E-184, 1E-185, 1E-186, 1E-187, 1E-188, 1E-189, 1E-190, 1E-191, 1E-192, 1E-193, 1E-194, 1E-195, 1E-196, 1E-197, 1E-198, 1E-199,
    1E-200, 1E-201, 1E-202, 1E-203, 1E-204, 1E-205, 1E-206, 1E-207, 1E-208, 1E-209, 1E-210, 1E-211, 1E-212, 1E-213, 1E-214, 1E-215, 1E-216, 1E-217, 1E-218, 1E-219, 1E-220, 1E-221, 1E-222, 1E-223, 1E-224, 1E-225, 1E-226, 1E-227, 1E-228, 1E-229, 1E-230, 1E-231, 1E-232, 1E-233, 1E-234, 1E-235, 1E-236, 1E-237, 1E-238, 1E-239, 1E-240, 1E-241, 1E-242, 1E-243, 1E-244, 1E-245, 1E-246, 1E-247, 1E-248, 1E-249, 1E-250, 1E-251, 1E-252, 1E-253, 1E-254, 1E-255, 1E-256, 1E-257, 1E-258, 1E-259, 1E-260, 1E-261, 1E-262, 1E-263, 1E-264, 1E-265, 1E-266, 1E-267, 1E-268, 1E-269, 1E-270, 1E-271, 1E-272, 1E-273, 1E-274, 1E-275, 1E-276, 1E-277, 1E-278, 1E-279, 1E-280, 1E-281, 1E-282, 1E-283, 1E-284, 1E-285, 1E-286, 1E-287, 1E-288, 1E-289, 1E-290, 1E-291, 1E-292, 1E-293, 1E-294, 1E-295, 1E-296, 1E-297, 1E-298, 1E-299,
    1E-300, 1E-301, 1E-302, 1E-303, 1E-304, 1E-305, 1E-306, 1E-307, 1E-308, 1E-309, 1E-310, 1E-311, 1E-312, 1E-313, 1E-314, 1E-315, 1E-316, 1E-317, 1E-318, 1E-319, 1E-320, 1E-321, 1E-322, 1E-323, 1E-324
];
/**
 * Returns powers of 10.
 * Unlike the Math.pow this function produces no decimal garbage.
 * @param exp Exponent.
 */
function pow10(exp) {
    // Positive & zero
    if (exp >= 0) {
        if (exp < POSITIVE_POWERS.length) {
            return POSITIVE_POWERS[exp];
        }
        else {
            return Infinity;
        }
    }
    // Negative
    exp = -exp;
    if (exp > 0 && exp < NEGATIVE_POWERS.length) { // if exp==int.MIN_VALUE then changing the sign will overflow and keep the number negative - we need to check for exp > 0 to filter out this corner case
        return NEGATIVE_POWERS[exp];
    }
    else {
        return 0;
    }
}
/**
 * Returns the 10 base logarithm of the number.
 * Unlike Math.log function this produces integer results with no decimal garbage.
 * @param val Positive value or zero.
 */
// eslint-disable-next-line max-lines-per-function
function log10(val) {
    // Fast Log10() algorithm
    if (val > 1 && val < 1E16) {
        if (val < 1E8) {
            if (val < 1E4) {
                if (val < 1E2) {
                    if (val < 1E1) {
                        return 0;
                    }
                    else {
                        return 1;
                    }
                }
                else {
                    if (val < 1E3) {
                        return 2;
                    }
                    else {
                        return 3;
                    }
                }
            }
            else {
                if (val < 1E6) {
                    if (val < 1E5) {
                        return 4;
                    }
                    else {
                        return 5;
                    }
                }
                else {
                    if (val < 1E7) {
                        return 6;
                    }
                    else {
                        return 7;
                    }
                }
            }
        }
        else {
            if (val < 1E12) {
                if (val < 1E10) {
                    if (val < 1E9) {
                        return 8;
                    }
                    else {
                        return 9;
                    }
                }
                else {
                    if (val < 1E11) {
                        return 10;
                    }
                    else {
                        return 11;
                    }
                }
            }
            else {
                if (val < 1E14) {
                    if (val < 1E13) {
                        return 12;
                    }
                    else {
                        return 13;
                    }
                }
                else {
                    if (val < 1E15) {
                        return 14;
                    }
                    else {
                        return 15;
                    }
                }
            }
        }
    }
    if (val > 1E-16 && val < 1) {
        if (val < 1E-8) {
            if (val < 1E-12) {
                if (val < 1E-14) {
                    if (val < 1E-15) {
                        return -16;
                    }
                    else {
                        return -15;
                    }
                }
                else {
                    if (val < 1E-13) {
                        return -14;
                    }
                    else {
                        return -13;
                    }
                }
            }
            else {
                if (val < 1E-10) {
                    if (val < 1E-11) {
                        return -12;
                    }
                    else {
                        return -11;
                    }
                }
                else {
                    if (val < 1E-9) {
                        return -10;
                    }
                    else {
                        return -9;
                    }
                }
            }
        }
        else {
            if (val < 1E-4) {
                if (val < 1E-6) {
                    if (val < 1E-7) {
                        return -8;
                    }
                    else {
                        return -7;
                    }
                }
                else {
                    if (val < 1E-5) {
                        return -6;
                    }
                    else {
                        return -5;
                    }
                }
            }
            else {
                if (val < 1E-2) {
                    if (val < 1E-3) {
                        return -4;
                    }
                    else {
                        return -3;
                    }
                }
                else {
                    if (val < 1E-1) {
                        return -2;
                    }
                    else {
                        return -1;
                    }
                }
            }
        }
    }
    // JS Math provides only natural log function so we need to calc the 10 base logarithm:
    // logb(x) = logk(x)/logk(b);
    const log10 = Math.log(val) / LOG_E_10;
    return floorWithPrecision(log10);
}
/**
 * Returns a power of 10 representing precision of the number based on the number of meaningful decimal digits.
 * For example the precision of 56,263.3767 with the 6 meaningful decimal digit is 0.1.
 * @param x Value.
 * @param decimalDigits How many decimal digits are meaningfull.
 */
function getPrecision(x, decimalDigits) {
    if (decimalDigits === undefined) {
        decimalDigits = DEFAULT_PRECISION_IN_DECIMAL_DIGITS;
    }
    if (!x || !isFinite(x)) {
        return undefined;
    }
    const exp = log10(Math.abs(x));
    if (exp < MIN_EXP) {
        return 0;
    }
    const precisionExp = Math.max(exp - decimalDigits, -NEGATIVE_POWERS.length + 1);
    return pow10(precisionExp);
}
/**
 * Checks if a delta between 2 numbers is less than provided precision.
 * @param x One value.
 * @param y Another value.
 * @param precision Precision value.
 */
function equalWithPrecision(x, y, precision) {
    precision = detectPrecision(precision, x, y);
    return x === y || Math.abs(x - y) < precision;
}
/**
 * Checks if a first value is less than another taking
 * into account the loose precision based equality.
 * @param x One value.
 * @param y Another value.
 * @param precision Precision value.
 */
function lessWithPrecision(x, y, precision) {
    precision = detectPrecision(precision, x, y);
    return x < y && Math.abs(x - y) > precision;
}
/**
 * Checks if a first value is less or equal than another taking
 * into account the loose precision based equality.
 * @param x One value.
 * @param y Another value.
 * @param precision Precision value.
 */
function lessOrEqualWithPrecision(x, y, precision) {
    precision = detectPrecision(precision, x, y);
    return x < y || Math.abs(x - y) < precision;
}
/**
 * Checks if a first value is greater than another taking
 * into account the loose precision based equality.
 * @param x One value.
 * @param y Another value.
 * @param precision Precision value.
 */
function greaterWithPrecision(x, y, precision) {
    precision = detectPrecision(precision, x, y);
    return x > y && Math.abs(x - y) > precision;
}
/**
 * Checks if a first value is greater or equal to another taking
 * into account the loose precision based equality.
 * @param x One value.
 * @param y Another value.
 * @param precision Precision value.
 */
function greaterOrEqualWithPrecision(x, y, precision) {
    precision = detectPrecision(precision, x, y);
    return x > y || Math.abs(x - y) < precision;
}
/**
 * Floors the number unless it's withing the precision distance from the higher int.
 * @param x One value.
 * @param precision Precision value.
 */
function floorWithPrecision(x, precision) {
    precision = precision != null ? precision : DEFAULT_PRECISION;
    const roundX = Math.round(x);
    if (Math.abs(x - roundX) < precision) {
        return roundX;
    }
    else {
        return Math.floor(x);
    }
}
/**
 * Ceils the number unless it's withing the precision distance from the lower int.
 * @param x One value.
 * @param precision Precision value.
 */
function ceilWithPrecision(x, precision) {
    precision = detectPrecision(precision, DEFAULT_PRECISION);
    const roundX = Math.round(x);
    if (Math.abs(x - roundX) < precision) {
        return roundX;
    }
    else {
        return Math.ceil(x);
    }
}
/**
 * Floors the number to the provided precision.
 * For example 234,578 floored to 1,000 precision is 234,000.
 * @param x One value.
 * @param precision Precision value.
 */
function floorToPrecision(x, precision) {
    precision = detectPrecision(precision, DEFAULT_PRECISION);
    if (precision === 0 || x === 0) {
        return x;
    }
    // Precision must be a Power of 10
    return Math.floor(x / precision) * precision;
}
/**
 * Ceils the number to the provided precision.
 * For example 234,578 floored to 1,000 precision is 235,000.
 * @param x One value.
 * @param precision Precision value.
 */
function ceilToPrecision(x, precision) {
    precision = detectPrecision(precision, DEFAULT_PRECISION);
    if (precision === 0 || x === 0) {
        return x;
    }
    // Precision must be a Power of 10
    return Math.ceil(x / precision) * precision;
}
/**
 * Rounds the number to the provided precision.
 * For example 234,578 floored to 1,000 precision is 235,000.
 * @param x One value.
 * @param precision Precision value.
 */
function roundToPrecision(x, precision) {
    precision = detectPrecision(precision, DEFAULT_PRECISION);
    if (precision === 0 || x === 0) {
        return x;
    }
    // Precision must be a Power of 10
    let result = Math.round(x / precision) * precision;
    const decimalDigits = Math.round(log10(Math.abs(x)) - log10(precision)) + 1;
    if (decimalDigits > 0 && decimalDigits < 16) {
        result = parseFloat(result.toPrecision(decimalDigits));
    }
    return result;
}
/**
 * Returns the value making sure that it's restricted to the provided range.
 * @param x One value.
 * @param min Range min boundary.
 * @param max Range max boundary.
 */
function ensureInRange(x, min, max) {
    if (x === undefined || x === null) {
        return x;
    }
    if (x < min) {
        return min;
    }
    if (x > max) {
        return max;
    }
    return x;
}
/**
 * Rounds the value - this method is actually faster than Math.round - used in the graphics utils.
 * @param x Value to round.
 */
function round(x) {
    return (0.5 + x) << 0;
}
/**
 * Projects the value from the source range into the target range.
 * @param value Value to project.
 * @param fromMin Minimum of the source range.
 * @param toMin Minimum of the target range.
 * @param toMax Maximum of the target range.
 */
function project(value, fromMin, fromSize, toMin, toSize) {
    if (fromSize === 0 || toSize === 0) {
        if (fromMin <= value && value <= fromMin + fromSize) {
            return toMin;
        }
        else {
            return NaN;
        }
    }
    const relativeX = (value - fromMin) / fromSize;
    const projectedX = toMin + relativeX * toSize;
    return projectedX;
}
/**
 * Removes decimal noise.
 * @param value Value to be processed.
 */
function removeDecimalNoise(value) {
    return roundToPrecision(value, getPrecision(value));
}
/**
 * Checks whether the number is integer.
 * @param value Value to be checked.
 */
function isInteger(value) {
    return value !== null && value % 1 === 0;
}
/**
 * Dividing by increment will give us count of increments
 * Round out the rough edges into even integer
 * Multiply back by increment to get rounded value
 * e.g. Rounder.toIncrement(0.647291, 0.05) => 0.65
 * @param value - value to round to nearest increment
 * @param increment - smallest increment to round toward
 */
function toIncrement(value, increment) {
    return Math.round(value / increment) * increment;
}
/**
 * Overrides the given precision with defaults if necessary. Exported only for tests
 *
 * precision defined returns precision
 * x defined with y undefined returns twelve digits of precision based on x
 * x defined but zero with y defined; returns twelve digits of precision based on y
 * x and y defined retursn twelve digits of precision based on the minimum of the two
 * if no applicable precision is found based on those (such as x and y being zero), the default precision is used
 */
function detectPrecision(precision, x, y) {
    if (precision !== undefined) {
        return precision;
    }
    let calculatedPrecision;
    if (!y) {
        calculatedPrecision = getPrecision(x);
    }
    else if (!x) {
        calculatedPrecision = getPrecision(y);
    }
    else {
        calculatedPrecision = getPrecision(Math.min(Math.abs(x), Math.abs(y)));
    }
    return calculatedPrecision || DEFAULT_PRECISION;
}
//# sourceMappingURL=double.js.map

/***/ }),

/***/ 1085:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   clear: () => (/* binding */ clear),
/* harmony export */   copy: () => (/* binding */ copy),
/* harmony export */   createWithId: () => (/* binding */ createWithId),
/* harmony export */   createWithName: () => (/* binding */ createWithName),
/* harmony export */   diff: () => (/* binding */ diff),
/* harmony export */   distinct: () => (/* binding */ distinct),
/* harmony export */   emptyToNull: () => (/* binding */ emptyToNull),
/* harmony export */   ensureArray: () => (/* binding */ ensureArray),
/* harmony export */   extendWithId: () => (/* binding */ extendWithId),
/* harmony export */   extendWithName: () => (/* binding */ extendWithName),
/* harmony export */   findItemWithName: () => (/* binding */ findItemWithName),
/* harmony export */   findWithId: () => (/* binding */ findWithId),
/* harmony export */   indexOf: () => (/* binding */ indexOf),
/* harmony export */   indexWithName: () => (/* binding */ indexWithName),
/* harmony export */   insertSorted: () => (/* binding */ insertSorted),
/* harmony export */   intersect: () => (/* binding */ intersect),
/* harmony export */   isArrayOrInheritedArray: () => (/* binding */ isArrayOrInheritedArray),
/* harmony export */   isInArray: () => (/* binding */ isInArray),
/* harmony export */   isSorted: () => (/* binding */ isSorted),
/* harmony export */   isSortedNumeric: () => (/* binding */ isSortedNumeric),
/* harmony export */   isUndefinedOrEmpty: () => (/* binding */ isUndefinedOrEmpty),
/* harmony export */   range: () => (/* binding */ range),
/* harmony export */   removeFirst: () => (/* binding */ removeFirst),
/* harmony export */   rotate: () => (/* binding */ rotate),
/* harmony export */   sequenceEqual: () => (/* binding */ sequenceEqual),
/* harmony export */   swap: () => (/* binding */ swap),
/* harmony export */   take: () => (/* binding */ take),
/* harmony export */   union: () => (/* binding */ union),
/* harmony export */   unionSingle: () => (/* binding */ unionSingle)
/* harmony export */ });
/**
 * Returns items that exist in target and other.
 */
function intersect(target, other) {
    const result = [];
    for (let i = target.length - 1; i >= 0; --i) {
        if (other.indexOf(target[i]) !== -1) {
            result.push(target[i]);
        }
    }
    return result;
}
/**
 * Return elements exists in target but not exists in other.
 */
function diff(target, other) {
    const result = [];
    for (let i = target.length - 1; i >= 0; --i) {
        const value = target[i];
        if (other.indexOf(value) === -1) {
            result.push(value);
        }
    }
    return result;
}
/**
 * Return an array with only the distinct items in the source.
 */
function distinct(source) {
    const result = [];
    for (let i = 0, len = source.length; i < len; i++) {
        const value = source[i];
        if (result.indexOf(value) === -1) {
            result.push(value);
        }
    }
    return result;
}
/**
 * Pushes content of source onto target,
 * for parts of course that do not already exist in target.
 */
function union(target, source) {
    for (let i = 0, len = source.length; i < len; ++i) {
        unionSingle(target, source[i]);
    }
}
/**
 * Pushes value onto target, if value does not already exist in target.
 */
function unionSingle(target, value) {
    if (target.indexOf(value) < 0) {
        target.push(value);
    }
}
/**
 * Returns an array with a range of items from source,
 * including the startIndex & endIndex.
 */
function range(source, startIndex, endIndex) {
    const result = [];
    for (let i = startIndex; i <= endIndex; ++i) {
        result.push(source[i]);
    }
    return result;
}
/**
 * Returns an array that includes items from source, up to the specified count.
 */
function take(source, count) {
    const result = [];
    for (let i = 0; i < count; ++i) {
        result.push(source[i]);
    }
    return result;
}
function copy(source) {
    return take(source, source.length);
}
/**
  * Returns a value indicating whether the arrays have the same values in the same sequence.
  */
function sequenceEqual(left, right, comparison) {
    // Normalize falsy to null
    if (!left) {
        left = null;
    }
    if (!right) {
        right = null;
    }
    // T can be same as U, and it is possible for left and right to be the same array object...
    if (left === right) {
        return true;
    }
    if (!!left !== !!right) {
        return false;
    }
    const len = left.length;
    if (len !== right.length) {
        return false;
    }
    let i = 0;
    while (i < len && comparison(left[i], right[i])) {
        ++i;
    }
    return i === len;
}
/**
 * Returns null if the specified array is empty.
 * Otherwise returns the specified array.
 */
function emptyToNull(array) {
    if (array && array.length === 0) {
        return null;
    }
    return array;
}
function indexOf(array, predicate) {
    for (let i = 0, len = array.length; i < len; ++i) {
        if (predicate(array[i])) {
            return i;
        }
    }
    return -1;
}
/**
 * Returns a copy of the array rotated by the specified offset.
 */
function rotate(array, offset) {
    if (offset === 0)
        return array.slice();
    const rotated = array.slice(offset);
    Array.prototype.push.apply(rotated, array.slice(0, offset));
    return rotated;
}
function createWithId() {
    return extendWithId([]);
}
function extendWithId(array) {
    const extended = array;
    extended.withId = withId;
    return extended;
}
/**
 * Finds and returns the first item with a matching ID.
 */
function findWithId(array, id) {
    for (let i = 0, len = array.length; i < len; i++) {
        const item = array[i];
        if (item.id === id)
            return item;
    }
}
function withId(id) {
    return findWithId(this, id);
}
function createWithName() {
    return extendWithName([]);
}
function extendWithName(array) {
    const extended = array;
    extended.withName = withName;
    return extended;
}
function findItemWithName(array, name) {
    const index = indexWithName(array, name);
    if (index >= 0)
        return array[index];
}
function indexWithName(array, name) {
    for (let i = 0, len = array.length; i < len; i++) {
        const item = array[i];
        if (item.name === name)
            return i;
    }
    return -1;
}
/**
 * Inserts a number in sorted order into a list of numbers already in sorted order.
 * @returns True if the item was added, false if it already existed.
 */
function insertSorted(list, value) {
    const len = list.length;
    // NOTE: iterate backwards because incoming values tend to be sorted already.
    for (let i = len - 1; i >= 0; i--) {
        const diff = list[i] - value;
        if (diff === 0)
            return false;
        if (diff > 0)
            continue;
        // diff < 0
        list.splice(i + 1, 0, value);
        return true;
    }
    list.unshift(value);
    return true;
}
/**
 * Removes the first occurrence of a value from a list if it exists.
 * @returns True if the value was removed, false if it did not exist in the list.
 */
function removeFirst(list, value) {
    const index = list.indexOf(value);
    if (index < 0)
        return false;
    list.splice(index, 1);
    return true;
}
/**
 * Finds and returns the first item with a matching name.
 */
function withName(name) {
    return findItemWithName(this, name);
}
/**
 * Deletes all items from the array.
 */
function clear(array) {
    if (!array)
        return;
    while (array.length > 0)
        array.pop();
}
function isUndefinedOrEmpty(array) {
    if (!array || array.length === 0) {
        return true;
    }
    return false;
}
function swap(array, firstIndex, secondIndex) {
    const temp = array[firstIndex];
    array[firstIndex] = array[secondIndex];
    array[secondIndex] = temp;
}
function isInArray(array, lookupItem, compareCallback) {
    return array.some(item => compareCallback(item, lookupItem));
}
/** Checks if the given object is an Array, and looking all the way up the prototype chain. */
function isArrayOrInheritedArray(obj) {
    let nextPrototype = obj;
    while (nextPrototype != null) {
        if (Array.isArray(nextPrototype))
            return true;
        nextPrototype = Object.getPrototypeOf(nextPrototype);
    }
    return false;
}
/**
 * Returns true if the specified values array is sorted in an order as determined by the specified compareFunction.
 */
function isSorted(values, compareFunction) {
    const ilen = values.length;
    if (ilen >= 2) {
        for (let i = 1; i < ilen; i++) {
            if (compareFunction(values[i - 1], values[i]) > 0) {
                return false;
            }
        }
    }
    return true;
}
/**
 * Returns true if the specified number values array is sorted in ascending order
 * (or descending order if the specified descendingOrder is truthy).
 */
function isSortedNumeric(values, descendingOrder) {
    const compareFunction = descendingOrder ?
        (a, b) => b - a :
        (a, b) => a - b;
    return isSorted(values, compareFunction);
}
/**
 * Ensures that the given T || T[] is in array form, either returning the array or
 * converting single items into an array of length one.
 */
function ensureArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    return [value];
}
//# sourceMappingURL=arrayExtensions.js.map

/***/ }),

/***/ 2136:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBitCount: () => (/* binding */ getBitCount),
/* harmony export */   hasFlag: () => (/* binding */ hasFlag),
/* harmony export */   resetFlag: () => (/* binding */ resetFlag),
/* harmony export */   setFlag: () => (/* binding */ setFlag),
/* harmony export */   toString: () => (/* binding */ toString)
/* harmony export */ });
/* harmony import */ var _double__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7802);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.

/**
 * Extensions for Enumerations.
 */
/**
 * Gets a value indicating whether the value has the bit flags set.
 */
function hasFlag(value, flag) {
    return (value & flag) === flag;
}
/**
 * Sets a value of a flag without modifying any other flags.
 */
function setFlag(value, flag) {
    return value |= flag;
}
/**
 * Resets a value of a flag without modifying any other flags.
 */
function resetFlag(value, flag) {
    return value &= ~flag;
}
/**
 * According to the TypeScript Handbook, this is safe to do.
 */
function toString(enumType, value) {
    return enumType[value];
}
/**
 * Returns the number of 1's in the specified value that is a set of binary bit flags.
 */
function getBitCount(value) {
    if (!(0,_double__WEBPACK_IMPORTED_MODULE_0__.isInteger)(value))
        return 0;
    let bitCount = 0;
    let shiftingValue = value;
    while (shiftingValue !== 0) {
        if ((shiftingValue & 1) === 1) {
            bitCount++;
        }
        shiftingValue = shiftingValue >>> 1;
    }
    return bitCount;
}
//# sourceMappingURL=enumExtensions.js.map

/***/ }),

/***/ 8981:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   XOR: () => (/* binding */ XOR)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
function XOR(a, b) {
    return (a || b) && !(a && b);
}
//# sourceMappingURL=logicExtensions.js.map

/***/ }),

/***/ 9765:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   run: () => (/* binding */ run)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
/**
 * Runs exec on regex starting from 0 index
 * This is the expected behavior but RegExp actually remember
 * the last index they stopped at (found match at) and will
 * return unexpected results when run in sequence.
 * @param regex - regular expression object
 * @param value - string to search wiht regex
 * @param start - index within value to start regex
 */
function run(regex, value, start) {
    regex.lastIndex = start || 0;
    return regex.exec(value);
}
//# sourceMappingURL=regExpExtensions.js.map

/***/ }),

/***/ 9446:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   endsWith: () => (/* binding */ endsWith)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 * Extensions to String class.
 */
/**
 * Checks if a string ends with a sub-string.
 */
function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
//# sourceMappingURL=stringExtensions.js.map

/***/ }),

/***/ 2170:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayExtensions: () => (/* reexport module object */ _extensions_arrayExtensions__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   double: () => (/* reexport module object */ _double__WEBPACK_IMPORTED_MODULE_7__),
/* harmony export */   enumExtensions: () => (/* reexport module object */ _extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_1__),
/* harmony export */   jsonComparer: () => (/* reexport module object */ _jsonComparer__WEBPACK_IMPORTED_MODULE_8__),
/* harmony export */   logicExtensions: () => (/* reexport module object */ _extensions_logicExtensions__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   numericSequence: () => (/* reexport module object */ _numericSequence_numericSequence__WEBPACK_IMPORTED_MODULE_5__),
/* harmony export */   numericSequenceRange: () => (/* reexport module object */ _numericSequence_numericSequenceRange__WEBPACK_IMPORTED_MODULE_6__),
/* harmony export */   pixelConverter: () => (/* reexport module object */ _pixelConverter__WEBPACK_IMPORTED_MODULE_9__),
/* harmony export */   prototype: () => (/* reexport module object */ _prototype__WEBPACK_IMPORTED_MODULE_10__),
/* harmony export */   regExpExtensions: () => (/* reexport module object */ _extensions_regExpExtensions__WEBPACK_IMPORTED_MODULE_3__),
/* harmony export */   stringExtensions: () => (/* reexport module object */ _extensions_stringExtensions__WEBPACK_IMPORTED_MODULE_4__),
/* harmony export */   textSizeDefaults: () => (/* reexport module object */ _textSizeDefaults__WEBPACK_IMPORTED_MODULE_11__),
/* harmony export */   valueType: () => (/* reexport module object */ _valueType__WEBPACK_IMPORTED_MODULE_12__)
/* harmony export */ });
/* harmony import */ var _extensions_arrayExtensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1085);
/* harmony import */ var _extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2136);
/* harmony import */ var _extensions_logicExtensions__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8981);
/* harmony import */ var _extensions_regExpExtensions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9765);
/* harmony import */ var _extensions_stringExtensions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9446);
/* harmony import */ var _numericSequence_numericSequence__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(99);
/* harmony import */ var _numericSequence_numericSequenceRange__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8489);
/* harmony import */ var _double__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7802);
/* harmony import */ var _jsonComparer__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(9289);
/* harmony import */ var _pixelConverter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(4732);
/* harmony import */ var _prototype__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(7281);
/* harmony import */ var _textSizeDefaults__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(1285);
/* harmony import */ var _valueType__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(3434);














//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9289:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   equals: () => (/* binding */ equals)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
/**
 * Performs JSON-style comparison of two objects.
 */
function equals(x, y) {
    if (x === y)
        return true;
    return JSON.stringify(x) === JSON.stringify(y);
}
//# sourceMappingURL=jsonComparer.js.map

/***/ }),

/***/ 99:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NumericSequence: () => (/* binding */ NumericSequence)
/* harmony export */ });
/* harmony import */ var _double__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7802);
/* harmony import */ var _numericSequenceRange__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8489);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */


class NumericSequence {
    // eslint-disable-next-line max-lines-per-function
    static calculate(range, expectedCount, maxAllowedMargin, minPower, useZeroRefPoint, steps) {
        const result = new NumericSequence();
        if (expectedCount === undefined)
            expectedCount = 10;
        else
            expectedCount = _double__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(expectedCount, NumericSequence.MIN_COUNT, NumericSequence.MAX_COUNT);
        if (minPower === undefined)
            minPower = _double__WEBPACK_IMPORTED_MODULE_0__.MIN_EXP;
        if (useZeroRefPoint === undefined)
            useZeroRefPoint = false;
        if (maxAllowedMargin === undefined)
            maxAllowedMargin = 1;
        if (steps === undefined)
            steps = [1, 2, 5];
        // Handle single stop case
        if (range.forcedSingleStop) {
            result.interval = range.getSize();
            result.intervalOffset = result.interval - (range.forcedSingleStop - range.min);
            result.min = range.min;
            result.max = range.max;
            result.sequence = [range.forcedSingleStop];
            return result;
        }
        let interval = 0;
        let min = 0;
        let max = 9;
        const canExtendMin = maxAllowedMargin > 0 && !range.hasFixedMin;
        const canExtendMax = maxAllowedMargin > 0 && !range.hasFixedMax;
        const size = range.getSize();
        let exp = _double__WEBPACK_IMPORTED_MODULE_0__.log10(size);
        // Account for Exp of steps
        const stepExp = _double__WEBPACK_IMPORTED_MODULE_0__.log10(steps[0]);
        exp = exp - stepExp;
        // Account for MaxCount
        const expectedCountExp = _double__WEBPACK_IMPORTED_MODULE_0__.log10(expectedCount);
        exp = exp - expectedCountExp;
        // Account for MinPower
        exp = Math.max(exp, minPower - stepExp + 1);
        let count = undefined;
        // Create array of "good looking" numbers
        if (interval !== 0) {
            // If explicit interval is defined - use it instead of the steps array.
            const power = _double__WEBPACK_IMPORTED_MODULE_0__.pow10(exp);
            const roundMin = _double__WEBPACK_IMPORTED_MODULE_0__.floorToPrecision(range.min, power);
            const roundMax = _double__WEBPACK_IMPORTED_MODULE_0__.ceilToPrecision(range.max, power);
            const roundRange = _numericSequenceRange__WEBPACK_IMPORTED_MODULE_1__.NumericSequenceRange.calculateFixedRange(roundMin, roundMax);
            roundRange.shrinkByStep(range, interval);
            min = roundRange.min;
            max = roundRange.max;
            count = Math.floor(roundRange.getSize() / interval);
        }
        else {
            // No interval defined -> find optimal interval
            let dexp;
            for (dexp = 0; dexp < 3; dexp++) {
                const e = exp + dexp;
                const power = _double__WEBPACK_IMPORTED_MODULE_0__.pow10(e);
                const roundMin = _double__WEBPACK_IMPORTED_MODULE_0__.floorToPrecision(range.min, power);
                const roundMax = _double__WEBPACK_IMPORTED_MODULE_0__.ceilToPrecision(range.max, power);
                // Go throught the steps array looking for the smallest step that produces the right interval count.
                const stepsCount = steps.length;
                const stepPower = _double__WEBPACK_IMPORTED_MODULE_0__.pow10(e - 1);
                for (let i = 0; i < stepsCount; i++) {
                    const step = steps[i] * stepPower;
                    const roundRange = _numericSequenceRange__WEBPACK_IMPORTED_MODULE_1__.NumericSequenceRange.calculateFixedRange(roundMin, roundMax, useZeroRefPoint);
                    roundRange.shrinkByStep(range, step);
                    // If the range is based on Data we might need to extend it to provide nice data margins.
                    if (canExtendMin && range.min === roundRange.min && maxAllowedMargin >= 1)
                        roundRange.min -= step;
                    if (canExtendMax && range.max === roundRange.max && maxAllowedMargin >= 1)
                        roundRange.max += step;
                    // Count the intervals
                    count = _double__WEBPACK_IMPORTED_MODULE_0__.ceilWithPrecision(roundRange.getSize() / step, _double__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_PRECISION);
                    if (count <= expectedCount || (dexp === 2 && i === stepsCount - 1) || (expectedCount === 1 && count === 2 && (step > range.getSize() || (range.min < 0 && range.max > 0 && step * 2 >= range.getSize())))) {
                        interval = step;
                        min = roundRange.min;
                        max = roundRange.max;
                        break;
                    }
                }
                // Increase the scale power until the interval is found
                if (interval !== 0)
                    break;
            }
        }
        // Avoid extreme count cases (>1000 ticks)
        if (count > expectedCount * 32 || count > NumericSequence.MAX_COUNT) {
            count = Math.min(expectedCount * 32, NumericSequence.MAX_COUNT);
            interval = (max - min) / count;
        }
        result.min = min;
        result.max = max;
        result.interval = interval;
        result.intervalOffset = min - range.min;
        result.maxAllowedMargin = maxAllowedMargin;
        result.canExtendMin = canExtendMin;
        result.canExtendMax = canExtendMax;
        // Fill in the Sequence
        const precision = _double__WEBPACK_IMPORTED_MODULE_0__.getPrecision(interval, 0);
        result.precision = precision;
        const sequence = [];
        let x = _double__WEBPACK_IMPORTED_MODULE_0__.roundToPrecision(min, precision);
        sequence.push(x);
        for (let i = 0; i < count; i++) {
            x = _double__WEBPACK_IMPORTED_MODULE_0__.roundToPrecision(x + interval, precision);
            sequence.push(x);
        }
        result.sequence = sequence;
        result.trimMinMax(range.min, range.max);
        return result;
    }
    /**
     * Calculates the sequence of int numbers which are mapped to the multiples of the units grid.
     * @min - The minimum of the range.
     * @max - The maximum of the range.
     * @maxCount - The max count of intervals.
     * @steps - array of intervals.
     */
    static calculateUnits(min, max, maxCount, steps) {
        // Initialization actions
        maxCount = _double__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(maxCount, NumericSequence.MIN_COUNT, NumericSequence.MAX_COUNT);
        if (min === max) {
            max = min + 1;
        }
        let stepCount = 0;
        let step = 0;
        // Calculate step
        for (let i = 0; i < steps.length; i++) {
            step = steps[i];
            const maxStepCount = _double__WEBPACK_IMPORTED_MODULE_0__.ceilWithPrecision(max / step);
            const minStepCount = _double__WEBPACK_IMPORTED_MODULE_0__.floorWithPrecision(min / step);
            stepCount = maxStepCount - minStepCount;
            if (stepCount <= maxCount) {
                break;
            }
        }
        // Calculate the offset
        let offset = -min;
        offset = offset % step;
        // Create sequence
        const result = new NumericSequence();
        result.sequence = [];
        for (let x = min + offset;; x += step) {
            result.sequence.push(x);
            if (x >= max)
                break;
        }
        result.interval = step;
        result.intervalOffset = offset;
        result.min = result.sequence[0];
        result.max = result.sequence[result.sequence.length - 1];
        return result;
    }
    trimMinMax(min, max) {
        const minMargin = (min - this.min) / this.interval;
        const maxMargin = (this.max - max) / this.interval;
        const marginPrecision = 0.001;
        if (!this.canExtendMin || (minMargin > this.maxAllowedMargin && minMargin > marginPrecision)) {
            this.min = min;
        }
        if (!this.canExtendMax || (maxMargin > this.maxAllowedMargin && maxMargin > marginPrecision)) {
            this.max = max;
        }
    }
}
NumericSequence.MIN_COUNT = 1;
NumericSequence.MAX_COUNT = 1000;
//# sourceMappingURL=numericSequence.js.map

/***/ }),

/***/ 8489:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NumericSequenceRange: () => (/* binding */ NumericSequenceRange),
/* harmony export */   hasValue: () => (/* binding */ hasValue)
/* harmony export */ });
/* harmony import */ var _double__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7802);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

class NumericSequenceRange {
    _ensureIncludeZero() {
        if (this.includeZero) {
            // fixed min and max has higher priority than includeZero
            if (this.min > 0 && !this.hasFixedMin) {
                this.min = 0;
            }
            if (this.max < 0 && !this.hasFixedMax) {
                this.max = 0;
            }
        }
    }
    _ensureNotEmpty() {
        if (this.min === this.max) {
            if (!this.min) {
                this.min = 0;
                this.max = NumericSequenceRange.DEFAULT_MAX;
                this.hasFixedMin = true;
                this.hasFixedMax = true;
            }
            else {
                // We are dealing with a single data value (includeZero is not set)
                // In order to fix the range we need to extend it in both directions by half of the interval.
                // Interval is calculated based on the number:
                // 1. Integers below 10,000 are extended by 0.5: so the [2006-2006] empty range is extended to [2005.5-2006.5] range and the ForsedSingleStop=2006
                // 2. Other numbers are extended by half of their power: [700,001-700,001] => [650,001-750,001] and the ForsedSingleStop=null as we want the intervals to be calculated to cover the range.
                const value = this.min;
                const exp = _double__WEBPACK_IMPORTED_MODULE_0__.log10(Math.abs(value));
                let step;
                if (exp >= 0 && exp < 4) {
                    step = 0.5;
                    this.forcedSingleStop = value;
                }
                else {
                    step = _double__WEBPACK_IMPORTED_MODULE_0__.pow10(exp) / 2;
                    this.forcedSingleStop = null;
                }
                this.min = value - step;
                this.max = value + step;
            }
        }
    }
    _ensureDirection() {
        if (this.min > this.max) {
            const temp = this.min;
            this.min = this.max;
            this.max = temp;
        }
    }
    getSize() {
        return this.max - this.min;
    }
    shrinkByStep(range, step) {
        let oldCount = this.min / step;
        let newCount = range.min / step;
        let deltaCount = Math.floor(newCount - oldCount);
        this.min += deltaCount * step;
        oldCount = this.max / step;
        newCount = range.max / step;
        deltaCount = Math.ceil(newCount - oldCount);
        this.max += deltaCount * step;
    }
    static calculate(dataMin, dataMax, fixedMin, fixedMax, includeZero) {
        const result = new NumericSequenceRange();
        result.includeZero = includeZero ? true : false;
        result.hasDataRange = hasValue(dataMin) && hasValue(dataMax);
        result.hasFixedMin = hasValue(fixedMin);
        result.hasFixedMax = hasValue(fixedMax);
        dataMin = _double__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(dataMin, NumericSequenceRange.MIN_SUPPORTED_DOUBLE, NumericSequenceRange.MAX_SUPPORTED_DOUBLE);
        dataMax = _double__WEBPACK_IMPORTED_MODULE_0__.ensureInRange(dataMax, NumericSequenceRange.MIN_SUPPORTED_DOUBLE, NumericSequenceRange.MAX_SUPPORTED_DOUBLE);
        // Calculate the range using the min, max, dataRange
        if (result.hasFixedMin && result.hasFixedMax) {
            result.min = fixedMin;
            result.max = fixedMax;
        }
        else if (result.hasFixedMin) {
            result.min = fixedMin;
            result.max = dataMax > fixedMin ? dataMax : fixedMin;
        }
        else if (result.hasFixedMax) {
            result.min = dataMin < fixedMax ? dataMin : fixedMax;
            result.max = fixedMax;
        }
        else if (result.hasDataRange) {
            result.min = dataMin;
            result.max = dataMax;
        }
        else {
            result.min = 0;
            result.max = 0;
        }
        result._ensureIncludeZero();
        result._ensureNotEmpty();
        result._ensureDirection();
        if (result.min === 0) {
            result.hasFixedMin = true; // If the range starts from zero we should prevent extending the intervals into the negative range
        }
        else if (result.max === 0) {
            result.hasFixedMax = true; // If the range ends at zero we should prevent extending the intervals into the positive range
        }
        return result;
    }
    static calculateDataRange(dataMin, dataMax, includeZero) {
        if (!hasValue(dataMin) || !hasValue(dataMax)) {
            return NumericSequenceRange.calculateFixedRange(0, NumericSequenceRange.DEFAULT_MAX);
        }
        else {
            return NumericSequenceRange.calculate(dataMin, dataMax, null, null, includeZero);
        }
    }
    static calculateFixedRange(fixedMin, fixedMax, includeZero) {
        const result = new NumericSequenceRange();
        result.hasDataRange = false;
        result.includeZero = includeZero;
        result.min = fixedMin;
        result.max = fixedMax;
        result._ensureIncludeZero();
        result._ensureNotEmpty();
        result._ensureDirection();
        result.hasFixedMin = true;
        result.hasFixedMax = true;
        return result;
    }
}
NumericSequenceRange.DEFAULT_MAX = 10;
NumericSequenceRange.MIN_SUPPORTED_DOUBLE = -1E307;
NumericSequenceRange.MAX_SUPPORTED_DOUBLE = 1E307;
/** Note: Exported for testability */
function hasValue(value) {
    return value !== undefined && value !== null;
}
//# sourceMappingURL=numericSequenceRange.js.map

/***/ }),

/***/ 4732:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromPoint: () => (/* binding */ fromPoint),
/* harmony export */   fromPointToPixel: () => (/* binding */ fromPointToPixel),
/* harmony export */   toPoint: () => (/* binding */ toPoint),
/* harmony export */   toString: () => (/* binding */ toString)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
const PxPtRatio = 4 / 3;
const PixelString = "px";
/**
 * Appends 'px' to the end of number value for use as pixel string in styles
 */
function toString(px) {
    return px + PixelString;
}
/**
 * Converts point value (pt) to pixels
 * Returns a string for font-size property
 * e.g. fromPoint(8) => '24px'
 */
function fromPoint(pt) {
    return toString(fromPointToPixel(pt));
}
/**
 * Converts point value (pt) to pixels
 * Returns a number for font-size property
 * e.g. fromPoint(8) => 24px
 */
function fromPointToPixel(pt) {
    return (PxPtRatio * pt);
}
/**
 * Converts pixel value (px) to pt
 * e.g. toPoint(24) => 8
 */
function toPoint(px) {
    return px / PxPtRatio;
}
//# sourceMappingURL=pixelConverter.js.map

/***/ }),

/***/ 7281:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   inherit: () => (/* binding */ inherit),
/* harmony export */   inheritSingle: () => (/* binding */ inheritSingle),
/* harmony export */   overrideArray: () => (/* binding */ overrideArray)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
/**
 * Returns a new object with the provided obj as its prototype.
 */
function inherit(obj, extension) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    function wrapCtor() { }
    wrapCtor.prototype = obj;
    const inherited = new wrapCtor();
    if (extension)
        extension(inherited);
    return inherited;
}
/**
 * Returns a new object with the provided obj as its prototype
 * if, and only if, the prototype has not been previously set
 */
function inheritSingle(obj) {
    const proto = Object.getPrototypeOf(obj);
    if (proto === Object.prototype || proto === Array.prototype)
        obj = inherit(obj);
    return obj;
}
/**
 * Uses the provided callback function to selectively replace contents in the provided array.
 * @return A new array with those values overriden
 * or undefined if no overrides are necessary.
 */
function overrideArray(prototype, override) {
    if (!prototype)
        return;
    let overwritten;
    for (let i = 0, len = prototype.length; i < len; i++) {
        const value = override(prototype[i]);
        if (value) {
            if (!overwritten)
                overwritten = inherit(prototype);
            overwritten[i] = value;
        }
    }
    return overwritten;
}
//# sourceMappingURL=prototype.js.map

/***/ }),

/***/ 1285:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TextSizeMax: () => (/* binding */ TextSizeMax),
/* harmony export */   TextSizeMin: () => (/* binding */ TextSizeMin),
/* harmony export */   getScale: () => (/* binding */ getScale)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// NOTE: this file includes standalone utilities that should have no dependencies on external libraries, including jQuery.
/**
 * Values are in terms of 'pt'
 * Convert to pixels using PixelConverter.fromPoint
 */
/**
 * Stored in terms of 'pt'
 * Convert to pixels using PixelConverter.fromPoint
 */
const TextSizeMin = 8;
/**
 * Stored in terms of 'pt'
 * Convert to pixels using PixelConverter.fromPoint
 */
const TextSizeMax = 40;
const TextSizeRange = TextSizeMax - TextSizeMin;
/**
 * Returns the percentage of this value relative to the TextSizeMax
 * @param textSize - should be given in terms of 'pt'
 */
function getScale(textSize) {
    return (textSize - TextSizeMin) / TextSizeRange;
}
//# sourceMappingURL=textSizeDefaults.js.map

/***/ }),

/***/ 3434:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExtendedType: () => (/* binding */ ExtendedType),
/* harmony export */   FormattingType: () => (/* binding */ FormattingType),
/* harmony export */   GeographyType: () => (/* binding */ GeographyType),
/* harmony export */   MiscellaneousType: () => (/* binding */ MiscellaneousType),
/* harmony export */   PrimitiveType: () => (/* binding */ PrimitiveType),
/* harmony export */   ScriptType: () => (/* binding */ ScriptType),
/* harmony export */   TemporalType: () => (/* binding */ TemporalType),
/* harmony export */   ValueType: () => (/* binding */ ValueType)
/* harmony export */ });
/* harmony import */ var _extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2136);
/* harmony import */ var _jsonComparer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9289);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
// powerbi.extensibility.utils.type


/** Describes a data value type, including a primitive type and extended type if any (derived from data category). */
class ValueType {
    /** Do not call the ValueType constructor directly. Use the ValueType.fromXXX methods. */
    constructor(underlyingType, category, enumType, variantTypes) {
        this.underlyingType = underlyingType;
        this.category = category;
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Temporal)) {
            this.temporalType = new TemporalType(underlyingType);
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Geography)) {
            this.geographyType = new GeographyType(underlyingType);
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Miscellaneous)) {
            this.miscType = new MiscellaneousType(underlyingType);
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Formatting)) {
            this.formattingType = new FormattingType(underlyingType);
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Enumeration)) {
            this.enumType = enumType;
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Scripting)) {
            this.scriptingType = new ScriptType(underlyingType);
        }
        if (_extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(underlyingType, ExtendedType.Variant)) {
            this.variationTypes = variantTypes;
        }
    }
    /** Creates or retrieves a ValueType object based on the specified ValueTypeDescriptor. */
    static fromDescriptor(descriptor) {
        descriptor = descriptor || {};
        // Simplified primitive types
        if (descriptor.text)
            return ValueType.fromExtendedType(ExtendedType.Text);
        if (descriptor.integer)
            return ValueType.fromExtendedType(ExtendedType.Integer);
        if (descriptor.numeric)
            return ValueType.fromExtendedType(ExtendedType.Double);
        if (descriptor.bool)
            return ValueType.fromExtendedType(ExtendedType.Boolean);
        if (descriptor.dateTime)
            return ValueType.fromExtendedType(ExtendedType.DateTime);
        if (descriptor.duration)
            return ValueType.fromExtendedType(ExtendedType.Duration);
        if (descriptor.binary)
            return ValueType.fromExtendedType(ExtendedType.Binary);
        if (descriptor.none)
            return ValueType.fromExtendedType(ExtendedType.None);
        // Extended types
        if (descriptor.scripting) {
            if (descriptor.scripting.source)
                return ValueType.fromExtendedType(ExtendedType.ScriptSource);
        }
        if (descriptor.enumeration)
            return ValueType.fromEnum(descriptor.enumeration);
        if (descriptor.temporal) {
            if (descriptor.temporal.year)
                return ValueType.fromExtendedType(ExtendedType.Years_Integer);
            if (descriptor.temporal.quarter)
                return ValueType.fromExtendedType(ExtendedType.Quarters_Integer);
            if (descriptor.temporal.month)
                return ValueType.fromExtendedType(ExtendedType.Months_Integer);
            if (descriptor.temporal.day)
                return ValueType.fromExtendedType(ExtendedType.DayOfMonth_Integer);
            if (descriptor.temporal.paddedDateTableDate)
                return ValueType.fromExtendedType(ExtendedType.PaddedDateTableDates);
        }
        if (descriptor.geography) {
            if (descriptor.geography.address)
                return ValueType.fromExtendedType(ExtendedType.Address);
            if (descriptor.geography.city)
                return ValueType.fromExtendedType(ExtendedType.City);
            if (descriptor.geography.continent)
                return ValueType.fromExtendedType(ExtendedType.Continent);
            if (descriptor.geography.country)
                return ValueType.fromExtendedType(ExtendedType.Country);
            if (descriptor.geography.county)
                return ValueType.fromExtendedType(ExtendedType.County);
            if (descriptor.geography.region)
                return ValueType.fromExtendedType(ExtendedType.Region);
            if (descriptor.geography.postalCode)
                return ValueType.fromExtendedType(ExtendedType.PostalCode_Text);
            if (descriptor.geography.stateOrProvince)
                return ValueType.fromExtendedType(ExtendedType.StateOrProvince);
            if (descriptor.geography.place)
                return ValueType.fromExtendedType(ExtendedType.Place);
            if (descriptor.geography.latitude)
                return ValueType.fromExtendedType(ExtendedType.Latitude_Double);
            if (descriptor.geography.longitude)
                return ValueType.fromExtendedType(ExtendedType.Longitude_Double);
        }
        if (descriptor.misc) {
            if (descriptor.misc.image)
                return ValueType.fromExtendedType(ExtendedType.Image);
            if (descriptor.misc.imageUrl)
                return ValueType.fromExtendedType(ExtendedType.ImageUrl);
            if (descriptor.misc.webUrl)
                return ValueType.fromExtendedType(ExtendedType.WebUrl);
            if (descriptor.misc.barcode)
                return ValueType.fromExtendedType(ExtendedType.Barcode_Text);
        }
        if (descriptor.formatting) {
            if (descriptor.formatting.color)
                return ValueType.fromExtendedType(ExtendedType.Color);
            if (descriptor.formatting.formatString)
                return ValueType.fromExtendedType(ExtendedType.FormatString);
            if (descriptor.formatting.alignment)
                return ValueType.fromExtendedType(ExtendedType.Alignment);
            if (descriptor.formatting.labelDisplayUnits)
                return ValueType.fromExtendedType(ExtendedType.LabelDisplayUnits);
            if (descriptor.formatting.fontSize)
                return ValueType.fromExtendedType(ExtendedType.FontSize);
            if (descriptor.formatting.labelDensity)
                return ValueType.fromExtendedType(ExtendedType.LabelDensity);
        }
        if (descriptor.extendedType) {
            return ValueType.fromExtendedType(descriptor.extendedType);
        }
        if (descriptor.operations) {
            if (descriptor.operations.searchEnabled)
                return ValueType.fromExtendedType(ExtendedType.SearchEnabled);
        }
        if (descriptor.variant) {
            const variantTypes = descriptor.variant.map((variantType) => ValueType.fromDescriptor(variantType));
            return ValueType.fromVariant(variantTypes);
        }
        return ValueType.fromExtendedType(ExtendedType.Null);
    }
    /** Advanced: Generally use fromDescriptor instead. Creates or retrieves a ValueType object for the specified ExtendedType. */
    static fromExtendedType(extendedType) {
        extendedType = extendedType || ExtendedType.Null;
        const primitiveType = getPrimitiveType(extendedType), category = getCategoryFromExtendedType(extendedType);
        return ValueType.fromPrimitiveTypeAndCategory(primitiveType, category);
    }
    /** Creates or retrieves a ValueType object for the specified PrimitiveType and data category. */
    static fromPrimitiveTypeAndCategory(primitiveType, category) {
        primitiveType = primitiveType || PrimitiveType.Null;
        category = category || null;
        let id = primitiveType.toString();
        if (category)
            id += "|" + category;
        return ValueType.typeCache[id] || (ValueType.typeCache[id] = new ValueType(toExtendedType(primitiveType, category), category));
    }
    /** Creates a ValueType to describe the given IEnumType. */
    static fromEnum(enumType) {
        return new ValueType(ExtendedType.Enumeration, null, enumType);
    }
    /** Creates a ValueType to describe the given Variant type. */
    static fromVariant(variantTypes) {
        return new ValueType(ExtendedType.Variant, /* category */ null, /* enumType */ null, variantTypes);
    }
    /** Determines if the specified type is compatible from at least one of the otherTypes. */
    static isCompatibleTo(typeDescriptor, otherTypes) {
        const valueType = ValueType.fromDescriptor(typeDescriptor);
        for (const otherType of otherTypes) {
            const otherValueType = ValueType.fromDescriptor(otherType);
            if (otherValueType.isCompatibleFrom(valueType))
                return true;
        }
        return false;
    }
    /** Determines if the instance ValueType is convertable from the 'other' ValueType. */
    isCompatibleFrom(other) {
        const otherPrimitiveType = other.primitiveType;
        if (this === other ||
            this.primitiveType === otherPrimitiveType ||
            otherPrimitiveType === PrimitiveType.Null ||
            // Return true if both types are numbers
            (this.numeric && other.numeric))
            return true;
        return false;
    }
    /**
     * Determines if the instance ValueType is equal to the 'other' ValueType
     * @param {ValueType} other the other ValueType to check equality against
     * @returns True if the instance ValueType is equal to the 'other' ValueType
     */
    equals(other) {
        return (0,_jsonComparer__WEBPACK_IMPORTED_MODULE_1__.equals)(this, other);
    }
    /** Gets the exact primitive type of this ValueType. */
    get primitiveType() {
        return getPrimitiveType(this.underlyingType);
    }
    /** Gets the exact extended type of this ValueType. */
    get extendedType() {
        return this.underlyingType;
    }
    /** Gets the data category string (if any) for this ValueType. */
    get categoryString() {
        return this.category;
    }
    // Simplified primitive types
    /** Indicates whether the type represents text values. */
    get text() {
        return this.primitiveType === PrimitiveType.Text;
    }
    /** Indicates whether the type represents any numeric value. */
    get numeric() {
        return _extensions_enumExtensions__WEBPACK_IMPORTED_MODULE_0__.hasFlag(this.underlyingType, ExtendedType.Numeric);
    }
    /** Indicates whether the type represents integer numeric values. */
    get integer() {
        return this.primitiveType === PrimitiveType.Integer;
    }
    /** Indicates whether the type represents Boolean values. */
    get bool() {
        return this.primitiveType === PrimitiveType.Boolean;
    }
    /** Indicates whether the type represents any date/time values. */
    get dateTime() {
        return this.primitiveType === PrimitiveType.DateTime ||
            this.primitiveType === PrimitiveType.Date ||
            this.primitiveType === PrimitiveType.Time;
    }
    /** Indicates whether the type represents duration values. */
    get duration() {
        return this.primitiveType === PrimitiveType.Duration;
    }
    /** Indicates whether the type represents binary values. */
    get binary() {
        return this.primitiveType === PrimitiveType.Binary;
    }
    /** Indicates whether the type represents none values. */
    get none() {
        return this.primitiveType === PrimitiveType.None;
    }
    // Extended types
    /** Returns an object describing temporal values represented by the type, if it represents a temporal type. */
    get temporal() {
        return this.temporalType;
    }
    /** Returns an object describing geographic values represented by the type, if it represents a geographic type. */
    get geography() {
        return this.geographyType;
    }
    /** Returns an object describing the specific values represented by the type, if it represents a miscellaneous extended type. */
    get misc() {
        return this.miscType;
    }
    /** Returns an object describing the formatting values represented by the type, if it represents a formatting type. */
    get formatting() {
        return this.formattingType;
    }
    /** Returns an object describing the enum values represented by the type, if it represents an enumeration type. */
    get enumeration() {
        return this.enumType;
    }
    get scripting() {
        return this.scriptingType;
    }
    /** Returns an array describing the variant values represented by the type, if it represents an Variant type. */
    get variant() {
        return this.variationTypes;
    }
}
ValueType.typeCache = {};
class ScriptType {
    constructor(underlyingType) {
        this.underlyingType = underlyingType;
    }
    get source() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.ScriptSource);
    }
}
class TemporalType {
    constructor(underlyingType) {
        this.underlyingType = underlyingType;
    }
    get year() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Years);
    }
    get quarter() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Quarters);
    }
    get month() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Months);
    }
    get day() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.DayOfMonth);
    }
    get paddedDateTableDate() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.PaddedDateTableDates);
    }
}
class GeographyType {
    constructor(underlyingType) {
        this.underlyingType = underlyingType;
    }
    get address() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Address);
    }
    get city() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.City);
    }
    get continent() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Continent);
    }
    get country() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Country);
    }
    get county() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.County);
    }
    get region() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Region);
    }
    get postalCode() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.PostalCode);
    }
    get stateOrProvince() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.StateOrProvince);
    }
    get place() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Place);
    }
    get latitude() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Latitude);
    }
    get longitude() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Longitude);
    }
}
class MiscellaneousType {
    constructor(underlyingType) {
        this.underlyingType = underlyingType;
    }
    get image() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Image);
    }
    get imageUrl() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.ImageUrl);
    }
    get webUrl() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.WebUrl);
    }
    get barcode() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Barcode);
    }
}
class FormattingType {
    constructor(underlyingType) {
        this.underlyingType = underlyingType;
    }
    get color() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Color);
    }
    get formatString() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.FormatString);
    }
    get alignment() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.Alignment);
    }
    get labelDisplayUnits() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelDisplayUnits);
    }
    get fontSize() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.FontSize);
    }
    get labelDensity() {
        return matchesExtendedTypeWithAnyPrimitive(this.underlyingType, ExtendedType.LabelDensity);
    }
}
/** Defines primitive value types. Must be consistent with types defined by server conceptual schema. */
var PrimitiveType;
(function (PrimitiveType) {
    PrimitiveType[PrimitiveType["Null"] = 0] = "Null";
    PrimitiveType[PrimitiveType["Text"] = 1] = "Text";
    PrimitiveType[PrimitiveType["Decimal"] = 2] = "Decimal";
    PrimitiveType[PrimitiveType["Double"] = 3] = "Double";
    PrimitiveType[PrimitiveType["Integer"] = 4] = "Integer";
    PrimitiveType[PrimitiveType["Boolean"] = 5] = "Boolean";
    PrimitiveType[PrimitiveType["Date"] = 6] = "Date";
    PrimitiveType[PrimitiveType["DateTime"] = 7] = "DateTime";
    PrimitiveType[PrimitiveType["DateTimeZone"] = 8] = "DateTimeZone";
    PrimitiveType[PrimitiveType["Time"] = 9] = "Time";
    PrimitiveType[PrimitiveType["Duration"] = 10] = "Duration";
    PrimitiveType[PrimitiveType["Binary"] = 11] = "Binary";
    PrimitiveType[PrimitiveType["None"] = 12] = "None";
    PrimitiveType[PrimitiveType["Variant"] = 13] = "Variant";
})(PrimitiveType || (PrimitiveType = {}));
var PrimitiveTypeStrings;
(function (PrimitiveTypeStrings) {
    PrimitiveTypeStrings[PrimitiveTypeStrings["Null"] = 0] = "Null";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Text"] = 1] = "Text";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Decimal"] = 2] = "Decimal";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Double"] = 3] = "Double";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Integer"] = 4] = "Integer";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Boolean"] = 5] = "Boolean";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Date"] = 6] = "Date";
    PrimitiveTypeStrings[PrimitiveTypeStrings["DateTime"] = 7] = "DateTime";
    PrimitiveTypeStrings[PrimitiveTypeStrings["DateTimeZone"] = 8] = "DateTimeZone";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Time"] = 9] = "Time";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Duration"] = 10] = "Duration";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Binary"] = 11] = "Binary";
    PrimitiveTypeStrings[PrimitiveTypeStrings["None"] = 12] = "None";
    PrimitiveTypeStrings[PrimitiveTypeStrings["Variant"] = 13] = "Variant";
})(PrimitiveTypeStrings || (PrimitiveTypeStrings = {}));
/** Defines extended value types, which include primitive types and known data categories constrained to expected primitive types. */
var ExtendedType;
(function (ExtendedType) {
    // Flags (1 << 8-15 range [0xFF00])
    // Important: Enum members must be declared before they are used in TypeScript.
    ExtendedType[ExtendedType["Numeric"] = 256] = "Numeric";
    ExtendedType[ExtendedType["Temporal"] = 512] = "Temporal";
    ExtendedType[ExtendedType["Geography"] = 1024] = "Geography";
    ExtendedType[ExtendedType["Miscellaneous"] = 2048] = "Miscellaneous";
    ExtendedType[ExtendedType["Formatting"] = 4096] = "Formatting";
    ExtendedType[ExtendedType["Scripting"] = 8192] = "Scripting";
    // Primitive types (0-255 range [0xFF] | flags)
    // The member names and base values must match those in PrimitiveType.
    ExtendedType[ExtendedType["Null"] = 0] = "Null";
    ExtendedType[ExtendedType["Text"] = 1] = "Text";
    ExtendedType[ExtendedType["Decimal"] = 258] = "Decimal";
    ExtendedType[ExtendedType["Double"] = 259] = "Double";
    ExtendedType[ExtendedType["Integer"] = 260] = "Integer";
    ExtendedType[ExtendedType["Boolean"] = 5] = "Boolean";
    ExtendedType[ExtendedType["Date"] = 518] = "Date";
    ExtendedType[ExtendedType["DateTime"] = 519] = "DateTime";
    ExtendedType[ExtendedType["DateTimeZone"] = 520] = "DateTimeZone";
    ExtendedType[ExtendedType["Time"] = 521] = "Time";
    ExtendedType[ExtendedType["Duration"] = 10] = "Duration";
    ExtendedType[ExtendedType["Binary"] = 11] = "Binary";
    ExtendedType[ExtendedType["None"] = 12] = "None";
    ExtendedType[ExtendedType["Variant"] = 13] = "Variant";
    // Extended types (0-32767 << 16 range [0xFFFF0000] | corresponding primitive type | flags)
    // Temporal
    ExtendedType[ExtendedType["Years"] = 66048] = "Years";
    ExtendedType[ExtendedType["Years_Text"] = 66049] = "Years_Text";
    ExtendedType[ExtendedType["Years_Integer"] = 66308] = "Years_Integer";
    ExtendedType[ExtendedType["Years_Date"] = 66054] = "Years_Date";
    ExtendedType[ExtendedType["Years_DateTime"] = 66055] = "Years_DateTime";
    ExtendedType[ExtendedType["Months"] = 131584] = "Months";
    ExtendedType[ExtendedType["Months_Text"] = 131585] = "Months_Text";
    ExtendedType[ExtendedType["Months_Integer"] = 131844] = "Months_Integer";
    ExtendedType[ExtendedType["Months_Date"] = 131590] = "Months_Date";
    ExtendedType[ExtendedType["Months_DateTime"] = 131591] = "Months_DateTime";
    ExtendedType[ExtendedType["PaddedDateTableDates"] = 197127] = "PaddedDateTableDates";
    ExtendedType[ExtendedType["Quarters"] = 262656] = "Quarters";
    ExtendedType[ExtendedType["Quarters_Text"] = 262657] = "Quarters_Text";
    ExtendedType[ExtendedType["Quarters_Integer"] = 262916] = "Quarters_Integer";
    ExtendedType[ExtendedType["Quarters_Date"] = 262662] = "Quarters_Date";
    ExtendedType[ExtendedType["Quarters_DateTime"] = 262663] = "Quarters_DateTime";
    ExtendedType[ExtendedType["DayOfMonth"] = 328192] = "DayOfMonth";
    ExtendedType[ExtendedType["DayOfMonth_Text"] = 328193] = "DayOfMonth_Text";
    ExtendedType[ExtendedType["DayOfMonth_Integer"] = 328452] = "DayOfMonth_Integer";
    ExtendedType[ExtendedType["DayOfMonth_Date"] = 328198] = "DayOfMonth_Date";
    ExtendedType[ExtendedType["DayOfMonth_DateTime"] = 328199] = "DayOfMonth_DateTime";
    // Geography
    ExtendedType[ExtendedType["Address"] = 6554625] = "Address";
    ExtendedType[ExtendedType["City"] = 6620161] = "City";
    ExtendedType[ExtendedType["Continent"] = 6685697] = "Continent";
    ExtendedType[ExtendedType["Country"] = 6751233] = "Country";
    ExtendedType[ExtendedType["County"] = 6816769] = "County";
    ExtendedType[ExtendedType["Region"] = 6882305] = "Region";
    ExtendedType[ExtendedType["PostalCode"] = 6947840] = "PostalCode";
    ExtendedType[ExtendedType["PostalCode_Text"] = 6947841] = "PostalCode_Text";
    ExtendedType[ExtendedType["PostalCode_Integer"] = 6948100] = "PostalCode_Integer";
    ExtendedType[ExtendedType["StateOrProvince"] = 7013377] = "StateOrProvince";
    ExtendedType[ExtendedType["Place"] = 7078913] = "Place";
    ExtendedType[ExtendedType["Latitude"] = 7144448] = "Latitude";
    ExtendedType[ExtendedType["Latitude_Decimal"] = 7144706] = "Latitude_Decimal";
    ExtendedType[ExtendedType["Latitude_Double"] = 7144707] = "Latitude_Double";
    ExtendedType[ExtendedType["Longitude"] = 7209984] = "Longitude";
    ExtendedType[ExtendedType["Longitude_Decimal"] = 7210242] = "Longitude_Decimal";
    ExtendedType[ExtendedType["Longitude_Double"] = 7210243] = "Longitude_Double";
    // Miscellaneous
    ExtendedType[ExtendedType["Image"] = 13109259] = "Image";
    ExtendedType[ExtendedType["ImageUrl"] = 13174785] = "ImageUrl";
    ExtendedType[ExtendedType["WebUrl"] = 13240321] = "WebUrl";
    ExtendedType[ExtendedType["Barcode"] = 13305856] = "Barcode";
    ExtendedType[ExtendedType["Barcode_Text"] = 13305857] = "Barcode_Text";
    ExtendedType[ExtendedType["Barcode_Integer"] = 13306116] = "Barcode_Integer";
    // Formatting
    ExtendedType[ExtendedType["Color"] = 19664897] = "Color";
    ExtendedType[ExtendedType["FormatString"] = 19730433] = "FormatString";
    ExtendedType[ExtendedType["Alignment"] = 20058113] = "Alignment";
    ExtendedType[ExtendedType["LabelDisplayUnits"] = 20123649] = "LabelDisplayUnits";
    ExtendedType[ExtendedType["FontSize"] = 20189443] = "FontSize";
    ExtendedType[ExtendedType["LabelDensity"] = 20254979] = "LabelDensity";
    // Enumeration
    ExtendedType[ExtendedType["Enumeration"] = 26214401] = "Enumeration";
    // Scripting
    ExtendedType[ExtendedType["ScriptSource"] = 32776193] = "ScriptSource";
    // NOTE: To avoid confusion, underscores should be used only to delimit primitive type variants of an extended type
    // (e.g. Year_Integer or Latitude_Double above)
    // Operations
    ExtendedType[ExtendedType["SearchEnabled"] = 65541] = "SearchEnabled";
})(ExtendedType || (ExtendedType = {}));
var ExtendedTypeStrings;
(function (ExtendedTypeStrings) {
    ExtendedTypeStrings[ExtendedTypeStrings["Numeric"] = 256] = "Numeric";
    ExtendedTypeStrings[ExtendedTypeStrings["Temporal"] = 512] = "Temporal";
    ExtendedTypeStrings[ExtendedTypeStrings["Geography"] = 1024] = "Geography";
    ExtendedTypeStrings[ExtendedTypeStrings["Miscellaneous"] = 2048] = "Miscellaneous";
    ExtendedTypeStrings[ExtendedTypeStrings["Formatting"] = 4096] = "Formatting";
    ExtendedTypeStrings[ExtendedTypeStrings["Scripting"] = 8192] = "Scripting";
    ExtendedTypeStrings[ExtendedTypeStrings["Null"] = 0] = "Null";
    ExtendedTypeStrings[ExtendedTypeStrings["Text"] = 1] = "Text";
    ExtendedTypeStrings[ExtendedTypeStrings["Decimal"] = 258] = "Decimal";
    ExtendedTypeStrings[ExtendedTypeStrings["Double"] = 259] = "Double";
    ExtendedTypeStrings[ExtendedTypeStrings["Integer"] = 260] = "Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["Boolean"] = 5] = "Boolean";
    ExtendedTypeStrings[ExtendedTypeStrings["Date"] = 518] = "Date";
    ExtendedTypeStrings[ExtendedTypeStrings["DateTime"] = 519] = "DateTime";
    ExtendedTypeStrings[ExtendedTypeStrings["DateTimeZone"] = 520] = "DateTimeZone";
    ExtendedTypeStrings[ExtendedTypeStrings["Time"] = 521] = "Time";
    ExtendedTypeStrings[ExtendedTypeStrings["Duration"] = 10] = "Duration";
    ExtendedTypeStrings[ExtendedTypeStrings["Binary"] = 11] = "Binary";
    ExtendedTypeStrings[ExtendedTypeStrings["None"] = 12] = "None";
    ExtendedTypeStrings[ExtendedTypeStrings["Variant"] = 13] = "Variant";
    ExtendedTypeStrings[ExtendedTypeStrings["Years"] = 66048] = "Years";
    ExtendedTypeStrings[ExtendedTypeStrings["Years_Text"] = 66049] = "Years_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["Years_Integer"] = 66308] = "Years_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["Years_Date"] = 66054] = "Years_Date";
    ExtendedTypeStrings[ExtendedTypeStrings["Years_DateTime"] = 66055] = "Years_DateTime";
    ExtendedTypeStrings[ExtendedTypeStrings["Months"] = 131584] = "Months";
    ExtendedTypeStrings[ExtendedTypeStrings["Months_Text"] = 131585] = "Months_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["Months_Integer"] = 131844] = "Months_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["Months_Date"] = 131590] = "Months_Date";
    ExtendedTypeStrings[ExtendedTypeStrings["Months_DateTime"] = 131591] = "Months_DateTime";
    ExtendedTypeStrings[ExtendedTypeStrings["PaddedDateTableDates"] = 197127] = "PaddedDateTableDates";
    ExtendedTypeStrings[ExtendedTypeStrings["Quarters"] = 262656] = "Quarters";
    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_Text"] = 262657] = "Quarters_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_Integer"] = 262916] = "Quarters_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_Date"] = 262662] = "Quarters_Date";
    ExtendedTypeStrings[ExtendedTypeStrings["Quarters_DateTime"] = 262663] = "Quarters_DateTime";
    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth"] = 328192] = "DayOfMonth";
    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_Text"] = 328193] = "DayOfMonth_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_Integer"] = 328452] = "DayOfMonth_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_Date"] = 328198] = "DayOfMonth_Date";
    ExtendedTypeStrings[ExtendedTypeStrings["DayOfMonth_DateTime"] = 328199] = "DayOfMonth_DateTime";
    ExtendedTypeStrings[ExtendedTypeStrings["Address"] = 6554625] = "Address";
    ExtendedTypeStrings[ExtendedTypeStrings["City"] = 6620161] = "City";
    ExtendedTypeStrings[ExtendedTypeStrings["Continent"] = 6685697] = "Continent";
    ExtendedTypeStrings[ExtendedTypeStrings["Country"] = 6751233] = "Country";
    ExtendedTypeStrings[ExtendedTypeStrings["County"] = 6816769] = "County";
    ExtendedTypeStrings[ExtendedTypeStrings["Region"] = 6882305] = "Region";
    ExtendedTypeStrings[ExtendedTypeStrings["PostalCode"] = 6947840] = "PostalCode";
    ExtendedTypeStrings[ExtendedTypeStrings["PostalCode_Text"] = 6947841] = "PostalCode_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["PostalCode_Integer"] = 6948100] = "PostalCode_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["StateOrProvince"] = 7013377] = "StateOrProvince";
    ExtendedTypeStrings[ExtendedTypeStrings["Place"] = 7078913] = "Place";
    ExtendedTypeStrings[ExtendedTypeStrings["Latitude"] = 7144448] = "Latitude";
    ExtendedTypeStrings[ExtendedTypeStrings["Latitude_Decimal"] = 7144706] = "Latitude_Decimal";
    ExtendedTypeStrings[ExtendedTypeStrings["Latitude_Double"] = 7144707] = "Latitude_Double";
    ExtendedTypeStrings[ExtendedTypeStrings["Longitude"] = 7209984] = "Longitude";
    ExtendedTypeStrings[ExtendedTypeStrings["Longitude_Decimal"] = 7210242] = "Longitude_Decimal";
    ExtendedTypeStrings[ExtendedTypeStrings["Longitude_Double"] = 7210243] = "Longitude_Double";
    ExtendedTypeStrings[ExtendedTypeStrings["Image"] = 13109259] = "Image";
    ExtendedTypeStrings[ExtendedTypeStrings["ImageUrl"] = 13174785] = "ImageUrl";
    ExtendedTypeStrings[ExtendedTypeStrings["WebUrl"] = 13240321] = "WebUrl";
    ExtendedTypeStrings[ExtendedTypeStrings["Barcode"] = 13305856] = "Barcode";
    ExtendedTypeStrings[ExtendedTypeStrings["Barcode_Text"] = 13305857] = "Barcode_Text";
    ExtendedTypeStrings[ExtendedTypeStrings["Barcode_Integer"] = 13306116] = "Barcode_Integer";
    ExtendedTypeStrings[ExtendedTypeStrings["Color"] = 19664897] = "Color";
    ExtendedTypeStrings[ExtendedTypeStrings["FormatString"] = 19730433] = "FormatString";
    ExtendedTypeStrings[ExtendedTypeStrings["Alignment"] = 20058113] = "Alignment";
    ExtendedTypeStrings[ExtendedTypeStrings["LabelDisplayUnits"] = 20123649] = "LabelDisplayUnits";
    ExtendedTypeStrings[ExtendedTypeStrings["FontSize"] = 20189443] = "FontSize";
    ExtendedTypeStrings[ExtendedTypeStrings["LabelDensity"] = 20254979] = "LabelDensity";
    ExtendedTypeStrings[ExtendedTypeStrings["Enumeration"] = 26214401] = "Enumeration";
    ExtendedTypeStrings[ExtendedTypeStrings["ScriptSource"] = 32776193] = "ScriptSource";
    ExtendedTypeStrings[ExtendedTypeStrings["SearchEnabled"] = 65541] = "SearchEnabled";
})(ExtendedTypeStrings || (ExtendedTypeStrings = {}));
const PrimitiveTypeMask = 0xFF;
const PrimitiveTypeWithFlagsMask = 0xFFFF;
const PrimitiveTypeFlagsExcludedMask = 0xFFFF0000;
function getPrimitiveType(extendedType) {
    return extendedType & PrimitiveTypeMask;
}
function isPrimitiveType(extendedType) {
    return (extendedType & PrimitiveTypeWithFlagsMask) === extendedType;
}
function getCategoryFromExtendedType(extendedType) {
    if (isPrimitiveType(extendedType))
        return null;
    let category = ExtendedTypeStrings[extendedType];
    if (category) {
        // Check for ExtendedType declaration without a primitive type.
        // If exists, use it as category (e.g. Longitude rather than Longitude_Double)
        // Otherwise use the ExtendedType declaration with a primitive type (e.g. Address)
        const delimIdx = category.lastIndexOf("_");
        if (delimIdx > 0) {
            const baseCategory = category.slice(0, delimIdx);
            if (ExtendedTypeStrings[baseCategory]) {
                category = baseCategory;
            }
        }
    }
    return category || null;
}
function toExtendedType(primitiveType, category) {
    const primitiveString = PrimitiveTypeStrings[primitiveType];
    let t = ExtendedTypeStrings[primitiveString];
    if (t == null) {
        t = ExtendedType.Null;
    }
    if (primitiveType && category) {
        let categoryType = ExtendedTypeStrings[category];
        if (categoryType) {
            const categoryPrimitiveType = getPrimitiveType(categoryType);
            if (categoryPrimitiveType === PrimitiveType.Null) {
                // Category supports multiple primitive types, check if requested primitive type is supported
                // (note: important to use t here rather than primitiveType as it may include primitive type flags)
                categoryType = t | categoryType;
                if (ExtendedTypeStrings[categoryType]) {
                    t = categoryType;
                }
            }
            else if (categoryPrimitiveType === primitiveType) {
                // Primitive type matches the single supported type for the category
                t = categoryType;
            }
        }
    }
    return t;
}
function matchesExtendedTypeWithAnyPrimitive(a, b) {
    return (a & PrimitiveTypeFlagsExcludedMask) === (b & PrimitiveTypeFlagsExcludedMask);
}
//# sourceMappingURL=valueType.js.map

/***/ }),

/***/ 6265:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.locales = void 0;
exports.locales = {"ar-SA":["ar-SA","default",{"name":"ar-SA","englishName":"Arabic (Saudi Arabia)","nativeName":"العربية (المملكة العربية السعودية)","language":"ar","isRTL":true,"numberFormat":{"pattern":["n-"],"currency":{"pattern":["$n-","$ n"],"symbol":"ر.س.‏"}},"calendars":{"standard":{"name":"UmAlQura","firstDay":6,"days":{"names":["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"namesAbbr":["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"namesShort":["ح","ن","ث","ر","خ","ج","س"]},"months":{"names":["محرم","صفر","ربيع الأول","ربيع الثاني","جمادى الأولى","جمادى الثانية","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة",""],"namesAbbr":["محرم","صفر","ربيع الأول","ربيع الثاني","جمادى الأولى","جمادى الثانية","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة",""]},"AM":["ص","ص","ص"],"PM":["م","م","م"],"eras":[{"name":"بعد الهجرة","start":null,"offset":0}],"twoDigitYearMax":1451,"patterns":{"d":"dd/MM/yy","D":"dd/MMMM/yyyy","t":"hh:mm tt","T":"hh:mm:ss tt","f":"dd/MMMM/yyyy hh:mm tt","F":"dd/MMMM/yyyy hh:mm:ss tt","M":"dd MMMM"},"convert":{"_yearInfo":[[746,-2198707200000],[1769,-2168121600000],[3794,-2137449600000],[3748,-2106777600000],[3402,-2076192000000],[2710,-2045606400000],[1334,-2015020800000],[2741,-1984435200000],[3498,-1953763200000],[2980,-1923091200000],[2889,-1892505600000],[2707,-1861920000000],[1323,-1831334400000],[2647,-1800748800000],[1206,-1770076800000],[2741,-1739491200000],[1450,-1708819200000],[3413,-1678233600000],[3370,-1647561600000],[2646,-1616976000000],[1198,-1586390400000],[2397,-1555804800000],[748,-1525132800000],[1749,-1494547200000],[1706,-1463875200000],[1365,-1433289600000],[1195,-1402704000000],[2395,-1372118400000],[698,-1341446400000],[1397,-1310860800000],[2994,-1280188800000],[1892,-1249516800000],[1865,-1218931200000],[1621,-1188345600000],[683,-1157760000000],[1371,-1127174400000],[2778,-1096502400000],[1748,-1065830400000],[3785,-1035244800000],[3474,-1004572800000],[3365,-973987200000],[2637,-943401600000],[685,-912816000000],[1389,-882230400000],[2922,-851558400000],[2898,-820886400000],[2725,-790300800000],[2635,-759715200000],[1175,-729129600000],[2359,-698544000000],[694,-667872000000],[1397,-637286400000],[3434,-606614400000],[3410,-575942400000],[2710,-545356800000],[2349,-514771200000],[605,-484185600000],[1245,-453600000000],[2778,-422928000000],[1492,-392256000000],[3497,-361670400000],[3410,-330998400000],[2730,-300412800000],[1238,-269827200000],[2486,-239241600000],[884,-208569600000],[1897,-177984000000],[1874,-147312000000],[1701,-116726400000],[1355,-86140800000],[2731,-55555200000],[1370,-24883200000],[2773,5702400000],[3538,36374400000],[3492,67046400000],[3401,97632000000],[2709,128217600000],[1325,158803200000],[2653,189388800000],[1370,220060800000],[2773,250646400000],[1706,281318400000],[1685,311904000000],[1323,342489600000],[2647,373075200000],[1198,403747200000],[2422,434332800000],[1388,465004800000],[2901,495590400000],[2730,526262400000],[2645,556848000000],[1197,587433600000],[2397,618019200000],[730,648691200000],[1497,679276800000],[3506,709948800000],[2980,740620800000],[2890,771206400000],[2645,801792000000],[693,832377600000],[1397,862963200000],[2922,893635200000],[3026,924307200000],[3012,954979200000],[2953,985564800000],[2709,1016150400000],[1325,1046736000000],[1453,1077321600000],[2922,1107993600000],[1748,1138665600000],[3529,1169251200000],[3474,1199923200000],[2726,1230508800000],[2390,1261094400000],[686,1291680000000],[1389,1322265600000],[874,1352937600000],[2901,1383523200000],[2730,1414195200000],[2381,1444780800000],[1181,1475366400000],[2397,1505952000000],[698,1536624000000],[1461,1567209600000],[1450,1597881600000],[3413,1628467200000],[2714,1659139200000],[2350,1689724800000],[622,1720310400000],[1373,1750896000000],[2778,1781568000000],[1748,1812240000000],[1701,1842825600000],[0,1873411200000]],"minDate":-2198707200000,"maxDate":1873411199999}},"Hijri":{"name":"Hijri","firstDay":6,"days":{"names":["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"namesAbbr":["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"namesShort":["ح","ن","ث","ر","خ","ج","س"]},"months":{"names":["محرم","صفر","ربيع الأول","ربيع الثاني","جمادى الأولى","جمادى الثانية","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة",""],"namesAbbr":["محرم","صفر","ربيع الأول","ربيع الثاني","جمادى الأولى","جمادى الثانية","رجب","شعبان","رمضان","شوال","ذو القعدة","ذو الحجة",""]},"AM":["ص","ص","ص"],"PM":["م","م","م"],"eras":[{"name":"بعد الهجرة","start":null,"offset":0}],"twoDigitYearMax":1451,"patterns":{"d":"dd/MM/yy","D":"dd/MM/yyyy","t":"hh:mm tt","T":"hh:mm:ss tt","f":"dd/MM/yyyy hh:mm tt","F":"dd/MM/yyyy hh:mm:ss tt","M":"dd MMMM"},"convert":{"ticks1970":62135596800000,"monthDays":[0,30,59,89,118,148,177,207,236,266,295,325,355],"minDate":-42521673600000,"maxDate":253402300799999,"hijriAdjustment":0}},"Gregorian_MiddleEastFrench":{"name":"Gregorian_MiddleEastFrench","firstDay":6,"days":{"names":["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],"namesAbbr":["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],"namesShort":["di","lu","ma","me","je","ve","sa"]},"months":{"names":["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre",""],"namesAbbr":["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc.",""]},"AM":["ص","ص","ص"],"PM":["م","م","م"],"eras":[{"name":"ap. J.-C.","start":null,"offset":0}],"patterns":{"d":"MM/dd/yyyy","t":"hh:mm tt","T":"hh:mm:ss tt","f":"dddd, MMMM dd, yyyy hh:mm tt","F":"dddd, MMMM dd, yyyy hh:mm:ss tt","M":"dd MMMM"}},"Gregorian_Arabic":{"name":"Gregorian_Arabic","firstDay":6,"days":{"names":["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"namesAbbr":["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"namesShort":["ح","ن","ث","ر","خ","ج","س"]},"months":{"names":["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول",""],"namesAbbr":["كانون الثاني","شباط","آذار","نيسان","أيار","حزيران","تموز","آب","أيلول","تشرين الأول","تشرين الثاني","كانون الأول",""]},"AM":["ص","ص","ص"],"PM":["م","م","م"],"eras":[{"name":"م","start":null,"offset":0}],"patterns":{"d":"MM/dd/yyyy","t":"hh:mm tt","T":"hh:mm:ss tt","f":"dddd, MMMM dd, yyyy hh:mm tt","F":"dddd, MMMM dd, yyyy hh:mm:ss tt"}},"Gregorian_Localized":{"firstDay":6,"days":{"names":["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"namesAbbr":["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"namesShort":["ح","ن","ث","ر","خ","ج","س"]},"months":{"names":["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",""],"namesAbbr":["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",""]},"AM":["ص","ص","ص"],"PM":["م","م","م"],"patterns":{"d":"dd/MM/yyyy","D":"dd MMMM, yyyy","t":"hh:mm tt","T":"hh:mm:ss tt","f":"dd MMMM, yyyy hh:mm tt","F":"dd MMMM, yyyy hh:mm:ss tt","M":"dd MMMM"}},"Gregorian_TransliteratedFrench":{"name":"Gregorian_TransliteratedFrench","firstDay":6,"days":{"names":["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"namesAbbr":["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"],"namesShort":["ح","ن","ث","ر","خ","ج","س"]},"months":{"names":["جانفييه","فيفرييه","مارس","أفريل","مي","جوان","جوييه","أوت","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""],"namesAbbr":["جانفييه","فيفرييه","مارس","أفريل","مي","جوان","جوييه","أوت","سبتمبر","اكتوبر","نوفمبر","ديسمبر",""]},"AM":["ص","ص","ص"],"PM":["م","م","م"],"eras":[{"name":"م","start":null,"offset":0}],"patterns":{"d":"MM/dd/yyyy","t":"hh:mm tt","T":"hh:mm:ss tt","f":"dddd, MMMM dd, yyyy hh:mm tt","F":"dddd, MMMM dd, yyyy hh:mm:ss tt"}}}}],"bg-BG":["bg-BG","default",{"name":"bg-BG","englishName":"Bulgarian (Bulgaria)","nativeName":"български (България)","language":"bg","numberFormat":{",":" ",".":",","percent":{",":" ",".":","},"currency":{"pattern":["-n $","n $"],",":" ",".":",","symbol":"лв."}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["неделя","понеделник","вторник","сряда","четвъртък","петък","събота"],"namesAbbr":["нед","пон","вт","ср","четв","пет","съб"],"namesShort":["н","п","в","с","ч","п","с"]},"months":{"names":["януари","февруари","март","април","май","юни","юли","август","септември","октомври","ноември","декември",""],"namesAbbr":["ян","февр","март","апр","май","юни","юли","авг","септ","окт","ноември","дек",""]},"AM":null,"PM":null,"eras":[{"name":"след новата ера","start":null,"offset":0}],"patterns":{"d":"d.M.yyyy 'г.'","D":"dd MMMM yyyy 'г.'","t":"HH:mm 'ч.'","T":"HH:mm:ss 'ч.'","f":"dd MMMM yyyy 'г.' HH:mm 'ч.'","F":"dd MMMM yyyy 'г.' HH:mm:ss 'ч.'","M":"dd MMMM","Y":"MMMM yyyy 'г.'"}}}}],"ca-ES":["ca-ES","default",{"name":"ca-ES","englishName":"Catalan (Catalan)","nativeName":"català (català)","language":"ca","numberFormat":{",":".",".":",","percent":{",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"€"}},"calendars":{"standard":{"firstDay":1,"days":{"names":["diumenge","dilluns","dimarts","dimecres","dijous","divendres","dissabte"],"namesAbbr":["dg.","dl.","dt.","dc.","dj.","dv.","ds."],"namesShort":["dg","dl","dt","dc","dj","dv","ds"]},"months":{"names":["gener","febrer","març","abril","maig","juny","juliol","agost","setembre","octubre","novembre","desembre",""],"namesAbbr":["gen","feb","març","abr","maig","juny","jul","ag","set","oct","nov","des",""]},"AM":null,"PM":null,"eras":[{"name":"d.C.","start":null,"offset":0}],"patterns":{"d":"dd/MM/yyyy","D":"dddd, d' / 'MMMM' / 'yyyy","t":"HH:mm","T":"HH:mm:ss","f":"dddd, d' / 'MMMM' / 'yyyy HH:mm","F":"dddd, d' / 'MMMM' / 'yyyy HH:mm:ss","M":"dd MMMM","Y":"MMMM' / 'yyyy"}}}}],"zh-TW":["zh-TW","default",{"name":"zh-TW","englishName":"Chinese (Traditional, Taiwan)","nativeName":"中文(台灣)","language":"zh-CHT","numberFormat":{"percent":{"pattern":["-n%","n%"]},"currency":{"pattern":["-$n","$n"],"symbol":"NT$"}},"calendars":{"standard":{"days":{"names":["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],"namesAbbr":["週日","週一","週二","週三","週四","週五","週六"],"namesShort":["日","一","二","三","四","五","六"]},"months":{"names":["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月",""],"namesAbbr":["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月",""]},"AM":["上午","上午","上午"],"PM":["下午","下午","下午"],"eras":[{"name":"西元","start":null,"offset":0}],"patterns":{"d":"yyyy/M/d","D":"yyyy'年'M'月'd'日'","t":"tt hh:mm","T":"tt hh:mm:ss","f":"yyyy'年'M'月'd'日' tt hh:mm","F":"yyyy'年'M'月'd'日' tt hh:mm:ss","M":"M'月'd'日'","Y":"yyyy'年'M'月'"}},"Taiwan":{"name":"Taiwan","days":{"names":["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],"namesAbbr":["週日","週一","週二","週三","週四","週五","週六"],"namesShort":["日","一","二","三","四","五","六"]},"months":{"names":["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月",""],"namesAbbr":["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月",""]},"AM":["上午","上午","上午"],"PM":["下午","下午","下午"],"eras":[{"name":"","start":null,"offset":1911}],"twoDigitYearMax":99,"patterns":{"d":"yyyy/M/d","D":"yyyy'年'M'月'd'日'","t":"tt hh:mm","T":"tt hh:mm:ss","f":"yyyy'年'M'月'd'日' tt hh:mm","F":"yyyy'年'M'月'd'日' tt hh:mm:ss","M":"M'月'd'日'","Y":"yyyy'年'M'月'"}}}}],"cs-CZ":["cs-CZ","default",{"name":"cs-CZ","englishName":"Czech (Czech Republic)","nativeName":"čeština (Česká republika)","language":"cs","numberFormat":{",":" ",".":",","percent":{"pattern":["-n%","n%"],",":" ",".":","},"currency":{"pattern":["-n $","n $"],",":" ",".":",","symbol":"Kč"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["neděle","pondělí","úterý","středa","čtvrtek","pátek","sobota"],"namesAbbr":["ne","po","út","st","čt","pá","so"],"namesShort":["ne","po","út","st","čt","pá","so"]},"months":{"names":["leden","únor","březen","duben","květen","červen","červenec","srpen","září","říjen","listopad","prosinec",""],"namesAbbr":["1","2","3","4","5","6","7","8","9","10","11","12",""]},"monthsGenitive":{"names":["ledna","února","března","dubna","května","června","července","srpna","září","října","listopadu","prosince",""],"namesAbbr":["1","2","3","4","5","6","7","8","9","10","11","12",""]},"AM":["dop.","dop.","DOP."],"PM":["odp.","odp.","ODP."],"eras":[{"name":"n. l.","start":null,"offset":0}],"patterns":{"d":"d.M.yyyy","D":"d. MMMM yyyy","t":"H:mm","T":"H:mm:ss","f":"d. MMMM yyyy H:mm","F":"d. MMMM yyyy H:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"da-DK":["da-DK","default",{"name":"da-DK","englishName":"Danish (Denmark)","nativeName":"dansk (Danmark)","language":"da","numberFormat":{",":".",".":",","percent":{",":".",".":","},"currency":{"pattern":["$ -n","$ n"],",":".",".":",","symbol":"kr."}},"calendars":{"standard":{"/":"-","firstDay":1,"days":{"names":["søndag","mandag","tirsdag","onsdag","torsdag","fredag","lørdag"],"namesAbbr":["sø","ma","ti","on","to","fr","lø"],"namesShort":["sø","ma","ti","on","to","fr","lø"]},"months":{"names":["januar","februar","marts","april","maj","juni","juli","august","september","oktober","november","december",""],"namesAbbr":["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec",""]},"AM":null,"PM":null,"patterns":{"d":"dd-MM-yyyy","D":"d. MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"d. MMMM yyyy HH:mm","F":"d. MMMM yyyy HH:mm:ss","M":"d. MMMM","Y":"MMMM yyyy"}}}}],"de-DE":["de-DE","default",{"name":"de-DE","englishName":"German (Germany)","nativeName":"Deutsch (Deutschland)","language":"de","numberFormat":{",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"€"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"],"namesAbbr":["So","Mo","Di","Mi","Do","Fr","Sa"],"namesShort":["So","Mo","Di","Mi","Do","Fr","Sa"]},"months":{"names":["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember",""],"namesAbbr":["Jan","Feb","Mrz","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez",""]},"AM":null,"PM":null,"eras":[{"name":"n. Chr.","start":null,"offset":0}],"patterns":{"d":"dd.MM.yyyy","D":"dddd, d. MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"dddd, d. MMMM yyyy HH:mm","F":"dddd, d. MMMM yyyy HH:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"el-GR":["el-GR","default",{"name":"el-GR","englishName":"Greek (Greece)","nativeName":"Ελληνικά (Ελλάδα)","language":"el","numberFormat":{",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"€"}},"calendars":{"standard":{"firstDay":1,"days":{"names":["Κυριακή","Δευτέρα","Τρίτη","Τετάρτη","Πέμπτη","Παρασκευή","Σάββατο"],"namesAbbr":["Κυρ","Δευ","Τρι","Τετ","Πεμ","Παρ","Σαβ"],"namesShort":["Κυ","Δε","Τρ","Τε","Πε","Πα","Σά"]},"months":{"names":["Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος","Μάιος","Ιούνιος","Ιούλιος","Αύγουστος","Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος",""],"namesAbbr":["Ιαν","Φεβ","Μαρ","Απρ","Μαϊ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ",""]},"monthsGenitive":{"names":["Ιανουαρίου","Φεβρουαρίου","Μαρτίου","Απριλίου","Μαΐου","Ιουνίου","Ιουλίου","Αυγούστου","Σεπτεμβρίου","Οκτωβρίου","Νοεμβρίου","Δεκεμβρίου",""],"namesAbbr":["Ιαν","Φεβ","Μαρ","Απρ","Μαϊ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ",""]},"AM":["πμ","πμ","ΠΜ"],"PM":["μμ","μμ","ΜΜ"],"eras":[{"name":"μ.Χ.","start":null,"offset":0}],"patterns":{"d":"d/M/yyyy","D":"dddd, d MMMM yyyy","f":"dddd, d MMMM yyyy h:mm tt","F":"dddd, d MMMM yyyy h:mm:ss tt","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"en-US":["en-US","default",{"englishName":"English (United States)"}],"fi-FI":["fi-FI","default",{"name":"fi-FI","englishName":"Finnish (Finland)","nativeName":"suomi (Suomi)","language":"fi","numberFormat":{",":" ",".":",","percent":{",":" ",".":","},"currency":{"pattern":["-n $","n $"],",":" ",".":",","symbol":"€"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["sunnuntai","maanantai","tiistai","keskiviikko","torstai","perjantai","lauantai"],"namesAbbr":["su","ma","ti","ke","to","pe","la"],"namesShort":["su","ma","ti","ke","to","pe","la"]},"months":{"names":["tammikuu","helmikuu","maaliskuu","huhtikuu","toukokuu","kesäkuu","heinäkuu","elokuu","syyskuu","lokakuu","marraskuu","joulukuu",""],"namesAbbr":["tammi","helmi","maalis","huhti","touko","kesä","heinä","elo","syys","loka","marras","joulu",""]},"AM":null,"PM":null,"patterns":{"d":"d.M.yyyy","D":"d. MMMM'ta 'yyyy","t":"H:mm","T":"H:mm:ss","f":"d. MMMM'ta 'yyyy H:mm","F":"d. MMMM'ta 'yyyy H:mm:ss","M":"d. MMMM'ta'","Y":"MMMM yyyy"}}}}],"fr-FR":["fr-FR","default",{"name":"fr-FR","englishName":"French (France)","nativeName":"français (France)","language":"fr","numberFormat":{",":" ",".":",","percent":{",":" ",".":","},"currency":{"pattern":["-n $","n $"],",":" ",".":",","symbol":"€"}},"calendars":{"standard":{"firstDay":1,"days":{"names":["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"],"namesAbbr":["dim.","lun.","mar.","mer.","jeu.","ven.","sam."],"namesShort":["di","lu","ma","me","je","ve","sa"]},"months":{"names":["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre",""],"namesAbbr":["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc.",""]},"AM":null,"PM":null,"eras":[{"name":"ap. J.-C.","start":null,"offset":0}],"patterns":{"d":"dd/MM/yyyy","D":"dddd d MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"dddd d MMMM yyyy HH:mm","F":"dddd d MMMM yyyy HH:mm:ss","M":"d MMMM","Y":"MMMM yyyy"}}}}],"he-IL":["he-IL","default",{"name":"he-IL","englishName":"Hebrew (Israel)","nativeName":"עברית (ישראל)","language":"he","isRTL":true,"numberFormat":{"percent":{"pattern":["-n%","n%"]},"currency":{"pattern":["$-n","$ n"],"symbol":"₪"}},"calendars":{"standard":{"days":{"names":["יום ראשון","יום שני","יום שלישי","יום רביעי","יום חמישי","יום שישי","שבת"],"namesAbbr":["יום א","יום ב","יום ג","יום ד","יום ה","יום ו","שבת"],"namesShort":["א","ב","ג","ד","ה","ו","ש"]},"months":{"names":["ינואר","פברואר","מרץ","אפריל","מאי","יוני","יולי","אוגוסט","ספטמבר","אוקטובר","נובמבר","דצמבר",""],"namesAbbr":["ינו","פבר","מרץ","אפר","מאי","יונ","יול","אוג","ספט","אוק","נוב","דצמ",""]},"eras":[{"name":"לספירה","start":null,"offset":0}],"patterns":{"d":"dd/MM/yyyy","D":"dddd dd MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"dddd dd MMMM yyyy HH:mm","F":"dddd dd MMMM yyyy HH:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}},"Hebrew":{"name":"Hebrew","/":" ","days":{"names":["יום ראשון","יום שני","יום שלישי","יום רביעי","יום חמישי","יום שישי","שבת"],"namesAbbr":["א","ב","ג","ד","ה","ו","ש"],"namesShort":["א","ב","ג","ד","ה","ו","ש"]},"months":{"names":["תשרי","חשון","כסלו","טבת","שבט","אדר","אדר ב","ניסן","אייר","סיון","תמוז","אב","אלול"],"namesAbbr":["תשרי","חשון","כסלו","טבת","שבט","אדר","אדר ב","ניסן","אייר","סיון","תמוז","אב","אלול"]},"eras":[{"name":"C.E.","start":null,"offset":0}],"twoDigitYearMax":5790,"patterns":{"d":"dd MMMM yyyy","D":"dddd dd MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"dddd dd MMMM yyyy HH:mm","F":"dddd dd MMMM yyyy HH:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"hu-HU":["hu-HU","default",{"name":"hu-HU","englishName":"Hungarian (Hungary)","nativeName":"magyar (Magyarország)","language":"hu","numberFormat":{",":" ",".":",","percent":{",":" ",".":","},"currency":{"pattern":["-n $","n $"],",":" ",".":",","symbol":"Ft"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["vasárnap","hétfő","kedd","szerda","csütörtök","péntek","szombat"],"namesAbbr":["V","H","K","Sze","Cs","P","Szo"],"namesShort":["V","H","K","Sze","Cs","P","Szo"]},"months":{"names":["január","február","március","április","május","június","július","augusztus","szeptember","október","november","december",""],"namesAbbr":["jan.","febr.","márc.","ápr.","máj.","jún.","júl.","aug.","szept.","okt.","nov.","dec.",""]},"AM":["de.","de.","DE."],"PM":["du.","du.","DU."],"eras":[{"name":"i.sz.","start":null,"offset":0}],"patterns":{"d":"yyyy.MM.dd.","D":"yyyy. MMMM d.","t":"H:mm","T":"H:mm:ss","f":"yyyy. MMMM d. H:mm","F":"yyyy. MMMM d. H:mm:ss","M":"MMMM d.","Y":"yyyy. MMMM"}}}}],"it-IT":["it-IT","default",{"name":"it-IT","englishName":"Italian (Italy)","nativeName":"italiano (Italia)","language":"it","numberFormat":{",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-$ n","$ n"],",":".",".":",","symbol":"€"}},"calendars":{"standard":{"firstDay":1,"days":{"names":["domenica","lunedì","martedì","mercoledì","giovedì","venerdì","sabato"],"namesAbbr":["dom","lun","mar","mer","gio","ven","sab"],"namesShort":["do","lu","ma","me","gi","ve","sa"]},"months":{"names":["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre",""],"namesAbbr":["gen","feb","mar","apr","mag","giu","lug","ago","set","ott","nov","dic",""]},"AM":null,"PM":null,"eras":[{"name":"d.C.","start":null,"offset":0}],"patterns":{"d":"dd/MM/yyyy","D":"dddd d MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"dddd d MMMM yyyy HH:mm","F":"dddd d MMMM yyyy HH:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"ja-JP":["ja-JP","default",{"name":"ja-JP","englishName":"Japanese (Japan)","nativeName":"日本語 (日本)","language":"ja","numberFormat":{"percent":{"pattern":["-n%","n%"]},"currency":{"pattern":["-$n","$n"],"decimals":0,"symbol":"¥"}},"calendars":{"standard":{"days":{"names":["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],"namesAbbr":["日","月","火","水","木","金","土"],"namesShort":["日","月","火","水","木","金","土"]},"months":{"names":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月",""],"namesAbbr":["1","2","3","4","5","6","7","8","9","10","11","12",""]},"AM":["午前","午前","午前"],"PM":["午後","午後","午後"],"eras":[{"name":"西暦","start":null,"offset":0}],"patterns":{"d":"yyyy/MM/dd","D":"yyyy'年'M'月'd'日'","t":"H:mm","T":"H:mm:ss","f":"yyyy'年'M'月'd'日' H:mm","F":"yyyy'年'M'月'd'日' H:mm:ss","M":"M'月'd'日'","Y":"yyyy'年'M'月'"}},"Japanese":{"name":"Japanese","days":{"names":["日曜日","月曜日","火曜日","水曜日","木曜日","金曜日","土曜日"],"namesAbbr":["日","月","火","水","木","金","土"],"namesShort":["日","月","火","水","木","金","土"]},"months":{"names":["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月",""],"namesAbbr":["1","2","3","4","5","6","7","8","9","10","11","12",""]},"AM":["午前","午前","午前"],"PM":["午後","午後","午後"],"eras":[{"name":"平成","start":null,"offset":1867},{"name":"昭和","start":-1812153600000,"offset":1911},{"name":"大正","start":-1357603200000,"offset":1925},{"name":"明治","start":60022080000,"offset":1988}],"twoDigitYearMax":99,"patterns":{"d":"gg y/M/d","D":"gg y'年'M'月'd'日'","t":"H:mm","T":"H:mm:ss","f":"gg y'年'M'月'd'日' H:mm","F":"gg y'年'M'月'd'日' H:mm:ss","M":"M'月'd'日'","Y":"gg y'年'M'月'"}}}}],"ko-KR":["ko-KR","default",{"name":"ko-KR","englishName":"Korean (Korea)","nativeName":"한국어 (대한민국)","language":"ko","numberFormat":{"currency":{"pattern":["-$n","$n"],"decimals":0,"symbol":"₩"}},"calendars":{"standard":{"/":"-","days":{"names":["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],"namesAbbr":["일","월","화","수","목","금","토"],"namesShort":["일","월","화","수","목","금","토"]},"months":{"names":["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월",""],"namesAbbr":["1","2","3","4","5","6","7","8","9","10","11","12",""]},"AM":["오전","오전","오전"],"PM":["오후","오후","오후"],"eras":[{"name":"서기","start":null,"offset":0}],"patterns":{"d":"yyyy-MM-dd","D":"yyyy'년' M'월' d'일' dddd","t":"tt h:mm","T":"tt h:mm:ss","f":"yyyy'년' M'월' d'일' dddd tt h:mm","F":"yyyy'년' M'월' d'일' dddd tt h:mm:ss","M":"M'월' d'일'","Y":"yyyy'년' M'월'"}},"Korean":{"name":"Korean","/":"-","days":{"names":["일요일","월요일","화요일","수요일","목요일","금요일","토요일"],"namesAbbr":["일","월","화","수","목","금","토"],"namesShort":["일","월","화","수","목","금","토"]},"months":{"names":["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월",""],"namesAbbr":["1","2","3","4","5","6","7","8","9","10","11","12",""]},"AM":["오전","오전","오전"],"PM":["오후","오후","오후"],"eras":[{"name":"단기","start":null,"offset":-2333}],"twoDigitYearMax":4362,"patterns":{"d":"gg yyyy-MM-dd","D":"gg yyyy'년' M'월' d'일' dddd","t":"tt h:mm","T":"tt h:mm:ss","f":"gg yyyy'년' M'월' d'일' dddd tt h:mm","F":"gg yyyy'년' M'월' d'일' dddd tt h:mm:ss","M":"M'월' d'일'","Y":"gg yyyy'년' M'월'"}}}}],"nl-NL":["nl-NL","default",{"name":"nl-NL","englishName":"Dutch (Netherlands)","nativeName":"Nederlands (Nederland)","language":"nl","numberFormat":{",":".",".":",","percent":{",":".",".":","},"currency":{"pattern":["$ -n","$ n"],",":".",".":",","symbol":"€"}},"calendars":{"standard":{"/":"-","firstDay":1,"days":{"names":["zondag","maandag","dinsdag","woensdag","donderdag","vrijdag","zaterdag"],"namesAbbr":["zo","ma","di","wo","do","vr","za"],"namesShort":["zo","ma","di","wo","do","vr","za"]},"months":{"names":["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december",""],"namesAbbr":["jan","feb","mrt","apr","mei","jun","jul","aug","sep","okt","nov","dec",""]},"AM":null,"PM":null,"patterns":{"d":"d-M-yyyy","D":"dddd d MMMM yyyy","t":"H:mm","T":"H:mm:ss","f":"dddd d MMMM yyyy H:mm","F":"dddd d MMMM yyyy H:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"nb-NO":["nb-NO","default",{"name":"nb-NO","englishName":"Norwegian, Bokmål (Norway)","nativeName":"norsk, bokmål (Norge)","language":"nb","numberFormat":{",":" ",".":",","percent":{",":" ",".":","},"currency":{"pattern":["$ -n","$ n"],",":" ",".":",","symbol":"kr"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["søndag","mandag","tirsdag","onsdag","torsdag","fredag","lørdag"],"namesAbbr":["sø","ma","ti","on","to","fr","lø"],"namesShort":["sø","ma","ti","on","to","fr","lø"]},"months":{"names":["januar","februar","mars","april","mai","juni","juli","august","september","oktober","november","desember",""],"namesAbbr":["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des",""]},"AM":null,"PM":null,"patterns":{"d":"dd.MM.yyyy","D":"d. MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"d. MMMM yyyy HH:mm","F":"d. MMMM yyyy HH:mm:ss","M":"d. MMMM","Y":"MMMM yyyy"}}}}],"pl-PL":["pl-PL","default",{"name":"pl-PL","englishName":"Polish (Poland)","nativeName":"polski (Polska)","language":"pl","numberFormat":{",":" ",".":",","percent":{"pattern":["-n%","n%"],",":" ",".":","},"currency":{"pattern":["-n $","n $"],",":" ",".":",","symbol":"zł"}},"calendars":{"standard":{"/":"-","firstDay":1,"days":{"names":["niedziela","poniedziałek","wtorek","środa","czwartek","piątek","sobota"],"namesAbbr":["N","Pn","Wt","Śr","Cz","Pt","So"],"namesShort":["N","Pn","Wt","Śr","Cz","Pt","So"]},"months":{"names":["styczeń","luty","marzec","kwiecień","maj","czerwiec","lipiec","sierpień","wrzesień","październik","listopad","grudzień",""],"namesAbbr":["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru",""]},"monthsGenitive":{"names":["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia",""],"namesAbbr":["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru",""]},"AM":null,"PM":null,"patterns":{"d":"yyyy-MM-dd","D":"d MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"d MMMM yyyy HH:mm","F":"d MMMM yyyy HH:mm:ss","M":"d MMMM","Y":"MMMM yyyy"}}}}],"pt-BR":["pt-BR","default",{"name":"pt-BR","englishName":"Portuguese (Brazil)","nativeName":"Português (Brasil)","language":"pt","numberFormat":{",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-$ n","$ n"],",":".",".":",","symbol":"R$"}},"calendars":{"standard":{"days":{"names":["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"],"namesAbbr":["dom","seg","ter","qua","qui","sex","sáb"],"namesShort":["D","S","T","Q","Q","S","S"]},"months":{"names":["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro",""],"namesAbbr":["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez",""]},"AM":null,"PM":null,"eras":[{"name":"d.C.","start":null,"offset":0}],"patterns":{"d":"dd/MM/yyyy","D":"dddd, d' de 'MMMM' de 'yyyy","t":"HH:mm","T":"HH:mm:ss","f":"dddd, d' de 'MMMM' de 'yyyy HH:mm","F":"dddd, d' de 'MMMM' de 'yyyy HH:mm:ss","M":"dd' de 'MMMM","Y":"MMMM' de 'yyyy"}}}}],"ro-RO":["ro-RO","default",{"name":"ro-RO","englishName":"Romanian (Romania)","nativeName":"română (România)","language":"ro","numberFormat":{",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"lei"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["duminică","luni","marţi","miercuri","joi","vineri","sâmbătă"],"namesAbbr":["D","L","Ma","Mi","J","V","S"],"namesShort":["D","L","Ma","Mi","J","V","S"]},"months":{"names":["ianuarie","februarie","martie","aprilie","mai","iunie","iulie","august","septembrie","octombrie","noiembrie","decembrie",""],"namesAbbr":["ian.","feb.","mar.","apr.","mai.","iun.","iul.","aug.","sep.","oct.","nov.","dec.",""]},"AM":null,"PM":null,"patterns":{"d":"dd.MM.yyyy","D":"d MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"d MMMM yyyy HH:mm","F":"d MMMM yyyy HH:mm:ss","M":"d MMMM","Y":"MMMM yyyy"}}}}],"ru-RU":["ru-RU","default",{"name":"ru-RU","englishName":"Russian (Russia)","nativeName":"русский (Россия)","language":"ru","numberFormat":{",":" ",".":",","percent":{"pattern":["-n%","n%"],",":" ",".":","},"currency":{"pattern":["-n$","n$"],",":" ",".":",","symbol":"р."}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"],"namesAbbr":["Вс","Пн","Вт","Ср","Чт","Пт","Сб"],"namesShort":["Вс","Пн","Вт","Ср","Чт","Пт","Сб"]},"months":{"names":["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь",""],"namesAbbr":["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек",""]},"monthsGenitive":{"names":["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря",""],"namesAbbr":["янв","фев","мар","апр","май","июн","июл","авг","сен","окт","ноя","дек",""]},"AM":null,"PM":null,"patterns":{"d":"dd.MM.yyyy","D":"d MMMM yyyy 'г.'","t":"H:mm","T":"H:mm:ss","f":"d MMMM yyyy 'г.' H:mm","F":"d MMMM yyyy 'г.' H:mm:ss","Y":"MMMM yyyy"}}}}],"hr-HR":["hr-HR","default",{"name":"hr-HR","englishName":"Croatian (Croatia)","nativeName":"hrvatski (Hrvatska)","language":"hr","numberFormat":{"pattern":["- n"],",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"kn"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["nedjelja","ponedjeljak","utorak","srijeda","četvrtak","petak","subota"],"namesAbbr":["ned","pon","uto","sri","čet","pet","sub"],"namesShort":["ne","po","ut","sr","če","pe","su"]},"months":{"names":["siječanj","veljača","ožujak","travanj","svibanj","lipanj","srpanj","kolovoz","rujan","listopad","studeni","prosinac",""],"namesAbbr":["sij","vlj","ožu","tra","svi","lip","srp","kol","ruj","lis","stu","pro",""]},"monthsGenitive":{"names":["siječnja","veljače","ožujka","travnja","svibnja","lipnja","srpnja","kolovoza","rujna","listopada","studenog","prosinca",""],"namesAbbr":["sij","vlj","ožu","tra","svi","lip","srp","kol","ruj","lis","stu","pro",""]},"AM":null,"PM":null,"patterns":{"d":"d.M.yyyy.","D":"d. MMMM yyyy.","t":"H:mm","T":"H:mm:ss","f":"d. MMMM yyyy. H:mm","F":"d. MMMM yyyy. H:mm:ss","M":"d. MMMM"}}}}],"sk-SK":["sk-SK","default",{"name":"sk-SK","englishName":"Slovak (Slovakia)","nativeName":"slovenčina (Slovenská republika)","language":"sk","numberFormat":{",":" ",".":",","percent":{"pattern":["-n%","n%"],",":" ",".":","},"currency":{"pattern":["-n $","n $"],",":" ",".":",","symbol":"€"}},"calendars":{"standard":{"/":". ","firstDay":1,"days":{"names":["nedeľa","pondelok","utorok","streda","štvrtok","piatok","sobota"],"namesAbbr":["ne","po","ut","st","št","pi","so"],"namesShort":["ne","po","ut","st","št","pi","so"]},"months":{"names":["január","február","marec","apríl","máj","jún","júl","august","september","október","november","december",""],"namesAbbr":["1","2","3","4","5","6","7","8","9","10","11","12",""]},"monthsGenitive":{"names":["januára","februára","marca","apríla","mája","júna","júla","augusta","septembra","októbra","novembra","decembra",""],"namesAbbr":["1","2","3","4","5","6","7","8","9","10","11","12",""]},"AM":null,"PM":null,"eras":[{"name":"n. l.","start":null,"offset":0}],"patterns":{"d":"d. M. yyyy","D":"d. MMMM yyyy","t":"H:mm","T":"H:mm:ss","f":"d. MMMM yyyy H:mm","F":"d. MMMM yyyy H:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"sv-SE":["sv-SE","default",{"name":"sv-SE","englishName":"Swedish (Sweden)","nativeName":"svenska (Sverige)","language":"sv","numberFormat":{",":" ",".":",","percent":{",":" ",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"kr"}},"calendars":{"standard":{"/":"-","firstDay":1,"days":{"names":["söndag","måndag","tisdag","onsdag","torsdag","fredag","lördag"],"namesAbbr":["sö","må","ti","on","to","fr","lö"],"namesShort":["sö","må","ti","on","to","fr","lö"]},"months":{"names":["januari","februari","mars","april","maj","juni","juli","augusti","september","oktober","november","december",""],"namesAbbr":["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec",""]},"AM":null,"PM":null,"patterns":{"d":"yyyy-MM-dd","D":"'den 'd MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"'den 'd MMMM yyyy HH:mm","F":"'den 'd MMMM yyyy HH:mm:ss","M":"'den 'd MMMM","Y":"MMMM yyyy"}}}}],"th-TH":["th-TH","default",{"name":"th-TH","englishName":"Thai (Thailand)","nativeName":"ไทย (ไทย)","language":"th","numberFormat":{"currency":{"pattern":["-$n","$n"],"symbol":"฿"}},"calendars":{"standard":{"name":"ThaiBuddhist","firstDay":1,"days":{"names":["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"],"namesAbbr":["อา.","จ.","อ.","พ.","พฤ.","ศ.","ส."],"namesShort":["อ","จ","อ","พ","พ","ศ","ส"]},"months":{"names":["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",""],"namesAbbr":["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.",""]},"eras":[{"name":"พ.ศ.","start":null,"offset":-543}],"twoDigitYearMax":2572,"patterns":{"d":"d/M/yyyy","D":"d MMMM yyyy","t":"H:mm","T":"H:mm:ss","f":"d MMMM yyyy H:mm","F":"d MMMM yyyy H:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}},"Gregorian_Localized":{"firstDay":1,"days":{"names":["อาทิตย์","จันทร์","อังคาร","พุธ","พฤหัสบดี","ศุกร์","เสาร์"],"namesAbbr":["อา.","จ.","อ.","พ.","พฤ.","ศ.","ส."],"namesShort":["อ","จ","อ","พ","พ","ศ","ส"]},"months":{"names":["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม",""],"namesAbbr":["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค.",""]},"patterns":{"d":"d/M/yyyy","D":"'วัน'dddd'ที่' d MMMM yyyy","t":"H:mm","T":"H:mm:ss","f":"'วัน'dddd'ที่' d MMMM yyyy H:mm","F":"'วัน'dddd'ที่' d MMMM yyyy H:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"tr-TR":["tr-TR","default",{"name":"tr-TR","englishName":"Turkish (Turkey)","nativeName":"Türkçe (Türkiye)","language":"tr","numberFormat":{",":".",".":",","percent":{"pattern":["-%n","%n"],",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"TL"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["Pazar","Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi"],"namesAbbr":["Paz","Pzt","Sal","Çar","Per","Cum","Cmt"],"namesShort":["Pz","Pt","Sa","Ça","Pe","Cu","Ct"]},"months":{"names":["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık",""],"namesAbbr":["Oca","Şub","Mar","Nis","May","Haz","Tem","Ağu","Eyl","Eki","Kas","Ara",""]},"AM":null,"PM":null,"patterns":{"d":"dd.MM.yyyy","D":"dd MMMM yyyy dddd","t":"HH:mm","T":"HH:mm:ss","f":"dd MMMM yyyy dddd HH:mm","F":"dd MMMM yyyy dddd HH:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"id-ID":["id-ID","default",{"name":"id-ID","englishName":"Indonesian (Indonesia)","nativeName":"Bahasa Indonesia (Indonesia)","language":"id","numberFormat":{",":".",".":",","percent":{",":".",".":","},"currency":{"decimals":0,",":".",".":",","symbol":"Rp"}},"calendars":{"standard":{"firstDay":1,"days":{"names":["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],"namesAbbr":["Minggu","Sen","Sel","Rabu","Kamis","Jumat","Sabtu"],"namesShort":["M","S","S","R","K","J","S"]},"months":{"names":["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","Nopember","Desember",""],"namesAbbr":["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agust","Sep","Okt","Nop","Des",""]},"AM":null,"PM":null,"patterns":{"d":"dd/MM/yyyy","D":"dd MMMM yyyy","t":"H:mm","T":"H:mm:ss","f":"dd MMMM yyyy H:mm","F":"dd MMMM yyyy H:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"uk-UA":["uk-UA","default",{"name":"uk-UA","englishName":"Ukrainian (Ukraine)","nativeName":"українська (Україна)","language":"uk","numberFormat":{",":" ",".":",","percent":{"pattern":["-n%","n%"],",":" ",".":","},"currency":{"pattern":["-n$","n$"],",":" ",".":",","symbol":"₴"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["неділя","понеділок","вівторок","середа","четвер","п'ятниця","субота"],"namesAbbr":["Нд","Пн","Вт","Ср","Чт","Пт","Сб"],"namesShort":["Нд","Пн","Вт","Ср","Чт","Пт","Сб"]},"months":{"names":["Січень","Лютий","Березень","Квітень","Травень","Червень","Липень","Серпень","Вересень","Жовтень","Листопад","Грудень",""],"namesAbbr":["Січ","Лют","Бер","Кві","Тра","Чер","Лип","Сер","Вер","Жов","Лис","Гру",""]},"monthsGenitive":{"names":["січня","лютого","березня","квітня","травня","червня","липня","серпня","вересня","жовтня","листопада","грудня",""],"namesAbbr":["січ","лют","бер","кві","тра","чер","лип","сер","вер","жов","лис","гру",""]},"AM":null,"PM":null,"patterns":{"d":"dd.MM.yyyy","D":"d MMMM yyyy' р.'","t":"H:mm","T":"H:mm:ss","f":"d MMMM yyyy' р.' H:mm","F":"d MMMM yyyy' р.' H:mm:ss","M":"d MMMM","Y":"MMMM yyyy' р.'"}}}}],"sl-SI":["sl-SI","default",{"name":"sl-SI","englishName":"Slovenian (Slovenia)","nativeName":"slovenski (Slovenija)","language":"sl","numberFormat":{",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"€"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["nedelja","ponedeljek","torek","sreda","četrtek","petek","sobota"],"namesAbbr":["ned","pon","tor","sre","čet","pet","sob"],"namesShort":["ne","po","to","sr","če","pe","so"]},"months":{"names":["januar","februar","marec","april","maj","junij","julij","avgust","september","oktober","november","december",""],"namesAbbr":["jan","feb","mar","apr","maj","jun","jul","avg","sep","okt","nov","dec",""]},"AM":null,"PM":null,"patterns":{"d":"d.M.yyyy","D":"d. MMMM yyyy","t":"H:mm","T":"H:mm:ss","f":"d. MMMM yyyy H:mm","F":"d. MMMM yyyy H:mm:ss","M":"d. MMMM","Y":"MMMM yyyy"}}}}],"et-EE":["et-EE","default",{"name":"et-EE","englishName":"Estonian (Estonia)","nativeName":"eesti (Eesti)","language":"et","numberFormat":{",":" ",".":",","percent":{"pattern":["-n%","n%"],",":" ",".":","},"currency":{"pattern":["-n $","n $"],",":" ","symbol":"kr"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["pühapäev","esmaspäev","teisipäev","kolmapäev","neljapäev","reede","laupäev"],"namesAbbr":["P","E","T","K","N","R","L"],"namesShort":["P","E","T","K","N","R","L"]},"months":{"names":["jaanuar","veebruar","märts","aprill","mai","juuni","juuli","august","september","oktoober","november","detsember",""],"namesAbbr":["jaan","veebr","märts","apr","mai","juuni","juuli","aug","sept","okt","nov","dets",""]},"AM":["EL","el","EL"],"PM":["PL","pl","PL"],"patterns":{"d":"d.MM.yyyy","D":"d. MMMM yyyy'. a.'","t":"H:mm","T":"H:mm:ss","f":"d. MMMM yyyy'. a.' H:mm","F":"d. MMMM yyyy'. a.' H:mm:ss","M":"d. MMMM","Y":"MMMM yyyy'. a.'"}}}}],"lv-LV":["lv-LV","default",{"name":"lv-LV","englishName":"Latvian (Latvia)","nativeName":"latviešu (Latvija)","language":"lv","numberFormat":{",":" ",".":",","percent":{"pattern":["-n%","n%"],",":" ",".":","},"currency":{"pattern":["-$ n","$ n"],",":" ",".":",","symbol":"Ls"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["svētdiena","pirmdiena","otrdiena","trešdiena","ceturtdiena","piektdiena","sestdiena"],"namesAbbr":["sv","pr","ot","tr","ce","pk","se"],"namesShort":["sv","pr","ot","tr","ce","pk","se"]},"months":{"names":["janvāris","februāris","marts","aprīlis","maijs","jūnijs","jūlijs","augusts","septembris","oktobris","novembris","decembris",""],"namesAbbr":["jan","feb","mar","apr","mai","jūn","jūl","aug","sep","okt","nov","dec",""]},"monthsGenitive":{"names":["janvārī","februārī","martā","aprīlī","maijā","jūnijā","jūlijā","augustā","septembrī","oktobrī","novembrī","decembrī",""],"namesAbbr":["jan","feb","mar","apr","mai","jūn","jūl","aug","sep","okt","nov","dec",""]},"AM":null,"PM":null,"patterns":{"d":"yyyy.MM.dd.","D":"dddd, yyyy'. gada 'd. MMMM","t":"H:mm","T":"H:mm:ss","f":"dddd, yyyy'. gada 'd. MMMM H:mm","F":"dddd, yyyy'. gada 'd. MMMM H:mm:ss","M":"d. MMMM","Y":"yyyy. MMMM"}}}}],"lt-LT":["lt-LT","default",{"name":"lt-LT","englishName":"Lithuanian (Lithuania)","nativeName":"lietuvių (Lietuva)","language":"lt","numberFormat":{",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"Lt"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["sekmadienis","pirmadienis","antradienis","trečiadienis","ketvirtadienis","penktadienis","šeštadienis"],"namesAbbr":["Sk","Pr","An","Tr","Kt","Pn","Št"],"namesShort":["S","P","A","T","K","Pn","Š"]},"months":{"names":["sausis","vasaris","kovas","balandis","gegužė","birželis","liepa","rugpjūtis","rugsėjis","spalis","lapkritis","gruodis",""],"namesAbbr":["Sau","Vas","Kov","Bal","Geg","Bir","Lie","Rgp","Rgs","Spl","Lap","Grd",""]},"monthsGenitive":{"names":["sausio","vasario","kovo","balandžio","gegužės","birželio","liepos","rugpjūčio","rugsėjo","spalio","lapkričio","gruodžio",""],"namesAbbr":["Sau","Vas","Kov","Bal","Geg","Bir","Lie","Rgp","Rgs","Spl","Lap","Grd",""]},"AM":null,"PM":null,"patterns":{"d":"yyyy.MM.dd","D":"yyyy 'm.' MMMM d 'd.'","t":"HH:mm","T":"HH:mm:ss","f":"yyyy 'm.' MMMM d 'd.' HH:mm","F":"yyyy 'm.' MMMM d 'd.' HH:mm:ss","M":"MMMM d 'd.'","Y":"yyyy 'm.' MMMM"}}}}],"vi-VN":["vi-VN","default",{"name":"vi-VN","englishName":"Vietnamese (Vietnam)","nativeName":"Tiếng Việt (Việt Nam)","language":"vi","numberFormat":{",":".",".":",","percent":{",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"₫"}},"calendars":{"standard":{"firstDay":1,"days":{"names":["Chủ Nhật","Thứ Hai","Thứ Ba","Thứ Tư","Thứ Năm","Thứ Sáu","Thứ Bảy"],"namesAbbr":["CN","Hai","Ba","Tư","Năm","Sáu","Bảy"],"namesShort":["C","H","B","T","N","S","B"]},"months":{"names":["Tháng Giêng","Tháng Hai","Tháng Ba","Tháng Tư","Tháng Năm","Tháng Sáu","Tháng Bảy","Tháng Tám","Tháng Chín","Tháng Mười","Tháng Mười Một","Tháng Mười Hai",""],"namesAbbr":["Thg1","Thg2","Thg3","Thg4","Thg5","Thg6","Thg7","Thg8","Thg9","Thg10","Thg11","Thg12",""]},"AM":["SA","sa","SA"],"PM":["CH","ch","CH"],"patterns":{"d":"dd/MM/yyyy","D":"dd MMMM yyyy","f":"dd MMMM yyyy h:mm tt","F":"dd MMMM yyyy h:mm:ss tt","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"eu-ES":["eu-ES","default",{"name":"eu-ES","englishName":"Basque (Basque)","nativeName":"euskara (euskara)","language":"eu","numberFormat":{",":".",".":",","percent":{",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"€"}},"calendars":{"standard":{"firstDay":1,"days":{"names":["igandea","astelehena","asteartea","asteazkena","osteguna","ostirala","larunbata"],"namesAbbr":["ig.","al.","as.","az.","og.","or.","lr."],"namesShort":["ig","al","as","az","og","or","lr"]},"months":{"names":["urtarrila","otsaila","martxoa","apirila","maiatza","ekaina","uztaila","abuztua","iraila","urria","azaroa","abendua",""],"namesAbbr":["urt.","ots.","mar.","api.","mai.","eka.","uzt.","abu.","ira.","urr.","aza.","abe.",""]},"AM":null,"PM":null,"eras":[{"name":"d.C.","start":null,"offset":0}],"patterns":{"d":"yyyy/MM/dd","D":"dddd, yyyy.'eko' MMMM'k 'd","t":"HH:mm","T":"H:mm:ss","f":"dddd, yyyy.'eko' MMMM'k 'd HH:mm","F":"dddd, yyyy.'eko' MMMM'k 'd H:mm:ss","Y":"yyyy.'eko' MMMM"}}}}],"hi-IN":["hi-IN","default",{"name":"hi-IN","englishName":"Hindi (India)","nativeName":"हिंदी (भारत)","language":"hi","numberFormat":{"groupSizes":[3,2],"percent":{"groupSizes":[3,2]},"currency":{"pattern":["$ -n","$ n"],"groupSizes":[3,2],"symbol":"रु"}},"calendars":{"standard":{"/":"-","firstDay":1,"days":{"names":["रविवार","सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार"],"namesAbbr":["रवि.","सोम.","मंगल.","बुध.","गुरु.","शुक्र.","शनि."],"namesShort":["र","स","म","ब","ग","श","श"]},"months":{"names":["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितम्बर","अक्तूबर","नवम्बर","दिसम्बर",""],"namesAbbr":["जनवरी","फरवरी","मार्च","अप्रैल","मई","जून","जुलाई","अगस्त","सितम्बर","अक्तूबर","नवम्बर","दिसम्बर",""]},"AM":["पूर्वाह्न","पूर्वाह्न","पूर्वाह्न"],"PM":["अपराह्न","अपराह्न","अपराह्न"],"patterns":{"d":"dd-MM-yyyy","D":"dd MMMM yyyy","t":"HH:mm","T":"HH:mm:ss","f":"dd MMMM yyyy HH:mm","F":"dd MMMM yyyy HH:mm:ss","M":"dd MMMM"}}}}],"ms-MY":["ms-MY","default",{"name":"ms-MY","englishName":"Malay (Malaysia)","nativeName":"Bahasa Melayu (Malaysia)","language":"ms","numberFormat":{"currency":{"decimals":0,"symbol":"RM"}},"calendars":{"standard":{"firstDay":1,"days":{"names":["Ahad","Isnin","Selasa","Rabu","Khamis","Jumaat","Sabtu"],"namesAbbr":["Ahad","Isnin","Sel","Rabu","Khamis","Jumaat","Sabtu"],"namesShort":["A","I","S","R","K","J","S"]},"months":{"names":["Januari","Februari","Mac","April","Mei","Jun","Julai","Ogos","September","Oktober","November","Disember",""],"namesAbbr":["Jan","Feb","Mac","Apr","Mei","Jun","Jul","Ogos","Sept","Okt","Nov","Dis",""]},"AM":null,"PM":null,"patterns":{"d":"dd/MM/yyyy","D":"dd MMMM yyyy","t":"H:mm","T":"H:mm:ss","f":"dd MMMM yyyy H:mm","F":"dd MMMM yyyy H:mm:ss","M":"dd MMMM","Y":"MMMM yyyy"}}}}],"kk-KZ":["kk-KZ","default",{"name":"kk-KZ","englishName":"Kazakh (Kazakhstan)","nativeName":"Қазақ (Қазақстан)","language":"kk","numberFormat":{",":" ",".":",","percent":{"pattern":["-n%","n%"],",":" ",".":","},"currency":{"pattern":["-$n","$n"],",":" ",".":"-","symbol":"Т"}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["Жексенбі","Дүйсенбі","Сейсенбі","Сәрсенбі","Бейсенбі","Жұма","Сенбі"],"namesAbbr":["Жк","Дс","Сс","Ср","Бс","Жм","Сн"],"namesShort":["Жк","Дс","Сс","Ср","Бс","Жм","Сн"]},"months":{"names":["қаңтар","ақпан","наурыз","сәуір","мамыр","маусым","шілде","тамыз","қыркүйек","қазан","қараша","желтоқсан",""],"namesAbbr":["Қаң","Ақп","Нау","Сәу","Мам","Мау","Шіл","Там","Қыр","Қаз","Қар","Жел",""]},"AM":null,"PM":null,"patterns":{"d":"dd.MM.yyyy","D":"d MMMM yyyy 'ж.'","t":"H:mm","T":"H:mm:ss","f":"d MMMM yyyy 'ж.' H:mm","F":"d MMMM yyyy 'ж.' H:mm:ss","M":"d MMMM","Y":"MMMM yyyy"}}}}],"gl-ES":["gl-ES","default",{"name":"gl-ES","englishName":"Galician (Galician)","nativeName":"galego (galego)","language":"gl","numberFormat":{",":".",".":",","percent":{",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"€"}},"calendars":{"standard":{"firstDay":1,"days":{"names":["domingo","luns","martes","mércores","xoves","venres","sábado"],"namesAbbr":["dom","luns","mar","mér","xov","ven","sáb"],"namesShort":["do","lu","ma","mé","xo","ve","sá"]},"months":{"names":["xaneiro","febreiro","marzo","abril","maio","xuño","xullo","agosto","setembro","outubro","novembro","decembro",""],"namesAbbr":["xan","feb","mar","abr","maio","xuñ","xull","ago","set","out","nov","dec",""]},"AM":["a.m.","a.m.","A.M."],"PM":["p.m.","p.m.","P.M."],"eras":[{"name":"d.C.","start":null,"offset":0}],"patterns":{"d":"dd/MM/yyyy","D":"dddd, dd' de 'MMMM' de 'yyyy","t":"H:mm","T":"H:mm:ss","f":"dddd, dd' de 'MMMM' de 'yyyy H:mm","F":"dddd, dd' de 'MMMM' de 'yyyy H:mm:ss","M":"dd MMMM","Y":"MMMM' de 'yyyy"}}}}],"zh-CN":["zh-CN","default",{"name":"zh-CN","englishName":"Chinese (Simplified, PRC)","nativeName":"中文(中华人民共和国)","language":"zh-CHS","numberFormat":{"percent":{"pattern":["-n%","n%"]},"currency":{"pattern":["$-n","$n"],"symbol":"¥"}},"calendars":{"standard":{"days":{"names":["星期日","星期一","星期二","星期三","星期四","星期五","星期六"],"namesAbbr":["周日","周一","周二","周三","周四","周五","周六"],"namesShort":["日","一","二","三","四","五","六"]},"months":{"names":["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月",""],"namesAbbr":["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月",""]},"AM":["上午","上午","上午"],"PM":["下午","下午","下午"],"eras":[{"name":"公元","start":null,"offset":0}],"patterns":{"d":"yyyy/M/d","D":"yyyy'年'M'月'd'日'","t":"H:mm","T":"H:mm:ss","f":"yyyy'年'M'月'd'日' H:mm","F":"yyyy'年'M'月'd'日' H:mm:ss","M":"M'月'd'日'","Y":"yyyy'年'M'月'"}}}}],"pt-PT":["pt-PT","default",{"name":"pt-PT","englishName":"Portuguese (Portugal)","nativeName":"português (Portugal)","language":"pt","numberFormat":{",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"€"}},"calendars":{"standard":{"/":"-","firstDay":1,"days":{"names":["domingo","segunda-feira","terça-feira","quarta-feira","quinta-feira","sexta-feira","sábado"],"namesAbbr":["dom","seg","ter","qua","qui","sex","sáb"],"namesShort":["D","S","T","Q","Q","S","S"]},"months":{"names":["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro",""],"namesAbbr":["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez",""]},"AM":null,"PM":null,"eras":[{"name":"d.C.","start":null,"offset":0}],"patterns":{"d":"dd-MM-yyyy","D":"dddd, d' de 'MMMM' de 'yyyy","t":"HH:mm","T":"HH:mm:ss","f":"dddd, d' de 'MMMM' de 'yyyy HH:mm","F":"dddd, d' de 'MMMM' de 'yyyy HH:mm:ss","M":"d/M","Y":"MMMM' de 'yyyy"}}}}],"es-ES":["es-ES","default",{"name":"es-ES","englishName":"Spanish (Spain, International Sort)","nativeName":"Español (España, alfabetización internacional)","language":"es","numberFormat":{",":".",".":",","percent":{",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"€"}},"calendars":{"standard":{"firstDay":1,"days":{"names":["domingo","lunes","martes","miércoles","jueves","viernes","sábado"],"namesAbbr":["dom","lun","mar","mié","jue","vie","sáb"],"namesShort":["do","lu","ma","mi","ju","vi","sá"]},"months":{"names":["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre",""],"namesAbbr":["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic",""]},"AM":null,"PM":null,"eras":[{"name":"d.C.","start":null,"offset":0}],"patterns":{"d":"dd/MM/yyyy","D":"dddd, dd' de 'MMMM' de 'yyyy","t":"H:mm","T":"H:mm:ss","f":"dddd, dd' de 'MMMM' de 'yyyy H:mm","F":"dddd, dd' de 'MMMM' de 'yyyy H:mm:ss","M":"dd MMMM","Y":"MMMM' de 'yyyy"}}}}],"sr-Latn-RS":["sr-Latn-RS","default",{"name":"sr-Latn-RS","englishName":"Serbian (Latin, Serbia)","nativeName":"srpski (Srbija)","language":"sr-Latn","numberFormat":{",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"Din."}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["nedelja","ponedeljak","utorak","sreda","četvrtak","petak","subota"],"namesAbbr":["ned","pon","uto","sre","čet","pet","sub"],"namesShort":["ne","po","ut","sr","če","pe","su"]},"months":{"names":["januar","februar","mart","april","maj","jun","jul","avgust","septembar","oktobar","novembar","decembar",""],"namesAbbr":["jan","feb","mar","apr","maj","jun","jul","avg","sep","okt","nov","dec",""]},"AM":null,"PM":null,"eras":[{"name":"n.e.","start":null,"offset":0}],"patterns":{"d":"d.M.yyyy","D":"d. MMMM yyyy","t":"H:mm","T":"H:mm:ss","f":"d. MMMM yyyy H:mm","F":"d. MMMM yyyy H:mm:ss","M":"d. MMMM","Y":"MMMM yyyy"}}}}],"sr-Cyrl-RS":["sr-Cyrl-RS","default",{"name":"sr-Cyrl-RS","englishName":"Serbian (Cyrillic, Serbia)","nativeName":"српски (Србија)","language":"sr-Cyrl","numberFormat":{",":".",".":",","percent":{"pattern":["-n%","n%"],",":".",".":","},"currency":{"pattern":["-n $","n $"],",":".",".":",","symbol":"Дин."}},"calendars":{"standard":{"/":".","firstDay":1,"days":{"names":["недеља","понедељак","уторак","среда","четвртак","петак","субота"],"namesAbbr":["нед","пон","уто","сре","чет","пет","суб"],"namesShort":["не","по","ут","ср","че","пе","су"]},"months":{"names":["јануар","фебруар","март","април","мај","јун","јул","август","септембар","октобар","новембар","децембар",""],"namesAbbr":["јан","феб","мар","апр","мај","јун","јул","авг","сеп","окт","нов","дец",""]},"AM":null,"PM":null,"eras":[{"name":"н.е.","start":null,"offset":0}],"patterns":{"d":"d.M.yyyy","D":"d. MMMM yyyy","t":"H:mm","T":"H:mm:ss","f":"d. MMMM yyyy H:mm","F":"d. MMMM yyyy H:mm:ss","M":"d. MMMM","Y":"MMMM yyyy"}}}}]}

/***/ }),

/***/ 5581:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   M: () => (/* binding */ TornadoChart)
/* harmony export */ });
/* harmony import */ var d3_selection__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(3838);
/* harmony import */ var d3_array__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(8776);
/* harmony import */ var d3_array__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(8398);
/* harmony import */ var powerbi_visuals_utils_dataviewutils__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(982);
/* harmony import */ var powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9280);
/* harmony import */ var powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6060);
/* harmony import */ var powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(4732);
/* harmony import */ var powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8081);
/* harmony import */ var powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6674);
/* harmony import */ var powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(7410);
/* harmony import */ var powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(4805);
/* harmony import */ var powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(651);
/* harmony import */ var powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(4776);
/* harmony import */ var powerbi_visuals_utils_interactivityutils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9406);
/* harmony import */ var powerbi_visuals_utils_interactivityutils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8482);
/* harmony import */ var powerbi_visuals_utils_colorutils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6188);
/* harmony import */ var powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(4261);
/* harmony import */ var _interfaces__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(8345);
/* harmony import */ var _TornadoWebBehavior__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(9090);
/* harmony import */ var _tooltipBuilder__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(9320);
/* harmony import */ var _tornadoChartUtils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(5040);
/* harmony import */ var _TornadoChartSettingsModel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(1820);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */





var manipulation = powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_0__;
var createClassAndSelector = powerbi_visuals_utils_svgutils__WEBPACK_IMPORTED_MODULE_1__/* .createClassAndSelector */ .CH;
var translate = manipulation.translate;
var translateAndRotate = manipulation.translateAndRotate;


var MarkerShape = powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_2__/* .MarkerShape */ .ZO;
var LegendPosition = powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_2__/* .LegendPosition */ .tV;
var createLegend = powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_3__/* .createLegend */ .OG;
var LegendDataModule = powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_4__;


var appendClearCatcher = powerbi_visuals_utils_interactivityutils__WEBPACK_IMPORTED_MODULE_5__/* .appendClearCatcher */ .EX;
var createInteractivitySelectionService = powerbi_visuals_utils_interactivityutils__WEBPACK_IMPORTED_MODULE_6__/* .createInteractivitySelectionService */ .L;

// powerbi.extensibility.utils.formattingModel






class TornadoChart {
    getFormattingModel() {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
    static buildIdentitySelection(hostService, category, i, values, columnGroup, measureName) {
        return hostService.createSelectionIdBuilder()
            .withCategory(category, i)
            .withSeries(values, columnGroup)
            .withMeasure(measureName)
            .createSelectionId();
    }
    static converter(dataView, hostService, colors, localizationManager, formattingSettings) {
        const categorical = dataView.categorical;
        const categories = categorical.categories || [];
        const values = categorical.values;
        const category = categories[0];
        let maxValue = (0,d3_array__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(values[0].values);
        let minValue = Math.min((0,d3_array__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .Z)(values[0].values), 0);
        if (values.length >= TornadoChart.MaxSeries) {
            minValue = (0,d3_array__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .Z)([minValue, (0,d3_array__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .Z)(values[1].values)]);
            maxValue = (0,d3_array__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)([maxValue, (0,d3_array__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z)(values[1].values)]);
        }
        const labelFormatter = TornadoChart.prepareFormatter(maxValue, formattingSettings.dataLabelsSettings);
        const hasDynamicSeries = !!values.source;
        const hasHighlights = values.length > 0 && values.some(value => value.highlights && value.highlights.some(_ => _));
        const labelHeight = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_13__/* .textMeasurementService */ .yF.estimateSvgTextHeight({
            fontFamily: powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_14__/* .StandardFontFamily */ .Pq,
            fontSize: powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_15__.fromPoint(formattingSettings === null || formattingSettings === void 0 ? void 0 : formattingSettings.dataLabelsSettings.font.fontSize.value)
        });
        const series = [];
        const dataPoints = [];
        const categorySourceFormatter = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_13__/* .valueFormatter */ .wD.create({
            format: powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_13__/* .valueFormatter */ .wD.getFormatStringByColumn(category.source)
        });
        const categoriesLabels = category.values.map(value => TornadoChart.getTextData(categorySourceFormatter.format(value), formattingSettings.categoryCardSettings.font, true, false));
        const groupedValues = values.grouped ? values.grouped() : null;
        let uniqId = 0;
        for (let seriesIndex = 0; seriesIndex < Math.min(values.length, TornadoChart.MaxSeries); seriesIndex++) {
            const columnGroup = groupedValues && groupedValues.length > seriesIndex
                && groupedValues[seriesIndex].values ? groupedValues[seriesIndex] : null;
            const parsedSeries = TornadoChart.parseSeries(dataView, values, hostService, seriesIndex, hasDynamicSeries, columnGroup, colors);
            const currentSeries = values[seriesIndex];
            const measureName = currentSeries.source.queryName;
            series.push(parsedSeries);
            for (let i = 0; i < category.values.length; i++) {
                const value = currentSeries.values[i] == null || isNaN(currentSeries.values[i]) ? 0 : currentSeries.values[i];
                const identity = TornadoChart.buildIdentitySelection(hostService, category, i, values, columnGroup, measureName);
                const formattedCategoryValue = categoriesLabels[i].text;
                const buildTooltip = (highlightedValue) => _tooltipBuilder__WEBPACK_IMPORTED_MODULE_16__/* .createTooltipInfo */ .BY(categorical, formattedCategoryValue, localizationManager, value, seriesIndex, highlightedValue || null);
                // Limit maximum value with what the user choose
                const currentMaxValue = parsedSeries.categoryAxisEnd ? parsedSeries.categoryAxisEnd : maxValue;
                const formatString = dataView.categorical.values[seriesIndex].source.format;
                const dataPointCommon = {
                    uniqId: uniqId,
                    value,
                    minValue,
                    maxValue: currentMaxValue,
                    formatString,
                    color: parsedSeries.fill,
                    selected: false,
                    identity,
                    categoryIndex: i,
                };
                let highlight = NaN;
                let highlightedValue = value;
                if (hasHighlights) {
                    highlight = currentSeries.highlights[i];
                    highlightedValue = highlight != null ? highlight : 0;
                }
                dataPoints.push(Object.assign(Object.assign({}, dataPointCommon), { highlightedValue: highlightedValue, tooltipData: buildTooltip(hasHighlights ? highlightedValue : null), highlight: hasHighlights && !!highlight }));
                uniqId += 1;
            }
        }
        return {
            categories: categoriesLabels,
            series: series,
            labelFormatter: labelFormatter,
            legend: TornadoChart.getLegendData(series, hasDynamicSeries),
            dataPoints: dataPoints,
            maxLabelsWidth: Math.max(...categoriesLabels.map(x => x.width)),
            hasDynamicSeries: hasDynamicSeries,
            hasHighlights: hasHighlights,
            labelHeight: labelHeight,
            legendObjectProperties: powerbi_visuals_utils_dataviewutils__WEBPACK_IMPORTED_MODULE_17__.getObject(dataView.metadata.objects, "legend", {}),
            categoriesObjectProperties: powerbi_visuals_utils_dataviewutils__WEBPACK_IMPORTED_MODULE_17__.getObject(dataView.metadata.objects, "categories", {}),
        };
    }
    static parseSeries(dataView, dataViewValueColumns, hostService, index, isGrouped, columnGroup, colors) {
        var _a;
        if (!dataView) {
            return;
        }
        const dataViewValueColumn = dataViewValueColumns ? dataViewValueColumns[index] : null, source = dataViewValueColumn ? dataViewValueColumn.source : null, queryName = source ? source.queryName : null;
        const selectionId = hostService.createSelectionIdBuilder()
            .withSeries(dataViewValueColumns, columnGroup)
            .withMeasure(queryName)
            .createSelectionId();
        let sourceGroupName = null;
        if (source.groupName !== undefined && source.groupName !== null) {
            sourceGroupName = "" + source.groupName;
        }
        let objects, categoryAxisObject;
        const displayName = source ? sourceGroupName
            ? sourceGroupName : source.displayName
            : null;
        if (isGrouped && columnGroup && columnGroup.objects) {
            categoryAxisObject = columnGroup.objects ? columnGroup.objects["categoryAxis"] : null;
            objects = columnGroup.objects;
        }
        else if (source && source.objects) {
            categoryAxisObject = objects ? objects["categoryAxis"] : null;
            objects = source.objects;
        }
        else if (dataView && dataView.metadata && dataView.metadata.objects) {
            objects = dataView.metadata.objects;
        }
        const fillColor = TornadoChart.getColor(TornadoChart.Properties.dataPoint.fill, ["purple", "teal"][index], objects, colors);
        let categoryAxisEnd = categoryAxisObject ? categoryAxisObject["end"] : null;
        if (!categoryAxisEnd) {
            if ((_a = objects === null || objects === void 0 ? void 0 : objects.categoryAxis) === null || _a === void 0 ? void 0 : _a.end) {
                categoryAxisEnd = objects.categoryAxis.end;
            }
        }
        return {
            fill: fillColor,
            name: displayName,
            selectionId: selectionId,
            categoryAxisEnd: categoryAxisEnd,
        };
    }
    static getColor(properties, defaultColor, objects, colors, convertToHighContrastMode = true) {
        const colorHelper = new powerbi_visuals_utils_colorutils__WEBPACK_IMPORTED_MODULE_7__/* .ColorHelper */ .vH(colors, properties, defaultColor);
        if (colorHelper.isHighContrast && convertToHighContrastMode)
            return colorHelper.getColorForMeasure(objects, "", "foreground");
        return colorHelper.getColorForMeasure(objects, "");
    }
    static getTextData(text, formattingOptions, measureWidth = false, measureHeight = false, useDefaultTextProperties = false) {
        let width = 0, height = 0;
        text = text || "";
        const fontSize = useDefaultTextProperties
            ? powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_15__.fromPoint(_TornadoChartSettingsModel__WEBPACK_IMPORTED_MODULE_10__/* .FontDefaultOptions */ .Ct.DefaultFontSizePt)
            : powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_15__.fromPoint(formattingOptions.fontSize.value);
        const fontFamily = useDefaultTextProperties
            ? _TornadoChartSettingsModel__WEBPACK_IMPORTED_MODULE_10__/* .FontDefaultOptions */ .Ct.DefaultFontFamily
            : formattingOptions.fontFamily.value;
        const textProperties = {
            text: text,
            fontFamily: fontFamily,
            fontSize: fontSize
        };
        if (measureWidth) {
            width = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_13__/* .textMeasurementService */ .yF.measureSvgTextWidth(textProperties);
        }
        if (measureHeight) {
            height = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_13__/* .textMeasurementService */ .yF.estimateSvgTextHeight(textProperties);
        }
        return {
            text: text,
            width: width,
            height: height,
            textProperties: textProperties
        };
    }
    get viewportWidth() {
        return this.viewport.width - (TornadoChart.getScrollBarWidth(this.rootContainer) * +this.isScrollVisible);
    }
    get allLabelsWidth() {
        const labelsWidth = this.formattingSettings.categoryCardSettings.show.value
            ? Math.min(this.dataView.maxLabelsWidth, this.viewportWidth / 3)
            : TornadoChart.DefaultLabelsWidth;
        return labelsWidth + TornadoChart.CategoryLabelMargin;
    }
    get allColumnsWidth() {
        return this.viewportWidth - this.allLabelsWidth;
    }
    static getScrollBarWidth(element) {
        return element.offsetWidth - element.clientWidth;
    }
    get columnWidth() {
        return this.dataView.series.length === TornadoChart.MaxSeries
            ? this.allColumnsWidth / 2
            : this.allColumnsWidth;
    }
    constructor(options) {
        this.columnPadding = 5;
        this.leftLabelMargin = 4;
        this.InnerTextHeightDelta = 2;
        this.margin = {
            top: 10,
            right: 5,
            bottom: 10,
            left: 10
        };
        this.isScrollVisible = false;
        this.heightColumn = 0;
        this.hostService = options.host;
        this.localizationManager = this.hostService.createLocalizationManager();
        this.colors = options.host.colorPalette;
        this.colorHelper = new powerbi_visuals_utils_colorutils__WEBPACK_IMPORTED_MODULE_7__/* .ColorHelper */ .vH(this.colors);
        this.selectionManager = options.host.createSelectionManager();
        this.tooltipArgs = new _interfaces__WEBPACK_IMPORTED_MODULE_18__/* .TooltipArgsWrapper */ .W(options.element, options.host.tooltipService);
        this.interactivityService = createInteractivitySelectionService(this.hostService);
        const interactiveBehavior = this.colorHelper.isHighContrast ? (new powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_19__/* ["default"] */ .Z()) : null;
        this.legend = createLegend(options.element, false, this.interactivityService, true, null, interactiveBehavior);
        this.element = (0,d3_selection__WEBPACK_IMPORTED_MODULE_20__/* ["default"] */ .Z)(options.element);
        this.rootContainer = document.createElement("div");
        this.rootContainer.classList.add(TornadoChart.Container);
        options.element.append(this.rootContainer);
        const root = this.root = (0,d3_selection__WEBPACK_IMPORTED_MODULE_20__/* ["default"] */ .Z)(this.rootContainer)
            .append("svg")
            .classed(TornadoChart.ClassName, true);
        const main = this.main = root.append("g");
        this.clearCatcher = appendClearCatcher(main);
        this.columns = main
            .append("g")
            .classed(TornadoChart.Columns.className, true);
        this.axes = main
            .append("g")
            .classed(TornadoChart.Axes.className, true);
        this.labels = main
            .append("g")
            .classed(TornadoChart.Labels.className, true);
        this.categories = main
            .append("g")
            .classed(TornadoChart.Categories.className, true);
        this.behavior = new _TornadoWebBehavior__WEBPACK_IMPORTED_MODULE_8__/* .TornadoWebBehavior */ .f();
        this.formattingSettingsService = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_21__/* ["default"] */ .Z(this.localizationManager);
        this.events = options.host.eventService;
    }
    update(options) {
        if (!options ||
            !options.dataViews ||
            !options.dataViews[0] ||
            !options.dataViews[0].categorical ||
            !options.dataViews[0].categorical.categories ||
            !options.dataViews[0].categorical.categories[0] ||
            !options.dataViews[0].categorical.categories[0].source ||
            !options.dataViews[0].categorical.values ||
            !options.dataViews[0].categorical.values[0] ||
            !options.dataViews[0].categorical.values[0].values ||
            !options.dataViews[0].categorical.values[0].values.length) {
            this.clearData();
            return;
        }
        this.events.renderingStarted(options);
        this.viewport = {
            height: Math.max(0, options.viewport.height - this.margin.top - this.margin.bottom),
            width: Math.max(0, options.viewport.width - this.margin.left - this.margin.right)
        };
        const dataView = this.validateDataView(options.dataViews[0]);
        if (dataView) {
            this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(_TornadoChartSettingsModel__WEBPACK_IMPORTED_MODULE_10__/* .TornadoChartSettingsModel */ .Vd, dataView);
            this.formattingSettings.setLocalizedOptions(this.localizationManager);
        }
        this.dataView = TornadoChart.converter(dataView, this.hostService, this.colors, this.localizationManager, this.formattingSettings);
        if (!this.dataView || this.viewport.height < TornadoChart.CategoryMinHeight) {
            this.clearData();
            this.events.renderingFinished(options);
            return;
        }
        //Populate slices for DataColors and CategoryAxisCard 
        this.formattingSettings.populateDataColorSlice(this.dataView.series);
        this.formattingSettings.populateCategoryAxisSlice(this.dataView.series);
        this.formattingSettings.setVisibilityOfLegendCardSettings(this.dataView.legend);
        this.render();
        this.events.renderingFinished(options);
    }
    validateDataView(dataView) {
        if (!dataView || !dataView.categorical || !dataView.categorical.values) {
            return null;
        }
        return dataView;
    }
    updateElements() {
        let translateX = 0;
        const position = this.formattingSettings.categoryCardSettings.positionDropdown.value.value.toString();
        if (position === "Left") {
            translateX = this.allLabelsWidth;
        }
        const elementsTranslate = translate(translateX, 0);
        this.root
            .attr("height", TornadoChart.calculateRootHeight(this.dataView.dataPoints))
            .attr("width", this.viewport.width + this.margin.left + this.margin.right);
        this.columns
            .attr("transform", elementsTranslate);
        this.labels
            .attr("transform", elementsTranslate);
        this.axes
            .attr("transform", elementsTranslate);
    }
    static calculateRootHeight(dataPoints) {
        const length = dataPoints.length;
        return dataPoints[length - 1].dy + dataPoints[length - 1].height;
    }
    static prepareFormatter(value, labelsSettings) {
        const precision = TornadoChart.getPrecision(labelsSettings);
        const displayUnits = +labelsSettings.labelDisplayUnits.value;
        const getLabelValueFormatter = (formatString) => powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_13__/* .valueFormatter */ .wD.create({
            format: formatString,
            precision: precision,
            value: (displayUnits === 0) && (value != null) ? value : displayUnits,
        });
        return {
            getLabelValueFormatter: getLabelValueFormatter
        };
    }
    static getPrecision(labelsSettings) {
        const precision = labelsSettings.labelPrecision.value;
        return Math.min(Math.max(0, precision), TornadoChart.MaxPrecision);
    }
    static getLegendData(series, hasDynamicSeries) {
        let legendDataPoints = [];
        if (hasDynamicSeries)
            legendDataPoints = series.map((series) => {
                return {
                    label: series.name,
                    color: series.fill,
                    icon: MarkerShape.circle,
                    selected: false,
                    identity: series.selectionId
                };
            });
        return {
            dataPoints: legendDataPoints
        };
    }
    render() {
        this.renderLegend();
        this.renderWithScrolling();
    }
    clearData() {
        this.columns.selectAll("*").remove();
        this.axes.selectAll("*").remove();
        this.labels.selectAll("*").remove();
        this.categories.selectAll("*").remove();
        this.legend.reset();
        this.legend.drawLegend({ dataPoints: [] }, this.viewport);
    }
    onClearSelection() {
        if (this.interactivityService) {
            this.interactivityService.clearSelection();
        }
    }
    renderWithScrolling() {
        if (!this.dataView || !this.formattingSettings) {
            return;
        }
        if (!this.dataView.hasHighlights) {
            this.interactivityService.applySelectionStateToData(this.dataView.dataPoints);
        }
        this.computeHeightColumn();
        this.renderMiddleSection();
        this.renderAxes();
        this.renderCategories();
    }
    updateViewport() {
        const legendMargins = this.legend.getMargins(), legendPosition = LegendPosition[this.formattingSettings.legendCardSettings.positionDropdown.value.value];
        switch (legendPosition) {
            case LegendPosition.Top:
            case LegendPosition.TopCenter:
            case LegendPosition.Bottom:
            case LegendPosition.BottomCenter: {
                this.viewport.height -= legendMargins.height;
                break;
            }
            case LegendPosition.Left:
            case LegendPosition.LeftCenter:
            case LegendPosition.Right:
            case LegendPosition.RightCenter: {
                this.viewport.width -= legendMargins.width;
                break;
            }
        }
    }
    computeHeightColumn() {
        const length = this.dataView.categories.length;
        const numberOfDisplayedRows = Math.floor(this.viewport.height / TornadoChart.CategoryMinHeight) > length
            ? length
            : Math.floor(this.viewport.height / TornadoChart.CategoryMinHeight);
        this.heightColumn = numberOfDisplayedRows > 0
            ? (this.viewport.height - (numberOfDisplayedRows - 1) * this.columnPadding) / (numberOfDisplayedRows)
            : 0;
        this.isScrollVisible = numberOfDisplayedRows < length;
        this.rootContainer.style.overflowY = this.isScrollVisible ? "scroll" : "hidden";
    }
    renderMiddleSection() {
        const tornadoChartDataView = this.dataView;
        this.calculateDataPoints(tornadoChartDataView.dataPoints);
        this.updateElements();
        this.renderColumns(tornadoChartDataView.dataPoints);
        this.renderLabels(tornadoChartDataView.dataPoints, this.formattingSettings.dataLabelsSettings);
    }
    /**
     * Calculate the width, dx value and label info for every data point
     */
    calculateDataPoints(dataPoints) {
        const categoriesLength = this.dataView.categories.length;
        const labelFormatter = this.dataView.labelFormatter;
        const heightColumn = Math.max(this.heightColumn, 0);
        const py = heightColumn / 2;
        const pyHighlighted = heightColumn * TornadoChart.HighlightedShapeFactor / 2;
        const maxSeries = this.dataView.series.length === TornadoChart.MaxSeries;
        for (let i = 0; i < dataPoints.length; i++) {
            const dataPoint = dataPoints[i];
            const shiftToMiddle = i < categoriesLength && maxSeries;
            const shiftToRight = i > categoriesLength - 1;
            const widthOfColumn = this.getColumnWidth(dataPoint.value, dataPoint.minValue, dataPoint.maxValue, this.columnWidth);
            let dx = (this.columnWidth - widthOfColumn) * Number(shiftToMiddle) + this.columnWidth * Number(shiftToRight) /* - scrollBarWidth*/;
            dx = Math.max(dx, 0);
            const highlighted = this.dataView.hasHighlights && dataPoint.highlight;
            const highlightOffset = highlighted ? heightColumn * (1 - TornadoChart.HighlightedShapeFactor) / 2 : 0;
            const dy = (heightColumn + this.columnPadding) * (i % categoriesLength) + highlightOffset;
            const label = this.getLabelData(dataPoint.value, dx, widthOfColumn, shiftToMiddle, dataPoint.formatString, labelFormatter);
            dataPoint.dx = dx;
            dataPoint.dy = dy;
            dataPoint.px = widthOfColumn / 2;
            dataPoint.py = highlighted ? pyHighlighted : py;
            dataPoint.angle = shiftToMiddle ? TornadoChart.MaxAngle : TornadoChart.MinAngle;
            dataPoint.width = widthOfColumn;
            dataPoint.height = highlighted ? heightColumn * TornadoChart.HighlightedShapeFactor : heightColumn;
            dataPoint.label = label;
        }
    }
    renderColumns(columnsData) {
        const hasSelection = this.interactivityService && this.interactivityService.hasSelection();
        const columnsSelection = this.columns
            .selectAll(TornadoChart.Column.selectorName)
            .data(columnsData);
        // defs should only contain required gradients,
        // otherwise gradients are duplicated
        this.columns.select("defs").remove();
        const gradients = this.columns.append("defs")
            .selectAll("linearGradient")
            .data(columnsData)
            .enter()
            .append("linearGradient")
            .attr("id", (p) => "gradient-" + p.uniqId) // Use the index of the column as the id
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");
        // from left to right
        // bright color
        gradients.append("stop")
            .attr("offset", (p) => (hasSelection && p.selected ? 100 : p.highlightedValue / p.value * 100) + "%")
            .attr("stop-color", (p) => this.colorHelper.isHighContrast ? this.colorHelper.getThemeColor() : p.color)
            .attr("stop-opacity", 1);
        // from right to left
        // less bright color
        // but % starts from left to right (so f.e 30% means end point will be at 30% starting from left, but coloring will start from right until reach end point)
        gradients.append("stop")
            .attr("offset", (p) => p.highlightedValue / p.value * 100 + "%")
            .attr("stop-color", (p) => this.colorHelper.isHighContrast ? this.colorHelper.getThemeColor() : p.color)
            .attr("stop-opacity", 0.5);
        const columnsSelectionMerged = columnsSelection
            .enter()
            .append("svg:rect")
            .merge(columnsSelection);
        columnsSelectionMerged.classed(TornadoChart.Column.className, true);
        // There should be better way to do this
        // without it, when element selected + scrolled, bug appears (selected element is different)
        if (!hasSelection) {
            columnsSelectionMerged
                .style("stroke", (p) => p.color)
                .style("fill", (p) => "url(#gradient-" + p.uniqId + ")")
                .attr("transform", (p) => translateAndRotate(p.dx, p.dy, p.px, p.py, p.angle))
                .attr("height", (p) => p.height)
                .attr("width", (p) => p.width)
                .attr("tabindex", 0);
        }
        else {
            columnsSelectionMerged
                .style("fill", (p) => this.colorHelper.isHighContrast ? this.colorHelper.getThemeColor() : p.color)
                .style("stroke", (p) => p.color)
                .style("fill-opacity", (p) => _tornadoChartUtils__WEBPACK_IMPORTED_MODULE_9__/* .TornadoChartUtils */ .e.getOpacity(p.selected, p.highlight, hasSelection, this.dataView.hasHighlights))
                .style("stroke-opacity", (p) => _tornadoChartUtils__WEBPACK_IMPORTED_MODULE_9__/* .TornadoChartUtils */ .e.getOpacity(p.selected, p.highlight, hasSelection, this.dataView.hasHighlights))
                .attr("transform", (p) => translateAndRotate(p.dx, p.dy, p.px, p.py, p.angle))
                .attr("height", (p) => p.height)
                .attr("width", (p) => p.width)
                .attr("tabindex", 0);
        }
        columnsSelection
            .exit()
            .remove();
        const interactivityService = this.interactivityService;
        if (interactivityService) {
            interactivityService.applySelectionStateToData(columnsData);
            const behaviorOptions = {
                columns: columnsSelectionMerged,
                clearCatcher: this.clearCatcher,
                interactivityService: this.interactivityService,
                behavior: this.behavior,
                dataPoints: columnsData,
                tooltipArgs: this.tooltipArgs
            };
            interactivityService.bind(behaviorOptions);
        }
    }
    getColumnWidth(value, minValue, maxValue, width) {
        if (minValue === maxValue) {
            return width;
        }
        const columnWidth = width * (value - minValue) / (maxValue - minValue);
        // In case the user specifies a custom category axis end we limit the
        // column width to the maximum available width
        return Math.max(0, Math.min(width, columnWidth));
    }
    getLabelData(value, dxColumn, columnWidth, isColumnPositionLeft, formatStringProp, labelFormatter) {
        const fontSize = this.formattingSettings.dataLabelsSettings.font.fontSize.value;
        let dx, color = this.formattingSettings.dataLabelsSettings.insideFill.value.value;
        const maxOutsideLabelWidth = isColumnPositionLeft
            ? dxColumn - this.leftLabelMargin
            : this.allColumnsWidth - (dxColumn + columnWidth + this.leftLabelMargin);
        const maxLabelWidth = Math.max(maxOutsideLabelWidth, columnWidth - this.leftLabelMargin);
        const textProperties = {
            fontFamily: this.formattingSettings.dataLabelsSettings.font.fontFamily.value,
            fontSize: powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_15__.fromPoint(fontSize),
            text: labelFormatter.getLabelValueFormatter(formatStringProp).format(value)
        };
        const valueAfterValueFormatter = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_13__/* .textMeasurementService */ .yF.getTailoredTextOrDefault(textProperties, maxLabelWidth);
        const textDataAfterValueFormatter = TornadoChart.getTextData(valueAfterValueFormatter, this.formattingSettings.dataLabelsSettings.font, true, false);
        if (columnWidth > textDataAfterValueFormatter.width + TornadoChart.LabelPadding) {
            dx = dxColumn + columnWidth / 2 - textDataAfterValueFormatter.width / 2;
        }
        else {
            if (isColumnPositionLeft) {
                dx = dxColumn - this.leftLabelMargin - textDataAfterValueFormatter.width;
            }
            else {
                dx = dxColumn + columnWidth + this.leftLabelMargin;
            }
            color = this.formattingSettings.dataLabelsSettings.outsideFill.value.value;
        }
        return {
            dx: dx,
            source: value,
            value: valueAfterValueFormatter,
            color: color
        };
    }
    renderAxes() {
        const axesElements = this.main
            .select(TornadoChart.Axes.selectorName)
            .selectAll(TornadoChart.Axis.selectorName);
        if (this.dataView.series.length !== TornadoChart.MaxSeries) {
            axesElements.remove();
            return;
        }
        const linesData = this.generateAxesData();
        const axesSelection = axesElements.data(linesData);
        const axesSelectionMerged = axesSelection
            .enter()
            .append("svg:line")
            .merge(axesSelection);
        axesSelectionMerged
            .classed(TornadoChart.Axis.className, true)
            .style("stroke", this.colorHelper.getHighContrastColor());
        axesSelectionMerged
            .attr("x1", (data) => data.x1)
            .attr("y1", (data) => data.y1)
            .attr("x2", (data) => data.x2)
            .attr("y2", (data) => data.y2);
        axesSelection
            .exit()
            .remove();
    }
    generateAxesData() {
        const x = this.allColumnsWidth / 2, y1 = 0, y2 = TornadoChart.calculateRootHeight(this.dataView.dataPoints);
        return [{
                x1: x,
                y1: y1,
                x2: x,
                y2: y2
            }];
    }
    renderLabels(dataPoints, labelsSettings) {
        const labelSelection = this.main
            .select(TornadoChart.Labels.selectorName)
            .selectAll(TornadoChart.Label.selectorName)
            .data(dataPoints.filter((p) => p.label.dx >= 0));
        const formattingSettings = this.formattingSettings;
        // Check if labels can be displayed
        if (!labelsSettings.show.value || this.dataView.labelHeight >= this.heightColumn) {
            this.labels.selectAll("*").remove();
            return;
        }
        const fontSizeInPx = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_15__.fromPoint(labelsSettings.font.fontSize.value);
        const labelYOffset = this.heightColumn / 2 + this.dataView.labelHeight / 2 - this.InnerTextHeightDelta;
        const categoriesLength = this.dataView.categories.length;
        const labelFontFamily = formattingSettings.dataLabelsSettings.font.fontFamily.value;
        const labelFontIsBold = formattingSettings.dataLabelsSettings.font.bold.value, labelFontIsItalic = formattingSettings.dataLabelsSettings.font.italic.value, labelFontIsUnderlined = formattingSettings.dataLabelsSettings.font.underline.value;
        const labelSelectionMerged = labelSelection
            .enter()
            .append("g")
            .merge(labelSelection);
        labelSelectionMerged
            .append("svg:title")
            .classed(TornadoChart.LabelTitle.className, true);
        labelSelectionMerged
            .append("svg:text")
            .attr("dy", powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_14__/* .DefaultDy */ .EB)
            .classed(TornadoChart.LabelText.className, true);
        labelSelectionMerged
            .attr("pointer-events", "none")
            .classed(TornadoChart.Label.className, true);
        labelSelectionMerged
            .select(TornadoChart.LabelTitle.selectorName)
            .text((p) => p.label.source);
        labelSelectionMerged
            .attr("transform", (p, index) => {
            const dy = (this.heightColumn + this.columnPadding) * (index % categoriesLength);
            return translate(p.label.dx, dy + labelYOffset);
        });
        labelSelectionMerged
            .select(TornadoChart.LabelText.selectorName)
            .attr("fill", (p) => this.colorHelper.isHighContrast ? this.colorHelper.getHighContrastColor("foreground", p.color) : p.label.color)
            .attr("font-size", fontSizeInPx)
            .attr("font-family", labelFontFamily)
            .attr("font-weight", labelFontIsBold ? "bold" : "normal")
            .attr("font-style", labelFontIsItalic ? "italic" : "normal")
            .attr("text-decoration", labelFontIsUnderlined ? "underline" : "normal")
            .text((p) => p.label.value);
        labelSelection
            .exit()
            .remove();
    }
    renderCategories() {
        const formattingSettings = this.formattingSettings, color = formattingSettings.categoryCardSettings.fill.value.value, fontSizeInPx = powerbi_visuals_utils_typeutils__WEBPACK_IMPORTED_MODULE_15__.fromPoint(formattingSettings.categoryCardSettings.font.fontSize.value), position = this.formattingSettings.categoryCardSettings.positionDropdown.value.value.toString(), categoryElements = this.main
            .select(TornadoChart.Categories.selectorName)
            .selectAll(TornadoChart.Category.selectorName);
        const categoryFontFamily = formattingSettings.categoryCardSettings.font.fontFamily.value;
        const categoryFontIsBold = formattingSettings.categoryCardSettings.font.bold.value, categoryFontIsItalic = formattingSettings.categoryCardSettings.font.italic.value, categoryFontIsUnderlined = formattingSettings.categoryCardSettings.font.underline.value;
        if (!formattingSettings.categoryCardSettings.show.value) {
            categoryElements.remove();
            return;
        }
        const categoriesSelection = categoryElements.data(this.dataView.categories);
        const categoriesSelectionMerged = categoriesSelection
            .enter()
            .append("g")
            .merge(categoriesSelection);
        categoriesSelectionMerged
            .append("svg:title")
            .classed(TornadoChart.CategoryTitle.className, true);
        categoriesSelectionMerged
            .append("svg:text")
            .classed(TornadoChart.CategoryText.className, true);
        let xShift = 0;
        if (position === "Right") {
            xShift = this.viewportWidth - this.allLabelsWidth + TornadoChart.CategoryLabelMargin;
        }
        categoriesSelectionMerged
            .attr("transform", (text, index) => {
            let shift = (this.heightColumn + this.columnPadding) * index + this.heightColumn / 2;
            const textData = TornadoChart.getTextData(text, this.formattingSettings.categoryCardSettings.font, false, true, true);
            shift = shift + textData.height / 2 - this.InnerTextHeightDelta;
            return translate(xShift, shift);
        })
            .classed(TornadoChart.Category.className, true);
        categoriesSelectionMerged
            .select(TornadoChart.CategoryTitle.selectorName)
            .text((text) => text.text);
        categoriesSelectionMerged
            .select(TornadoChart.CategoryText.selectorName)
            .attr("fill", this.colorHelper.isHighContrast ? this.colorHelper.getHighContrastColor("foreground", color) : color)
            .attr("font-size", fontSizeInPx)
            .attr("font-family", categoryFontFamily)
            .attr("font-weight", categoryFontIsBold ? "bold" : "normal")
            .attr("font-style", categoryFontIsItalic ? "italic" : "normal")
            .attr("text-decoration", categoryFontIsUnderlined ? "underline" : "normal")
            .attr("dy", "0.25em")
            .text((data) => formattingSettings.categoryCardSettings.show.value
            ? powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_13__/* .textMeasurementService */ .yF.getTailoredTextOrDefault(TornadoChart.getTextData(data.text, this.formattingSettings.categoryCardSettings.font, false, true).textProperties, this.allLabelsWidth)
            : "");
        categoriesSelection
            .exit()
            .remove();
    }
    renderLegend() {
        const formattingSettings = this.formattingSettings;
        if (formattingSettings.legendCardSettings.show.value) {
            const legend = this.dataView.legend;
            if (!legend) {
                return;
            }
            const legendLabelsColor = formattingSettings.legendCardSettings.labelColor.value.value;
            const legendData = {
                title: legend.title,
                dataPoints: legend.dataPoints,
                fontSize: formattingSettings.legendCardSettings.font.fontSize.value,
                fontFamily: formattingSettings.legendCardSettings.font.fontFamily.value,
                labelColor: this.colorHelper.isHighContrast ? this.colorHelper.getHighContrastColor("foreground", legendLabelsColor) : legendLabelsColor
            };
            if (this.dataView.legendObjectProperties) {
                LegendDataModule.update(legendData, this.dataView.legendObjectProperties);
                const position = this.formattingSettings.legendCardSettings.positionDropdown.value.value;
                if (position) {
                    this.legend.changeOrientation(LegendPosition[position]);
                }
            }
            this.legend.drawLegend(legendData, Object.assign({}, this.viewport));
            this.element.selectAll("g#legendGroup text")
                .style("font-weight", () => this.formattingSettings.legendCardSettings.font.bold.value ? "bold" : "normal")
                .style("font-style", () => this.formattingSettings.legendCardSettings.font.italic.value ? "italic" : "normal")
                .style("text-decoration", () => this.formattingSettings.legendCardSettings.font.underline.value ? "underline" : "none");
            if (legendData.dataPoints.length > 0 && formattingSettings.legendCardSettings.show.value) {
                this.updateViewport();
            }
        }
        else {
            this.legend.reset();
            this.legend.drawLegend({ dataPoints: [] }, this.viewport);
        }
        TornadoChart.SetPositionsDependingOnLegend(this.rootContainer, formattingSettings.legendCardSettings, this.legend);
    }
    static SetPositionsDependingOnLegend(chartArea, legendSettings, legend) {
        const legendMargin = legend.getMargins();
        if (!legendSettings.topLevelSlice.value) {
            chartArea.style.inset = `0px 0px 20px 0px`;
            return;
        }
        switch (legendSettings.positionDropdown.value.value) {
            case LegendPosition[LegendPosition.Top]:
            case LegendPosition[LegendPosition.TopCenter]: {
                chartArea.style.inset = `${legendMargin.height}px 0px 20px 0px`;
                break;
            }
            case LegendPosition[LegendPosition.Bottom]:
            case LegendPosition[LegendPosition.BottomCenter]: {
                chartArea.style.inset = `0px 0px ${legendMargin.height + 20}px 0px`;
                break;
            }
            case LegendPosition[LegendPosition.Right]:
            case LegendPosition[LegendPosition.RightCenter]: {
                chartArea.style.inset = `0px 0px 20px 0px`;
                break;
            }
            case LegendPosition[LegendPosition.Left]:
            case LegendPosition[LegendPosition.LeftCenter]: {
                chartArea.style.inset = `0px 0px 20px ${legendMargin.width}px`;
                break;
            }
        }
    }
    destroy() {
        this.root = null;
    }
}
TornadoChart.ClassName = "tornado-chart";
TornadoChart.Container = "tornadoContainer";
TornadoChart.Columns = createClassAndSelector("columns");
TornadoChart.Column = createClassAndSelector("column");
TornadoChart.Axes = createClassAndSelector("axes");
TornadoChart.Axis = createClassAndSelector("axis");
TornadoChart.Labels = createClassAndSelector("labels");
TornadoChart.Label = createClassAndSelector("label");
TornadoChart.LabelTitle = createClassAndSelector("label-title");
TornadoChart.LabelText = createClassAndSelector("label-text");
TornadoChart.Categories = createClassAndSelector("categories");
TornadoChart.Category = createClassAndSelector("category");
TornadoChart.CategoryTitle = createClassAndSelector("category-title");
TornadoChart.CategoryText = createClassAndSelector("category-text");
TornadoChart.MaxSeries = 2;
TornadoChart.MaxPrecision = 17; // max number of decimals in float
TornadoChart.LabelPadding = 2.5;
TornadoChart.CategoryMinHeight = 25;
TornadoChart.HighlightedShapeFactor = 1;
TornadoChart.CategoryLabelMargin = 10;
TornadoChart.DefaultLabelSettingsDisplayUnits = 1;
TornadoChart.DefaultLabelSettingsLabelPrecision = null;
TornadoChart.MaxAngle = 180;
TornadoChart.MinAngle = 0;
TornadoChart.ScrollBarWidth = 22;
TornadoChart.DefaultLabelsWidth = 3;
TornadoChart.Properties = {
    dataPoint: {
        fill: { objectName: "dataPoint", propertyName: "fill" }
    }
};


/***/ }),

/***/ 1820:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Ct: () => (/* binding */ FontDefaultOptions),
/* harmony export */   Vd: () => (/* binding */ TornadoChartSettingsModel)
/* harmony export */ });
/* unused harmony exports DataLabelSettings, LegendCardSettings, BaseFontControlSettings, CategoryCardSettings */
/* harmony import */ var powerbi_visuals_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3350);
/* harmony import */ var powerbi_visuals_api__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(powerbi_visuals_api__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6084);
/* harmony import */ var powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8081);
/* harmony import */ var powerbi_visuals_utils_colorutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6188);




var LegendPosition = powerbi_visuals_utils_chartutils__WEBPACK_IMPORTED_MODULE_2__/* .LegendPosition */ .tV;
var Card = powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .SimpleCard */ .sF;
var Model = powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .Model */ .Hn;
class DataColorCardSettings extends Card {
    constructor() {
        super(...arguments);
        this.fill = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ColorPicker */ .zH({
            name: "fill",
            displayName: "Fill",
            displayNameKey: "Visual_Fill",
            value: { value: "#000000" }
        });
        this.name = "dataPoint";
        this.displayName = "Data colors";
        this.displayNameKey = "Visual_DataColors";
        this.description = "Display data color options";
        this.descriptionKey = "Visual_Description_DataColors";
        this.slices = [this.fill];
    }
}
class CategoryAxisCardSettings extends Card {
    constructor() {
        super(...arguments);
        this.end = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .NumUpDown */ .L_({
            name: "end",
            displayName: "End",
            displayNameKey: "Visual_XAxisEnd",
            value: 0
        });
        this.name = "categoryAxis";
        this.displayName = "X-Axis";
        this.displayNameKey = "Visual_XAxis";
        this.slices = [this.end];
    }
}
class DataLabelSettings extends Card {
    constructor() {
        super(...arguments);
        this.show = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ToggleSwitch */ .Zh({
            name: "show",
            displayName: "Show",
            displayNameKey: "Visual_Show",
            value: true,
        });
        this.topLevelSlice = this.show;
        this.font = new BaseFontControlSettings(9);
        this.labelPrecision = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .NumUpDown */ .L_({
            name: "labelPrecision",
            displayName: "Decimal Places",
            displayNameKey: "Visual_DataLabels_DecimalPlaces",
            value: 0,
            options: {
                minValue: {
                    type: 0 /* powerbiVisualsApi.visuals.ValidatorType.Min */,
                    value: 0,
                },
                maxValue: {
                    type: 1 /* powerbiVisualsApi.visuals.ValidatorType.Max */,
                    value: 25,
                }
            }
        });
        this.labelDisplayUnits = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .AutoDropdown */ .GN({
            name: "labelDisplayUnits",
            displayName: "Display Units",
            displayNameKey: "Visual_DisplayUnits",
            value: 1
        });
        this.insideFill = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ColorPicker */ .zH({
            name: "insideFill",
            displayName: "Inside fill",
            displayNameKey: "Visual_DataLabels_InsideFill",
            value: { value: "#FFFFFF" }
        });
        this.outsideFill = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ColorPicker */ .zH({
            name: "outsideFill",
            displayName: "Outside fill",
            displayNameKey: "Visual_DataLabels_OutsideFill",
            value: { value: "#666666" }
        });
        this.name = "labels";
        this.displayName = "Data Labels";
        this.displayNameKey = "Visual_DataLabels";
        this.slices = [this.font, this.labelPrecision, this.labelDisplayUnits, this.insideFill, this.outsideFill];
    }
}
const positionOptions = [
    { value: LegendPosition[LegendPosition.Top], displayName: "Top", key: "Visual_Legend_Position_Top" },
    { value: LegendPosition[LegendPosition.Bottom], displayName: "Bottom", key: "Visual_Legend_Position_Bottom" },
    { value: LegendPosition[LegendPosition.Left], displayName: "Left", key: "Visual_Legend_Position_Left" },
    { value: LegendPosition[LegendPosition.Right], displayName: "Right", key: "Visual_Legend_Position_Right" },
    { value: LegendPosition[LegendPosition.TopCenter], displayName: "Top Center", key: "Visual_Legend_Position_Top_Center" },
    { value: LegendPosition[LegendPosition.BottomCenter], displayName: "Bottom Center", key: "Visual_Legend_Position_Bottom_Center" },
    { value: LegendPosition[LegendPosition.LeftCenter], displayName: "Left Center", key: "Visual_Legend_Position_Left_Center" },
    { value: LegendPosition[LegendPosition.RightCenter], displayName: "Right Center", key: "Visual_Legend_Position_Right_Center" },
];
class LegendCardSettings extends Card {
    constructor() {
        super(...arguments);
        this.show = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ToggleSwitch */ .Zh({
            name: "show",
            displayName: "Show",
            displayNameKey: "Visual_Show",
            value: true,
        });
        this.topLevelSlice = this.show;
        this.positionDropdown = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ItemDropdown */ .zt({
            items: positionOptions,
            value: positionOptions[0],
            displayName: "Position",
            displayNameKey: "Visual_Legend_Position",
            name: "position"
        });
        this.showTitle = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ToggleSwitch */ .Zh({
            name: "showTitle",
            displayName: "Title",
            displayNameKey: "Visual_Title",
            value: true,
        });
        this.font = new BaseFontControlSettings(8);
        this.titleText = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .TextInput */ .oi({
            placeholder: "",
            value: "",
            displayName: "Legend Name",
            displayNameKey: "Visual_Legend_Name",
            name: "titleText"
        });
        this.labelColor = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ColorPicker */ .zH({
            name: "labelColor",
            displayName: "Color",
            displayNameKey: "Visual_Legend_Color",
            value: { value: "#666666" }
        });
        this.name = "legend";
        this.visible = false;
        this.displayName = "Legend";
        this.displayNameKey = "Visual_Legend";
        this.slices = [this.positionDropdown, this.showTitle, this.titleText, this.font, this.labelColor];
    }
}
const categoryPositionOptions = [
    { value: LegendPosition[LegendPosition.Left], displayName: "Left", key: "Visual_Group_Left" },
    { value: LegendPosition[LegendPosition.Right], displayName: "Right", key: "Visual_Group_Right" },
];
class FontDefaultOptions {
}
FontDefaultOptions.DefaultFontSizePt = 8;
FontDefaultOptions.DefaultFontFamily = "Segoe UI, wf_segoe-ui_normal, helvetica, arial, sans-serif";
class BaseFontControlSettings extends powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .FontControl */ .v5 {
    constructor(defaultFontSize) {
        super(new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .FontControl */ .v5({
            name: "font",
            fontFamily: new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .FontPicker */ .xp({
                name: "fontFamily",
                value: FontDefaultOptions.DefaultFontFamily
            }),
            fontSize: new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .NumUpDown */ .L_({
                name: "fontSize",
                displayName: "Text Size",
                displayNameKey: "Visual_TextSize",
                value: defaultFontSize,
                options: {
                    minValue: {
                        type: 0 /* powerbiVisualsApi.visuals.ValidatorType.Min */,
                        value: 8,
                    },
                    maxValue: {
                        type: 1 /* powerbiVisualsApi.visuals.ValidatorType.Max */,
                        value: 60,
                    }
                }
            }),
            bold: new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ToggleSwitch */ .Zh({
                name: "fontBold",
                value: false
            }),
            italic: new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ToggleSwitch */ .Zh({
                name: "fontItalic",
                value: false
            }),
            underline: new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ToggleSwitch */ .Zh({
                name: "fontUnderline",
                value: false
            })
        }));
    }
}
class CategoryCardSettings extends Card {
    constructor() {
        super(...arguments);
        this.show = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ToggleSwitch */ .Zh({
            name: "show",
            displayName: "Show",
            displayNameKey: "Visual_Show",
            value: true,
        });
        this.topLevelSlice = this.show;
        this.font = new BaseFontControlSettings(8);
        this.fill = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ColorPicker */ .zH({
            name: "fill",
            displayName: "Color",
            displayNameKey: "Visual_Color",
            value: { value: "#666666" }
        });
        this.positionDropdown = new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ItemDropdown */ .zt({
            items: categoryPositionOptions,
            value: categoryPositionOptions[0],
            name: "position",
            displayName: "Position",
            displayNameKey: "Visual_Position"
        });
        this.name = "categories";
        this.displayName = "Group";
        this.displayNameKey = "Visual_Group";
        this.slices = [this.fill, this.font, this.positionDropdown];
    }
}
class TornadoChartSettingsModel extends Model {
    constructor() {
        super(...arguments);
        this.dataColorsCardSettings = new DataColorCardSettings();
        this.categoryAxisCardSettings = new CategoryAxisCardSettings();
        this.dataLabelsSettings = new DataLabelSettings();
        this.legendCardSettings = new LegendCardSettings();
        this.categoryCardSettings = new CategoryCardSettings();
        this.cards = [
            this.dataColorsCardSettings,
            this.categoryAxisCardSettings,
            this.dataLabelsSettings,
            this.legendCardSettings,
            this.categoryCardSettings
        ];
    }
    setLocalizedOptions(localizationManager) {
        this.setLocalizedDisplayName(positionOptions, localizationManager);
        this.setLocalizedDisplayName(categoryPositionOptions, localizationManager);
    }
    setLocalizedDisplayName(options, localizationManager) {
        options.forEach(option => {
            option.displayName = localizationManager.getDisplayName(option.key);
        });
    }
    setVisibilityOfLegendCardSettings(legend) {
        this.legendCardSettings.visible = legend.dataPoints.length > 0;
    }
    populateDataColorSlice(dataPoints) {
        this.dataColorsCardSettings.slices = [];
        for (const dataPoint of dataPoints) {
            this.dataColorsCardSettings.slices.push(new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .ColorPicker */ .zH({
                name: "fill",
                displayName: dataPoint.name,
                selector: powerbi_visuals_utils_colorutils__WEBPACK_IMPORTED_MODULE_1__/* .ColorHelper */ .vH.normalizeSelector(dataPoint.selectionId.getSelector(), false),
                value: { value: dataPoint.fill }
            }));
        }
    }
    populateCategoryAxisSlice(dataPoints) {
        this.categoryAxisCardSettings.slices = [];
        for (const dataPoint of dataPoints) {
            this.categoryAxisCardSettings.slices.push(new powerbi_visuals_utils_formattingmodel__WEBPACK_IMPORTED_MODULE_3__/* .NumUpDown */ .L_({
                name: "end",
                displayName: dataPoint.name,
                value: dataPoint.categoryAxisEnd ? dataPoint.categoryAxisEnd : 0,
                selector: powerbi_visuals_utils_colorutils__WEBPACK_IMPORTED_MODULE_1__/* .ColorHelper */ .vH.normalizeSelector(dataPoint.selectionId.getSelector(), false)
            }));
        }
    }
}


/***/ }),

/***/ 9090:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   f: () => (/* binding */ TornadoWebBehavior)
/* harmony export */ });
/* harmony import */ var _tornadoChartUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5040);
/* harmony import */ var powerbi_visuals_utils_tooltiputils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9472);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */


class TornadoWebBehavior {
    bindEvents(options, selectionHandler) {
        this.columns = options.columns;
        this.clearCatcher = options.clearCatcher;
        this.interactivityService = options.interactivityService;
        this.tooltipServiceWrapper = (0,powerbi_visuals_utils_tooltiputils__WEBPACK_IMPORTED_MODULE_1__/* .createTooltipServiceWrapper */ .p)(options.tooltipArgs.tooltipService, options.tooltipArgs.tooltipElement);
        this.tooltipServiceWrapper.addTooltip(this.columns, (tooltipEvent) => {
            return tooltipEvent.tooltipData;
        }, (tooltipEvent) => {
            return tooltipEvent.identity;
        });
        this.columns.on("click", (event, dataPoint) => {
            event && selectionHandler.handleSelection(dataPoint, event.ctrlKey || event.metaKey || event.shiftKey);
        });
        this.columns.on("keydown", (event, dataPoint) => {
            if ((event === null || event === void 0 ? void 0 : event.code) == "Enter" || (event === null || event === void 0 ? void 0 : event.code) == "Space") {
                selectionHandler.handleSelection(dataPoint, event.ctrlKey || event.metaKey || event.shiftKey);
            }
        });
        //Handle contextmenu on columns
        this.columns.on("contextmenu", (event, dataPoint) => {
            selectionHandler.handleContextMenu(dataPoint, {
                x: event.clientX,
                y: event.clientY
            });
            event.preventDefault();
        });
        //Handle contextmenu on empty area
        this.clearCatcher.on("contextmenu", (event) => {
            selectionHandler.handleContextMenu({ "selected": false }, {
                x: event.clientX,
                y: event.clientY
            });
            event.preventDefault();
        });
        this.clearCatcher.on("click", () => {
            selectionHandler.handleClearSelection();
        });
    }
    renderSelection(hasSelection) {
        const hasHighlights = this.interactivityService.hasSelection();
        this.changeOpacityAttribute("fill-opacity", hasSelection, hasHighlights);
        this.changeOpacityAttribute("stroke-opacity", hasSelection, hasHighlights);
    }
    changeOpacityAttribute(attributeName, hasSelection, hasHighlights) {
        this.columns.style(attributeName, (d) => {
            return _tornadoChartUtils__WEBPACK_IMPORTED_MODULE_0__/* .TornadoChartUtils */ .e.getOpacity(d.selected, d.highlight, !d.highlight && hasSelection, !d.selected && hasHighlights);
        });
    }
}


/***/ }),

/***/ 8345:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   W: () => (/* binding */ TooltipArgsWrapper)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
class TooltipArgsWrapper {
    constructor(tooltipElement, tooltipService) {
        this.tooltipElement = tooltipElement;
        this.tooltipService = tooltipService;
    }
}


/***/ }),

/***/ 9320:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BY: () => (/* binding */ createTooltipInfo)
/* harmony export */ });
/* unused harmony exports createTooltipData, getFormattedValue, getFormatStringFromColumn */
/* harmony import */ var powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4776);
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */

const DefaultDisplayName = "";
const DisplayNameDelimiter = "/";
const DefaultSeriesIndex = 0;
const HighlightedValueDisplayName = "Visual_HighlightedValueDisplayName";
function createTooltipInfo(dataViewCat, categoryValue, localizationManager, value, seriesIndex, highlightedValue) {
    let categorySource, valuesSource = undefined;
    const seriesSource = [];
    seriesIndex = seriesIndex | DefaultSeriesIndex;
    const categoriesData = dataViewCat && dataViewCat.categories;
    if (categoriesData && categoriesData.length > 0) {
        if (categoriesData.length > 1) {
            const compositeCategoriesData = [];
            for (let i = 0, ilen = categoriesData.length; i < ilen; i++) {
                compositeCategoriesData.push(categoriesData[i].source);
            }
            categorySource = {
                value: categoryValue,
                metadata: compositeCategoriesData
            };
        }
        else {
            categorySource = {
                value: categoryValue,
                metadata: [categoriesData[0].source]
            };
        }
    }
    if (dataViewCat && dataViewCat.values) {
        if (!categorySource || !(categorySource.metadata[0] === dataViewCat.values.source)) {
            valuesSource = dataViewCat.values.source;
        }
        if (dataViewCat.values.length > 0) {
            const valueColumn = dataViewCat.values[seriesIndex], isAutoGeneratedColumn = !!(valueColumn
                && valueColumn.source
                && valueColumn.source.isAutoGeneratedColumn);
            if (!isAutoGeneratedColumn) {
                seriesSource.push({
                    value,
                    highlightedValue,
                    metadata: valueColumn
                });
            }
        }
    }
    return createTooltipData(categorySource, valuesSource, seriesSource, localizationManager);
}
function createTooltipData(categoryValue, valuesSource, seriesValues, localizationManager) {
    const items = [];
    if (categoryValue) {
        if (categoryValue.metadata.length > 1) {
            let displayName = DefaultDisplayName;
            for (let i = 0, ilen = categoryValue.metadata.length; i < ilen; i++) {
                if (i !== 0) {
                    displayName += DisplayNameDelimiter;
                }
                displayName += categoryValue.metadata[i].displayName;
            }
            const categoryFormattedValue = getFormattedValue(categoryValue.metadata[0], categoryValue.value);
            items.push({
                displayName,
                value: categoryFormattedValue
            });
        }
        else {
            const categoryFormattedValue = getFormattedValue(categoryValue.metadata[0], categoryValue.value);
            items.push({
                displayName: categoryValue.metadata[0].displayName,
                value: categoryFormattedValue
            });
        }
    }
    if (valuesSource) {
        // Dynamic series value
        let dynamicValue;
        if (seriesValues.length > 0) {
            const dynamicValueMetadata = seriesValues[0].metadata.source;
            dynamicValue = getFormattedValue(valuesSource, dynamicValueMetadata.groupName);
        }
        items.push({
            displayName: valuesSource.displayName,
            value: dynamicValue
        });
    }
    for (let i = 0; i < seriesValues.length; i++) {
        const seriesData = seriesValues[i];
        if (seriesData && seriesData.metadata) {
            const seriesMetadataColumn = seriesData.metadata.source, value = seriesData.value, highlightedValue = seriesData.highlightedValue;
            if (value || value === 0) {
                const formattedValue = getFormattedValue(seriesMetadataColumn, value);
                items.push({
                    displayName: seriesMetadataColumn.displayName,
                    value: formattedValue
                });
            }
            if (highlightedValue || highlightedValue === 0) {
                const formattedHighlightedValue = getFormattedValue(seriesMetadataColumn, highlightedValue);
                items.push({
                    displayName: localizationManager.getDisplayName(HighlightedValueDisplayName),
                    value: formattedHighlightedValue
                });
            }
        }
    }
    return items;
}
function getFormattedValue(column, value) {
    const formatString = getFormatStringFromColumn(column);
    return powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_0__/* .valueFormatter */ .wD.format(value, formatString);
}
function getFormatStringFromColumn(column) {
    if (column) {
        const formatString = powerbi_visuals_utils_formattingutils__WEBPACK_IMPORTED_MODULE_0__/* .valueFormatter */ .wD.getFormatStringByColumn(column, true);
        return formatString || column.format;
    }
    return null;
}


/***/ }),

/***/ 5040:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   e: () => (/* binding */ TornadoChartUtils)
/* harmony export */ });
/*
 *  Power BI Visualizations
 *
 *  Copyright (c) Microsoft Corporation
 *  All rights reserved.
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the ""Software""), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in
 *  all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 *  THE SOFTWARE.
 */
class TornadoChartUtils {
    static getOpacity(selected, highlight, hasSelection, hasPartialHighlights) {
        if ((hasPartialHighlights && !highlight) || (hasSelection && !selected)) {
            return TornadoChartUtils.DimmedOpacity;
        }
        return TornadoChartUtils.DefaultOpacity;
    }
}
TornadoChartUtils.DimmedOpacity = 0.4;
TornadoChartUtils.DefaultOpacity = 1.0;


/***/ }),

/***/ 3350:
/***/ ((module) => {

module.exports = null;

/***/ }),

/***/ 8776:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ max)
/* harmony export */ });
function max(values, valueof) {
  let max;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null
          && (max < value || (max === undefined && value >= value))) {
        max = value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null
          && (max < value || (max === undefined && value >= value))) {
        max = value;
      }
    }
  }
  return max;
}


/***/ }),

/***/ 8398:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ min)
/* harmony export */ });
function min(values, valueof) {
  let min;
  if (valueof === undefined) {
    for (const value of values) {
      if (value != null
          && (min > value || (min === undefined && value >= value))) {
        min = value;
      }
    }
  } else {
    let index = -1;
    for (let value of values) {
      if ((value = valueof(value, ++index, values)) != null
          && (min > value || (min === undefined && value >= value))) {
        min = value;
      }
    }
  }
  return min;
}


/***/ }),

/***/ 9898:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* binding */ array)
/* harmony export */ });
// Given something array like (or null), returns something that is strictly an
// array. This is used to ensure that array-like objects passed to d3.selectAll
// or selection.selectAll are converted into proper arrays when creating a
// selection; we don’t ever want to create a selection backed by a live
// HTMLCollection or NodeList. However, note that selection.selectAll will use a
// static NodeList as a group, since it safely derived from querySelectorAll.
function array(x) {
  return x == null ? [] : Array.isArray(x) ? x : Array.from(x);
}


/***/ }),

/***/ 364:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(x) {
  return function() {
    return x;
  };
}


/***/ }),

/***/ 4708:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _namespace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1663);
/* harmony import */ var _namespaces_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1226);



function creatorInherit(name) {
  return function() {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === _namespaces_js__WEBPACK_IMPORTED_MODULE_0__/* .xhtml */ .P && document.documentElement.namespaceURI === _namespaces_js__WEBPACK_IMPORTED_MODULE_0__/* .xhtml */ .P
        ? document.createElement(name)
        : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function() {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {
  var fullname = (0,_namespace_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(name);
  return (fullname.local
      ? creatorFixed
      : creatorInherit)(fullname);
}


/***/ }),

/***/ 4421:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ childMatcher),
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {
  return function() {
    return this.matches(selector);
  };
}

function childMatcher(selector) {
  return function(node) {
    return node.matches(selector);
  };
}



/***/ }),

/***/ 1663:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _namespaces_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1226);


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {
  var prefix = name += "", i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return _namespaces_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z.hasOwnProperty(prefix) ? {space: _namespaces_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z[prefix], local: name} : name; // eslint-disable-line no-prototype-builtins
}


/***/ }),

/***/ 1226:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   P: () => (/* binding */ xhtml),
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var xhtml = "http://www.w3.org/1999/xhtml";

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
});


/***/ }),

/***/ 3838:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _selection_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8390);


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {
  return typeof selector === "string"
      ? new _selection_index_js__WEBPACK_IMPORTED_MODULE_0__/* .Selection */ .Y1([[document.querySelector(selector)]], [document.documentElement])
      : new _selection_index_js__WEBPACK_IMPORTED_MODULE_0__/* .Selection */ .Y1([[selector]], _selection_index_js__WEBPACK_IMPORTED_MODULE_0__/* .root */ .Jz);
}


/***/ }),

/***/ 4264:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9898);
/* harmony import */ var _selection_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8390);



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {
  return typeof selector === "string"
      ? new _selection_index_js__WEBPACK_IMPORTED_MODULE_0__/* .Selection */ .Y1([document.querySelectorAll(selector)], [document.documentElement])
      : new _selection_index_js__WEBPACK_IMPORTED_MODULE_0__/* .Selection */ .Y1([(0,_array_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(selector)], _selection_index_js__WEBPACK_IMPORTED_MODULE_0__/* .root */ .Jz);
}


/***/ }),

/***/ 7911:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _creator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4708);


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name) {
  var create = typeof name === "function" ? name : (0,_creator_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(name);
  return this.select(function() {
    return this.appendChild(create.apply(this, arguments));
  });
}


/***/ }),

/***/ 7405:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _namespace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1663);


function attrRemove(name) {
  return function() {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function() {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function() {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function() {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);
    else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);
    else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {
  var fullname = (0,_namespace_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local
        ? node.getAttributeNS(fullname.space, fullname.local)
        : node.getAttribute(fullname);
  }

  return this.each((value == null
      ? (fullname.local ? attrRemoveNS : attrRemove) : (typeof value === "function"
      ? (fullname.local ? attrFunctionNS : attrFunction)
      : (fullname.local ? attrConstantNS : attrConstant)))(fullname, value));
}


/***/ }),

/***/ 5772:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
}


/***/ }),

/***/ 5016:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.add(names[i]);
}

function classedRemove(node, names) {
  var list = classList(node), i = -1, n = names.length;
  while (++i < n) list.remove(names[i]);
}

function classedTrue(names) {
  return function() {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function() {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function() {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()), i = -1, n = names.length;
    while (++i < n) if (!list.contains(names[i])) return false;
    return true;
  }

  return this.each((typeof value === "function"
      ? classedFunction : value
      ? classedTrue
      : classedFalse)(names, value));
}


/***/ }),

/***/ 5122:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function selection_cloneShallow() {
  var clone = this.cloneNode(false), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

function selection_cloneDeep() {
  var clone = this.cloneNode(true), parent = this.parentNode;
  return parent ? parent.insertBefore(clone, this.nextSibling) : clone;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
}


/***/ }),

/***/ 4764:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8390);
/* harmony import */ var _enter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2270);
/* harmony import */ var _constant_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(364);




function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new _enter_js__WEBPACK_IMPORTED_MODULE_0__/* .EnterNode */ .F(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = new Map,
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = key.call(node, node.__data__, i, group) + "";
      if (nodeByKeyValue.has(keyValue)) {
        exit[i] = node;
      } else {
        nodeByKeyValue.set(keyValue, node);
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = key.call(parent, data[i], i, data) + "";
    if (node = nodeByKeyValue.get(keyValue)) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue.delete(keyValue);
    } else {
      enter[i] = new _enter_js__WEBPACK_IMPORTED_MODULE_0__/* .EnterNode */ .F(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && (nodeByKeyValue.get(keyValues[i]) === node)) {
      exit[i] = node;
    }
  }
}

function datum(node) {
  return node.__data__;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value, key) {
  if (!arguments.length) return Array.from(this, datum);

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = (0,_constant_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = arraylike(value.call(parent, parent && parent.__data__, j, parents)),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength);
        previous._next = next || null;
      }
    }
  }

  update = new _index_js__WEBPACK_IMPORTED_MODULE_2__/* .Selection */ .Y1(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
}

// Given some data, this returns an array-like view of it: an object that
// exposes a length property and allows numeric indexing. Note that unlike
// selectAll, this isn’t worried about “live” collections because the resulting
// array will only be used briefly while data is being bound. (It is possible to
// cause the data to change while iterating by using a key function, but please
// don’t; we’d rather avoid a gratuitous copy.)
function arraylike(data) {
  return typeof data === "object" && "length" in data
    ? data // Array, TypedArray, NodeList, array-like
    : Array.from(data); // Map, Set, iterable, string, or anything else
}


/***/ }),

/***/ 5667:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  return arguments.length
      ? this.property("__data__", value)
      : this.node().__data__;
}


/***/ }),

/***/ 3790:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _window_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9920);


function dispatchEvent(node, type, params) {
  var window = (0,_window_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;
    else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function() {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function() {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(type, params) {
  return this.each((typeof params === "function"
      ? dispatchFunction
      : dispatchConstant)(type, params));
}


/***/ }),

/***/ 6347:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
}


/***/ }),

/***/ 7844:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return !this.node();
}


/***/ }),

/***/ 2270:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   F: () => (/* binding */ EnterNode),
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _sparse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1586);
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8390);



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return new _index_js__WEBPACK_IMPORTED_MODULE_0__/* .Selection */ .Y1(this._enter || this._groups.map(_sparse_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z), this._parents);
}

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function(child) { return this._parent.insertBefore(child, this._next); },
  insertBefore: function(child, next) { return this._parent.insertBefore(child, next); },
  querySelector: function(selector) { return this._parent.querySelector(selector); },
  querySelectorAll: function(selector) { return this._parent.querySelectorAll(selector); }
};


/***/ }),

/***/ 6790:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _sparse_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1586);
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8390);



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return new _index_js__WEBPACK_IMPORTED_MODULE_0__/* .Selection */ .Y1(this._exit || this._groups.map(_sparse_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z), this._parents);
}


/***/ }),

/***/ 5777:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8390);
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4421);



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(match) {
  if (typeof match !== "function") match = (0,_matcher_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_1__/* .Selection */ .Y1(subgroups, this._parents);
}


/***/ }),

/***/ 655:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function() {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  return arguments.length
      ? this.each(value == null
          ? htmlRemove : (typeof value === "function"
          ? htmlFunction
          : htmlConstant)(value))
      : this.node().innerHTML;
}


/***/ }),

/***/ 8390:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Jz: () => (/* binding */ root),
/* harmony export */   Y1: () => (/* binding */ Selection)
/* harmony export */ });
/* harmony import */ var _select_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(486);
/* harmony import */ var _selectAll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6932);
/* harmony import */ var _selectChild_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4735);
/* harmony import */ var _selectChildren_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(467);
/* harmony import */ var _filter_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5777);
/* harmony import */ var _data_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4764);
/* harmony import */ var _enter_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2270);
/* harmony import */ var _exit_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(6790);
/* harmony import */ var _join_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(1474);
/* harmony import */ var _merge_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(6359);
/* harmony import */ var _order_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(4729);
/* harmony import */ var _sort_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(9548);
/* harmony import */ var _call_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(5772);
/* harmony import */ var _nodes_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(426);
/* harmony import */ var _node_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(838);
/* harmony import */ var _size_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(6909);
/* harmony import */ var _empty_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(7844);
/* harmony import */ var _each_js__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(6347);
/* harmony import */ var _attr_js__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(7405);
/* harmony import */ var _style_js__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(2627);
/* harmony import */ var _property_js__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(9714);
/* harmony import */ var _classed_js__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(5016);
/* harmony import */ var _text_js__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(8386);
/* harmony import */ var _html_js__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(655);
/* harmony import */ var _raise_js__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(1903);
/* harmony import */ var _lower_js__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(6017);
/* harmony import */ var _append_js__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(7911);
/* harmony import */ var _insert_js__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(2504);
/* harmony import */ var _remove_js__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(8349);
/* harmony import */ var _clone_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(5122);
/* harmony import */ var _datum_js__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(5667);
/* harmony import */ var _on_js__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(2017);
/* harmony import */ var _dispatch_js__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(3790);
/* harmony import */ var _iterator_js__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(3536);



































var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

function selection_selection() {
  return this;
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: _select_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z,
  selectAll: _selectAll_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z,
  selectChild: _selectChild_js__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z,
  selectChildren: _selectChildren_js__WEBPACK_IMPORTED_MODULE_3__/* ["default"] */ .Z,
  filter: _filter_js__WEBPACK_IMPORTED_MODULE_4__/* ["default"] */ .Z,
  data: _data_js__WEBPACK_IMPORTED_MODULE_5__/* ["default"] */ .Z,
  enter: _enter_js__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z,
  exit: _exit_js__WEBPACK_IMPORTED_MODULE_7__/* ["default"] */ .Z,
  join: _join_js__WEBPACK_IMPORTED_MODULE_8__/* ["default"] */ .Z,
  merge: _merge_js__WEBPACK_IMPORTED_MODULE_9__/* ["default"] */ .Z,
  selection: selection_selection,
  order: _order_js__WEBPACK_IMPORTED_MODULE_10__/* ["default"] */ .Z,
  sort: _sort_js__WEBPACK_IMPORTED_MODULE_11__/* ["default"] */ .Z,
  call: _call_js__WEBPACK_IMPORTED_MODULE_12__/* ["default"] */ .Z,
  nodes: _nodes_js__WEBPACK_IMPORTED_MODULE_13__/* ["default"] */ .Z,
  node: _node_js__WEBPACK_IMPORTED_MODULE_14__/* ["default"] */ .Z,
  size: _size_js__WEBPACK_IMPORTED_MODULE_15__/* ["default"] */ .Z,
  empty: _empty_js__WEBPACK_IMPORTED_MODULE_16__/* ["default"] */ .Z,
  each: _each_js__WEBPACK_IMPORTED_MODULE_17__/* ["default"] */ .Z,
  attr: _attr_js__WEBPACK_IMPORTED_MODULE_18__/* ["default"] */ .Z,
  style: _style_js__WEBPACK_IMPORTED_MODULE_19__/* ["default"] */ .Z,
  property: _property_js__WEBPACK_IMPORTED_MODULE_20__/* ["default"] */ .Z,
  classed: _classed_js__WEBPACK_IMPORTED_MODULE_21__/* ["default"] */ .Z,
  text: _text_js__WEBPACK_IMPORTED_MODULE_22__/* ["default"] */ .Z,
  html: _html_js__WEBPACK_IMPORTED_MODULE_23__/* ["default"] */ .Z,
  raise: _raise_js__WEBPACK_IMPORTED_MODULE_24__/* ["default"] */ .Z,
  lower: _lower_js__WEBPACK_IMPORTED_MODULE_25__/* ["default"] */ .Z,
  append: _append_js__WEBPACK_IMPORTED_MODULE_26__/* ["default"] */ .Z,
  insert: _insert_js__WEBPACK_IMPORTED_MODULE_27__/* ["default"] */ .Z,
  remove: _remove_js__WEBPACK_IMPORTED_MODULE_28__/* ["default"] */ .Z,
  clone: _clone_js__WEBPACK_IMPORTED_MODULE_29__/* ["default"] */ .Z,
  datum: _datum_js__WEBPACK_IMPORTED_MODULE_30__/* ["default"] */ .Z,
  on: _on_js__WEBPACK_IMPORTED_MODULE_31__/* ["default"] */ .Z,
  dispatch: _dispatch_js__WEBPACK_IMPORTED_MODULE_32__/* ["default"] */ .Z,
  [Symbol.iterator]: _iterator_js__WEBPACK_IMPORTED_MODULE_33__/* ["default"] */ .Z
};

/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (selection)));


/***/ }),

/***/ 2504:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _creator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4708);
/* harmony import */ var _selector_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3010);



function constantNull() {
  return null;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, before) {
  var create = typeof name === "function" ? name : (0,_creator_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(name),
      select = before == null ? constantNull : typeof before === "function" ? before : (0,_selector_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(before);
  return this.select(function() {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
}


/***/ }),

/***/ 3536:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function* __WEBPACK_DEFAULT_EXPORT__() {
  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) yield node;
    }
  }
}


/***/ }),

/***/ 1474:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(onenter, onupdate, onexit) {
  var enter = this.enter(), update = this, exit = this.exit();
  if (typeof onenter === "function") {
    enter = onenter(enter);
    if (enter) enter = enter.selection();
  } else {
    enter = enter.append(onenter + "");
  }
  if (onupdate != null) {
    update = onupdate(update);
    if (update) update = update.selection();
  }
  if (onexit == null) exit.remove(); else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
}


/***/ }),

/***/ 6017:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return this.each(lower);
}


/***/ }),

/***/ 6359:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8390);


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(context) {
  var selection = context.selection ? context.selection() : context;

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_0__/* .Selection */ .Y1(merges, this._parents);
}


/***/ }),

/***/ 838:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
}


/***/ }),

/***/ 426:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return Array.from(this);
}


/***/ }),

/***/ 2017:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function contextListener(listener) {
  return function(event) {
    listener.call(this, event, this.__data__);
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function(t) {
    var name = "", i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return {type: t, name: name};
  });
}

function onRemove(typename) {
  return function() {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;
    else delete this.__on;
  };
}

function onAdd(typename, value, options) {
  return function() {
    var on = this.__on, o, listener = contextListener(value);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.options);
        this.addEventListener(o.type, o.listener = listener, o.options = options);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, options);
    o = {type: typename.type, name: typename.name, value: value, listener: listener, options: options};
    if (!on) this.__on = [o];
    else on.push(o);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(typename, value, options) {
  var typenames = parseTypenames(typename + ""), i, n = typenames.length, t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  for (i = 0; i < n; ++i) this.each(on(typenames[i], value, options));
  return this;
}


/***/ }),

/***/ 4729:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
}


/***/ }),

/***/ 9714:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function propertyRemove(name) {
  return function() {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function() {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];
    else this[name] = v;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value) {
  return arguments.length > 1
      ? this.each((value == null
          ? propertyRemove : typeof value === "function"
          ? propertyFunction
          : propertyConstant)(name, value))
      : this.node()[name];
}


/***/ }),

/***/ 1903:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return this.each(raise);
}


/***/ }),

/***/ 8349:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  return this.each(remove);
}


/***/ }),

/***/ 486:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8390);
/* harmony import */ var _selector_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3010);



/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(select) {
  if (typeof select !== "function") select = (0,_selector_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_1__/* .Selection */ .Y1(subgroups, this._parents);
}


/***/ }),

/***/ 6932:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8390);
/* harmony import */ var _array_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9898);
/* harmony import */ var _selectorAll_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9701);




function arrayAll(select) {
  return function() {
    return (0,_array_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(select.apply(this, arguments));
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(select) {
  if (typeof select === "function") select = arrayAll(select);
  else select = (0,_selectorAll_js__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z)(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_2__/* .Selection */ .Y1(subgroups, parents);
}


/***/ }),

/***/ 4735:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4421);


var find = Array.prototype.find;

function childFind(match) {
  return function() {
    return find.call(this.children, match);
  };
}

function childFirst() {
  return this.firstElementChild;
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(match) {
  return this.select(match == null ? childFirst
      : childFind(typeof match === "function" ? match : (0,_matcher_js__WEBPACK_IMPORTED_MODULE_0__/* .childMatcher */ .P)(match)));
}


/***/ }),

/***/ 467:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _matcher_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4421);


var filter = Array.prototype.filter;

function children() {
  return Array.from(this.children);
}

function childrenFilter(match) {
  return function() {
    return filter.call(this.children, match);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(match) {
  return this.selectAll(match == null ? children
      : childrenFilter(typeof match === "function" ? match : (0,_matcher_js__WEBPACK_IMPORTED_MODULE_0__/* .childMatcher */ .P)(match)));
}


/***/ }),

/***/ 6909:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__() {
  let size = 0;
  for (const node of this) ++size; // eslint-disable-line no-unused-vars
  return size;
}


/***/ }),

/***/ 9548:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8390);


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new _index_js__WEBPACK_IMPORTED_MODULE_0__/* .Selection */ .Y1(sortgroups, this._parents).order();
}

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}


/***/ }),

/***/ 1586:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(update) {
  return new Array(update.length);
}


/***/ }),

/***/ 2627:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export styleValue */
/* harmony import */ var _window_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9920);


function styleRemove(name) {
  return function() {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function() {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function() {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);
    else this.style.setProperty(name, v, priority);
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(name, value, priority) {
  return arguments.length > 1
      ? this.each((value == null
            ? styleRemove : typeof value === "function"
            ? styleFunction
            : styleConstant)(name, value, priority == null ? "" : priority))
      : styleValue(this.node(), name);
}

function styleValue(node, name) {
  return node.style.getPropertyValue(name)
      || (0,_window_js__WEBPACK_IMPORTED_MODULE_0__/* ["default"] */ .Z)(node).getComputedStyle(node, null).getPropertyValue(name);
}


/***/ }),

/***/ 8386:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function() {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function() {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(value) {
  return arguments.length
      ? this.each(value == null
          ? textRemove : (typeof value === "function"
          ? textFunction
          : textConstant)(value))
      : this.node().textContent;
}


/***/ }),

/***/ 3010:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function none() {}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {
  return selector == null ? none : function() {
    return this.querySelector(selector);
  };
}


/***/ }),

/***/ 9701:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function empty() {
  return [];
}

/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(selector) {
  return selector == null ? empty : function() {
    return this.querySelectorAll(selector);
  };
}


/***/ }),

/***/ 9920:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(node) {
  return (node.ownerDocument && node.ownerDocument.defaultView) // node is a Node
      || (node.document && node) // node is a Window
      || node.defaultView; // node is a Document
}


/***/ }),

/***/ 1739:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R8: () => (/* binding */ timerFlush)
/* harmony export */ });
/* unused harmony exports now, Timer, timer */
var frame = 0, // is an animation frame pending?
    timeout = 0, // is a timeout pending?
    interval = 0, // are any timers active?
    pokeDelay = 1000, // how frequently we check for clock skew
    taskHead,
    taskTail,
    clockLast = 0,
    clockNow = 0,
    clockSkew = 0,
    clock = typeof performance === "object" && performance.now ? performance : Date,
    setFrame = typeof window === "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(f) { setTimeout(f, 17); };

function now() {
  return clockNow || (setFrame(clearNow), clockNow = clock.now() + clockSkew);
}

function clearNow() {
  clockNow = 0;
}

function Timer() {
  this._call =
  this._time =
  this._next = null;
}

Timer.prototype = timer.prototype = {
  constructor: Timer,
  restart: function(callback, delay, time) {
    if (typeof callback !== "function") throw new TypeError("callback is not a function");
    time = (time == null ? now() : +time) + (delay == null ? 0 : +delay);
    if (!this._next && taskTail !== this) {
      if (taskTail) taskTail._next = this;
      else taskHead = this;
      taskTail = this;
    }
    this._call = callback;
    this._time = time;
    sleep();
  },
  stop: function() {
    if (this._call) {
      this._call = null;
      this._time = Infinity;
      sleep();
    }
  }
};

function timer(callback, delay, time) {
  var t = new Timer;
  t.restart(callback, delay, time);
  return t;
}

function timerFlush() {
  now(); // Get the current time, if not already set.
  ++frame; // Pretend we’ve set an alarm, if we haven’t already.
  var t = taskHead, e;
  while (t) {
    if ((e = clockNow - t._time) >= 0) t._call.call(undefined, e);
    t = t._next;
  }
  --frame;
}

function wake() {
  clockNow = (clockLast = clock.now()) + clockSkew;
  frame = timeout = 0;
  try {
    timerFlush();
  } finally {
    frame = 0;
    nap();
    clockNow = 0;
  }
}

function poke() {
  var now = clock.now(), delay = now - clockLast;
  if (delay > pokeDelay) clockSkew -= delay, clockLast = now;
}

function nap() {
  var t0, t1 = taskHead, t2, time = Infinity;
  while (t1) {
    if (t1._call) {
      if (time > t1._time) time = t1._time;
      t0 = t1, t1 = t1._next;
    } else {
      t2 = t1._next, t1._next = null;
      t1 = t0 ? t0._next = t2 : taskHead = t2;
    }
  }
  taskTail = t0;
  sleep(time);
}

function sleep(time) {
  if (frame) return; // Soonest alarm already set, or will be.
  if (timeout) timeout = clearTimeout(timeout);
  var delay = time - clockNow; // Strictly less than if we recomputed clockNow.
  if (delay > 24) {
    if (time < Infinity) timeout = setTimeout(wake, time - clock.now() - clockSkew);
    if (interval) interval = clearInterval(interval);
  } else {
    if (!interval) clockLast = clock.now(), interval = setInterval(poke, pokeDelay);
    frame = 1, setFrame(wake);
  }
}


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _src_TornadoChart__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5581);

var powerbiKey = "powerbi";
var powerbi = window[powerbiKey];
var TornadoChart1452517688218 = {
    name: 'TornadoChart1452517688218',
    displayName: 'Tornado 3.0.2.0',
    class: 'TornadoChart',
    apiVersion: '5.4.0',
    create: (options) => {
        if (_src_TornadoChart__WEBPACK_IMPORTED_MODULE_0__/* .TornadoChart */ .M) {
            return new _src_TornadoChart__WEBPACK_IMPORTED_MODULE_0__/* .TornadoChart */ .M(options);
        }
        throw 'Visual instance not found';
    },
    createModalDialog: (dialogId, options, initialState) => {
        const dialogRegistry = globalThis.dialogRegistry;
        if (dialogId in dialogRegistry) {
            new dialogRegistry[dialogId](options, initialState);
        }
    },
    custom: true
};
if (typeof powerbi !== "undefined") {
    powerbi.visuals = powerbi.visuals || {};
    powerbi.visuals.plugins = powerbi.visuals.plugins || {};
    powerbi.visuals.plugins["TornadoChart1452517688218"] = TornadoChart1452517688218;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (TornadoChart1452517688218);

})();

TornadoChart1452517688218 = __webpack_exports__;
/******/ })()
;