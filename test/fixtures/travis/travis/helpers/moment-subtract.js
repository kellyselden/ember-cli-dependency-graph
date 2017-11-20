define('travis/helpers/moment-subtract', ['exports', 'travis/config/environment', 'ember-moment/helpers/moment-subtract'], function (exports, _environment, _momentSubtract) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentSubtract.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});