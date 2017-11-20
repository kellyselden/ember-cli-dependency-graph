define('ember-keyboard/mixins/activate-keyboard-on-focus', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin;
  var on = Ember.on;
  var set = Ember.set;
  exports.default = Mixin.create({
    activateKeyboardWhenFocused: on('click', 'focusIn', function () {
      set(this, 'keyboardActivated', true);
    }),

    deactivateKeyboardWhenFocusOut: on('focusOut', function () {
      set(this, 'keyboardActivated', false);
    })
  });
});