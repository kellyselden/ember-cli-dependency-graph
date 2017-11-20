define('travis/utils/time-ago-in-words', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = timeAgoInWords;
  var $ = Ember.$;


  var timeago = $.timeago;
  timeago.settings.allowFuture = true;

  function timeAgoInWords(date) {
    if (date) {
      return timeago(date);
    }
  }
});