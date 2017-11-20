define("liquid-fire/rule", ["exports", "liquid-fire/action", "liquid-fire/constraint"], function (exports, _action, _constraint) {
  "use strict";

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

  var A = Ember.A;

  var Rule = function () {
    function Rule() {
      _classCallCheck(this, Rule);

      this.constraints = A();
      this.use = null;
      this.reverse = null;
    }

    _createClass(Rule, [{
      key: "add",
      value: function add(thing) {
        if (thing instanceof _action.default) {
          var prop = 'use';
          if (thing.reversed) {
            prop = 'reverse';
          }
          if (this[prop]) {
            throw new Error("More than one \"" + prop + "\" statement in the same transition rule is not allowed");
          }
          this[prop] = thing;
        } else if (thing === 'debug') {
          this.debug = true;
        } else {
          this.constraints.push(thing);
        }
      }
    }, {
      key: "validate",
      value: function validate(transitionMap) {
        if (!this.use) {
          throw new Error("Every transition rule must include a \"use\" statement");
        }
        this.use.validateHandler(transitionMap);
        if (this.reverse) {
          this.reverse.validateHandler(transitionMap);
        }
        if (!this.constraints.find(function (c) {
          return c.target === 'firstTime';
        })) {
          this.constraints.push(new _constraint.default('firstTime', 'no'));
        }
      }
    }, {
      key: "invert",
      value: function invert() {
        var rule = new this.constructor();
        rule.use = this.reverse;
        rule.reverse = this.use;
        rule.constraints = this.constraints.map(function (c) {
          return c.invert();
        });
        rule.debug = this.debug;
        return rule;
      }
    }]);

    return Rule;
  }();

  exports.default = Rule;
});