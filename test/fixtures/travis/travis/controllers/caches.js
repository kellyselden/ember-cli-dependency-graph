define('travis/controllers/caches', ['exports', 'travis/config/environment', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed', 'ember-concurrency'], function (exports, _environment, _service, _object, _computed, _emberConcurrency) {
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

  var EmberObject = Ember.Object;
  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _computed.alias)('model.repo'), _dec2 = (0, _object.computed)('model.pushes.[]', 'model.pullRequests.[]'), (_obj = { ajax: null,

    repo: null,

    cachesExist: function cachesExist(pushes, pullRequests) {
      if (pushes || pullRequests) {
        return pushes.length || pullRequests.length;
      }
    },


    deleteRepoCache: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!(_environment.default.skipConfirmations || confirm('Are you sure?'))) {
                _context.next = 9;
                break;
              }

              _context.prev = 1;
              _context.next = 4;
              return this.get('ajax').ajax('/repos/' + this.get('repo.id') + '/caches', 'DELETE');

            case 4:
              _context.next = 8;
              break;

            case 6:
              _context.prev = 6;
              _context.t0 = _context['catch'](1);

            case 8:

              this.set('model', EmberObject.create());

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this, [[1, 6]]);
    })).drop()
  }, (_applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'repo', [_dec], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'repo'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'cachesExist', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'cachesExist'), _obj)), _obj)));
});