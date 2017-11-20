define('travis/mirage/factories/permissions', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    admin: true,
    push: true,
    pull: true,
    permissions: true
  });
});