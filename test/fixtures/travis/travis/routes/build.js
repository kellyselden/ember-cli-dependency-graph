define('travis/routes/build', ['exports', 'travis/routes/basic', 'ember-decorators/service'], function (exports, _basic, _service) {
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

    titleToken: function titleToken(model) {
      return 'Build #' + model.get('number');
    },
    serialize: function serialize(model) {
      var id = model.get ? model.get('id') : model;
      return {
        build_id: id
      };
    },
    setupController: function setupController(controller, model) {
      if (model && !model.get) {
        model = this.store.recordForId('build', model);
        this.store.find('build', model);
      }
      var repo = this.controllerFor('repo');
      controller.set('build', model);
      return repo.activate('build');
    },
    activate: function activate() {
      this.set('tabStates.mainTab', 'build');
    },
    model: function model(params) {
      return this.store.findRecord('build', params.build_id);
    },
    afterModel: function afterModel(model) {
      var slug = this.modelFor('repo').get('slug');
      this.ensureBuildOwnership(model, slug);
      return this._super.apply(this, arguments);
    },
    ensureBuildOwnership: function ensureBuildOwnership(build, urlSlug) {
      var buildRepoSlug = build.get('repo.slug');

      if (buildRepoSlug !== urlSlug) {
        throw new Error('invalidBuildId');
      }
    },
    deactivate: function deactivate() {
      this._super.apply(this, arguments);
      this.controllerFor('job').set('job', null);
      return this.controllerFor('build').set('build', null);
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