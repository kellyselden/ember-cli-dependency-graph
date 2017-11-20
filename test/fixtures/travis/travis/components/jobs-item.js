define('travis/components/jobs-item', ['exports', 'ember-decorators/object', 'travis/utils/job-config-language'], function (exports, _object, _jobConfigLanguage) {
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
  exports.default = Component.extend((_dec = (0, _object.computed)('job.config.content'), _dec2 = (0, _object.computed)('job.config.content.{env,gemfile}'), (_obj = {
    tagName: 'li',
    classNameBindings: ['job.state'],
    classNames: ['jobs-item'],

    languages: function languages(config) {
      return (0, _jobConfigLanguage.default)(config);
    },
    environment: function environment(env, gemfile) {
      if (env) {
        return env;
      } else if (gemfile) {
        return 'Gemfile: ' + gemfile;
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'languages', [_dec], Object.getOwnPropertyDescriptor(_obj, 'languages'), _obj), _applyDecoratedDescriptor(_obj, 'environment', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'environment'), _obj)), _obj)));
});