define('travis/services/polling', ['exports', 'travis/config/environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var Service = Ember.Service;
  exports.default = Service.extend({
    pollingInterval: 30000,
    ajaxPolling: true,

    init: function init() {
      var _this = this;

      var interval = void 0;
      this._super.apply(this, arguments);
      this.set('watchedModels', []);
      this.set('sources', []);

      interval = setInterval(function () {
        if (_environment.default.ajaxPolling) {
          _this.poll();
        }
      }, this.get('pollingInterval'));

      this.set('interval', interval);
    },
    willDestroy: function willDestroy() {
      this._super.apply(this, arguments);
      var interval = this.get('interval');
      if (interval) {
        return clearInterval(interval);
      }
    },
    startPollingHook: function startPollingHook(source) {
      var sources = void 0;
      sources = this.get('sources');
      if (!sources.includes(source)) {
        return sources.pushObject(source);
      }
    },
    stopPollingHook: function stopPollingHook(source) {
      var sources = void 0;
      sources = this.get('sources');
      return sources.removeObject(source);
    },
    startPolling: function startPolling(model) {
      var watchedModels = void 0;
      watchedModels = this.get('watchedModels');
      if (!watchedModels.includes(model)) {
        return watchedModels.pushObject(model);
      }
    },
    stopPolling: function stopPolling(model) {
      var watchedModels = void 0;
      watchedModels = this.get('watchedModels');
      return watchedModels.removeObject(model);
    },
    poll: function poll() {
      var _this2 = this;

      this.get('watchedModels').forEach(function (model) {
        return model.reload();
      });

      return this.get('sources').forEach(function (source) {
        if (get(source, 'isDestroyed')) {
          return _this2.get('sources').removeObject(source);
        } else {
          return source.pollHook();
        }
      });
    }
  });
});