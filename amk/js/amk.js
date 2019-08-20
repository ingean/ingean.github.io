var TOKEN = '';
const incidentsList = [url_incident, url_standby];

function deleteAllFeatures(url, featurename = 'features') {
  var data = {
    "where":"1=1"
  };
  
  $.post(url + '/deleteFeatures', data)
  .done(response => {
    console.log('All existing ' + featurename + ' deleted');
  })
  .fail(error => {
    console.log('Failed to delete all ' + featurename + ' :' + error);
    showError('Failed to delete all ' + featurename);
  })
}

function addFeatures(url, features) {
  var data = {
    "features":JSON.stringify(features),
  };

  $.post(url + '/addFeatures', data)
  .done(response => {
    btnSpinner(false);
    console.log('Features added successfully');
  })
  .fail(error => {
    console.log('Failed to add features to feature service: ' + error);
    showError('Failed to add features to feature service');
  })
}

function cutoffRoutes(allRoutes, cutoff) {
  if(cutoff > 0) {
    var routes = [];
    for(var i = 0; i < allRoutes.length; i++) {
      if(allRoutes[i].attributes.Total_TravelTime > minCutOff) {routes.push(allRoutes[i])};
    }
    return routes;
  } else {
    return allRoutes;
  }
}

function btnSpinner(activate, btnID) {
  if(activate === true) {
    $(btnID).append('<span id="spinner-loading" class="spinner-border spinner-border-sm"></span>');
  } else {
    $('#spinner-loading').remove();
  }
}

function routesFieldMapping(inRoutes, routeType) {
  var outRoutes = [];
  for(var i = 0; i < inRoutes.length; i++) {
    var attributes = {
      "OBJECTID": inRoutes[i].attributes.ObjectId,
      "Name":inRoutes[i].attributes.Name.split(' - ')[0],
      "StartTime":inRoutes[i].attributes.StartTime,
      "EndTime":inRoutes[i].attributes.EndTime,
      "StartTimeUTC":inRoutes[i].attributes.StartTimeUTC,
      "EndTimeUTC":inRoutes[i].attributes.EndTimeUTC,
      "Total_TravelTime":inRoutes[i].attributes.TotalTravelTime,
      "Total_Kilometers":inRoutes[i].attributes.TotalDistance,
      "RouteType":routeType,
      "Destination":inRoutes[i].attributes.Name.split(' - ')[1],
    };
    inRoutes[i].attributes = attributes;
    outRoutes.push(inRoutes[i]);
  }
  return outRoutes;
}

function showError(message, type= 'danger') {
  $.notify({
    message: message,
    type: type
  });
}

function appendAttributes(features, attributes) {
  for(var i = 0; i < features.length; i++) {
    Object.assign(features[i].attributes, attributes);
  }
  return features;
}

function replaceAttributes(features, attributes, wkid) {
  for(var i = 0; i < features.length; i++) {
    attributes.objectid = i;
    features[i].attributes = attributes;
    features[i].geometry["spatialReference"] = {"wkid":wkid,"latestWkid":wkid};
  }
  return features;
}

function resetResources() {
  console.log('Resetting ambulances to start position and status');
  var data = {
    "f":"json",
    "features": JSON.stringify(init_amb)
  };

  //Get baseurl for feature service
  var url = url_resources.url.substr(0, url_resources.url.indexOf('/query?'));
  
  $.post(url,data).done(response => {
    console.log('Resource positions and status are reset');
    showError('Resource positions and status are reset','info');
  })
  .fail(error => {
    console.log('Failed to reset resources: ' + error);
    showError('Failed to reset resources');
  });
}