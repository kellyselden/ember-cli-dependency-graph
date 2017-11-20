define('code-corps-ember/models/comment', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships', 'code-corps-ember/mixins/contains-code'], function (exports, _model, _attr, _relationships, _containsCode) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend(_containsCode.default, {
    body: (0, _attr.default)('string'),
    createdAt: (0, _attr.default)('date'),
    createdFrom: (0, _attr.default)(),
    githubId: (0, _attr.default)('string'),
    markdown: (0, _attr.default)('string'),

    commentUserMentions: (0, _relationships.hasMany)('comment-user-mention', { async: true }),
    task: (0, _relationships.belongsTo)('task', { async: true }),
    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});