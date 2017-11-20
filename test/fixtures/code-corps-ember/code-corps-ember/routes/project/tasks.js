define('code-corps-ember/routes/project/tasks', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  exports.default = Route.extend({
    model: function model() {
      return this.modelFor('project').reload();
    },
    renderTemplate: function renderTemplate() {
      this.render('project/tasks', { into: 'application' });
    }
  });
});