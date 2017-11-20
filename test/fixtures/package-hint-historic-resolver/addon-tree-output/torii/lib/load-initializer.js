define('torii/lib/load-initializer', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (initializer) {
    Ember.onLoad('Ember.Application', function (Application) {
      Application.initializer(initializer);
    });
  };
});