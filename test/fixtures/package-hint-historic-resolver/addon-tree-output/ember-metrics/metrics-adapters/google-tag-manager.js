define('ember-metrics/metrics-adapters/google-tag-manager', ['exports', 'ember-metrics/utils/can-use-dom', 'ember-metrics/utils/object-transforms', 'ember-metrics/metrics-adapters/base'], function (exports, _canUseDom, _objectTransforms, _base) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var assert = Ember.assert,
      get = Ember.get,
      set = Ember.set,
      $ = Ember.$,
      getWithDefault = Ember.getWithDefault,
      capitalize = Ember.String.capitalize;

  var assign = Ember.assign || Ember.merge;
  var compact = _objectTransforms.default.compact;
  exports.default = _base.default.extend({
    dataLayer: 'dataLayer',

    toStringExtension: function toStringExtension() {
      return 'GoogleTagManager';
    },
    init: function init() {
      var config = get(this, 'config');
      var id = config.id,
          envParams = config.envParams;

      var dataLayer = getWithDefault(config, 'dataLayer', 'dataLayer');
      var envParamsString = envParams ? '&' + envParams : '';

      assert('[ember-metrics] You must pass a valid `id` to the ' + this.toString() + ' adapter', id);

      set(this, 'dataLayer', dataLayer);

      if (_canUseDom.default) {
        (function (w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({
            'gtm.start': new Date().getTime(),
            event: 'gtm.js'
          });
          var f = d.getElementsByTagName(s)[0],
              j = d.createElement(s),
              dl = l !== 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl + envParamsString;
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', get(this, 'dataLayer'), id);
      }
    },
    trackEvent: function trackEvent() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = compact(options);
      var dataLayer = get(this, 'dataLayer');
      var gtmEvent = { 'event': compactedOptions['event'] };

      delete compactedOptions['event'];

      for (var key in compactedOptions) {
        var capitalizedKey = capitalize(key);
        gtmEvent['event' + capitalizedKey] = compactedOptions[key];
      }

      if (_canUseDom.default) {
        window[dataLayer].push(gtmEvent);
      }

      return gtmEvent;
    },
    trackPage: function trackPage() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var compactedOptions = compact(options);
      var dataLayer = get(this, 'dataLayer');
      var sendEvent = {
        event: compactedOptions['event'] || 'pageview'
      };

      var pageEvent = assign(sendEvent, compactedOptions);

      if (_canUseDom.default) {
        window[dataLayer].push(pageEvent);
      }

      return pageEvent;
    },
    willDestroy: function willDestroy() {
      if (_canUseDom.default) {
        $('script[src*="gtm.js"]').remove();
        delete window.dataLayer;
      }
    }
  });
});