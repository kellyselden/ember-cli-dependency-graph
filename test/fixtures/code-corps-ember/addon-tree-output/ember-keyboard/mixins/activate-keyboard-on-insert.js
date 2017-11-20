define('ember-keyboard/mixins/activate-keyboard-on-insert', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin;
  var on = Ember.on;
  var set = Ember.set;
  exports.default = Mixin.create({
    activateKeyboardWhenPresent: on('didInsertElement', function () {
      set(this, 'keyboardActivated', true);
    })
  });
});