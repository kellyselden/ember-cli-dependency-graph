define('code-corps-ember/models/github-pull-request', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    githubCreatedAt: (0, _attr.default)(),
    githubUpdatedAt: (0, _attr.default)(),
    htmlUrl: (0, _attr.default)(),
    merged: (0, _attr.default)(),
    number: (0, _attr.default)(),
    state: (0, _attr.default)(),

    githubRepo: (0, _relationships.belongsTo)('github-repo', { async: true })
  });
});