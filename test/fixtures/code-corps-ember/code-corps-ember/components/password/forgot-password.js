define('code-corps-ember/components/password/forgot-password', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var set = Ember.set;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['form--centered', 'forgot-password-form'],

    /**
     * @property flashMessages
     * @type Ember.Service
     */
    flashMessages: service(),

    /**
     * @property email
     * @default String
     */
    email: '',
    /**
     * @property error
     */
    error: null,

    /**
     * @property forgotPasswordTask
     * @param email
     */
    forgotPasswordTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(email) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return get(this, 'forgotPassword')(email);

            case 3:
              get(this, 'flashMessages').clearMessages().success("Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder or double-check whether you have an account with this email.");
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
       * @method forgotPassword
       * @param email
       */
      forgotPassword: function forgotPassword(email) {
        return get(this, 'forgotPasswordTask').perform(email);
      }
    }
  });
});