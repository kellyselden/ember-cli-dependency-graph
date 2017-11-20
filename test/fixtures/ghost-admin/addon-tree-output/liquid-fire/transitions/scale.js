define("liquid-fire/transitions/scale", ["exports", "liquid-fire"], function (exports, _liquidFire) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = scale;
  function scale() {
    var _this = this;

    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return (0, _liquidFire.animate)(this.oldElement, { scale: [0.2, 1] }, opts).then(function () {
      return (0, _liquidFire.animate)(_this.newElement, { scale: [1, 0.2] }, opts);
    });
  }
});