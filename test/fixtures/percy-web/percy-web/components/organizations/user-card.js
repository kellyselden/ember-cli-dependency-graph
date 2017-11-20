define('percy-web/components/organizations/user-card', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    organizationUser: null,
    classes: null,

    session: service(),
    currentUser: alias('session.currentUser'),

    isExpanded: false,
    classNames: ['OrganizationsUserCard'],
    classNameBindings: ['classes', 'isExpanded:OrganizationsUserCard--expanded'],
    actions: {
      toggleExpanded: function toggleExpanded() {
        this.toggleProperty('isExpanded');
      }
    }
  });
});