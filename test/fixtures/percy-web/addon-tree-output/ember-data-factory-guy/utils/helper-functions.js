define('ember-data-factory-guy/utils/helper-functions', ['exports', 'require'], function (exports, _require2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.excludeRegex = undefined;
  exports.toParams = toParams;
  exports.isEmptyObject = isEmptyObject;
  exports.isObject = isObject;
  exports.mergeDeep = mergeDeep;
  exports.isEquivalent = isEquivalent;
  exports.isPartOf = isPartOf;
  exports.requireFiles = requireFiles;

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  /**
   *
   * @param obj
   */
  function toParams(obj) {
    return parseParms(decodeURIComponent(Ember.$.param(obj)));
  }

  function parseParms(str) {
    var pieces = str.split("&"),
        data = {},
        i = void 0,
        parts = void 0,
        key = void 0,
        value = void 0;

    // Process each query pair
    for (i = 0; i < pieces.length; i++) {
      parts = pieces[i].split("=");

      // No value, only key
      if (parts.length < 2) {
        parts.push("");
      }

      key = decodeURIComponent(parts[0]);
      value = decodeURIComponent(parts[1]);

      // Key is an array
      if (key.indexOf("[]") !== -1) {
        key = key.substring(0, key.indexOf("[]"));

        // Check already there
        if ("undefined" === typeof data[key]) {
          data[key] = [];
        }

        data[key].push(value);
      } else {
        data[key] = value;
      }
    }
    return data;
  }

  function isEmptyObject(obj) {
    return !isObject(obj) || Object.keys(obj).length === 0;
  }

  /**
   * Simple object check.
   * @param item
   * @returns {boolean}
   */
  function isObject(item) {
    return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item);
  }

  /**
   * Deep merge two objects.
   * @param target
   * @param ...sources
   */
  function mergeDeep(target) {
    for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      sources[_key - 1] = arguments[_key];
    }

    if (!sources.length) return target;
    var source = sources.shift();

    if (isObject(target) && isObject(source)) {
      for (var key in source) {
        if (isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, _defineProperty({}, key, {}));
          }
          mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, _defineProperty({}, key, source[key]));
        }
      }
    }

    return mergeDeep.apply(undefined, [target].concat(sources));
  }

  function isEquivalent(a, b) {
    var type = Ember.typeOf(a);
    if (type !== Ember.typeOf(b)) {
      return false;
    }
    switch (type) {
      case 'object':
        return objectIsEquivalent(a, b);
      case 'array':
        return arrayIsEquivalent(a, b);
      default:
        return a === b;
    }
  }

  function isPartOf(object, part) {
    return Object.keys(part).every(function (key) {
      return isEquivalent(object[key], part[key]);
    });
  }

  function arrayIsEquivalent(arrayA, arrayB) {
    if (arrayA.length !== arrayB.length) {
      return false;
    }
    return arrayA.every(function (item, index) {
      return isEquivalent(item, arrayB[index]);
    });
  }

  function objectIsEquivalent(objectA, objectB) {
    var aProps = Object.keys(objectA),
        bProps = Object.keys(objectB);
    if (aProps.length !== bProps.length) {
      return false;
    }
    for (var i = 0; i < aProps.length; i++) {
      var propName = aProps[i],
          aEntry = objectA[propName],
          bEntry = objectB[propName];
      if (!isEquivalent(aEntry, bEntry)) {
        return false;
      }
    }
    return true;
  }

  // always exclude jshint or jscs files
  var excludeRegex = exports.excludeRegex = new RegExp('[^\s]+(\\.(jscs|jshint))$', 'i');

  /**
   * Find files that have been seen by some tree in the application
   * and require them. Always exclude jshint and jscs files
   *
   * @param filePattern
   * @returns {Array}
   */
  function requireFiles(filePattern) {
    var filesSeen = Object.keys(requirejs._eak_seen);

    return filesSeen.filter(function (moduleName) {
      return !excludeRegex.test(moduleName) && filePattern.test(moduleName);
    }).map(function (moduleName) {
      return (0, _require2.default)(moduleName, null, null, true);
    });
  }
});