define("travis/utils/duration-from", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = durationFrom;
  function _toUtc(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
  }

  function durationFrom(started, finished) {
    started = started && _toUtc(new Date(started));
    finished = finished ? _toUtc(new Date(finished)) : _toUtc(new Date());
    if (started && finished) {
      return Math.round((finished - started) / 1000);
    } else {
      return 0;
    }
  }
});