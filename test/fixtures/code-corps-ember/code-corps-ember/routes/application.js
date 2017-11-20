define('code-corps-ember/routes/application', ['exports', 'ember-simple-auth/mixins/application-route-mixin', 'code-corps-ember/config/environment', 'code-corps-ember/mixins/loading-bar'], function (exports, _applicationRouteMixin, _environment, _loadingBar) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var alias = Ember.computed.alias;
  var service = Ember.inject.service;
  var isPresent = Ember.isPresent;
  var Route = Ember.Route;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Route.extend(_applicationRouteMixin.default, _loadingBar.default, {
    currentUser: service(),
    flashMessages: service(),
    metrics: service(),
    onboarding: service(),
    i18n: service(),

    isOnboarding: alias('onboarding.isOnboarding'),
    onboardingRoute: alias('onboarding.routeForCurrentStep'),

    headTags: [{
      type: 'link',
      tagId: 'link-canonical',
      attrs: {
        rel: 'canonical',
        content: _environment.default.WEB_BASE_URL
      }
    }, {
      type: 'meta',
      tagId: 'meta-description',
      attrs: {
        property: 'description',
        content: 'Contribute to software projects for social good. Give your time or money to help build software to better the arts, education, government, science, and more.'
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-description',
      attrs: {
        property: 'og:description',
        content: 'Contribute to software projects for social good. Give your time or money to help build software to better the arts, education, government, science, and more.'
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-image',
      attrs: {
        property: 'og:image',
        content: 'https://d3pgew4wbk2vb1.cloudfront.net/images/universal-card.png'
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-site-name',
      attrs: {
        property: 'og:site_name',
        content: 'Code Corps'
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-title',
      attrs: {
        property: 'og:title',
        content: 'Code Corps | Build a better future.'
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-type',
      attrs: {
        property: 'og:type',
        content: 'website'
      }
    }, {
      type: 'meta',
      tagId: 'meta-og-url',
      attrs: {
        property: 'og:url',
        content: _environment.default.WEB_BASE_URL
      }
    }, {
      type: 'meta',
      tagId: 'twitter-card',
      attrs: {
        name: 'twitter:card',
        content: 'summary_large_image'
      }
    }, {
      type: 'meta',
      tagId: 'twitter-creator',
      attrs: {
        name: 'twitter:creator',
        content: '@thecodecorps'
      }
    }, {
      type: 'meta',
      tagId: 'twitter-creator-id',
      attrs: {
        name: 'twitter:creator:id',
        content: '4608917052'
      }
    }, {
      type: 'meta',
      tagId: 'twitter-description',
      attrs: {
        name: 'twitter:description',
        content: 'Contribute to software projects for social good. Give your time or money to help build software to better the arts, education, government, science, and more.'
      }
    }, {
      type: 'meta',
      tagId: 'twitter-image',
      attrs: {
        name: 'twitter:image',
        content: 'https://d3pgew4wbk2vb1.cloudfront.net/images/universal-card.png'
      }
    }, {
      type: 'meta',
      tagId: 'twitter-site',
      attrs: {
        name: 'twitter:site',
        content: '@thecodecorps'
      }
    }, {
      type: 'meta',
      tagId: 'twitter-site-id',
      attrs: {
        name: 'twitter:site:id',
        content: '4608917052'
      }
    }, {
      type: 'meta',
      tagId: 'twitter-title',
      attrs: {
        name: 'twitter:title',
        content: 'Code Corps | Build a better future.'
      }
    }],

    beforeModel: function beforeModel(transition) {
      var _this = this,
          _arguments = arguments;

      return this._loadCurrentUser().then(function () {
        if (_this._shouldRedirectToOnboarding(transition)) {
          return _this.transitionTo(get(_this, 'onboardingRoute'));
        } else {
          return _this._super.apply(_this, _arguments);
        }
      }).catch(function () {
        return _this._invalidateSession();
      });
    },
    afterModel: function afterModel() {
      this._setTranslationLocale();
    },
    sessionAuthenticated: function sessionAuthenticated() {
      var _this2 = this;

      return this._loadCurrentUser().then(function () {
        _this2._attemptTransitionAfterAuthentication();
        _this2._trackAuthentication();
      }).catch(function () {
        return _this2._invalidateSession();
      });
    },


    actions: {
      willTransition: function willTransition(transition) {
        if (this._shouldRedirectToOnboarding(transition)) {
          transition.abort();
          this.transitionTo(get(this, 'onboardingRoute'));
        }
      },


      // see https://github.com/emberjs/ember.js/issues/12791
      // if we don't handle the error action at application level
      // the error will continue to be thrown, causing tests to fail
      // and the error will output to console, even though we technically
      // "handled" it with our application_error route/template
      error: function error(e) {
        console.error(e);
        this.intermediateTransitionTo('application_error', e);
      }
    },

    // The default beahavior for an ember-simple-auth ApplicationRouteMixin is to
    // Either got back to the route the user tried to access before being
    // redirected to login/signup, or if there is no such route, go to the default
    // route.
    //
    // This slightly extends this behavior by sending the user to the onboarding
    // route if it's determined that should be the case. If there was a stored
    // route, for example, if a non-signed-in user tried to donate, then that
    // still takes precedence.
    _attemptTransitionAfterAuthentication: function _attemptTransitionAfterAuthentication() {
      var attemptedTransition = get(this, 'session.attemptedTransition');
      if (isPresent(attemptedTransition)) {
        attemptedTransition.retry();
        set(this, 'session.attemptedTransition', null);
      } else if (get(this, 'isOnboarding')) {
        this.transitionTo(get(this, 'onboardingRoute'));
      } else {
        this.transitionTo('projects-list');
      }
    },
    _invalidateSession: function _invalidateSession() {
      get(this, 'session').invalidate();
    },
    _loadCurrentUser: function _loadCurrentUser() {
      return get(this, 'currentUser').loadCurrentUser();
    },
    _setTranslationLocale: function _setTranslationLocale() {

      var locales = this.get('i18n.locales');

      if (navigator.languages) {
        if (navigator.languages[0]) {
          if (locales.includes(navigator.languages[0].toLowerCase())) {
            return this.set('i18n.locale', navigator.languages[0].toLowerCase());
          } else {
            this.set('i18n.locale', 'en-us');
          }
        } else {
          this.set('i18n.locale', 'en-us');
        }
      } else if (locales.includes(navigator.language.toLowerCase())) {
        this.set('i18n.locale', navigator.language.toLowerCase());
      } else {
        this.set('i18n.locale', 'en-us');
      }
    },


    // If the user is still in the process of onboarding, they are allowd to visit
    // only select routes. Trying to access any other route redirects them to
    // their next onboarding route.
    //
    // This function returns true if that should happen.
    _shouldRedirectToOnboarding: function _shouldRedirectToOnboarding(transition) {
      var isOnboarding = get(this, 'isOnboarding');
      var allowedRoutes = get(this, 'onboarding.allowedRoutes');
      var targetRoute = transition.targetName;
      var isTransitionToAllowedRoute = allowedRoutes.indexOf(targetRoute) > -1;

      return isOnboarding && !isTransitionToAllowedRoute;
    },
    _trackAuthentication: function _trackAuthentication() {
      get(this, 'metrics').trackEvent({
        event: 'Signed In'
      });
    }
  });
});