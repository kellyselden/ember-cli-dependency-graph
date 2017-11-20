define('code-corps-ember/helpers/is-between', ['exports', 'code-corps-ember/config/environment', 'ember-moment/helpers/is-between'], function (exports, _environment, _isBetween) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isBetween.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});