define('ember-prism/components/code-block', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component,
      computed = Ember.computed;
  exports.default = Component.extend({
    tagName: 'pre',
    classNames: ['code-block'],
    classNameBindings: ['languageClass'],

    inline: false,
    language: 'markup',

    languageClass: computed('language', function () {
      return 'language-' + this.get('language');
    }),

    getElement: function getElement() {
      return this.$('[class*=language-]')[0];
    },
    didInsertElement: function didInsertElement() {
      Prism.highlightElement(this.getElement());
    }
  });
});