define('travis/instance-initializers/raven-release', ['exports', 'travis/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize(appInstance) {
    var sha = void 0;
    // this is Heroku-specific, will not work in other environments
    if (_environment.default.environment === 'production') {
      sha = _environment.default.release.slice(0, 7);
    } else {
      sha = appInstance.application.version.slice(6, -1);
    }

    var env = window.location.href;
    var domain = env.includes('.org') ? 'org' : 'com';
    var release = domain + '-' + sha;

    window.Raven.setRelease(release);
  }

  exports.default = {
    name: 'raven-release',
    after: 'sentry-setup',
    initialize: initialize
  };
});