define('code-corps-ember/components/github-connect-state', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var computed = Ember.computed;
  exports.default = Component.extend({
    classNames: ['github-connect-state'],

    redirectUri: null,

    githubAvatarUrlResized: computed('githubAvatarUrl', function () {
      return get(this, 'githubAvatarUrl') + '&size=100';
    })
  });
});