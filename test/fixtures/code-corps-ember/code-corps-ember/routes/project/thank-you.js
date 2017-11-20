define('code-corps-ember/routes/project/thank-you', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin'], function (exports, _authenticatedRouteMixin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    model: function model() {
      return this.modelFor('project').reload();
    },
    renderTemplate: function renderTemplate() {
      this.render('project/thank-you', { into: 'application' });
    }
  });
});