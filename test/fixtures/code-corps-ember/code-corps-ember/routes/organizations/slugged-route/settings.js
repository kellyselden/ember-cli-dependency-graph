define('code-corps-ember/routes/organizations/slugged-route/settings', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'ember-can'], function (exports, _authenticatedRouteMixin, _emberCan) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  var service = Ember.inject.service;
  exports.default = Route.extend(_authenticatedRouteMixin.default, _emberCan.CanMixin, {
    session: service(),

    beforeModel: function beforeModel() {
      var organization = this.modelFor('organizations.slugged-route');
      if (this.cannot('manage organization', organization)) {
        return this.transitionTo('index');
      }
    }
  });
});