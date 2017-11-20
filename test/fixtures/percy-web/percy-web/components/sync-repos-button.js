define('percy-web/components/sync-repos-button', ['exports', 'percy-web/lib/utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    classes: null,
    redirectTo: null,

    tagName: 'a',
    href: _utils.default.buildApiUrl('login', { params: { extended_permissions: 1 } }),
    classNames: ['LoginExtendedButton', 'Button', 'Button--withLeftIcon', 'hint--top', 'hint--rounded', 'hint--centered'],
    classNameBindings: ['classes'],
    click: function click() {
      this.send('login');
    },

    actions: {
      login: function login() {
        var options = { extendedPermissions: 1 };
        if (this.get('redirectTo')) {
          options['redirectTo'] = this.get('redirectTo');
        }
        _utils.default.redirectToLogin(options);
      }
    }
  });
});