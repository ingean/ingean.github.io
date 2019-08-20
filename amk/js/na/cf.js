function findClosest() {
  btnSpinner(true, '#btn-findClosest');
  deleteAllFeatures(url_routes, 'routes');
  
  var params = {
    "f": "json",
    "token": TOKEN,
    "facilities": JSON.stringify(url_resources),
    "incidents": JSON.stringify(incidentsList[0]),
    "returnDirections":false,
    "returnCFRoutes":true,
    "travelDirection": "esriNATravelDirectionFromFacility",
    "impedanceAttributeName": "TravelTime",
    "defaultTargetFacilityCount": $('#input-facilityCount').val(),
    "outSR": 25833
  };
  
  params = addTimeofDay(params);

  addBarriers(params)
  .then(params => {
    executeClosestFacility(params);  
  })
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
