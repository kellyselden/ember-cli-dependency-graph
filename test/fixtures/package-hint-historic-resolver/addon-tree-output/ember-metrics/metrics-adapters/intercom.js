define('ember-metrics/metrics-adapters/intercom', ['exports', 'ember-metrics/utils/can-use-dom', 'ember-metrics/utils/object-transforms', 'ember-metrics/metrics-adapters/base'], function (exports, _canUseDom, _objectTransforms, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var $ = Ember.$,
      assert = Ember.assert,
      get = Ember.get;
  var compact = _objectTransforms.default.compact,
      without = _objectTransforms.default.without;

  var assign = Ember.assign || Ember.merge;

  exports.default = _base.default.extend({
    booted: false,

    toStringExtension: function toStringExtension() {
      return 'Intercom';
    },
    init: function init() {
      var _get = get(this, 'config'),
          appId = _get.appId;

      assert('[ember-metrics] You must pass a valid `appId` to the ' + this.toString() + ' adapter', appId);

      if (_canUseDom.default) {
        /* eslint-disable */
        (function () {
          var w = window;var ic = w.Intercom;if (typeof ic === "function") {
            ic('reattach_activator');ic('update', {});
          } else {
            var l = function l() {
              var s = d.createElement('script');s.type = 'text/javascript';s.async = true;
              s.src = 'https://widget.intercom.io/widget/' + appId;
              var x = d.getElementsByTagName('script')[0];x.parentNode.insertBefore(s, x);
            };

            var d = document;var i = function i() {
              i.c(arguments);
            };i.q = [];i.c = function (args) {
              i.q.push(args);
            };w.Intercom = i;l();
          }
        })();
        /* eslint-enable */
      }
    },
    identify: function identify() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var _get2 = get(this, 'config'),
          appId = _get2.appId;

      var compactedOptions = compact(options);
      var distinctId = compactedOptions.distinctId;

      var props = without(compactedOptions, 'distinctId');

      props.app_id = appId;
      if (distinctId) {
        props.user_id = distinctId;
      }

      assert('[ember-metrics] You must pass `distinctId` or `email` to `identify()` when using the ' + this.toString() + ' adapter', props.email || props.user_id);

      var method = this.booted ? 'update' : 'boot';
      if (_canUseDom.default) {
        window.Intercom(method, props);
        this.booted = true;
      }
    },
    trackEvent: function trackEvent() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = compact(options);
      var event = compactedOptions.event;

      var props = without(compactedOptions, 'event');

      if (_canUseDom.default) {
        window.Intercom('trackEvent', event, props);
      }
    },
    trackPage: function trackPage() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var event = { event: 'page viewed' };
      var mergedOptions = assign(event, options);

      this.trackEvent(mergedOptions);
    },
    willDestroy: function willDestroy() {
      if (_canUseDom.default) {
        $('script[src*="intercom"]').remove();
        delete window.Intercom;
      }
    }
  });
});