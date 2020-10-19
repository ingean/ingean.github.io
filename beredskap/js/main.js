require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/tasks/RouteTask",
  "esri/tasks/support/RouteParameters",
  "esri/tasks/ServiceAreaTask",
  "esri/tasks/support/ServiceAreaParameters",
  "esri/tasks/support/FeatureSet"
], function (
  Map,
  MapView,
  Graphic,
  GraphicsLayer,
  RouteTask,
  RouteParameters,
  ServiceAreaTask,
  ServiceAreaParameters,
  FeatureSet
) {

  const clientId = 'iZS60ZtuVhL5CZ7r';
  const clientSecret = '4bb108079a6a42ec97f91b04ffe8020a';


  // Point the URL to a valid route service that uses an
  // ArcGIS Online hosted service proxy
  var routeTask = new RouteTask({
    url:
      "https://utility.arcgis.com/usrsvcs/appservices/NO5S32QTaV1CAJjP/rest/services/World/Route/NAServer/Route_World/solve"
  });

  var serviceAreaTask = new ServiceAreaTask({
    url: "https://utility.arcgis.com/usrsvcs/appservices/gcwKYUizsV5MB3G3/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea"
  });

  // The stops and route result will be stored in this layer
  var routeLayer = new GraphicsLayer();

  // Setup the route parameters
  var routeParams = new RouteParameters({
    stops: new FeatureSet(),
    outSpatialReference: {
      // autocasts as new SpatialReference()
      wkid: 3857
    }
  });

  // Define the symbology used to display the stops
  var stopSymbol = {
    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
    style: "cross",
    size: 15,
    outline: {
      // autocasts as new SimpleLineSymbol()
      width: 4
    }
  };

  // Define the symbology used to display the route
  var routeSymbol = {
    type: "simple-line", // autocasts as SimpleLineSymbol()
    color: [0, 0, 255, 0.5],
    width: 5
  };

  var map = new Map({
    basemap: "streets-navigation-vector",
    layers: [routeLayer] // Add the route layer to the map
  });
  var view = new MapView({
    container: "viewDiv", // Reference to the scene div created in step 5
    map: map, // Reference to the map object created before the scene
    center: [-117.195, 34.057],
    zoom: 13
  });

  // Adds a graphic when the user clicks the map. If 2 or more points exist, route is solved.
  view.on("click", addStop);

  function addStop(event) {
    // Add a point at the location of the map click
    var stop = new Graphic({
      geometry: event.mapPoint,
      symbol: stopSymbol
    });
    routeLayer.add(stop);

    // Execute the route task if 2 or more stops are input
    routeParams.stops.features.push(stop);
    if (routeParams.stops.features.length >= 2) {
      routeTask.solve(routeParams).then(showRoute);
    }
  }
  // Adds the solved route to the map as a graphic
  function showRoute(data) {
    var routeResult = data.routeResults[0].route;
    routeResult.symbol = routeSymbol;
    routeLayer.add(routeResult);
  }

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

  view.ui.add("div-na-selector", "bottom-left");
});
