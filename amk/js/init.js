$(function(){
  getToken();
  resetDemo();
})

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
  $("#input-date").val(moment().format('YYYY-MM-DDTHH:00'));
  $("#switch-useBarriers").prop('checked', true);
  
  resetResources();
  deleteAllFeatures(url_routes, 'routes');
  deleteAllFeatures(url_messages, 'messages');

}

