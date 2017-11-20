define('code-corps-ember/components/power-select/before-task-options', ['exports', 'ember-power-select/components/power-select/before-options', 'ember-keyboard'], function (exports, _beforeOptions, _emberKeyboard) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var set = Ember.set;
  var on = Ember.on;
  exports.default = _beforeOptions.default.extend(_emberKeyboard.EKMixin, {
    init: function init() {
      this._super.apply(this, arguments);

      set(this, 'keyboardActivated', true);
    },


    keydown: on((0, _emberKeyboard.keyDown)(), function (event, ekEvent) {
      ekEvent.stopPropagation();
      ekEvent.stopImmediatePropagation();
      // Send the action ember-power-select expects
      this.sendAction('onKeydown', event);
    }),

    actions: {
      close: function close() {
        get(this, 'selectRemoteController').actions.close();
      }
    }
  });
});