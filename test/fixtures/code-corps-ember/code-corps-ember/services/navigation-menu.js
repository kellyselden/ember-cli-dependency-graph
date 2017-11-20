define('code-corps-ember/services/navigation-menu', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var equal = Ember.computed.equal;
  var alias = Ember.computed.alias;
  var get = Ember.get;
  var computed = Ember.computed;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    currentUser: service(),
    onboarding: service(),
    routing: service('-routing'),

    currentRouteName: alias('routing.currentRouteName'),

    hasDonated: computed('user', function () {
      var user = get(this, 'user');
      return user.hasMany('stripeConnectSubscriptions').value() !== null;
    }),

    isDefault: equal('menuType', 'default'),
    isOnboarding: equal('menuType', 'onboarding'),
    isViewingOnboarding: alias('onboarding.isViewingOnboarding'),

    menuType: computed('onboarding.isOnboarding', 'isViewingOnboarding', function () {
      var isOnboarding = get(this, 'onboarding.isOnboarding');
      var isViewingOnboarding = get(this, 'isViewingOnboarding');
      if (isOnboarding || isViewingOnboarding) {
        return 'onboarding';
      } else {
        return 'default';
      }
    }),

    user: alias('currentUser.user')
  });
});