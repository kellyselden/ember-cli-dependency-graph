define('travis/utils/format-sha', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = formatSha;
  function formatSha(sha) {
    return (sha || '').substr(0, 7);
  }
});