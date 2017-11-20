define("torii/lib/assert", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = assert;
  function assert(message, test) {
    if (!test) {
      console.error(message); // eslint-disable-line
    }
  }
});