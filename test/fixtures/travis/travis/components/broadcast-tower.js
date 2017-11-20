define('travis/components/broadcast-tower', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var later = Ember.run.later;
  var EmberPromise = Ember.RSVP.Promise;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['broadcast'],
    isOpen: false,
    timeoutId: '',

    toggle: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.toggleProperty('isOpen');
              this.sendAction('toggleBroadcasts');

              // Acceptance tests will wait for the promise to resolve, so skip in tests

              if (!(this.get('isOpen') && !Ember.testing)) {
                _context.next = 7;
                break;
              }

              _context.next = 5;
              return new EmberPromise(function (resolve) {
                return later(resolve, 10000);
              });

            case 5:

              this.toggleProperty('isOpen');
              this.sendAction('toggleBroadcasts');

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).restartable()
  });
});