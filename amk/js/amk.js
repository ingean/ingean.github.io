var TOKEN = '';
const incidentsList = [url_incident, url_standby];
const url_barriers = [url_barriersPoints, url_barriersLines, url_barriersPolygons];
const params_barriers = ['barriers','polylineBarriers','polygonBarriers'];

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
      "OBJECTID": inRoutes[i].attributes.ObjectID,
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
  console.log('Resetting resources to start position and status');
  var data = {
    "f":"json",
    "features": JSON.stringify(init_amb)
  };

  //Get baseurl for feature service
  var url = removeUrlQuery(url_resources.url);
  
  $.post(url,data).done(response => {
    console.log('Resource positions and status are reset');
  })
  .fail(error => {
    console.log('Failed to reset resources: ' + error);
    showError('Failed to reset resources');
  });
}

function addBarriers(params) {
  return new Promise(resolve => {
    if($("#switch-useBarriers").is(':checked')) {
      var requests = [];
    
      for(var i = 0; i < url_barriers.length; i++) {
        requests.push(getFeatureCount(removeUrlQuery(url_barriers[i].url)));
      }
    
      Promise.all(requests) //Check if barrier services have features
      .then(responses => {
        for(var i = 0; i < responses.length; i++) {
          if(responses[i] > 0) {
            params[params_barriers[i]] = JSON.stringify(url_barriers[i]);
          } else {
            console.log(params_barriers[i] + ' is referencing an empty feature service and not used in analysis');
          }
        }
        resolve(params);
      })
      .catch(error => {
        resolve(params);
      })
    } else {
      resolve(params);
    }
  })
  
}

function removeUrlQuery(url) {
  url = String(url);
  return url.substr(0, url.indexOf('/query?'));
}