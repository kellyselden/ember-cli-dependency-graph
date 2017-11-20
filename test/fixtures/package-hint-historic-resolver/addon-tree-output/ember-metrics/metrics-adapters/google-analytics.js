define('ember-metrics/metrics-adapters/google-analytics', ['exports', 'ember-metrics/utils/can-use-dom', 'ember-metrics/utils/object-transforms', 'ember-metrics/metrics-adapters/base'], function (exports, _canUseDom, _objectTransforms, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isPresent = Ember.isPresent,
      copy = Ember.copy,
      assert = Ember.assert,
      get = Ember.get,
      $ = Ember.$,
      capitalize = Ember.String.capitalize;
  var compact = _objectTransforms.default.compact;

  var assign = Ember.assign || Ember.merge;

  exports.default = _base.default.extend({
    toStringExtension: function toStringExtension() {
      return 'GoogleAnalytics';
    },
    init: function init() {
      var config = copy(get(this, 'config'));
      var id = config.id,
          sendHitTask = config.sendHitTask,
          trace = config.trace,
          require = config.require;
      var debug = config.debug;


      assert('[ember-metrics] You must pass a valid `id` to the ' + this.toString() + ' adapter', id);

      delete config.id;
      delete config.require;

      if (debug) {
        delete config.debug;
      }
      if (sendHitTask) {
        delete config.sendHitTask;
      }
      if (trace) {
        delete config.trace;
      }

      var hasOptions = isPresent(Object.keys(config));

      if (_canUseDom.default) {

        /* eslint-disable */
        (function (i, s, o, g, r, a, m) {
          i['GoogleAnalyticsObject'] = r;i[r] = i[r] || function () {
            (i[r].q = i[r].q || []).push(arguments);
          }, i[r].l = 1 * new Date();a = s.createElement(o), m = s.getElementsByTagName(o)[0];a.async = 1;a.src = g;m.parentNode.insertBefore(a, m);
        })(window, document, 'script', 'https://www.google-analytics.com/analytics' + (debug ? '_debug' : '') + '.js', 'ga');
        /* eslint-enable */

        if (trace === true) {
          window.ga_debug = { trace: true };
        }

        if (hasOptions) {
          window.ga('create', id, config);
        } else {
          window.ga('create', id, 'auto');
        }

        if (require) {
          require.forEach(function (plugin) {
            window.ga('require', plugin);
          });
        }

        if (sendHitTask === false) {
          window.ga('set', 'sendHitTask', null);
        }
      }
    },
    identify: function identify() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = compact(options);
      var distinctId = compactedOptions.distinctId;


      if (_canUseDom.default) {
        window.ga('set', 'userId', distinctId);
      }
    },
    trackEvent: function trackEvent() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = compact(options);
      var sendEvent = { hitType: 'event' };
      var eventKeys = ['category', 'action', 'label', 'value'];
      var gaEvent = {};

      if (compactedOptions.nonInteraction) {
        gaEvent.nonInteraction = compactedOptions.nonInteraction;
        delete compactedOptions.nonInteraction;
      }

      for (var key in compactedOptions) {
        if (eventKeys.includes(key)) {
          var capitalizedKey = capitalize(key);
          gaEvent['event' + capitalizedKey] = compactedOptions[key];
        } else {
          gaEvent[key] = compactedOptions[key];
        }
      }

      var event = assign(sendEvent, gaEvent);
      if (_canUseDom.default) {
        window.ga('send', event);
      }

      return event;
    },
    trackPage: function trackPage() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = compact(options);
      var sendEvent = { hitType: 'pageview' };

      var event = assign(sendEvent, compactedOptions);
      for (var key in compactedOptions) {
        if (compactedOptions.hasOwnProperty(key)) {
          window.ga('set', key, compactedOptions[key]);
        }
      }
      if (_canUseDom.default) {
        window.ga('send', sendEvent);
      }

      return event;
    },
    willDestroy: function willDestroy() {
      if (_canUseDom.default) {
        $('script[src*="google-analytics"]').remove();
        delete window.ga;
      }
    }
  });
});