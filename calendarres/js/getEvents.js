const urlFeatureView = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/ArcGIS/rest/services/Ressurstilgjengelighet/FeatureServer/0';


function featuresToEvents(features, globalId) {
  let events = []
  
  for (var i = 0; i < features.length; i++) {   
    let f = features[i];
    if (globalId && i === 0) addExternalEvents(features[0]);
    
    let event = {
      title: `${f.attributes.RESSURS} - ${f.attributes.LOKALITET_NAVN} (${f.attributes.Kapasitet}%)`,
      start: moment(f.attributes.Dato).format('YYYY-MM-DD')
    }
    events.push(event);
  }
  
   return events;
 }
 
 function getGlobalIdFromURL() {
   try {
     const urlParams = new URLSearchParams(window.location.search);
     const globalId = urlParams.get('globalId');
     FEATURESELECTED = true;
     return globalId
   } catch(error){
     return '';
   }
 }

 function addExternalEvents(f) {
  let caps = [25, 50, 75, 100];
  let exEventsList = document.getElementById('external-events');
  
  for (var i = 0; i < caps.length; i++) {
    let details = {
      globalId: f.attributes.GlobalID,
      resource: f.attributes.RESSURS,
      location: f.attributes.LOKALITET_NAVN,
      capacity: caps[i]
    };

    let exEventCont = document.createElement('div');
    let exEvent = document.createElement('div');
    exEventCont.className = 'fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event';
    exEvent.className = 'resource-25';
    exEvent.setAttribute('data-eventDetails', JSON.stringify(details));
    exEvent.innerHTML = `${caps[i]}% kapasitet`;
    exEventCont.appendChild(exEvent);
    exEventsList.appendChild(exEventCont);
  }
 }
 
 
 async function getCalendarEvents() {
   let token = await getToken();
   let globalId = getGlobalIdFromURL();
   let features = await getFeatures(urlFeatureView, globalId, token);
   return featuresToEvents(features, globalId);
 }