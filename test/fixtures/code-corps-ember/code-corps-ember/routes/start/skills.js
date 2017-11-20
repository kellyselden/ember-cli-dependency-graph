define('code-corps-ember/routes/start/skills', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var service = Ember.inject.service;
  var Route = Ember.Route;
  exports.default = Route.extend({
    currentUser: service(),
    store: service(),
    userSkillsList: service(),

    model: function model() {
      return get(this, 'currentUser.user');
    }
  });
});