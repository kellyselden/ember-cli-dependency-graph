define('ember-moment/helpers/now', ['exports', 'moment', 'ember-moment/helpers/-base'], function (exports, _moment, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _base.default.extend({
    moment: Ember.inject.service(),

    compute: function compute() {
      this._super.apply(this, arguments);

      var momentService = this.get('moment');

      return momentService.moment(_moment.default.now());
    }
  });
});