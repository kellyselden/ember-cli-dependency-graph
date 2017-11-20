define('code-corps-ember/mixins/onboarding-controller', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var Mixin = Ember.Mixin;
  var set = Ember.set;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  exports.default = Mixin.create({
    currentUser: service(),
    onboarding: service(),

    user: alias('currentUser.user'),

    actions: {
      continue: function _continue() {
        var _getProperties = getProperties(this, 'onboarding', 'user'),
            onboarding = _getProperties.onboarding,
            user = _getProperties.user;

        var _getProperties2 = getProperties(onboarding, 'nextStateTransition', 'shouldTransitionUser'),
            nextStateTransition = _getProperties2.nextStateTransition,
            shouldTransitionUser = _getProperties2.shouldTransitionUser;

        // We can transition routes without transitioning the user's state


        if (shouldTransitionUser) {
          set(user, 'stateTransition', nextStateTransition);
        }

        this._transitionToNextRoute();
      },
      skip: function skip() {
        var _getProperties3 = getProperties(this, 'onboarding', 'user'),
            onboarding = _getProperties3.onboarding,
            user = _getProperties3.user;

        var _getProperties4 = getProperties(onboarding, 'skipStateTransition', 'shouldTransitionUser'),
            skipStateTransition = _getProperties4.skipStateTransition,
            shouldTransitionUser = _getProperties4.shouldTransitionUser;

        // We can transition routes without transitioning the user's state


        if (shouldTransitionUser) {
          set(user, 'stateTransition', skipStateTransition);
        }

        this._transitionToNextRoute();
      }
    },

    _transitionToNextRoute: function _transitionToNextRoute() {
      var _this = this;

      var _getProperties5 = getProperties(this, 'onboarding', 'user'),
          onboarding = _getProperties5.onboarding,
          user = _getProperties5.user;

      user.save().then(function () {
        _this.transitionToRoute(get(onboarding, 'nextRoute'));
      });
    }
  });
});