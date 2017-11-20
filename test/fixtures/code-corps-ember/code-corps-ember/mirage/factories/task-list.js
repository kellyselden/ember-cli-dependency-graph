define('code-corps-ember/mirage/factories/task-list', ['exports', 'ember-cli-mirage'], function (exports, _emberCliMirage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberCliMirage.Factory.extend({
    order: function order() {
      return (this.position || 0) * 100;
    },
    position: function position(i) {
      return i + 1;
    }
  });
});