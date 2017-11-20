define('percy-web/components/user-name', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var Component = Ember.Component;
  exports.default = Component.extend({
    user: null,
    classes: null,
    linked: true,

    tagName: 'span',
    classNames: ['UserName'],
    classNameBindings: ['classes'],

    href: computed('user.githubUrl', function () {
      return this.get('user.githubUrl');
    })
  });
});