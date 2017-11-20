define('travis/components/settings-switch', ['exports', 'ember-decorators/service', 'ember-concurrency', 'ember-decorators/object'], function (exports, _service, _emberConcurrency, _object) {
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
  exports.default = Component.extend((_dec = (0, _object.computed)('active'), (_obj = { flashes: null,

    tagName: 'button',
    classNames: ['switch'],
    classNameBindings: ['active', 'key'],

    attributeBindings: ['aria-checked', 'role'],

    role: 'switch',

    'aria-checked': function ariaChecked(active) {
      if (active) {
        return 'true';
      } else {
        return 'false';
      }
    },


    save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var futureState;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              // try saving with the new state, only change local state if successful
              futureState = !this.get('active');
              _context.next = 4;
              return this.get('repo').saveSetting(this.get('key'), futureState);

            case 4:
              this.toggleProperty('active');
              _context.next = 10;
              break;

            case 7:
              _context.prev = 7;
              _context.t0 = _context['catch'](0);

              this.get('flashes').error('There was an error while saving your settings. Please try again.');

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 7]]);
    })).drop(),

    click: function click() {
      this.get('save').perform();
    }
  }, (_applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'aria-checked', [_dec], Object.getOwnPropertyDescriptor(_obj, 'aria-checked'), _obj)), _obj)));
});