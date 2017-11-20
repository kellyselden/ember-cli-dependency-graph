define('code-corps-ember/components/role-item', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var notEmpty = Ember.computed.notEmpty;
  var service = Ember.inject.service;
  var set = Ember.set;
  var getProperties = Ember.getProperties;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['role-item'],
    classNameBindings: ['selected'],
    isLoading: false,

    flashMessages: service(),
    userRoles: service(),

    selected: notEmpty('userRole'),

    userRole: computed('role', 'userRoles.userRoles', function () {
      var _getProperties = getProperties(this, 'role', 'userRoles'),
          role = _getProperties.role,
          userRoles = _getProperties.userRoles;

      return userRoles.findUserRole(role);
    }),

    actions: {
      addRole: function addRole(role) {
        var _this = this;

        set(this, 'isLoading', true);
        var userRoles = get(this, 'userRoles');
        return userRoles.addRole(role).catch(function () {
          var message = 'An error occurred trying to add ' + get(role, 'name') + '.';
          _this._flashError(message);
        }).finally(function () {
          set(_this, 'isLoading', false);
        });
      },
      removeRole: function removeRole(role) {
        var _this2 = this;

        set(this, 'isLoading', true);
        var userRoles = get(this, 'userRoles');
        return userRoles.removeRole(role).catch(function () {
          var message = 'An error occurred trying to remove ' + get(role, 'name') + '.';
          _this2._flashError(message);
        }).finally(function () {
          set(_this2, 'isLoading', false);
        });
      }
    },

    _flashError: function _flashError(message) {
      var options = { fixed: true, sticky: false, timeout: 5000 };
      get(this, 'flashMessages').clearMessages().danger(message, options);
    }
  });
});