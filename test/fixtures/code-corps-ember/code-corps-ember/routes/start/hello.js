define('code-corps-ember/routes/start/hello', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  var service = Ember.inject.service;
  exports.default = Route.extend({
    currentUser: service(),

    model: function model() {
      return this.get('currentUser.user');
    }
  });
});