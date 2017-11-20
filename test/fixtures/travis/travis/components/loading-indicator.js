define('travis/components/loading-indicator', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    tagName: 'div',
    classNameBindings: ['center:loading-container', 'inline:inline-block', 'height:icon-height', 'white:white'],
    center: false
  });
});