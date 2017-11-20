define('travis/routes/error', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _basic.default.extend({
    resetController: function resetController(controller, isExiting /* , transition*/) {
      if (isExiting) {
        controller.set('message', null);
        controller.set('layoutName', null);
      }
    }
  });
});