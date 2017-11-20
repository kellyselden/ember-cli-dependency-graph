define('travis/components/queued-jobs', ['exports', 'travis/config/environment', 'npm:visibilityjs', 'ember-decorators/service'], function (exports, _environment, _npmVisibilityjs, _service) {
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

  var _dec, _desc, _value, _obj, _init, _init2;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _service.service)('updateTimes'), (_obj = { store: null,
    updateTimesService: null,

    init: function init() {
      this._super.apply(this, arguments);
      if (!Ember.testing) {
        return _npmVisibilityjs.default.every(_environment.default.intervals.updateTimes, this.updateTimes.bind(this));
      }
    },
    updateTimes: function updateTimes() {
      this.get('updateTimesService').push(this.get('jobs'));
    }
  }, (_applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'store'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'updateTimesService', [_dec], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'updateTimesService'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj)), _obj)));
});