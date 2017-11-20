define('code-corps-ember/helpers/moment-diff', ['exports', 'code-corps-ember/config/environment', 'ember-moment/helpers/moment-diff'], function (exports, _environment, _momentDiff) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentDiff.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});