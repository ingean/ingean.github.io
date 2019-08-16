var TOKEN = '';
const incidentsList = [url_incident, url_standby];

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

var VRPparams = {
  "f":"json",
  "polygonBarriers": JSON.stringify(url_barriers),
  "orders": JSON.stringify(incidentsList[1]),
  "depots": JSON.stringify(url_resources),
  "impedance": "TravelTime",
  "env:outSR": 25833
};

function findClosest() {
  btnSpinner(true, '#btn-findClosest');
  deleteExistingRoutes();
  CFparams.token = TOKEN;
  CFparams.facilities = JSON.stringify(url_resources);
  CFparams.incidents = JSON.stringify(incidentsList[0]);
  CFparams.defaultTargetFacilityCount = $('#input-facilityCount').val();
  CFparams.timeOfDay = moment($('#input-date').val()).unix();
  
  closestFacility(CFparams, 0);
}

function findStandby() {
  btnSpinner(true, '#btn-findStandby');
  var selectedDay = moment($('#input-date').val()).format('dddd');
  selectedDay = selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1);
  console.log(selectedDay);
  var url = url_locationAllocation +
            '/submitJob?f=json&Dag=' + selectedDay;

 $.get(url)
  .done(response => {
    console.log('Submitted request for location allocation successfully')
    console.log('Check job status with: ');
    console.log(url_locationAllocation + '/jobs/' + response.jobId + '?f=json');
    checkGPJob(response.jobId);
  })
  .fail(error => {
    console.log('Failed to find standby locations: ' + error);
    $.notify({
      message: "Failed to find standby locations",
      type: "Danger"
    });
  })
}

function dispatchStandby() {
  btnSpinner(true, '#btn-dispatchStandby');
  deleteExistingRoutes();
  
  createRoutes(url_resources.url)
  .then(routes => {
    VRPparams.token = TOKEN;
    VRPparams["routes"] = JSON.stringify(routes);
    VRPparams["default_date"] = moment(moment($('#input-date').val()).format('YYYY-MM-DD')).unix();
    vehicleRouting(VRPparams, $('#input-minCutOff').val());
  })
  .catch(error => {
    console.log('Not able to get features to make routes: ' + error);
    $.notify({
      message: "Failed to allocate resources to standby points",
      type: "Danger"
    });
  })
}

function deleteExistingRoutes() {
  var data = {
    "where":"1=1"
  };
  
  var deletedFeatures = $.post(url_routes + '/deleteFeatures', data);
  deletedFeatures
  .done(response => {
    console.log('All existing routes deleted');
  })
  .fail(error => {
    console.log('Failed to delete all existing routes: ' + error);
    $.notify({
      message: "Failed to delete existing routes",
      type: "Danger"
    });
  })
}

