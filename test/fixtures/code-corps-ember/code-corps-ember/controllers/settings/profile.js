define('code-corps-ember/controllers/settings/profile', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Controller = Ember.Controller;
  var get = Ember.get;
  var service = Ember.inject.service;
  exports.default = Controller.extend({
    userSkillsList: service(),

    user: alias('model'),
    userSkills: alias('user.userSkills'),

    removeUserSkill: function removeUserSkill(userSkill) {
      return userSkill.destroyRecord();
    },
    toggleSkill: function toggleSkill(skill) {
      var list = get(this, 'userSkillsList');
      return list.toggle(skill);
    }
  });
});