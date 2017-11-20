define('travis/models/job', ['exports', 'ember-data/model', 'travis/models/log', 'travis/mixins/duration-calculations', 'travis/mixins/duration-attributes', 'ember-data/attr', 'ember-data/relationships', 'ember-decorators/object', 'ember-decorators/object/computed', 'ember-decorators/service', 'moment'], function (exports, _model, _log, _durationCalculations, _durationAttributes, _attr, _relationships, _object, _computed, _service, _moment) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6, _init7, _init8, _init9, _init10, _init11, _init12, _init13, _init14;

  var observer = Ember.observer;
  var EmberPromise = Ember.RSVP.Promise;
  var isEqual = Ember.isEqual;
  var getOwner = Ember.getOwner;
  exports.default = _model.default.extend(_durationCalculations.default, _durationAttributes.default, (_dec = (0, _computed.alias)('build.isPullRequest'), _dec2 = (0, _computed.alias)('build.pullRequestNumber'), _dec3 = (0, _computed.alias)('build.pullRequestTitle'), _dec4 = (0, _computed.alias)('build.branch'), _dec5 = (0, _computed.alias)('build.branchName'), _dec6 = (0, _computed.alias)('build.isTag'), _dec7 = (0, _computed.alias)('build.tag'), _dec8 = (0, _computed.alias)('build.eventType'), _dec9 = (0, _object.computed)(), _dec10 = (0, _computed.alias)('config.content'), _dec11 = (0, _object.computed)(), _dec12 = (0, _object.computed)('state'), _dec13 = (0, _object.computed)('state'), _dec14 = (0, _object.computed)('state'), _dec15 = (0, _object.computed)('state'), _dec16 = (0, _object.computed)('isFinished', 'state'), _dec17 = (0, _computed.alias)('isFinished'), _dec18 = (0, _computed.alias)('isFinished'), _dec19 = (0, _object.computed)('repo.private', 'id'), _dec20 = (0, _object.computed)('finishedAt'), _dec21 = (0, _computed.not)('log.removed'), _dec22 = (0, _object.computed)('repo.slug', 'number'), (_obj = { ajax: null,
    jobConfigFetcher: null,

    logId: (0, _attr.default)(),
    queue: (0, _attr.default)(),
    state: (0, _attr.default)(),
    number: (0, _attr.default)(),
    allowFailure: (0, _attr.default)('boolean'),
    tags: (0, _attr.default)(),
    repositoryPrivate: (0, _attr.default)(),
    repositorySlug: (0, _attr.default)(),
    updatedAt: (0, _attr.default)('date'),

    repo: (0, _relationships.belongsTo)('repo'),
    build: (0, _relationships.belongsTo)('build', { async: true }),
    commit: (0, _relationships.belongsTo)('commit', { async: true }),
    stage: (0, _relationships.belongsTo)('stage', { async: true }),

    isPullRequest: null,
    pullRequestNumber: null,
    pullRequestTitle: null,
    branch: null,
    branchName: null,
    isTag: null,
    tag: null,
    eventType: null,

    log: function log() {
      this.set('isLogAccessed', true);
      return _log.default.create({
        job: this,
        ajax: this.get('ajax'),
        container: getOwner(this)
      });
    },
    configLoaded: null,

    config: function config() {
      return this.get('jobConfigFetcher').fetch(this.get('id'));
    },
    getCurrentState: function getCurrentState() {
      return this.get('currentState.stateName');
    },
    isFinished: function isFinished(state) {
      var finishedStates = ['passed', 'failed', 'errored', 'canceled'];
      return finishedStates.includes(state);
    },
    toBeQueued: function toBeQueued(state) {
      var queuedState = 'created';
      return isEqual(state, queuedState);
    },
    toBeStarted: function toBeStarted(state) {
      var waitingStates = ['queued', 'received'];
      return waitingStates.includes(state);
    },
    notStarted: function notStarted(state) {
      var waitingStates = ['queued', 'created', 'received'];
      return waitingStates.includes(state);
    },
    clearLog: function clearLog() {
      if (this.get('isLogAccessed')) {
        return this.get('log').clear();
      }
    },
    canCancel: function canCancel(isFinished, state) {
      // not(isFinished) is insufficient since it will be true when state is undefined.
      return !isFinished && !!state;
    },
    canRestart: null,
    canDebug: null,

    cancel: function cancel() {
      var url = '/job/' + this.get('id') + '/cancel';
      return this.get('ajax').postV3(url);
    },
    removeLog: function removeLog() {
      var _this = this;

      var url = '/jobs/' + this.get('id') + '/log';
      return this.get('ajax').patch(url).then(function () {
        return _this.reloadLog();
      });
    },
    reloadLog: function reloadLog() {
      this.clearLog();
      return this.get('log').fetch();
    },
    restart: function restart() {
      var url = '/job/' + this.get('id') + '/restart';
      return this.get('ajax').postV3(url);
    },
    debug: function debug() {
      var url = '/job/' + this.get('id') + '/debug';
      return this.get('ajax').postV3(url, { quiet: true });
    },
    appendLog: function appendLog(part) {
      return this.get('log').append(part);
    },
    whenLoaded: function whenLoaded(callback) {
      var _this2 = this;

      new EmberPromise(function (resolve, reject) {
        _this2.whenLoadedCallbacks = _this2.whenLoadedCallbacks || [];
        if (_this2.get('isLoaded')) {
          resolve();
        } else {
          _this2.whenLoadedCallbacks.push(resolve);
        }
      }).then(function () {
        return callback(_this2);
      });
    },


    didLoad: function () {
      var _this3 = this;

      (this.whenLoadedCallbacks || []).forEach(function (callback) {
        callback(_this3);
      });
    }.on('didLoad'),

    subscribe: function subscribe() {
      var _this4 = this;

      // TODO: this is needed only because we may reach this place with a job that
      //       is not fully loaded yet. A better solution would be to ensure that
      //       we call subscribe only when the job is loaded, but I think that
      //       would require a bigger refactoring.
      this.whenLoaded(function () {
        if (_this4.get('subscribed')) {
          return;
        }

        _this4.set('subscribed', true);

        _this4.get('repo').then(function (repo) {
          return Travis.pusher.subscribe(_this4.get('channelName'));
        });
      });
    },
    channelName: function channelName(isRepoPrivate, id) {
      var prefix = isRepoPrivate ? 'private-job' : 'job';
      return prefix + '-' + id;
    },
    unsubscribe: function unsubscribe() {
      var _this5 = this;

      this.whenLoaded(function () {
        if (!_this5.get('subscribed')) {
          return;
        }
        _this5.set('subscribed', false);
        if (Travis.pusher) {
          var channel = 'job-' + _this5.get('id');
          return Travis.pusher.unsubscribe(channel);
        }
      });
    },


    onStateChange: observer('state', function () {
      if (this.get('state') === 'finished' && Travis.pusher) {
        return this.unsubscribe();
      }
    }),

    formattedFinishedAt: function formattedFinishedAt(finishedAt) {
      if (finishedAt) {
        var m = (0, _moment.default)(finishedAt);
        return m.isValid() ? m.format('lll') : 'not finished yet';
      }
    },
    canRemoveLog: null,

    slug: function slug(_slug, number) {
      return _slug + ' #' + number;
    }
  }, (_applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'jobConfigFetcher', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'jobConfigFetcher'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isPullRequest', [_dec], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'isPullRequest'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'pullRequestNumber', [_dec2], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'pullRequestNumber'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'pullRequestTitle', [_dec3], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'pullRequestTitle'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'branch', [_dec4], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'branch'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'branchName', [_dec5], (_init7 = Object.getOwnPropertyDescriptor(_obj, 'branchName'), _init7 = _init7 ? _init7.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init7;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isTag', [_dec6], (_init8 = Object.getOwnPropertyDescriptor(_obj, 'isTag'), _init8 = _init8 ? _init8.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init8;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tag', [_dec7], (_init9 = Object.getOwnPropertyDescriptor(_obj, 'tag'), _init9 = _init9 ? _init9.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init9;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'eventType', [_dec8], (_init10 = Object.getOwnPropertyDescriptor(_obj, 'eventType'), _init10 = _init10 ? _init10.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init10;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'log', [_dec9], Object.getOwnPropertyDescriptor(_obj, 'log'), _obj), _applyDecoratedDescriptor(_obj, 'configLoaded', [_dec10], (_init11 = Object.getOwnPropertyDescriptor(_obj, 'configLoaded'), _init11 = _init11 ? _init11.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init11;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'config', [_dec11], Object.getOwnPropertyDescriptor(_obj, 'config'), _obj), _applyDecoratedDescriptor(_obj, 'isFinished', [_dec12], Object.getOwnPropertyDescriptor(_obj, 'isFinished'), _obj), _applyDecoratedDescriptor(_obj, 'toBeQueued', [_dec13], Object.getOwnPropertyDescriptor(_obj, 'toBeQueued'), _obj), _applyDecoratedDescriptor(_obj, 'toBeStarted', [_dec14], Object.getOwnPropertyDescriptor(_obj, 'toBeStarted'), _obj), _applyDecoratedDescriptor(_obj, 'notStarted', [_dec15], Object.getOwnPropertyDescriptor(_obj, 'notStarted'), _obj), _applyDecoratedDescriptor(_obj, 'canCancel', [_dec16], Object.getOwnPropertyDescriptor(_obj, 'canCancel'), _obj), _applyDecoratedDescriptor(_obj, 'canRestart', [_dec17], (_init12 = Object.getOwnPropertyDescriptor(_obj, 'canRestart'), _init12 = _init12 ? _init12.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init12;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'canDebug', [_dec18], (_init13 = Object.getOwnPropertyDescriptor(_obj, 'canDebug'), _init13 = _init13 ? _init13.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init13;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'channelName', [_dec19], Object.getOwnPropertyDescriptor(_obj, 'channelName'), _obj), _applyDecoratedDescriptor(_obj, 'formattedFinishedAt', [_dec20], Object.getOwnPropertyDescriptor(_obj, 'formattedFinishedAt'), _obj), _applyDecoratedDescriptor(_obj, 'canRemoveLog', [_dec21], (_init14 = Object.getOwnPropertyDescriptor(_obj, 'canRemoveLog'), _init14 = _init14 ? _init14.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init14;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'slug', [_dec22], Object.getOwnPropertyDescriptor(_obj, 'slug'), _obj)), _obj)));
});