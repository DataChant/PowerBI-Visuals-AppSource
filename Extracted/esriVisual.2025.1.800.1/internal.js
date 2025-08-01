var esriVisual;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 731:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.EsriCRLRoot = exports.EsriVisualAppRoot = exports.isDevMode = void 0;
// to indicate if in Dev or PROD
exports.isDevMode = "production" === "development";
// The host path for the Esri Visual App
exports.EsriVisualAppRoot = "https://la.arcgis.com/powerbi/2025_1";
// The host path for CURL; the host serving CURL could be different from the host serving the Esri visual app
exports.EsriCRLRoot = "https://la.arcgis.com/crl";

/***/ }),

/***/ 981:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.loadComponent = void 0;
let hasRemoteLoaded = false;
let isRemoteScriptLoading = false;
function remoteScriptLoader(resolve, reject) {
  if (hasRemoteLoaded) {
    resolve(hasRemoteLoaded);
  } else if (!isRemoteScriptLoading) {
    isRemoteScriptLoading = true;
    const remoteEntryScript = document.createElement("script");
    remoteEntryScript.src = `${window["EsriVisualAppRoot"]}/remoteEntry.js`;
    remoteEntryScript.type = "text/javascript";
    remoteEntryScript.async = true;
    remoteEntryScript.onload = () => {
      console.log("remote entry loaded");
      hasRemoteLoaded = true;
      resolve(hasRemoteLoaded);
    };
    remoteEntryScript.onerror = () => {
      console.log("remote entry failed to load");
      reject();
    };
    document.head.appendChild(remoteEntryScript);
  }
}
function loadComponent(scope, module) {
  return async () => {
    const isScriptLoaded = await new Promise(remoteScriptLoader);
    if (isScriptLoaded) {
      // Initializes the share scope. This fills it with known provided modules from this build and all remotes
      await __webpack_require__.I("default");
      const container = window[scope]; // or get the container somewhere else
      // Initialize the container, it may provide shared modules
      await container.init(__webpack_require__.S.default);
      const factory = await window[scope].get(module);
      return factory();
    } else {
      return null;
    }
  };
}
exports.loadComponent = loadComponent;

/***/ }),

