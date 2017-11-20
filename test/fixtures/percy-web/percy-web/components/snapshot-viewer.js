define('percy-web/components/snapshot-viewer', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var not = Ember.computed.not;
  var alias = Ember.computed.alias;
  var computed = Ember.computed;
  var Component = Ember.Component;
  exports.default = Component.extend({
    snapshot: null,

    classNames: ['SnapshotViewer'],
    buildContainerSelectedWidth: null,
    snapshotSelectedWidth: computed('buildContainerSelectedWidth', {
      get: function get() {
        return this.get('buildContainerSelectedWidth');
      },
      set: function set(_, value) {
        return value;
      }
    }),
    selectedComparison: computed('snapshot', 'snapshotSelectedWidth', function () {
      var width = this.get('snapshotSelectedWidth');
      var comparisons = this.get('snapshot.comparisons') || [];
      return comparisons.findBy('width', parseInt(width, 10));
    }),

    classNameBindings: ['isFocus:SnapshotViewer--focus', 'isExpanded::SnapshotViewer--collapsed', 'isActionable:SnapshotViewer--actionable'],
    isDefaultExpanded: true,
    isFocus: false,
    isExpanded: computed('isDefaultExpanded', function () {
      // TODO: this is just to break the binding with isDefaultExpanded,
      // fix this when migrating to later ember versions with default one-way bindings.
      return this.get('isDefaultExpanded');
    }),
    isNotExpanded: not('isExpanded'),
    isActionable: alias('isNotExpanded'),

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      this.send('registerChild', this);
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      this.send('unregisterChild', this);
    },
    click: function click() {
      this.send('selectChild');
    },
    setAsSelected: function setAsSelected() {
      this.set('showNoDiffSnapshot', true);
      this.set('isFocus', true);

      if (this.get('isNotExpanded')) {
        this.set('isExpanded', true);
      }
    },

    actions: {
      selectChild: function selectChild() {
        this.get('setAsSelected').call(this);
        this.get('selectChild')(this);
      },
      registerChild: function registerChild() {
        this.get('registerChild')(this);
      },
      unregisterChild: function unregisterChild() {
        this.get('unregisterChild')(this);
      },
      updateSelectedWidth: function updateSelectedWidth(value) {
        this.set('snapshotSelectedWidth', value);
        this.get('snapshotWidthChangeTriggered')();
      },
      showSnapshotFullModalTriggered: function showSnapshotFullModalTriggered(snapshotId, snapshotSelectedWidth) {
        this.attrs.showSnapshotFullModalTriggered(snapshotId, snapshotSelectedWidth);
      }
    }
  });
});