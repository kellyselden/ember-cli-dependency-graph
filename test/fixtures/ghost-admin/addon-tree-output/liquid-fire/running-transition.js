define('liquid-fire/running-transition', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var capitalize = Ember.String.capitalize;

  var RunningTransition = function () {
    function RunningTransition(transitionMap, versions, animation) {
      _classCallCheck(this, RunningTransition);

      this.transitionMap = transitionMap;
      this.animation = animation || transitionMap.lookup('default');
      this.animationContext = publicAnimationContext(this, versions);
    }

    _createClass(RunningTransition, [{
      key: 'run',
      value: function run() {
        var _this = this;

        if (this._ran) {
          return this._ran;
        }

        this.transitionMap.incrementRunningTransitions();
        return this._ran = this._invokeAnimation().catch(function (err) {
          // If the animation blew up, try to leave the DOM in a
          // non-broken state as best we can before rethrowing.
          return _this.transitionMap.lookup('default').apply(_this.animationContext).then(function () {
            throw err;
          });
        }).finally(function () {
          _this.transitionMap.decrementRunningTransitions();
        });
      }
    }, {
      key: 'interrupt',
      value: function interrupt() {
        this.interrupted = true;
        this.animationContext.oldElement = null;
        this.animationContext.newElement = null;
        this.animationContext.older.forEach(function (entry) {
          entry.element = null;
        });
      }
    }, {
      key: '_invokeAnimation',
      value: function _invokeAnimation() {
        var _this2 = this;

        return this.animation.run(this.animationContext).then(function () {
          return _this2.interrupted;
        });
      }
    }]);

    return RunningTransition;
  }();

  exports.default = RunningTransition;


  // This defines the public set of things that user's transition
  // implementations can access as `this`.
  function publicAnimationContext(rt, versions) {
    var c = {};
    addPublicVersion(c, 'new', versions[0]);
    if (versions[1]) {
      addPublicVersion(c, 'old', versions[1]);
    }
    c.older = versions.slice(2).map(function (v) {
      var context = {};
      addPublicVersion(context, null, v);
      return context;
    });

    // Animations are allowed to look each other up.
    c.lookup = function (name) {
      return rt.transitionMap.lookup(name);
    };

    return c;
  }

  function addPublicVersion(context, prefix, version) {
    var props = {
      view: version.view,
      element: version.view ? version.view.$() : null,
      value: version.value
    };
    for (var key in props) {
      var outputKey = key;
      if (props.hasOwnProperty(key)) {
        if (prefix) {
          outputKey = prefix + capitalize(key);
        }
        context[outputKey] = props[key];
      }
    }
  }
});