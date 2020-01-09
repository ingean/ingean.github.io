
function reset() {
  btnSpinner(true, '#btnReset');
  let t = $('.btn-group > .btn.active').find('input').val();

  fetch(urlProxyReset + '?type=' + t)
  .then(console.log('New shift succeeded'))
  .catch(console.log('New shift failed'))
  .finally(btnSpinner(false))
}

function btnSpinner(activate, btnID) {
  if(activate === true) {
    $(btnID).append('<span id="spinner-loading" class="spinner-border spinner-border-sm"></span>');
  } else {
    $('#spinner-loading').remove();
  }
}