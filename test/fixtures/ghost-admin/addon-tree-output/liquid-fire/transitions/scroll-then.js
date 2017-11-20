define('liquid-fire/transitions/scroll-then', ['exports', 'liquid-fire/is-browser'], function (exports, _isBrowser) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (nextTransitionName, options) {
    for (var _len = arguments.length, rest = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      rest[_key - 2] = arguments[_key];
    }

    var _this = this;

    if ((0, _isBrowser.default)()) {
      (true && !('string' === typeof nextTransitionName) && Ember.assert("You must provide a transition name as the first argument to scrollThen. Example: this.use('scrollThen', 'toLeft')", 'string' === typeof nextTransitionName));


      var el = document.getElementsByTagName('html');
      var nextTransition = this.lookup(nextTransitionName);
      if (!options) {
        options = {};
      }

      (true && !('object' === (typeof options === 'undefined' ? 'undefined' : _typeof(options))) && Ember.assert("The second argument to scrollThen is passed to Velocity's scroll function and must be an object", 'object' === (typeof options === 'undefined' ? 'undefined' : _typeof(options))));

      // set scroll options via: this.use('scrollThen', 'ToLeft', {easing: 'spring'})

      options = merge({ duration: 500, offset: 0 }, options);

      // additional args can be passed through after the scroll options object
      // like so: this.use('scrollThen', 'moveOver', {duration: 100}, 'x', -1);

      return window.$.Velocity(el, 'scroll', options).then(function () {
        nextTransition.apply(_this, rest);
      });
    }
  };

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var merge = Ember.merge;
});