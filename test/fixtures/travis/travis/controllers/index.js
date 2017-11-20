define('travis/controllers/index', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed', 'npm:visibilityjs', 'travis/config/environment', 'ember-decorators/service'], function (exports, _object, _computed, _npmVisibilityjs, _environment, _service) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6, _init7, _init8, _init9;

  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _service.service)('updateTimes'), _dec2 = (0, _object.computed)('features.proVersion'), _dec3 = (0, _computed.alias)('repositories.accessible.firstObject'), _dec4 = (0, _computed.alias)('tabStates.mainTab'), _dec5 = (0, _computed.alias)('repo.currentBuild'), _dec6 = (0, _computed.alias)('build.jobs.firstObject'), (_obj = { auth: null,
    tabStates: null,
    updateTimesService: null,
    statusImages: null,
    repositories: null,

    init: function init() {
      this._super.apply(this, arguments);
      if (!Ember.testing) {
        return _npmVisibilityjs.default.every(_environment.default.intervals.updateTimes, this.updateTimes.bind(this));
      }
    },
    updateTimes: function updateTimes() {
      this.get('updateTimesService').push(this.get('build.stages'));
      this.get('updateTimesService').push(this.get('build.jobs'));
    },
    landingPage: function landingPage(pro) {
      var version = pro ? 'pro' : 'default';

      return 'landing-' + version + '-page';
    },
    repo: null,

    tab: null,

    build: null,

    job: null
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
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
  }), _obj), _applyDecoratedDescriptor(_obj, 'statusImages', [_service.service], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'statusImages'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'repositories', [_service.service], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'repositories'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'landingPage', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'landingPage'), _obj), _applyDecoratedDescriptor(_obj, 'repo', [_dec3], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'repo'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tab', [_dec4], (_init7 = Object.getOwnPropertyDescriptor(_obj, 'tab'), _init7 = _init7 ? _init7.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init7;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'build', [_dec5], (_init8 = Object.getOwnPropertyDescriptor(_obj, 'build'), _init8 = _init8 ? _init8.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init8;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'job', [_dec6], (_init9 = Object.getOwnPropertyDescriptor(_obj, 'job'), _init9 = _init9 ? _init9.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init9;
    }
  }), _obj)), _obj)));
});