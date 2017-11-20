define('travis/services/status-images', ['exports', 'travis/config/environment', 'ember-decorators/service'], function (exports, _environment, _service) {
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

  var Service = Ember.Service;
  exports.default = Service.extend((_obj = { auth: null,
    features: null,

    imageUrl: function imageUrl(repo, branch) {
      var prefix = location.protocol + '//' + location.host;

      // the ruby app (waiter) does an indirect, internal redirect to api on build status images
      // but that does not work if you only run `ember serve`
      // so in development we use the api endpoint directly
      if (_environment.default.environment === 'development') {
        prefix = _environment.default.apiEndpoint;
      }

      var slug = repo.get('slug');

      if (repo.get('private')) {
        var token = this.get('auth').assetToken();
        return prefix + '/' + slug + '.svg?token=' + token + (branch ? '&branch=' + branch : '');
      } else {
        return prefix + '/' + slug + '.svg' + (branch ? '?branch=' + encodeURIComponent(branch) : '');
      }
    },
    repositoryUrl: function repositoryUrl(repo) {
      return 'https://' + location.host + '/' + repo.get('slug');
    },
    markdownImageString: function markdownImageString(repo, branch) {
      var url = this.repositoryUrl(repo);
      var imageUrl = this.imageUrl(repo, branch);
      return '[![Build Status](' + imageUrl + ')](' + url + ')';
    },
    textileImageString: function textileImageString(repo, branch) {
      var url = this.repositoryUrl(repo);
      var imageUrl = this.imageUrl(repo, branch);
      return '!' + imageUrl + '!:' + url;
    },
    rdocImageString: function rdocImageString(repo, branch) {
      var url = this.repositoryUrl(repo);
      var imageUrl = this.imageUrl(repo, branch);
      return '{<img src="' + imageUrl + '" alt="Build Status" />}[' + url + ']';
    },
    asciidocImageString: function asciidocImageString(repo, branch) {
      var url = this.repositoryUrl(repo);
      var imageUrl = this.imageUrl(repo, branch);
      return 'image:' + imageUrl + '["Build Status", link="' + url + '"]';
    },
    rstImageString: function rstImageString(repo, branch) {
      var url = this.repositoryUrl(repo);
      var imageUrl = this.imageUrl(repo, branch);
      return '.. image:: ' + imageUrl + '\n    :target: ' + url;
    },
    podImageString: function podImageString(repo, branch) {
      var url = this.repositoryUrl(repo);
      var imageUrl = this.imageUrl(repo, branch);
      return '=for html <a href="' + url + '"><img src="' + imageUrl + '"></a>';
    },
    ccXml: function ccXml(repo, branch) {
      var url = '#' + _environment.default.apiEndpoint + '/repos/' + repo.get('slug') + '/cc.xml';
      if (branch) {
        url = url + '?branch=' + branch;
      }
      if (repo.get('private')) {
        var token = this.get('auth').assetToken();
        var delimiter = url.indexOf('?') === -1 ? '?' : '&';
        url = '' + url + delimiter + 'token=' + token;
      }
      return url;
    }
  }, (_applyDecoratedDescriptor(_obj, 'auth', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'auth'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'features', [_service.service], (_init2 = Object.getOwnPropertyDescriptor(_obj, 'features'), _init2 = _init2 ? _init2.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init2;
    }
  }), _obj)), _obj));
});