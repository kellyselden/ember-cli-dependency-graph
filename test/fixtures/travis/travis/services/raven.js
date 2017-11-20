define('travis/services/raven', ['exports', 'ember-cli-sentry/services/raven', 'travis/config/environment'], function (exports, _raven, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _raven.default.extend({
    benignErrors: ['TransitionAborted', 'TaskInstance', 'UnrecognizedURLError', 'not found', 'returned a 403', 'returned a 404', 'operation failed', 'operation was aborted', 'needs-auth'],

    unhandledPromiseErrorMessage: '',

    captureException: function captureException() /* error */{
      this._super.apply(this, arguments);
    },
    logException: function logException(e) {
      // eslint-disable-next-line
      console.log('Caught an exception:', e);

      if (!this.ignoreError(e)) {
        this.captureException(e);
      }
    },
    captureMessage: function captureMessage() /* message */{
      return this._super.apply(this, arguments);
    },
    enableGlobalErrorCatching: function enableGlobalErrorCatching() {
      return this._super.apply(this, arguments);
    },
    ignoreError: function ignoreError(error) {
      if (!this.shouldReportError()) {
        return true;
      } else {
        var message = error.message;
        if (message) {
          return this.get('benignErrors').any(function (error) {
            return message.includes(error);
          });
        } else {
          return false;
        }
      }
    },
    callRaven: function callRaven() /* methodName, ...optional */{
      return this._super.apply(this, arguments);
    },
    shouldReportError: function shouldReportError() {
      // Sentry recommends only reporting a small subset of the actual
      // frontend errors. This can get *very* noisy otherwise.
      if (_environment.default.enterprise || _environment.default.sentry.development) {
        return false;
      } else {
        var sampleRate = 10;
        return Math.random() * 100 <= sampleRate;
      }
    }
  });
});