define('percy-web/components/code-block', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var on = Ember.on;
  var Component = Ember.Component;
  exports.default = Component.extend({
    lang: null,

    classNames: ['CodeBlock'],
    highlight: on('didInsertElement', function () {
      this.$('pre code').each(function (i, block) {
        window.hljs.highlightBlock(block);
      });
    })
  });
});