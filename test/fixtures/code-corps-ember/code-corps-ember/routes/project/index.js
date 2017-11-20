define('code-corps-ember/routes/project/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Route = Ember.Route;
  var RSVP = Ember.RSVP;
  exports.default = Route.extend({
    userSubscriptions: service(),

    model: function model() {
      var _this = this;

      return this.modelFor('project').reload().then(function (project) {
        var subscription = _this.get('userSubscriptions').fetchForProject(project);
        return RSVP.hash({ project: project, subscription: subscription });
      });
    },
    setupController: function setupController(controller, _ref) {
      var project = _ref.project,
          subscription = _ref.subscription;

      controller.setProperties({ project: project, subscription: subscription });
    }
  });
});