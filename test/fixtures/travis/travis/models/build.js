define('travis/models/build', ['exports', 'travis/utils/safelisted-config-keys', 'npm:lodash.pickby', 'travis/utils/keys-map', 'ember-data/model', 'travis/mixins/duration-calculations', 'ember-data/attr', 'ember-data/relationships', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed', 'moment'], function (exports, _safelistedConfigKeys, _npmLodash, _keysMap, _model, _durationCalculations, _attr, _relationships, _service, _object, _computed, _moment) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _desc, _value, _obj, _init, _init2, _init3, _init4;

  var all = Ember.RSVP.all;
  var isEmpty = Ember.isEmpty;
  exports.default = _model.default.extend(_durationCalculations.default, (_dec = (0, _computed.alias)('branch.name'), _dec2 = (0, _computed.alias)('stages.isSettled'), _dec3 = (0, _object.computed)('_config', 'currentState.stateName'), _dec4 = (0, _object.computed)('eventType'), _dec5 = (0, _object.computed)('jobs.[]'), _dec6 = (0, _object.computed)('tag'), _dec7 = (0, _object.computed)('state'), _dec8 = (0, _object.computed)('state'), _dec9 = (0, _object.computed)('jobs.@each.allowFailure'), _dec10 = (0, _object.computed)('jobs.@each.allowFailure'), _dec11 = (0, _object.computed)('jobs.@each.config'), _dec12 = (0, _object.computed)('rawConfigKeys.[]'), _dec13 = (0, _object.computed)('jobs.@each.canCancel'), _dec14 = (0, _computed.alias)('isFinished'), _dec15 = (0, _object.computed)('jobs.[]'), _dec16 = (0, _object.computed)('finishedAt'), (_obj = { ajax: null,

    branchName: null,

    state: (0, _attr.default)(),
    number: (0, _attr.default)('number'),
    message: (0, _attr.default)('string'),
    _duration: (0, _attr.default)('number'),
    startedAt: (0, _attr.default)('string'),
    finishedAt: (0, _attr.default)('string'),
    pullRequestNumber: (0, _attr.default)('number'),
    pullRequestTitle: (0, _attr.default)('string'),
    tag: (0, _attr.default)(),
    eventType: (0, _attr.default)('string'),
    _config: (0, _attr.default)(),
    updatedAt: (0, _attr.default)('date'),

    repo: (0, _relationships.belongsTo)('repo'),
    branch: (0, _relationships.belongsTo)('branch', { async: false, inverse: 'builds' }),
    repoCurrentBuild: (0, _relationships.belongsTo)('repo', { async: true, inverse: 'currentBuild' }),
    commit: (0, _relationships.belongsTo)('commit', { async: false }),

    jobs: (0, _relationships.hasMany)('job', { async: true }),
    stages: (0, _relationships.hasMany)('stage', { async: true }),

    stagesAreLoaded: null,

    config: function config(_config, stateName) {
      if (_config) {
        return (0, _npmLodash.default)(_config);
      } else if (stateName !== 'root.loading') {
        if (this.get('isFetchingConfig')) {
          return;
        }
        this.set('isFetchingConfig', true);
        return this.reload();
      }
    },
    isPullRequest: function isPullRequest(eventType) {
      return eventType === 'pull_request';
    },
    isMatrix: function isMatrix(jobs) {
      return jobs.get('length') > 1;
    },
    isTag: function isTag(tag) {
      return tag && tag.name;
    },
    isFinished: function isFinished(state) {
      var finishedStates = ['passed', 'failed', 'errored', 'canceled'];
      return finishedStates.includes(state);
    },
    notStarted: function notStarted(state) {
      var waitingStates = ['queued', 'created', 'received'];
      return waitingStates.includes(state);
    },
    requiredJobs: function requiredJobs(jobs) {
      return jobs.filter(function (job) {
        return !job.get('allowFailure');
      });
    },
    allowedFailureJobs: function allowedFailureJobs(jobs) {
      return jobs.filter(function (job) {
        return job.get('allowFailure');
      });
    },
    rawConfigKeys: function rawConfigKeys(jobs) {
      var keys = [];
      jobs.forEach(function (job) {
        var configKeys = (0, _safelistedConfigKeys.default)(job.get('config'));
        return configKeys.forEach(function (key) {
          if (!keys.includes(key)) {
            return keys.pushObject(key);
          }
        });
      });
      return keys;
    },
    configKeys: function configKeys(keys) {
      var headers = ['Job', 'Duration', 'Finished'];
      return headers.concat(keys).map(function (key) {
        if (_keysMap.default.hasOwnProperty(key)) {
          return _keysMap.default[key];
        } else {
          return key;
        }
      });
    },
    canCancel: function canCancel(jobs) {
      return !isEmpty(jobs.filterBy('canCancel'));
    },
    canRestart: null,

    cancel: function cancel() {
      var url = '/build/' + this.get('id') + '/cancel';
      return this.get('ajax').postV3(url);
    },
    restart: function restart() {
      var url = '/build/' + this.get('id') + '/restart';
      return this.get('ajax').postV3(url);
    },
    canDebug: function canDebug(jobs) {
      return jobs.get('length') === 1;
    },
    debug: function debug() {
      return all(this.get('jobs').map(function (job) {
        return job.debug();
      }));
    },
    formattedFinishedAt: function formattedFinishedAt(finishedAt) {
      if (finishedAt) {
        var m = (0, _moment.default)(finishedAt);
        return m.isValid() ? m.format('lll') : 'not finished yet';
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'branchName', [_dec], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'branchName'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'stagesAreLoaded', [_dec2], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'stagesAreLoaded'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'config', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'config'), _obj), _applyDecoratedDescriptor(_obj, 'isPullRequest', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'isPullRequest'), _obj), _applyDecoratedDescriptor(_obj, 'isMatrix', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'isMatrix'), _obj), _applyDecoratedDescriptor(_obj, 'isTag', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'isTag'), _obj), _applyDecoratedDescriptor(_obj, 'isFinished', [_dec7], Object.getOwnPropertyDescriptor(_obj, 'isFinished'), _obj), _applyDecoratedDescriptor(_obj, 'notStarted', [_dec8], Object.getOwnPropertyDescriptor(_obj, 'notStarted'), _obj), _applyDecoratedDescriptor(_obj, 'requiredJobs', [_dec9], Object.getOwnPropertyDescriptor(_obj, 'requiredJobs'), _obj), _applyDecoratedDescriptor(_obj, 'allowedFailureJobs', [_dec10], Object.getOwnPropertyDescriptor(_obj, 'allowedFailureJobs'), _obj), _applyDecoratedDescriptor(_obj, 'rawConfigKeys', [_dec11], Object.getOwnPropertyDescriptor(_obj, 'rawConfigKeys'), _obj), _applyDecoratedDescriptor(_obj, 'configKeys', [_dec12], Object.getOwnPropertyDescriptor(_obj, 'configKeys'), _obj), _applyDecoratedDescriptor(_obj, 'canCancel', [_dec13], Object.getOwnPropertyDescriptor(_obj, 'canCancel'), _obj), _applyDecoratedDescriptor(_obj, 'canRestart', [_dec14], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'canRestart'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'canDebug', [_dec15], Object.getOwnPropertyDescriptor(_obj, 'canDebug'), _obj), _applyDecoratedDescriptor(_obj, 'formattedFinishedAt', [_dec16], Object.getOwnPropertyDescriptor(_obj, 'formattedFinishedAt'), _obj)), _obj)));
});