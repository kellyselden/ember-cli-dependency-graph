define('travis/adapters/beta-feature', ['exports', 'travis/adapters/v3', 'ember-decorators/service'], function (exports, _v, _service) {
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

  exports.default = _v.default.extend((_obj = { auth: null,

    buildURL: function buildURL(modelName, id, snapshot, requestType) {
      var url = this._super.apply(this, arguments);
      if (requestType === 'GET') {
        var replacement = 'user/' + this.get('auth.currentUser.id') + '/beta_features';
        url = url.replace(/beta_features/, replacement);
      } else {
        if (requestType === 'PUT') {
          requestType = 'PATCH';
        }
        var _replacement = 'user/' + this.get('auth.currentUser.id') + '/beta_feature';
        url = url.replace(/beta_feature/, _replacement);
      }
      return url;
    },
    updateRecord: function updateRecord(store, type, snapshot) {
      var data = {};
      var serializer = store.serializerFor(type.modelName);

      serializer.serializeIntoHash(data, type, snapshot);

      var _data = data,
          enabled = _data.enabled;

      data = { 'beta_feature.enabled': enabled };

      var url = this.buildURL(type.modelName, snapshot.id, snapshot, 'updateRecord');

      return this.ajax(url, 'PATCH', { data: data });
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