define('travis/routes/features', ['exports', 'travis/routes/basic'], function (exports, _basic) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  exports.default = _basic.default.extend({
    titleToken: 'Beta Features',

    model: function model() {
      return this.store.peekAll('beta-feature').sortBy('name');
    },
    renderTemplate: function renderTemplate() {
      $('body').attr('class', 'features');
      this._super.apply(this, arguments);
    },


    needsAuth: true
  });
});