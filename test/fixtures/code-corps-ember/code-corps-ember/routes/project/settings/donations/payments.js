define('code-corps-ember/routes/project/settings/donations/payments', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  var service = Ember.inject.service;
  exports.default = Route.extend({
    stripe: service(),

    beforeModel: function beforeModel() {
      return this.get('stripe').load();
    },
    model: function model() {
      return this.modelFor('project').reload();
    },
    setupController: function setupController(controller, project) {
      controller.setProperties({ project: project });
    }
  });
});