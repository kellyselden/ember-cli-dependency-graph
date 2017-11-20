define('travis/components/env-var', ['exports', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed', 'ember-concurrency'], function (exports, _service, _object, _computed, _emberConcurrency) {
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

  var _dec, _dec2, _desc, _value, _obj, _init, _init2;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('public'), _dec2 = (0, _object.computed)('envVar.{value,public}'), (_obj = { flashes: null,

    tagName: 'li',
    classNames: ['settings-envvar'],
    classNameBindings: ['envVar.public:is-public', 'envVar.newlyCreated:newly-created'],
    validates: { name: ['presence'] },
    actionType: 'Save',
    showValueField: null,

    value: function value(_value2, isPublic) {
      if (isPublic) {
        return _value2;
      }
      return '••••••••••••••••';
    },


    delete: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var _this = this;

      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return this.get('envVar').destroyRecord().catch(function (_ref) {
                var errors = _ref.errors;

                if (errors.any(function (error) {
                  return error.status == '404';
                })) {
                  _this.get('flashes').error('This environment variable has already been deleted.' + ' Try refreshing.');
                } else {
                  _this.get('flashes').error('There was an error deleting this environment variable.');
                }
              });

            case 2:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop()
  }, (_applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'showValueField', [_dec], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'showValueField'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'value', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'value'), _obj)), _obj)));
});