define('travis/utils/limited-array', ['exports', 'travis/utils/computed-limit', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _computedLimit, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _desc, _value, _obj, _init, _init2;

  var ArrayProxy = Ember.ArrayProxy;
  exports.default = ArrayProxy.extend((_dec = (0, _computed.alias)('content.isLoaded'), _dec2 = (0, _computed.alias)('content.length'), _dec3 = (0, _object.computed)('totalLength', 'limit'), _dec4 = (0, _object.computed)('leftLength'), (_obj = {
    limit: 10,

    arrangedContent: (0, _computedLimit.default)('content', 'limit'),

    isLoaded: null,

    totalLength: null,

    leftLength: function leftLength(total, limit) {
      var left = total - limit;
      if (left < 0) {
        return 0;
      } else {
        return left;
      }
    },
    isMore: function isMore(leftLength) {
      return leftLength > 0;
    },
    showAll: function showAll() {
      return this.set('limit', Infinity);
    }
  }, (_applyDecoratedDescriptor(_obj, 'isLoaded', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'isLoaded'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'totalLength', [_dec2], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'totalLength'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'leftLength', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'leftLength'), _obj), _applyDecoratedDescriptor(_obj, 'isMore', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'isMore'), _obj)), _obj)));
});