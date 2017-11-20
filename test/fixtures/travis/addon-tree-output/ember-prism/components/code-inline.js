define('ember-prism/components/code-inline', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component,
      computed = Ember.computed;
  exports.default = Component.extend({
    tagName: 'code',
    classNames: ['code-inline'],
    classNameBindings: ['languageClass'],

    inline: true,
    language: 'markup',

    languageClass: computed('language', function () {
      return 'language-' + this.get('language');
    }),

    getElement: function getElement() {
      return this.$()[0];
    },
    didInsertElement: function didInsertElement() {
      Prism.highlightElement(this.getElement());
    }
  });
});