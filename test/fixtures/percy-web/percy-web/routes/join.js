define('percy-web/routes/join', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    model: function model(params) {
      return this.store.findRecord('invite', params.invite_code);
    },

    actions: {
      inviteAccepted: function inviteAccepted(model) {
        this.transitionTo('organizations.organization.index', model.get('organization.slug'));
      }
    }
  });
});