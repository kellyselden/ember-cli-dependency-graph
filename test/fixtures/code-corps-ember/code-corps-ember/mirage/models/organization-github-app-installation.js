define('code-corps-ember/mirage/models/organization-github-app-installation', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    githubAppInstallation: (0, _emberCliMirage.belongsTo)('github-app-installation'),
    organization: (0, _emberCliMirage.belongsTo)()
  });
});