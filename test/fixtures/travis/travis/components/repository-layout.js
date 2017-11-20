define('travis/components/repository-layout', ['exports', 'ember-decorators/object', 'ember-decorators/service'], function (exports, _object, _service) {
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

  var _dec, _dec2, _desc, _value, _obj, _init, _init2, _init3;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('repo.slug', 'repo.private', 'repo.defaultBranch.name'), _dec2 = (0, _object.computed)('repo.slug'), (_obj = { statusImages: null,
    externalLinks: null,
    ajax: null,

    isShowingTriggerBuildModal: false,
    isShowingStatusBadgeModal: false,

    statusImageUrl: function statusImageUrl(slug, repoPrivate, branchName) {
      return this.get('statusImages').imageUrl(this.get('repo'), branchName);
    },
    urlGithub: function urlGithub(slug) {
      return this.get('externalLinks').githubRepo(slug);
    },


    actions: {
      toggleStatusBadgeModal: function toggleStatusBadgeModal() {
        this.toggleProperty('isShowingStatusBadgeModal');
      },
      toggleTriggerBuildModal: function toggleTriggerBuildModal() {
        this.toggleProperty('isShowingTriggerBuildModal');
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'statusImages', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'statusImages'), _init = _init ? _init.value : undefined, {
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
  }), _obj), _applyDecoratedDescriptor(_obj, 'ajax', [_service.service], (_init3 = Object.getOwnPropertyDescriptor(_obj, 'ajax'), _init3 = _init3 ? _init3.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init3;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'statusImageUrl', [_dec], Object.getOwnPropertyDescriptor(_obj, 'statusImageUrl'), _obj), _applyDecoratedDescriptor(_obj, 'urlGithub', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'urlGithub'), _obj)), _obj)));
});