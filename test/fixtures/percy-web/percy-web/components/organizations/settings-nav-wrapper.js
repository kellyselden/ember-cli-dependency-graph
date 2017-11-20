define('percy-web/components/organizations/settings-nav-wrapper', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var getOwner = Ember.getOwner;
  var Component = Ember.Component;
  exports.default = Component.extend({
    organization: null,
    classes: null,

    classNames: ['OrganizationsSettingsNavWrapper'],
    classNameBindings: ['classes'],

    actions: {
      chooseProject: function chooseProject(project) {
        // Send action directly up to application controller, so we don't have to delegate every
        // time in the template.
        var applicationController = getOwner(this).lookup('controller:application');
        applicationController.send('navigateToProjectSettings', project);
      }
    }
  });
});