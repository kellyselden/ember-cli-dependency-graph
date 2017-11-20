define('ember-keyboard/mixins/keyboard-first-responder-on-focus', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin;
  var on = Ember.on;
  var setProperties = Ember.setProperties;
  var set = Ember.set;
  exports.default = Mixin.create({
    makeFirstResponderOnFocusIn: on('click', 'focusIn', function () {
      setProperties(this, {
        keyboardActivated: true,
        keyboardFirstResponder: true
      });
    }),

    resignFirstResponderOnFocusOut: on('focusOut', function () {
      set(this, 'keyboardFirstResponder', false);
    })
  });
});