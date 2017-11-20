define('package-hint-historic-resolver/authenticators/torii', ['exports', 'ember-simple-auth/authenticators/torii'], function (exports, _torii) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  exports.default = _torii.default.extend({
    torii: service()
  });
});