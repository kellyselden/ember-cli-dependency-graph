define('ember-wait-for-test-helper/wait-for', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.activeCount = activeCount;
  exports.cleanup = cleanup;
  exports.selectorToExist = selectorToExist;
  exports.waitFor = waitFor;
  var $ = Ember.$,
      registerAsyncHelper = Ember.Test.registerAsyncHelper,
      Promise = Ember.RSVP.Promise;


  function _waitFor(app, selectorOrFn, contextOrOptions, selectorOptions) {
    var waitForFn = void 0;
    var options = void 0;

    // find the options argument
    if (typeof contextOrOptions === 'string') {
      options = selectorOptions;
    } else {
      options = contextOrOptions;
    }

    // option defaults
    options = options || {};
    options.interval = options.interval || 1;

    // Support old API where you can pass in a selector as
    // a string and we'll wait for that to exist. Can also
    // pass along context and count option.
    if (typeof selectorOrFn === 'string') {
      var selector = void 0;
      var count = options.count || 1;

      // if context is a string we'll use it to scope the
      // selector
      if (typeof contextOrOptions === 'string') {
        var context = contextOrOptions;
        selector = context + ' ' + selectorOrFn;
      } else {
        selector = selectorOrFn;
      }

      waitForFn = selectorToExist(selector, count);
    } else {
      // new style, selectorOrFn is a function
      waitForFn = selectorOrFn;
    }

    return new Promise(function (resolve) {
      var label = waitForFn;

      var isComplete = waitForFn;

      function stopTrying() {
        return !isActive(label);
      }

      function loop() {
        var timer = setTimeout(peek, options.interval);
        track(label, timer);
      }

      function peek() {
        Promise.resolve(isComplete()).then(function (isComplete) {
          if (isComplete || stopTrying()) {
            resolve(done(label));
          } else {
            loop();
          }
        });
      }

      loop();
    });
  }

  // Normally we we use Map here, but that doesn't work
  // in phantom without including the babel polyfill.
  // Note that Ember.Map is private, so we may have
  // to refactor this out at some point.
  var runningWaiters = new Ember.Map();

  function track(label, timer) {
    runningWaiters.set(label, timer);
  }

  function done(label) {
    runningWaiters.delete(label);
  }

  function isActive(label) {
    return runningWaiters.has(label);
  }

  function activeCount() {
    return runningWaiters.size;
  }

  function cleanup() {
    return runningWaiters.clear();
  }

  function selectorToExist(selector, count) {
    return function () {
      var existsCount = $(selector).length;

      if (count) {
        return existsCount === count;
      } else {
        return existsCount > 0;
      }
    };
  }

  function waitFor(selector, context, options) {
    return _waitFor(null, selector, context, options);
  }

  exports.default = registerAsyncHelper('waitFor', _waitFor);
});