require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/tasks/ServiceAreaTask",
  "esri/tasks/support/ServiceAreaParameters",
  "esri/tasks/support/FeatureSet"
], function(
  Map,
  MapView,
  Graphic,
  ServiceAreaTask,
  ServiceAreaParameters,
  FeatureSet
) {
  // Point the URL to a valid route service that uses an
  // ArcGIS Online hosted service proxy
  

  var serviceAreaTask = new ServiceAreaTask({
    url: "https://utility.arcgis.com/usrsvcs/appservices/jbXaRK9bZe4Dm34X/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea"
  });

  function createGraphic(point) {
    // Remove any existing graphics
    view.graphics.removeAll();
    // Create a and add the point
    var graphic = new Graphic({
      geometry: point,
      symbol: {
        type: "simple-marker",
        color: "white",
        size: 8
      }
    });
    view.graphics.add(graphic);
    return graphic;
  }

  
  view.on("click", function(event){
    var locationGraphic = createGraphic(event.mapPoint);
    
    var driveTimeCutoffs = [10]; // Minutes (default)
    var serviceAreaParams = createServiceAreaParams(locationGraphic, driveTimeCutoffs, view.spatialReference);
    executeServiceAreaTask(serviceAreaParams);
  });

  function createServiceAreaParams(locationGraphic, driveTimeCutoffs, outSpatialReference) {
    // Create one or more locations (facilities) to solve for
    var featureSet = new FeatureSet({
      features: [locationGraphic]
    });
    // Set all of the input parameters for the service
    var taskParameters = new ServiceAreaParameters({
      facilities: featureSet, // Location(s) to start from
      defaultBreaks: driveTimeCutoffs, // One or more drive time cutoff values
      outSpatialReference: outSpatialReference // Spatial reference to match the view
    });
    return taskParameters;
  }

  function executeServiceAreaTask(serviceAreaParams) {
    return serviceAreaTask.solve(serviceAreaParams)
      .then(function(result){
        if (result.serviceAreaPolygons.length) {
          // Draw each service area polygon
          result.serviceAreaPolygons.forEach(function(graphic){
            graphic.symbol = {
              type: "simple-fill",
              color: "rgba(255,50,50,.25)"
            }
            view.graphics.add(graphic,0);
          });
        }
      }, function(error){
        console.log(error);
      });
  }

  var map = new Map({
    basemap: "streets-navigation-vector",
    layers: [routeLayer] // Add the route layer to the map
  });
  var view = new MapView({
    container: "viewDiv", // Reference to the scene div created in step 5
    map: map, // Reference to the map object created before the scene
    center: [10.595, 59.957],
    zoom: 11
  });

});