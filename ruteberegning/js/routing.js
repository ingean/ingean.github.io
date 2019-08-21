require([
  "esri/Map",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/tasks/RouteTask",
  "esri/tasks/support/RouteParameters",
  "esri/tasks/support/FeatureSet"
], function(
  Map,
  MapView,
  Graphic,
  GraphicsLayer,
  RouteTask,
  RouteParameters,
  FeatureSet
) {
  // Point the URL to a valid route service that uses an
  // ArcGIS Online hosted service proxy
  var routeTask = new RouteTask({
    url:
      "https://utility.arcgis.com/usrsvcs/appservices/srsKxBIxJZB0pTZ0/rest/services/World/Route/NAServer/Route_World"
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
    basemap: "streets",
    layers: [routeLayer] // Add the route layer to the map
  });
  var view = new MapView({
    container: "viewDiv", // Reference to the scene div created in step 5
    map: map, // Reference to the map object created before the scene
    center: [10.595, 59.957],
    zoom: 11
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
});