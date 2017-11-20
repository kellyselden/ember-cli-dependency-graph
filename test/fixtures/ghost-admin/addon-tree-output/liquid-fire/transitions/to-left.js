define("liquid-fire/transitions/to-left", ["exports", "liquid-fire/transitions/move-over"], function (exports, _moveOver) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (opts) {
    return _moveOver.default.call(this, 'x', -1, opts);
  };
});