define('percy-web/models/usage-stat', ['exports', 'ember-data'], function (exports, _emberData) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberData.default.Model.extend({
    total: _emberData.default.attr(),
    dayStats: _emberData.default.attr()
  });
});