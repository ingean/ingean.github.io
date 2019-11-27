$(function(){
  init();
})

function init() {
  getToken();
  resetDemo();
}

function getToken(){
  var settings = {
    "async": true,
    "crossDomain": true,
    "url": url_Token,
    "method": "POST",
    "headers": {
      "content-type": "application/x-www-form-urlencoded",
      "accept": "application/json"
    },
    "data": {
      "client_id": clientId,
      "client_secret": clientSecret,
      "grant_type": "client_credentials"
    }
  }

  $.ajax(settings).done(function (response) {
    TOKEN = JSON.parse(response).access_token;
  });
}

function resetDemo() {
  $('#span-iterationCount').html('');
  startEvac(1)
}

