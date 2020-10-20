require([
  "esri/Map",
  "esri/views/MapView",
  "esri/geometry/Extent",
  "esri/Basemap",
  "esri/layers/TileLayer",
  "esri/layers/ImageryLayer",
  "esri/layers/support/RasterFunction",
  "esri/widgets/Slider",
  "esri/identity/IdentityManager"
], function(Map, MapView, Extent, Basemap, TileLayer, ImageryLayer, RasterFunction, Slider,IdentityManager) {
    
  //Token expires: Wednesday, October 20, 2021 7:59:37.555 PM
  //Token http referer: https://ingean.github.io
  IdentityManager.registerToken({
    server: "https://services.geodataonline.no/arcgis/rest/services",
    token: "QLqpZnvxuOtYnEZ0Gm_mKENbOlhf4NzoHAPzOvw73Sld64FA57PONEyFUoFR9GkwEJaJWOKd-P8jiZM5bWJJZA.."
  });

  //Shared publicly from AGOL
  const urlGeomapDTM = 'https://utility.arcgis.com/usrsvcs/servers/781a5b76174e40d9a1e7f6f7400611fb/rest/services/Geomap_UTM33_EUREF89/GeomapDTM/ImageServer';
  const urlGeocacheGray = 'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheGraatone/MapServer';

  var tileLayer = new TileLayer({
    url: urlGeocacheGray
  });

  var basemap = new Basemap({
    baseLayers: [tileLayer],
    title: "Geodata Bakgrunnskart",
    id: "GeocacheLandskap"
  });

  var imagePopupTemplate = {
    title: "Terrengmodell over Norge",
    content:
      "Visning: <b>{Raster.ServicePixelValue} </b>" +
      "<br>Høyde over havet: <b>{Raster.ItemPixelValue}m </b>"
  };

  var layer = new ImageryLayer({
    url: urlGeomapDTM,
    renderingRule: reliefRFT,
    popupTemplate: imagePopupTemplate,
    opacity: 0.7,
  });
      
  var map = new Map({ 
    basemap: basemap,
    layers:[layer] 
  });

  var extent = new Extent({
    xmin: 120000,
    ymin: 6820000,
    xmax: 150000,
    ymax: 6860000,
    spatialReference: {
      wkid: 25833
    }
  });

 var view = new MapView({
    container: "div-view", 
    map: map,
    extent: extent,
    popup: {
      actions: []
    }
  });

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
      inputRanges: [0, 25, 25, 60, 60, 90],
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
      url: urlGeomapDTM,
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