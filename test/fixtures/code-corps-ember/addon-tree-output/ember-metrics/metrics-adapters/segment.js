define('ember-metrics/metrics-adapters/segment', ['exports', 'ember-metrics/utils/can-use-dom', 'ember-metrics/utils/object-transforms', 'ember-metrics/metrics-adapters/base'], function (exports, _canUseDom, _objectTransforms, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$,
      assert = Ember.assert,
      copy = Ember.copy,
      get = Ember.get;
  exports.default = _base.default.extend({
    toStringExtension: function toStringExtension() {
      return 'Segment';
    },
    init: function init() {
      var config = copy(get(this, 'config'));
      var segmentKey = config.key;

      assert('[ember-metrics] You must pass a valid `key` to the ' + this.toString() + ' adapter', segmentKey);

      if (_canUseDom.default) {
        /* eslint-disable */
        window.analytics = window.analytics || [], window.analytics.methods = ["identify", "group", "track", "page", "pageview", "alias", "ready", "on", "once", "off", "trackLink", "trackForm", "trackClick", "trackSubmit"], window.analytics.factory = function (t) {
          return function () {
            var a = Array.prototype.slice.call(arguments);return a.unshift(t), window.analytics.push(a), window.analytics;
          };
        };for (var i = 0; i < window.analytics.methods.length; i++) {
          var key = window.analytics.methods[i];window.analytics[key] = window.analytics.factory(key);
        }window.analytics.load = function (t) {
          if (!document.getElementById("analytics-js")) {
            var a = document.createElement("script");a.type = "text/javascript", a.id = "analytics-js", a.async = !0, a.src = ("https:" === document.location.protocol ? "https://" : "http://") + "cdn.segment.com/analytics.js/v1/" + t + "/analytics.min.js";var n = document.getElementsByTagName("script")[0];n.parentNode.insertBefore(a, n);
          }
        }, window.analytics.SNIPPET_VERSION = "2.0.9";
        /* eslint-enable */
        window.analytics.load(segmentKey);
      }
    },
    alias: function alias() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = (0, _objectTransforms.compact)(options);
      var alias = compactedOptions.alias,
          original = compactedOptions.original;


      if (original && _canUseDom.default) {
        window.analytics.alias(alias, original);
      } else if (_canUseDom.default) {
        window.analytics.alias(alias);
      }
    },
    identify: function identify() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = (0, _objectTransforms.compact)(options);
      var distinctId = compactedOptions.distinctId,
          segmentContext = compactedOptions.segmentContext;

      var compactedContext = (0, _objectTransforms.compact)(segmentContext);
      delete compactedOptions.distinctId;
      delete compactedOptions.segmentContext;
      if (_canUseDom.default) {
        window.analytics.identify(distinctId, compactedOptions, compactedContext);
      }
    },
    trackEvent: function trackEvent() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = (0, _objectTransforms.compact)(options);
      var event = compactedOptions.event;

      delete compactedOptions.event;

      if (_canUseDom.default) {
        window.analytics.track(event, compactedOptions);
      }
    },
    trackPage: function trackPage() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = (0, _objectTransforms.compact)(options);
      var page = compactedOptions.page;

      delete compactedOptions.page;

      if (_canUseDom.default) {
        window.analytics.page(page, compactedOptions);
      }
    },
    willDestroy: function willDestroy() {
      if (_canUseDom.default) {
        $('script[src*="segment.com"]').remove();
        delete window.analytics;
      }
    }
  });
});