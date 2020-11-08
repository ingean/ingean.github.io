const clientId = 'ZqXYO5dSBeUcD2tZ';
const clientSecret = '6427e84585024920a9bce259d1ddd4b1';
const urlToken = 'https://www.arcgis.com/sharing/rest/oauth2/token';

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

function editSuccess(res, op = 'addResults') {
  try {
    let success = res[op][0].success;

    if (success) {
      return true;
    } else {
      console.log(res[op][0].error.description);
      return false
    }
  } catch(err) {
    return false;
  }
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

async function addFeatures(url, features, token = '') {
  url = url + '/addFeatures';
  
  var urlencoded = new URLSearchParams();
  urlencoded.append("f", "json");
  urlencoded.append("token", token);
  urlencoded.append("features", JSON.stringify(features));

  let response = await post(url, urlencoded);
  let j = await response.json();
  return editSuccess(j, 'addFeatures');
}
