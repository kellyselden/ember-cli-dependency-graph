define('travis/mixins/github-url-properties', ['exports', 'ember-decorators/service', 'ember-decorators/object'], function (exports, _service, _object) {
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

  var _dec, _dec2, _desc, _value, _obj, _init;

  var Mixin = Ember.Mixin;
  exports.default = Mixin.create((_dec = (0, _object.computed)('repo.slug', 'commit.sha'), _dec2 = (0, _object.computed)('repo.slug', 'build.pullRequestNumber'), (_obj = { externalLinks: null,

    urlGithubCommit: function urlGithubCommit(slug, sha) {
      return this.get('externalLinks').githubCommit(slug, sha);
    },
    urlGithubPullRequest: function urlGithubPullRequest(slug, pullRequestNumber) {
      return this.get('externalLinks').githubPullRequest(slug, pullRequestNumber);
    }
  }, (_applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'urlGithubCommit', [_dec], Object.getOwnPropertyDescriptor(_obj, 'urlGithubCommit'), _obj), _applyDecoratedDescriptor(_obj, 'urlGithubPullRequest', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'urlGithubPullRequest'), _obj)), _obj)));
});