define('package-hint-historic-resolver/router', ['exports', 'package-hint-historic-resolver/config/environment', 'ember-metrics-mixins/mixins/router'], function (exports, _environment, _router) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var EmberRouter = Ember.Router;


  var Router = EmberRouter.extend(_router.default, {
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {});

  exports.default = Router;
});