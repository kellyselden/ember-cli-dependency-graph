define('percy-web/services/analytics', ['exports', 'percy-web/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Service = Ember.Service;
  var service = Ember.inject.service;
  exports.default = Service.extend({
    session: service(),
    adminMode: service(),
    currentUser: alias('session.currentUser'),

    userInstance: null,
    organizationInstance: null,

    init: function init() {
      if (!this.isEnabled()) {
        return;
      }

      var amplitudeConfigurationOptions = {
        includeUtm: true,
        includeReferrer: true,
        includeGclid: true
      };

      this.userInstance = window.amplitude.getInstance(_environment.default.APP.AMPLITUDE_USERS_INSTANCE_NAME);
      this.userInstance.init(_environment.default.APP.AMPLITUDE_USERS_PROJECT_ID, null, amplitudeConfigurationOptions);

      this.organizationInstance = window.amplitude.getInstance(_environment.default.APP.AMPLITUDE_ORGANIZATIONS_INSTANCE_NAME);
      this.organizationInstance.init(_environment.default.APP.AMPLITUDE_ORGANIZATIONS_PROJECT_ID, null, amplitudeConfigurationOptions);
    },
    isEnabled: function isEnabled() {
      return window.amplitude && !this.get('adminMode').excludeFromAnalytics();
    },
    invalidate: function invalidate() {
      if (!this.isEnabled()) {
        return;
      }

      this.userInstance.setUserId(null);
      this.userInstance.regenerateDeviceId();

      this.organizationInstance.setUserId(null);
      this.organizationInstance.regenerateDeviceId();
    },
    identifyUser: function identifyUser(user) {
      if (!this.isEnabled()) {
        return;
      }

      var userProperties = {
        login: user.get('login'),
        email: user.get('email'),
        name: user.get('name')
      };

      this.userInstance.setUserId(user.get('id'));
      this.userInstance.setUserProperties(userProperties);
    },
    track: function track(eventName, organization) {
      var eventProperties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      // window.console.log('Analytics track called:', eventName, organization, eventProperties);
      if (!this.isEnabled()) {
        return;
      }

      var userEventProperties = eventProperties;
      var groups = {};
      if (organization) {
        userEventProperties = Object.assign({
          organization_id: organization.get('id'),
          organization_slug: organization.get('slug')
        }, eventProperties);

        groups['organization_id'] = organization.get('id');
      }

      this.userInstance.logEventWithGroups(eventName, userEventProperties, groups);

      if (organization) {
        this.organizationInstance.setUserId(organization.get('id'));
        var organizationEventProperties = Object.assign({ user_id: this.get('currentUser.id') }, eventProperties);
        this.organizationInstance.logEvent(eventName, organizationEventProperties);
      }
    }
  });
});