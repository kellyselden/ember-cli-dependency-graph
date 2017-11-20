define('travis/utils/format-commit', ['exports', 'travis/utils/format-sha'], function (exports, _formatSha) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = formatCommit;
  function formatCommit(sha, branch) {
    var commitString = (0, _formatSha.default)(sha);
    if (branch) {
      commitString = commitString + ' (' + branch + ')';
    }
    return commitString;
  }
});