define("liquid-fire/animate", ["exports", "liquid-fire/promise", "velocity"], function (exports, _promise, _velocity) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.animate = animate;
  exports.stop = stop;
  exports.setDefaults = setDefaults;
  exports.isAnimating = isAnimating;
  exports.finish = finish;
  exports.timeSpent = timeSpent;
  exports.timeRemaining = timeRemaining;
  var copy = Ember.copy;


  // Make sure Velocity always has promise support by injecting our own
  // RSVP-based implementation if it doesn't already have one.
  if (!_velocity.default.Promise) {
    _velocity.default.Promise = _promise.default;
  }

  // Velocity's tick() defaults to RAF's high resolution timestamp. If the browser
  // is under high stress the RAF timestamp may have a significant offset which
  // can result in dropping a large chunk of frames. Because of this, the use of
  // the RAF timestamp should be opt-in.
  _velocity.default.timestamp = false;

  function animate(elt, props, opts, label) {
    // These numbers are just sane defaults in the probably-impossible
    // case where somebody tries to read our state before the first
    // 'progress' callback has fired.
    var state = { percentComplete: 0, timeRemaining: 100, timeSpent: 0 };

    if (!elt || elt.length === 0) {
      return _promise.default.resolve();
    }

    if (!opts) {
      opts = {};
    } else {
      opts = copy(opts);
    }

    // By default, we ask velocity to clear the element's `display`
    // and `visibility` properties at the start of animation. Our
    // animated divs are all initially rendered with `display:none`
    // and `visibility:hidden` to prevent a flash of before-animated
    // content.
    if (typeof opts.display === 'undefined') {
      opts.display = '';
    }
    if (typeof opts.visibility === 'undefined') {
      opts.visibility = 'visible';
    }

    if (opts.progress) {
      throw new Error("liquid-fire's 'animate' function reserves the use of Velocity's 'progress' option for its own nefarious purposes.");
    }

    opts.progress = function () {
      state.percentComplete = arguments[1];
      state.timeRemaining = arguments[2];
      state.timeSpent = state.timeRemaining / (1 / state.percentComplete - 1);
    };

    state.promise = _promise.default.resolve(_velocity.default.animate(elt[0], props, opts));

    if (label) {
      state.promise = state.promise.then(function () {
        clearLabel(elt, label);
      }, function (err) {
        clearLabel(elt, label);
        throw err;
      });
      applyLabel(elt, label, state);
    }

    return state.promise;
  }

  function stop(elt) {
    if (elt) {
      (0, _velocity.default)(elt[0], 'stop', true);
    }
  }

  function setDefaults(props) {
    for (var key in props) {
      if (props.hasOwnProperty(key)) {
        if (key === 'progress') {
          throw new Error("liquid-fire's 'animate' function reserves the use of Velocity's '" + key + "' option for its own nefarious purposes.");
        }
        _velocity.default.defaults[key] = props[key];
      }
    }
  }

  function isAnimating(elt, animationLabel) {
    return elt && elt.data('lfTags_' + animationLabel);
  }

  function finish(elt, animationLabel) {
    return stateForLabel(elt, animationLabel).promise;
  }

  function timeSpent(elt, animationLabel) {
    return stateForLabel(elt, animationLabel).timeSpent;
  }

  function timeRemaining(elt, animationLabel) {
    return stateForLabel(elt, animationLabel).timeRemaining;
  }

  function stateForLabel(elt, label) {
    var state = isAnimating(elt, label);
    if (!state) {
      throw new Error("no animation labeled " + label + " is in progress");
    }
    return state;
  }

  function applyLabel(elt, label, state) {
    if (elt) {
      elt.data('lfTags_' + label, state);
    }
  }

  function clearLabel(elt, label) {
    if (elt) {
      elt.data('lfTags_' + label, null);
    }
  }
});