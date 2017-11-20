define('travis/components/limit-concurrent-builds', ['exports', 'ember-decorators/object', 'ember-concurrency'], function (exports, _object, _emberConcurrency) {
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

  var debounce = Ember.run.debounce;
  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('enabled'), (_obj = {
    classNames: ['limit-concurrent-builds'],

    description: function description(enabled) {
      var description = 'Limit concurrent jobs';
      if (enabled) {
        description += '  ';
      }
      return description;
    },
    limitChanged: function limitChanged(value) {
      var _this = this;

      var limit = void 0,
          repo = void 0,
          savingFinished = void 0;
      repo = this.get('repo');
      limit = parseInt(value);
      if (limit) {
        this.set('isSaving', true);
        savingFinished = function savingFinished() {
          _this.set('isSaving', false);
        };
        this.set('value', value);
        return repo.saveSetting('maximum_number_of_builds', limit).then(savingFinished, savingFinished);
      }
    },


    toggle: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(!this.get('enabled') && this.get('value') !== 0)) {
                _context.next = 11;
                break;
              }

              _context.prev = 1;
              _context.next = 4;
              return this.get('repo').saveSetting('maximum_number_of_builds', 0);

            case 4:
              _context.next = 10;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context['catch'](1);

              // eslint-disable-next-line
              this.get('flashes').error('There was an error disabling the concurrent jobs limit.');
              this.get('raven').logException(_context.t0);

            case 10:

              this.set('value', 0);

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 6]]);
    })).drop(),

    actions: {
      limitChanged: function limitChanged() {
        return debounce(this, 'limitChanged', 1000);
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'description', [_dec], Object.getOwnPropertyDescriptor(_obj, 'description'), _obj)), _obj)));
});