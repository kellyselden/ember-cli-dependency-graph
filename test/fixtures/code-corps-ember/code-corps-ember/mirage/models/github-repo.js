define('code-corps-ember/mirage/models/github-repo', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    githubAppInstallation: (0, _emberCliMirage.belongsTo)('github-app-installation'),
    project: (0, _emberCliMirage.belongsTo)('project')
  });
});