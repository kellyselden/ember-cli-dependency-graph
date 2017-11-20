define('code-corps-ember/helpers/moment-from-now', ['exports', 'code-corps-ember/config/environment', 'ember-moment/helpers/moment-from-now'], function (exports, _environment, _momentFromNow) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentFromNow.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});