define('torii/lib/load-instance-initializer', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (instanceInitializer) {
    Ember.onLoad('Ember.Application', function (Application) {
      Application.instanceInitializer(instanceInitializer);
    });
  };
});