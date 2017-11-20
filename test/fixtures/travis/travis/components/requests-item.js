define('travis/components/requests-item', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _desc, _value, _obj, _init;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('request.result'), _dec2 = (0, _object.computed)('request.isPullRequest'), _dec3 = (0, _object.computed)('highlightedRequestId', 'request.id'), _dec4 = (0, _object.computed)('request.result'), _dec5 = (0, _object.computed)('features.proVersion', 'request.message'), (_obj = {
    classNames: ['request-item'],
    classNameBindings: ['requestClass', 'highlightedClass'],
    tagName: 'li',

    requestClass: null,

    type: function type(isPullRequest) {
      return isPullRequest ? 'pull_request' : 'push';
    },
    highlightedClass: function highlightedClass(paramId, currentId) {
      return paramId === currentId ? 'highlighted' : '';
    },
    status: function status(result) {
      return result.capitalize();
    },
    message: function message(proVersion, _message) {
      if (proVersion && _message === 'private repository') {
        return '';
      } else if (!_message) {
        return 'Build created successfully ';
      }
      return _message;
    }
  }, (_applyDecoratedDescriptor(_obj, 'requestClass', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'requestClass'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'type', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'type'), _obj), _applyDecoratedDescriptor(_obj, 'highlightedClass', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'highlightedClass'), _obj), _applyDecoratedDescriptor(_obj, 'status', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'status'), _obj), _applyDecoratedDescriptor(_obj, 'message', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'message'), _obj)), _obj)));
});