define("liquid-fire/dsl", ["exports", "liquid-fire/animate", "liquid-fire/rule", "liquid-fire/constraint", "liquid-fire/action"], function (exports, _animate, _rule, _constraint, _action) {
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

  var DSL = function () {
    function DSL(map, constraints) {
      _classCallCheck(this, DSL);

      this.map = map;
      this.constraints = constraints;
    }

    _createClass(DSL, [{
      key: "setDefault",
      value: function setDefault(props) {
        (0, _animate.setDefaults)(props);
      }
    }, {
      key: "transition",
      value: function transition() {
        var rule = new _rule.default();
        var parts = Array.prototype.slice.apply(arguments).reduce(function (a, b) {
          return a.concat(b);
        }, []);

        for (var i = 0; i < parts.length; i++) {
          rule.add(parts[i]);
        }

        rule.validate(this.map);
        this.constraints.addRule(rule);
      }
    }, {
      key: "fromRoute",
      value: function fromRoute(routeName) {
        return [new _constraint.default('oldRoute', routeName)];
      }
    }, {
      key: "toRoute",
      value: function toRoute(routeName) {
        return [new _constraint.default('newRoute', routeName)];
      }
    }, {
      key: "withinRoute",
      value: function withinRoute(routeName) {
        return this.fromRoute(routeName).concat(this.toRoute(routeName));
      }
    }, {
      key: "fromValue",
      value: function fromValue(matcher) {
        return [new _constraint.default('oldValue', matcher)];
      }
    }, {
      key: "toValue",
      value: function toValue(matcher) {
        return [new _constraint.default('newValue', matcher)];
      }
    }, {
      key: "betweenValues",
      value: function betweenValues(matcher) {
        return this.fromValue(matcher).concat(this.toValue(matcher));
      }
    }, {
      key: "fromModel",
      value: function fromModel(matcher) {
        return [new _constraint.default('oldModel', matcher)];
      }
    }, {
      key: "toModel",
      value: function toModel(matcher) {
        return [new _constraint.default('newModel', matcher)];
      }
    }, {
      key: "betweenModels",
      value: function betweenModels(matcher) {
        return this.fromModel(matcher).concat(this.toModel(matcher));
      }
    }, {
      key: "hasClass",
      value: function hasClass(name) {
        return new _constraint.default('parentElementClass', name);
      }
    }, {
      key: "matchSelector",
      value: function matchSelector(selector) {
        return new _constraint.default('parentElement', function (elt) {
          return elt.is(selector);
        });
      }
    }, {
      key: "childOf",
      value: function childOf(selector) {
        return this.matchSelector(selector + ' > *');
      }
    }, {
      key: "use",
      value: function use(nameOrHandler) {
        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        return new _action.default(nameOrHandler, args);
      }
    }, {
      key: "reverse",
      value: function reverse(nameOrHandler) {
        for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
          args[_key2 - 1] = arguments[_key2];
        }

        return new _action.default(nameOrHandler, args, { reversed: true });
      }
    }, {
      key: "useAndReverse",
      value: function useAndReverse(nameOrHandler) {
        for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
          args[_key3 - 1] = arguments[_key3];
        }

        return [this.use.apply(this, [nameOrHandler].concat(args)), this.reverse.apply(this, [nameOrHandler].concat(args))];
      }
    }, {
      key: "onInitialRender",
      value: function onInitialRender() {
        return new _constraint.default('firstTime', 'yes');
      }
    }, {
      key: "includingInitialRender",
      value: function includingInitialRender() {
        return new _constraint.default('firstTime', ['yes', 'no']);
      }
    }, {
      key: "inHelper",
      value: function inHelper() {
        for (var _len4 = arguments.length, names = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          names[_key4] = arguments[_key4];
        }

        return new _constraint.default('helperName', names);
      }
    }, {
      key: "outletName",
      value: function outletName() {
        for (var _len5 = arguments.length, names = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
          names[_key5] = arguments[_key5];
        }

        return new _constraint.default('outletName', names);
      }
    }, {
      key: "media",
      value: function media(query) {
        return new _constraint.default('media', function () {
          return window.matchMedia(query).matches;
        });
      }
    }, {
      key: "debug",
      value: function debug() {
        return 'debug';
      }
    }]);

    return DSL;
  }();

  exports.default = DSL;
});