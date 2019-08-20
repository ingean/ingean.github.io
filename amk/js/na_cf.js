function findClosest() {
  btnSpinner(true, '#btn-findClosest');
  deleteAllFeatures(url_routes, 'routes');
  
  var params = {
    "f": "json",
    "token": TOKEN,
    "facilities": JSON.stringify(url_resources),
    "incidents": JSON.stringify(incidentsList[0]),
    "polygonBarriers": JSON.stringify(url_barriers),
    "returnDirections":false,
    "returnCFRoutes":true,
    "travelDirection": "esriNATravelDirectionFromFacility",
    "impedance": "TravelTime",
    "defaultTargetFacilityCount": $('#input-facilityCount').val(),
    "timeOfDay": moment($('#input-date').val()).unix(),
    "outSR": 25833
  };  
  
  executeClosestFacility(params, 0);
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
