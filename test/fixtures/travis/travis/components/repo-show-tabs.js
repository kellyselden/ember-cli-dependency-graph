define('travis/components/repo-show-tabs', ['exports', 'travis/config/environment', 'ember-decorators/service', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _environment, _service, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _desc, _value, _obj, _init, _init2;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('tabStates.mainTab'), _dec2 = (0, _object.computed)('tab'), _dec3 = (0, _object.computed)('tab'), _dec4 = (0, _object.computed)('tab'), _dec5 = (0, _object.computed)('tab'), _dec6 = (0, _object.computed)('tab'), _dec7 = (0, _object.computed)('tab'), _dec8 = (0, _object.computed)('tab'), _dec9 = (0, _object.computed)('tab'), _dec10 = (0, _object.computed)('tab'), _dec11 = (0, _object.computed)('tab'), (_obj = { tabStates: null,

    tagName: 'nav',
    classNames: ['travistab-nav'],

    config: _environment.default,

    tab: null,

    classCurrent: function classCurrent(tab) {
      if (tab === 'current') {
        return 'active';
      }
    },
    classBuilds: function classBuilds(tab) {
      if (tab === 'builds') {
        return 'active';
      }
    },
    classPullRequests: function classPullRequests(tab) {
      if (tab === 'pull_requests') {
        return 'active';
      }
    },
    classBranches: function classBranches(tab) {
      if (tab === 'branches') {
        return 'active';
      }
    },
    classBuild: function classBuild(tab) {
      var classes = void 0;
      classes = [];
      if (tab === 'build') {
        classes.push('active');
      }
      if (tab === 'build' || tab === 'job') {
        classes.push('display-inline');
      }
      return classes.join(' ');
    },
    classJob: function classJob(tab) {
      if (tab === 'job') {
        return 'active';
      }
    },
    classRequests: function classRequests(tab) {
      if (tab === 'requests') {
        return 'active';
      }
    },
    classCaches: function classCaches(tab) {
      if (tab === 'caches') {
        return 'active';
      }
    },
    classSettings: function classSettings(tab) {
      if (tab === 'settings') {
        return 'active';
      }
    },
    classRequest: function classRequest(tab) {
      if (tab === 'request') {
        return 'active';
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'tabStates', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'tabStates'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tab', [_dec], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'tab'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'classCurrent', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'classCurrent'), _obj), _applyDecoratedDescriptor(_obj, 'classBuilds', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'classBuilds'), _obj), _applyDecoratedDescriptor(_obj, 'classPullRequests', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'classPullRequests'), _obj), _applyDecoratedDescriptor(_obj, 'classBranches', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'classBranches'), _obj), _applyDecoratedDescriptor(_obj, 'classBuild', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'classBuild'), _obj), _applyDecoratedDescriptor(_obj, 'classJob', [_dec7], Object.getOwnPropertyDescriptor(_obj, 'classJob'), _obj), _applyDecoratedDescriptor(_obj, 'classRequests', [_dec8], Object.getOwnPropertyDescriptor(_obj, 'classRequests'), _obj), _applyDecoratedDescriptor(_obj, 'classCaches', [_dec9], Object.getOwnPropertyDescriptor(_obj, 'classCaches'), _obj), _applyDecoratedDescriptor(_obj, 'classSettings', [_dec10], Object.getOwnPropertyDescriptor(_obj, 'classSettings'), _obj), _applyDecoratedDescriptor(_obj, 'classRequest', [_dec11], Object.getOwnPropertyDescriptor(_obj, 'classRequest'), _obj)), _obj)));
});