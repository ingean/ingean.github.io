const clientId = 'ZqXYO5dSBeUcD2tZ';
const clientSecret = '6427e84585024920a9bce259d1ddd4b1';

const urlToken = 'https://www.arcgis.com/sharing/rest/oauth2/token';
const urlFeatureService = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/ArcGIS/rest/services/Ressurstilgjengelighet/FeatureServer/0';

function post(url, data) {
  let options = {
    method: 'POST',
    body: data,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    }
  };
  return fetch(url, options);
}

async function getToken() {    
  var urlencoded = new URLSearchParams();
  urlencoded.append("client_id", clientId);
  urlencoded.append("client_secret", clientSecret);
  urlencoded.append("grant_type", "client_credentials");

  let response = await post(urlToken, urlencoded);
  let j = await response.json();
  return j.access_token;
}

async function getFeatures(url, globalId = '', token = '') {
  let q = '/query?f=json&outFields=*&where=';

  if(globalId) {
    q += "GLOBALID='" + globalId + "'";
  } else {
    q += '1=1';
  }

  if (token) q += '&token=' + token; 
  
  
  let response = await fetch(url + q);
  let j = await response.json()
  return j.features;
}

function featuresToEvents(features) {
 let events = []
 
 for (var f of features) {
   let event = {
     title: `${f.attributes.RESSURS} - ${f.attributes.LOKALITET_NAVN} (${f.attributes.Kapasitet}%)`,
     start: moment(f.attributes.Dato).format('YYYY-MM-DD')
   }
   events.push(event);
 }
 
  return events;
}

function getGlobalId() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const globalId = urlParams.get('globalId');
    return globalId
  } catch(error){
    return '';
  }
}


async function getCalendarEvents() {
  let token = await getToken();
  let globalId = getGlobalId();
  let features = await getFeatures(urlFeatureService, globalId, token);
  return featuresToEvents(features);
}
