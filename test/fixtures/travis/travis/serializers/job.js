define('travis/serializers/job', ['exports', 'travis/serializers/job_v2_fallback'], function (exports, _job_v2_fallback) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _job_v2_fallback.default.extend({
    attrs: {
      _finishedAt: { key: 'finished_at' },
      _startedAt: { key: 'started_at' }
    }
  });
});