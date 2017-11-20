define('code-corps-ember/services/current-user', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isEmpty = Ember.isEmpty;
  var RSVP = Ember.RSVP;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Service.extend({
    metrics: service(),
    session: service(),
    store: service(),

    loadCurrentUser: function loadCurrentUser() {
      var _this = this;

      return new RSVP.Promise(function (resolve, reject) {
        var userId = get(_this, 'session.session.authenticated.user_id');
        if (!isEmpty(userId)) {
          return get(_this, 'store').findRecord('user', userId).then(function (user) {
            set(_this, 'user', user);
            _this._identifyUser(user);
            resolve(user);
          }, reject);
        } else {
          resolve(null);
        }
      });
    },
    _identifyUser: function _identifyUser(user) {
      // Segment
      get(this, 'metrics').identify({
        distinctId: get(user, 'id'),
        segmentContext: {
          Intercom: {
            user_hash: get(user, 'intercomUserHash')
          }
        },
        biography: get(user, 'biography'),
        insertedAt: get(user, 'insertedAt'),
        email: get(user, 'email'),
        name: get(user, 'name'),
        state: get(user, 'state'),
        username: get(user, 'username'),
        website: get(user, 'website')
      });
    }
  });
});