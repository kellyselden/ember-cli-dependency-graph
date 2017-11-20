define('code-corps-ember/models/github-issue', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    body: (0, _attr.default)(),
    closedAt: (0, _attr.default)(),
    commentsUrl: (0, _attr.default)(),
    eventsUrl: (0, _attr.default)(),
    githubCreatedAt: (0, _attr.default)(),
    githubId: (0, _attr.default)(),
    githubUpdatedAt: (0, _attr.default)(),
    htmlUrl: (0, _attr.default)(),
    labelsUrl: (0, _attr.default)(),
    locked: (0, _attr.default)(),
    number: (0, _attr.default)(),
    state: (0, _attr.default)(),
    title: (0, _attr.default)(),
    url: (0, _attr.default)(),

    githubRepo: (0, _relationships.belongsTo)('github-repo', { async: true })
  });
});