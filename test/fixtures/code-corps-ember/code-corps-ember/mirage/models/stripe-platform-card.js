define('code-corps-ember/mirage/models/stripe-platform-card', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Model.extend({
    user: (0, _emberCliMirage.belongsTo)()
  });
});