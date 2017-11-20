define('travis/mixins/scroll-reset', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin;
  exports.default = Mixin.create({
    beforeModel: function beforeModel() {
      window.scrollTo(0, 0);
      return this._super.apply(this, arguments);
    }
  });
});