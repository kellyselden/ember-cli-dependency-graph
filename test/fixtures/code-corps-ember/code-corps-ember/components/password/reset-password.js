define('code-corps-ember/components/password/reset-password', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var set = Ember.set;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['form--centered', 'reset-password-form'],

    /**
     * @property flashMessages
     * @type Ember.Service
     */
    flashMessages: service(),
    /**
     * @property password
     * @default String
     */
    password: '',
    /**
     * @property passwordConfirmation
     * @default String
     */
    passwordConfirmation: '',
    /**
     * @property error
     */
    error: null,

    /**
     * @property resetPasswordTask
     * @param password
     * @param passwordConfirmation
     */
    resetPasswordTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(password, passwordConfirmation) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return get(this, 'resetPassword')(password, passwordConfirmation);

            case 3:
              get(this, 'flashMessages').clearMessages().success("Your password has been reset and you're now signed in.");
              set(this, 'error', null);
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](0);

              set(this, 'error', _context.t0);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 7]]);
    })),

    actions: {

      /**
       * @method resetPassword
       * @param password
       * @param passwordConfirmation
       */
      resetPassword: function resetPassword(password, passwordConfirmation) {
        return get(this, 'resetPasswordTask').perform(password, passwordConfirmation);
      }
    }
  });
});