define('percy-web/routes/login', ['exports', 'ember-simple-auth/mixins/unauthenticated-route-mixin', 'percy-web/mixins/ensure-stateful-login'], function (exports, _unauthenticatedRouteMixin, _ensureStatefulLogin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Route = Ember.Route;
  exports.default = Route.extend(_unauthenticatedRouteMixin.default, _ensureStatefulLogin.default, {
    session: service(),
    afterModel: function afterModel() {
      this.showLoginModalEnsuringState();
    }
  });
});