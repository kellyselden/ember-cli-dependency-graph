define('ember-awesome-macros/promise/-utils', ['exports', 'ember-macro-helpers/curried-computed'], function (exports, _curriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.wrapPromiseProxy = wrapPromiseProxy;
  var RSVP = Ember.RSVP;
  var PromiseProxyMixin = Ember.PromiseProxyMixin;
  var resolve = RSVP.resolve;
  function wrapPromiseProxy(Proxy) {
    var PromiseProxy = Proxy.extend(PromiseProxyMixin);

    return (0, _curriedComputed.default)(function (promise) {
      if (promise === undefined) {
        promise = resolve(undefined);
      }

      return PromiseProxy.create({
        promise: promise
      });
    });
  }
});