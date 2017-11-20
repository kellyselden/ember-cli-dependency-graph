define('travis/routes/insufficient-oauth-permissions', ['exports', 'travis/routes/simple-layout'], function (exports, _simpleLayout) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _simpleLayout.default.extend({
    setupController: function setupController(controller) {
      var existingUser = void 0;

      this._super.apply(this, arguments);
      existingUser = document.location.hash.match(/#existing[_-]user/);
      return controller.set('existingUser', existingUser);
    }
  });
});