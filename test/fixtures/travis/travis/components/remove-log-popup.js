define('travis/components/remove-log-popup', ['exports', 'ember-decorators/service'], function (exports, _service) {
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

  var _desc, _value, _obj, _init;

  var Component = Ember.Component;
  exports.default = Component.extend((_obj = { flashes: null,

    actions: {
      removeLog: function removeLog() {
        var _this = this;

        var job = this.get('job');

        this.get('onCloseModal')();

        return job.removeLog().then(function () {
          _this.get('flashes').success('Log has been successfully removed.');
        }, function (xhr) {
          if (xhr.status === 409) {
            return _this.get('flashes').error('Log can’t be removed');
          } else if (xhr.status === 401) {
            return _this.get('flashes').error('You don’t have sufficient access to remove the log');
          } else {
            return _this.get('flashes').error('An error occurred when removing the log');
          }
        });
      },
      toggleRemoveLogModal: function toggleRemoveLogModal() {
        this.get('onCloseModal')();
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});