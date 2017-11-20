define('travis/components/build-layout', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _desc, _value, _obj, _init, _init2;

  var sort = Ember.computed.sort;
  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('build.jobs.firstObject'), _dec2 = (0, _object.computed)('build.jobs.[]'), _dec3 = (0, _computed.alias)('build.isLoading'), _dec4 = (0, _object.computed)('build.jobs.@each.configLoaded', 'build.jobs.@each.isLoaded', 'build.stagesAreLoaded'), (_obj = { job: null,

    noJobsError: function noJobsError(jobs) {
      return jobs.get('length') === 0;
    },
    loading: null,

    jobsLoaded: function jobsLoaded(jobs, _, stagesAreLoaded) {
      jobs.forEach(function (j) {
        return j.get('config');
      });
      return jobs.isEvery('configLoaded') && jobs.isEvery('isLoaded') && stagesAreLoaded;
    },


    buildStagesSort: ['number'],
    sortedBuildStages: sort('build.stages', 'buildStagesSort')
  }, (_applyDecoratedDescriptor(_obj, 'job', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'job'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'noJobsError', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'noJobsError'), _obj), _applyDecoratedDescriptor(_obj, 'loading', [_dec3], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'loading'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'jobsLoaded', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'jobsLoaded'), _obj)), _obj)));
});