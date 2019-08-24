var responseGridStarted = false;
var responseGridIter = 1;

function findStandby() {
  btnSpinner(true, '#btn-findStandby');
  var selectedDay = moment($('#input-date').val()).format('dddd');
  selectedDay = selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1);
  console.log(selectedDay);
  var url = url_locationAllocation +
            '/submitJob?f=json&Dag=' + selectedDay;

 $.get(url)
  .done(response => {
    console.log('Submitted request for location allocation successfully, check job status:');
    console.log(url_locationAllocation + '/jobs/' + response.jobId + '?f=pjson');
    checkGPJob(url_locationAllocation, response.jobId, 1000, 200, function(response) {
      //Do something while executing
    });
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
    var name = response.features[0].attributes.name;
    var features = replaceAttributes(response.features, {"objectid":1,"type": "Gass: Giftig 2", "beskrivelse": "","name":name},25833);
    
    var cbrne_point = {
      "fields": schema_cbrne.fields,
      "features": features,
      "geometryType": "esriGeometryPoint",
      "sr":{"wkid":25833,"latestWkid":25833}
    }

    var cbrne_input = {
      "env:outSR": 25833,
      "Senterpunkt": JSON.stringify(cbrne_point),
      "Vind_fra_YR_no": schema_cbrne.geometryType,
      "Brukerdefinert_vindretning": "NE",
      "Brukerdefinert_vindstyrke": 15,
      "Beskrivelse": $('#select-plume-type').val(),
      "Slett_gamle_soner": true
    };
  
    $.post(url_plumeGP + '/submitJob?f=json', cbrne_input)
    .done(response => {
      console.log('Submitted request for plume successfully, check job status: ');
      console.log(url_plumeGP + '/jobs/' + response.jobId + '?f=pjson');
      checkGPJob(url_plumeGP, response.jobId, 1000, 50, function(response) {
        //Do something while executing
      });
    })
    .fail(error => {
      console.log('Failed to create plumes: ' + error);
      showError('Failed to create plumes');  
    })
  })
}

function executeRoadCloseGP() {
  btnSpinner(true, '#btn-createRoadBlocks');

  $.get(url_plumeResult + "/query?f=json&where=id_field='Hot'")
  .done(response => {
    var data = {
      "Område": JSON.stringify({
        "geometryType": "esriGeometryPolygon",
        "spatialReference": {
          "wkid" : 25833, 
          "latestWkid" : 25833
        }, 
        "fields": schema_roadblockArea.fields,
        "features": response.features
      }),
      "Melding": "Hot faresone"
    }

    $.post(url_roadcloseGP + '/submitJob?f=json',data)
    .done(response => {
      console.log('Submitted request for roadblocks successfully, check job status: ');
      console.log(url_roadcloseGP + '/jobs/' + response.jobId + '?f=pjson');
      checkGPJob(url_roadcloseGP, response.jobId, 1000, 50, function(response) {
        //Do something while executing
      });
    })
    .fail(error => {
      console.log('Failed to submit request for roadblocks: ' + error);
      showError('Failed to create roadblocks');
    })
  })
  .fail(error => {
    console.log('Failed to get plume polygon for use as input to roadblocks GP-tool: ' + error);
    showError('Failed to create roadblocks');
  })
}


function startSimulation(features) {
  var url = url_simulator + '/submitJob';
  var data = {
    "f":"json",
    "Hastighet": $("#input-simulationSpeed").val(),
    "Linjer":JSON.stringify({
      "objectIdFieldName" : "OBJECTID", 
      "uniqueIdField" : {
        "name" : "OBJECTID", 
        "isSystemMaintained" : true
      }, 
      "globalIdFieldName" : "", 
      "geometryProperties" : {
        "shapeLengthFieldName" : "Shape__Length", 
        "units" : "esriMeters"
      }, 
      "geometryType" : "esriGeometryPolyline", 
      "spatialReference" : {
        "wkid" : 25833, 
        "latestWkid" : 25833
      }, 
      "fields": schema_routes.fields,
      "features": features
    })
  }; 

  //console.log(JSON.stringify(data.Linjer));
  $.post(url,data)
  .done(response => {
    console.log('Submitted request for starting simulation successfully, check job status:');
    console.log(url_simulator + '/jobs/' + response.jobId + '?f=pjson');
    checkGPJob(url_simulator, response.jobId, 1000, 50, function(response) {
      //Do something while executing
    });
  })
  .fail(error => {
    console.log('Failed to submit features to GeoEvent simulator: ' + error);
    showError('Failed to submit features to GeoEvent simulator');  
  })
}

function startResponseGrid() {
  var url = url_responseGP + '/submitJob';
  var data = {
    "f":"json",
    "Antall": $('#input-gridIterations').val()
  }
  responseGridIter = 1;

  $.post(url,data)
  .done(response => {
    $('#span-iterationCount').html('Starter'); //Viser indikator på at Beredskapsgridet starter
    console.log('Submitted request for starting responsegrid script successfully, check job status:');
    console.log(url_responseGP + '/jobs/' + response.jobId + '?f=pjson');
    var iterations = Number($('#input-gridIterations').val()) + 10;
    checkGPJob(url_responseGP, response.jobId, 6000, iterations, function(response) {
      var messages = response.messages;
      for(var i = 0; i < messages.length; i++) {
        if(messages[i].description.length < 4) {
          responseGridIter++;
          if(messages[i].description === '1' && responseGridStarted === false) {
            responseGridStarted = true;
            console.log('Response grid script is running');
            //showError('Beredskapsgridet er klar til bruk', 'info');
          }
          $('#span-iterationCount').html(
            responseGridIter + 
            ' av ' +
            $('#input-gridIterations').val() 
          );
        }
      }
    });
  })
  .fail(error => {
    console.log('Failed to submit responsegrid script startup: ' + error);
    showError('Oppstart av beredskapsgrid feilet'); 
  })
}


function checkGPJob(url_GPservice, jobId, freq, maxQueries, callback) {
  var url = url_GPservice + '/jobs/' + jobId + '?f=json';
  if(maxQueries > 0) {
    $.get(url)
    .done(response => {
      if(response.jobStatus !== 'esriJobSucceeded' && response.jobStatus !== 'esriJobFailed') {
        if (response.jobStatus === 'esriJobExecuting') { callback(response); }
        setTimeout(() => {
          checkGPJob(url_GPservice, jobId, freq, maxQueries - 1, callback);
        }, freq);
      } else if(response.jobStatus === 'esriJobFailed') {
        btnSpinner(false);
        console.log('GP-tool failed with the following messages: ' + JSON.stringify(response.messages));
        showError('Failed to run GP-tool');
      } else {
        btnSpinner(false);
        $('#span-iterationCount').html('');
        console.log('GP-tool finished successfully');
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