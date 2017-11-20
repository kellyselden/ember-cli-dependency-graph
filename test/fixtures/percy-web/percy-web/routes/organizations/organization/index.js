define('percy-web/routes/organizations/organization/index', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    redirect: function redirect(model) {
      this.transitionTo('organization.index', model.get('slug'));
    }
  });
});