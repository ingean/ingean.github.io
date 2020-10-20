require([
  "esri/views/MapView",
  "esri/WebMap",
  "esri/geometry/Extent",
  "esri/core/watchUtils"
], function(MapView, WebMap, Extent, watchUtils) {

  var view0 = createView('div-view0',"10edb55b029c4c888ae4eebd69d3113f"); // Basis webmap
  var view1 = createView('div-view1',"f5b56e0174af47afa02321af33001906"); // Grey webmap
  var view2 = createView('div-view2',"c65fbe3347064b29aff5ac38a6f20e16"); // Dark webmap
  var view3 = createView('div-view3',"a189d190119f4c54a1f4169047b115ad"); // Imagery webmap

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

  function createView(mapDiv, mapId) {
    let extent = new Extent({
      xmin: 257000,
      ymin: 6643100,
      xmax: 267000,
      ymax: 6662000,
      spatialReference: {
        wkid: 25833
      }
    });
    
    let webmap = new WebMap({
      portalItem: {
        id: mapId
      }
    });
  
    return new MapView({
      container: mapDiv, 
      map: webmap,
      extent: extent 
    });
  }
})
