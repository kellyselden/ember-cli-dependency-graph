define('ember-keyboard/initializers/ember-keyboard-first-responder-inputs', ['exports', 'ember-keyboard'], function (exports, _emberKeyboard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  var TextArea = Ember.TextArea;
  var TextField = Ember.TextField;
  function initialize() {
    TextField.reopen(_emberKeyboard.EKMixin, _emberKeyboard.EKFirstResponderOnFocusMixin);
    TextArea.reopen(_emberKeyboard.EKMixin, _emberKeyboard.EKFirstResponderOnFocusMixin);
  }

  exports.default = {
    name: 'ember-keyboard-first-responder-inputs',
    initialize: initialize
  };
});