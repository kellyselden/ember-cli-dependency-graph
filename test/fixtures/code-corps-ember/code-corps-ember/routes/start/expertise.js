define('code-corps-ember/routes/start/expertise', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  var service = Ember.inject.service;
  exports.default = Route.extend({
    currentUser: service(),

    beforeModel: function beforeModel() {
      this._super.apply(this, arguments);
      var user = this.get('currentUser.user');
      return user.get('user-role');
    },
    model: function model() {
      return this.store.findAll('role');
    }
  });
});