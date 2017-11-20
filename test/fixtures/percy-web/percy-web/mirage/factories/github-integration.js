define('percy-web/mirage/factories/github-integration', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    githubInstallationId: function githubInstallationId() {
      return 888;
    },
    githubHtmlUrl: function githubHtmlUrl(i) {
      return 'https://github.com/integration_' + i;
    }
  });
});