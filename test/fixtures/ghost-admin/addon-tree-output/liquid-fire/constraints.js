define('liquid-fire/constraints', ['exports', 'liquid-fire/constraint', 'liquid-fire/constrainables'], function (exports, _constraint, _constrainables) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

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
  var guidFor = Ember.guidFor;

  var Constraints = function () {
    function Constraints() {
      _classCallCheck(this, Constraints);

      this.targets = {};
      this.ruleCounter = 0;
      for (var i = 0; i < constrainableKeys.length; i++) {
        this.targets[constrainableKeys[i]] = {};
      }
    }

    _createClass(Constraints, [{
      key: 'addRule',
      value: function addRule(rule) {
        rule.id = this.ruleCounter++;
        if (rule.debug) {
          this.debug = true;
        }
        this.addHalfRule(rule);
        if (rule.reverse) {
          var inverted = rule.invert();
          inverted.id = rule.id + ' reverse';
          this.addHalfRule(inverted);
        }
      }
    }, {
      key: 'addHalfRule',
      value: function addHalfRule(rule) {
        var _this = this;

        var seen = {};
        rule.constraints.forEach(function (constraint) {
          seen[constraint.target] = true;
          _this.addConstraint(rule, constraint);
        });
        constrainableKeys.forEach(function (key) {
          if (!seen[key]) {
            _this.addConstraint(rule, { target: key });
          }
        });
      }
    }, {
      key: 'addConstraint',
      value: function addConstraint(rule, constraint) {
        var _this2 = this;

        var context = this.targets[constraint.target];
        if (!context) {
          throw new Error('Unknown constraint target ' + constraint.target);
        }
        if (constraint.keys) {
          constraint.keys.forEach(function (key) {
            _this2.addKey(context, key, rule);
          });
        } else {
          this.addKey(context, _constraint.ANY, rule);
        }
      }
    }, {
      key: 'addKey',
      value: function addKey(context, key, rule) {
        if (!context[key]) {
          context[key] = {};
        }
        context[key][guidFor(rule)] = rule;
      }
    }, {
      key: 'bestMatch',
      value: function bestMatch(conditions) {
        if (this.debug) {
          console.log("[liquid-fire] Checking transition rules for", conditions.parentElement[0]);
        }

        var rules = this.match(conditions);
        var best = highestPriority(rules);

        if (rules.length > 1 && this.debug) {
          rules.forEach(function (rule) {
            if (rule !== best && rule.debug) {
              console.log(describeRule(rule) + ' matched, but it was superceded by another rule');
            }
          });
        }
        if (best && best.debug) {
          console.log(describeRule(best) + ' matched');
        }
        return best;
      }
    }, {
      key: 'match',
      value: function match(conditions) {
        var rules = this.matchByKeys(conditions);
        rules = this.matchPredicates(conditions, rules);
        return rules;
      }
    }, {
      key: 'matchByKeys',
      value: function matchByKeys(conditions) {
        var matchSets = [];
        for (var i = 0; i < constrainableKeys.length; i++) {
          var key = constrainableKeys[i];
          var value = conditionAccessor(conditions, key);
          matchSets.push(this.matchingSet(key, value));
        }
        return intersection(matchSets);
      }
    }, {
      key: 'matchingSet',
      value: function matchingSet(prop, value) {
        var keys = (0, _constraint.constraintKeys)(value);
        var context = this.targets[prop];
        var matched = A();
        for (var i = 0; i < keys.length; i++) {
          if (context[keys[i]]) {
            matched.push(context[keys[i]]);
          }
        }
        if (keys.length === 0 && context[_constraint.EMPTY]) {
          matched.push(context[_constraint.EMPTY]);
        }
        if (context[_constraint.ANY]) {
          matched.push(context[_constraint.ANY]);
        }
        matched = union(matched);
        if (this.debug) {
          this.logDebugRules(matched, context, prop, value);
        }
        return matched;
      }
    }, {
      key: 'logDebugRules',
      value: function logDebugRules(matched, context, target, value) {
        A(Object.keys(context)).forEach(function (setKey) {
          var set = context[setKey];
          A(Object.keys(set)).forEach(function (ruleKey) {
            var rule = set[ruleKey];
            if (rule.debug && !matched[guidFor(rule)]) {
              var _console;

              (_console = console).log.apply(_console, [describeRule(rule) + ' rejected because ' + target + ' was'].concat(_toConsumableArray(value)));
            }
          });
        });
      }
    }, {
      key: 'matchPredicates',
      value: function matchPredicates(conditions, rules) {
        var output = [];
        for (var i = 0; i < rules.length; i++) {
          var rule = rules[i];
          var matched = true;
          for (var j = 0; j < rule.constraints.length; j++) {
            var constraint = rule.constraints[j];
            if (constraint.predicate && !this.matchConstraintPredicate(conditions, rule, constraint)) {
              matched = false;
              break;
            }
          }
          if (matched) {
            output.push(rule);
          }
        }
        return output;
      }
    }, {
      key: 'matchConstraintPredicate',
      value: function matchConstraintPredicate(conditions, rule, constraint) {
        var values = conditionAccessor(conditions, constraint.target);
        var reverse = _constrainables.default[constraint.target].reversesTo;
        var inverseValues = void 0;
        if (reverse) {
          inverseValues = conditionAccessor(conditions, reverse);
        }
        for (var i = 0; i < values.length; i++) {
          if (constraint.predicate(values[i], inverseValues ? inverseValues[i] : null)) {
            return true;
          }
        }
        if (rule.debug) {
          var _console2;

          if (constraint.target === 'parentElement') {
            values = values.map(function (v) {
              return v[0];
            });
          }
          (_console2 = console).log.apply(_console2, [describeRule(rule) + ' rejected because of a constraint on ' + constraint.target + '. ' + constraint.target + ' was'].concat(_toConsumableArray(values)));
        }
      }
    }]);

    return Constraints;
  }();

  exports.default = Constraints;


  function conditionAccessor(conditions, key) {
    var constrainable = _constrainables.default[key];
    if (constrainable.accessor) {
      return constrainable.accessor(conditions) || [];
    } else {
      return [conditions[key]];
    }
  }

  // Returns a list of property values from source whose keys also
  // appear in all of the rest objects.
  function intersection(sets) {
    var source = sets[0];
    var rest = sets.slice(1);
    var keys = Object.keys(source);
    var keysLength = keys.length;
    var restLength = rest.length;
    var result = [];
    for (var keyIndex = 0; keyIndex < keysLength; keyIndex++) {
      var key = keys[keyIndex];
      var matched = true;
      for (var restIndex = 0; restIndex < restLength; restIndex++) {
        if (!rest[restIndex].hasOwnProperty(key)) {
          matched = false;
          break;
        }
      }
      if (matched) {
        result.push(source[key]);
      }
    }
    return result;
  }

  function union(sets) {
    var setsLength = sets.length;
    var output = {};
    for (var i = 0; i < setsLength; i++) {
      var set = sets[i];
      var keys = Object.keys(set);
      for (var j = 0; j < keys.length; j++) {
        var key = keys[j];
        output[key] = set[key];
      }
    }
    return output;
  }

  function describeRule(rule) {
    return '[liquid-fire rule ' + rule.id + ']';
  }

  function highestPriority(rules) {
    var best = void 0;
    var bestScore = 0;
    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      var score = rules[i].constraints.length;
      if (!best || score > bestScore || score === bestScore && rule.id > best.id) {
        best = rule;
        bestScore = score;
      }
    }
    return best;
  }

  var constrainableKeys = A(Object.keys(_constrainables.default));
});