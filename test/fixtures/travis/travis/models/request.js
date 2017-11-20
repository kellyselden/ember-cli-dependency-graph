define('travis/models/request', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'ember-decorators/object'], function (exports, _model, _attr, _relationships, _object) {
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

  exports.default = _model.default.extend((_dec = (0, _object.computed)('result', 'build.id'), _dec2 = (0, _object.computed)('event_type'), (_obj = {
    created_at: (0, _attr.default)(),
    event_type: (0, _attr.default)(),
    result: (0, _attr.default)(),
    message: (0, _attr.default)(),
    headCommit: (0, _attr.default)(),
    baseCommit: (0, _attr.default)(),
    branchName: (0, _attr.default)(),
    tagName: (0, _attr.default)(),
    pullRequest: (0, _attr.default)('boolean'),
    pullRequestTitle: (0, _attr.default)(),
    pullRequestNumber: (0, _attr.default)('number'),
    repo: (0, _relationships.belongsTo)('repo', { async: true }),
    commit: (0, _relationships.belongsTo)('commit', { async: true }),
    build: (0, _relationships.belongsTo)('build', { async: true }),

    isAccepted: function isAccepted(result, buildId) {
      // For some reason some of the requests have a null result beside the fact that
      // the build was created. We need to look into it, but for now we can just assume
      // that if build was created, the request was accepted
      return result === 'approved' || buildId;
    },
    isPullRequest: function isPullRequest(eventType) {
      return eventType === 'pull_request';
    }
  }, (_applyDecoratedDescriptor(_obj, 'isAccepted', [_dec], Object.getOwnPropertyDescriptor(_obj, 'isAccepted'), _obj), _applyDecoratedDescriptor(_obj, 'isPullRequest', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'isPullRequest'), _obj)), _obj)));
});