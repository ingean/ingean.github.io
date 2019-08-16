function executePlume() {
  $.get(url_incident.url + '&outSR=25833')
  .done(response => {
    var url = url_plumeGP + '/submitJob';
    var features = appendAttributes(response.features, {"type": "Gass: Giftig 2"});
    schema_cbrne.Senterpunkt["fields"] = response.fields;
    schema_cbrne.Senterpunkt["features"] = features;
  
    $.post(url,data)
    .done(response => {
      console.log('Submitted request for plume successfully')
      console.log('Check job status with: ');
      console.log(url_plumeGP + '/jobs/' + response.jobId + '?f=json');
      checkGPJob(response.jobId);
    })
    .fail(error => {
      console.log('Failed to create plumes: ' + error);
      showError('Failed to create plumes');  
    })
  })
}