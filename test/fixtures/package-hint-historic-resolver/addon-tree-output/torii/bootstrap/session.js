define('torii/bootstrap/session', ['exports', 'torii/services/torii-session'], function (exports, _toriiSession) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (application, sessionName) {
    var sessionFactoryName = 'service:' + sessionName;
    application.register(sessionFactoryName, _toriiSession.default);
    application.inject(sessionFactoryName, 'torii', 'service:torii');
    application.inject('route', sessionName, sessionFactoryName);
    application.inject('controller', sessionName, sessionFactoryName);
  };
});