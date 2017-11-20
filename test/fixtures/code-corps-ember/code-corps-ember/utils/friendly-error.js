define("code-corps-ember/utils/friendly-error", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = FriendlyError;
  function FriendlyError(message) {
    this.isFriendlyError = true;
    this.message = message;
  }
});