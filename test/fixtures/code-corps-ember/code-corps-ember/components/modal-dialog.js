define('code-corps-ember/components/modal-dialog', ['exports', 'ember-modal-dialog/components/modal-dialog', 'ember-keyboard'], function (exports, _modalDialog, _emberKeyboard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var on = Ember.on;
  var set = Ember.set;
  exports.default = _modalDialog.default.extend(_emberKeyboard.EKMixin, {
    init: function init() {
      this._super.apply(this, arguments);

      set(this, 'keyboardActivated', true);
    },


    closeOnEsc: on((0, _emberKeyboard.keyDown)('Escape'), function () {
      this.sendAction('close');
    })
  });
});