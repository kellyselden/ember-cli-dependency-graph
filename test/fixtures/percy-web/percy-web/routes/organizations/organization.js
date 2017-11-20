define('percy-web/routes/organizations/organization', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var alias = Ember.computed.alias;
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    intercom: service(),
    session: service(),
    currentUser: alias('session.currentUser'),

    afterModel: function afterModel(model) {
      this.get('intercom').associateWithCompany(this.get('currentUser'), model);

      // Proactively load the currentUserMembership object and return to block rendering until it
      // exists, since we use it to determine what parts of the organization settings the current
      // user has permission to access. Loading it now prevents flickering.
      //
      // Note: we have to use the underlying _filteredOrganizationUsers because it is a promise,
      // whereas currentUserMembership is just an alias to .firstObject.
      return model.get('_filteredOrganizationUsers');
    },

    actions: {}
  });
});