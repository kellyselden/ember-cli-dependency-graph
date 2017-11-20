define('code-corps-ember/components/github/pull-request-icon', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var alias = Ember.computed.alias;
  exports.default = Component.extend({
    classNames: ['github__pull-request-icon'],

    merged: alias('githubPullRequest.merged'),
    state: alias('githubPullRequest.state')
  });
});