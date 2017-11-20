define('code-corps-ember/models/github-repo', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    githubAccountAvatarUrl: (0, _attr.default)(),
    githubAccountId: (0, _attr.default)(),
    githubAccountLogin: (0, _attr.default)(),
    githubAccountType: (0, _attr.default)(),
    githubId: (0, _attr.default)(),
    insertedAt: (0, _attr.default)(),
    name: (0, _attr.default)(),
    syncState: (0, _attr.default)(),
    syncingCommentsCount: (0, _attr.default)(),
    syncingIssuesCount: (0, _attr.default)(),
    syncingPullRequestsCount: (0, _attr.default)(),
    updatedAt: (0, _attr.default)(),

    /**
      `triggeredSync` is a virtual (client-only) attribute used to let the client
      know when the repo sync has been triggered.
       @attribute triggeredSync
      @virtual
      @type boolean
     */
    triggeredSync: (0, _attr.default)(),

    githubAppInstallation: (0, _relationships.belongsTo)('github-app-installation', { async: true }),
    project: (0, _relationships.belongsTo)('project', { async: true })
  });
});