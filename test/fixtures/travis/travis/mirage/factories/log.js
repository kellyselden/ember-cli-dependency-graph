define('travis/mirage/factories/log', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.default.Factory.extend({
    content: 'Hello log'
  });
});