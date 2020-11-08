document.addEventListener('DOMContentLoaded', async function() {
  moment.locale('nb_NO');

  let events = await getCalendarEvents();
  
  var calendarEl = document.getElementById('calendar');

  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'nb',
    initialView: 'dayGridMonth',
    initialDate: moment().format('YYYY-MM-DD'),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: events
  });

  calendar.render();
});