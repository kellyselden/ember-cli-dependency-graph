define('code-corps-ember/routes/projects-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend({
    model: function model() {
      return this.store.findAll('project');
    },
    setupController: function setupController(controller, model) {
      controller.set('projects', model);
    }
  });
});