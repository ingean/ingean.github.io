function startEvac(iter = evacIter) {
  var url = url_evacGP + '/submitJob';
  var data = {
    "f":"json",
    "Iterasjoner": iter
  }

  $.post(url,data)
  .done(response => {
    $('#span-iterationCount').html('Starter'); //Viser indikator på at Beredskapsgridet starter
    console.log('SUCCESS: Submitted request for starting responsegrid script, check job status:');
    console.log(url_evacGP + '/jobs/' + response.jobId + '?f=pjson');
    checkGPJob(url_evacGP, response.jobId, 6000, iter, function(response) {
      var gpIter = 1;
      var messages = response.messages;
      for(var i = 0; i < messages.length; i++) {
        if(messages[i].description.includes("Iterasjon")) {
          gpIter++;
          $('#span-iterationCount').html(gpIter + ' av ' + iter);
        }
        if(messages[i].description.includes("Completed")) {
          $('#span-iterationCount').html('Ferdig');
        }
      }
    });
  })
  .fail(error => {
    $('#span-iterationCount').html('Evakuering feilet');
    console.log('ERROR: Failed to submit evacuation GP: ' + error);
    //showError('Oppstart av evakuering feilet'); 
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
        console.log('ERROR: GP-tool failed with the following messages: ' + JSON.stringify(response.messages));
        showError('Failed to run GP-tool');
      } else {
        btnSpinner(false);
        $('#span-iterationCount').html('');
        console.log('SUCCESS: GP-tool finished');
      }
    })
    .fail(error => {
      console.log('ERROR: Failed to get job status: ' + error);
    })
  } else {
    console.log('INFO: GP tool job status check timed out');
    btnSpinner(false);
  }
}