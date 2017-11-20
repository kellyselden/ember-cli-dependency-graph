define('code-corps-ember/controllers/project/index', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Controller = Ember.Controller;
  var mapBy = Ember.computed.mapBy;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  exports.default = Controller.extend({
    currentUser: service(),

    projectUsers: mapBy('project.projectUsers', 'user'),
    usersCount: alias('users.length'),
    projectSkills: mapBy('project.projectSkills', 'skill')
  });
});