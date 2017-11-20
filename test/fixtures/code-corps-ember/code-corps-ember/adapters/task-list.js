define('code-corps-ember/adapters/task-list', ['exports', 'code-corps-ember/adapters/application'], function (exports, _application) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _application.default.extend({
    shouldBackgroundReloadRecord: function shouldBackgroundReloadRecord() {
      return false;
    }
  });
});