define('travis/routes/job', ['exports', 'travis/routes/basic', 'ember-decorators/service'], function (exports, _basic, _service) {
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

  exports.default = _basic.default.extend((_obj = { router: null,

    titleToken: function titleToken(model) {
      return 'Job #' + model.get('number');
    },
    serialize: function serialize(model /* , params*/) {
      var id = model.get ? model.get('id') : model;
      return {
        job_id: id
      };
    },
    setupController: function setupController(controller, model) {
      var _this = this;

      var buildController = void 0,
          repo = void 0;
      if (model && !model.get) {
        model = this.store.recordForId('job', model);
        this.store.find('job', model);
      }
      repo = this.controllerFor('repo');
      controller.set('job', model);
      repo.activate('job');
      buildController = this.controllerFor('build');
      model.get('repo');
      var buildPromise = model.get('build');
      if (buildPromise) {
        buildPromise.then(function (build) {
          build = _this.store.recordForId('build', build.get('id'));
          return buildController.set('build', build);
        });
      }

      // this is a hack to not set favicon changes from build
      // controller while we're viewing job, this should go away
      // after refactoring of controllers
      return buildController.set('sendFaviconStateChanges', false);
    },
    model: function model(params) {
      return this.store.find('job', params.job_id);
    },
    afterModel: function afterModel(job) {
      var slug = this.modelFor('repo').get('slug');
      this.ensureJobOwnership(job, slug);
      return this._super.apply(this, arguments);
    },
    ensureJobOwnership: function ensureJobOwnership(job, urlSlug) {
      var jobSlug = job.get('repositorySlug') || job.get('repo.slug');
      if (jobSlug !== urlSlug) {
        throw new Error('invalidJobId');
      }
    },
    deactivate: function deactivate() {
      var buildController = void 0;
      buildController = this.controllerFor('build');
      buildController.set('sendFaviconStateChanges', true);
      this.controllerFor('build').set('build', null);
      this.controllerFor('job').set('job', null);
      return this._super.apply(this, arguments);
    }
  }, (_applyDecoratedDescriptor(_obj, 'router', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'router'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});