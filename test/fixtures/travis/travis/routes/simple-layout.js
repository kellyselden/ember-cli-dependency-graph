define('travis/routes/simple-layout', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  exports.default = _basic.default.extend({
    setupController: function setupController() {
      $('body').attr('id', 'simple');
      return this._super.apply(this, arguments);
    }
  });
});