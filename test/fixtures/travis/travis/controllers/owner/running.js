define('travis/controllers/owner/running', ['exports', 'ember-decorators/object'], function (exports, _object) {
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

    running: function running(data) {
      var repos = void 0;
      repos = data.repositories.filter(function (repo) {
        var currentBuild = repo.currentBuild;

        return currentBuild !== null && currentBuild.state === 'started';
      });
      return repos;
    }
  }, (_applyDecoratedDescriptor(_obj, 'running', [_dec], Object.getOwnPropertyDescriptor(_obj, 'running'), _obj)), _obj)));
});