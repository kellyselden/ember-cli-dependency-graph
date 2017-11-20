define('liquid-fire/components/-lf-get-outlet-state', ['exports', 'liquid-fire/ember-internals'], function (exports, _emberInternals) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    tagName: '',
    layout: _emberInternals.getOutletStateTemplate
  });
});