
      dojo.require("dijit.layout.BorderContainer");
      dojo.require("dijit.layout.ContentPane");
      dojo.require("esri.map");
	    dojo.require("esri.tasks.query");

      var queryTask, query;
		  var prefix, suffix, current, interval;
		  var map;
		  var symbol;
function onLoad() {

  //0033_2320_km385,995.jpg

  var source = gup("src");
  prefix = gup("pre");
  suffix = gup("suf");
  interval = gup("int") * 1;

  current = source.replace(prefix, "").replace(suffix, "");
  current = current.replace(",", ".");
  current = current * 1;

  map = new esri.Map("map");
  queryTask = new esri.tasks.QueryTask("http://awsdemo04.geodata.no/arcgis/rest/services/JBV/Strekningsfoto/MapServer/0");
  query = new esri.tasks.Query();
  query.returnGeometry = true;
  query.outFields = ["OBJECTID"];

  var basemap = new esri.layers.ArcGISTiledMapServiceLayer("http://services.geodataonline.no/arcgis/rest/services/temp/GeocacheBasis_32633/MapServer");
  map.addLayer(basemap); 
  symbol = new esri.symbol.SimpleMarkerSymbol(); 
  
  dojo.connect(map, 'onLoad', function(theMap) {
    dojo.connect(dijit.byId('map'), 'resize', map,map.resize);
  });

  showCurrent();
}
		
function previous() {
  current -= interval;
  current = Math.round(current * 1000) / 1000;
  showCurrent();
}
		
function next() {
  current = current + interval;
  current = Math.round(current * 1000) / 1000;
  showCurrent();
}
		
function showCurrent() {
  var c = (current + "").replace(".", ",");
  var source = prefix + c + suffix;
  document.getElementById("image").src = source;
  console.debug(source);
  getCoordinates(c);
}
		
function getCoordinates(km){
  query.where = "BILDE = '"  + km + "'";
  queryTask.execute(query,showResults);
}
		
function showResults(results) {
  var graphic = results.features[0];
  graphic.setSymbol(symbol);
  map.centerAndZoom(graphic.geometry,16);
  map.graphics.clear();
  map.graphics.add(graphic);
}
		
		
function gup( name ) {
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}
   