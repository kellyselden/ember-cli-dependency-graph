define('package-hint-historic-resolver/services/github-ajax', ['exports', 'ember-ajax/services/ajax', 'ember-computed-decorators'], function (exports, _ajax, _emberComputedDecorators) {
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

  var _dec, _desc, _value, _obj;

  var service = Ember.inject.service;
  exports.default = _ajax.default.extend((_dec = (0, _emberComputedDecorators.default)('session.data.authenticated.accessToken'), (_obj = {
    session: service(),

    host: 'https://api.github.com',

    headers: function headers(accessToken) {
      var headers = {};

      if (accessToken) {
        headers['Authorization'] = 'token ' + accessToken;
      }

      return headers;
    }
  }, (_applyDecoratedDescriptor(_obj, 'headers', [_dec], Object.getOwnPropertyDescriptor(_obj, 'headers'), _obj)), _obj)));
});