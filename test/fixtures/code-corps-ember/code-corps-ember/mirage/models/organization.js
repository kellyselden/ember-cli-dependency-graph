define('code-corps-ember/mirage/models/organization', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    organizationGithubAppInstallations: (0, _emberCliMirage.hasMany)('organization-github-app-installation'),
    owner: (0, _emberCliMirage.belongsTo)('user'),
    projects: (0, _emberCliMirage.hasMany)(),
    stripeConnectAccount: (0, _emberCliMirage.belongsTo)('stripe-connect-account')
  });
});