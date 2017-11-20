define('travis/app', ['exports', 'travis/resolver', 'ember-load-initializers', 'travis/config/environment', 'travis/utils/init-hs-beacon'], function (exports, _resolver, _emberLoadInitializers, _environment, _initHsBeacon) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Evented = Ember.Evented;
  var Application = Ember.Application;


  // This can be set per environment in config/environment.js
  var debuggingEnabled = _environment.default.featureFlags['debug-logging'];
  var proVersion = _environment.default.featureFlags['pro-version'];

  var App = Application.extend(Evented, {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default,

    // Configure global logging based on debug feature flag
    LOG_TRANSITIONS: debuggingEnabled,
    LOG_TRANSITIONS_INTERNAL: debuggingEnabled,
    LOG_ACTIVE_GENERATION: debuggingEnabled,
    LOG_MODULE_RESOLVER: debuggingEnabled,
    LOG_VIEW_LOOKUPS: debuggingEnabled,

    ready: function ready() {
      this.on('user:signed_in', function (user) {
        return Travis.onUserUpdate(user);
      });
      this.on('user:refreshed', function (user) {
        return Travis.onUserUpdate(user);
      });
      this.on('user:synced', function (user) {
        return Travis.onUserUpdate(user);
      });
    },
    currentDate: function currentDate() {
      return new Date();
    },
    onUserUpdate: function onUserUpdate(user) {
      if (proVersion && _environment.default.beacon) {
        this.setupBeacon();
        this.identifyHSBeacon(user);
      }
      return this.subscribePusher(user);
    },
    setupBeacon: function setupBeacon() {
      if (!window.HS) {
        (0, _initHsBeacon.default)();
      }
    },
    subscribePusher: function subscribePusher(user) {
      if (!user.channels) {
        return;
      }
      Travis.pusher.subscribeAll(user.channels);
    },
    identifyHSBeacon: function identifyHSBeacon(user) {
      if (HS && HS.beacon) {
        HS.beacon.ready(function () {
          var name = user.name,
              email = user.email,
              login = user.login,
              synced_at = user.synced_at;

          var userParams = {
            name: name,
            email: email,
            login: login,
            last_synced_at: synced_at
          };
          return HS.beacon.identify(userParams);
        });
      }
    }
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});