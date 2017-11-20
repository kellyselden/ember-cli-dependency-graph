define('code-corps-ember/initializers/head-tags', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    // ember 1.13 backwards compatibility
    var application = arguments[1] || arguments[0];
    application.inject('service:head-tags', 'router', 'router:main');
  }

  exports.default = {
    name: 'head-tags',
    initialize: initialize
  };
});