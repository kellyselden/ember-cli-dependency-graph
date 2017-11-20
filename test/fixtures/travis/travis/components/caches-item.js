define('travis/components/caches-item', ['exports', 'travis/config/environment', 'ember-decorators/service', 'ember-concurrency'], function (exports, _environment, _service, _emberConcurrency) {
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
  exports.default = Component.extend((_obj = { ajax: null,

    tagName: 'li',
    classNames: ['cache-item'],
    classNameBindings: ['cache.type'],

    delete: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var data, repo;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(_environment.default.skipConfirmations || confirm('Are you sure?'))) {
                _context.next = 6;
                break;
              }

              data = {
                branch: this.get('cache.branch')
              };
              repo = this.get('repo');
              _context.next = 5;
              return this.get('ajax').ajax('/repos/' + repo.get('id') + '/caches', 'DELETE', { data: data });

            case 5:
              return _context.abrupt('return', this.get('caches').removeObject(this.get('cache')));

            case 6:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),

    actions: {
      performDelete: function performDelete() {
        this.get('delete').perform();
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});