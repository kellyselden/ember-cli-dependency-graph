define('code-corps-ember/components/signup-email-input', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var not = Ember.computed.not;
  var empty = Ember.computed.empty;
  var and = Ember.computed.and;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var once = Ember.run.once;
  var debounce = Ember.run.debounce;
  var cancel = Ember.run.cancel;
  var set = Ember.set;
  var observer = Ember.observer;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    cachedEmail: '',
    canSubmit: false,
    classNames: ['input-group'],
    hasCheckedOnce: false,
    isAvailableOnServer: false,
    isChecking: false,
    isValid: false,
    timer: null,

    ajax: service(),

    canCheck: and('isNotEmpty', 'isNotSameEmail'),
    canShowValidations: and('hasCheckedOnce', 'isNotChecking', 'isNotEmpty'),
    email: alias('user.email'),
    isAvailable: and('isAvailableOnServer', 'isNotEmpty'),
    isEmpty: empty('email'),
    isInvalid: not('isValid'),
    isNotEmpty: not('isEmpty'),
    isNotSameEmail: not('isSameEmail'),
    isNotChecking: not('isChecking'),
    isOkay: and('isAvailable', 'isValid'),
    isUnavailable: not('isAvailable'),

    isSameEmail: computed('cachedEmail', 'email', function () {
      return get(this, 'cachedEmail') === get(this, 'email');
    }),

    checkAvailable: function checkAvailable() {
      var _this = this;

      var email = get(this, 'email');
      this.sendRequest(email).then(function (result) {
        var available = result.available,
            valid = result.valid;

        var validation = valid && available;

        set(_this, 'cachedEmail', get(_this, 'email'));
        set(_this, 'hasCheckedOnce', true);
        set(_this, 'isChecking', false);
        set(_this, 'isAvailableOnServer', available);
        set(_this, 'isValid', valid);

        set(_this, 'canSubmit', validation);

        _this.sendAction('emailValidated', validation);
      });
    },


    emailChanged: observer('email', function () {
      once(this, '_check');
    }),

    sendRequest: function sendRequest(email) {
      return get(this, 'ajax').request('/users/email_available', {
        method: 'GET',
        data: {
          email: email
        }
      });
    },


    actions: {
      keyDown: function keyDown() {
        if (get(this, 'isNotSameEmail')) {
          set(this, 'isChecking', true);
        }
      }
    },

    _check: function _check() {
      set(this, 'isChecking', true);

      if (get(this, 'canCheck')) {
        cancel(get(this, 'timer'));
        var deferredAction = debounce(this, function () {
          this.checkAvailable();
        }, 500);
        set(this, 'timer', deferredAction);
      } else if (get(this, 'isSameEmail') && get(this, 'isNotEmpty')) {
        this.sendAction('emailValidated', get(this, 'canSubmit'));
        set(this, 'isChecking', false);
      } else {
        this.sendAction('emailValidated', false);
        set(this, 'isChecking', false);
      }
    }
  });
});