define('travis/routes/index', ['exports', 'ember-decorators/service'], function (exports, _service) {
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

  var _desc, _value, _obj, _init, _init2, _init3;

  var $ = Ember.$;
  var Route = Ember.Route;
  exports.default = Route.extend((_obj = { auth: null,
    tabStates: null,
    repositories: null,

    redirect: function redirect() {
      if (this.get('auth.signedIn')) {
        if (this.get('features.dashboard')) {
          this.transitionTo('dashboard');
        }
      } else if (this.get('features.enterprise')) {
        this.transitionTo('auth');
      }
    },
    renderTemplate: function renderTemplate() {
      if (this.get('auth.signedIn')) {
        $('body').attr('id', 'home');
      }

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this._super(args);
    },
    activate: function activate() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this._super(args);
      if (this.get('auth.signedIn')) {
        this.get('tabStates').set('sidebarTab', 'owned');
        this.set('tabStates.mainTab', 'current');
      }
    },
    deactivate: function deactivate() {
      this.controllerFor('build').set('build', null);
      this.controllerFor('job').set('job', null);
      this.stopObservingRepoStatus();
      return this._super.apply(this, arguments);
    },
    stopObservingRepoStatus: function stopObservingRepoStatus() {
      var controller = this.controllerFor('repo');
      controller.removeObserver('repo.active', this, 'renderTemplate');
      controller.removeObserver('repo.currentBuildId', this, 'renderTemplate');
    },


    actions: {
      redirectToGettingStarted: function redirectToGettingStarted() {
        return this.transitionTo('getting_started');
      }
    }
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
  }), _obj), _applyDecoratedDescriptor(_obj, 'repositories', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'repositories'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj)), _obj));
});