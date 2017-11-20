define('package-hint-historic-resolver/services/config', ['exports', 'package-hint-historic-resolver/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service;
  var serverApiEndpoint = _environment.default.APP.serverApiEndpoint;
  exports.default = Service.extend({
    serverApiEndpoint: serverApiEndpoint,
    limiterTime: 50,
    cacheTime: 1000 * 60 * 60 // one hour
  });
});