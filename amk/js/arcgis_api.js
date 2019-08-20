function deleteAllFeatures(url, featurename = 'features') {
  var data = {
    "where":"1=1"
  };
  
  $.post(url + '/deleteFeatures', data)
  .done(response => {
    console.log('All existing ' + featurename + ' deleted');
  })
  .fail(error => {
    console.log('Failed to delete all ' + featurename + ' :' + error);
    showError('Failed to delete all ' + featurename);
  })
}

function addFeatures(url, features) {
  var data = {
    "features":JSON.stringify(features),
  };

  $.post(url + '/addFeatures', data)
  .done(response => {
    btnSpinner(false);
    console.log('Features added successfully');
  })
  .fail(error => {
    console.log('Failed to add features to feature service: ' + error);
    showError('Failed to add features to feature service');
  })
}

function getFeatureCount(url) {
  return new Promise(resolve => {
    $.get(url + '/query?f=json&where=1+%3D+1&returnCountOnly=true')
    .then(result => {
      resolve(JSON.parse(result).count);
    });
  })
}