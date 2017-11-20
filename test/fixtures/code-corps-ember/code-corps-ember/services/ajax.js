define('code-corps-ember/services/ajax', ['exports', 'ember-ajax/services/ajax', 'code-corps-ember/config/environment'], function (exports, _ajax, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _get = Ember.get;
  var computed = Ember.computed;
  var service = Ember.inject.service;
  exports.default = _ajax.default.extend({
    host: _environment.default.API_BASE_URL,

    session: service(),

    headers: computed('session.session.authenticated.token', {
      get: function get() {
        var headers = {};
        var token = _get(this, 'session.session.authenticated.token');
        if (token) {
          headers['Authorization'] = 'Bearer ' + token; // eslint-disable-line dot-notation
        }
        return headers;
      }
    })
  });
});