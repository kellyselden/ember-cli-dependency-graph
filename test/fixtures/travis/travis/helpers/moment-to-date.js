define('travis/helpers/moment-to-date', ['exports', 'travis/config/environment', 'ember-moment/helpers/moment-to-date'], function (exports, _environment, _momentToDate) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentToDate.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});