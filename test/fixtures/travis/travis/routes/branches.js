define('travis/routes/branches', ['exports', 'travis/routes/basic', 'travis/config/environment', 'ember-decorators/service'], function (exports, _basic, _environment, _service) {
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

  var _desc, _value, _obj, _init, _init2;

  var $ = Ember.$;
  var ArrayProxy = Ember.ArrayProxy;
  exports.default = _basic.default.extend((_obj = { repositories: null,
    tabStates: null,

    model: function model() /* params*/{
      var allTheBranches = void 0,
          apiEndpoint = void 0,
          options = void 0,
          repoId = void 0;
      apiEndpoint = _environment.default.apiEndpoint;
      repoId = this.modelFor('repo').get('id');
      allTheBranches = ArrayProxy.create();
      options = {
        headers: {
          'Travis-API-Version': '3'
        }
      };
      if (this.get('auth.signedIn')) {
        options.headers.Authorization = 'token ' + this.auth.token();
      }

      var path = apiEndpoint + '/repo/' + repoId + '/branches';
      var includes = 'build.commit&limit=100';
      var url = path + '?include=' + includes;

      return $.ajax(url, options).then(function (response) {
        allTheBranches = response.branches;
        return allTheBranches;
      });
    },
    activate: function activate() {
      if (this.get('auth.signedIn')) {
        this.set('tabStates.sidebarTab', 'owned');
        this.set('tabStates.mainTab', 'branches');
      }
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
  }), _obj)), _obj));
});