define('percy-web/routes/organization', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'percy-web/lib/localstorage'], function (exports, _authenticatedRouteMixin, _localstorage) {
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
      try {
        _localstorage.default.set('lastOrganizationSlug', model.get('slug'));
      } catch (_) {
        // Safari throws errors while accessing localStorage in private mode.
      }

      this.get('intercom').associateWithCompany(this.get('currentUser'), model);
    }
  });
});