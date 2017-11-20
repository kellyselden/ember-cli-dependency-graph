define('ember-metrics/metrics-adapters/base', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var emberObject = Ember.Object,
      assert = Ember.assert,
      guidFor = Ember.guidFor,
      typeOf = Ember.typeOf;


  function makeToString(ret) {
    return function () {
      return ret;
    };
  }

  exports.default = emberObject.extend({
    init: function init() {
      assert('[ember-metrics] ' + this.toString() + ' must implement the init hook!');
    },
    willDestroy: function willDestroy() {
      assert('[ember-metrics] ' + this.toString() + ' must implement the willDestroy hook!');
    },
    toString: function toString() {
      var hasToStringExtension = typeOf(this.toStringExtension) === 'function';
      var extension = hasToStringExtension ? ':' + this.toStringExtension() : '';
      var ret = 'ember-metrics@metrics-adapter:' + extension + ':' + guidFor(this);

      this.toString = makeToString(ret);
      return ret;
    },


    metrics: null,
    config: null,
    identify: function identify() {},
    trackEvent: function trackEvent() {},
    trackPage: function trackPage() {},
    alias: function alias() {}
  });
});