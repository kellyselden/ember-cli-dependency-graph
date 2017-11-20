define('percy-web/instance-initializers/page-title-setup', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'page-title-setup-browser',
    before: 'head-browser',
    initialize: function initialize() {
      if (typeof FastBoot === 'undefined') {
        // Remove <title> tags from the initial index.html page, so they can be correctly replaced
        // and managed by ember-cli-head.
        var titles = document.getElementsByTagName('title');
        for (var i = 0; i < titles.length; i++) {
          var title = titles[i];
          title.parentNode.removeChild(title);
        }
      }
    }
  };
});