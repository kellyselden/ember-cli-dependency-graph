define('ember-tooltips/utils', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed,
      warn = Ember.warn;
  var onComponentTarget = exports.onComponentTarget = computed(function () {

    var targetView = void 0;

    if (this.get('_shouldTargetGrandparentView')) {

      /* The parentView is the lazy-render-wrapper
      and we want to ignore that tagless component
      */

      targetView = this.get('parentView.parentView');
    } else {
      targetView = this.get('parentView');
    }

    if (!targetView) {
      warn('No targetView found');

      return null;
    } else if (!targetView.get('elementId')) {
      warn('No targetView.elementId');

      return null;
    } else {
      return '#' + targetView.get('elementId');
    }
  });
});