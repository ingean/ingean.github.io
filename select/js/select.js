require([
  "esri/widgets/Locate",
  "esri/widgets/Search",
  "esri/widgets/Sketch",
  "esri/widgets/FeatureTable",
  "esri/widgets/LayerList",
  "esri/widgets/Legend",
  "esri/widgets/Expand",
  "esri/Map",
  "esri/layers/FeatureLayer",
  "esri/layers/GraphicsLayer",
  "esri/geometry/Point",
  "esri/geometry/Multipoint",
  "esri/views/MapView", 
  "esri/WebMap",
], function(Locate, Search, Sketch, FeatureTable, LayerList, Legend, Expand, Map, FeatureLayer, GraphicsLayer, Point, Multipoint, MapView, WebMap)  {
  
  
  const highlights = [];
  const webmap = new WebMap({
    portalItem: {
      id: "cc88649b41c84e8083df5704f06f6f74"
    }
  });
  
  const layer = new GraphicsLayer();
  layer.title = 'Søkeområde';

  webmap.add(layer);

  const view = new MapView({
    container: "viewDiv",
    map: webmap,
    zoom: 5,
    center: [90, 45]
  });

  const locate = new Locate({
    view: view
  });

  view.ui.add(locate, "top-left");

  const search = new Search({
    view: view,
    allPlaceholder: "Stedsnavn, adresse eller Gnr/Bnr"
  });

  // Add the search widget to the top right corner of the view
  view.ui.add(search, "top-right");

  const sketch = new Sketch({
    layer: layer,
    view: view,
    creationMode: "update"
  });

  var sketchExp = new Expand({
    view: view,
    content: sketch
  });

  view.ui.add(sketchExp, "top-right");


  view.when(function() {
    const featureLayer = webmap.layers.getItemAt(1); 
    featureLayer.title = "Tilgjengelig infrastruktur";

    // Create the feature table
    const featureTable = new FeatureTable({
      layer: featureLayer,
      fieldConfigs: [
        {
          name: "Eier",
          label: "Infrastruktureier"
        },
        {
          name: "Kategori",
          label: "Kategori",
          direction: "asc"
        },
        {
          name: "Type",
          label: "Type"
        },
        {
          name: "Status",
          label: "Status"
        },
        {
          name: "Starttid",
          label: "Oppstart"
        },
        {
          name: "Sluttid",
          label: "Ferdigstilt"
        },
        {
          name: "Kontaktperson",
          label: "Kontaktperson"
        },
        {
          name: "EPost",
          label: "E-postadresse"
        },
        {
          name: "Gateadresse",
          label: "Gateadresse"
        },
        {
          name: "Postnummer",
          label: "Postnummer"
        },
        {
          name: "Poststed",
          label: "Poststed"
        }
      ],
      container: document.getElementById("tableDiv")
    });
 
    // Get the FeatureLayer's layerView and listen for the table's selection-change event
    view.whenLayerView(featureLayer).then(function(layerView) {
      featureTable.on("selection-change", function(changes) {
        // If the selection is removed remove its highlighted feature from the layerView
        changes.removed.forEach(function(item) {
          const data = highlights.find(function(data) {
            return data.feature === item.feature;
          });
          if (data) {
            highlights.splice(highlights.indexOf(data), 1);
            data.highlight.remove();
          }
        });

        // If the selection is added, push all added selections to array and highlight on layerView
        changes.added.forEach(function(item) {
          const feature = item.feature;
          highlight = layerView.highlight(item.feature);
          highlights.push({
            feature: feature,
            highlight: highlight
          });
        });
      });
    });

    var layerList = new LayerList({
      view: view
    });

    var layerlistExp = new Expand({
      view: view,
      content: layerList
    });

    view.ui.add(layerlistExp, "top-right");

    var legend = new Legend({
      view: view
    });

    var legendExp = new Expand({
      view: view,
      content: legend
    });
    // Add widget to the bottom right corner of the view
    view.ui.add(legendExp, "bottom-right");
  });
});