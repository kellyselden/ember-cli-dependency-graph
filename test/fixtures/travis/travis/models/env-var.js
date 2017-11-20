define('travis/models/env-var', ['exports', 'ember-data/model', 'ember-data/attr', 'ember-data/relationships'], function (exports, _model, _attr, _relationships) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    name: (0, _attr.default)(),
    value: (0, _attr.default)(),
    'public': (0, _attr.default)('boolean'),
    repo: (0, _relationships.belongsTo)('repo', { async: true })
  });
});