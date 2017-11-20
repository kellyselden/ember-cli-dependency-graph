define('code-corps-ember/services/onboarding', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var union = Ember.computed.union;
  var or = Ember.computed.or;
  var mapBy = Ember.computed.mapBy;
  var equal = Ember.computed.equal;
  var alias = Ember.computed.alias;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var computed = Ember.computed;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    currentUser: service(),
    routing: service('-routing'),

    _steps: [{
      number: 1,
      state: 'signed_up',
      route: 'start.hello',
      nextRoute: 'start.interests',
      nextStateTransition: 'edit_profile'
    }, {
      number: 2,
      state: 'edited_profile',
      route: 'start.interests',
      nextRoute: 'start.expertise',
      nextStateTransition: 'select_categories'
    }, {
      number: 3,
      state: 'selected_categories',
      route: 'start.expertise',
      nextRoute: 'start.skills',
      nextStateTransition: 'select_roles'
    }, {
      number: 4,
      state: 'selected_roles',
      route: 'start.skills',
      nextRoute: 'projects-list',
      nextStateTransition: 'select_skills'
    }],

    _currentStep: computed('currentUser.user.state', function () {
      var state = get(this, 'currentUser.user.state');
      var steps = get(this, '_steps');
      return steps.find(function (step) {
        return step.state === state;
      });
    }),

    _currentRouteStep: computed('currentRouteName', function () {
      var currentRouteName = get(this, 'currentRouteName');
      var steps = get(this, '_steps');
      return steps.find(function (step) {
        return step.route === currentRouteName;
      });
    }),

    _allowedRoutes: ['privacy', 'project.checkout', 'project.donate', 'project.thank-you', 'terms'],

    allowedRoutes: union('_allowedRoutes', 'onboardingRoutes'),
    currentRouteName: alias('routing.currentRouteName'),
    currentRouteStepNumber: alias('_currentRouteStep.number'),
    currentStepState: alias('_currentStep.state'),
    isOnboarding: or('shouldEditProfile', 'shouldSelectCategories', 'shouldSelectRoles', 'shouldSelectSkills'),
    isViewingOnboarding: computed('currentRouteName', 'onboardingRoutes', function () {
      var _getProperties = getProperties(this, 'currentRouteName', 'onboardingRoutes'),
          currentRouteName = _getProperties.currentRouteName,
          onboardingRoutes = _getProperties.onboardingRoutes;

      return onboardingRoutes.includes(currentRouteName);
    }),
    nextRoute: alias('_currentRouteStep.nextRoute'),
    nextStateTransition: alias('_currentStep.nextStateTransition'),
    onboardingRoutes: mapBy('_steps', 'route'),
    progressPercentage: computed('currentRouteStepNumber', 'totalSteps', function () {
      return get(this, 'currentRouteStepNumber') / get(this, 'totalSteps') * 100;
    }),
    routeForCurrentStep: alias('_currentStep.route'),
    shouldEditProfile: equal('currentStepState', 'signed_up'),
    shouldSelectCategories: equal('currentStepState', 'edited_profile'),
    shouldSelectRoles: equal('currentStepState', 'selected_categories'),
    shouldSelectSkills: equal('currentStepState', 'selected_roles'),
    shouldTransitionUser: computed('currentRouteName', 'routeForCurrentStep', function () {
      var _getProperties2 = getProperties(this, 'currentRouteName', 'routeForCurrentStep'),
          currentRouteName = _getProperties2.currentRouteName,
          routeForCurrentStep = _getProperties2.routeForCurrentStep;

      return currentRouteName === routeForCurrentStep;
    }),
    totalSteps: alias('_steps.length')
  });
});