define('percy-web/routes/setup/github-app', ['exports', 'ember-simple-auth/mixins/authenticated-route-mixin', 'ember-concurrency'], function (exports, _authenticatedRouteMixin, _emberConcurrency) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var Route = Ember.Route;
  var service = Ember.inject.service;


  var POLLING_INTERVAL_SECONDS = 1;
  var MAX_UPDATE_POLLING_REQUESTS = 600;

  exports.default = Route.extend(_authenticatedRouteMixin.default, {
    session: service(),
    currentUser: alias('session.currentUser'),

    queryParams: {
      installationId: {
        as: 'installation_id'
      }
    },

    installationId: null,
    runningTask: null,

    startPollingForUpdates: function startPollingForUpdates() {
      this.set('runningTask', this.get('pollForUpdatesTask').perform());
    },

    deactivate: function deactivate() {
      if (this.get('runningTask')) {
        this.get('runningTask').cancel();
      }
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
                _context.next = 10;
                break;
              }

              this.incrementProperty('numPollRequests');

              // Find the organization the user added the GitHub integration to,
              // and then redirect them back to the org setup flow
              // or to settings if they already have projects
              this.get('currentUser.organizations').reload().then(function (orgs) {
                // Attempt to get the organization that matches the installationId
                // This may fail if we haven't received the webhook yet, or a fake param is used
                var organization = orgs.find(function (org) {
                  return org.get('githubIntegration.githubInstallationId') == _this.get('installationId');
                });

                if (organization) {
                  _this.get('runningTask').cancel();
                  // If the organization has projects redirect to the settings page,
                  // else redirect to add a project page.
                  organization.get('projects').then(function (projects) {
                    if (projects.get('length') > 0) {
                      _this.replaceWith('organizations.organization.settings', organization.get('slug'));
                    } else {
                      _this.replaceWith('organization.index', organization.get('slug'));
                    }
                  });
                }
              });

              if (!Ember.testing) {
                _context.next = 6;
                break;
              }

              return _context.abrupt('return');

            case 6:
              _context.next = 8;
              return (0, _emberConcurrency.timeout)(POLLING_INTERVAL_SECONDS * 1000);

            case 8:
              _context.next = 1;
              break;

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),

    model: function model(params) {
      this.set('installationId', params.installationId);
      this.startPollingForUpdates();
    }
  });
});