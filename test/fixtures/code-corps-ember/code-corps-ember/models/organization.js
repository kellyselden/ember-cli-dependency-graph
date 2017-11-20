define('code-corps-ember/models/organization', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    cloudinaryPublicId: (0, _attr.default)(),
    description: (0, _attr.default)(),
    iconLargeUrl: (0, _attr.default)(),
    iconThumbUrl: (0, _attr.default)(),
    name: (0, _attr.default)(),
    slug: (0, _attr.default)(),

    organizationGithubAppInstallations: (0, _relationships.hasMany)('organization-github-app-installation', { async: true }),
    owner: (0, _relationships.belongsTo)('user', { async: true }),
    projects: (0, _relationships.hasMany)('project', { async: true }),
    stripeConnectAccount: (0, _relationships.belongsTo)('stripe-connect-account', { async: true })
  });
});