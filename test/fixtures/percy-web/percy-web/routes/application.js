define('percy-web/routes/application', ['exports', 'ember-simple-auth-auth0/mixins/application-route-mixin', 'percy-web/lib/localstorage', 'percy-web/router', 'percy-web/mixins/ensure-stateful-login'], function (exports, _applicationRouteMixin, _localstorage, _router, _ensureStatefulLogin) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var Route = Ember.Route;


  var AUTH_REDIRECT_LOCALSTORAGE_KEY = 'percyAttemptedTransition';

  exports.default = Route.extend(_applicationRouteMixin.default, _ensureStatefulLogin.default, {
    session: service(),
    currentUser: alias('session.currentUser'),

    beforeModel: function beforeModel(transition) {
      this._super.apply(this, arguments);
      if (!this.get('session.isAuthenticated')) {
        this._storeTargetTransition(transition);
      }
      return this._loadCurrentUser();
    },
    sessionAuthenticated: function sessionAuthenticated() {
      var _this = this;

      // This method is called after the session is authenticated by ember-simple-auth.
      // By default, it executes some pre-set redirects but we want our own redirect logic,
      // so we're not calling super here.
      this._loadCurrentUser().then(function () {
        _this._decideRedirect();
      });
    },
    _loadCurrentUser: function _loadCurrentUser() {
      return this.get('session').loadCurrentUser();
    },


    actions: {
      showSupport: function showSupport() {
        window.Intercom('show');
      },
      showLoginModal: function showLoginModal() {
        this.showLoginModalEnsuringState();
      },
      logout: function logout() {
        this.get('session').invalidate();
      },
      redirectToDefaultOrganization: function redirectToDefaultOrganization() {
        this._redirectToDefaultOrganization();
      },
      navigateToProject: function navigateToProject(project) {
        var organizationSlug = project.get('organization.slug');
        var projectSlug = project.get('slug');
        this.transitionTo('organization.project.index', organizationSlug, projectSlug);
      },
      navigateToBuild: function navigateToBuild(build) {
        var organizationSlug = build.get('project.organization.slug');
        var projectSlug = build.get('project.slug');
        this.transitionTo('organization.project.builds.build', organizationSlug, projectSlug, build);
      },
      navigateToOrganizationBilling: function navigateToOrganizationBilling(organization) {
        var organizationSlug = organization.get('slug');
        this.transitionTo('organizations.organization.billing', organizationSlug);
      },
      navigateToProjectSettings: function navigateToProjectSettings(project) {
        var organizationSlug = project.get('organization.slug');
        var projectSlug = project.get('slug');
        this.transitionTo('organization.project.settings', organizationSlug, projectSlug);
      }
    },

    _redirectToDefaultOrganization: function _redirectToDefaultOrganization() {
      var _this2 = this;

      if (!this.get('currentUser')) {
        this.transitionTo('/');
      }

      var lastOrganizationSlug = _localstorage.default.get('lastOrganizationSlug');
      if (lastOrganizationSlug) {
        this.transitionTo('organization.index', lastOrganizationSlug);
      } else {
        this.get('currentUser.organizations').then(function (orgs) {
          var org = orgs.get('firstObject');
          if (org) {
            _this2.transitionTo('organization.index', org.get('slug'));
          } else {
            // User has no organizations.
            _this2.transitionTo('organizations.new');
          }
        });
      }
    },
    _storeTargetTransition: function _storeTargetTransition(transition) {
      var attemptedRoute = transition.targetName;
      if (attemptedRoute !== _router.AUTH_CALLBACK_ROUTE) {
        var attemptedTransitionUrl = transition.intent.url;
        _localstorage.default.set(AUTH_REDIRECT_LOCALSTORAGE_KEY, attemptedTransitionUrl);
      }
    },
    _decideRedirect: function _decideRedirect() {
      var redirectAddress = _localstorage.default.get(AUTH_REDIRECT_LOCALSTORAGE_KEY);
      if (redirectAddress) {
        if (redirectAddress === '/') {
          this._redirectToDefaultOrganization();
        } else {
          _localstorage.default.removeItem(AUTH_REDIRECT_LOCALSTORAGE_KEY);
          this.transitionTo(redirectAddress);
        }
      } else {
        this._redirectToDefaultOrganization();
      }
    }
  });
});