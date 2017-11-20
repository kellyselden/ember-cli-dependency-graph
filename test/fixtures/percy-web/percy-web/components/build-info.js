define('percy-web/components/build-info', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    build: null,
    showComparisonInfo: true,
    classes: null,

    classNames: ['BuildInfo'],
    classNameBindings: ['classes']
  });
});