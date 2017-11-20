define('percy-web/routes/docs/page', ['exports', 'percy-web/mixins/reset-scroll', 'percy-docs'], function (exports, _resetScroll, _percyDocs) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var hash = Ember.RSVP.hash;
  var get = Ember.get;
  var Route = Ember.Route;
  exports.default = Route.extend(_resetScroll.default, {
    model: function model(params) {
      var pageMarkdown = get(_percyDocs.default.markdownFiles, params.path.replace(/\//g, '.')) || '';
      var pageTitleMatch = /# (.*)/.exec(pageMarkdown);
      var pageTitle = pageTitleMatch ? pageTitleMatch[1] : 'Docs';

      var headerRegex = /\n(#{2,3}) ((.+))\n/g;
      var anchoredMarkdown = pageMarkdown.replace(headerRegex, function (match, hashes, title) {
        var titleDashed = title.replace(/( \(.*?\))/g, '').dasherize();

        return '\n' + hashes + ' ' + title + '         <a href="#' + titleDashed + '" id="_' + titleDashed + '" class="DocsAnchor">           <i aria-hidden="true" class="fa fa-link"></i>         </a>\n';
      });

      return hash({
        docPath: '/docs/' + params.path, // TODO(fotinakis): make more dynamic?
        navMarkdown: get(_percyDocs.default.markdownFiles, 'nav'),
        pageMarkdown: anchoredMarkdown,
        pageTitle: pageTitle
      });
    },

    actions: {
      didTransition: function didTransition() {
        this._super.apply(this, arguments);

        var model = this.modelFor(this.routeName);
        this.analytics.track('Docs Page Viewed', null, { path: model.docPath });
      }
    }
  });
});