/***/ 219:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.VisualSettingsModel = void 0;
const powerbi_visuals_utils_formattingmodel_1 = __webpack_require__(674);
var FormattingSettingsCard = powerbi_visuals_utils_formattingmodel_1.formattingSettings.SimpleCard;
var FormattingSettingsModel = powerbi_visuals_utils_formattingmodel_1.formattingSettings.Model;
class VisualSettingsModel extends FormattingSettingsModel {
  constructor() {
    super(...arguments);
    this.mapTools = new MapToolSettings();
    this.mapControls = new MapControlSettings();
    this.featureInfo = new FeatureInfoSettings();
    this.theme = new ThemeSettings();
    this.cards = [this.mapTools, this.mapControls, this.featureInfo, this.theme];
  }
  static transform(setting) {
    const {
      mapTools,
      mapControls,
      featureInfo,
      theme
    } = setting;
    // console.log("setting", setting);
    return {
      mapTools: {
        layerVisible: mapTools.layerVisible.value,
        basemaps: mapTools.basemaps.value,
        selection: mapTools.selection.value,
        geoSearch: mapTools.geoSearch.value,
        analysis: mapTools.analysis.value,
        settings: mapTools.settings.value
      },
      mapControls: {
        zoomTools: mapControls.zoomTools.value,
        lockMapExtent: mapControls.lockMapExtent.value,
        showHome: mapControls.showHome.value,
        homeSetting: mapControls.homeSetting.value.value.toString()
      },
      featureInfo: {
        show: featureInfo.show.value,
        position: featureInfo.position.value.value.toString()
      },
      theme: {
        enable: theme.enable.value
      }
    };
  }
}
exports.VisualSettingsModel = VisualSettingsModel;
class MapControlSettings extends FormattingSettingsCard {
  constructor() {
    super(...arguments);
    this.zoomTools = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "zoomTools",
      displayNameKey: "ZoomTools",
      value: false
    });
    this.lockMapExtent = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "lockMapExtent",
      displayNameKey: "DisableMapChange",
      value: false
    });
    this.showHome = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "showHome",
      displayNameKey: "ShowHome",
      value: false
    });
    this.default = {
      displayName: VisualSettingsModel.localizationManager.getDisplayName("DefaultExtent"),
      value: "default"
    };
    this.home1 = {
      displayName: VisualSettingsModel.localizationManager.getDisplayName("HomeExtent"),
      value: "home1"
    };
    this.home2 = {
      displayName: VisualSettingsModel.localizationManager.getDisplayName("SetToCurrentMapView"),
      value: "home2"
    };
    this.homeSetting = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ItemDropdown({
      name: "homeSetting",
      displayNameKey: "HomeSetting",
      value: this.default,
      items: [this.default, this.home1, this.home2]
    });
    this.name = "mapControls"; // needs to match capabilities.json
    this.displayNameKey = "MapControls";
    this.descriptionKey = "MapControls_Desc";
    this.slices = [this.zoomTools, this.lockMapExtent, this.showHome, this.homeSetting];
  }
  onPreProcess() {
    // hides the home setting if show home is off
    this.homeSetting.visible = this.showHome.value;
    if (this.homeSetting.visible) {
      // reset dropdown options, positions and texts
      // "Default extent" will always be in the first position
      // by swapping the item position of home1 or home2, "Home extent" will always be in the 2nd position of the dropdown
      // ... and the value associated with "Set to current map view" will be different than the current "Home extent" value
      if (this.homeSetting.value.value === "home1") {
        this.home1.displayName = VisualSettingsModel.localizationManager.getDisplayName("HomeExtent");
        this.home2.displayName = VisualSettingsModel.localizationManager.getDisplayName("SetToCurrentMapView");
        this.homeSetting.items = [this.default, this.home1, this.home2];
      } else if (this.homeSetting.value.value === "home2") {
        this.home1.displayName = VisualSettingsModel.localizationManager.getDisplayName("SetToCurrentMapView");
        this.home2.displayName = VisualSettingsModel.localizationManager.getDisplayName("HomeExtent");
        this.homeSetting.items = [this.default, this.home2, this.home1];
      } else if (this.homeSetting.value.value === "default") {
        // when switching to "Default extent", no "Home extent" is saved/active, so only show "Set to current map view"
        this.home1.displayName = VisualSettingsModel.localizationManager.getDisplayName("SetToCurrentMapView");
        this.homeSetting.items = [this.default, this.home1];
      }
    }
  }
}
class MapToolSettings extends FormattingSettingsCard {
  constructor() {
    super(...arguments);
    this.layerVisible = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "layerVisible",
      displayNameKey: "ShowLayers",
      value: true
    });
    this.basemaps = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "basemaps",
      displayNameKey: "Basemaps",
      value: false
    });
    this.selection = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "selection",
      displayNameKey: "Selection",
      value: true
    });
    this.geoSearch = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "geoSearch",
      displayNameKey: "Search",
      value: true
    });
    this.analysis = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "analysis",
      displayNameKey: "Analysis",
      value: true
    });
    this.settings = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "settings",
      displayNameKey: "Settings",
      value: true
    });
    this.name = "mapTools";
    this.displayNameKey = "MapTools";
    this.descriptionKey = "MapTools_Desc";
    this.slices = [this.layerVisible, this.basemaps, this.selection, this.geoSearch, this.analysis, this.settings];
  }
}
class FeatureInfoSettings extends FormattingSettingsCard {
  constructor() {
    super(...arguments);
    this._left = VisualSettingsModel.localizationManager.getDisplayName("Left");
    this._right = VisualSettingsModel.localizationManager.getDisplayName("Right");
    this.show = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "show",
      displayNameKey: "EnablePopups",
      value: false
    });
    this.left = {
      displayName: VisualSettingsModel.isRTL ? this._right : this._left,
      value: "left"
    };
    this.top = {
      displayName: VisualSettingsModel.localizationManager.getDisplayName("Top"),
      value: "top"
    };
    this.right = {
      displayName: VisualSettingsModel.isRTL ? this._left : this._right,
      value: "right"
    };
    this.bottom = {
      displayName: VisualSettingsModel.localizationManager.getDisplayName("Bottom"),
      value: "bottom"
    };
    this.position = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ItemDropdown({
      name: "position",
      displayNameKey: "PopUpsPosition",
      value: this.left,
      items: [this.left, this.top, this.right, this.bottom]
    });
    this.name = "featureInfo";
    //TODO: Refactor for toggling clicking. JSAPI popup can only appear when clicking on feature. There is no requirement for hover jsapi popups anymore.
    this.displayNameKey = "PopUps";
    this.descriptionKey = "PopUps_Desc";
    this.slices = [this.show, this.position];
  }
}
class ThemeSettings extends FormattingSettingsCard {
  constructor() {
    super(...arguments);
    this.enable = new powerbi_visuals_utils_formattingmodel_1.formattingSettings.ToggleSwitch({
      name: "enable",
      displayNameKey: "EnableTheme",
      descriptionKey: "EnableTheme",
      value: false
    });
    this.name = "theme";
    this.displayNameKey = "Theme";
    this.descriptionKey = "Theme_Desc";
    this.slices = [this.enable];
  }
}

