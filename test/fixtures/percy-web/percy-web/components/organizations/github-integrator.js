define('percy-web/components/organizations/github-integrator', ['exports', 'percy-web/config/environment', 'ember-concurrency'], function (exports, _environment, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var on = Ember.on;
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var Component = Ember.Component;


  var POLLING_INTERVAL_SECONDS = 3;
  var MAX_UPDATE_POLLING_REQUESTS = 2000;

  exports.default = Component.extend({
    organization: null,
    classes: null,

    store: service(),

    currentIntegration: alias('organization.githubIntegration'),
    githubIntegrationUrl: _environment.default.APP.githubUrls.integration,

    runningTask: null,
    startPollingForUpdates: function startPollingForUpdates() {
      this.set('runningTask', this.get('pollForUpdatesTask').perform());
    },
    pollForUpdatesTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this = this;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              this.set('numPollRequests', 0);

            case 1:
              if (!(this.get('numPollRequests') < MAX_UPDATE_POLLING_REQUESTS)) {
                _context.next = 8;
                break;
              }

              this.incrementProperty('numPollRequests');
              this.get('organization').reload().then(function (organization) {
                var githubIntegration = organization.get('githubIntegration');
                var githubIntegrationRequest = organization.get('githubIntegrationRequest');

                // If the has been fully installed or uninstalled, stop polling for updates.
                if (githubIntegration || !githubIntegration && !githubIntegrationRequest) {
                  _this.get('runningTask').cancel();
                }
              });
              _context.next = 6;
              return (0, _emberConcurrency.timeout)(POLLING_INTERVAL_SECONDS * 1000);

            case 6:
              _context.next = 1;
              break;

            case 8:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),
    maybeStartPollingOnLoad: on('init', function () {
      // The user refreshed the page, and there is still a pending request, so start polling.
      if (this.get('organization.githubIntegrationRequest')) {
        this.startPollingForUpdates();
      }
    }),

    classNames: ['OrganizationsGithubIntegrator'],
    classNameBindings: ['classes'],
    actions: {
      cancelIntegrationRequest: function cancelIntegrationRequest() {
        var integrationRequest = this.get('organization.githubIntegrationRequest');
        integrationRequest.set('_orgForAdapter', this.get('organization'));
        integrationRequest.destroyRecord();
        this.get('runningTask').cancel();
      },
      triggerInstallation: function triggerInstallation() {
        var url = this.get('githubIntegrationUrl');
        var organization = this.get('organization');
        var githubIntegrationRequest = this.get('store').createRecord('github-integration-request', {
          _orgForAdapter: organization
        });
        githubIntegrationRequest.save().then(function () {
          window.location.href = url;
          return;
        });
      },
      showSupport: function showSupport() {
        this.sendAction('showSupport');
      }
    }
  });
});