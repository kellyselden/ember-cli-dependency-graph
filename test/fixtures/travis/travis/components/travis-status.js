define('travis/components/travis-status', ['exports', 'travis/config/environment', 'ember-decorators/object'], function (exports, _environment, _object) {
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

  var $ = Ember.$;
  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)(), (_obj = {
    status: null,

    statusPageStatusUrl: function statusPageStatusUrl() {
      return _environment.default.statusPageStatusUrl;
    },
    didInsertElement: function didInsertElement() {
      var _this = this;

      var url = this.get('statusPageStatusUrl');
      if (url) {
        return this.getStatus(url).then(function (response) {
          if (response.status && response.status.indicator) {
            return _this.set('status', response.status.indicator);
          }
        });
      }
    },
    getStatus: function getStatus(url) {
      return $.ajax(url);
    }
  }, (_applyDecoratedDescriptor(_obj, 'statusPageStatusUrl', [_dec], Object.getOwnPropertyDescriptor(_obj, 'statusPageStatusUrl'), _obj)), _obj)));
});