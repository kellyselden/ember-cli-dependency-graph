define('percy-web/components/goto-app', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    session: service(),

    classNames: ['ReposLink'],
    classNameBindings: ['classes'],
    actions: {
      redirectToDefaultOrganization: function redirectToDefaultOrganization() {
        this.sendAction('redirectToDefaultOrganization');
      }
    }
  });
});