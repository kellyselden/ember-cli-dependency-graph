define('percy-web/mirage/factories/token', ['exports', 'ember-cli-mirage', 'moment'], function (exports, _emberCliMirage, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    token: 'abc',
    role: 'write_only',
    is_active: true,
    createdAt: function createdAt() {
      return (0, _moment.default)();
    }
  });
});