define('travis/routes/caches', ['exports', 'travis/routes/basic', 'ember-decorators/service'], function (exports, _basic, _service) {
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

  exports.default = _basic.default.extend((_obj = { ajax: (0, _service.service)(),

    needsAuth: true,

    setupController: function setupController() /* controller*/{
      this._super.apply(this, arguments);
      return this.controllerFor('repo').activate('caches');
    },
    model: function model() {
      var repo = this.modelFor('repo');
      var url = '/repos/' + repo.get('id') + '/caches';
      return this.get('ajax').get(url).then(function (data) {
        var branch = void 0,
            cache = void 0,
            caches = void 0,
            pullRequests = void 0,
            pushes = void 0;
        caches = {};
        data['caches'].forEach(function (cacheData) {
          var branch = void 0,
              cache = void 0;
          branch = cacheData.branch;
          cache = caches[branch];
          if (cache) {
            cache.size += cacheData.size;
            if (cache.last_modified < cacheData.last_modified) {
              return cache.last_modified = cacheData.last_modified;
            }
          } else {
            return caches[branch] = cacheData;
          }
        });
        pushes = [];
        pullRequests = [];
        for (branch in caches) {
          cache = caches[branch];
          if (/PR./.test(branch)) {
            cache.type = 'pull_request';
            pullRequests.push(cache);
          } else {
            cache.type = 'push';
            pushes.push(cache);
          }
        }
        return {
          repo: repo,
          pushes: pushes,
          pullRequests: pullRequests
        };
      });
    }
  }, (_applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj));
});