define('travis/components/landing-default-page', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    actions: {
      signIn: function signIn() {
        return this.get('signIn')();
      },
      signOut: function signOut() {
        return this.get('signOut')();
      }
    }
  });
});