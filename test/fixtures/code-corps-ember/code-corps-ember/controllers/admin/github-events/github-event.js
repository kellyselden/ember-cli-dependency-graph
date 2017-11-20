define('code-corps-ember/controllers/admin/github-events/github-event', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Controller = Ember.Controller;
  var get = Ember.get;
  var set = Ember.set;
  var service = Ember.inject.service;
  exports.default = Controller.extend({
    flashMessages: service(),

    actions: {
      retry: function retry() {
        var _this = this;

        var githubEvent = get(this, 'model');
        set(githubEvent, 'retry', true);
        githubEvent.save().then(function () {
          get(_this, 'flashMessages').clearMessages().success('Retrying the event. You may need to reload the page.');
        }).catch(function () {
          get(_this, 'flashMessages').clearMessages().danger('The event could not be retried.');
        });
      }
    }
  });
});