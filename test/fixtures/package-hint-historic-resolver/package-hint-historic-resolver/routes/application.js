define('package-hint-historic-resolver/routes/application', ['exports', 'ember-simple-auth/mixins/application-route-mixin', 'ember-concurrency', 'package-hint-historic-resolver/config/environment'], function (exports, _applicationRouteMixin, _emberConcurrency, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Route = Ember.Route;
  var service = Ember.inject.service;
  var scheduleOnce = Ember.run.scheduleOnce;
  var setProperties = Ember.setProperties;
  var get = Ember.get;
  exports.default = Route.extend(_applicationRouteMixin.default, {
    adapter: service(),

    setupController: function setupController(controller) {
      this._super.apply(this, arguments);

      controller.rebuild();

      get(this, 'getGithubClientId').perform(controller);
    },


    getGithubClientId: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(controller) {
      var clientId, error, data;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              clientId = void 0, error = void 0;
              _context.prev = 1;
              _context.next = 4;
              return get(this, 'adapter').ajax('github/client-id');

            case 4:
              data = _context.sent;

              clientId = data['client_id'];

              _environment.default.torii.providers['github-oauth2'].apiKey = clientId;
              _context.next = 12;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context['catch'](1);

              error = _context.t0.errors[0].title;

            case 12:
              _context.prev = 12;

              setProperties(controller, {
                githubClientId: clientId,
                githubClientIdError: error
              });
              return _context.finish(12);

            case 15:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 9, 12, 15]]);
    })),

    actions: {
      queryParamsDidChange: function queryParamsDidChange() {
        var controller = this.controller;

        if (controller) {
          scheduleOnce('afterRender', function () {
            // controller.rebuild();
          });
        }
      }
    }
  });
});