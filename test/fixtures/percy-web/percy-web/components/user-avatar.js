define('percy-web/components/user-avatar', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var readOnly = Ember.computed.readOnly;
  var Component = Ember.Component;
  exports.default = Component.extend({
    user: null,
    classes: null,
    linked: false,
    href: readOnly('user.githubUrl'),
    width: 40,
    height: readOnly('width'),

    classNames: ['UserAvatar'],
    classNameBindings: ['classes']
  });
});