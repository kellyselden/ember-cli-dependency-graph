define('code-corps-ember/components/project-card', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var mapBy = Ember.computed.mapBy;
  var get = Ember.get;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['project-card'],

    currentUser: service(),
    session: service(),

    // TODO: Similar code is defined in
    // - `abilities/project.js`
    // - `abilities/task.js`
    currentProjectMembership: computed('project.projectUsers', 'currentUser.user.id', function () {
      var projectUsers = get(this, 'project.projectUsers');
      var currentUserId = get(this, 'currentUser.user.id');

      return projectUsers.find(function (item) {
        return get(item, 'user.id') === currentUserId;
      });
    }),

    projectCategories: mapBy('project.projectCategories', 'category'),
    projectSkills: mapBy('project.projectSkills', 'skill'),
    projectUsers: mapBy('project.projectUsers', 'user')
  });
});