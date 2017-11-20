define('code-corps-ember/controllers/start/skills', ['exports', 'code-corps-ember/mixins/onboarding-controller'], function (exports, _onboardingController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Controller = Ember.Controller;
  var get = Ember.get;
  var service = Ember.inject.service;
  exports.default = Controller.extend(_onboardingController.default, {
    currentUser: service(),
    store: service(),
    userSkillsList: service(),

    user: alias('model'),
    userSkills: alias('user.userSkills'),

    removeUserSkill: function removeUserSkill(userSkill) {
      return userSkill.destroyRecord();
    },
    selectSkill: function selectSkill(skill) {
      return get(this, 'userSkillsList').toggle(skill);
    }
  });
});