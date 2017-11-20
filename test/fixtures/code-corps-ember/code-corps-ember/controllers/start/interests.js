define('code-corps-ember/controllers/start/interests', ['exports', 'code-corps-ember/mixins/onboarding-controller'], function (exports, _onboardingController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Controller = Ember.Controller;
  var service = Ember.inject.service;
  exports.default = Controller.extend(_onboardingController.default, {
    userCategories: service()
  });
});