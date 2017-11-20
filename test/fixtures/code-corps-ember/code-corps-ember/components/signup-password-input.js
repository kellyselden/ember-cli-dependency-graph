define('code-corps-ember/components/signup-password-input', ['exports', 'password-strength'], function (exports, _passwordStrength) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var computed = Ember.computed;
  var not = Ember.computed.not;
  var lt = Ember.computed.lt;
  var gte = Ember.computed.gte;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['input-group'],

    ajax: service(),

    canShowValidations: alias('isNotEmpty'),
    isEmpty: lt('passwordLength', 1),
    isInvalid: not('isValid'),
    isNotEmpty: not('isEmpty'),
    isOkay: alias('isValid'),
    isValid: gte('passwordLength', 6),
    passwordLength: alias('password.length'),
    suggestions: alias('strength.feedback.suggestions'),

    password: computed('user.password', function () {
      return this.get('user.password') || '';
    }),

    strength: computed('password', function () {
      var password = this.get('password') || '';
      return (0, _passwordStrength.default)(password);
    }),

    strengthPercentage: computed('isValid', 'passwordLength', 'strength', function () {
      var isValid = this.get('isValid');
      var percentage = 0;

      if (isValid) {
        var score = this.get('strength.score');
        percentage = score / 4 * 100;
      } else {
        percentage = this.get('passwordLength');
      }

      return percentage;
    })
  });
});