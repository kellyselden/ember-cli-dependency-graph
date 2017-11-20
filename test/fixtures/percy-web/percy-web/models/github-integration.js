define('percy-web/models/github-integration', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    githubInstallationId: _emberData.default.attr(),
    githubAccountAvatarUrl: _emberData.default.attr(),
    githubHtmlUrl: _emberData.default.attr(),
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date')
  });
});