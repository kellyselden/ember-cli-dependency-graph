define('travis/components/landing-pro-page', ['exports', 'travis/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    actions: {
      gaCta: function gaCta(location) {
        if (_environment.default.gaCode) {
          _gaq.push(['_trackPageview', '/virtual/signup?' + location]);
        }
        this.auth.signIn();
      },
      signIn: function signIn() {
        return this.get('signIn')();
      },
      signOut: function signOut() {
        return this.get('signOut')();
      }
    }
  });
});