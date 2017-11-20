define('percy-web/components/docs-renderer', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$;
  var next = Ember.run.next;
  var Component = Ember.Component;
  exports.default = Component.extend({
    markdown: null,
    isDocsNav: null,

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      if (window.location.hash && !this.get('isDocsNav')) {
        next(this, function () {
          this.get('_scrollToAnchor')(window.location.hash);
        });
      }
    },
    click: function click(event) {
      // Handle on page anchor link redirects.
      if (event.target.parentElement.tagName === 'A' && event.target.parentElement.hash) {
        this.get('_scrollToAnchor')(event.target.parentElement.hash);
        return true;
      }

      // Hijack clicks on link to pages that are in-app, so we can let the route handle them nicely.
      // Since docs come from an addon, we do this to handle in-app links smoothly via transitions.
      var hostWithProtocol = window.location.protocol + '//' + window.location.host;
      if (event.target.tagName === 'A' && event.target.href.indexOf(hostWithProtocol) === 0) {
        // The target link is part of this app. Hijack the transition and stop bubbling.
        var docsPath = event.target.href.split(hostWithProtocol + '/docs')[1].split('#')[0].slice(1);
        this.send('docsNavigate', docsPath);
        return false;
      }
    },
    _scrollToAnchor: function _scrollToAnchor(hash) {
      // Manually resetting the hash seems necessary to "hijack" normal browser anchor jumping
      // behavior.
      window.location.hash = '';
      var scrollTarget = $('#_' + hash.slice(1));
      var offset = $(scrollTarget).position().top - 15;

      window.scrollTo(0, offset);
      window.location.hash = hash;
    },

    actions: {
      docsNavigate: function docsNavigate(docsPath) {
        this.sendAction('docsNavigate', docsPath);
      }
    }
  });
});