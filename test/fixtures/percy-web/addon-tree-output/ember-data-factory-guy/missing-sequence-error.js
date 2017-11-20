define("ember-data-factory-guy/missing-sequence-error", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (message) {
    this.toString = function () {
      return message;
    };
  };
});