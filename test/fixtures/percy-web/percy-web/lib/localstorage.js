define("percy-web/lib/localstorage", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    get: function get(key, defaultValue) {
      var item = void 0;
      try {
        item = JSON.parse(localStorage.getItem(key));
      } catch (_) {
        // Safari throws errors while accessing localStorage in private mode.
      } finally {
        return item || defaultValue; // eslint-disable-line no-unsafe-finally
      }
    },
    set: function set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (_) {
        // Safari throws errors while accessing localStorage in private mode.
      } finally {
        return value; // eslint-disable-line no-unsafe-finally
      }
    },
    removeItem: function removeItem(key) {
      try {
        localStorage.removeItem(key);
      } catch (_) {
        // Safari throws errors while accessing localStorage in private mode.
      }
    }
  };
});