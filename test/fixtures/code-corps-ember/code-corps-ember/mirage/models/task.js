define('code-corps-ember/mirage/models/task', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    comments: (0, _emberCliMirage.hasMany)(),
    commentUserMentions: (0, _emberCliMirage.hasMany)('comment-user-mention'),
    githubRepo: (0, _emberCliMirage.belongsTo)(),
    taskList: (0, _emberCliMirage.belongsTo)(),
    taskUserMentions: (0, _emberCliMirage.hasMany)('task-user-mention'),
    project: (0, _emberCliMirage.belongsTo)(),
    user: (0, _emberCliMirage.belongsTo)(),
    userTask: (0, _emberCliMirage.belongsTo)()
  });
});