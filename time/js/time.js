function showTime() {
  var date = new Date();
  var h = date.getHours(); // 0 - 23
  var m = date.getMinutes(); // 0 - 59
  var s = date.getSeconds(); // 0 - 59
  
  h = (h < 10) ? "0" + h : h;
  m = (m < 10) ? "0" + m : m;
  s = (s < 10) ? "0" + s : s;
  
  var time = h + ":" + m + ":" + s;
  var date = date.getDate() + "." + (Number(date.getMonth()) + 1) + "." + date.getFullYear();

  $('#timeDisplay').html(time);
  $('#timeDisplay').text(time);

  $('#dateDisplay').html(date);
  $('#dateDisplay').text(date);
  //document.getElementById("timeDisplay").innerText = time;
  //document.getElementById("timeDisplay").textContent = time;
  
  setTimeout(showTime, 1000);
  
}

showTime();