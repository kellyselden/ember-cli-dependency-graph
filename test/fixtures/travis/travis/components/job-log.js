define('travis/components/job-log', ['exports', 'ember-decorators/object/computed'], function (exports, _computed) {
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
  exports.default = Component.extend((_dec = (0, _computed.alias)('job.log'), (_obj = { log: null,

    classNames: ['job-log'],

    didReceiveAttrs: function didReceiveAttrs() {
      var oldJob = this.get('_oldJob');
      var newJob = this.get('job');

      if (newJob !== oldJob) {
        if (newJob) {
          this.setupLog(newJob);
        }

        if (oldJob) {
          this.teardownLog(oldJob);
        }
      }

      this.set('_oldJob', this.get('job'));
    },
    teardownLog: function teardownLog(job) {
      job.unsubscribe();
    },
    setupLog: function setupLog(job) {
      var _this = this;

      this.set('error', false);
      job.get('log').fetch().then(function () {}, function () {
        _this.set('error', true);
      });
      job.subscribe();
    }
  }, (_applyDecoratedDescriptor(_obj, 'log', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'log'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj)));
});