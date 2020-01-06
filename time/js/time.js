function showTime() {
  var date = new Date();
  var options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  var locale = 'no-NB'

  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59
  
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;
  
  var time = h + ":" + m + ":" + s;
  //var datestring = date.getDate() + "." + (Number(date.getMonth()) + 1) + "." + date.getFullYear();
  
  var datestring = date.toLocaleDateString(locale, options);

  $('#timeDisplay').html(time);
  $('#timeDisplay').text(time);

  $('#dateDisplay').html(datestring);
  $('#dateDisplay').text(datestring);
  //document.getElementById("timeDisplay").innerText = time;
  //document.getElementById("timeDisplay").textContent = time;
  
  setTimeout(showTime, 1000);
  
}

showTime();


function getURLParameters() {
  var search = location.search.substring(1);
  return JSON.parse('{"' + search.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key===""?value:decodeURIComponent(value) })
}

window.onload = function() {
  var urlParams = getURLParameters();
  document.body.style.background = '#' + urlParams.bgColor;
  document.getElementById('timeDisplay').style.color = '#' + urlParams.timeColor;
  document.getElementById('dateDisplay').style.color = '#' + urlParams.dateColor;
}