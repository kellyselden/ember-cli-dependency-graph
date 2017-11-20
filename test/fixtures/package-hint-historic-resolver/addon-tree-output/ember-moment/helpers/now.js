define('ember-moment/helpers/now', ['exports', 'moment', 'ember-moment/helpers/-base'], function (exports, _moment, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  exports.default = _base.default.extend({
    compute: function compute() {
      this._super.apply(this, arguments);

      var momentService = get(this, 'moment');

      return momentService.moment(_moment.default.now());
    }
  });
});