/***/ }),

/***/ 90:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
    desc = {
      enumerable: true,
      get: function () {
        return m[k];
      }
    };
  }
  Object.defineProperty(o, k2, desc);
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});
var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
  __setModuleDefault(result, mod);
  return result;
};
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Visual = void 0;
__webpack_require__(332);
const powerbi_visuals_utils_formattingmodel_1 = __webpack_require__(674);
const settings_1 = __webpack_require__(219);
const deployConfig_1 = __webpack_require__(731);
class Visual {
  constructor(options) {
    // Flag for when App Component creation has started
    this.hasAppComponentCreationStarted = false;
    // Flag for when App Component creation has completed
    this.hasAppComponentCreationCompleted = false;
    this.currentOptions = [];
    this.forceInitialUpdate = true;
    const localizationManager = options.host.createLocalizationManager();
    const locale = options.host.locale;
    this.formattingSettingsService = new powerbi_visuals_utils_formattingmodel_1.FormattingSettingsService(localizationManager);
    this.host = options.host;
    this.element = options.element;
    settings_1.VisualSettingsModel.localizationManager = localizationManager;
    settings_1.VisualSettingsModel.isRTL = locale.toLowerCase() === "ar-sa" || locale.toLowerCase() === "he-il";
    console.log("Visual constructor", options);
    // Immediately load the init module and initialize the appl
    (() => {
      // dynamically load the remotes from the MF container at runtime
      // https://oskari.io/blog/dynamic-remotes-module-federation/
      window["EsriVisualAppRoot"] = deployConfig_1.EsriVisualAppRoot;
      window["EsriCRLRoot"] = deployConfig_1.EsriCRLRoot;
      this.initModulePromise = new Promise(resolve => {
        Promise.resolve().then(() => __importStar(__webpack_require__(981))).then(async loader => {
          try {
            this.init = await loader.loadComponent("app", "./init")();
            await this.init.initCommonMap({
              locale: this.host.locale,
              isDevMode: deployConfig_1.isDevMode,
              EsriVisualAppRoot: deployConfig_1.EsriVisualAppRoot,
              EsriCRLRoot: deployConfig_1.EsriCRLRoot
            });
            resolve(this.init);
          } catch (error) {
            console.log("error loading module", error);
          }
          this.forceInitialUpdateHandler();
        });
      });
    })();
    if (document) {
      const new_div = document.createElement("div");
      new_div.setAttribute("id", "root");
      new_div.setAttribute("style", "padding: 0; margin: 0; width: 100%; height: 100%; cursor: default"); // we set width and height of app root to 100%
      options.element.appendChild(new_div);
    }
  }
  /**
   * We expect update to be called whenever the visual is loaded, however in the development environment,
   * this doesn't always happen (e.g. when toggling to a blank report page and back). The visual is always
   * constructed, but update is not always called. In the development environment, we ensure that update
   * is always called by adding a call to host.refreshHostData
   */
  forceInitialUpdateHandler() {
    if (false) {} else {
      this.forceInitialUpdate = false;
    }
  }
  update(options) {
    // debugger;
    console.log("Visual update", options);
    this.forceInitialUpdate = false;
    this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(settings_1.VisualSettingsModel, options.dataViews[0]);
    const visualSettings = settings_1.VisualSettingsModel.transform(this.formattingSettings);
    /**
     * While the initModulePromise resolves, push the updates into an array.
     * Note: An array is better option here because the callback gets registered every time the Power BI update is received when the
     * the promise hasn't been fullfiled with the this.currentOption enclosed in the callback (through a closure), each update will end up being processed.
     * Once initModulePromise has been fullfilled,  start processing updates that have been collected in the array starting from the first open that was received.
     * See Issues:
     * https://devtopia.esri.com/LocationAnalytics/PowerBI-visuals/issues/4037
     * https://devtopia.esri.com/LocationAnalytics/PowerBI-visuals/issues/4126
     */
    this.currentOptions.push(options);
    this.initModulePromise.then(async () => {
      // do only once; the app component needs to be created only once
      if (!this.hasAppComponentCreationStarted) {
        this.hasAppComponentCreationStarted = true;
        let currentOption = this.currentOptions.shift();
        this.init.createAppComponent({
          updateOptions: currentOption,
          host: this.host,
          isDevMode: deployConfig_1.isDevMode,
          EsriVisualAppRoot: deployConfig_1.EsriVisualAppRoot,
          EsriCRLRoot: deployConfig_1.EsriCRLRoot,
          rootNodeId: "root",
          element: this.element
        }, visualSettings).then(() => {
          // establish isFromPersistence by using the most recent update
          // during createAppComponent, we await import("./App"), and likely additional updates will be emitted
          // It is observed that on a hard-refresh, the PowerBI update API can "trickle-in" updates, for example:
          //  update 1 => 1 column (lat), no persisted metadata map
          //  update 2 => 1 column (lat), no persisted metadata map
          //  update 3 => 2 columns (lat, long), persisted metadata map exists - isFromPersistence would only be detected here
          const mostRecentOption = this.currentOptions[this.currentOptions.length - 1] || currentOption;
          this.init.postInitialize(mostRecentOption);
          do {
            this.init.visualUpdate(currentOption, visualSettings);
            currentOption = this.currentOptions.shift();
          } while (currentOption !== undefined);
          this.hasAppComponentCreationCompleted = true;
        });
      } else if (this.hasAppComponentCreationCompleted) {
        this.init.visualUpdate(this.currentOptions.shift(), visualSettings);
      }
    });
  }
  getFormattingModel() {
    return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
  }
}
exports.Visual = Visual;

