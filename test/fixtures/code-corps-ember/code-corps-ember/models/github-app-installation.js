define('code-corps-ember/models/github-app-installation', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
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
    installed: (0, _attr.default)(),
    state: (0, _attr.default)(),
    updatedAt: (0, _attr.default)(),

    githubRepos: (0, _relationships.hasMany)('github-repo', { async: true }),
    organizationGithubAppInstallations: (0, _relationships.hasMany)('organization-github-app-installation', { async: true }),
    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});