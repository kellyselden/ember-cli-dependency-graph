define('liquid-fire/constraint', ['exports', 'liquid-fire/constrainables'], function (exports, _constrainables) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ANY = exports.EMPTY = undefined;
  exports.constraintKeys = constraintKeys;

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

  var guidFor = Ember.guidFor;
  var isArray = Ember.isArray;
  var A = Ember.A;

  var Constraint = function () {
    function Constraint(target, matcher) {
      _classCallCheck(this, Constraint);

      // targets are the properties of a transition that we can
      // constrain
      this.target = target;
      if (arguments.length === 1) {
        return;
      }
      if (matcher instanceof RegExp) {
        this.predicate = function (value) {
          return matcher.test(value);
        };
      } else if (typeof matcher === 'function') {
        this.predicate = matcher;
      } else if (typeof matcher === 'boolean') {
        this.predicate = function (value) {
          return matcher ? value : !value;
        };
      } else {
        this.keys = constraintKeys(matcher);
      }
    }

    _createClass(Constraint, [{
      key: 'invert',
      value: function invert() {
        if (!_constrainables.default[this.target].reversesTo) {
          return this;
        }
        var inverse = new this.constructor(_constrainables.default[this.target].reversesTo);
        inverse.predicate = this.predicate;
        inverse.keys = this.keys;
        return inverse;
      }
    }]);

    return Constraint;
  }();

  exports.default = Constraint;
  var EMPTY = exports.EMPTY = '__liquid_fire_EMPTY__';
  var ANY = exports.ANY = '__liquid_fire_ANY__';

  function constraintKeys(matcher) {
    if (typeof matcher === 'undefined' || matcher === null) {
      matcher = [EMPTY];
    } else if (!isArray(matcher)) {
      matcher = [matcher];
    }
    return A(matcher).map(function (elt) {
      if (typeof elt === 'string') {
        return elt;
      } else {
        return guidFor(elt);
      }
    });
  }
});