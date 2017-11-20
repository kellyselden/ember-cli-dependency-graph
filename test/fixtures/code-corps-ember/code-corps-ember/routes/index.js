define('code-corps-ember/routes/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var service = Ember.inject.service;
  var Route = Ember.Route;
  exports.default = Route.extend({
    session: service(),

    beforeModel: function beforeModel() {
      if (get(this, 'session.isAuthenticated')) {
        this.transitionTo('projects-list');
      }
    }
  });
});