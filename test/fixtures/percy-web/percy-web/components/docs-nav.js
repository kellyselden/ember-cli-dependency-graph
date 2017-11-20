define('percy-web/components/docs-nav', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  exports.default = Component.extend({
    markdown: null,
    classes: null,

    isMobileExpanded: false,
    classNames: ['DocsNav'],
    classNameBindings: ['isMobileExpanded:DocsNav--expanded', 'classes'],
    toggle: function toggle() {
      this.send('toggle');
    },

    actions: {
      docsNavigate: function docsNavigate(docsPath) {
        this.sendAction('docsNavigate', docsPath);
      },
      toggle: function toggle() {
        this.toggleProperty('isMobileExpanded');
      }
    }
  });
});