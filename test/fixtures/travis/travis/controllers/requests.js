define('travis/controllers/requests', ['exports', 'ember-decorators/controller', 'ember-decorators/object'], function (exports, _controller, _object) {
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

  var _dec, _dec2, _desc, _value, _obj, _init;

  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _controller.controller)('repo'), _dec2 = (0, _object.computed)('repoController.repo.slug'), (_obj = { repoController: null,

    queryParams: ['requestId'],

    lintUrl: function lintUrl(slug) {
      return 'https://lint.travis-ci.org/' + slug;
    }
  }, (_applyDecoratedDescriptor(_obj, 'repoController', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'repoController'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'lintUrl', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'lintUrl'), _obj)), _obj)));
});