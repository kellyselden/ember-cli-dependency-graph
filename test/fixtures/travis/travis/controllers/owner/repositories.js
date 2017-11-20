define('travis/controllers/owner/repositories', ['exports', 'ember-decorators/object'], function (exports, _object) {
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

  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _object.computed)('model'), (_obj = {
    isLoading: false,

    repos: function repos(data) {
      var repos = void 0;
      repos = [];
      if (data.repositories) {
        repos = data.repositories.filterBy('active').sortBy('default_branch.last_build.finished_at').reverse();
      }
      return repos;
    }
  }, (_applyDecoratedDescriptor(_obj, 'repos', [_dec], Object.getOwnPropertyDescriptor(_obj, 'repos'), _obj)), _obj)));
});