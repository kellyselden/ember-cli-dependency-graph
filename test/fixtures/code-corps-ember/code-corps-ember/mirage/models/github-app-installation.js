define('code-corps-ember/mirage/models/github-app-installation', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    githubRepos: (0, _emberCliMirage.hasMany)('github-repo'),
    organizationGithubAppInstallations: (0, _emberCliMirage.hasMany)('organization-github-app-installation'),
    user: (0, _emberCliMirage.belongsTo)()
  });
});