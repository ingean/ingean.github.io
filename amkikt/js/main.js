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

  
  var ROUTES = [];

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
  var plumeGP = new Geoprocessor(urlGPPlume);
  var roadBlockGP = new Geoprocessor(urlGPRoadBlock);
  var heliGP = new Geoprocessor(urlGPHeli);
  var startIndexGP = new Geoprocessor(urlGPRIndex);

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
          ROUTES  = result.routes;
          $('#button-dispatch').attr('disabled', false);
        }
      })
      .catch(error => {
        console.log('ERROR: ' + error);
      })
  }

  function submitSimulationGP() {
    var featureSet = new FeatureSet();
    featureSet.features = appendToRoutes(ROUTES,'Rykker ut');
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

  function submitPlumeGP() {
    var featureSet = new FeatureSet();
    featureSet.features = appendToRoutes(ROUTES,'Rykker ut');
    featureSet.fields = fieldsRoutes;

    var params = {
      Linjer: featureSet,
      Hastighet : 100
    };

    plumeGP.submitJob(params)
    .then(result => {
      console.log('SUCCESS: Plume tool submitted');
    })
    .catch(error => {console.log('ERROR: ' + error)});
  }

  document
  .getElementById("button-closestfacility")
  .addEventListener("click", solveClosestFacility);

/*   document
  .getElementById("button-locationallocation")
  .addEventListener("click", submitLocationAllocationGP);

  document
  .getElementById("button-vehiclerouting")
  .addEventListener("click", solveVRP); */

  document
  .getElementById("button-dispatch")
  .addEventListener("click", submitSimulationGP);

  document
  .getElementById("button-plume")
  .addEventListener("click", submitPlumeGP);

  /*   document
  .getElementById("button-roadblock")
  .addEventListener("click", submitRoadBlockGP);

  document
  .getElementById("button-heli")
  .addEventListener("click", executeHeliGP);

  document
  .getElementById("button-missing")
  .addEventListener("click", openMissingLink);

  document
  .getElementById("button-reset")
  .addEventListener("click", resetDemo);

  document
  .getElementById("button-startresponseindex")
  .addEventListener("click", submitStartGridGP);
 */
 
  view.ui.add("div-widget-ui", "bottom-left");
}); //End function


