define('ember-link-action/mixins/link-action', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin;
  exports.default = Mixin.create({
    init: function init() {
      this._super.apply(this, arguments);

      if (this.get('invokeAction')) {
        this._attachActionEvent();
      }
    },
    willDestroyElement: function willDestroyElement() {
      if (this.get('invokeAction')) {
        this._detachActionEvent();
      }
    },
    _sendInvokeAction: function _sendInvokeAction() {
      this.sendAction('invokeAction');
    },
    _attachActionEvent: function _attachActionEvent() {
      this.on(this.get('eventName'), this, this._sendInvokeAction);
    },
    _detachActionEvent: function _detachActionEvent() {
      this.off(this.get('eventName'), this, this._sendInvokeAction);
    }
  });
});