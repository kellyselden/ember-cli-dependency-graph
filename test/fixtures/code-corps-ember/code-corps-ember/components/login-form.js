define('code-corps-ember/components/login-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: ['form--centered', 'login-form'],

    /**
      @property session
      @type Ember.Service
     */
    session: service(),

    isLoading: false,

    actions: {

      /**
        Action that calls the `session.authenticate` method to authenticate the
        user.
         @method authenticate
       */
      authenticate: function authenticate() {
        var _this = this;

        set(this, 'isLoading', true);

        var credentials = this.getProperties('identification', 'password');

        get(this, 'session').authenticate('authenticator:jwt', credentials).catch(function (reason) {
          set(_this, 'isLoading', false);
          if (reason) {
            set(_this, 'errors', reason.error || reason);
          }
        });
      }
    }
  });
});