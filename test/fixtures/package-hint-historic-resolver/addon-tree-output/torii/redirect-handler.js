define('torii/redirect-handler', ['exports', 'torii/mixins/ui-service-mixin', 'torii/configuration'], function (exports, _uiServiceMixin, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ToriiRedirectError = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  var ToriiRedirectError = exports.ToriiRedirectError = function (_Ember$Error) {
    _inherits(ToriiRedirectError, _Ember$Error);

    function ToriiRedirectError() {
      _classCallCheck(this, ToriiRedirectError);

      var _this = _possibleConstructorReturn(this, (ToriiRedirectError.__proto__ || Object.getPrototypeOf(ToriiRedirectError)).apply(this, arguments));

      _this.name = 'ToriiRedirectError';
      return _this;
    }

    return ToriiRedirectError;
  }(Ember.Error);

  var RedirectHandler = Ember.Object.extend({

    run: function run() {
      var windowObject = this.windowObject;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        var pendingRequestKey = windowObject.localStorage.getItem(_uiServiceMixin.CURRENT_REQUEST_KEY);
        windowObject.localStorage.removeItem(_uiServiceMixin.CURRENT_REQUEST_KEY);
        if (pendingRequestKey) {
          var url = windowObject.location.toString();
          windowObject.localStorage.setItem(_uiServiceMixin.WARNING_KEY, 'true');
          windowObject.localStorage.setItem(pendingRequestKey, url);

          var remoteServiceName = _configuration.default.remoteServiceName || 'popup';
          if (remoteServiceName === 'popup') {
            // NOTE : If a single provider has been configured to use the 'iframe'
            // service, this next line will still be called. It will just fail silently.
            windowObject.close();
          }
        } else {
          reject(new ToriiRedirectError('Not a torii popup'));
        }
      });
    }

  });

  RedirectHandler.reopenClass({
    // untested
    handle: function handle(windowObject) {
      var handler = RedirectHandler.create({ windowObject: windowObject });
      return handler.run();
    }
  });

  exports.default = RedirectHandler;
});