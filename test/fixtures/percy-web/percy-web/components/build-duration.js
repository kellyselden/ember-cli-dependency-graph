define('percy-web/components/build-duration', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    build: null,
    classes: null,

    classNames: ['BuildDuration'],
    classNameBindings: ['classes']
  });
});