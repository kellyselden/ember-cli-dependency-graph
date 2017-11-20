define('travis/services/job-config-fetcher', ['exports', 'ember-decorators/service'], function (exports, _service) {
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

  var once = Ember.run.once;
  var EmberPromise = Ember.RSVP.Promise;
  var Service = Ember.Service;
  var PromiseProxyMixin = Ember.PromiseProxyMixin;
  var ObjectProxy = Ember.ObjectProxy;
  exports.default = Service.extend((_obj = { ajax: null,

    init: function init() {
      this.promisesByJobId = {};
      this.resolvesByJobId = {};
      return this._super.apply(this, arguments);
    },
    fetch: function fetch(jobId) {
      var _this = this;

      if (this.promisesByJobId[jobId]) {
        return this.promisesByJobId[jobId];
      } else {
        var promise = new EmberPromise(function (resolve, reject) {
          _this.resolvesByJobId[jobId] = resolve;
        });
        this.promisesByJobId[jobId] = promise;
        once(this, 'flush');

        var PromiseObject = ObjectProxy.extend(PromiseProxyMixin);
        return PromiseObject.create({ promise: promise });
      }
    },
    flush: function flush() {
      var resolvesByJobId = this.resolvesByJobId;
      this.promisesByJobId = {};
      this.resolvesByJobId = {};
      var jobIds = Object.keys(resolvesByJobId);
      this.get('ajax').ajax('/jobs', 'GET', { data: { ids: jobIds } }).then(function (data) {
        data.jobs.forEach(function (jobData) {
          resolvesByJobId[jobData.id.toString()](jobData.config);
        });
      });
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