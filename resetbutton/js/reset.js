
function reset() {
  btnSpinner(true, '#btnReset');
  let t = $('.btn-group > .btn.active').find('input').val();
  //let t = '8f4ee427-1865-402c-82d7-3a54f203de0a';
  let w = '5454008e-8c36-4541-aabc-14bb1344d263';
  let d = '160cf912-4518-413c-9a0a-b36b408a9d30';
  let query = `?assignmenttype=${t}&workerid=${w}&dispatcherid=${d}`

  fetch(urlProxyReset + query)
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