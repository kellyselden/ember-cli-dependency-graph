define('travis/components/ssh-key', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['settings-sshkey'],

    delete: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var key;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              key = this.get('key');

              key.deleteRecord();
              _context.next = 5;
              return key.save();

            case 5:
              _context.next = 9;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](0);

            case 9:

              this.sendAction('sshKeyDeleted');

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 7]]);
    })).drop()
  });
});