/***/ }),

/***/ 754:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AlignmentGroup: () => (/* binding */ AlignmentGroup),
/* harmony export */   AutoDropdown: () => (/* binding */ AutoDropdown),
/* harmony export */   AutoFlagsSelection: () => (/* binding */ AutoFlagsSelection),
/* harmony export */   CardGroupEntity: () => (/* binding */ CardGroupEntity),
/* harmony export */   ColorPicker: () => (/* binding */ ColorPicker),
/* harmony export */   CompositeCard: () => (/* binding */ CompositeCard),
/* harmony export */   CompositeSlice: () => (/* binding */ CompositeSlice),
/* harmony export */   Container: () => (/* binding */ Container),
/* harmony export */   ContainerItem: () => (/* binding */ ContainerItem),
/* harmony export */   DatePicker: () => (/* binding */ DatePicker),
/* harmony export */   DurationPicker: () => (/* binding */ DurationPicker),
/* harmony export */   ErrorRangeControl: () => (/* binding */ ErrorRangeControl),
/* harmony export */   FieldPicker: () => (/* binding */ FieldPicker),
/* harmony export */   FontControl: () => (/* binding */ FontControl),
/* harmony export */   FontPicker: () => (/* binding */ FontPicker),
/* harmony export */   GradientBar: () => (/* binding */ GradientBar),
/* harmony export */   Group: () => (/* binding */ Group),
/* harmony export */   ImageUpload: () => (/* binding */ ImageUpload),
/* harmony export */   ItemDropdown: () => (/* binding */ ItemDropdown),
/* harmony export */   ItemFlagsSelection: () => (/* binding */ ItemFlagsSelection),
/* harmony export */   ListEditor: () => (/* binding */ ListEditor),
/* harmony export */   MarginPadding: () => (/* binding */ MarginPadding),
/* harmony export */   Model: () => (/* binding */ Model),
/* harmony export */   NumUpDown: () => (/* binding */ NumUpDown),
/* harmony export */   ReadOnlyText: () => (/* binding */ ReadOnlyText),
/* harmony export */   ShapeMapSelector: () => (/* binding */ ShapeMapSelector),
/* harmony export */   SimpleCard: () => (/* binding */ SimpleCard),
/* harmony export */   SimpleSlice: () => (/* binding */ SimpleSlice),
/* harmony export */   Slider: () => (/* binding */ Slider),
/* harmony export */   TextArea: () => (/* binding */ TextArea),
/* harmony export */   TextInput: () => (/* binding */ TextInput),
/* harmony export */   ToggleSwitch: () => (/* binding */ ToggleSwitch)
/* harmony export */ });
/* harmony import */ var _utils_FormattingSettingsUtils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(639);
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
class Group extends CardGroupEntity {
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
    // eslint-disable-next-line
    getFormattingComponent(objectName, localizationManager) {
        return {
            descriptor: _utils_FormattingSettingsUtils__WEBPACK_IMPORTED_MODULE_0__/* .getDescriptor */ .y(objectName, this),
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
        const newValue = (_a = dataViewObjects === null || dataViewObjects === void 0 ? void 0 : dataViewObjects[objectName]) === null || _a === void 0 ? void 0 : _a[this.name];
        this.value = _utils_FormattingSettingsUtils__WEBPACK_IMPORTED_MODULE_0__/* .getPropertyValue */ .D(this, newValue, this.value);
    }
}
class AlignmentGroup extends SimpleSlice {
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
class Slider extends NumUpDown {
    constructor() {
        super(...arguments);
        this.type = "Slider" /* visuals.FormattingComponent.Slider */;
    }
}
class DatePicker extends SimpleSlice {
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
class DurationPicker extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "DurationPicker" /* visuals.FormattingComponent.DurationPicker */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { validators: this.validators });
    }
}
class ErrorRangeControl extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "ErrorRangeControl" /* visuals.FormattingComponent.ErrorRangeControl */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { validators: this.validators });
    }
}
class FieldPicker extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "FieldPicker" /* visuals.FormattingComponent.FieldPicker */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { validators: this.validators, allowMultipleValues: this.allowMultipleValues });
    }
}
class ItemFlagsSelection extends SimpleSlice {
    constructor(object) {
        super(object);
        this.type = "FlagsSelection" /* visuals.FormattingComponent.FlagsSelection */;
    }
    getFormattingComponent(objectName) {
        return Object.assign(Object.assign({}, super.getFormattingComponent(objectName)), { items: this.items });
    }
}
class AutoFlagsSelection extends SimpleSlice {
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
class TextArea extends TextInput {
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
class GradientBar extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "GradientBar" /* visuals.FormattingComponent.GradientBar */;
    }
}
class ImageUpload extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "ImageUpload" /* visuals.FormattingComponent.ImageUpload */;
    }
}
class ListEditor extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "ListEditor" /* visuals.FormattingComponent.ListEditor */;
    }
}
class ReadOnlyText extends SimpleSlice {
    constructor() {
        super(...arguments);
        this.type = "ReadOnlyText" /* visuals.FormattingComponent.ReadOnlyText */;
    }
}
class ShapeMapSelector extends SimpleSlice {
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
class MarginPadding extends CompositeSlice {
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
class Container extends NamedEntity {
    constructor(object) {
        super();
        Object.assign(this, object);
    }
}
class ContainerItem extends NamedEntity {
}
//# sourceMappingURL=FormattingSettingsComponents.js.map

/***/ }),

