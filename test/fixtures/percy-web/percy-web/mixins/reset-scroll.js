define('percy-web/mixins/reset-scroll', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin;


  var ResetScrollMixin = Mixin.create({
    actions: {
      didTransition: function didTransition() {
        window.scrollTo(0, 0);
      }
    }
  });

  exports.default = ResetScrollMixin;
});