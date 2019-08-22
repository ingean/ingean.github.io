require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Basemap",
  "esri/layers/ImageryLayer",
  "esri/layers/support/RasterFunction",
  "esri/widgets/Slider",
  "esri/identity/IdentityManager"
], function(Map, MapView, Basemap, ImageryLayer, RasterFunction, Slider,IdentityManager) {
    
  //Token expires: Friday, August 21, 2020 11:33:47
  //Token http referer: https://ingean.github.io
  IdentityManager.registerToken({
    server: "https://services2.geodataonline.no/arcgis/rest/services",
    token: "GFKw0mC1pVj4AI3BMVBpdBSRby7s4G4fzauZze-YW8w8h1f47kOrkPMv_BztdKFDvJeHKBFsnT3K4DYCtaV2Xw.."
  });


  /***************************************
   * Create basemap from GDO layer
   **************************************/  
  
  var basemap = new Basemap({
    portalItem: {
      id: "bdef8d90ce664b679470eeb5adace15b"  // Geodata Online Gråtone
    }
  });
  
  /***************************************
   * Set up popup template of image layer
   **************************************/

  var imagePopupTemplate = {
    // autocasts as new PopupTemplate()
    title: "Terrengmodell over Norge",
    content:
      "Visning: <b>{Raster.ServicePixelValue} </b>" +
      "<br>Høyde over havet: <b>{Raster.ItemPixelValue} </b>"
  };

  /*******************************************************************
   * Create image layer with server defined raster function templates
   ******************************************************************/

  var slopeRFT = new RasterFunction({
    functionName: "Slope_Degrees",
    variableName: "Raster"
  });

  var heightRFT = new RasterFunction({
    functionName: "Dynamic_Height",
    variableName: "Raster"
  });

  var steepRF = new RasterFunction({
    functionName: "Slope_Degrees",
    functionArguments: {
      // pixel values of forest categories are 41, 42, and 43
      // according to the  raster attribute table.
      // The InputRanges property defines the ranges of intial pixel values to remap
      // Three ranges: [0, 41], [41, 44], and [44, 255] are defined to extract forest pixels.
      inputRanges: [0, 30, 31, 90],
      // non-forest pixels (0-41 and 44-255) are remapped to a value of 1,
      // forest pixels (41-44) are remapped to a value of 2.
      outputValues: [1, 2],
      // $$(default) refers to the entire image service,
      // $2 refers to the second image of the image service
      variableName: "Raster"
    }
  });

  var steepColorRF = new RasterFunction({
    functionName: "Steep_Terrain_Color",
    functionArguments: {
      colormap: [
        // non-forest pixels (value of 1) are assigned
        // a yellowish color RGB = [253, 254, 152]
        [1, 253, 254, 152],
        // forest pixels (value of 2) are assigned
        // a greenish color RGB = [2, 102, 6]
        [2, 2, 102, 6]
      ],
      // Setting the previous raster function to the Raster
      // property of a new raster function allows you to chain functions
      raster: steepRF
    },
    outputPixelType: "f32"
  });

  var layer = new ImageryLayer({
    url:
      "https://services2.geodataonline.no/arcgis/rest/services/Geomap_UTM33_EUREF89/GeomapDTM/ImageServer",
    renderingRule: heightRFT,
    popupTemplate: imagePopupTemplate,
    opacity: 0.7,
  });

  /*************************
   * Add image layer to map
   ************************/

  var map = new Map({
    basemap: "gray",
    layers: [layer]
  });

  var view = new MapView({
    container: "div-view",
    map: map,
    center: {
      // autocasts as esri/geometry/Point
      x: 7,
      y: 62,
      spatialReference: 4326
    },
    zoom: 12,
    popup: {
      actions: []
    }
  });

  /*************************
   * Add raster functions widget to map
   ************************/
  document
  .getElementById("button-rasterfunction-hillshade")
  .addEventListener("click", rasterfunctionClickHandler);
  
  document
  .getElementById("button-rasterfunction-slope")
  .addEventListener("click", rasterfunctionClickHandler);
  
  document
  .getElementById("button-rasterfunction-height")
  .addEventListener("click", rasterfunctionClickHandler);

  document
  .getElementById("button-rasterfunction-steep")
  .addEventListener("click", steepClickHandler);
  
  function rasterfunctionClickHandler(event) {
    var serviceRFT = new RasterFunction({
      functionName: event.currentTarget.value.toString(),
      variableName: "Raster"
    });
    var layer = view.map.layers.getItemAt(0);
    layer.renderingRule = serviceRFT;
  }

  function steepClickHandler(event) {
    var layer = view.map.layers.getItemAt(0);
    layer.renderingRule = steepColorRF;
  }


  const bufferTransparencySlider = new Slider({
    container: "slider-transparency",
    min: 0,
    max: 1,
    steps: 0.1,
    labelsVisible: true,
    precision: 1,
    labelFormatFunction: function(value, type) {
      value = value * 100;
      return value.toString() + "%";
    },
    values: [0.3]
  });


  // get user entered values for transparency
  bufferTransparencySlider.on("value-change", TransparencyChanged);
  function TransparencyChanged(event) {
    setTransparency(event.value);
  }

  function setTransparency(opacity) {
    var imglayer = view.map.layers.getItemAt(0)
    imglayer.opacity = 1 - opacity;
  }

  view.ui.add("div-rasterfunctions-selector", "bottom-left");
});