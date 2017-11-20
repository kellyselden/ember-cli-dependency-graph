define('travis/components/job-tabs', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isEmpty = Ember.isEmpty;
  var Component = Ember.Component;
  exports.default = Component.extend({

    tagName: 'div',
    classNames: ['travistab'],

    didInsertElement: function didInsertElement() {
      if (isEmpty(this.$('.travistab-nav--secondary').find('.active'))) {
        this.$('#tab_log').addClass('active');
      }
    }
  });
});