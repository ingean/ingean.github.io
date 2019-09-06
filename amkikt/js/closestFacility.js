require([
  "esri/views/MapView",
  "esri/WebMap",
  "esri/widgets/Slider",
  "esri/tasks/ClosestFacilityTask",
  "esri/tasks/support/ClosestFacilityParameters",
  "esri/tasks/support/DataFile",
  "esri/tasks/Geoprocessor",
  "esri/tasks/support/FeatureSet"
], function(
  MapView,
  WebMap,
  Slider,
  ClosestFacilityTask,
  ClosestFacilityParameters,
  DataFile,
  Geoprocessor,
  FeatureSet
) {

  var urlFacilities = "https://demo01.geodata.no/arcgis/rest/services/GeoTek/Ambulanser/FeatureServer/0/query?where=status='Ledig'&f=json&outFields=Name";
  var urlIncidents = "https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/AMK_hendelser/FeatureServer/0/query?where=1%3D1&returnGeometry=true&f=json&outFields=Name";
  var urlPolygonBarriers = "https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/AMK_barriers/FeatureServer/2/query?where=1%3D1&returnGeometry=true&f=json&outFields=*";
  var urlGPSimulator = "https://demo09.geodata.no/arcgis/rest/services/AMKSimulatorTjeneste/GPServer/AMK%20Simulator%20Script";

  const facilitiesToFindSlider = new Slider({
    container: "slider-facilitiestofind",
    min: 1,
    max: 10,
    steps: 1,
    labelsVisible: true,
    precision: 0,
    values: [1]
  });

  var webmap = new WebMap({
    portalItem: {
      id: 'd6d23ae314f74ed6952eca02e18483d8'
    }
  });
  
  var view = new MapView({
    container: "viewDiv",
    map: webmap 
  });  


  var ClosestFacilityTask = new ClosestFacilityTask({
    url: "https://utility.arcgis.com/usrsvcs/appservices/56mavYfxEnj6xDTN/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World/solveClosestFacility"
  });

  var simGP = new Geoprocessor(urlGPSimulator);

  var params = new ClosestFacilityParameters({
    facilities: new DataFile({url: urlFacilities}),
    incidents: new DataFile({url: urlIncidents}),
    polygonBarriers: new DataFile({url: urlPolygonBarriers}),
    returnDirections: false,
    returnRoutes: true,
    travelDirection: "from-facility",
    impedanceAttribute: "TravelTime",
    defaultTargetFacilityCount: facilitiesToFindSlider.values[0],
    outSpatialReference: 25833
  });

  function solveClosestFacility() {
    params.defaultTargetFacilityCount = facilitiesToFindSlider.values[0];    
    
    return ClosestFacilityTask.solve(params)
      .then(result => {
        if (result.routes.length)  {
          view.graphics.removeAll(); //Remove previous graphics
          result.routes.forEach(function(graphic){
            graphic.symbol = {
            type: "simple-line",
            width: 3,
            color: [0,0,255],
            opacity: 0.3
            }
          view.graphics.add(graphic,7);
          });
          startSimulation(result.routes); //Simulate resource movements
        }
      })
      .catch(error => {
        console.log('ERROR: ' + error);
      })
  }

  function startSimulation(routes) {
    var featureSet = new FeatureSet();
    featureSet.features = appendToRoutes(routes,'Rykker ut');
    featureSet.fields = fieldsRoutes;

    var params = {
      Linjer: featureSet,
      Hastighet : 100
    };

    simGP.submitJob(params)
    .then(result => {
      console.log('SUCCESS: Simulation started');
    })
    .catch(error => {console.log('ERROR: ' + error)});
  }
  
  document
  .getElementById("button-closestfacility")
  .addEventListener("click", solveClosestFacility);


  view.ui.add("div-widget-ui", "bottom-left");
}); //End function


