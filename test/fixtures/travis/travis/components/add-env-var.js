define('travis/components/add-env-var', ['exports', 'ember-decorators/service', 'ember-concurrency'], function (exports, _service, _emberConcurrency) {
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

  var _desc, _value, _obj, _init, _init2, _init3;

  var isBlank = Ember.isBlank;
  var Component = Ember.Component;
  exports.default = Component.extend((_obj = { store: null,
    raven: null,
    flashes: null,

    classNames: ['form--envvar'],
    classNameBindings: ['nameIsBlank:form-error'],

    isValid: function isValid() {
      if (isBlank(this.get('name'))) {
        this.set('nameIsBlank', true);
        return false;
      } else {
        return true;
      }
    },
    reset: function reset() {
      return this.setProperties({
        name: null,
        value: null,
        'public': null
      });
    },


    save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var envVar;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!this.isValid()) {
                _context.next = 12;
                break;
              }

              envVar = this.get('store').createRecord('env_var', {
                name: this.get('name').trim(),
                value: this.get('value').trim(),
                'public': this.get('public'),
                repo: this.get('repo')
              });
              _context.prev = 2;
              _context.next = 5;
              return envVar.save().then(function (saved) {
                return saved.set('newlyCreated', true);
              });

            case 5:
              this.reset();
              _context.next = 12;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context['catch'](2);

              // eslint-disable-next-line
              this.get('flashes').error('There was an error saving this environment variable.');
              this.get('raven').logException(_context.t0);

            case 12:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[2, 8]]);
    })).drop(),

    actions: {
      nameChanged: function nameChanged() {
        return this.set('nameIsBlank', false);
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'store'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'raven', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'raven'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'flashes', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'flashes'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj)), _obj));
});