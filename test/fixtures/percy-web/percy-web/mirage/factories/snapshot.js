define('percy-web/mirage/factories/snapshot', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    id: function id(i) {
      return 'snapshot-' + i;
    },
    name: function name(i) {
      return 'Exemplifying Test Snapshot ' + i;
    }
  });
});