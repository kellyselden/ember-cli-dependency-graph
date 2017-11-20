define('travis/controllers/owner', ['exports', 'ember-decorators/object'], function (exports, _object) {
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

  var _dec, _dec2, _desc, _value, _obj;

  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _object.computed)('config.sourceEndpoint', 'model.login'), _dec2 = (0, _object.computed)('model'), (_obj = {
    isLoading: false,

    githubProfile: function githubProfile(endpoint, login) {
      return endpoint + '/' + login;
    },
    owner: function owner(model) {
      return {
        login: model.login,
        name: model.name,
        avatar: model.avatar_url,
        isSyncing: model.is_syncing,
        avatarUrl: model.avatar_url,
        syncedAt: model.synced_at
      };
    }
  }, (_applyDecoratedDescriptor(_obj, 'githubProfile', [_dec], Object.getOwnPropertyDescriptor(_obj, 'githubProfile'), _obj), _applyDecoratedDescriptor(_obj, 'owner', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'owner'), _obj)), _obj)));
});