define('travis/models/ssh-key', ['exports', 'ember-data/model', 'ember-data/attr'], function (exports, _model, _attr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _model.default.extend({
    value: (0, _attr.default)(),
    description: (0, _attr.default)(),
    fingerprint: (0, _attr.default)(),
    isCustom: true
  });
});