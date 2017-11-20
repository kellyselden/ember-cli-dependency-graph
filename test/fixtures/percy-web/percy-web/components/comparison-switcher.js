define('percy-web/components/comparison-switcher', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var Component = Ember.Component;
  exports.default = Component.extend({
    snapshotSelectedWidth: null,
    comparisons: [],
    buildWidths: [],
    updateSelectedWidth: function updateSelectedWidth() {},

    classNames: ['ComparisonSwitcher'],
    selectedWidth: computed('snapshotSelectedWidth', {
      get: function get() {
        return this.get('snapshotSelectedWidth');
      },
      set: function set(_, value) {
        return value;
      }
    }),
    actions: {
      updateSelectedWidth: function updateSelectedWidth(value) {
        if (value === parseInt(this.get('selectedWidth'))) {
          return;
        }

        this.set('selectedWidth', value);
        this.get('updateSelectedWidth')(value);
      }
    }
  });
});