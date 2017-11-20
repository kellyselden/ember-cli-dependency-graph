define('travis/utils/favicon-manager', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var manager = function manager(headTag) {
    if (headTag) {
      this.headTag = headTag;
    }
    return this;
  };

  manager.prototype.getHeadTag = function () {
    return this.headTag || document.getElementsByTagName('head')[0];
  };

  manager.prototype.setFavicon = function (href) {
    var head = void 0,
        link = void 0,
        oldLink = void 0;
    head = this.getHeadTag();
    oldLink = this.getLinkTag();
    link = this.createLinkTag();
    head.appendChild(link);
    setTimeout(function () {
      link.setAttribute('href', href);
    }, 10);
    if (oldLink) {
      return head.removeChild(oldLink);
    }
  };

  manager.prototype.getLinkTag = function () {
    var i = void 0,
        len = void 0,
        link = void 0,
        links = void 0;
    links = this.getHeadTag().getElementsByTagName('link');
    if (links.length) {
      for (i = 0, len = links.length; i < len; i++) {
        link = links[i];
        if ((link.getAttribute('rel') || '').trim() === 'icon') {
          return link;
        }
      }
    }
  };

  manager.prototype.createLinkTag = function () {
    var link = void 0;
    link = document.createElement('link');
    link.setAttribute('rel', 'icon');
    link.setAttribute('type', 'image/png');
    return this.getHeadTag().appendChild(link);
  };

  exports.default = manager;
});