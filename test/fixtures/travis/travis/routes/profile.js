define('travis/routes/profile', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  exports.default = _basic.default.extend({
    titleToken: 'Profile',
    needsAuth: true,

    renderTemplate: function renderTemplate() {
      $('body').attr('id', 'profile');
      return this._super.apply(this, arguments);
    }
  });
});