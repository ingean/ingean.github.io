function resetResources() {
  var data = {
    "f":"json",
    "features": JSON.stringify(init_amb)
  };

  var url = removeUrlQuery(url_resources.url) + '/updateFeatures';
  
  $.post(url,data).done(response => {
    console.log('SUCCESS: Resource positions and status are reset');
  })
  .fail(error => {
    console.log('ERROR: Failed to reset resources: ' + error);
    showError('Failed to reset resources');
  });
}

function resetStandby() {
  var url = removeUrlQuery(url_standby.url);
  var data = {
    "f":"JSON",
    "where":"allokert=3",
    "calcExpression": JSON.stringify([{"field": "allokert","value": 0}])
  }
  $.post(url + '/calculate', data)
  .done(response => {
    console.log('SUCCESS: Standby points status is reset');
  })
  .fail(error => {
    console.log('ERROR: Resetting standby points statuses failed: ' + error);
    showError('Klarte ikke å tilbakestille status på beredskapspunkter');
  })
}