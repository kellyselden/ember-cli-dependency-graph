define('code-corps-ember/routes/admin', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'code-corps-ember/mixins/admin-route-mixin'], function (exports, _authenticatedRouteMixin, _adminRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, _adminRouteMixin.default, {});
});