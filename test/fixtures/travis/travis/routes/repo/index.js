define('travis/routes/repo/index', ['exports', 'travis/routes/basic', 'ember-decorators/service'], function (exports, _basic, _service) {
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

  exports.default = _basic.default.extend((_obj = { tabStates: null,

    setupController: function setupController(controller, model) {
      this._super.apply(this, arguments);
      this.controllerFor('repo').activate('current');
      controller.set('repo', model);
    },
    deactivate: function deactivate() {
      this.controllerFor('build').set('build', null);
      this.controllerFor('job').set('job', null);
      this.stopObservingRepoStatus();
      return this._super.apply(this, arguments);
    },
    activate: function activate() {
      this.observeRepoStatus();
      this.set('tabStates.mainTab', 'current');
      return this._super.apply(this, arguments);
    },
    observeRepoStatus: function observeRepoStatus() {
      var controller = this.controllerFor('repo');
      controller.addObserver('repo.active', this, 'renderTemplate');
      controller.addObserver('repo.currentBuildId', this, 'renderTemplate');
    },
    stopObservingRepoStatus: function stopObservingRepoStatus() {
      var controller = this.controllerFor('repo');
      controller.removeObserver('repo.active', this, 'renderTemplate');
      controller.removeObserver('repo.currentBuildId', this, 'renderTemplate');
    },
    renderTemplate: function renderTemplate() {
      var controller = this.controllerFor('repo');

      if (!controller.get('repo.active')) {
        this.render('repo/not-active');
      } else if (!controller.get('repo.currentBuildId')) {
        this.render('repo/no-build');
      } else {
        this.render('build');
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'tabStates', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'tabStates'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});