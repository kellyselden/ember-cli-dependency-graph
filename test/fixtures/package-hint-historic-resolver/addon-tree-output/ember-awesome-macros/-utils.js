define('ember-awesome-macros/-utils', ['exports', 'ember-macro-helpers/curried-computed', 'ember-macro-helpers/lazy-curried-computed'], function (exports, _curriedComputed, _lazyCurriedComputed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.reduceKeys = reduceKeys;
  exports.reduceKeys2 = reduceKeys2;
  exports.checkArgs = checkArgs;
  exports.safelyCreateComputed = safelyCreateComputed;
  exports.deprecate = deprecate;
  function reduceKeys(func) {
    return (0, _curriedComputed.default)(function () {
      for (var _len = arguments.length, values = Array(_len), _key = 0; _key < _len; _key++) {
        values[_key] = arguments[_key];
      }

      if (values.length === 0) {
        return 0;
      }
      return values.reduce(function (total, next, i) {
        if (Array.isArray(next)) {
          if (next.length === 0) {
            next = 0;
          } else {
            next = next.reduce(func);
          }
        }
        if (i === 0) {
          return next;
        }
        return func(total, next);
      }, null);
    });
  }

  function reduceKeys2(callback) {
    return (0, _lazyCurriedComputed.default)(function (get) {
      for (var _len2 = arguments.length, keys = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        keys[_key2 - 1] = arguments[_key2];
      }

      var last = void 0;
      for (var i = 0; i < keys.length; i++) {
        last = get(keys[i]);
        if (callback(last)) {
          return last;
        }
      }
      return last;
    });
  }

  function checkArgs(callback) {
    return function () {
      for (var _len3 = arguments.length, values = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        values[_key3] = arguments[_key3];
      }

      for (var i = 0; i < values.length; i++) {
        if (values[i] === undefined) {
          return;
        }
      }
      return callback.apply(undefined, values);
    };
  }

  function safelyCreateComputed(funcStr) {
    return (0, _curriedComputed.default)(checkArgs(function (source) {
      for (var _len4 = arguments.length, args = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
        args[_key4 - 1] = arguments[_key4];
      }

      return source[funcStr].apply(source, args);
    }));
  }

  var deprecateFunc = Ember.deprecateFunc;


  var projectName = 'ember-awesome-macros';
  var until = 'sometime before 1.0';

  function deprecate(newFunc, oldKey, newKey) {
    return deprecateFunc(oldKey + ' is deprecated, please use ' + newKey, {
      id: projectName + '.' + oldKey,
      until: until
    }, newFunc);
  }
});