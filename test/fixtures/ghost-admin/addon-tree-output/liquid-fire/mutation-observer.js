define('liquid-fire/mutation-observer', ['exports', 'liquid-fire/is-browser'], function (exports, _isBrowser) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.testingKick = testingKick;

  var activePollers = [];

  function MutationPoller(callback) {
    this.callback = callback;
  }

  MutationPoller.prototype = {
    observe: function observe() {
      this.interval = setInterval(this.callback, 100);
      activePollers.push(this);
    },
    disconnect: function disconnect() {
      clearInterval(this.interval);
      activePollers.splice(activePollers.indexOf(this), 1);
    }
  };

  var M = void 0;
  if ((0, _isBrowser.default)()) {
    M = window.MutationObserver || window.WebkitMutationObserver || MutationPoller;
  } else {
    M = MutationPoller;
  }

  exports.default = M;


  // PhantomJS does not have real mutation observers, so to get
  // reasonable test timing we have to manually kick it.
  function testingKick() {
    for (var i = 0; i < activePollers.length; i++) {
      activePollers[i].callback();
    }
  }
});