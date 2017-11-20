define('travis/mirage/factories/feature', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    name: function name(i) {
      return 'Some Feature ' + i;
    },
    description: function description(i) {
      return 'Some Feature ' + i + ' will make Travis so much better!';
    },


    enabled: false
  });
});