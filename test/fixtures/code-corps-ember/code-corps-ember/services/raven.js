define('code-corps-ember/services/raven', ['exports', 'ember-cli-sentry/services/raven'], function (exports, _raven) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _raven.default.extend({

    unhandledPromiseErrorMessage: '',

    captureException: function captureException() /* error */{
      this._super.apply(this, arguments);
    },
    captureMessage: function captureMessage() /* message */{
      return this._super.apply(this, arguments);
    },
    enableGlobalErrorCatching: function enableGlobalErrorCatching() {
      return this._super.apply(this, arguments);
    },
    callRaven: function callRaven() /* methodName, ...optional */{
      return this._super.apply(this, arguments);
    }
  });
});