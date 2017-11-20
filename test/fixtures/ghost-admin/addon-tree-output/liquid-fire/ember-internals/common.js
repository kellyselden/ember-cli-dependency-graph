define('liquid-fire/ember-internals/common', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.childRoute = childRoute;
  exports.routeName = routeName;
  exports.routeModel = routeModel;
  exports.routeIsStable = routeIsStable;
  exports.modelIsStable = modelIsStable;
  var get = Ember.get;


  // Traverses down to the child routeInfo with the given name.
  function childRoute(routeInfo, outletName) {
    var outlets = void 0;
    // TODO: the second condition is only necessary because every
    // constrainable accessor runs against every value all the time. It
    // would be better to add a precondition on helperName that would
    // short-circuit this elsewhere.
    if (routeInfo && (outlets = routeInfo.outlets)) {
      return outlets[outletName];
    }
  }

  // Finds the route name from a route state so we can apply our
  // matching rules to it.
  function routeName(routeInfo) {
    if (routeInfo) {
      return [routeInfo.render.name];
    }
  }

  // Finds the route's model from a route state so we can apply our
  // matching rules to it. On first access, will lock down the value of
  // the model so that future changes don't change the answer. This lets
  // us avoid the problem of singleton controllers changing underneath
  // us.
  function routeModel(routeInfo) {
    if (routeInfo && !routeInfo.hasOwnProperty('_lf_model')) {
      var r = void 0,
          c = void 0;
      if ((r = routeInfo.render) && (c = r.controller)) {
        routeInfo._lf_model = get(c, 'model');
      } else {
        routeInfo._lf_model = null;
      }
    }

    if (routeInfo) {
      return [routeInfo._lf_model];
    } else {
      return [];
    }
  }

  function routeIsStable(oldRouteInfo, newRouteInfo) {
    if (!oldRouteInfo && !newRouteInfo) {
      return true;
    }

    if (!oldRouteInfo || !newRouteInfo) {
      return false;
    }

    return oldRouteInfo.render.template === newRouteInfo.render.template && oldRouteInfo.render.controller === newRouteInfo.render.controller;
  }

  // Only valid for states that already satisfy routeIsStable
  function modelIsStable(oldRouteInfo, newRouteInfo) {
    var oldModel = routeModel(oldRouteInfo) || [];
    var newModel = routeModel(newRouteInfo) || [];
    return oldModel[0] === newModel[0];
  }
});