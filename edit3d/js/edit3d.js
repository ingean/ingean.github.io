require([
  "esri/layers/FeatureLayer",
  "esri/WebScene",
  "esri/views/SceneView",
  "esri/widgets/Expand",
  "esri/widgets/Editor",
  "esri/widgets/Daylight", 
  "esri/widgets/LineOfSight",
  "esri/geometry/Point",
  "esri/Graphic",
  "esri/core/watchUtils"
], function (FeatureLayer, WebScene, SceneView, Expand, Editor, Daylight, LineOfSight, Point, Graphic, watchUtils ) {
  // Create a map from the referenced webscene item id
  let webscene = new WebScene({
    portalItem: {
      id: "bd8f9599b6dd42b6bd4f0a5ab381b5b6"
    }
  });

  var view = new SceneView({
    container: "viewDiv",
    qualityProfile: "high",
    environment: {
      atmosphere: {
        quality: "high"
      },
      lighting: {
        date: new Date(),
        directShadowsEnabled: true
      }
    },
    map: webscene
  });

  /**************************************
   * Initialize the LineOfSight widget
   **************************************/

  const lineOfSight = new LineOfSight({
    view: view,
    container: "losWidget"
  });

  /**************************************
   * Add symbols to mark the intersections
   * for the line of sight
   **************************************/

  const viewModel = lineOfSight.viewModel;

  // watch when observer location changes
  viewModel.watch("observer", function (value) {
    setIntersectionMarkers();
  });

  // watch when a new target is added or removed
  viewModel.targets.on("change", function (event) {
    event.added.forEach(function (target) {
      setIntersectionMarkers();
      // for each target watch when the intersection changes
      target.watch("intersectedLocation", setIntersectionMarkers);
    });
  });

  // an inverted cone marks the intersection that occludes the view
  const intersectionSymbol = {
    type: "point-3d",
    symbolLayers: [
      {
        type: "object",
        resource: { primitive: "inverted-cone" },
        material: { color: [255, 100, 100] },
        height: 10,
        depth: 10,
        width: 10,
        anchor: "relative",
        anchorPosition: { x: 0, y: 0, z: -0.7 }
      }
    ]
  };

  function setIntersectionMarkers() {
    view.graphics.removeAll();
    viewModel.targets.forEach(function (target) {
      if (target.intersectedLocation) {
        const graphic = new Graphic({
          symbol: intersectionSymbol,
          geometry: target.intersectedLocation
        });
        view.graphics.add(graphic);
      }
    });
  }

  /**************************************
   * Create an analysis by setting
   * the initial observer and four targets
   **************************************/

  viewModel.observer = new Point({
    latitude: 42.3521,
    longitude: -71.0564,
    z: 139
  });

  viewModel.targets = [
    createTarget(42.3492, -71.0529),
    createTarget(42.3477, -71.0542),
    createTarget(42.3485, -71.0533),
    createTarget(42.3467, -71.0549)
  ];

  function createTarget(lat, lon, z) {
    return {
      location: new Point({
        latitude: lat,
        longitude: lon,
        z: z || 0
      })
    };
  }

  // start the tool to create the line of sight analysis
  viewModel.start();
  // resume the analysis
  watchUtils.whenEqualOnce(viewModel, "state", "creating", function (
    value
  ) {
    viewModel.stop();
  });

  // add an Expand widget to make the menu responsive
  const expand = new Expand({
    expandTooltip: "Expand line of sight widget",
    view: view,
    content: document.getElementById("losDiv"),
    expanded: true
  });

  view.ui.add(expand, "top-right");


  view.when(function () {
    view.popup.autoOpenEnabled = false; //disable popups
    // Create the Editor
    var editor = new Editor({
      view: view
    });

    var editExpand = new Expand({
      view: view,
      content: editor
    });

    // Add widget to top-right of the view
    view.ui.add(editExpand, "top-right");

    const daylightWidget = new Daylight({
      view: view,
      // plays the animation twice as fast than the default one
      playSpeedMultiplier: 2,
      // disable the timezone selection button
      visibleElements: {
        timezone: false
      }
    });

    let daylightExpand = new Expand({
      view: view,
      content: daylightWidget
    })

    view.ui.add(daylightExpand, "top-right");

    // allow user to turn the layer with new planned buildings on/off
    // and see how the line of sight analysis changes
    const plannedBuildingsLayer = view.map.layers
      .filter(function (layer) {
        return (
          layer.title === "Mulighetsrom"
        );
      })
      .getItemAt(0);

    document
      .getElementById("layerVisibility")
      .addEventListener("change", function (event) {
        plannedBuildingsLayer.visible = event.target.checked;
      });

  });
});