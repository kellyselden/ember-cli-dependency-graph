define('travis/components/user-avatar', ['exports', 'ember-decorators/object'], function (exports, _object) {
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

  var _dec, _dec2, _dec3, _desc, _value, _obj;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('name'), _dec2 = (0, _object.computed)('url', 'size'), _dec3 = (0, _object.computed)('url', 'size'), (_obj = {
    tagName: 'span',
    classNameBindings: ['small:avatar--small:avatar'],

    userInitials: function userInitials(name) {
      if (name) {
        var arr = name.split(' ');
        var initials = '';

        if (arr.length >= 2) {
          initials = arr[0].split('')[0] + arr[1].split('')[0];
        } else {
          initials = arr[0].split('')[0];
        }
        return initials;
      }
    },
    avatarUrl: function avatarUrl(url, size) {
      if (!size) {
        size = 32;
      }
      var sizeParam = '&s=' + size;
      if (url.includes('?v=3')) {
        return '' + url + sizeParam;
      } else {
        return url + '?v=3&s=' + size;
      }
    },
    highResAvatarUrl: function highResAvatarUrl(url, size) {
      if (!size) {
        size = 32;
      }
      size = size * 2; // high-dpi
      var sizeParam = '&s=' + size;
      if (url.includes('?v=3')) {
        return '' + url + sizeParam;
      } else {
        return url + '?v=3&s=' + size;
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'userInitials', [_dec], Object.getOwnPropertyDescriptor(_obj, 'userInitials'), _obj), _applyDecoratedDescriptor(_obj, 'avatarUrl', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'avatarUrl'), _obj), _applyDecoratedDescriptor(_obj, 'highResAvatarUrl', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'highResAvatarUrl'), _obj)), _obj)));
});