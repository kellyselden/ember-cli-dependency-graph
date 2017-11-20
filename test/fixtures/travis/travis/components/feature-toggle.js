define('travis/components/feature-toggle', ['exports', 'ember-concurrency', 'ember-decorators/service'], function (exports, _emberConcurrency, _service) {
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

  var _desc, _value, _obj, _init, _init2;

  var Component = Ember.Component;
  exports.default = Component.extend((_obj = { features: null,
    flashes: null,

    tagName: 'a',
    classNames: ['switch'],
    classNameBindings: ['feature.enabled:active', 'disabled:disabled', 'disabled:inline-block'],

    click: function click() {
      this.get('toggleFeatureTask').perform(this.get('feature'));
    },


    toggleFeatureTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee(feature) {
      var _this = this;

      var errMsg;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;

              feature.toggleProperty('enabled');
              _context.next = 4;
              return feature.save().then(function (feature) {
                _this.applyFeatureState(feature);
              });

            case 4:
              _context.next = 10;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context['catch'](0);
              errMsg = 'There was an error while switching the feature. Please try again.';

              this.get('flashes').error(errMsg);

            case 10:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[0, 6]]);
    })),

    applyFeatureState: function applyFeatureState(feature) {
      var _feature$getPropertie = feature.getProperties('name', 'enabled'),
          name = _feature$getPropertie.name,
          enabled = _feature$getPropertie.enabled;

      if (enabled) {
        this.get('features').enable(name);
      } else {
        this.get('features').disable(name);
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'features', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'features'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj)), _obj));
});