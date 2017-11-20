define('torii/mixins/ui-service-mixin', ['exports', 'torii/lib/uuid-generator', 'torii/lib/popup-id-serializer', 'torii/lib/parse-query-string', 'torii/lib/assert', 'torii/configuration'], function (exports, _uuidGenerator, _popupIdSerializer, _parseQueryString, _assert, _configuration) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.WARNING_KEY = exports.CURRENT_REQUEST_KEY = undefined;
  var CURRENT_REQUEST_KEY = exports.CURRENT_REQUEST_KEY = '__torii_request';
  var WARNING_KEY = exports.WARNING_KEY = '__torii_redirect_warning';


  var on = Ember.on;

  function parseMessage(url, keys) {
    var parser = _parseQueryString.default.create({ url: url, keys: keys });
    var data = parser.parse();
    return data;
  }

  var ServicesMixin = Ember.Mixin.create({

    init: function init() {
      this._super.apply(this, arguments);
      this.remoteIdGenerator = this.remoteIdGenerator || _uuidGenerator.default;
    },

    // Open a remote window. Returns a promise that resolves or rejects
    // according to whether the window is redirected with arguments in the URL.
    //
    // For example, an OAuth2 request:
    //
    // popup.open('http://some-oauth.com', ['code']).then(function(data){
    //   // resolves with data.code, as from http://app.com?code=13124
    // });
    //
    // Services that use this mixin should implement openRemote
    //
    open: function open(url, keys, options) {
      var service = this,
          lastRemote = this.remote;

      return new Ember.RSVP.Promise(function (resolve, reject) {
        if (lastRemote) {
          service.close();
        }

        var remoteId = service.remoteIdGenerator.generate();

        var pendingRequestKey = _popupIdSerializer.default.serialize(remoteId);
        localStorage.setItem(CURRENT_REQUEST_KEY, pendingRequestKey);
        localStorage.removeItem(WARNING_KEY);

        service.openRemote(url, pendingRequestKey, options);
        service.schedulePolling();

        var onbeforeunload = window.onbeforeunload;
        window.onbeforeunload = function () {
          if (typeof onbeforeunload === 'function') {
            onbeforeunload();
          }
          service.close();
        };

        if (service.remote && !service.remote.closed) {
          service.remote.focus();
        } else {
          localStorage.removeItem(CURRENT_REQUEST_KEY);
          reject(new Error('remote could not open or was closed'));
          return;
        }

        service.one('didClose', function () {
          var hasWarning = localStorage.getItem(WARNING_KEY);
          if (hasWarning) {
            localStorage.removeItem(WARNING_KEY);
            var configuration = (0, _configuration.getConfiguration)();

            (0, _assert.default)('[Torii] Using an OAuth redirect that loads your Ember App is deprecated and will be\n              removed in a future release, as doing so is a potential security vulnerability.\n              Hide this message by setting `allowUnsafeRedirect: true` in your Torii configuration.\n          ', configuration.allowUnsafeRedirect);
          }
          var pendingRequestKey = localStorage.getItem(CURRENT_REQUEST_KEY);
          if (pendingRequestKey) {
            localStorage.removeItem(pendingRequestKey);
            localStorage.removeItem(CURRENT_REQUEST_KEY);
          }
          // If we don't receive a message before the timeout, we fail. Normally,
          // the message will be received and the window will close immediately.
          service.timeout = Ember.run.later(service, function () {
            reject(new Error("remote was closed, authorization was denied, or an authentication message otherwise not received before the window closed."));
          }, 100);
        });

        Ember.$(window).on('storage.torii', function (event) {
          var storageEvent = event.originalEvent;

          var remoteIdFromEvent = _popupIdSerializer.default.deserialize(storageEvent.key);
          if (remoteId === remoteIdFromEvent) {
            var data = parseMessage(storageEvent.newValue, keys);
            localStorage.removeItem(storageEvent.key);
            Ember.run(function () {
              resolve(data);
            });
          }
        });
      }).finally(function () {
        // didClose will reject this same promise, but it has already resolved.
        service.close();

        Ember.$(window).off('storage.torii');
      });
    },

    close: function close() {
      if (this.remote) {
        this.closeRemote();
        this.remote = null;
        this.trigger('didClose');
      }
      this.cleanUp();
    },

    cleanUp: function cleanUp() {
      this.clearTimeout();
    },

    schedulePolling: function schedulePolling() {
      this.polling = Ember.run.later(this, function () {
        this.pollRemote();
        this.schedulePolling();
      }, 35);
    },

    // Clear the timeout, in case it hasn't fired.
    clearTimeout: function clearTimeout() {
      Ember.run.cancel(this.timeout);
      this.timeout = null;
    },

    stopPolling: on('didClose', function () {
      Ember.run.cancel(this.polling);
    })
  });

  exports.default = ServicesMixin;
});