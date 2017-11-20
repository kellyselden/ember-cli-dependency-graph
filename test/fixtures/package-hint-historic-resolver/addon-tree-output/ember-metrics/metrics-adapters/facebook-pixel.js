define('ember-metrics/metrics-adapters/facebook-pixel', ['exports', 'ember-metrics/utils/can-use-dom', 'ember-metrics/utils/object-transforms', 'ember-metrics/metrics-adapters/base'], function (exports, _canUseDom, _objectTransforms, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var assert = Ember.assert,
      $ = Ember.$,
      get = Ember.get;
  var compact = _objectTransforms.default.compact;
  exports.default = _base.default.extend({
    toStringExtension: function toStringExtension() {
      return 'FacebookPixel';
    },
    init: function init() {
      var config = get(this, 'config');
      var id = config.id;


      assert('[ember-metrics] You must pass a valid `id` to the ' + this.toString() + ' adapter', id);

      if (_canUseDom.default) {
        /* eslint-disable */
        !function (f, b, e, v, n, t, s) {
          if (f.fbq) return;n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };if (!f._fbq) f._fbq = n;
          n.push = n;n.loaded = !0;n.version = '2.0';n.queue = [];t = b.createElement(e);t.async = !0;
          t.src = v;s = b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t, s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        /* eslint-enable */

        window.fbq('init', id);

        // Leave this call due to Facebook API docs
        // https://developers.facebook.com/docs/facebook-pixel/api-reference#setup
        this.trackEvent({ event: 'PageView' });
      }
    },
    trackEvent: function trackEvent() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!_canUseDom.default) {
        return;
      }

      var compactedOptions = compact(options);
      var event = compactedOptions.event;


      if (!event) {
        return;
      }
      delete compactedOptions.event;

      if (window.fbq) {
        window.fbq('track', event, compactedOptions);
      }
    },
    trackPage: function trackPage() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (!_canUseDom.default) {
        return;
      }

      window.fbq('track', 'PageView', options);
    },
    willDestroy: function willDestroy() {
      if (!_canUseDom.default) {
        return;
      }

      $('script[src*="fbevents.js"]').remove();
      delete window.fbq;
    }
  });
});