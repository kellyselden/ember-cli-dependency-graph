define('travis/serializers/stage', ['exports', 'travis/serializers/v3'], function (exports, _v) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _v.default.extend({
    attrs: {
      _finishedAt: { key: 'finished_at' },
      _startedAt: { key: 'started_at' }
    }
  });
});