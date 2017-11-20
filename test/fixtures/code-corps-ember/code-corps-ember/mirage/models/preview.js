define('code-corps-ember/mirage/models/preview', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    previewUserMentions: (0, _emberCliMirage.hasMany)('preview-user-mention'),
    user: (0, _emberCliMirage.belongsTo)()
  });
});