/***/ 667:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* unused harmony export FormattingSettingsService */
/* harmony import */ var _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(754);

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
        const defaultSettings = new typeClass();
        const dataViewObjects = (_a = dataView === null || dataView === void 0 ? void 0 : dataView.metadata) === null || _a === void 0 ? void 0 : _a.objects;
        if (dataViewObjects) {
            // loop over each formatting property and set its new value if exists
            (_b = defaultSettings.cards) === null || _b === void 0 ? void 0 : _b.forEach((card) => {
                var _a;
                if (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__.CompositeCard)
                    (_a = card.topLevelSlice) === null || _a === void 0 ? void 0 : _a.setPropertiesValues(dataViewObjects, card.name);
                const cardGroupInstances = (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__.SimpleCard ? [card] : card.groups);
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
        const formattingModel = {
            cards: []
        };
        formattingSettingsModel.cards
            .filter(({ visible = true }) => visible)
            .forEach((card) => {
            var _a;
            const formattingCard = {
                displayName: (this.localizationManager && card.displayNameKey) ? this.localizationManager.getDisplayName(card.displayNameKey) : card.displayName,
                description: (this.localizationManager && card.descriptionKey) ? this.localizationManager.getDisplayName(card.descriptionKey) : card.description,
                groups: [],
                uid: card.name + "-card",
                analyticsPane: card.analyticsPane,
            };
            const objectName = card.name;
            if (card.topLevelSlice) {
                const topLevelToggleSlice = card.topLevelSlice.getFormattingSlice(objectName, this.localizationManager);
                topLevelToggleSlice.suppressDisplayName = true;
                formattingCard.topLevelToggle = topLevelToggleSlice;
            }
            (_a = card.onPreProcess) === null || _a === void 0 ? void 0 : _a.call(card);
            const isSimpleCard = card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__.SimpleCard;
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
                        const formattingContainerItem = {
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
                        const topLevelToggleSlice = cardGroupInstance.topLevelSlice.getFormattingSlice(objectName, this.localizationManager);
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
            const formattingSlice = slice === null || slice === void 0 ? void 0 : slice.getFormattingSlice(objectName, this.localizationManager);
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
        const revertToDefaultDescriptors = [];
        let cardSlicesDefaultDescriptors;
        let cardContainerSlicesDefaultDescriptors = [];
        // eslint-disable-next-line
        if (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__.CompositeCard && card.topLevelSlice)
            revertToDefaultDescriptors.push(...(_a = card.topLevelSlice) === null || _a === void 0 ? void 0 : _a.getRevertToDefaultDescriptor(card.name));
        const cardGroupInstances = (card instanceof _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__.SimpleCard ?
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

/***/ 674:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormattingSettingsService: () => (/* reexport safe */ _FormattingSettingsService__WEBPACK_IMPORTED_MODULE_1__.A),
/* harmony export */   formattingSettings: () => (/* reexport module object */ _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__)
/* harmony export */ });
/* harmony import */ var _FormattingSettingsComponents__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(754);
/* harmony import */ var _FormattingSettingsService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(667);



//# sourceMappingURL=index.js.map

/***/ }),

/***/ 639:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ getPropertyValue),
/* harmony export */   y: () => (/* binding */ getDescriptor)
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
    if ((slice === null || slice === void 0 ? void 0 : slice.type) === "Dropdown" /* visuals.FormattingComponent.Dropdown */ && slice.items) {
        const itemsArray = slice.items;
        return itemsArray.find(item => item.value == value);
    }
    return value;
}
//# sourceMappingURL=FormattingSettingsUtils.js.map

/***/ }),

