define('percy-web/components/comparison-mode-switcher', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var empty = Ember.computed.empty;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['ComparisonModeSwitcher'],
    classNameBindings: ['isHidden:ComparisonModeSwitcher--hidden'],
    wasAdded: alias('comparison.wasAdded'),
    isHidden: empty('comparison'),
    comparison: null,
    comparisonMode: null,
    updateComparionMode: function updateComparionMode() {
      /* closure action */
    }
  });
});