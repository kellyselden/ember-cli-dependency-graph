define('code-corps-ember/routes/project/donate', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var service = Ember.inject.service;
  var Route = Ember.Route;
  var RSVP = Ember.RSVP;


  var ALREADY_A_SUBSCRIBER = "You're already supporting this project.";

  exports.default = Route.extend({
    flashMessages: service(),
    session: service(),
    userSubscriptions: service(),

    model: function model() {
      var _this = this;

      return this.modelFor('project').reload().then(function (project) {
        var subscription = get(_this, 'userSubscriptions').fetchForProject(project);
        return RSVP.hash({ project: project, subscription: subscription });
      });
    },
    afterModel: function afterModel(_ref) {
      var project = _ref.project,
          subscription = _ref.subscription;

      if (subscription) {
        get(this, 'flashMessages').success(ALREADY_A_SUBSCRIBER);
        this.transitionTo('project', project);
      } else {
        this._super.apply(this, arguments);
      }
    },
    setupController: function setupController(controller, models) {
      controller.setProperties(models);
    },
    renderTemplate: function renderTemplate() {
      this.render('project/donate', { into: 'application' });
    }
  });
});