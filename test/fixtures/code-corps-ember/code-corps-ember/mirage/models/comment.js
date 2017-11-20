define('code-corps-ember/mirage/models/comment', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    commentUserMentions: (0, _emberCliMirage.hasMany)('comment-user-mention'),
    task: (0, _emberCliMirage.belongsTo)(),
    user: (0, _emberCliMirage.belongsTo)()
  });
});