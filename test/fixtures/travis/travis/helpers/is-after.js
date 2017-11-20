define('travis/helpers/is-after', ['exports', 'travis/config/environment', 'ember-moment/helpers/is-after'], function (exports, _environment, _isAfter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isAfter.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});