define('travis/controllers/loading', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var Controller = Ember.Controller;
  exports.default = Controller.extend({
    layoutName: computed({
      get: function get() {
        if (this._layoutName) {
          return 'layouts/' + this._layoutName;
        }
      },
      set: function set(key, value) {
        return this._layoutName = value;
      }
    })
  });
});