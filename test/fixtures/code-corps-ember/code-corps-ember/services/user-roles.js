define('code-corps-ember/services/user-roles', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var empty = Ember.computed.empty;
  var alias = Ember.computed.alias;
  var computed = Ember.computed;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    currentUser: service(),
    store: service(),

    isEmpty: empty('userRoles'),
    user: alias('currentUser.user'),

    userRoles: computed('user.userRoles', 'user.userRoles.@each.role', 'user.userRoles.@each.user', function () {
      return this.get('user.userRoles');
    }),

    addRole: function addRole(role) {
      var user = this.get('user');
      var userRole = this.get('store').createRecord('user-role', {
        user: user,
        role: role
      });
      return userRole.save();
    },
    findUserRole: function findUserRole(role) {
      var _this = this;

      var userRoles = this.get('userRoles');
      var userRole = userRoles.find(function (item) {
        var itemUserId = item.belongsTo('user').id();
        var itemRoleId = item.belongsTo('role').id();
        var userId = _this.get('user.id');
        var roleId = role.get('id');
        return itemUserId === userId && itemRoleId === roleId;
      });
      return userRole;
    },
    removeRole: function removeRole(role) {
      var userRole = this.findUserRole(role);
      return userRole.destroyRecord();
    }
  });
});