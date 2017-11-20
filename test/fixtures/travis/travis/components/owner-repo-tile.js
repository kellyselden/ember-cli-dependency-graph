define('travis/components/owner-repo-tile', ['exports', 'ember-decorators/object'], function (exports, _object) {
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

  var _dec, _dec2, _dec3, _desc, _value, _obj;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _object.computed)('repo.slug'), _dec2 = (0, _object.computed)('repo.slug'), _dec3 = (0, _object.computed)('repo.default_branch.last_build.state'), (_obj = {
    tagName: 'li',
    classNames: ['owner-tile', 'row-li'],
    classNameBindings: ['repo.default_branch.last_build.state'],

    ownerName: function ownerName(slug) {
      return slug.split(/\//)[0];
    },
    repoName: function repoName(slug) {
      return slug.split(/\//)[1];
    },
    isAnimating: function isAnimating(state) {
      var animationStates = ['received', 'queued', 'started', 'booting'];
      return animationStates.includes(state);
    }
  }, (_applyDecoratedDescriptor(_obj, 'ownerName', [_dec], Object.getOwnPropertyDescriptor(_obj, 'ownerName'), _obj), _applyDecoratedDescriptor(_obj, 'repoName', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'repoName'), _obj), _applyDecoratedDescriptor(_obj, 'isAnimating', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'isAnimating'), _obj)), _obj)));
});