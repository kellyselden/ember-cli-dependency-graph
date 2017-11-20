define('torii/bootstrap/routing', ['exports', 'torii/routing/application-route-mixin', 'torii/routing/authenticated-route-mixin', 'torii/lib/container-utils'], function (exports, _applicationRouteMixin, _authenticatedRouteMixin, _containerUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = toriiBootstrapRouting;


  var AuthenticatedRoute = null;

  function reopenOrRegister(applicationInstance, factoryName, mixin) {
    var factory = (0, _containerUtils.lookup)(applicationInstance, factoryName);
    var basicFactory;

    if (factory) {
      factory.reopen(mixin);
    } else {
      basicFactory = (0, _containerUtils.lookupFactory)(applicationInstance, 'route:basic');
      if (!AuthenticatedRoute) {
        AuthenticatedRoute = basicFactory.extend(_authenticatedRouteMixin.default);
      }
      (0, _containerUtils.register)(applicationInstance, factoryName, AuthenticatedRoute);
    }
  }

  function toriiBootstrapRouting(applicationInstance, authenticatedRoutes) {
    reopenOrRegister(applicationInstance, 'route:application', _applicationRouteMixin.default);
    for (var i = 0; i < authenticatedRoutes.length; i++) {
      var routeName = authenticatedRoutes[i];
      var factoryName = 'route:' + routeName;
      reopenOrRegister(applicationInstance, factoryName, _authenticatedRouteMixin.default);
    }
  }
});