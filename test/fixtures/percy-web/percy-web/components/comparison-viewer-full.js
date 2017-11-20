define('percy-web/components/comparison-viewer-full', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var equal = Ember.computed.equal;
  var reads = Ember.computed.reads;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['ComparisonViewerFull'],
    comparison: null,
    isBase: equal('comparisonMode', 'base'),
    isHead: equal('comparisonMode', 'head'),
    isDiff: equal('comparisonMode', 'diff'),
    headImage: reads('comparison.headScreenshot.image'),
    diffImage: reads('comparison.diffImage'),
    baseImage: reads('comparison.baseScreenshot.image'),
    click: function click() {
      if (!this.get('comparison') || this.get('comparison.wasAdded')) {
        return;
      }
      this.sendAction('cycleComparisonMode', 39);
    }
  });
});