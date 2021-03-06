define('travis/components/cron-job', ['exports', 'ember-decorators/service', 'ember-decorators/object', 'ember-concurrency'], function (exports, _service, _object, _emberConcurrency) {
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

  var _dec, _desc, _value, _obj, _init;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('cron.dont_run_if_recent_build_exists'), (_obj = { store: null,

    tagName: 'li',
    classNames: ['settings-cron'],
    actionType: 'Save',

    dontRunIfRecentBuildExists: function dontRunIfRecentBuildExists(dontRun) {
      if (dontRun) {
        return 'Do not run if there has been a build in the last 24h';
      }
      return 'Always run';
    },


    delete: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.get('cron').destroyRecord();

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop()
  }, (_applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'store'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'dontRunIfRecentBuildExists', [_dec], Object.getOwnPropertyDescriptor(_obj, 'dontRunIfRecentBuildExists'), _obj)), _obj)));
});