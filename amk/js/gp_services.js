function executePlume() {
  $.get(url_incident.url)
  .done(response => {
    var url = url_plumeGP + '/submitJob';
    schema_cbrne.Senterpunkt.features = response.features;
    
  
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