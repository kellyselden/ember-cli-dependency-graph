define('travis/components/build-tile', ['exports', 'ember-decorators/object'], function (exports, _object) {
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

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('build.{number,state}'), (_obj = {
    tagName: 'li',
    classNameBindings: ['build.state'],
    attributeBindings: ['title'],

    title: function title(number, state) {
      if (number) {
        return 'Build #' + number + ' ' + state;
      } else {
        return '';
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'title', [_dec], Object.getOwnPropertyDescriptor(_obj, 'title'), _obj)), _obj)));
});