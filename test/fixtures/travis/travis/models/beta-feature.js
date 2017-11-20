define('travis/models/beta-feature', ['exports', 'ember-data', 'ember-data/attr', 'ember-decorators/object'], function (exports, _emberData, _attr, _object) {
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

  var dasherize = Ember.String.dasherize;
  exports.default = _emberData.default.Model.extend((_dec = (0, _object.computed)('name'), _dec2 = (0, _object.computed)('dasherizedName'), (_obj = {
    name: (0, _attr.default)('string'),
    description: (0, _attr.default)('string'),
    enabled: (0, _attr.default)('boolean'),
    feedbackUrl: (0, _attr.default)('string'),

    dasherizedName: function dasherizedName(name) {
      return dasherize(name);
    },
    displayName: function displayName(name) {
      return name.split('-').map(function (x) {
        return x.capitalize();
      }).join(' ');
    }
  }, (_applyDecoratedDescriptor(_obj, 'dasherizedName', [_dec], Object.getOwnPropertyDescriptor(_obj, 'dasherizedName'), _obj), _applyDecoratedDescriptor(_obj, 'displayName', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'displayName'), _obj)), _obj)));
});