define('code-corps-ember/components/user-list-item', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: ['user-list-item'],
    tagName: 'li',
    showApprove: false,
    showDeny: false,

    flashMessages: service(),

    actions: {
      approve: function approve(projectUser) {
        var _this = this;

        set(projectUser, 'role', 'contributor');
        return projectUser.save().then(function () {
          _this._flashSuccess('Membership approved');
        });
      },
      deny: function deny(projectUser) {
        var _this2 = this;

        return projectUser.destroyRecord().then(function () {
          _this2._flashSuccess('Membership denied');
        });
      },
      showApprove: function showApprove() {
        set(this, 'showApprove', true);
      },
      showDeny: function showDeny() {
        set(this, 'showDeny', true);
      }
    },

    _flashSuccess: function _flashSuccess(message) {
      var options = { fixed: true, sticky: false, timeout: 5000 };
      get(this, 'flashMessages').clearMessages().success(message, options);
    }
  });
});