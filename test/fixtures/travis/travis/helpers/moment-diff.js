define('travis/helpers/moment-diff', ['exports', 'travis/config/environment', 'ember-moment/helpers/moment-diff'], function (exports, _environment, _momentDiff) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentDiff.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});