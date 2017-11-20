define('percy-web/components/build-container', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var on = Ember.on;
  var max = Ember.computed.max;
  var oneWay = Ember.computed.oneWay;
  var or = Ember.computed.or;
  var Component = Ember.Component;


  var POLLING_INTERVAL_SECONDS = 5;
  var MAX_UPDATE_POLLING_REQUESTS = 2000;

  exports.default = Component.extend({
    build: null,
    activeSnapshotId: null,
    updateActiveSnapshotId: null,
    classNames: ['BuildContainer'],
    classNameBindings: ['classes', 'isShowingModal:BuildContainer--snapshotModalOpen:BuildContainer--snapshotModalClosed'],
    maxWidth: max('build.comparisonWidths'),
    buildContainerSelectedWidth: oneWay('maxWidth'),
    noWidthSelected: false,
    currentPosition: null,

    showComparisons: or('build.isPending', 'build.isProcessing', 'build.isFinished'),
    shouldPollForUpdates: or('build.isPending', 'build.isProcessing'),

    // Task to poll for updates for pending builds.
    runningTask: null,
    maybeStartPolling: on('init', function () {
      if (this.get('shouldPollForUpdates')) {
        this.set('runningTask', this.get('pollForUpdatesTask').perform());
      }
    }),
    pollForUpdatesTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this = this;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.set('numPollRequests', 0);

            case 1:
              if (!(this.get('numPollRequests') < MAX_UPDATE_POLLING_REQUESTS)) {
                _context.next = 8;
                break;
              }

              this.incrementProperty('numPollRequests');
              this.get('build').reload().then(function (build) {
                build.get('comparisons').reload();
                if (!_this.get('shouldPollForUpdates')) {
                  _this.get('runningTask').cancel();
                }
                // Cancel after 1 iteration if running tests - otherwise acceptance tests break
                // ember-concurrency is planning on adding a better way to cancel tasks during testing
                // https://ember-concurrency.com/#/docs/testing-debugging
                if (Ember.testing) {
                  _this.get('runningTask').cancel();
                }
              });
              _context.next = 6;
              return (0, _emberConcurrency.timeout)(POLLING_INTERVAL_SECONDS * 1000);

            case 6:
              _context.next = 1;
              break;

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),

    actions: {
      showSnapshotFullModalTriggered: function showSnapshotFullModalTriggered(snapshotId, snapshotSelectedWidth) {
        this.sendAction('openSnapshotFullModal', snapshotId, snapshotSelectedWidth);
      },
      updateActiveSnapshotId: function updateActiveSnapshotId(comparisonId) {
        this.get('updateActiveSnapshotId')(comparisonId);
      },
      updateSelectedWidth: function updateSelectedWidth(width) {
        // Clear the query parameter selected snapshot.
        this.sendAction('updateActiveSnapshotId', undefined);

        this.set('noWidthSelected', false);
        if (width) {
          this.set('buildContainerSelectedWidth', width);
        }
        window.scrollTo(0, 0);
      },
      showSupport: function showSupport() {
        this.sendAction('showSupport');
      },
      snapshotWidthChangeTriggered: function snapshotWidthChangeTriggered() {
        this.set('noWidthSelected', true);
      }
    }
  });
});