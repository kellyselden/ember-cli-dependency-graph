define('code-corps-ember/components/submittable-textarea', ['exports', 'ember-keyboard'], function (exports, _emberKeyboard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var TextArea = Ember.TextArea;
  var on = Ember.on;
  exports.default = TextArea.extend(_emberKeyboard.EKMixin, _emberKeyboard.EKOnFocusMixin, {
    init: function init() {
      this._super.apply(this, arguments);
      this.set('keyboardActivated', true);
    },


    customSubmit: on((0, _emberKeyboard.keyDown)('Enter+cmd'), function (e) {
      e.preventDefault();
      this.sendAction('modifiedSubmit');
    })
  });
});