define('code-corps-ember/routes/signup', ['exports', 'ember-simple-auth/mixins/unauthenticated-route-mixin', 'code-corps-ember/utils/error-utils'], function (exports, _unauthenticatedRouteMixin, _errorUtils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Route.extend(_unauthenticatedRouteMixin.default, {
    queryParams: { context: 'default' },

    session: service(),

    /**
     * Model hook initializes and returns a new user record
     *
     * We can pass a context of the signup, e.g. `'donating'`
     */
    model: function model(_ref) {
      var context = _ref.context;

      var user = context ? { signUpContext: context } : {};
      return get(this, 'store').createRecord('user', user);
    },
    resetController: function resetController(controller, isExiting) {
      if (isExiting) {
        controller.set('context', 'default');
      }
    },


    actions: {
      signIn: function signIn(credentials) {
        get(this, 'session').authenticate('authenticator:jwt', credentials);
      },
      handleErrors: function handleErrors(payload) {
        if ((0, _errorUtils.isNonValidationError)(payload)) {
          set(this, 'controller.signup.error', payload);
        }
      }
    }
  });
});