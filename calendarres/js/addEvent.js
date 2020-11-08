const urlTable = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/VerSa/FeatureServer/7';

function eventToFeatures(info) {
 let event = info.draggedEl.childNodes[0];
 let details = JSON.parse(event.getAttribute('data-eventDetails'));
  return [{
   attributes: {
     GUID: details.globalId,
     Dato: moment(info.date).format('YYYY-MM-DDT12:00:00'),
     Tilgjengelighet: details.capacity
   }
 }];
}

async function addEventToArcGIS(info) {
  let features = eventToFeatures(info);
  let token = await getToken();
  let success = await addFeatures(urlTable, features, token);
  //if (!success) console.log('Not able to add event to ArcGIS');
}