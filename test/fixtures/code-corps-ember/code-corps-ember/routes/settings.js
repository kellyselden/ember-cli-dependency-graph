define('code-corps-ember/routes/settings', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  var service = Ember.inject.service;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    currentUser: service(),

    model: function model() {
      var userId = this.get('currentUser.user.id');
      return this.store.find('user', userId);
    }
  });
});