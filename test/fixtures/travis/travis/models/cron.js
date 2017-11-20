define('travis/models/cron', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    branch: (0, _relationships.belongsTo)('branch'),
    interval: (0, _attr.default)('string'),
    dont_run_if_recent_build_exists: (0, _attr.default)('boolean'),
    created_at: (0, _attr.default)('string'),
    last_run: (0, _attr.default)('string'),
    next_run: (0, _attr.default)('string'),
    repo: (0, _relationships.belongsTo)('repo')
  });
});