require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Basemap",
  "esri/layers/ImageryLayer",
  "esri/layers/support/RasterFunction",
  "esri/widgets/Slider"
], function(Map, MapView, Basemap, ImageryLayer, RasterFunction, Slider) {
    
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

  var serviceRFT = new RasterFunction({
    functionName: "Slope_Degrees",
    variableName: "Raster"
  });

  var layer = new ImageryLayer({
    url:
      "https://services2.geodataonline.no/arcgis/rest/services/Geomap_UTM33_EUREF89/GeomapDTM/ImageServer",
    renderingRule: serviceRFT,
    popupTemplate: imagePopupTemplate,
    opacity: 0.7
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
  
  function rasterfunctionClickHandler(event) {
    var serviceRFT = new RasterFunction({
      functionName: event.target.value.toString(),
      variableName: "Raster"
    });
    var layer = view.map.layers.getItemAt(0);
    layer.renderingRule = serviceRFT;
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