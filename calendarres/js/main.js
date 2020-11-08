document.addEventListener('DOMContentLoaded', async function() {
  moment.locale('nb_NO');

  let events = await getCalendarEvents();
 
  var containerEl = document.getElementById('external-events-container'); 
  var calendarEl = document.getElementById('calendar');

  var Draggable = FullCalendar.Draggable;
  new Draggable(containerEl, {
    itemSelector: '.fc-event',
    eventData: function(eventEl) {
      let details = JSON.parse(eventEl.childNodes[0].getAttribute('data-eventDetails'));
      return {
        title: `${details.resource} - ${details.location} (${details.capacity}%)`,
        backgroundColor: eventColor[details.capacity]
      };
    }
  });
  
  var calendar = new FullCalendar.Calendar(calendarEl, {
    locale: 'nb',
    height: 'auto',
    editable: true,
    droppable: true,
    initialView: 'dayGridMonth',
    initialDate: moment().format('YYYY-MM-DD'),
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: events,
    drop: function(info) {
      addEventToArcGIS(info);
      }
  });
  calendar.render();
});