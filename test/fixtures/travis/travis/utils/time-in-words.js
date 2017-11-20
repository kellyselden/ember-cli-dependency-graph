define('travis/utils/time-in-words', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = timeInWords;
  function timeInWords(duration) {
    var days = void 0,
        hours = void 0,
        minutes = void 0,
        result = void 0,
        seconds = void 0;
    days = Math.floor(duration / 86400);
    hours = Math.floor(duration % 86400 / 3600);
    minutes = Math.floor(duration % 3600 / 60);
    seconds = duration % 60;
    if (days > 0) {
      return 'more than 24 hrs';
    } else {
      result = [];
      if (hours === 1) {
        result.push(hours + ' hr');
      }
      if (hours > 1) {
        result.push(hours + ' hrs');
      }
      if (minutes > 0) {
        result.push(minutes + ' min');
      }
      if (seconds > 0) {
        result.push(seconds + ' sec');
      }
      if (result.length > 0) {
        return result.join(' ');
      } else {
        return '-';
      }
    }
  }
});