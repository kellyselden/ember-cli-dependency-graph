define('percy-web/components/mock-approval-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    isApproved: false,
    isButtonHovered: false,
    isButtonActive: false,

    tagName: 'button',
    classNames: ['MockApprovalButton', 'ApprovalButton', 'Button', 'Button--withLeftIcon'],
    classNameBindings: ['classes', 'isApproved:ApprovalButton--approved',
    // Custom hover/active classes for animation.
    'isButtonHovered:ApprovalButton--hover', 'isButtonActive:ApprovalButton--active'],
    click: function click() {
      this.set('isApproved', !this.get('isApproved'));
    }
  });
});