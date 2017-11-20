define('percy-web/components/docs-edit-button', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var computed = Ember.computed;
  var Component = Ember.Component;
  exports.default = Component.extend({
    docPath: null,
    classes: null,

    text: 'Edit on GitHub',
    href: computed('docPath', function () {
      return 'https://github.com/percy/percy-docs/tree/master' + this.get('docPath') + '.md';
    }),
    tagName: 'a',
    classNames: ['DocsEditButton'],
    attributeBindings: ['href'],
    classNameBindings: ['classes']
  });
});