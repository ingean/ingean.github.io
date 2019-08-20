//Parameters
var URL = 'https://services.arcgis.com/2JyTvMWQSnM2Vi8q/arcgis/rest/services/service_d9fa1d7a752f4675ae9eab2bffb634b5/FeatureServer/0/addFeatures';
var LOCATIONS = {
  "Toalett A" : {"x": 11.094,"y": 60.1940, "title":"Hva synes du om renholdet?"},
  "Toalett B" : {"x": 11.098,"y": 60.1941, "title":"Hva synes du om renholdet?"},
  "Sikkerhetskontrollen" : {"x": 11.092,"y": 60.1942, "title":"Hva synes du om servicen?"} 
};

function sendSurvey(score) {
  var location = $('#dropdown-locations').text();
  var features = [];
  var feature = {};
  feature["geometry"] = {};
  feature["geometry"]["x"] = LOCATIONS[location]["x"]
  feature["geometry"]["y"] = LOCATIONS[location]["y"]
  feature["attributes"] = {};
  feature["attributes"]["navn"] = location;
  feature["attributes"]["tilbakemelding"] = score;
  feature["attributes"]["CreationDate"] = moment.utc().format('YYYY-MM-DD HH:mm:ss');
  features.push(feature);

  var data = {"f":"json", "features":JSON.stringify(features)};
  postSurvey(data);
}

function postSurvey(data) {
  $.post(URL,data, function(data,status) {
    console.log("Survey posted with status: " + String(status))
    if(status="success") {
      $.notify({
        message: 'Takk for din tilbakemelding!' 
      },{
        type: 'success'
      });
    } else {
      $.notify({
        message: 'Noe gikk galt, prøv igjen senere' 
      },{
        type: 'danger'
      });
    }
  });
}

$(function(){

  $(".dropdown-menu a").click(function(){

    $("#dropdown-locations").text($(this).text());
    $("#dropdown-locations").val($(this).text());
    $("#span-question").html(LOCATIONS[$(this).text()]["title"]);
 });

})