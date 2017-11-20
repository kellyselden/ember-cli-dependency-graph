define('percy-web/components/snapshot-viewer-full', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var reads = Ember.computed.reads;
  var computed = Ember.computed;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['SnapshotViewerFull'],
    build: null,
    comparisonMode: null,
    snapshotId: null,
    galleryMap: ['base', 'diff', 'head'],
    galleryIndex: computed('comparisonMode', function () {
      return this.get('galleryMap').indexOf(this.get('comparisonMode'));
    }),

    snapshot: computed('build.snapshots.[]', 'snapshotId', function () {
      return this.get('build.snapshots').findBy('id', this.get('snapshotId'));
    }),
    buildWidths: alias('build.comparisonWidths'),
    selectedComparison: computed('snapshot', 'snapshotSelectedWidth', function () {
      var comparisons = this.get('snapshot.comparisons') || [];
      var width = parseInt(this.get('snapshotSelectedWidth'), 10);
      return comparisons.findBy('width', width);
    }),
    snapshotSelectedWidth: reads('selectedComparison.width'),
    didRender: function didRender() {
      this._super.apply(this, arguments);

      // Autofocus component for keyboard navigation
      this.$().attr({ tabindex: 1 });
      this.$().focus();
    },

    actions: {
      updateSelectedWidth: function updateSelectedWidth(value) {
        var comparisons = this.get('snapshot.comparisons') || [];
        var comparison = comparisons.findBy('width', parseInt(value, 10));

        this.set('selectedComparison', comparison);
        this.set('snapshotSelectedWidth', value);

        this.sendAction('transitionRouteToWidth', this.get('snapshot'), value, this.get('comparisonMode'));
      },
      cycleComparisonMode: function cycleComparisonMode(keyCode) {
        var galleryMap = this.get('galleryMap');
        var galleryLength = this.get('galleryMap.length');
        var directional = keyCode === 39 ? 1 : -1;
        var galleryIndex = this.get('galleryIndex');
        var newIndex = ((galleryIndex + directional) % galleryLength + galleryLength) % galleryLength;

        this.sendAction('updateComparisonMode', galleryMap[newIndex]);
      }
    },
    keyDown: function keyDown(event) {
      var buildId = this.get('build.id');
      var snapshotId = this.get('snapshot.id');

      if (event.keyCode === 27) {
        this.sendAction('closeSnapshotFullModal', buildId, snapshotId);
      }

      if (event.keyCode === 39 || event.keyCode === 37) {
        if (!this.get('selectedComparison') || this.get('selectedComparison.wasAdded')) {
          return;
        }
        this.send('cycleComparisonMode', event.keyCode);
      }
    }
  });
});