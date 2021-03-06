define('ember-responsive/initializers/responsive', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  /**
   * Ember responsive initializer
   *
   * Supports auto injecting media service app-wide.
   * Generated by the ember-responsive addon.
   */
  function initialize() {
    var application = arguments[1] || arguments[0];

    application.inject('controller', 'media', 'service:media');
    application.inject('component', 'media', 'service:media');
    application.inject('route', 'media', 'service:media');
    application.inject('view', 'media', 'service:media');
  }

  exports.default = {
    name: 'responsive',
    initialize: initialize
  };
});