define('percy-web/components/comparison-viewer', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var Component = Ember.Component;
  exports.default = Component.extend({
    comparison: null,

    classNames: ['ComparisonViewer'],
    hasNoWidth: computed('comparison', 'snapshotSelectedWidth', function () {
      return parseInt(this.get('snapshotSelectedWidth')) !== this.get('comparison.width');
    }),
    showNoDiffSnapshot: false,
    isOverlayEnabled: true,
    comparisonUrl: computed(function () {
      return '?comparison=' + this.get('comparison.id');
    }),
    actions: {
      toggleOverlay: function toggleOverlay() {
        this.toggleProperty('isOverlayEnabled');
      },
      toggleNoDiffResource: function toggleNoDiffResource() {
        this.toggleProperty('showNoDiffSnapshot');
      }
    }
  });
});