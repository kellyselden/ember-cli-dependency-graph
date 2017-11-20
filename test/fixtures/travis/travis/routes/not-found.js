define('travis/routes/not-found', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  exports.default = _basic.default.extend({
    renderTemplate: function renderTemplate() {
      $('body').attr('id', 'not-found');
      return this.render('not_found');
    }
  });
});