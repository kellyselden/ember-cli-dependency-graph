define('code-corps-ember/mirage/factories/project-user', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    role: 'owner',

    // ensures creation of associated records if they were not otherwise specified
    afterCreate: function afterCreate(projectUser, server) {
      if (!projectUser.user) {
        projectUser.user = server.create('user');
        projectUser.save();
      }

      if (!projectUser.project) {
        projectUser.project = server.create('project');
        projectUser.save();
      }
    }
  });
});