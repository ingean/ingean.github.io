require([
  "https://s3-us-west-1.amazonaws.com/patterns.esri.com/files/calcite-web/1.2.5/js/calcite-web.min.js",
  "esri/WebMap",
  "esri/views/MapView",
  "esri/Graphic",
  "esri/layers/GraphicsLayer",
  "esri/layers/FeatureLayer",
  "esri/tasks/RouteTask",
  "esri/tasks/support/RouteParameters",
  "esri/tasks/ServiceAreaTask",
  "esri/tasks/support/ServiceAreaParameters",
  "esri/tasks/ClosestFacilityTask",
  "esri/tasks/support/ClosestFacilityParameters",
  "esri/tasks/support/FeatureSet",
  "esri/tasks/support/Query", 
  "esri/widgets/Search",
  "esri/widgets/Editor",
  "esri/widgets/LayerList",
  "esri/widgets/Expand",
], function (
  calcite,
  WebMap,
  MapView,
  Graphic,
  GraphicsLayer,
  FeatureLayer,
  RouteTask,
  RouteParameters,
  ServiceAreaTask,
  ServiceAreaParameters,
  ClosestFacilityTask,
  ClosestFacilityParameters,
  FeatureSet, 
  Query,
  Search,
  Editor,
  LayerList,
  Expand
) {

  // Initialization
  calcite.init();

  document
  .getElementById("btn-deleteStops")
  .addEventListener("click", deleteStops);

  document
  .getElementById('btn-closestFacility')
  .addEventListener('click', executeClosestFacility);

  let t = new Date(Date.now());
  document.getElementById('startTime').value = ('0' + String(t.getHours())).slice(-2) + ':' + ('0' + String(t.getMinutes())).slice(-2);

  function deleteStops(event) {
    saLayer.removeAll();
    routeLayer.removeAll();
    routeParams.stops.features = []; //Remove stops from analysis;
    let stops = document.getElementById("list-stops");
    stops.innerHTML = '';

    let routes = document.getElementById("list-routes");
    routes.innerHTML = '';
  }


  // Point the URL to a valid route service that uses an
  // ArcGIS Online hosted service proxy
  var routeTask = new RouteTask({
    url:
      "https://utility.arcgis.com/usrsvcs/appservices/NO5S32QTaV1CAJjP/rest/services/World/Route/NAServer/Route_World/solve"
  });

  var serviceAreaTask = new ServiceAreaTask({
    url: "https://utility.arcgis.com/usrsvcs/appservices/gcwKYUizsV5MB3G3/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea"
  });

  var closestFacilityTask = new ClosestFacilityTask({
    url: "https://utility.arcgis.com/usrsvcs/appservices/kQDfVzC27SERicV2/rest/services/World/ClosestFacility/NAServer/ClosestFacility_World/solveClosestFacility"
  });
    
  var routeLayer = new GraphicsLayer();
  var saLayer = new GraphicsLayer();
  
  var routeParams = new RouteParameters({
    stops: new FeatureSet(),
    outSpatialReference: {
      wkid: 3857
    },
  });

  var stopSymbol = {
    type: "simple-marker", 
    style: "cross",
    size: 15,
    outline: {
      width: 4
    }
  };

  var routeSymbol = {
    type: "simple-line", 
    color: [0, 0, 255, 0.5],
    width: 5
  };

  let webmap = new WebMap({
    portalItem: {
      id: "d3a6f1ffc7f04f019b0c9abcb3c2f7df"
    }
  });

  webmap.add(routeLayer);
  webmap.add(saLayer);

  var view = new MapView({
    container: "viewDiv", // Reference to the scene div created in step 5
    map: webmap, // Reference to the map object created before the scene
  });

  //Add widgets
  var search = new Search({
    view: view
  });

  let editor = new Editor({
    view: view,
    container: document.createElement("div")
  });

  var expandEdit = new Expand({
    view: view,
    content: editor
  });

  let layerList = new LayerList({
    view: view
  });

  var expandLayerList = new Expand({
    view: view,
    content: layerList
  });

 

  view.ui.add(search, "top-right");
  view.ui.add(expandEdit, "top-right");
  view.ui.add(expandLayerList, "top-right");

  view.on("click", executeAnalysis); //Run routing or service area when user clicks in map

  function executeAnalysis(event) {
    reverseGeocode(event);
    
    if(document.getElementById('r-route').checked) {
      executeRouting(event);
    } else {
      executeSA(event);
    }
  }

  async function executeRouting(event) {
    // Execute the route task if 2 or more stops are input
    routeParams.stops.features.push(addStop(event));
    routeParams.startTime = getTime(); 
    routeParams.polygonBarriers = await getBarriers();
    if (routeParams.stops.features.length >= 2) {
      routeTask.solve(routeParams).then(result => {
        var routeResult = result.routeResults[0].route;
        addRoute(routeResult);
      });
    }
  }
  
  function addStop(event) {
    let stop = new Graphic({
      geometry: event.mapPoint,
      symbol: stopSymbol
    });
    routeLayer.add(stop);
    return stop;
  }

  function addRoute(route) {
    route.symbol = routeSymbol;
    routeLayer.add(route);
    let drivetime = route.attributes.Total_TravelTime;
    drivetime = minTommss(drivetime) + ' min';
    addListItem('list-routes', drivetime, 'navigation');
  }

  function executeSA(event) {
    deleteStops();

    var featureSet = new FeatureSet({
      features: [addStop(event)]
    });
    // Set all of the input parameters for the service
    var saParams = new ServiceAreaParameters({
      facilities: featureSet, // Location(s) to start from
      polygonBarriers: getBarriers(),
      timeOfDay: getTime(),
      defaultBreaks: [10], // One or more drive time cutoff values
      outSpatialReference: view.spatialReference // Spatial reference to match the view
    });

    executeServiceAreaTask(saParams);
  }

  function executeServiceAreaTask(serviceAreaParams) {
    return serviceAreaTask.solve(serviceAreaParams)
      .then(function(result){
        if (result.serviceAreaPolygons.length) {
          result.serviceAreaPolygons.forEach(function(graphic){
            graphic.symbol = {
              type: "simple-fill",
              color: "rgba(255,50,50,.25)"
            }
            routeLayer.add(graphic,0);
          });
        }
      }, function(error){
        console.log(error);
    });
  }

  async function executeClosestFacility(event) {
    showLoader('load-closestFacility');
    let fcParams = new ClosestFacilityParameters({
      facilities: await getFacilities(),
      incidents: await getIncidents(),
      polygonBarriers: await getBarriers(),
      travelDirection: 'from-facility',
      timeOfDay: getTime(),
      impedance: 'TravelTime',
      defaultTargetFacilityCount: Number(document.getElementById('input-facilityCount').value)
    });

    return closestFacilityTask.solve(fcParams)
    .then(result => {
      hideLoader('load-closestFacility');
      routeLayer.removeAll();
      result.routes.forEach(function(route, index) {
       addRoute(route);
      });
    }, error => {
      hideLoader('load-closestFacility');
      console.log(error);
    })
  }

  function reverseGeocode(event) {
    let geocoder = search.activeSource.locator; 
    var params = {
      location: event.mapPoint
    };
    geocoder.locationToAddress(params).then(
      function (response) {
        // Show the address found
        var address = response.address;
        addListItem('list-stops', address);
      },
      function (err) {
       console.log("No address found")
      }
    );
  }

  function addListItem(listId, content, iconName = 'map-pin') {
    let list = document.getElementById(listId);
    let item = document.createElement('div');
    let text = document.createElement('div');
    let icon = document.createElement('div');
    item.className = 'panel-list-item';
    text.className = 'panel-list-text';
    icon.className = 'icon-ui-' + iconName;

    text.textContent = String(content);
    
    item.appendChild(icon);
    item.appendChild(text);
    list.appendChild(item);
  }

  function minTommss(minutes){
    var sign = minutes < 0 ? "-" : "";
    var min = Math.floor(Math.abs(minutes));
    var sec = Math.floor((Math.abs(minutes) * 60) % 60);
    return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
   }

   function getBarriers(){
    if (document.getElementById('check-barriers').checked) {
      return getFeatureSet('AMK_barriers_4346');  
    } else {
      return '';
    }
   }

   function getFacilities() {
    return getFeatureSet('Ambulanser_1109', "status = 'Ledig'");
   }

   function getIncidents() {
    return getFeatureSet('AMK_hendelser_599');
   }


   function getFeatureSet(layerId, where = '1=1', returnGeometry = true, outFields = '*') {
    let fl = webmap.findLayerById(layerId);
    var query = fl.createQuery();
    query.where = where;
    query.returnGeometry = returnGeometry;
    query.outFields = [ outFields ];
    query.outSpatialReference = {wkid: 4326};

    return fl.queryFeatures(query);
   }

   function getTime() {
    if (document.getElementById('check-time').checked) {
      let today = new Date(Date.now());
      let time = document.getElementById('startTime').value;
      return new Date(
       today.getFullYear() + '-' +
       (today.getMonth() + 1)  + '-' +
       today.getDate() + 'T' +
       time + ':00'
       )
    } else {
      return '';
    }
   }

  function showLoader(id) {
    document.getElementById(id)
    .classList.add('is-active');
  }

  function hideLoader(id) {
    document.getElementById(id)
    .classList.remove('is-active');
  }
});