/***/ 332:
/***/ (() => {



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
/******/ 	/* webpack/runtime/sharing */
/******/ 	(() => {
/******/ 		__webpack_require__.S = {};
/******/ 		var initPromises = {};
/******/ 		var initTokens = {};
/******/ 		__webpack_require__.I = (name, initScope) => {
/******/ 			if(!initScope) initScope = [];
/******/ 			// handling circular init calls
/******/ 			var initToken = initTokens[name];
/******/ 			if(!initToken) initToken = initTokens[name] = {};
/******/ 			if(initScope.indexOf(initToken) >= 0) return;
/******/ 			initScope.push(initToken);
/******/ 			// only runs once
/******/ 			if(initPromises[name]) return initPromises[name];
/******/ 			// creates a new share scope if needed
/******/ 			if(!__webpack_require__.o(__webpack_require__.S, name)) __webpack_require__.S[name] = {};
/******/ 			// runs all init snippets from all modules reachable
/******/ 			var scope = __webpack_require__.S[name];
/******/ 			var warn = (msg) => {
/******/ 				if (typeof console !== "undefined" && console.warn) console.warn(msg);
/******/ 			};
/******/ 			var uniqueName = "esriVisual";
/******/ 			var register = (name, version, factory, eager) => {
/******/ 				var versions = scope[name] = scope[name] || {};
/******/ 				var activeVersion = versions[version];
/******/ 				if(!activeVersion || (!activeVersion.loaded && (!eager != !activeVersion.eager ? eager : uniqueName > activeVersion.from))) versions[version] = { get: factory, from: uniqueName, eager: !!eager };
/******/ 			};
/******/ 			var initExternal = (id) => {
/******/ 				var handleError = (err) => (warn("Initialization of sharing external failed: " + err));
/******/ 				try {
/******/ 					var module = __webpack_require__(id);
/******/ 					if(!module) return;
/******/ 					var initFn = (module) => (module && module.init && module.init(__webpack_require__.S[name], initScope))
/******/ 					if(module.then) return promises.push(module.then(initFn, handleError));
/******/ 					var initResult = initFn(module);
/******/ 					if(initResult && initResult.then) return promises.push(initResult['catch'](handleError));
/******/ 				} catch(err) { handleError(err); }
/******/ 			}
/******/ 			var promises = [];
/******/ 			switch(name) {
/******/ 			}
/******/ 			if(!promises.length) return initPromises[name] = 1;
/******/ 			return initPromises[name] = Promise.all(promises).then(() => (initPromises[name] = 1));
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
const visual_1 = __webpack_require__(90);
var powerbiKey = "powerbi";
var powerbi = window[powerbiKey];
var esriVisual = {
  name: 'esriVisual',
  displayName: 'ArcGIS for Power BI',
  class: 'Visual',
  apiVersion: '5.11.0',
  create: options => {
    if (visual_1.Visual) {
      return new visual_1.Visual(options);
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
  powerbi.visuals.plugins["esriVisual"] = esriVisual;
}
exports["default"] = esriVisual;
})();

esriVisual = __webpack_exports__;
/******/ })()
;