define('percy-web/components/comparison-switcher-item', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var Component = Ember.Component;
  exports.default = Component.extend({
    selectedWidth: null,
    width: null,
    comparisons: [],

    classNames: ['ComparisonSwitcherItem'],
    updateSelectedWidth: function updateSelectedWidth() {},

    classNameBindings: ['isSelected:ComparisonSwitcherItem--selected', 'matchingComparison::ComparisonSwitcherItem--noComparison', 'matchingComparison.isDifferent:ComparisonSwitcherItem--hasDiffs'],
    matchingComparison: computed('comparsions', 'width', function () {
      var comparisons = this.get('comparisons') || [];
      return comparisons.findBy('width', this.get('width'));
    }),
    isSelected: computed('selectedWidth', 'width', function () {
      return parseInt(this.get('selectedWidth'), 10) === this.get('width');
    }),
    click: function click() {
      this.get('updateSelectedWidth')(this.get('width'));
    }
  });
});