var VRPparams = {
  "f":"json",
  "polygonBarriers": JSON.stringify(url_barriers),
  "orders": JSON.stringify(incidentsList[1]),
  "depots": JSON.stringify(url_resources),
  "impedance": "TravelTime",
  "env:outSR": 25833
};

function dispatchStandby() {
  btnSpinner(true, '#btn-dispatchStandby');
  deleteAllFeatures(url_routes), 'routes';
  
  createVRPRoutes(url_resources.url)
  .then(routes => {
    VRPparams.token = TOKEN;
    VRPparams["routes"] = JSON.stringify(routes);
    VRPparams["default_date"] = moment(moment($('#input-date').val()).format('YYYY-MM-DD')).unix();
    submitVRP(VRPparams, $('#input-minCutOff').val());
  })
  .catch(error => {
    console.log('Not able to get features to make routes: ' + error);
    showError('Not able to get features to make routes');
  })
}

function submitVRP(data, minTime) {
  $.post(url_VRP + '/submitJob', data)
  .done(response => {
    console.log('VRP job submitted successfully');
    console.log('Check job status with: ');
    console.log(url_VRP + '/jobs/' + response.jobId + '?f=pjson&token=' + TOKEN);
    checkVRPJob(response.jobId);
  })
  .fail(error => {
    console.log('Failed to submit job to allocate facilities to incidents: ' + error);
    showError('Failed to submit job to allocate facilities to incidents');
  });
}

function createVRPRoutes(url) {
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