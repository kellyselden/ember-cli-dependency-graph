define("ember-scrollable/util/number", ["exports"], function (exports) {
  /**
   * Polyfills for `Number` global.
   */
  exports["default"] = {
    isNaN: Number.isNaN || window.isNaN,
    parseInt: Number.parseInt || window.parseInt
  };
});