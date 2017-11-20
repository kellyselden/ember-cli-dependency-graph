define('ember-metrics/metrics-adapters/piwik', ['exports', 'ember-metrics/utils/can-use-dom', 'ember-metrics/metrics-adapters/base'], function (exports, _canUseDom, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var assert = Ember.assert,
      $ = Ember.$,
      get = Ember.get;
  exports.default = _base.default.extend({
    toStringExtension: function toStringExtension() {
      return 'Piwik';
    },
    init: function init() {
      var config = get(this, 'config');
      var piwikUrl = config.piwikUrl,
          siteId = config.siteId;


      assert('[ember-metrics] You must pass a `piwikUrl` and a `siteId` to the ' + this.toString() + ' adapter', piwikUrl && siteId);

      if (_canUseDom.default) {
        window._paq = window._paq || [];
        (function () {
          window._paq.push(['setTrackerUrl', piwikUrl + '/piwik.php']);
          window._paq.push(['setSiteId', siteId]);
          var d = document,
              g = d.createElement('script'),
              s = d.getElementsByTagName('script')[0];
          g.type = 'text/javascript';g.async = true;g.defer = true;g.src = piwikUrl + '/piwik.js';s.parentNode.insertBefore(g, s);
        })();
      }
    },
    identify: function identify() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (_canUseDom.default) {
        window._paq.push(['setUserId', options.userId]);
      }
    },
    trackEvent: function trackEvent() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (_canUseDom.default) {
        window._paq.push(['trackEvent', options.category, options.action, options.name, options.value]);
      }
    },
    trackPage: function trackPage() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (_canUseDom.default) {
        window._paq.push(['setCustomUrl', options.page]);
        window._paq.push(['trackPageView', options.title]);
      }
    },
    willDestroy: function willDestroy() {
      if (_canUseDom.default) {
        $('script[src*="piwik"]').remove();
        delete window._paq;
      }
    }
  });
});