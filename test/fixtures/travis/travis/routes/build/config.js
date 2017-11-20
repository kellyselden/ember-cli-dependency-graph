define('travis/routes/build/config', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _basic.default.extend({
    model: function model(params) {
      return this.modelFor('build').get('jobs.firstObject.config');
    }
  });
});