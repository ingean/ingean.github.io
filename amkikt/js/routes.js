var urlRoutes = "https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/AMK_resultater/FeatureServer/2";
const fieldsRoutes = [
  {name: "OBJECTID", alias: "OBJECTID", type:"oid"},
  {name: "Name", alias: "Rutenavn", type:"string"},
  {name: "RouteType", alias: "Oppdragstype", type:"string"},
  {name: "Destination", alias: "Bestemmelsessted", type:"string"},
  {name: "Formatted_TravelTime", alias: "Reisetid, formatert", type:"string"}
];

function appendToRoutes(routes, routeType) {
  for(var i = 0; i < routes.length; i++) {
    var name = routes[i].attributes.Name.split(' - ');
    var drivetime = formatDrivetime(routes[i].attributes.Total_TravelTime);

    routes[i].attributes["Name"] = name[0];
    routes[i].attributes["RouteType"] = routeType;
    routes[i].attributes["Destination"] = name[1];
    routes[i].attributes["Formatted_TravelTime"] = drivetime; 
  }
  return routes;
}

function formatDrivetime(drivetime) {
  if (drivetime < 60) {
    return moment().startOf('day').add(drivetime, 'minutes').format('mm:ss');
  } else {
    return moment().startOf('day').add(drivetime, 'minutes').format('HH:mm:ss');
  }
}


