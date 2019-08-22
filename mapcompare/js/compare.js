require([
  "esri/Map",
  "esri/views/MapView",
  "esri/geometry/Extent",
  "esri/Basemap",
  "esri/layers/TileLayer",
  "esri/layers/VectorTileLayer",
  "esri/core/watchUtils"
], function(Map, MapView, Extent, Basemap, TileLayer, VectorTileLayer, watchUtils) {

var gdoBasemaps = [
  'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBasis/MapServer',
  'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheGraatone/MapServer',
  'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheLandskap/MapServer',
  'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheHybrid/MapServer',
  'https://services.geodataonline.no/arcgis/rest/services/Geocache_UTM33_EUREF89/GeocacheBilder/MapServer'
];

  var view0 = createView('div-view0',0);
  var view1 = createView('div-view1',1);
  var view2 = createView('div-view2',2);
  var view3 = createView('div-view3',3);

  var synchronizeView = function(view, others) {
    others = Array.isArray(others) ? others : [others];

    var viewpointWatchHandle;
    var viewStationaryHandle;
    var otherInteractHandlers;
    var scheduleId;

    var clear = function() {
      if (otherInteractHandlers) {
        otherInteractHandlers.forEach(function(handle) {
          handle.remove();
        });
      }
      viewpointWatchHandle && viewpointWatchHandle.remove();
      viewStationaryHandle && viewStationaryHandle.remove();
      scheduleId && clearTimeout(scheduleId);
      otherInteractHandlers = viewpointWatchHandle = viewStationaryHandle = scheduleId = null;
    };

    var interactWatcher = view.watch("interacting,animation", function(
      newValue
    ) {
      if (!newValue) {
        return;
      }
      if (viewpointWatchHandle || scheduleId) {
        return;
      }

      // start updating the other views at the next frame
      scheduleId = setTimeout(function() {
        scheduleId = null;
        viewpointWatchHandle = view.watch("viewpoint", function(
          newValue
        ) {
          others.forEach(function(otherView) {
            otherView.viewpoint = newValue;
          });
        });
      }, 0);

      // stop as soon as another view starts interacting, like if the user starts panning
      otherInteractHandlers = others.map(function(otherView) {
        return watchUtils.watch(
          otherView,
          "interacting,animation",
          function(value) {
            if (value) {
              clear();
            }
          }
        );
      });

      // or stop when the view is stationary again
      viewStationaryHandle = watchUtils.whenTrue(
        view,
        "stationary",
        clear
      );
    });

    return {
      remove: function() {
        this.remove = function() {};
        clear();
        interactWatcher.remove();
      }
    };
  };

  /**
   * utility method that synchronizes the viewpoints of multiple views
   */
  var synchronizeViews = function(views) {
    var handles = views.map(function(view, idx, views) {
      var others = views.concat();
      others.splice(idx, 1);
      return synchronizeView(view, others);
    });

    return {
      remove: function() {
        this.remove = function() {};
        handles.forEach(function(h) {
          h.remove();
        });
        handles = null;
      }
    };
  };

  // bind the views
  synchronizeViews([view0, view1, view2, view3]);

  function createView(mapDiv, i) {
    var rtLayer2 = new TileLayer({
      url: gdoBasemaps[4]
    });

    var rtLayer = new TileLayer({
      url: gdoBasemaps[i]
    });

    var layers = [];

    if (i === 3) {
      layers.push(rtLayer2, rtLayer);
    } else {
      layers.push(rtLayer);
    }
  
    var basemap = new Basemap({
      baseLayers: layers,
      title: "Geodata Bakgrunnskart",
      id: "gdo_" + String(i)
    });
        
    var map = new Map({ basemap: basemap });
    var extent = new Extent({
      xmin: 257000,
      ymin: 6643100,
      xmax: 267000,
      ymax: 6662000,
      spatialReference: {
        wkid: 25833
      }
    });

    return new MapView({
      container: mapDiv, 
      map: map,
      extent: extent
      
      //center: [7, 62],
      //zoom: 4
    });
  }
})
