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
    console.log(url_locationAllocation + '/jobs/' + response.jobId + '?f=pjson');
    checkGPJob(url_locationAllocation, response.jobId);
  })
  .fail(error => {
    console.log('Failed to find standby locations: ' + error);
    showError('Failed to find standby locations');
  })
}

function executePlume() {
  btnSpinner(true, '#btn-createPlumes');
  $.get(url_incident.url + '&outSR=25833')
  .done(response => {
    response = JSON.parse(response);
    var features = replaceAttributes(response.features, {"objectid":1,"type": "Gass: Giftig 2", "beskrivelse": ""},25833);
    
    schema_cbrne.Senterpunkt["features"] = features;
    schema_cbrne.Senterpunkt = JSON.stringify(schema_cbrne.Senterpunkt);
  
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": url_plumeGP + '/submitJob?f=json',
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "accept": "application/json"
      },
      "data": schema_cbrne
    }
  
    $.ajax(settings).done(response => {
      console.log('Submitted request for plume successfully')
      console.log('Check job status with: ');
      console.log(url_plumeGP + '/jobs/' + response.jobId + '?f=pjson');
      checkGPJob(url_plumeGP, response.jobId);
    })
    .fail(error => {
      console.log('Failed to create plumes: ' + error);
      showError('Failed to create plumes');  
    })
  })
}

function startSimulation(features) {
  var url = url_simulator + '/submitJob';
  var data = {
    "f":"json",
    "Hastighet": hastighet,
    "Linjer":JSON.stringify({
      "fields": schema_routes.fields,
      "geometryType": schema_routes.geometryType,
      "features": features,
      "sr": schema_routes.sr
    })
  }; 

  $.post(url,data)
  .done(response => {
    console.log('Submitted request for starting simulation successfully')
    console.log('Check job status with: ');
    console.log(url_simulator + '/jobs/' + response.jobId + '?f=pjson');
    checkGPJob(url_simulator, response.jobId);
  })
  .fail(error => {
    console.log('Failed to submit features to GeoEvent simulator: ' + error);
    showError('Failed to submit features to GeoEvent simulator');  
  })
}

function checkGPJob(url_GPservice, jobId, freq = 5000, maxQueries = 50) {
  var url = url_GPservice + '/jobs/' + jobId + '?f=json';
  if(maxQueries > 0) {
    $.get(url)
    .done(response => {
      if(response.jobStatus !== 'esriJobSucceeded' && response.jobStatus !== 'esriJobFailed') {
        setTimeout(() => {
          checkGPJob(url_GPservice, jobId, freq, maxQueries - 1);
        }, freq);
      } else if(response.jobStatus === 'esriJobFailed') {
        btnSpinner(false);
        console.log('GP-tool failed with the following messages: ' + response.messages);
        showError('Failed to run GP-tool');
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