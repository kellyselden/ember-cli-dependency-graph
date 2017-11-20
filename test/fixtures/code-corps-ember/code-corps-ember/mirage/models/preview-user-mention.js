define('code-corps-ember/mirage/models/preview-user-mention', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    preview: (0, _emberCliMirage.belongsTo)(),
    user: (0, _emberCliMirage.belongsTo)()
  });
});