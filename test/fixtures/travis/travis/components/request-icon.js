define('travis/components/request-icon', ['exports', 'ember-decorators/object'], function (exports, _object) {
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

  var _dec, _dec2, _desc, _value, _obj;

  var Component = Ember.Component;


  var eventToIcon = {
    push: 'push',
    pull_request: 'pullrequest',
    cron: 'cronjobs',
    api: 'api',
    default: 'nobuilds'
  };

  var eventToTitle = {
    push: 'Triggered by a push',
    pull_request: 'Triggered from a pull request',
    cron: 'Triggered by a cron job',
    api: 'Triggered via the API',
    default: 'Triggered via unknown means'
  };

  exports.default = Component.extend((_dec = (0, _object.computed)('event'), _dec2 = (0, _object.computed)('event'), (_obj = {
    tagName: 'span',
    classNameBindings: ['event', 'state'],
    attributeBindings: ['title'],

    icon: function icon(event) {
      var iconName = eventToIcon[event] || eventToIcon.default;
      return 'icon-' + iconName;
    },
    title: function title(event) {
      return eventToTitle[event] || eventToTitle.default;
    }
  }, (_applyDecoratedDescriptor(_obj, 'icon', [_dec], Object.getOwnPropertyDescriptor(_obj, 'icon'), _obj), _applyDecoratedDescriptor(_obj, 'title', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'title'), _obj)), _obj)));
});