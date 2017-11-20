define('travis/controllers/job', ['exports', 'ember-decorators/service', 'ember-decorators/controller', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _service, _controller, _object, _computed) {
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

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _desc, _value, _obj, _init, _init2, _init3, _init4, _init5, _init6;

  var Controller = Ember.Controller;
  exports.default = Controller.extend((_dec = (0, _controller.controller)('repo'), _dec2 = (0, _computed.alias)('repoController.repo'), _dec3 = (0, _computed.alias)('auth.currentUser'), _dec4 = (0, _computed.alias)('repoController.tab'), _dec5 = (0, _object.computed)('repo.slug', 'commit.sha'), _dec6 = (0, _object.observes)('job.state'), (_obj = { auth: null,
    externalLinks: null,

    repoController: null,
    repo: null,
    currentUser: null,
    tab: null,

    urlGithubCommit: function urlGithubCommit(slug, sha) {
      return this.get('externalLinks').githubCommit(slug, sha);
    },
    jobStateDidChange: function jobStateDidChange() {
      return this.send('faviconStateDidChange', this.get('job.state'));
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'repoController', [_dec], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'repoController'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'repo', [_dec2], (_init4 = Object.getOwnPropertyDescriptor(_obj, 'repo'), _init4 = _init4 ? _init4.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init4;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'currentUser', [_dec3], (_init5 = Object.getOwnPropertyDescriptor(_obj, 'currentUser'), _init5 = _init5 ? _init5.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init5;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'tab', [_dec4], (_init6 = Object.getOwnPropertyDescriptor(_obj, 'tab'), _init6 = _init6 ? _init6.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init6;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'urlGithubCommit', [_dec5], Object.getOwnPropertyDescriptor(_obj, 'urlGithubCommit'), _obj), _applyDecoratedDescriptor(_obj, 'jobStateDidChange', [_dec6], Object.getOwnPropertyDescriptor(_obj, 'jobStateDidChange'), _obj)), _obj)));
});