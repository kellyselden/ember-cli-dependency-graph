define('ember-cli-sentry/services/raven', ['exports', 'ember-cli-sentry/utils/parse-regex-errors'], function (exports, _parseRegexErrors) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  // Ember merge is deprecated as of 2.5, but we need to check for backwards
  // compatibility.
  var assign = Ember.assign || Ember.merge;

  var RSVP = Ember.RSVP,
      Service = Ember.Service,
      computed = Ember.computed,
      typeOf = Ember.typeOf;


  /**
   * Default available logger service.
   *
   * You can simply extend or export this Service to use it in the application.
   *
   * @class RavenService
   * @module ember-cli-sentry/services/raven
   * @extends Ember.Service
   */
  var RavenService = Service.extend({

    /**
     * Global error catching definition status
     *
     * @property globalErrorCatchingInitialized
     * @type Boolean
     * @default false
     * @private
     */
    globalErrorCatchingInitialized: false,

    /**
     * Message to send to Raven when facing an unhandled
     * RSVP.Promise rejection.
     *
     * @property unhandledPromiseErrorMessage
     * @type String
     * @default 'Unhandled Promise error detected'
     */
    unhandledPromiseErrorMessage: 'Unhandled Promise error detected',

    /**
     * Ignore errors if the message matches any string or regex in this list.
     *
     * @property ignoreErrors
     * @type Array
     */
    ignoreErrors: [],

    /**
     * Ignore errors if any of the stack trace file paths matches any string or regex in this list.
     *
     * @property ignoreUrls
     * @type Array
     */
    ignoreUrls: [],

    /**
     * Utility function used internally to check if Raven object
     * can capture exceptions and messages properly.
     *
     * @property isRavenUsable
     * @type Ember.ComputedProperty
     */
    isRavenUsable: computed(function () {
      return !!(window.Raven && window.Raven.isSetup() === true);
    }).volatile(),

    setup: function setup(config) {
      var _config$sentry = config.sentry,
          dsn = _config$sentry.dsn,
          environment = _config$sentry.environment,
          _config$sentry$debug = _config$sentry.debug,
          debug = _config$sentry$debug === undefined ? true : _config$sentry$debug,
          _config$sentry$includ = _config$sentry.includePaths,
          includePaths = _config$sentry$includ === undefined ? [] : _config$sentry$includ,
          _config$sentry$whitel = _config$sentry.whitelistUrls,
          whitelistUrls = _config$sentry$whitel === undefined ? [] : _config$sentry$whitel,
          _config$sentry$servic = _config$sentry.serviceName,
          serviceName = _config$sentry$servic === undefined ? 'raven' : _config$sentry$servic,
          _config$sentry$servic2 = _config$sentry.serviceReleaseProperty,
          serviceReleaseProperty = _config$sentry$servic2 === undefined ? 'release' : _config$sentry$servic2,
          _config$sentry$ravenO = _config$sentry.ravenOptions,
          ravenOptions = _config$sentry$ravenO === undefined ? {} : _config$sentry$ravenO;


      var ignoreErrors = this.get('ignoreErrors');
      if (Ember.isPresent(ignoreErrors)) {
        Ember.set(ravenOptions, 'ignoreErrors', ignoreErrors);
      } else if (Ember.get(ravenOptions, 'ignoreErrors.length')) {
        Ember.deprecate('Please set "ignoreErrors" on the "' + serviceName + '" service instead of in the "config/environment.js" file', false, {
          id: 'ember-cli-sentry.ignore-errors-in-service',
          until: '3.0.0'
        });
        Ember.set(ravenOptions, 'ignoreErrors', (0, _parseRegexErrors.parseRegexErrors)(ravenOptions.ignoreErrors));
      }

      Ember.set(ravenOptions, 'ignoreUrls', this.get('ignoreUrls'));

      try {
        window.Raven.debug = debug;

        // Keeping existing config values for includePaths, whitelistUrls, for compatibility.
        var ravenConfig = assign({
          environment: environment,
          includePaths: includePaths,
          whitelistUrls: whitelistUrls,
          release: this.get(serviceReleaseProperty) || config.APP.version
        }, ravenOptions);

        window.Raven.config(dsn, ravenConfig);
      } catch (e) {
        Ember.Logger.warn('Error during `sentry` initialization: ' + e);
        return;
      }

      window.Raven.install();

      var _config$sentry$global = config.sentry.globalErrorCatching,
          globalErrorCatching = _config$sentry$global === undefined ? true : _config$sentry$global;


      if (globalErrorCatching === true) {
        this.enableGlobalErrorCatching();
      }
    },
    captureException: function captureException(error) {
      if (this.get('isRavenUsable')) {
        var _window$Raven;

        (_window$Raven = window.Raven).captureException.apply(_window$Raven, arguments);
      } else {
        throw error;
      }
    },
    captureMessage: function captureMessage(message) {
      if (this.get('isRavenUsable')) {
        var _window$Raven2;

        (_window$Raven2 = window.Raven).captureMessage.apply(_window$Raven2, arguments);
      } else {
        throw new Error(message);
      }
      return true;
    },
    enableGlobalErrorCatching: function enableGlobalErrorCatching() {
      var _this = this;

      if (this.get('isRavenUsable') && !this.get('globalErrorCatchingInitialized')) {
        var _oldOnError = Ember.onerror;

        Ember.onerror = function (error) {
          if (_this._ignoreError(error)) {
            return;
          }

          _this.captureException(error);
          _this.didCaptureException(error);
          if (typeof _oldOnError === 'function') {
            _oldOnError.call(Ember, error);
          }
        };

        RSVP.on('error', function (reason, label) {
          if (_this._ignoreError(reason)) {
            return;
          }

          if (typeOf(reason) === 'error') {
            _this.captureException(reason, {
              extra: {
                context: label || _this.get('unhandledPromiseErrorMessage')
              }
            });
            _this.didCaptureException(reason);
          } else {
            _this.captureMessage(_this._extractMessage(reason), {
              extra: {
                reason: reason,
                context: label
              }
            });
          }
        });

        this.set('globalErrorCatchingInitialized', true);
      }

      return this;
    },
    _extractMessage: function _extractMessage(reason) {
      var defaultMessage = this.get('unhandledPromiseErrorMessage');
      switch (typeOf(reason)) {
        case 'string':
          return reason;
        case 'object':
          return reason.message || defaultMessage;
        default:
          return defaultMessage;
      }
    },
    _ignoreError: function _ignoreError(error) {
      // Ember 2.X seems to not catch `TransitionAborted` errors caused by regular redirects. We don't want these errors to show up in Sentry so we have to filter them ourselfs.
      // Once the issue https://github.com/emberjs/ember.js/issues/12505 is resolved we can remove this ignored error.
      if (error && error.name === 'TransitionAborted') {
        return true;
      }

      return this.ignoreError(error);
    },
    didCaptureException: function didCaptureException() {},
    ignoreError: function ignoreError() {
      return false;
    },
    callRaven: function callRaven(methodName) {
      if (this.get('isRavenUsable')) {
        try {
          var _window$Raven$methodN;

          for (var _len = arguments.length, optional = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            optional[_key - 1] = arguments[_key];
          }

          return (_window$Raven$methodN = window.Raven[methodName]).call.apply(_window$Raven$methodN, [window.Raven].concat(_toConsumableArray(optional)));
        } catch (error) {
          this.captureException(error);
          return false;
        }
      }
    }
  });

  exports.default = RavenService;
});