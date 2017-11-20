define('code-corps-ember/mirage/models/comment-user-mention', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    comment: (0, _emberCliMirage.belongsTo)(),
    user: (0, _emberCliMirage.belongsTo)()
  });
});