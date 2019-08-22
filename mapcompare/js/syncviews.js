function synchronizeView(view, others) {
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

function synchronizeViews(views) {
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