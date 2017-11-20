define('percy-web/components/organizations/jump-to-billing', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var getOwner = Ember.getOwner;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classes: null,

    classNames: ['OrganizationsJumpToBilling'],
    classNameBindings: ['classes'],

    session: service(),
    currentUser: alias('session.currentUser'),

    actions: {
      chooseOrganization: function chooseOrganization(organization) {
        // Send action directly up to application controller, so we don't have to delegate every
        // time in the template.
        var applicationController = getOwner(this).lookup('controller:application');
        applicationController.send('navigateToOrganizationBilling', organization);
      },
      hide: function hide() {
        this.get('hide')();
      }
    }
  });
});