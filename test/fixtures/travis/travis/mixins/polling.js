define('travis/mixins/polling', ['exports', 'ember-decorators/service'], function (exports, _service) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _desc, _value, _obj, _init;

  var isArray = Ember.isArray;
  var Mixin = Ember.Mixin;
  exports.default = Mixin.create((_obj = { polling: null,

    init: function init() {
      this.set('currentPollModels', {});

      return this._super.apply(this, arguments);
    },
    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      return this.startPolling();
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      return this.stopPolling();
    },
    pollModelDidChange: function pollModelDidChange(sender, key) {
      return this.pollModel(key);
    },
    pollModel: function pollModel(property) {
      var _this = this;

      var model = this.get(property),
          currentPollModels = this.get('currentPollModels');

      if (currentPollModels[property]) {
        this.get('polling').stopPolling(currentPollModels[property]);
      }
      currentPollModels[property] = model;

      var addToPolling = function addToPolling() {
        return _this.get('polling').startPolling(model);
      };

      if (model) {
        if (model.then) {
          return model.then(function (resolved) {
            return addToPolling(resolved);
          });
        } else {
          return addToPolling(model);
        }
      }
    },
    stopPollingModel: function stopPollingModel(property) {
      var model = this.get(property);
      if (model) {
        return this.get('polling').stopPolling(model);
      }
    },
    startPolling: function startPolling() {
      var _this2 = this;

      var pollModels = void 0;
      pollModels = this.get('pollModels');
      if (pollModels) {
        if (!isArray(pollModels)) {
          pollModels = [pollModels];
        }
        pollModels.forEach(function (property) {
          _this2.pollModel(property);
          _this2.addObserver(property, _this2, 'pollModelDidChange');
        });
      }
      if (this.pollHook) {
        return this.get('polling').startPollingHook(this);
      }
    },
    stopPolling: function stopPolling() {
      var _this3 = this;

      var pollModels = this.get('pollModels');

      if (pollModels) {
        if (!isArray(pollModels)) {
          pollModels = [pollModels];
        }
        pollModels.forEach(function (property) {
          _this3.stopPollingModel(property);
          _this3.removeObserver(property, _this3, 'pollModelDidChange');
        });
      }
      return this.get('polling').stopPollingHook(this);
    }
  }, (_applyDecoratedDescriptor(_obj, 'polling', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'polling'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});