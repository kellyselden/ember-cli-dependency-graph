define('travis/services/feature-flags', ['exports', 'ember-concurrency', 'ember-decorators/service'], function (exports, _emberConcurrency, _service) {
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

  var Service = Ember.Service;
  exports.default = Service.extend((_obj = { store: null,
    features: null,

    serverFlags: [],

    /* The fetchTask is called multiple times as we traverse the route heirarchy.
     * This is because we're leveraging the beforeModel hook to avoid blocking
     * rendering.
     * To compensate for the fact that this is called multiple times, we simply
     * drop repeated attempts to fetch the feature data. Given how fast we
     * transition, this is a decent interim solution. */

    fetchTask: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var featureSet, featuresService;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.get('store').findAll('beta-feature');

            case 2:
              featureSet = _context.sent;

              this.set('serverFlags', featureSet);
              featuresService = this.get('features');

              featureSet.map(function (feature) {
                // this means that non-single-word feature names will turn
                // 'comic sans' into 'comic-sans'. This may/may not work as expected.
                // TODO: Confirm that this won't break if we add a feature name with
                // spaces.
                var featureName = feature.get('dasherizedName');
                if (feature.get('enabled')) {
                  featuresService.enable(featureName);
                } else {
                  featuresService.disable(featureName);
                }
              });

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),

    reset: function reset() {
      var _this = this;

      this.get('serverFlags').map(function (flag) {
        _this.get('features').disable(flag.get('name').dasherize());
      });
    }
  }, (_applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'store'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'features', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'features'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj)), _obj));
});