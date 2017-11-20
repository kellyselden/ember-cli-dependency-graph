define('code-corps-ember/components/progress-bar-container', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['progress-bar-container'],

    animated: false,
    error: false,
    percentage: null
  });
});