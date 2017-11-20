define('code-corps-ember/controllers/application', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var not = Ember.computed.not;
  var alias = Ember.computed.alias;
  var and = Ember.computed.and;
  var Controller = Ember.Controller;
  var get = Ember.get;
  var service = Ember.inject.service;
  exports.default = Controller.extend({
    codeTheme: service(),
    onboarding: service(),
    projectTaskBoard: service(),
    session: service(),

    isNotOnboarding: not('isOnboarding'),
    isNotViewingProjectTaskBoard: not('isViewingProjectTaskBoard'),
    isOnboarding: alias('onboarding.isOnboarding'),
    isViewingProjectTaskBoard: alias('projectTaskBoard.isViewing'),

    shouldShowFooter: and('isNotOnboarding', 'isNotViewingProjectTaskBoard'),
    shouldShowSpacer: alias('isNotViewingProjectTaskBoard'),

    actions: {
      invalidateSession: function invalidateSession() {
        get(this, 'session').invalidate();
      }
    }
  });
});