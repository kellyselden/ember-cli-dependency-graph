define('code-corps-ember/models/skill', ['exports', 'ember-data/model', 'ember-data/attr'], function (exports, _model, _attr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    description: (0, _attr.default)(),
    title: (0, _attr.default)(),

    // Virtual attribute
    matched: (0, _attr.default)('boolean')
  });
});