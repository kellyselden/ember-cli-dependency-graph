define('code-corps-ember/services/project-user', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    currentUser: service(),
    flashMessages: service(),
    store: service(),

    flashOptions: { fixed: true, sticky: false, timeout: 5000 },

    joinProject: function joinProject(project) {
      var _this = this;

      var user = get(this, 'currentUser.user');
      var store = get(this, 'store');

      var projectUser = { project: project, user: user, role: 'pending' };

      return store.createRecord('project-user', projectUser).save().then(function () {
        return _this._flashSuccess('Your request has been sent.');
      }).catch(function () {
        return _this._flashError('Your request has not been sent.');
      });
    },
    _flashSuccess: function _flashSuccess(message) {
      get(this, 'flashMessages').clearMessages().success(message, get(this, 'flashOptions'));
    },
    _flashError: function _flashError(message) {
      get(this, 'flashMessages').clearMessages().danger(message, get(this, 'flashOptions'));
    }
  });
});