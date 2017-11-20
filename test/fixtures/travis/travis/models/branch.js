define('travis/models/branch', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'ember-decorators/object'], function (exports, _model, _attr, _relationships, _object) {
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

  exports.default = _model.default.extend((_dec = (0, _object.computed)('id'), (_obj = {
    name: (0, _attr.default)('string'),
    defaultBranch: (0, _attr.default)('boolean'),
    lastBuild: (0, _relationships.belongsTo)('build'),
    exists_on_github: (0, _attr.default)('boolean'),

    builds: (0, _relationships.hasMany)('builds', { inverse: 'branch' }),
    repo: (0, _relationships.belongsTo)('repo', { inverse: 'defaultBranch' }),

    repoId: function repoId(id) {
      var match = id.match(/\/repo\/(\d+)\//);
      if (match) {
        return match[1];
      }
    }
  }, (_applyDecoratedDescriptor(_obj, 'repoId', [_dec], Object.getOwnPropertyDescriptor(_obj, 'repoId'), _obj)), _obj)));
});