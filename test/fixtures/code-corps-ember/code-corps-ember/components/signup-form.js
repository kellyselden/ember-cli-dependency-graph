define('code-corps-ember/components/signup-form', ['exports', 'ember-concurrency'], function (exports, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var gte = Ember.computed.gte;
  var and = Ember.computed.and;
  var alias = Ember.computed.alias;
  var later = Ember.run.later;
  var set = Ember.set;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['form--centered', 'signup-form'],
    emailValid: false,
    hasError: false,
    usernameValid: false,

    canSubmit: and('emailValid', 'passwordValid', 'usernameValid'),
    passwordLength: alias('password.length'),
    passwordValid: gte('passwordLength', 6),

    password: computed('user.password', function () {
      return get(this, 'user.password') || '';
    }),

    actions: {
      emailValidated: function emailValidated(result) {
        set(this, 'emailValid', result);
      },
      signUp: function signUp() {
        if (get(this, 'canSubmit')) {
          get(this, '_submit').perform();
        } else {
          this._shakeButton();
        }
      },
      usernameValidated: function usernameValidated(result) {
        set(this, 'usernameValid', result);
      }
    },

    _setError: function _setError() {
      set(this, 'hasError', true);
    },
    _shakeButton: function _shakeButton() {
      if (!get(this, 'hasError')) {
        set(this, 'hasError', true);
        later(this, function () {
          set(this, 'hasError', false);
        }, 1000);
      }
    },


    _submit: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this = this;

      var credentials, promise;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              credentials = {
                identification: get(this, 'user.email'),
                password: get(this, 'user.password')
              };
              promise = get(this, 'user').save().then(function () {
                get(_this, 'signIn')(credentials);
              }).catch(function (error) {
                get(_this, 'handleErrors')(error);
              });
              _context.next = 4;
              return promise;

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop()
  });
});