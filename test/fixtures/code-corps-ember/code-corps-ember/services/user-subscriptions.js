define('code-corps-ember/services/user-subscriptions', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var get = Ember.get;
  var RSVP = Ember.RSVP;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    currentUser: service(),

    user: alias('currentUser.user'),

    fetchForProject: function fetchForProject(project) {
      var user = get(this, 'user');

      if (user) {
        return get(user, 'stripeConnectSubscriptions').then(function (subscriptions) {
          var subscription = subscriptions.find(function (subscription) {
            return subscription.belongsTo('project').id() === project.id;
          });
          return RSVP.resolve(subscription);
        });
      } else {
        return null;
      }
    }
  });
});