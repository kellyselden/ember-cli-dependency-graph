define('code-corps-ember/helpers/moment-format', ['exports', 'code-corps-ember/config/environment', 'ember-moment/helpers/moment-format'], function (exports, _environment, _momentFormat) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentFormat.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});