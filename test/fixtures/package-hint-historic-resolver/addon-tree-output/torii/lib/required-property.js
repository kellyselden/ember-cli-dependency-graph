define("torii/lib/required-property", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  function requiredProperty() {
    return Ember.computed(function (key) {
      throw new Error("Definition of property " + key + " by a subclass is required.");
    });
  }

  exports.default = requiredProperty;
});