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

  
  var basemap = new Basemap({
    portalItem: {
      id: "bdef8d90ce664b679470eeb5adace15b"  // Geodata Online Gråtone
    }
  });
  
  var imagePopupTemplate = {
    title: "Terrengmodell over Norge",
    content:
      "Visning: <b>{Raster.ServicePixelValue} </b>" +
      "<br>Høyde over havet: <b>{Raster.ItemPixelValue} </b>"
  };

  var slopeRFT = new RasterFunction({
    functionName: "Slope_Degrees",
    variableName: "Raster"
  });

  var heightRFT = new RasterFunction({
    functionName: "Dynamic_Height",
    variableName: "Raster"
  });

  var reliefRFT = new RasterFunction({
    functionName: "Grayscale_Hillshade",
    variableName: "Raster"
  });

  var steepRF = new RasterFunction({
    functionName: "Remap",
    functionArguments: {
      inputRanges: [0, 30, 30, 60, 60, 90],
      outputValues: [1, 2, 1],
      raster: slopeRFT
    }
  });

  var steepColorRF = new RasterFunction({
    functionName: "Colormap",
    functionArguments: {
      colormap: [
        [1, 0, 128, 0, 0.1], //Green
        [2, 255, 0, 0] //Red
      ],
      raster: steepRF
    },
    outputPixelType: "f32"
  });

  var layer = new ImageryLayer({
    url:
      "https://utility.arcgis.com/usrsvcs/servers/7f3c945cd9cd4c3eba86b5d1fc3708f9/rest/services/Geomap_UTM33_EUREF89/GeomapDTM/ImageServer",
    renderingRule: reliefRFT,
    popupTemplate: imagePopupTemplate,
    opacity: 0.7,
  });

  var map = new Map({
    basemap: "gray",
    layers: [layer]
  });

  var view = new MapView({
    container: "div-view",
    map: map,
    center: {
      x: 7,
      y: 62,
      spatialReference: 4326
    },
    zoom: 12,
    popup: {
      actions: []
    }
  });

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
    if(map.layers.length === 2) {
      map.layers.remove(map.layers.getItemAt(1));
    }
    
    var serviceRFT = new RasterFunction({
      functionName: event.currentTarget.value.toString(),
      variableName: "Raster"
    });
    var layer = view.map.layers.getItemAt(0);
    layer.renderingRule = serviceRFT;
  }

  function steepClickHandler(event) {
    console.log(map.layers.length);
    var steepLayer = new ImageryLayer({
      url:
        "https://utility.arcgis.com/usrsvcs/servers/7f3c945cd9cd4c3eba86b5d1fc3708f9/rest/services/Geomap_UTM33_EUREF89/GeomapDTM/ImageServer",
      renderingRule: steepColorRF,
      popupTemplate: imagePopupTemplate,
      opacity: 0.7,
    });
    
    map.layers.add(steepLayer);
    var layer = view.map.layers.getItemAt(0);
    layer.renderingRule = reliefRFT;
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