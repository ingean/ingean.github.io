var TOKEN = '';


function btnSpinner(activate, btnID) {
  if(activate === true) {
    $(btnID).append('<span id="spinner-loading" class="spinner-border spinner-border-sm"></span>');
  } else {
    $('#spinner-loading').remove();
  }
}


function showError(message, type= 'danger') {
  $.notify({
    message: message,
    type: type
  });
}


function removeUrlQuery(url) {
  url = String(url);
  return url.substr(0, url.indexOf('/query?'));
}

