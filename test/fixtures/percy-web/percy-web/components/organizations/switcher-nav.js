define('percy-web/components/organizations/switcher-nav', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classes: null,

    isExpanded: false,

    session: service(),
    currentUser: alias('session.currentUser'),

    classNames: ['OrganizationsSwitcherNav'],
    classNameBindings: ['classes'],

    actions: {
      toggleSwitcher: function toggleSwitcher() {
        this.get('currentUser.organizations').reload();
        this.toggleProperty('isExpanded');
      },
      hideSwitcher: function hideSwitcher() {
        this.set('isExpanded', false);
      }
    }
  });
});