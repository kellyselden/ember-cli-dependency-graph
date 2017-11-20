define('percy-web/components/snapshot-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var next = Ember.run.next;
  var A = Ember.A;
  var ArrayProxy = Ember.ArrayProxy;
  var $ = Ember.$;
  var computed = Ember.computed;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['SnapshotList'],

    activeSnapshotId: null,
    buildContainerSelectedWidth: null,
    buildWidths: [],
    lastSnapshotIndex: null,
    selectedSnapshotIndex: -1,
    snapshotComponents: null,
    updateActiveSnapshotId: null,
    updateSelectedWidth: null,

    sortedSnapshots: computed('snapshots.[]', 'buildContainerSelectedWidth', function () {
      var snapshots = this.get('snapshots');
      var width = parseInt(this.get('buildContainerSelectedWidth'));

      function comparisonAtCurrentWidth(snapshot) {
        return snapshot.get('comparisons').findBy('width', width);
      }

      return snapshots.sort(function (a, b) {
        var comparisonForA = comparisonAtCurrentWidth(a);
        var comparisonForB = comparisonAtCurrentWidth(b);

        // First-level sort: priortize snapshots with comparisons at the current width to the top.
        if (comparisonForA && !comparisonForB) {
          // First snapshot has a comparison at the current width.
          return -1;
        } else if (!comparisonForA && comparisonForB) {
          // Second snapshot has a comparison at the current width.
          return 1;
        } else if (comparisonForA && comparisonForB) {
          // Both snapshots have a comparison for the current width, sort by diff percentage.
          return comparisonForB.get('smartDiffRatio') - comparisonForA.get('smartDiffRatio');
        }

        // Second sort: by diff ratio across all widths.
        function maxDiffRatioAnyWidth(comparisons) {
          return Math.max.apply(null, comparisons.mapBy('smartDiffRatio').filter(function (x) {
            return x;
          }));
        }
        var maxComparisonDiffA = maxDiffRatioAnyWidth(a.get('comparisons'));
        var maxComparisonDiffB = maxDiffRatioAnyWidth(b.get('comparisons'));

        // Sorts descending.
        return maxComparisonDiffB + maxComparisonDiffA;
      });
    }),
    hideNoDiffs: computed('noDiffSnapshotsCount', function () {
      var noDiffsCount = this.get('noDiffSnapshotsCount');
      var activeSnapshotId = this.get('activeSnapshotId');
      var activeSnapshotIsNoDiff = this.get('snapshotsWithoutDiffs').findBy('id', activeSnapshotId);

      return noDiffsCount > 0 && activeSnapshotIsNoDiff === undefined;
    }),
    snapshotsWithDiffs: computed('sortedSnapshots', function () {
      return this.get('sortedSnapshots').filter(function (snapshot) {
        return snapshot.get('comparisons').isAny('isDifferent');
      });
    }),
    snapshotsWithoutDiffs: computed('snapshots', function () {
      return this.get('snapshots').filter(function (snapshot) {
        return snapshot.get('comparisons').isEvery('isSame');
      });
    }),
    noDiffSnapshotsCount: computed('snapshotsWithoutDiffs', function () {
      return this.get('snapshotsWithoutDiffs').reduce(function (total, snapshot) {
        return total + snapshot.get('comparisons.length');
      }, 0);
    }),
    computedSnapshots: computed('hideNoDiffs', 'snapshotsWithDiffs.[]', 'snapshotsWithoutDiffs.[]', function () {
      if (this.get('hideNoDiffs')) {
        return this.get('snapshotsWithDiffs');
      } else {
        return [].concat(this.get('snapshotsWithDiffs'), this.get('snapshotsWithoutDiffs'));
      }
    }),
    isDefaultExpanded: computed('snapshotsWithDiffs', function () {
      return this.get('snapshotsWithDiffs.length') < 150;
    }),
    didInsertElement: function didInsertElement() {
      $(document).bind('keydown.snapshots', function (e) {
        if (!this.get('isShowingModal')) {
          if (e.keyCode === 39) {
            // right arrow
            this.send('nextSnapshot');
          } else if (e.keyCode === 37) {
            // left arrow
            this.send('previousSnapshot');
          }
        }
      }.bind(this));
    },
    willDestroyElement: function willDestroyElement() {
      $(document).unbind('keydown.snapshots');
    },

    scrollToChild: function scrollToChild(component) {
      $('.BuildContainer-body').animate({ scrollTop: component.$().get(0).offsetTop - 10 }, 0);
    },
    actions: {
      registerChild: function registerChild(component) {
        var _this = this;

        if (!this.get('snapshotComponents')) {
          this.set('snapshotComponents', ArrayProxy.create({ content: A() }));
        }
        this.get('snapshotComponents').pushObject(component);

        // While we are registering children components, notice if the current query parameter matches
        // and, if so, setup to scroll to that component after load.
        if (this.get('activeSnapshotId')) {
          var index = this.get('snapshotComponents.length') - 1;
          var addedSnapshotId = this.get('sortedSnapshots').objectAt(index).get('id');

          if (this.get('activeSnapshotId') === addedSnapshotId) {
            this.send('changeSelectedSnapshotIndex', function () {
              return index;
            });

            // After the list is inserted and rendered, scroll to this child component.
            next(function () {
              _this.scrollToChild(component);
            });
          }
        }
      },
      unregisterChild: function unregisterChild(component) {
        // Assume all components are being destroyed and we should reset the selection. TODO: improve.
        this.set('selectedSnapshotIndex', 0);
        this.get('snapshotComponents').removeObject(component);
      },
      selectChild: function selectChild(component) {
        this.send('changeSelectedSnapshotIndex', function () {
          return component.get('listIndex');
        });
      },
      nextSnapshot: function nextSnapshot() {
        var _this2 = this;

        this.send('changeSelectedSnapshotIndex', function (lastIndex) {
          return lastIndex + 1;
        });
        var lastIndex = this.get('selectedSnapshotIndex');

        next(function () {
          _this2.scrollToChild(_this2.get('snapshotComponents').objectAtContent([lastIndex]));
        });
      },
      previousSnapshot: function previousSnapshot() {
        var _this3 = this;

        this.send('changeSelectedSnapshotIndex', function (lastIndex) {
          return lastIndex - 1;
        });
        var lastIndex = this.get('selectedSnapshotIndex');

        next(function () {
          _this3.scrollToChild(_this3.get('snapshotComponents').objectAtContent([lastIndex]));
        });
      },
      changeSelectedSnapshotIndex: function changeSelectedSnapshotIndex(computeNextIndex) {
        var lastIndex = this.get('selectedSnapshotIndex');
        var newIndex = computeNextIndex(lastIndex);
        var computedSnapshotsLen = this.get('computedSnapshots.length');
        var newIndexWrapped = (newIndex + computedSnapshotsLen) % computedSnapshotsLen;
        this.set('lastSnapshotIndex', lastIndex);
        this.set('selectedSnapshotIndex', newIndexWrapped);
        this.send('updateSelectedSnapshot');
      },
      updateSelectedSnapshot: function updateSelectedSnapshot() {
        var snapshotComponents = this.get('snapshotComponents');

        if (snapshotComponents.length == 0) {
          return;
        }

        var selectedIndex = this.get('selectedSnapshotIndex');
        var selectedComponent = snapshotComponents.objectAt(selectedIndex);
        var lastIndex = this.get('lastSnapshotIndex');

        this.get('updateActiveSnapshotId')(selectedComponent.get('snapshot.id'));

        // Expand the selected component.
        selectedComponent.get('setAsSelected').call(selectedComponent);

        // Grab the last component, if it exists, and different
        if (lastIndex !== -1 && lastIndex != selectedIndex) {
          var lastComponent = snapshotComponents.objectAt(lastIndex);
          lastComponent.set('isExpanded', this.get('isDefaultExpanded'));
          lastComponent.set('isFocus', false);
        }
      },
      toggleNoDiffSnapshots: function toggleNoDiffSnapshots() {
        this.toggleProperty('hideNoDiffs');
        window.scrollTo(0, 0);
      }
    }
  });
});