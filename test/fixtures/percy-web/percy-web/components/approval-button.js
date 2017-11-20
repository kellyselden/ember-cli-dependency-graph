define('percy-web/components/approval-button', ['exports', 'percy-web/lib/utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  exports.default = Component.extend({
    build: null,
    approve: null,

    isApproved: alias('build.isApproved'),
    tagName: 'button',
    classNames: ['ApprovalButton', 'Button', 'Button--withLeftIcon'],
    classNameBindings: ['classes', 'isApproved:ApprovalButton--approved'],
    click: function click() {
      this.send('buildApproved');
    },

    actions: {
      buildApproved: function buildApproved() {
        var _this = this;

        $.ajax({
          type: 'POST',
          url: _utils.default.buildApiUrl('approveBuild', this.get('build.id'))
        }).then(function () {
          _this.get('build').reloadAll();
        }, function () {
          _this.get('build').reloadAll();
        });

        this.get('approve')();
      }
    }
  });
});