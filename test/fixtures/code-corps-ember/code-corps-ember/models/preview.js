define('code-corps-ember/models/preview', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    body: (0, _attr.default)('string'),
    markdown: (0, _attr.default)('string'),

    previewUserMentions: (0, _relationships.hasMany)('preview-user-mention', { async: true }),
    user: (0, _relationships.belongsTo)('user', { async: true })
  });
});