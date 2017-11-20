define('code-corps-ember/components/github/issue-link', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var get = Ember.get;
  var service = Ember.inject.service;
  exports.default = Component.extend({
    classNames: ['github__issue-link'],

    metrics: service(),

    githubIssue: null,
    githubRepo: null,
    size: 'large',

    actions: {
      trackClick: function trackClick() {
        get(this, 'metrics').trackEvent({
          event: 'Clicked GitHub Link for Task'
        });
      }
    }
  });
});