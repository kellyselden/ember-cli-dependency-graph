define('travis/controllers/plans', ['exports', 'travis/config/environment', 'ember-decorators/object'], function (exports, _environment, _object) {
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

  var _desc, _value, _obj;

  var Controller = Ember.Controller;
  exports.default = Controller.extend((_obj = {
    gaCta: function gaCta(location) {
      if (_environment.default.gaCode) {
        var page = '/virtual/signup?' + location;
        _gaq.push(['_trackPageview', page]);
      }
      this.auth.signIn();
    }
  }, (_applyDecoratedDescriptor(_obj, 'gaCta', [_object.action], Object.getOwnPropertyDescriptor(_obj, 'gaCta'), _obj)), _obj));
});