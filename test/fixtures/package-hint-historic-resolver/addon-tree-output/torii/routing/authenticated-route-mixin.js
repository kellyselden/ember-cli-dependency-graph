define('torii/routing/authenticated-route-mixin', ['exports', 'torii/configuration'], function (exports, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.Mixin.create({
    beforeModel: function beforeModel(transition) {
      var route = this;
      var superBefore = this._super.apply(this, arguments);
      if (superBefore && superBefore.then) {
        return superBefore.then(function () {
          return route.authenticate(transition);
        });
      } else {
        return route.authenticate(transition);
      }
    },
    authenticate: function authenticate(transition) {
      var configuration = (0, _configuration.getConfiguration)();
      var route = this,
          session = this.get(configuration.sessionServiceName),
          isAuthenticated = this.get(configuration.sessionServiceName + '.isAuthenticated'),
          hasAttemptedAuth = isAuthenticated !== undefined;

      if (!isAuthenticated) {
        session.attemptedTransition = transition;

        if (hasAttemptedAuth) {
          return route.accessDenied(transition);
        } else {
          return session.fetch().catch(function () {
            return route.accessDenied(transition);
          });
        }
      } else {
        // no-op; cause the user is already authenticated
        return Ember.RSVP.resolve();
      }
    },
    accessDenied: function accessDenied(transition) {
      transition.send('accessDenied', transition);
    }
  });
});