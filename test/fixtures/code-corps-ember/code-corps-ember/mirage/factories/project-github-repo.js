define('code-corps-ember/mirage/factories/project-github-repo', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    // ensures creation of associated records if they were not otherwise specified
    afterCreate: function afterCreate(record, server) {
      if (!record.githubRepo) {
        record.githubRepo = server.create('github-repo');
        record.save();
      }

      if (!record.project) {
        record.project = server.create('project');
        record.save();
      }
    }
  });
});