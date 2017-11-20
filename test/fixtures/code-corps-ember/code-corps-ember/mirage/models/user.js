define('code-corps-ember/mirage/models/user', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    githubAppInstallations: (0, _emberCliMirage.hasMany)('github-app-installation'),
    projectUsers: (0, _emberCliMirage.hasMany)(),
    sluggedRoute: (0, _emberCliMirage.belongsTo)(),
    stripeConnectSubscriptions: (0, _emberCliMirage.hasMany)('stripe-connect-subscription'),
    stripePlatformCard: (0, _emberCliMirage.belongsTo)('stripe-platform-card'),
    stripePlatformCustomer: (0, _emberCliMirage.belongsTo)('stripe-platform-customer'),
    userCategories: (0, _emberCliMirage.hasMany)('user-category'),
    userRoles: (0, _emberCliMirage.hasMany)('user-role'),
    userSkills: (0, _emberCliMirage.hasMany)('user-skill')
  });
});