function addFeatures(url, features) {
  var data = {
    "features":JSON.stringify(features),
  };

  var addingFeatures =  $.post(url + '/addFeatures', data)
  addingFeatures
  .done(response => {
    btnSpinner(false);
    console.log('Features added successfully');
  })
  .fail(error => {
    console.log('Failed to add features to feature service: ' + error);
    $.notify({
      message: "Failed to add features to feature service",
      type: "Danger"
    });
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

function closestFacility(data) {
  $.post(url_closestFacility, data)
  .done(response => {
    addFeatures(url_routes, response.routes.features);
    startSimulation(response.routes.features,'Utrykning');
  })
  .fail(error => {
    console.log('Failed to find closest facilities: ' + error);
    showError('Failed to find closest facilities');
  })  
}

function vehicleRouting(data, minTime) {
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": url_VRP + '/submitJob',
    "method": "POST",
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    },
    "data": data
  }

  $.ajax(settings).done(response => {
    console.log('VRP job submitted successfully');
    console.log('Check job status with: ');
    console.log(url_VRP + '/jobs/' + response.jobId + '?f=json&token=' + TOKEN);
    checkVRPJob(response.jobId);
  })
  .fail(error => {
    console.log('Failed to submit job to allocate facilities to incidents: ' + error);
    $.notify({
      message: "Failed to allocate facilities to incidents",
      type: "danger"
    });
  });
}

function btnSpinner(activate, btnID) {
  if(activate === true) {
    $(btnID).append('<span id="spinner-loading" class="spinner-border spinner-border-sm"></span>');
  } else {
    $('#spinner-loading').remove();
  }
}

function checkGPJob(jobId, freq = 5000, maxQueries = 50) {
  var url = url_locationAllocation + '/jobs/' + jobId + '?f=json';
  if(maxQueries > 0) {
    $.get(url)
    .done(response => {
      if(response.jobStatus !== 'esriJobSucceeded'&& response.jobStatus !== 'esriJobFailed') {
        setTimeout(() => {
          checkGPJob(jobId, freq, maxQueries - 1);
        }, freq);
      } else if(response.jobStatus === 'esriJobFailed') {
        btnSpinner(false);
        console.log('Allocation-Location failed with the following messages: ' + response.messages);
        showError('Failed to optimize standby points');
      } else {
        btnSpinner(false);
      }
    })
    .fail(error => {
      console.log('Failed to get job status: ' + error);
    })
  } else {
    console.log('GP tool timed out');
    btnSpinner(false);
  }
}

function checkVRPJob(jobId, freq = 5000, maxQueries = 50) {
  var url = url_VRP + '/jobs/' + jobId; 
  if(maxQueries > 0) {
    $.get(url + '?f=json&token=' + TOKEN)
    .done(response => {
      if(response.jobStatus !== 'esriJobSucceeded' && response.jobStatus !== 'esriJobFailed') {
        setTimeout(() => {
          checkVRPJob(jobId, freq, maxQueries - 1);
        }, freq);
      } else if(response.jobStatus === 'esriJobFailed') {
        btnSpinner(false);
        console.log('VRP failed with the following messages: ' + response.messages);
        showError('Failed to allocate resources to standby points');
      } else {
        btnSpinner(false);
        getVRPRoutes(url, response.results.out_routes.paramUrl);
      }
    })
    .fail(error => {
      console.log('Failed to get job status: ' + error);
    })
  } else {
    console.log('GP tool timed out');
    btnSpinner(false);
  }
}

function createRoutes(url) {
  return new Promise((resolve, reject) => {
    $.get(url)
    .done(response => {
      var features = response.features;
      var routes = [];
      
      for(var i = 0; i< features.length; i++) {
        var route = {
          "attributes": {
            "Name": features[i].attributes.name,
            "MaxOrderCount":1,
            "StartDepotName": features[i].attributes.name,
          }
        }
        routes.push(route);
      }
      resolve({"features": routes});
    })
    .fail(error => {
      reject(error);
    })  
  })
}

function getVRPRoutes(url_job, url_results_routes) {
  $.get(url_job + '/' + url_results_routes + '?f=json&token=' + TOKEN)
  .done(response => {
    var routes = routesFieldMapping(response.value.features,'Omplassering');
    addFeatures(url_routes, routes);
    startSimulation(routes);
  })
  .fail(error => {
    console.log('Failed to get routes from VRP result');
    showError('Failed to get routes from VRP result');
  })
}

function routesFieldMapping(inRoutes, routeType) {
  var outRoutes = [];
  for(var i = 0; i < inRoutes.length; i++) {
    var attributes = {
      "OBJECTID": inRoutes[i].attributes.ObjectId,
      "Name":inRoutes[i].attributes.Name,
      "StartTime":inRoutes[i].attributes.StartTime,
      "EndTime":inRoutes[i].attributes.EndTime,
      "StartTimeUTC":inRoutes[i].attributes.StartTimeUTC,
      "EndTimeUTC":inRoutes[i].attributes.EndTimeUTC,
      "Total_TravelTime":inRoutes[i].attributes.TotalTravelTime,
      "Total_Kilometers":inRoutes[i].attributes.TotalDistance,
      "RouteType":routeType
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

function startSimulation(features) {
  var url = url_simulator + '/submitJob';
  var data = {
    "f":"json",
    "Hastighet": hastighet,
    "Linjer":JSON.stringify({
      "fields": routes_schema.fields,
      "geometryType": routes_schema.geometryType,
      "features": features,
      "sr": routes_schema.sr
    })
  }; 

  $.post(url,data)
  .done(response => {
    console.log('Submitted request for starting simulation successfully')
    console.log('Check job status with: ');
    console.log(url_simulator + '/jobs/' + response.jobId + '?f=json');
    checkGPJob(response.jobId);
  })
  .fail(error => {
    console.log('Failed to submit features to GeoEvent simulator: ' + error);
    showError('Failed to submit features to GeoEvent simulator');  
  })
}



