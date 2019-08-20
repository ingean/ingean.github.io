var CFparams = {
  "f":"json",
  "polygonBarriers": JSON.stringify(url_barriers),
  "returnDirections":false,
  "returnCFRoutes":true,
  "travelDirection": "esriNATravelDirectionFromFacility",
  "timeOfDay": 0,
  "impedance": "TravelTime",
  "outSR": 25833
};

function findClosest() {
  btnSpinner(true, '#btn-findClosest');
  deleteAllFeatures(url_routes, 'routes');
  CFparams.token = TOKEN;
  CFparams.facilities = JSON.stringify(url_resources);
  CFparams.incidents = JSON.stringify(incidentsList[0]);
  CFparams.defaultTargetFacilityCount = $('#input-facilityCount').val();
  CFparams.timeOfDay = moment($('#input-date').val()).unix();
  
  executeClosestFacility(CFparams, 0);
}

function executeClosestFacility(data) {
  $.post(url_closestFacility, data)
  .done(response => {
    addFeatures(url_routes, response.routes.features);
    var routes = routesFieldMapping(response.routes.features,'Rykker ut');
    startSimulation(routes);
  })
  .fail(error => {
    console.log('Failed to find closest facilities: ' + error);
    showError('Failed to find closest facilities');
  })  
}
