define('travis/components/repos-list-item', ['exports', 'travis/mixins/polling', 'travis/utils/color-for-state', 'ember-decorators/object'], function (exports, _polling, _colorForState, _object) {
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

  var _dec, _desc, _value, _obj;

  var $ = Ember.$;
  var Component = Ember.Component;
  exports.default = Component.extend(_polling.default, (_dec = (0, _object.computed)('repo.currentBuild.state'), (_obj = {
    tagName: 'li',
    pollModels: 'repo',
    classNames: ['repo'],

    color: function color(buildState) {
      return (0, _colorForState.default)(buildState);
    },
    scrollTop: function scrollTop() {
      if (window.scrollY > 0) {
        return $('html, body').animate({
          scrollTop: 0
        }, 200);
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'color', [_dec], Object.getOwnPropertyDescriptor(_obj, 'color'), _obj)), _obj)));
});