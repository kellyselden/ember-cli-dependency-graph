define("liquid-fire/index", ["exports", "liquid-fire/mixins/pausable", "liquid-fire/transition-map", "liquid-fire/animate", "liquid-fire/promise", "liquid-fire/mutation-observer"], function (exports, _pausable, _transitionMap, _animate, _promise, _mutationObserver) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.MutationObserver = exports.Promise = exports.finish = exports.timeRemaining = exports.timeSpent = exports.isAnimating = exports.stop = exports.animate = exports.TransitionMap = exports.Pausable = undefined;
  Object.defineProperty(exports, "Pausable", {
    enumerable: true,
    get: function () {
      return _pausable.default;
    }
  });
  exports.TransitionMap = _transitionMap.default;
  exports.animate = _animate.animate;
  exports.stop = _animate.stop;
  exports.isAnimating = _animate.isAnimating;
  exports.timeSpent = _animate.timeSpent;
  exports.timeRemaining = _animate.timeRemaining;
  exports.finish = _animate.finish;
  exports.Promise = _promise.default;
  exports.MutationObserver = _mutationObserver.default;
});