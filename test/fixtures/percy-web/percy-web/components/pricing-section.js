define('percy-web/components/pricing-section', ['exports', 'percy-web/lib/utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    classNames: ['PricingSection'],
    classNameBindings: ['classes'],

    showJumpToBilling: false,
    session: service(),
    subscriptionData: service(),
    actions: {
      jumpToBilling: function jumpToBilling() {
        window.scrollTo(0, 0);
        this.set('showJumpToBilling', true);
      },
      hideModal: function hideModal() {
        this.set('showJumpToBilling', false);
      },
      login: function login() {
        _utils.default.redirectToLogin({ redirectTo: '/organizations/new' });
      },
      showSupport: function showSupport() {
        this.sendAction('showSupport');
      }
    }
  });
});