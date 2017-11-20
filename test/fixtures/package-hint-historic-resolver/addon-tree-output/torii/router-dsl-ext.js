define('torii/router-dsl-ext', ['torii/compat/get-router-lib'], function (_getRouterLib) {
  'use strict';

  var Router = Ember.Router;
  var proto = Ember.RouterDSL.prototype;

  var currentMap = null;

  proto.authenticatedRoute = function () {
    this.route.apply(this, arguments);
    currentMap.push(arguments[0]);
  };

  Router.reopen({
    _initRouterJs: function _initRouterJs() {
      currentMap = [];
      this._super.apply(this, arguments);
      var routerLib = (0, _getRouterLib.default)(this);
      routerLib.authenticatedRoutes = currentMap;
    }
  });
});