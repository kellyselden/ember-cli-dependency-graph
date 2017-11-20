define('code-corps-ember/routes/password/reset', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  var set = Ember.set;
  var get = Ember.get;
  var service = Ember.inject.service;
  exports.default = Route.extend({
    queryParams: {
      token: { refreshModel: true }
    },

    ajax: service(),
    session: service(),

    model: function model(params) {
      return params.token;
    },
    setupController: function setupController(controller, model) {
      set(controller, 'token', model);
    },


    actions: {
      resetPassword: function resetPassword(password, passwordConfirmation) {
        var _this = this;

        return get(this, 'ajax').request('/password/reset', {
          method: 'POST',
          data: {
            token: get(this, 'controller.token'),
            password: password,
            'password-confirmation': passwordConfirmation
          }
        }).then(function (response) {
          return get(_this, 'session').authenticate('authenticator:jwt', { identification: response.email, password: password });
        });
      }
    }
  });
});