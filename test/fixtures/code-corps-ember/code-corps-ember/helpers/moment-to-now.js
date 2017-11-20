define('code-corps-ember/helpers/moment-to-now', ['exports', 'code-corps-ember/config/environment', 'ember-moment/helpers/moment-to-now'], function (exports, _environment, _momentToNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentToNow.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});