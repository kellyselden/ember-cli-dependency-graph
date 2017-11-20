define('percy-web/components/organizations/github-bot-integrator', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var service = Ember.inject.service;
  var Component = Ember.Component;
  exports.default = Component.extend({
    changeset: null,
    classes: null,
    selectionChanged: null,

    session: service(),
    classNames: ['OrganizationsGithubBotIntegrator'],
    classNameBindings: ['classes'],
    actions: {
      assignMe: function assignMe() {
        // We just delegate handling everything up to the github-settings component for ease.
        this.get('assignMe')();
      }
    }
  });
});