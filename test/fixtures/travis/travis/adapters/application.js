define('travis/adapters/application', ['exports', 'travis/config/environment', 'active-model-adapter', 'ember-decorators/service'], function (exports, _environment, _activeModelAdapter, _service) {
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

  exports.default = _activeModelAdapter.default.extend((_obj = { auth: null,

    host: _environment.default.apiEndpoint,
    coalesceFindRequests: true,

    // Before Ember Data 2.0 the default behaviour of running `findAll` was to get
    // new records only when there're no records in the store. This will change
    // to a different strategy in 2.0: when you run `findAll` it will not get any
    // new data initially, but it will try loading new data in the background.
    //
    // I'm disabling the new behaviour for now.
    shouldBackgroundReloadRecord: function shouldBackgroundReloadRecord() {
      return false;
    },
    ajaxOptions: function ajaxOptions() {
      var hash = this._super.apply(this, arguments);
      hash.headers = hash.headers || {};
      hash.headers['accept'] = 'application/json; version=2';

      var token = this.get('auth').token();
      if (token) {
        if (!hash.headers['Authorization']) {
          hash.headers['Authorization'] = 'token ' + token;
        }
      }

      return hash;
    },
    findMany: function findMany(store, type, ids) {
      return this.ajax(this.buildURL(type.modelName), 'GET', {
        data: {
          ids: ids
        }
      });
    },
    handleResponse: function handleResponse(status, headers, payload) {
      if (status > 299) {
        if (this.get('features.debugLogging')) {
          // eslint-disable-next-line
          console.log("[ERROR] API responded with an error (" + status + "): " + JSON.stringify(payload));
        }
      }

      return this._super.apply(this, arguments);
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});