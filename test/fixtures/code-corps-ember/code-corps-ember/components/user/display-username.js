define('code-corps-ember/components/user/display-username', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    tagName: 'span',
    classNames: ['user__display-username'],

    user: null,

    githubUsername: alias('user.githubUsername'),
    username: alias('user.username'),

    githubUserUrl: computed('githubUsername', function () {
      return 'https://www.github.com/' + get(this, 'githubUsername');
    })
  });
});