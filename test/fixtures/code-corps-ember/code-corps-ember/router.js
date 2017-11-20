define('code-corps-ember/router', ['exports', 'ember-router-scroll', 'code-corps-ember/config/environment'], function (exports, _emberRouterScroll, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var service = Ember.inject.service;
  var run = Ember.run;
  var EmberRouter = Ember.Router;


  var Router = EmberRouter.extend(_emberRouterScroll.default, {
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL,
    metrics: service(),

    didTransition: function didTransition() {
      this._super.apply(this, arguments);
      this._trackPage();
    },
    _trackPage: function _trackPage() {
      var _this = this;

      run.scheduleOnce('afterRender', this, function () {
        var page = document.location.pathname;
        var title = _this.getWithDefault('currentRouteName', 'unknown');

        get(_this, 'metrics').trackPage({ page: page, title: title });
      });
    }
  });

  Router.map(function () {
    this.route('about');

    this.route('admin', function () {
      this.route('github-events', { path: '/github/events' }, function () {
        this.route('github-event', { path: '/:id' });
      });
    });

    this.route('github', {
      path: '/oauth/github'
    });

    this.route('login');

    this.route('organization', function () {
      this.route('settings', function () {});
    });

    this.route('organizations', function () {
      this.route('slugged-route', {
        path: '/:slugged_route_slug'
      }, function () {
        this.route('settings', function () {
          this.route('profile');
        });
      });
    });

    this.route('privacy');

    this.route('project', { path: '/:slugged_route_slug/:project_slug' }, function () {
      this.route('checkout');
      this.route('donate');
      this.route('settings', function () {
        this.route('contributors');
        this.route('donations', function () {
          this.route('goals');
          this.route('payments');
        });
        this.route('integrations');
        this.route('profile');
      });
      this.route('tasks', function () {
        this.route('new');
        this.route('task', { path: '/:number' });
      });
      this.route('thank-you');
    });

    this.route('projects', {
      path: '/:slugged_route_slug/projects'
    });

    this.route('projects-list', {
      path: '/projects'
    });

    this.route('password', function () {
      this.route('reset');
      this.route('forgot');
    });

    this.route('settings', function () {
      this.route('profile');
      this.route('integrations');
    });

    this.route('signup');

    this.route('slugged-route', {
      path: '/:slugged_route_slug'
    });

    this.route('start', function () {
      this.route('hello');
      this.route('interests');
      this.route('expertise');
      this.route('skills');
    });

    this.route('team');
    this.route('terms');
  });

  exports.default = Router;
});