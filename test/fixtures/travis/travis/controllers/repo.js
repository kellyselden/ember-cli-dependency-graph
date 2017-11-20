define('travis/controllers/repo', ['exports', 'travis/utils/eventually', 'npm:visibilityjs', 'ember-decorators/service', 'ember-decorators/controller', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _eventually, _npmVisibilityjs, _service, _controller, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6, _init7, _init8, _init9, _init10, _init11;

  var scheduleOnce = Ember.run.scheduleOnce;
  var _isEmpty = Ember.isEmpty;
  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _service.service)('updateTimes'), _dec2 = (0, _controller.controller)('job'), _dec3 = (0, _controller.controller)('build'), _dec4 = (0, _controller.controller)('builds'), _dec5 = (0, _computed.alias)('repositories.accessible'), _dec6 = (0, _computed.alias)('auth.currentUser'), _dec7 = (0, _computed.alias)('buildController.build'), _dec8 = (0, _computed.alias)('buildsController.model'), _dec9 = (0, _computed.alias)('jobController.job'), _dec10 = (0, _object.computed)('repos.isLoaded', 'repos.[]'), (_obj = { repositories: null,
    tabStates: null,
    updateTimesService: null,

    jobController: null,
    buildController: null,
    buildsController: null,

    repos: null,
    currentUser: null,
    build: null,
    builds: null,
    job: null,

    classNames: ['repo'],

    reset: function reset() {
      this.set('repo', null);
    },
    isEmpty: function isEmpty(loaded, repos) {
      return loaded && _isEmpty(repos);
    },
    init: function init() {
      this._super.apply(this, arguments);
      if (!Ember.testing) {
        _npmVisibilityjs.default.every(this.config.intervals.updateTimes, this.updateTimes.bind(this));
      }
    },
    updateTimes: function updateTimes() {
      var updateTimesService = this.get('updateTimesService');

      updateTimesService.push(this.get('build'));
      updateTimesService.push(this.get('builds'));
      updateTimesService.push(this.get('build.jobs'));
    },
    deactivate: function deactivate() {
      return this.stopObservingLastBuild();
    },
    activate: function activate(action) {
      this.stopObservingLastBuild();

      var observesLastBuild = ['index', 'current'];

      if (observesLastBuild.includes(action)) {
        this.observeLastBuild();
        this.set('tabStates.mainTab', 'current');
      } else {
        this.set('tabStates.mainTab', action);
      }
    },
    currentBuildDidChange: function currentBuildDidChange() {
      return scheduleOnce('actions', this, this._currentBuildDidChange);
    },
    _currentBuildDidChange: function _currentBuildDidChange() {
      var _this = this;

      var currentBuild = this.get('repo.currentBuild');
      if (currentBuild && currentBuild.get('id')) {
        (0, _eventually.default)(currentBuild, function (build) {
          _this.set('build', build);

          if (build.get('jobs.length') === 1) {
            _this.set('job', build.get('jobs.firstObject'));
          }
        });
      }
    },
    stopObservingLastBuild: function stopObservingLastBuild() {
      return this.removeObserver('repo.currentBuild', this, 'currentBuildDidChange');
    },
    observeLastBuild: function observeLastBuild() {
      this.currentBuildDidChange();
      return this.addObserver('repo.currentBuild', this, 'currentBuildDidChange');
    }
  }, (_applyDecoratedDescriptor(_obj, 'repositories', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'repositories'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tabStates', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'tabStates'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'updateTimesService', [_dec], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'updateTimesService'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'jobController', [_dec2], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'jobController'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'buildController', [_dec3], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'buildController'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'buildsController', [_dec4], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'buildsController'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'repos', [_dec5], (_init7 = Object.getOwnPropertyDescriptor(_obj, 'repos'), _init7 = _init7 ? _init7.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init7;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentUser', [_dec6], (_init8 = Object.getOwnPropertyDescriptor(_obj, 'currentUser'), _init8 = _init8 ? _init8.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init8;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'build', [_dec7], (_init9 = Object.getOwnPropertyDescriptor(_obj, 'build'), _init9 = _init9 ? _init9.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init9;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'builds', [_dec8], (_init10 = Object.getOwnPropertyDescriptor(_obj, 'builds'), _init10 = _init10 ? _init10.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init10;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'job', [_dec9], (_init11 = Object.getOwnPropertyDescriptor(_obj, 'job'), _init11 = _init11 ? _init11.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init11;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'isEmpty', [_dec10], Object.getOwnPropertyDescriptor(_obj, 'isEmpty'), _obj)), _obj)));
});