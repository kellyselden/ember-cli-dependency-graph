define('percy-web/routes/docs', ['exports', 'percy-web/mixins/reset-scroll', 'percy-docs'], function (exports, _resetScroll, _percyDocs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var hash = Ember.RSVP.hash;
  var Route = Ember.Route;
  exports.default = Route.extend(_resetScroll.default, {
    model: function model() {
      return hash({
        navMarkdown: get(_percyDocs.default.markdownFiles, 'nav'),
        pageMarkdown: get(_percyDocs.default.markdownFiles, 'index')
      });
    },

    actions: {
      docsNavigate: function docsNavigate(docsPath) {
        // Avoid doing full-page refreshes when navigating around doc pages. The docs-renderer
        // component hijacks links to internal pages so we can do smooth in-app transitions here:
        if (docsPath) {
          this.transitionTo('docs.page', docsPath);
        } else {
          this.transitionTo('docs.index');
        }
      }
    }
  });
});