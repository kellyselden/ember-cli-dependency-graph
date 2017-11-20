define('ember-metrics/metrics-adapters/mixpanel', ['exports', 'ember-metrics/utils/can-use-dom', 'ember-metrics/utils/object-transforms', 'ember-metrics/metrics-adapters/base'], function (exports, _canUseDom, _objectTransforms, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var assert = Ember.assert,
      $ = Ember.$,
      get = Ember.get;
  var without = _objectTransforms.default.without,
      compact = _objectTransforms.default.compact,
      isPresent = _objectTransforms.default.isPresent;

  var assign = Ember.assign || Ember.merge;

  exports.default = _base.default.extend({
    toStringExtension: function toStringExtension() {
      return 'Mixpanel';
    },
    init: function init() {
      var config = get(this, 'config');
      var token = config.token;


      assert('[ember-metrics] You must pass a valid `token` to the ' + this.toString() + ' adapter', token);

      if (_canUseDom.default) {
        /* eslint-disable */
        (function (e, a) {
          if (!a.__SV) {
            var b = window;try {
              var c,
                  l,
                  i,
                  j = b.location,
                  g = j.hash;c = function c(a, b) {
                return (l = a.match(RegExp(b + "=([^&]*)"))) ? l[1] : null;
              };g && c(g, "state") && (i = JSON.parse(decodeURIComponent(c(g, "state"))), "mpeditor" === i.action && (b.sessionStorage.setItem("_mpcehash", g), history.replaceState(i.desiredHash || "", e.title, j.pathname + j.search)));
            } catch (m) {}var k, h;window.mixpanel = a;a._i = [];a.init = function (b, c, f) {
              function e(b, a) {
                var c = a.split(".");2 == c.length && (b = b[c[0]], a = c[1]);b[a] = function () {
                  b.push([a].concat(Array.prototype.slice.call(arguments, 0)));
                };
              }var d = a;"undefined" !== typeof f ? d = a[f] = [] : f = "mixpanel";d.people = d.people || [];d.toString = function (b) {
                var a = "mixpanel";"mixpanel" !== f && (a += "." + f);b || (a += " (stub)");return a;
              };d.people.toString = function () {
                return d.toString(1) + ".people (stub)";
              };k = "disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config reset people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
              for (h = 0; h < k.length; h++) {
                e(d, k[h]);
              }a._i.push([b, c, f]);
            };a.__SV = 1.2;b = e.createElement("script");b.type = "text/javascript";b.async = !0;b.src = "undefined" !== typeof MIXPANEL_CUSTOM_LIB_URL ? MIXPANEL_CUSTOM_LIB_URL : "file:" === e.location.protocol && "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//) ? "https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js" : "//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";c = e.getElementsByTagName("script")[0];c.parentNode.insertBefore(b, c);
          }
        })(document, window.mixpanel || []);
        mixpanel.init(token, { "api_host": "https://api.mixpanel.com", "secure_cookie": true });
        /* eslint-enable */
      }
    },
    identify: function identify() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = compact(options);
      var distinctId = compactedOptions.distinctId;

      var props = without(compactedOptions, 'distinctId');

      if (isPresent(props) && _canUseDom.default) {
        window.mixpanel.identify(distinctId);
        window.mixpanel.people.set(props);
      } else if (_canUseDom.default) {
        window.mixpanel.identify(distinctId);
      }
    },
    trackEvent: function trackEvent() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = compact(options);
      var event = compactedOptions.event;

      var props = without(compactedOptions, 'event');

      if (isPresent(props) && _canUseDom.default) {
        window.mixpanel.track(event, props);
      } else if (_canUseDom.default) {
        window.mixpanel.track(event);
      }
    },
    trackPage: function trackPage() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var event = { event: 'page viewed' };
      var mergedOptions = assign(event, options);

      this.trackEvent(mergedOptions);
    },
    alias: function alias() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = compact(options);
      var alias = compactedOptions.alias,
          original = compactedOptions.original;


      if (original && _canUseDom.default) {
        window.mixpanel.alias(alias, original);
      } else if (_canUseDom.default) {
        window.mixpanel.alias(alias);
      }
    },
    willDestroy: function willDestroy() {
      if (_canUseDom.default) {
        $('script[src*="mixpanel"]').remove();
        delete window.mixpanel;
      }
    }
  });
});