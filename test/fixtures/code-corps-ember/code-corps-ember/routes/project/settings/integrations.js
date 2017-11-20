define('code-corps-ember/routes/project/settings/integrations', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var Route = Ember.Route;
  var RSVP = Ember.RSVP;
  var setProperties = Ember.setProperties;
  var get = Ember.get;
  exports.default = Route.extend({
    currentUser: service(),

    user: alias('currentUser.user'),

    model: function model() {
      var project = this.modelFor('project');
      var user = get(this, 'currentUser.user');

      return RSVP.hash({ project: project, user: user });
    },
    setupController: function setupController(controller, _ref) {
      var project = _ref.project,
          user = _ref.user;

      setProperties(controller, { project: project, user: user });
    }
  });
});