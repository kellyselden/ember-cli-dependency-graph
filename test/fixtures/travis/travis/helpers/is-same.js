define('travis/helpers/is-same', ['exports', 'travis/config/environment', 'ember-moment/helpers/is-same'], function (exports, _environment, _isSame) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _isSame.default.extend({
    globalAllowEmpty: !!Ember.get(_environment.default, 'moment.allowEmpty')
  });
});