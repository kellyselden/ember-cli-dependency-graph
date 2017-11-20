define('travis/components/repo-not-found', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    actions: {
      signIn: function signIn() {
        this.get('signIn')();
      }
    }
  });
});