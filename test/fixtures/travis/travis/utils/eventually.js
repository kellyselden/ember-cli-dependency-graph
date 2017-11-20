define("travis/utils/eventually", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (anObjectOrAPromise, callback) {
    if (anObjectOrAPromise.then) {
      anObjectOrAPromise.then(function (result) {
        return callback(result);
      });
    } else {
      callback(anObjectOrAPromise);
    }
  };
});