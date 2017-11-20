define('code-corps-ember/components/task-new-form', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var alias = Ember.computed.alias;
  var and = Ember.computed.and;
  var empty = Ember.computed.empty;
  var notEmpty = Ember.computed.notEmpty;
  exports.default = Component.extend({
    classNames: ['task-new-form'],
    tagName: 'form',

    currentUser: service(),

    githubRepos: null,

    hasGithubRepos: notEmpty('githubRepos'),
    showGithubConnectCallout: and('hasGithubRepos', 'userHasNotConnectedGithub'),
    user: alias('currentUser.user'),
    userHasNotConnectedGithub: empty('user.githubId'),

    /**
      Returns which placeholder message to use.
       @property placeholder
      @type String
     */
    placeholder: 'How can you describe the steps to complete the task so anyone can work on it?'
  });
});