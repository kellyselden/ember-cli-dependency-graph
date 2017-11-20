define("travis/utils/string-hash", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (string) {
    var hash = 0;
    if (string.length == 0) return hash;
    var i = 0;
    for (; i < string.length; i++) {
      var c = string.charCodeAt(i);
      hash = (hash << 5) - hash + c;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };

  ; /* eslint-disable */
  // generate hash for a string
  // found here:
  // http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
});