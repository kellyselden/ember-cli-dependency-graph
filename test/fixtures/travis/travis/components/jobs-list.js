define('travis/components/jobs-list', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _desc, _value, _obj, _init;

  var get = Ember.get;
  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('required'), _dec2 = (0, _object.computed)('jobs.[]', 'build.jobs.[]', 'stage'), _dec3 = (0, _computed.alias)('stage.state'), _dec4 = (0, _object.computed)('stageState'), _dec5 = (0, _object.computed)('stageState'), _dec6 = (0, _object.computed)('stage', 'stageIsLast', 'filteredJobs.@each.{state,allowFailure}'), _dec7 = (0, _object.computed)('stages', 'stage'), (_obj = {
    tagName: 'section',
    classNames: ['jobs'],
    classNameBindings: ['stage:stage'],

    jobTableId: function jobTableId(required) {
      if (required) {
        return 'jobs';
      }
      return 'allowed_failure_jobs';
    },
    filteredJobs: function filteredJobs(jobs, buildJobs, stage) {
      if (stage) {
        return buildJobs.filterBy('stage.id', stage.get('id'));
      }
      return jobs;
    },
    stageState: null,

    stageStateIcon: function stageStateIcon(stageState) {
      var icon = {
        'passed': 'passed',
        'failed': 'failed',
        'errored': 'errored',
        'canceled': 'canceled'
      }[stageState];

      if (icon) {
        return 'stage-' + icon;
      } else {
        return undefined;
      }
    },
    stageStateTitle: function stageStateTitle(stageState) {
      return 'Stage ' + stageState;
    },
    stageAllowFailuresText: function stageAllowFailuresText(stage, stageIsLast, filteredJobs) {
      if (!stage) {
        return false;
      }

      var jobsAllowedToFail = filteredJobs.filterBy('allowFailure');
      var relevantJobs = jobsAllowedToFail.filterBy('isFinished').rejectBy('state', 'passed');

      var failedJobsNotAllowedToFail = this.get('filteredJobs').rejectBy('allowFailure').filterBy('isFinished').rejectBy('state', 'passed');

      if (relevantJobs.length > 0) {
        var jobList = void 0;

        if (relevantJobs.length == 1) {
          jobList = 'job ' + relevantJobs.mapBy('number')[0];
        } else if (relevantJobs.length == 2) {
          jobList = 'jobs ' + relevantJobs.mapBy('number').join(' and ');
        } else if (relevantJobs.length > 5) {
          jobList = 'multiple jobs';
        } else {
          var firstJobs = relevantJobs.slice(0, relevantJobs.length - 1);
          var lastJob = relevantJobs[relevantJobs.length - 1];
          jobList = 'jobs ' + firstJobs.mapBy('number').join(', ') + ', ' + ('and ' + get(lastJob, 'number'));
        }

        var continuationText = '';

        if (!stageIsLast && failedJobsNotAllowedToFail.length === 0) {
          continuationText = ' so we continued this build to the next stage';
        }

        return 'Your build matrix was set to allow the failure of ' + ('' + jobList + continuationText + '.');
      }
      return false;
    },
    stageIsLast: function stageIsLast(stages, stage) {
      return stage && stages && stages.indexOf(stage) == stages.length - 1;
    }
  }, (_applyDecoratedDescriptor(_obj, 'jobTableId', [_dec], Object.getOwnPropertyDescriptor(_obj, 'jobTableId'), _obj), _applyDecoratedDescriptor(_obj, 'filteredJobs', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'filteredJobs'), _obj), _applyDecoratedDescriptor(_obj, 'stageState', [_dec3], (_init = Object.getOwnPropertyDescriptor(_obj, 'stageState'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'stageStateIcon', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'stageStateIcon'), _obj), _applyDecoratedDescriptor(_obj, 'stageStateTitle', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'stageStateTitle'), _obj), _applyDecoratedDescriptor(_obj, 'stageAllowFailuresText', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'stageAllowFailuresText'), _obj), _applyDecoratedDescriptor(_obj, 'stageIsLast', [_dec7], Object.getOwnPropertyDescriptor(_obj, 'stageIsLast'), _obj)), _obj)));
});