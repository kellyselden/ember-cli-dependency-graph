define('code-corps-ember/models/organization-github-app-installation', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    insertedAt: (0, _attr.default)(),
    updatedAt: (0, _attr.default)(),

    githubAppInstallation: (0, _relationships.belongsTo)('github-app-installation', { async: true }),
    organization: (0, _relationships.belongsTo)('organization', { async: true })
  });
});