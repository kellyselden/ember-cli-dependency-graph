define('travis/initializers/app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(app) {
    if (typeof window !== 'undefined') {
      return window.Travis = app;
    }
  }

  exports.default = {
    name: 'app',
    initialize: initialize
  };
});