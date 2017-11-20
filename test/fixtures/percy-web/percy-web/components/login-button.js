define('percy-web/components/login-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classes: null,
    text: 'Sign in with GitHub',

    showIcon: true,
    tagName: 'a',
    classNames: ['LoginButton', 'Button', 'Button--primary', 'Button--onDark'],
    classNameBindings: ['classes', 'showIcon:Button--withLeftIcon'],
    attributeBindings: ['href'],
    click: function click() {
      this.send('login');
    },

    actions: {
      login: function login() {
        this.sendAction('showLoginModal');
      }
    }
  });
});