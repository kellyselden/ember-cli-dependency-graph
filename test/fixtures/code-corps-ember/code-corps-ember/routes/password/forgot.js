define('code-corps-ember/routes/password/forgot', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  var get = Ember.get;
  var service = Ember.inject.service;
  exports.default = Route.extend({

    ajax: service(),

    actions: {
      forgotPassword: function forgotPassword(email) {
        var _this = this;

        return get(this, 'ajax').request('/password/forgot', {
          method: 'POST',
          data: {
            email: email
          }
        }).then(function () {
          _this.transitionTo('index');
        });
      }
    }
  });
});