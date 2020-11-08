const urlFeatureView = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/ArcGIS/rest/services/Ressurstilgjengelighet/FeatureServer/0';


function featuresToEvents(features, globalId) {
  let events = []
  
  for (var i = 0; i < features.length; i++) {   
    let f = features[i];
    if (globalId && i === 0) addExternalEvents(features[0]);
    if (!globalId) clearExternalEvents();
    
    let event = {
      title: `${f.attributes.RESSURS} - ${f.attributes.LOKALITET_NAVN} (${f.attributes.Tilgjengelighet}%)`,
      start: moment(f.attributes.Dato).format('YYYY-MM-DD'),
      backgroundColor: eventColor[f.attributes.Tilgjengelighet]
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
  let title = `${f.attributes.RESSURS} - ${f.attributes.LOKALITET_NAVN}`;
  let header = createEl({type: 'strong', innerHTML: title});
  let p = createEl({type: 'p', child: header});
  let exEventsList = createEl({id: 'external-events', child: p});
  
  for (var i = 0; i < caps.length; i++) {
    let details = {
      globalId: f.attributes.GlobalID,
      resource: f.attributes.RESSURS,
      location: f.attributes.LOKALITET_NAVN,
      capacity: caps[i],
    };

    let a = [['data-eventDetails', JSON.stringify(details)]];
    let exEvent = createEl({innerHTML: `${caps[i]}% kapasitet`, attributes: a});
    let exEventCont =createEl({className: 'fc-event fc-h-event fc-daygrid-event fc-daygrid-block-event', child: exEvent});
    exEventsList.appendChild(exEventCont);
  }
  let exEventsListCont = document.getElementById('external-events-container');
  exEventsListCont.appendChild(exEventsList);
 }

 function clearExternalEvents() {
  document.getElementById('external-events-container').innerHTML = ''
 }
 
 async function getCalendarEvents() {
   let token = await getToken();
   let globalId = getGlobalIdFromURL();
   let features = await getFeatures(urlFeatureView, globalId, token);
   return featuresToEvents(features, globalId);
 }