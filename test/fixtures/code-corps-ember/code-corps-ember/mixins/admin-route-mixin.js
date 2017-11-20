define('code-corps-ember/mixins/admin-route-mixin', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Mixin = Ember.Mixin;
  var get = Ember.get;
  var set = Ember.set;
  var service = Ember.inject.service;


  var NOT_AN_ADMIN = "You're not authorized to view this page.";

  exports.default = Mixin.create({
    currentUser: service(),
    flashMessages: service(),
    session: service(),

    beforeModel: function beforeModel(transition) {
      var session = get(this, 'session');
      var isAuthenticated = get(session, 'isAuthenticated');
      var isAdmin = get(this, 'currentUser.user.admin');

      if (isAuthenticated && isAdmin) {
        return this._super.apply(this, arguments);
      } else {
        set(session, 'attemptedTransition', transition);
        get(this, 'flashMessages').danger(NOT_AN_ADMIN);
        return this.transitionTo('login');
      }
    }
  });
});