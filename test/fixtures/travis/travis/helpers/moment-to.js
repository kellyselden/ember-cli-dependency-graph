define('travis/helpers/moment-to', ['exports', 'travis/config/environment', 'ember-moment/helpers/moment-to'], function (exports, _environment, _momentTo) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _momentTo.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});