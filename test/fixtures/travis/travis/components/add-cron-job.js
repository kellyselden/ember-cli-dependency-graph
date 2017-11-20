define('travis/components/add-cron-job', ['exports', 'ember-decorators/service', 'ember-concurrency'], function (exports, _service, _emberConcurrency) {
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
  exports.default = Component.extend((_obj = { store: null,

    classNames: ['form--cron'],

    reset: function reset() {
      this.setProperties({
        selectedBranch: null,
        selectedInterval: null,
        disable: null
      });
    },


    save: (0, _emberConcurrency.task)( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
      var store, repoId, branch, existingCrons, cron;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              store = this.get('store');
              repoId = this.get('branches.firstObject.repoId');
              branch = this.get('selectedBranch') || this.get('branches.firstObject');
              _context.next = 5;
              return store.filter('cron', { repository_id: repoId }, function (c) {
                c.get('branch.repoId') === repoId && c.get('branch.name') === branch.get('name');
              });

            case 5:
              existingCrons = _context.sent;


              if (existingCrons.get('firstObject')) {
                store.unloadRecord(existingCrons.get('firstObject'));
              }

              cron = store.createRecord('cron', {
                branch: branch,
                interval: this.get('selectedInterval') || 'monthly',
                dont_run_if_recent_build_exists: this.get('selectedOption') || false
              });


              this.reset();

              _context.next = 11;
              return cron.save();

            case 11:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    })).drop(),

    intervals: ['monthly', 'weekly', 'daily'],

    options: ['Always run', 'Do not run if there has been a build in the last 24h']
  }, (_applyDecoratedDescriptor(_obj, 'store', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'store'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});