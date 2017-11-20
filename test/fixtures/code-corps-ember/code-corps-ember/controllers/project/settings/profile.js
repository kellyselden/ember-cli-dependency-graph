define('code-corps-ember/controllers/project/settings/profile', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Controller = Ember.Controller;
  var get = Ember.get;
  var service = Ember.inject.service;
  exports.default = Controller.extend({
    projectSkillsList: service(),

    project: alias('model'),
    projectSkills: alias('project.projectSkills'),

    removeProjectSkill: function removeProjectSkill(projectSkill) {
      return projectSkill.destroyRecord();
    },
    toggleSkill: function toggleSkill(skill) {
      var list = get(this, 'projectSkillsList');
      return list.toggle(skill);
    }
  });
});