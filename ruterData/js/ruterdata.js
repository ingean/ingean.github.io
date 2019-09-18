function getData() {
  var url = 'https://kart.bussradar.no/ruter/SIRI_VM_GeoJSON.php';
  var features = [];

  $.get(url).done(objs => {
    objs = JSON.parse(objs);
    for (var i = 0; i < objs.length; i++) {
      features.push(createFeature(objs[i]));
    }
    addFeatures('https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/Kolumbus_Realtime_Bus/FeatureServer/0',
      features
      );
  })
  .fail(error => {
    console.log('Not able to get bussradar data: ' + error);
  });
}

function createFeature(obj) {
  return {
    geometry: {
      x: Number(obj.geometry.coordinates[0]),
      y: Number(obj.geometry.coordinates[1]),
      spatialReference: {wkid: 4326, latestWkid: 4326}
    },
    attributes: {
      Vognnummer: obj.properties.VehicleRef,
      Rute: obj.properties.LineRef + ' ' + obj.properties.OriginName + ' - ' + obj.properties.DestinationName,
      Avgang: obj.properties.OriginAimedDepartureTime,
      Forsinkelse: obj.properties.Delay
    }
  }
}

function addFeatures(url, features) {
  var data = {
    "features":JSON.stringify(features),
  };

  $.post(url + '/addFeatures', data)
  .done(response => {
    btnSpinner(false);
    console.log('SUCCESS: Features added successfully');
  })
  .fail(error => {
    console.log('ERROR: Failed to add features to feature service: ' + error);
    showError('Failed to add features to feature service');
  })
}