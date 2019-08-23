$(function(){
  init();
})

function init() {
  getToken();
  resetDemo();
  getRoutesSchema();
  getRoadBlockAreaSchema();
}

function getToken(){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": url_Token,
    "method": "POST",
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    },
    "data": {
      "client_id": clientId,
      "client_secret": clientSecret,
      "grant_type": "client_credentials"
    }
  }

  $.ajax(settings).done(function (response) {
    TOKEN = JSON.parse(response).access_token;
  });
}

function resetDemo() {
  $("#input-date").val(moment().format('YYYY-MM-DDTHH:00'));
  $("#switch-useBarriers").prop('checked', true);
  
  resetResources();
  deleteAllFeatures(url_routes, 'routes');
  deleteAllFeatures(url_messages, 'messages');
  deleteAllFeatures(url_roadcloseResults, 'roadblocks');
  deleteAllFeatures(removeUrlQuery(url_standby.url), 'beredskapspunkter');
  deleteAllFeatures(url_plumeResult, 'plumes');
}

function getRoutesSchema() {
  var url = url_routes + '?f=json';
  $.get(url)
  .then(response => {
    schema_routes.fields = JSON.parse(response).fields;
    console.log('Successfully fetched schema for output routes');
  })
  .catch(error => {
    console.log('Not able to get schema for output routes: ' + error);
    showError('Klarte ikke hente skjema for kjøreruter');
  })
}

function getRoadBlockAreaSchema() {
  var url = url_roadcloseGP + '?f=json';
  $.get(url)
  .then(response => {
    schema_roadblockArea.fields = response.fields;
    console.log('Successfully fetched schema for roadblock GP-tool input area');
  })
  .catch(error => {
    console.log('Not able to get schema for roadblock GP-tool input area: ' + error);
    showError('Klarte ikke hente skjema for område for veisperringer');
  })
}


