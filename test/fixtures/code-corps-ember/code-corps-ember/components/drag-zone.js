define('code-corps-ember/components/drag-zone', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['drag-zone', 'flexbox-container'],

    dragState: service(),

    dragLeave: function dragLeave() {
      get(this, 'dragState').leaving();
    },
    dragOver: function dragOver() {
      get(this, 'dragState').dragging();
    }
  });
});