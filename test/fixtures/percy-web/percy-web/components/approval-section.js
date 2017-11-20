define('percy-web/components/approval-section', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Component = Ember.Component;
  exports.default = Component.extend({
    build: null,

    approvedNow: false,
    classNames: ['ApprovalSection'],
    isApproved: alias('build.isApproved'),
    classNameBindings: ['classes', 'isApproved:ApprovalSection--approved', 'approvedNow:ApprovalSection--approvedNow'],

    actions: {
      approve: function approve() {
        this.set('approvedNow', true);
      }
    }
  });
});