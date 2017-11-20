define('travis/components/builds-item', ['exports', 'ember-decorators/object', 'ember-decorators/service'], function (exports, _object, _service) {
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

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('build.repo.slug', 'build.commit.sha'), _dec2 = (0, _object.computed)('build.eventType'), (_obj = { externalLinks: null,

    tagName: 'li',
    classNameBindings: ['build.state'],
    classNames: ['row-li', 'pr-row'],

    urlGithubCommit: function urlGithubCommit(slug, sha) {
      return this.get('externalLinks').githubCommit(slug, sha);
    },
    isCronJob: function isCronJob(event) {
      return event === 'cron';
    }
  }, (_applyDecoratedDescriptor(_obj, 'externalLinks', [_service.service], (_init = Object.getOwnPropertyDescriptor(_obj, 'externalLinks'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'urlGithubCommit', [_dec], Object.getOwnPropertyDescriptor(_obj, 'urlGithubCommit'), _obj), _applyDecoratedDescriptor(_obj, 'isCronJob', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'isCronJob'), _obj)), _obj)));
});