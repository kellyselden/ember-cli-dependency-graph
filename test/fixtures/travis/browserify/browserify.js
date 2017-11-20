(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/ansiparse/lib/ansiparse.js":[function(require,module,exports){
function ansiparse(str) {
  //
  // I'm terrible at writing parsers.
  //
  var matchingControl = null,
      matchingData = null,
      matchingText = '',
      ansiState = [],
      result = [],
      state = {},
      eraseChar;

  //
  // General workflow for this thing is:
  // \033\[33mText
  // |     |  |
  // |     |  matchingText
  // |     matchingData
  // matchingControl
  //
  // In further steps we hope it's all going to be fine. It usually is.
  //

  //
  // Erases a char from the output
  //
  eraseChar = function () {
    var index, text;
    if (matchingText.length) {
      matchingText = matchingText.substr(0, matchingText.length - 1);
    }
    else if (result.length) {
      index = result.length - 1;
      text = result[index].text;
      if (text.length === 1) {
        //
        // A result bit was fully deleted, pop it out to simplify the final output
        //
        result.pop();
      }
      else {
        result[index].text = text.substr(0, text.length - 1);
      }
    }
  };

  for (var i = 0; i < str.length; i++) {
    if (matchingControl != null) {
      if (matchingControl == '\033' && str[i] == '\[') {
        //
        // We've matched full control code. Lets start matching formating data.
        //

        //
        // "emit" matched text with correct state
        //
        if (matchingText) {
          state.text = matchingText;
          result.push(state);
          state = {};
          matchingText = "";
        }

        matchingControl = null;
        matchingData = '';
      }
      else {
        //
        // We failed to match anything - most likely a bad control code. We
        // go back to matching regular strings.
        //
        matchingText += matchingControl + str[i];
        matchingControl = null;
      }
      continue;
    }
    else if (matchingData != null) {
      if (str[i] == ';') {
        //
        // `;` separates many formatting codes, for example: `\033[33;43m`
        // means that both `33` and `43` should be applied.
        //
        // TODO: this can be simplified by modifying state here.
        //
        ansiState.push(matchingData);
        matchingData = '';
      }
      else if (str[i] == 'm') {
        //
        // `m` finished whole formatting code. We can proceed to matching
        // formatted text.
        //
        ansiState.push(matchingData);
        matchingData = null;
        matchingText = '';

        //
        // Convert matched formatting data into user-friendly state object.
        //
        // TODO: DRY.
        //
        ansiState.forEach(function (ansiCode) {
          if (ansiparse.foregroundColors[ansiCode]) {
            state.foreground = ansiparse.foregroundColors[ansiCode];
          }
          else if (ansiparse.backgroundColors[ansiCode]) {
            state.background = ansiparse.backgroundColors[ansiCode];
          }
          else if (ansiCode == 39) {
            delete state.foreground;
          }
          else if (ansiCode == 49) {
            delete state.background;
          }
          else if (ansiparse.styles[ansiCode]) {
            state[ansiparse.styles[ansiCode]] = true;
          }
          else if (ansiCode == 22) {
            state.bold = false;
          }
          else if (ansiCode == 23) {
            state.italic = false;
          }
          else if (ansiCode == 24) {
            state.underline = false;
          }
        });
        ansiState = [];
      }
      else {
        matchingData += str[i];
      }
      continue;
    }

    if (str[i] == '\033') {
      matchingControl = str[i];
    }
    else if (str[i] == '\u0008') {
      eraseChar();
    }
    else {
      matchingText += str[i];
    }
  }

  if (matchingText) {
    state.text = matchingText + (matchingControl ? matchingControl : '');
    result.push(state);
  }
  return result;
}

ansiparse.foregroundColors = {
  '30': 'black',
  '31': 'red',
  '32': 'green',
  '33': 'yellow',
  '34': 'blue',
  '35': 'magenta',
  '36': 'cyan',
  '37': 'white',
  '90': 'grey'
};

ansiparse.backgroundColors = {
  '40': 'black',
  '41': 'red',
  '42': 'green',
  '43': 'yellow',
  '44': 'blue',
  '45': 'magenta',
  '46': 'cyan',
  '47': 'white'
};

ansiparse.styles = {
  '1': 'bold',
  '3': 'italic',
  '4': 'underline'
};

module.exports = ansiparse;


},{}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/lodash.intersection/index.js":[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]';

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/**
 * A faster alternative to `Function#apply`, this function invokes `func`
 * with the `this` binding of `thisArg` and the arguments of `args`.
 *
 * @private
 * @param {Function} func The function to invoke.
 * @param {*} thisArg The `this` binding of `func`.
 * @param {Array} args The arguments to invoke `func` with.
 * @returns {*} Returns the result of `func`.
 */
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0: return func.call(thisArg);
    case 1: return func.call(thisArg, args[0]);
    case 2: return func.call(thisArg, args[0], args[1]);
    case 3: return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}

/**
 * A specialized version of `_.includes` for arrays without support for
 * specifying an index to search from.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludes(array, value) {
  var length = array ? array.length : 0;
  return !!length && baseIndexOf(array, value, 0) > -1;
}

/**
 * This function is like `arrayIncludes` except that it accepts a comparator.
 *
 * @private
 * @param {Array} [array] The array to inspect.
 * @param {*} target The value to search for.
 * @param {Function} comparator The comparator invoked per element.
 * @returns {boolean} Returns `true` if `target` is found, else `false`.
 */
function arrayIncludesWith(array, value, comparator) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (comparator(value, array[index])) {
      return true;
    }
  }
  return false;
}

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array ? array.length : 0,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Checks if a cache value for `key` exists.
 *
 * @private
 * @param {Object} cache The cache to query.
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function cacheHas(cache, key) {
  return cache.has(key);
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/* Built-in method references that are verified to be native. */
var Map = getNative(root, 'Map'),
    nativeCreate = getNative(Object, 'create');

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of methods like `_.intersection`, without support
 * for iteratee shorthands, that accepts an array of arrays to inspect.
 *
 * @private
 * @param {Array} arrays The arrays to inspect.
 * @param {Function} [iteratee] The iteratee invoked per element.
 * @param {Function} [comparator] The comparator invoked per element.
 * @returns {Array} Returns the new array of shared values.
 */
function baseIntersection(arrays, iteratee, comparator) {
  var includes = comparator ? arrayIncludesWith : arrayIncludes,
      length = arrays[0].length,
      othLength = arrays.length,
      othIndex = othLength,
      caches = Array(othLength),
      maxLength = Infinity,
      result = [];

  while (othIndex--) {
    var array = arrays[othIndex];
    if (othIndex && iteratee) {
      array = arrayMap(array, baseUnary(iteratee));
    }
    maxLength = nativeMin(array.length, maxLength);
    caches[othIndex] = !comparator && (iteratee || (length >= 120 && array.length >= 120))
      ? new SetCache(othIndex && array)
      : undefined;
  }
  array = arrays[0];

  var index = -1,
      seen = caches[0];

  outer:
  while (++index < length && result.length < maxLength) {
    var value = array[index],
        computed = iteratee ? iteratee(value) : value;

    value = (comparator || value !== 0) ? value : 0;
    if (!(seen
          ? cacheHas(seen, computed)
          : includes(result, computed, comparator)
        )) {
      othIndex = othLength;
      while (--othIndex) {
        var cache = caches[othIndex];
        if (!(cache
              ? cacheHas(cache, computed)
              : includes(arrays[othIndex], computed, comparator))
            ) {
          continue outer;
        }
      }
      if (seen) {
        seen.push(computed);
      }
      result.push(value);
    }
  }
  return result;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.rest` which doesn't validate or coerce arguments.
 *
 * @private
 * @param {Function} func The function to apply a rest parameter to.
 * @param {number} [start=func.length-1] The start position of the rest parameter.
 * @returns {Function} Returns the new function.
 */
function baseRest(func, start) {
  start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
  return function() {
    var args = arguments,
        index = -1,
        length = nativeMax(args.length - start, 0),
        array = Array(length);

    while (++index < length) {
      array[index] = args[start + index];
    }
    index = -1;
    var otherArgs = Array(start + 1);
    while (++index < start) {
      otherArgs[index] = args[index];
    }
    otherArgs[start] = array;
    return apply(func, this, otherArgs);
  };
}

/**
 * Casts `value` to an empty array if it's not an array like object.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array|Object} Returns the cast array-like object.
 */
function castArrayLikeObject(value) {
  return isArrayLikeObject(value) ? value : [];
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates an array of unique values that are included in all given arrays
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. The order of result values is determined by the
 * order they occur in the first array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {...Array} [arrays] The arrays to inspect.
 * @returns {Array} Returns the new array of intersecting values.
 * @example
 *
 * _.intersection([2, 1], [2, 3]);
 * // => [2]
 */
var intersection = baseRest(function(arrays) {
  var mapped = arrayMap(arrays, castArrayLikeObject);
  return (mapped.length && mapped[0] === arrays[0])
    ? baseIntersection(mapped)
    : [];
});

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

module.exports = intersection;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/lodash.pickby/index.js":[function(require,module,exports){
(function (global){
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the size to enable large array optimizations. */
var LARGE_ARRAY_SIZE = 200;

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used to stand-in for `undefined` hash values. */
var HASH_UNDEFINED = '__lodash_hash_undefined__';

/** Used to compose bitmasks for comparison styles. */
var UNORDERED_COMPARE_FLAG = 1,
    PARTIAL_COMPARE_FLAG = 2;

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_SAFE_INTEGER = 9007199254740991;

/** `Object#toString` result references. */
var argsTag = '[object Arguments]',
    arrayTag = '[object Array]',
    boolTag = '[object Boolean]',
    dateTag = '[object Date]',
    errorTag = '[object Error]',
    funcTag = '[object Function]',
    genTag = '[object GeneratorFunction]',
    mapTag = '[object Map]',
    numberTag = '[object Number]',
    objectTag = '[object Object]',
    promiseTag = '[object Promise]',
    regexpTag = '[object RegExp]',
    setTag = '[object Set]',
    stringTag = '[object String]',
    symbolTag = '[object Symbol]',
    weakMapTag = '[object WeakMap]';

var arrayBufferTag = '[object ArrayBuffer]',
    dataViewTag = '[object DataView]',
    float32Tag = '[object Float32Array]',
    float64Tag = '[object Float64Array]',
    int8Tag = '[object Int8Array]',
    int16Tag = '[object Int16Array]',
    int32Tag = '[object Int32Array]',
    uint8Tag = '[object Uint8Array]',
    uint8ClampedTag = '[object Uint8ClampedArray]',
    uint16Tag = '[object Uint16Array]',
    uint32Tag = '[object Uint32Array]';

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/,
    reLeadingDot = /^\./,
    rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/**
 * Used to match `RegExp`
 * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
 */
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/** Used to detect host constructors (Safari). */
var reIsHostCtor = /^\[object .+?Constructor\]$/;

/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;

/** Used to identify `toStringTag` values of typed arrays. */
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
typedArrayTags[errorTag] = typedArrayTags[funcTag] =
typedArrayTags[mapTag] = typedArrayTags[numberTag] =
typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
typedArrayTags[setTag] = typedArrayTags[stringTag] =
typedArrayTags[weakMapTag] = false;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Detect free variable `exports`. */
var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

/** Detect free variable `module`. */
var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = freeModule && freeModule.exports === freeExports;

/** Detect free variable `process` from Node.js. */
var freeProcess = moduleExports && freeGlobal.process;

/** Used to access faster Node.js helpers. */
var nodeUtil = (function() {
  try {
    return freeProcess && freeProcess.binding('util');
  } catch (e) {}
}());

/* Node.js helper references. */
var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

/**
 * Appends the elements of `values` to `array`.
 *
 * @private
 * @param {Array} array The array to modify.
 * @param {Array} values The values to append.
 * @returns {Array} Returns `array`.
 */
function arrayPush(array, values) {
  var index = -1,
      length = values.length,
      offset = array.length;

  while (++index < length) {
    array[offset + index] = values[index];
  }
  return array;
}

/**
 * A specialized version of `_.some` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {boolean} Returns `true` if any element passes the predicate check,
 *  else `false`.
 */
function arraySome(array, predicate) {
  var index = -1,
      length = array ? array.length : 0;

  while (++index < length) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}

/**
 * The base implementation of `_.property` without support for deep paths.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function baseProperty(key) {
  return function(object) {
    return object == null ? undefined : object[key];
  };
}

/**
 * The base implementation of `_.times` without support for iteratee shorthands
 * or max array length checks.
 *
 * @private
 * @param {number} n The number of times to invoke `iteratee`.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the array of results.
 */
function baseTimes(n, iteratee) {
  var index = -1,
      result = Array(n);

  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}

/**
 * The base implementation of `_.unary` without support for storing metadata.
 *
 * @private
 * @param {Function} func The function to cap arguments for.
 * @returns {Function} Returns the new capped function.
 */
function baseUnary(func) {
  return function(value) {
    return func(value);
  };
}

/**
 * Gets the value at `key` of `object`.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {string} key The key of the property to get.
 * @returns {*} Returns the property value.
 */
function getValue(object, key) {
  return object == null ? undefined : object[key];
}

/**
 * Checks if `value` is a host object in IE < 9.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
 */
function isHostObject(value) {
  // Many host objects are `Object` objects that can coerce to strings
  // despite having improperly defined `toString` methods.
  var result = false;
  if (value != null && typeof value.toString != 'function') {
    try {
      result = !!(value + '');
    } catch (e) {}
  }
  return result;
}

/**
 * Converts `map` to its key-value pairs.
 *
 * @private
 * @param {Object} map The map to convert.
 * @returns {Array} Returns the key-value pairs.
 */
function mapToArray(map) {
  var index = -1,
      result = Array(map.size);

  map.forEach(function(value, key) {
    result[++index] = [key, value];
  });
  return result;
}

/**
 * Creates a unary function that invokes `func` with its argument transformed.
 *
 * @private
 * @param {Function} func The function to wrap.
 * @param {Function} transform The argument transform.
 * @returns {Function} Returns the new function.
 */
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}

/**
 * Converts `set` to an array of its values.
 *
 * @private
 * @param {Object} set The set to convert.
 * @returns {Array} Returns the values.
 */
function setToArray(set) {
  var index = -1,
      result = Array(set.size);

  set.forEach(function(value) {
    result[++index] = value;
  });
  return result;
}

/** Used for built-in method references. */
var arrayProto = Array.prototype,
    funcProto = Function.prototype,
    objectProto = Object.prototype;

/** Used to detect overreaching core-js shims. */
var coreJsData = root['__core-js_shared__'];

/** Used to detect methods masquerading as native. */
var maskSrcKey = (function() {
  var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
  return uid ? ('Symbol(src)_1.' + uid) : '';
}());

/** Used to resolve the decompiled source of functions. */
var funcToString = funcProto.toString;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/** Used to detect if a method is native. */
var reIsNative = RegExp('^' +
  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
);

/** Built-in value references. */
var Symbol = root.Symbol,
    Uint8Array = root.Uint8Array,
    getPrototype = overArg(Object.getPrototypeOf, Object),
    propertyIsEnumerable = objectProto.propertyIsEnumerable,
    splice = arrayProto.splice;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeGetSymbols = Object.getOwnPropertySymbols,
    nativeKeys = overArg(Object.keys, Object);

/* Built-in method references that are verified to be native. */
var DataView = getNative(root, 'DataView'),
    Map = getNative(root, 'Map'),
    Promise = getNative(root, 'Promise'),
    Set = getNative(root, 'Set'),
    WeakMap = getNative(root, 'WeakMap'),
    nativeCreate = getNative(Object, 'create');

/** Used to detect maps, sets, and weakmaps. */
var dataViewCtorString = toSource(DataView),
    mapCtorString = toSource(Map),
    promiseCtorString = toSource(Promise),
    setCtorString = toSource(Set),
    weakMapCtorString = toSource(WeakMap);

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolValueOf = symbolProto ? symbolProto.valueOf : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * Creates a hash object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Hash(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the hash.
 *
 * @private
 * @name clear
 * @memberOf Hash
 */
function hashClear() {
  this.__data__ = nativeCreate ? nativeCreate(null) : {};
}

/**
 * Removes `key` and its value from the hash.
 *
 * @private
 * @name delete
 * @memberOf Hash
 * @param {Object} hash The hash to modify.
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function hashDelete(key) {
  return this.has(key) && delete this.__data__[key];
}

/**
 * Gets the hash value for `key`.
 *
 * @private
 * @name get
 * @memberOf Hash
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate) {
    var result = data[key];
    return result === HASH_UNDEFINED ? undefined : result;
  }
  return hasOwnProperty.call(data, key) ? data[key] : undefined;
}

/**
 * Checks if a hash value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Hash
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
}

/**
 * Sets the hash `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Hash
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the hash instance.
 */
function hashSet(key, value) {
  var data = this.__data__;
  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
  return this;
}

// Add methods to `Hash`.
Hash.prototype.clear = hashClear;
Hash.prototype['delete'] = hashDelete;
Hash.prototype.get = hashGet;
Hash.prototype.has = hashHas;
Hash.prototype.set = hashSet;

/**
 * Creates an list cache object.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function ListCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the list cache.
 *
 * @private
 * @name clear
 * @memberOf ListCache
 */
function listCacheClear() {
  this.__data__ = [];
}

/**
 * Removes `key` and its value from the list cache.
 *
 * @private
 * @name delete
 * @memberOf ListCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function listCacheDelete(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  return true;
}

/**
 * Gets the list cache value for `key`.
 *
 * @private
 * @name get
 * @memberOf ListCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function listCacheGet(key) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  return index < 0 ? undefined : data[index][1];
}

/**
 * Checks if a list cache value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf ListCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function listCacheHas(key) {
  return assocIndexOf(this.__data__, key) > -1;
}

/**
 * Sets the list cache `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf ListCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the list cache instance.
 */
function listCacheSet(key, value) {
  var data = this.__data__,
      index = assocIndexOf(data, key);

  if (index < 0) {
    data.push([key, value]);
  } else {
    data[index][1] = value;
  }
  return this;
}

// Add methods to `ListCache`.
ListCache.prototype.clear = listCacheClear;
ListCache.prototype['delete'] = listCacheDelete;
ListCache.prototype.get = listCacheGet;
ListCache.prototype.has = listCacheHas;
ListCache.prototype.set = listCacheSet;

/**
 * Creates a map cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function MapCache(entries) {
  var index = -1,
      length = entries ? entries.length : 0;

  this.clear();
  while (++index < length) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}

/**
 * Removes all key-value entries from the map.
 *
 * @private
 * @name clear
 * @memberOf MapCache
 */
function mapCacheClear() {
  this.__data__ = {
    'hash': new Hash,
    'map': new (Map || ListCache),
    'string': new Hash
  };
}

/**
 * Removes `key` and its value from the map.
 *
 * @private
 * @name delete
 * @memberOf MapCache
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function mapCacheDelete(key) {
  return getMapData(this, key)['delete'](key);
}

/**
 * Gets the map value for `key`.
 *
 * @private
 * @name get
 * @memberOf MapCache
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function mapCacheGet(key) {
  return getMapData(this, key).get(key);
}

/**
 * Checks if a map value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf MapCache
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function mapCacheHas(key) {
  return getMapData(this, key).has(key);
}

/**
 * Sets the map `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf MapCache
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the map cache instance.
 */
function mapCacheSet(key, value) {
  getMapData(this, key).set(key, value);
  return this;
}

// Add methods to `MapCache`.
MapCache.prototype.clear = mapCacheClear;
MapCache.prototype['delete'] = mapCacheDelete;
MapCache.prototype.get = mapCacheGet;
MapCache.prototype.has = mapCacheHas;
MapCache.prototype.set = mapCacheSet;

/**
 *
 * Creates an array cache object to store unique values.
 *
 * @private
 * @constructor
 * @param {Array} [values] The values to cache.
 */
function SetCache(values) {
  var index = -1,
      length = values ? values.length : 0;

  this.__data__ = new MapCache;
  while (++index < length) {
    this.add(values[index]);
  }
}

/**
 * Adds `value` to the array cache.
 *
 * @private
 * @name add
 * @memberOf SetCache
 * @alias push
 * @param {*} value The value to cache.
 * @returns {Object} Returns the cache instance.
 */
function setCacheAdd(value) {
  this.__data__.set(value, HASH_UNDEFINED);
  return this;
}

/**
 * Checks if `value` is in the array cache.
 *
 * @private
 * @name has
 * @memberOf SetCache
 * @param {*} value The value to search for.
 * @returns {number} Returns `true` if `value` is found, else `false`.
 */
function setCacheHas(value) {
  return this.__data__.has(value);
}

// Add methods to `SetCache`.
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
SetCache.prototype.has = setCacheHas;

/**
 * Creates a stack cache object to store key-value pairs.
 *
 * @private
 * @constructor
 * @param {Array} [entries] The key-value pairs to cache.
 */
function Stack(entries) {
  this.__data__ = new ListCache(entries);
}

/**
 * Removes all key-value entries from the stack.
 *
 * @private
 * @name clear
 * @memberOf Stack
 */
function stackClear() {
  this.__data__ = new ListCache;
}

/**
 * Removes `key` and its value from the stack.
 *
 * @private
 * @name delete
 * @memberOf Stack
 * @param {string} key The key of the value to remove.
 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
 */
function stackDelete(key) {
  return this.__data__['delete'](key);
}

/**
 * Gets the stack value for `key`.
 *
 * @private
 * @name get
 * @memberOf Stack
 * @param {string} key The key of the value to get.
 * @returns {*} Returns the entry value.
 */
function stackGet(key) {
  return this.__data__.get(key);
}

/**
 * Checks if a stack value for `key` exists.
 *
 * @private
 * @name has
 * @memberOf Stack
 * @param {string} key The key of the entry to check.
 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
 */
function stackHas(key) {
  return this.__data__.has(key);
}

/**
 * Sets the stack `key` to `value`.
 *
 * @private
 * @name set
 * @memberOf Stack
 * @param {string} key The key of the value to set.
 * @param {*} value The value to set.
 * @returns {Object} Returns the stack cache instance.
 */
function stackSet(key, value) {
  var cache = this.__data__;
  if (cache instanceof ListCache) {
    var pairs = cache.__data__;
    if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
      pairs.push([key, value]);
      return this;
    }
    cache = this.__data__ = new MapCache(pairs);
  }
  cache.set(key, value);
  return this;
}

// Add methods to `Stack`.
Stack.prototype.clear = stackClear;
Stack.prototype['delete'] = stackDelete;
Stack.prototype.get = stackGet;
Stack.prototype.has = stackHas;
Stack.prototype.set = stackSet;

/**
 * Creates an array of the enumerable property names of the array-like `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @param {boolean} inherited Specify returning inherited property names.
 * @returns {Array} Returns the array of property names.
 */
function arrayLikeKeys(value, inherited) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  // Safari 9 makes `arguments.length` enumerable in strict mode.
  var result = (isArray(value) || isArguments(value))
    ? baseTimes(value.length, String)
    : [];

  var length = result.length,
      skipIndexes = !!length;

  for (var key in value) {
    if ((inherited || hasOwnProperty.call(value, key)) &&
        !(skipIndexes && (key == 'length' || isIndex(key, length)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Gets the index at which the `key` is found in `array` of key-value pairs.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} key The key to search for.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function assocIndexOf(array, key) {
  var length = array.length;
  while (length--) {
    if (eq(array[length][0], key)) {
      return length;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = isKey(path, object) ? [path] : castPath(path);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

/**
 * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
 * `keysFunc` and `symbolsFunc` to get the enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @param {Function} symbolsFunc The function to get the symbols of `object`.
 * @returns {Array} Returns the array of property names and symbols.
 */
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
}

/**
 * The base implementation of `getTag`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  return objectToString.call(value);
}

/**
 * The base implementation of `_.hasIn` without support for deep paths.
 *
 * @private
 * @param {Object} [object] The object to query.
 * @param {Array|string} key The key to check.
 * @returns {boolean} Returns `true` if `key` exists, else `false`.
 */
function baseHasIn(object, key) {
  return object != null && key in Object(object);
}

/**
 * The base implementation of `_.isEqual` which supports partial comparisons
 * and tracks traversed objects.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {boolean} [bitmask] The bitmask of comparison flags.
 *  The bitmask may be composed of the following flags:
 *     1 - Unordered comparison
 *     2 - Partial comparison
 * @param {Object} [stack] Tracks traversed `value` and `other` objects.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 */
function baseIsEqual(value, other, customizer, bitmask, stack) {
  if (value === other) {
    return true;
  }
  if (value == null || other == null || (!isObject(value) && !isObjectLike(other))) {
    return value !== value && other !== other;
  }
  return baseIsEqualDeep(value, other, baseIsEqual, customizer, bitmask, stack);
}

/**
 * A specialized version of `baseIsEqual` for arrays and objects which performs
 * deep comparisons and tracks traversed objects enabling objects with circular
 * references to be compared.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} [customizer] The function to customize comparisons.
 * @param {number} [bitmask] The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} [stack] Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function baseIsEqualDeep(object, other, equalFunc, customizer, bitmask, stack) {
  var objIsArr = isArray(object),
      othIsArr = isArray(other),
      objTag = arrayTag,
      othTag = arrayTag;

  if (!objIsArr) {
    objTag = getTag(object);
    objTag = objTag == argsTag ? objectTag : objTag;
  }
  if (!othIsArr) {
    othTag = getTag(other);
    othTag = othTag == argsTag ? objectTag : othTag;
  }
  var objIsObj = objTag == objectTag && !isHostObject(object),
      othIsObj = othTag == objectTag && !isHostObject(other),
      isSameTag = objTag == othTag;

  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack);
    return (objIsArr || isTypedArray(object))
      ? equalArrays(object, other, equalFunc, customizer, bitmask, stack)
      : equalByTag(object, other, objTag, equalFunc, customizer, bitmask, stack);
  }
  if (!(bitmask & PARTIAL_COMPARE_FLAG)) {
    var objIsWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
        othIsWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object,
          othUnwrapped = othIsWrapped ? other.value() : other;

      stack || (stack = new Stack);
      return equalFunc(objUnwrapped, othUnwrapped, customizer, bitmask, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack);
  return equalObjects(object, other, equalFunc, customizer, bitmask, stack);
}

/**
 * The base implementation of `_.isMatch` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to inspect.
 * @param {Object} source The object of property values to match.
 * @param {Array} matchData The property names, values, and compare flags to match.
 * @param {Function} [customizer] The function to customize comparisons.
 * @returns {boolean} Returns `true` if `object` is a match, else `false`.
 */
function baseIsMatch(object, source, matchData, customizer) {
  var index = matchData.length,
      length = index,
      noCustomizer = !customizer;

  if (object == null) {
    return !length;
  }
  object = Object(object);
  while (index--) {
    var data = matchData[index];
    if ((noCustomizer && data[2])
          ? data[1] !== object[data[0]]
          : !(data[0] in object)
        ) {
      return false;
    }
  }
  while (++index < length) {
    data = matchData[index];
    var key = data[0],
        objValue = object[key],
        srcValue = data[1];

    if (noCustomizer && data[2]) {
      if (objValue === undefined && !(key in object)) {
        return false;
      }
    } else {
      var stack = new Stack;
      if (customizer) {
        var result = customizer(objValue, srcValue, key, object, source, stack);
      }
      if (!(result === undefined
            ? baseIsEqual(srcValue, objValue, customizer, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG, stack)
            : result
          )) {
        return false;
      }
    }
  }
  return true;
}

/**
 * The base implementation of `_.isNative` without bad shim checks.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a native function,
 *  else `false`.
 */
function baseIsNative(value) {
  if (!isObject(value) || isMasked(value)) {
    return false;
  }
  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource(value));
}

/**
 * The base implementation of `_.isTypedArray` without Node.js optimizations.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 */
function baseIsTypedArray(value) {
  return isObjectLike(value) &&
    isLength(value.length) && !!typedArrayTags[objectToString.call(value)];
}

/**
 * The base implementation of `_.iteratee`.
 *
 * @private
 * @param {*} [value=_.identity] The value to convert to an iteratee.
 * @returns {Function} Returns the iteratee.
 */
function baseIteratee(value) {
  // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
  // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
  if (typeof value == 'function') {
    return value;
  }
  if (value == null) {
    return identity;
  }
  if (typeof value == 'object') {
    return isArray(value)
      ? baseMatchesProperty(value[0], value[1])
      : baseMatches(value);
  }
  return property(value);
}

/**
 * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeys(object) {
  if (!isPrototype(object)) {
    return nativeKeys(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty.call(object, key) && key != 'constructor') {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.keysIn` which doesn't treat sparse arrays as dense.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function baseKeysIn(object) {
  if (!isObject(object)) {
    return nativeKeysIn(object);
  }
  var isProto = isPrototype(object),
      result = [];

  for (var key in object) {
    if (!(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}

/**
 * The base implementation of `_.matches` which doesn't clone `source`.
 *
 * @private
 * @param {Object} source The object of property values to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatches(source) {
  var matchData = getMatchData(source);
  if (matchData.length == 1 && matchData[0][2]) {
    return matchesStrictComparable(matchData[0][0], matchData[0][1]);
  }
  return function(object) {
    return object === source || baseIsMatch(object, source, matchData);
  };
}

/**
 * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
 *
 * @private
 * @param {string} path The path of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function baseMatchesProperty(path, srcValue) {
  if (isKey(path) && isStrictComparable(srcValue)) {
    return matchesStrictComparable(toKey(path), srcValue);
  }
  return function(object) {
    var objValue = get(object, path);
    return (objValue === undefined && objValue === srcValue)
      ? hasIn(object, path)
      : baseIsEqual(srcValue, objValue, undefined, UNORDERED_COMPARE_FLAG | PARTIAL_COMPARE_FLAG);
  };
}

/**
 * The base implementation of  `_.pickBy` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The source object.
 * @param {string[]} props The property identifiers to pick from.
 * @param {Function} predicate The function invoked per property.
 * @returns {Object} Returns the new object.
 */
function basePickBy(object, props, predicate) {
  var index = -1,
      length = props.length,
      result = {};

  while (++index < length) {
    var key = props[index],
        value = object[key];

    if (predicate(value, key)) {
      result[key] = value;
    }
  }
  return result;
}

/**
 * A specialized version of `baseProperty` which supports deep paths.
 *
 * @private
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 */
function basePropertyDeep(path) {
  return function(object) {
    return baseGet(object, path);
  };
}

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value) {
  return isArray(value) ? value : stringToPath(value);
}

/**
 * A specialized version of `baseIsEqualDeep` for arrays with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Array} array The array to compare.
 * @param {Array} other The other array to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `array` and `other` objects.
 * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
 */
function equalArrays(array, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      arrLength = array.length,
      othLength = other.length;

  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(array);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var index = -1,
      result = true,
      seen = (bitmask & UNORDERED_COMPARE_FLAG) ? new SetCache : undefined;

  stack.set(array, other);
  stack.set(other, array);

  // Ignore non-index properties.
  while (++index < arrLength) {
    var arrValue = array[index],
        othValue = other[index];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, arrValue, index, other, array, stack)
        : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== undefined) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    // Recursively compare arrays (susceptible to call stack limits).
    if (seen) {
      if (!arraySome(other, function(othValue, othIndex) {
            if (!seen.has(othIndex) &&
                (arrValue === othValue || equalFunc(arrValue, othValue, customizer, bitmask, stack))) {
              return seen.add(othIndex);
            }
          })) {
        result = false;
        break;
      }
    } else if (!(
          arrValue === othValue ||
            equalFunc(arrValue, othValue, customizer, bitmask, stack)
        )) {
      result = false;
      break;
    }
  }
  stack['delete'](array);
  stack['delete'](other);
  return result;
}

/**
 * A specialized version of `baseIsEqualDeep` for comparing objects of
 * the same `toStringTag`.
 *
 * **Note:** This function only supports comparing values with tags of
 * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {string} tag The `toStringTag` of the objects to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalByTag(object, other, tag, equalFunc, customizer, bitmask, stack) {
  switch (tag) {
    case dataViewTag:
      if ((object.byteLength != other.byteLength) ||
          (object.byteOffset != other.byteOffset)) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;

    case arrayBufferTag:
      if ((object.byteLength != other.byteLength) ||
          !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
        return false;
      }
      return true;

    case boolTag:
    case dateTag:
    case numberTag:
      // Coerce booleans to `1` or `0` and dates to milliseconds.
      // Invalid dates are coerced to `NaN`.
      return eq(+object, +other);

    case errorTag:
      return object.name == other.name && object.message == other.message;

    case regexpTag:
    case stringTag:
      // Coerce regexes to strings and treat strings, primitives and objects,
      // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
      // for more details.
      return object == (other + '');

    case mapTag:
      var convert = mapToArray;

    case setTag:
      var isPartial = bitmask & PARTIAL_COMPARE_FLAG;
      convert || (convert = setToArray);

      if (object.size != other.size && !isPartial) {
        return false;
      }
      // Assume cyclic values are equal.
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= UNORDERED_COMPARE_FLAG;

      // Recursively compare objects (susceptible to call stack limits).
      stack.set(object, other);
      var result = equalArrays(convert(object), convert(other), equalFunc, customizer, bitmask, stack);
      stack['delete'](object);
      return result;

    case symbolTag:
      if (symbolValueOf) {
        return symbolValueOf.call(object) == symbolValueOf.call(other);
      }
  }
  return false;
}

/**
 * A specialized version of `baseIsEqualDeep` for objects with support for
 * partial deep comparisons.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {Function} equalFunc The function to determine equivalents of values.
 * @param {Function} customizer The function to customize comparisons.
 * @param {number} bitmask The bitmask of comparison flags. See `baseIsEqual`
 *  for more details.
 * @param {Object} stack Tracks traversed `object` and `other` objects.
 * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
 */
function equalObjects(object, other, equalFunc, customizer, bitmask, stack) {
  var isPartial = bitmask & PARTIAL_COMPARE_FLAG,
      objProps = keys(object),
      objLength = objProps.length,
      othProps = keys(other),
      othLength = othProps.length;

  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
      return false;
    }
  }
  // Assume cyclic values are equal.
  var stacked = stack.get(object);
  if (stacked && stack.get(other)) {
    return stacked == other;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);

  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key],
        othValue = other[key];

    if (customizer) {
      var compared = isPartial
        ? customizer(othValue, objValue, key, other, object, stack)
        : customizer(objValue, othValue, key, object, other, stack);
    }
    // Recursively compare objects (susceptible to call stack limits).
    if (!(compared === undefined
          ? (objValue === othValue || equalFunc(objValue, othValue, customizer, bitmask, stack))
          : compared
        )) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == 'constructor');
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor,
        othCtor = other.constructor;

    // Non `Object` object instances with different constructors are not equal.
    if (objCtor != othCtor &&
        ('constructor' in object && 'constructor' in other) &&
        !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
          typeof othCtor == 'function' && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack['delete'](object);
  stack['delete'](other);
  return result;
}

/**
 * Creates an array of own and inherited enumerable property names and
 * symbols of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names and symbols.
 */
function getAllKeysIn(object) {
  return baseGetAllKeys(object, keysIn, getSymbolsIn);
}

/**
 * Gets the data for `map`.
 *
 * @private
 * @param {Object} map The map to query.
 * @param {string} key The reference key.
 * @returns {*} Returns the map data.
 */
function getMapData(map, key) {
  var data = map.__data__;
  return isKeyable(key)
    ? data[typeof key == 'string' ? 'string' : 'hash']
    : data.map;
}

/**
 * Gets the property names, values, and compare flags of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the match data of `object`.
 */
function getMatchData(object) {
  var result = keys(object),
      length = result.length;

  while (length--) {
    var key = result[length],
        value = object[key];

    result[length] = [key, value, isStrictComparable(value)];
  }
  return result;
}

/**
 * Gets the native function at `key` of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {string} key The key of the method to get.
 * @returns {*} Returns the function if it's native, else `undefined`.
 */
function getNative(object, key) {
  var value = getValue(object, key);
  return baseIsNative(value) ? value : undefined;
}

/**
 * Creates an array of the own enumerable symbol properties of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbols = nativeGetSymbols ? overArg(nativeGetSymbols, Object) : stubArray;

/**
 * Creates an array of the own and inherited enumerable symbol properties
 * of `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of symbols.
 */
var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
  var result = [];
  while (object) {
    arrayPush(result, getSymbols(object));
    object = getPrototype(object);
  }
  return result;
};

/**
 * Gets the `toStringTag` of `value`.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
var getTag = baseGetTag;

// Fallback for data views, maps, sets, and weak maps in IE 11,
// for data views in Edge < 14, and promises in Node.js.
if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag) ||
    (Map && getTag(new Map) != mapTag) ||
    (Promise && getTag(Promise.resolve()) != promiseTag) ||
    (Set && getTag(new Set) != setTag) ||
    (WeakMap && getTag(new WeakMap) != weakMapTag)) {
  getTag = function(value) {
    var result = objectToString.call(value),
        Ctor = result == objectTag ? value.constructor : undefined,
        ctorString = Ctor ? toSource(Ctor) : undefined;

    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString: return dataViewTag;
        case mapCtorString: return mapTag;
        case promiseCtorString: return promiseTag;
        case setCtorString: return setTag;
        case weakMapCtorString: return weakMapTag;
      }
    }
    return result;
  };
}

/**
 * Checks if `path` exists on `object`.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @param {Function} hasFunc The function to check properties.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 */
function hasPath(object, path, hasFunc) {
  path = isKey(path, object) ? [path] : castPath(path);

  var result,
      index = -1,
      length = path.length;

  while (++index < length) {
    var key = toKey(path[index]);
    if (!(result = object != null && hasFunc(object, key))) {
      break;
    }
    object = object[key];
  }
  if (result) {
    return result;
  }
  var length = object ? object.length : 0;
  return !!length && isLength(length) && isIndex(key, length) &&
    (isArray(object) || isArguments(object));
}

/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
  length = length == null ? MAX_SAFE_INTEGER : length;
  return !!length &&
    (typeof value == 'number' || reIsUint.test(value)) &&
    (value > -1 && value % 1 == 0 && value < length);
}

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

/**
 * Checks if `value` is suitable for use as unique object key.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
 */
function isKeyable(value) {
  var type = typeof value;
  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
    ? (value !== '__proto__')
    : (value === null);
}

/**
 * Checks if `func` has its source masked.
 *
 * @private
 * @param {Function} func The function to check.
 * @returns {boolean} Returns `true` if `func` is masked, else `false`.
 */
function isMasked(func) {
  return !!maskSrcKey && (maskSrcKey in func);
}

/**
 * Checks if `value` is likely a prototype object.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
 */
function isPrototype(value) {
  var Ctor = value && value.constructor,
      proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto;

  return value === proto;
}

/**
 * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` if suitable for strict
 *  equality comparisons, else `false`.
 */
function isStrictComparable(value) {
  return value === value && !isObject(value);
}

/**
 * A specialized version of `matchesProperty` for source values suitable
 * for strict equality comparisons, i.e. `===`.
 *
 * @private
 * @param {string} key The key of the property to get.
 * @param {*} srcValue The value to match.
 * @returns {Function} Returns the new spec function.
 */
function matchesStrictComparable(key, srcValue) {
  return function(object) {
    if (object == null) {
      return false;
    }
    return object[key] === srcValue &&
      (srcValue !== undefined || (key in Object(object)));
  };
}

/**
 * This function is like
 * [`Object.keys`](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * except that it includes inherited enumerable properties.
 *
 * @private
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 */
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoize(function(string) {
  string = toString(string);

  var result = [];
  if (reLeadingDot.test(string)) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, string) {
    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

/**
 * Converts `value` to a string key if it's not a string or symbol.
 *
 * @private
 * @param {*} value The value to inspect.
 * @returns {string|symbol} Returns the key.
 */
function toKey(value) {
  if (typeof value == 'string' || isSymbol(value)) {
    return value;
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

/**
 * Converts `func` to its source code.
 *
 * @private
 * @param {Function} func The function to process.
 * @returns {string} Returns the source code.
 */
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {}
    try {
      return (func + '');
    } catch (e) {}
  }
  return '';
}

/**
 * Creates a function that memoizes the result of `func`. If `resolver` is
 * provided, it determines the cache key for storing the result based on the
 * arguments provided to the memoized function. By default, the first argument
 * provided to the memoized function is used as the map cache key. The `func`
 * is invoked with the `this` binding of the memoized function.
 *
 * **Note:** The cache is exposed as the `cache` property on the memoized
 * function. Its creation may be customized by replacing the `_.memoize.Cache`
 * constructor with one whose instances implement the
 * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
 * method interface of `delete`, `get`, `has`, and `set`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to have its output memoized.
 * @param {Function} [resolver] The function to resolve the cache key.
 * @returns {Function} Returns the new memoized function.
 * @example
 *
 * var object = { 'a': 1, 'b': 2 };
 * var other = { 'c': 3, 'd': 4 };
 *
 * var values = _.memoize(_.values);
 * values(object);
 * // => [1, 2]
 *
 * values(other);
 * // => [3, 4]
 *
 * object.a = 2;
 * values(object);
 * // => [1, 2]
 *
 * // Modify the result cache.
 * values.cache.set(object, ['a', 'b']);
 * values(object);
 * // => ['a', 'b']
 *
 * // Replace `_.memoize.Cache`.
 * _.memoize.Cache = WeakMap;
 */
function memoize(func, resolver) {
  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  var memoized = function() {
    var args = arguments,
        key = resolver ? resolver.apply(this, args) : args[0],
        cache = memoized.cache;

    if (cache.has(key)) {
      return cache.get(key);
    }
    var result = func.apply(this, args);
    memoized.cache = cache.set(key, result);
    return result;
  };
  memoized.cache = new (memoize.Cache || MapCache);
  return memoized;
}

// Assign cache to `_.memoize`.
memoize.Cache = MapCache;

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

/**
 * Checks if `value` is likely an `arguments` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an `arguments` object,
 *  else `false`.
 * @example
 *
 * _.isArguments(function() { return arguments; }());
 * // => true
 *
 * _.isArguments([1, 2, 3]);
 * // => false
 */
function isArguments(value) {
  // Safari 8.1 makes `arguments.callee` enumerable in strict mode.
  return isArrayLikeObject(value) && hasOwnProperty.call(value, 'callee') &&
    (!propertyIsEnumerable.call(value, 'callee') || objectToString.call(value) == argsTag);
}

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
  return value != null && isLength(value.length) && !isFunction(value);
}

/**
 * This method is like `_.isArrayLike` except that it also checks if `value`
 * is an object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array-like object,
 *  else `false`.
 * @example
 *
 * _.isArrayLikeObject([1, 2, 3]);
 * // => true
 *
 * _.isArrayLikeObject(document.body.children);
 * // => true
 *
 * _.isArrayLikeObject('abc');
 * // => false
 *
 * _.isArrayLikeObject(_.noop);
 * // => false
 */
function isArrayLikeObject(value) {
  return isObjectLike(value) && isArrayLike(value);
}

/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 8-9 which returns 'object' for typed array and other constructors.
  var tag = isObject(value) ? objectToString.call(value) : '';
  return tag == funcTag || tag == genTag;
}

/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
  return typeof value == 'number' &&
    value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Checks if `value` is classified as a typed array.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
 * @example
 *
 * _.isTypedArray(new Uint8Array);
 * // => true
 *
 * _.isTypedArray([]);
 * // => false
 */
var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

/**
 * Checks if `path` is a direct or inherited property of `object`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path to check.
 * @returns {boolean} Returns `true` if `path` exists, else `false`.
 * @example
 *
 * var object = _.create({ 'a': _.create({ 'b': 2 }) });
 *
 * _.hasIn(object, 'a');
 * // => true
 *
 * _.hasIn(object, 'a.b');
 * // => true
 *
 * _.hasIn(object, ['a', 'b']);
 * // => true
 *
 * _.hasIn(object, 'b');
 * // => false
 */
function hasIn(object, path) {
  return object != null && hasPath(object, path, baseHasIn);
}

/**
 * Creates an array of the own enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects. See the
 * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
 * for more details.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keys(new Foo);
 * // => ['a', 'b'] (iteration order is not guaranteed)
 *
 * _.keys('hi');
 * // => ['0', '1']
 */
function keys(object) {
  return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
}

/**
 * Creates an array of the own and inherited enumerable property names of `object`.
 *
 * **Note:** Non-object values are coerced to objects.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Object
 * @param {Object} object The object to query.
 * @returns {Array} Returns the array of property names.
 * @example
 *
 * function Foo() {
 *   this.a = 1;
 *   this.b = 2;
 * }
 *
 * Foo.prototype.c = 3;
 *
 * _.keysIn(new Foo);
 * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
 */
function keysIn(object) {
  return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
}

/**
 * Creates an object composed of the `object` properties `predicate` returns
 * truthy for. The predicate is invoked with two arguments: (value, key).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Object
 * @param {Object} object The source object.
 * @param {Function} [predicate=_.identity] The function invoked per property.
 * @returns {Object} Returns the new object.
 * @example
 *
 * var object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * _.pickBy(object, _.isNumber);
 * // => { 'a': 1, 'c': 3 }
 */
function pickBy(object, predicate) {
  return object == null ? {} : basePickBy(object, getAllKeysIn(object), baseIteratee(predicate));
}

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

/**
 * Creates a function that returns the value at `path` of a given object.
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Util
 * @param {Array|string} path The path of the property to get.
 * @returns {Function} Returns the new accessor function.
 * @example
 *
 * var objects = [
 *   { 'a': { 'b': 2 } },
 *   { 'a': { 'b': 1 } }
 * ];
 *
 * _.map(objects, _.property('a.b'));
 * // => [2, 1]
 *
 * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
 * // => [1, 2]
 */
function property(path) {
  return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
}

/**
 * This method returns a new empty array.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {Array} Returns the new empty array.
 * @example
 *
 * var arrays = _.times(2, _.stubArray);
 *
 * console.log(arrays);
 * // => [[], []]
 *
 * console.log(arrays[0] === arrays[1]);
 * // => false
 */
function stubArray() {
  return [];
}

module.exports = pickBy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/visibilityjs/index.js":[function(require,module,exports){
module.exports = require('./lib/visibility.timers.js')

},{"./lib/visibility.timers.js":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/visibilityjs/lib/visibility.timers.js"}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/visibilityjs/lib/visibility.core.js":[function(require,module,exports){
;(function (global) {
    "use strict";

    var lastId = -1;

    // Visibility.js allow you to know, that your web page is in the background
    // tab and thus not visible to the user. This library is wrap under
    // Page Visibility API. It fix problems with different vendor prefixes and
    // add high-level useful functions.
    var self = {

        // Call callback only when page become to visible for user or
        // call it now if page is visible now or Page Visibility API
        // doesn’t supported.
        //
        // Return false if API isn’t supported, true if page is already visible
        // or listener ID (you can use it in `unbind` method) if page isn’t
        // visible now.
        //
        //   Visibility.onVisible(function () {
        //       startIntroAnimation();
        //   });
        onVisible: function (callback) {
            var support = self.isSupported();
            if ( !support || !self.hidden() ) {
                callback();
                return support;
            }

            var listener = self.change(function (e, state) {
                if ( !self.hidden() ) {
                    self.unbind(listener);
                    callback();
                }
            });
            return listener;
        },

        // Call callback when visibility will be changed. First argument for
        // callback will be original event object, second will be visibility
        // state name.
        //
        // Return listener ID to unbind listener by `unbind` method.
        //
        // If Page Visibility API doesn’t supported method will be return false
        // and callback never will be called.
        //
        //   Visibility.change(function(e, state) {
        //       Statistics.visibilityChange(state);
        //   });
        //
        // It is just proxy to `visibilitychange` event, but use vendor prefix.
        change: function (callback) {
            if ( !self.isSupported() ) {
                return false;
            }
            lastId += 1;
            var number = lastId;
            self._callbacks[number] = callback;
            self._listen();
            return number;
        },

        // Remove `change` listener by it ID.
        //
        //   var id = Visibility.change(function(e, state) {
        //       firstChangeCallback();
        //       Visibility.unbind(id);
        //   });
        unbind: function (id) {
            delete self._callbacks[id];
        },

        // Call `callback` in any state, expect “prerender”. If current state
        // is “prerender” it will wait until state will be changed.
        // If Page Visibility API doesn’t supported, it will call `callback`
        // immediately.
        //
        // Return false if API isn’t supported, true if page is already after
        // prerendering or listener ID (you can use it in `unbind` method)
        // if page is prerended now.
        //
        //   Visibility.afterPrerendering(function () {
        //       Statistics.countVisitor();
        //   });
        afterPrerendering: function (callback) {
            var support   = self.isSupported();
            var prerender = 'prerender';

            if ( !support || prerender != self.state() ) {
                callback();
                return support;
            }

            var listener = self.change(function (e, state) {
                if ( prerender != state ) {
                    self.unbind(listener);
                    callback();
                }
            });
            return listener;
        },

        // Return true if page now isn’t visible to user.
        //
        //   if ( !Visibility.hidden() ) {
        //       VideoPlayer.play();
        //   }
        //
        // It is just proxy to `document.hidden`, but use vendor prefix.
        hidden: function () {
            return !!(self._doc.hidden || self._doc.webkitHidden);
        },

        // Return visibility state: 'visible', 'hidden' or 'prerender'.
        //
        //   if ( 'prerender' == Visibility.state() ) {
        //       Statistics.pageIsPrerendering();
        //   }
        //
        // Don’t use `Visibility.state()` to detect, is page visible, because
        // visibility states can extend in next API versions.
        // Use more simpler and general `Visibility.hidden()` for this cases.
        //
        // It is just proxy to `document.visibilityState`, but use
        // vendor prefix.
        state: function () {
            return self._doc.visibilityState       ||
                   self._doc.webkitVisibilityState ||
                   'visible';
        },

        // Return true if browser support Page Visibility API.
        //
        //   if ( Visibility.isSupported() ) {
        //       Statistics.startTrackingVisibility();
        //       Visibility.change(function(e, state)) {
        //           Statistics.trackVisibility(state);
        //       });
        //   }
        isSupported: function () {
            return !!(self._doc.visibilityState ||
                      self._doc.webkitVisibilityState);
        },

        // Link to document object to change it in tests.
        _doc: document || {},

        // Callbacks from `change` method, that wait visibility changes.
        _callbacks: { },

        // Listener for `visibilitychange` event.
        _change: function(event) {
            var state = self.state();

            for ( var i in self._callbacks ) {
                self._callbacks[i].call(self._doc, event, state);
            }
        },

        // Set listener for `visibilitychange` event.
        _listen: function () {
            if ( self._init ) {
                return;
            }

            var event = 'visibilitychange';
            if ( self._doc.webkitVisibilityState ) {
                event = 'webkit' + event;
            }

            var listener = function () {
                self._change.apply(self, arguments);
            };
            if ( self._doc.addEventListener ) {
                self._doc.addEventListener(event, listener);
            } else {
                self._doc.attachEvent(event, listener);
            }
            self._init = true;
        }

    };

    if ( typeof(module) != 'undefined' && module.exports ) {
        module.exports = self;
    } else {
        global.Visibility = self;
    }

})(this);

},{}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/visibilityjs/lib/visibility.timers.js":[function(require,module,exports){
;(function (window) {
    "use strict";

    var lastTimer = -1;

    var install = function (Visibility) {

        // Run callback every `interval` milliseconds if page is visible and
        // every `hiddenInterval` milliseconds if page is hidden.
        //
        //   Visibility.every(60 * 1000, 5 * 60 * 1000, function () {
        //       checkNewMails();
        //   });
        //
        // You can skip `hiddenInterval` and callback will be called only if
        // page is visible.
        //
        //   Visibility.every(1000, function () {
        //       updateCountdown();
        //   });
        //
        // It is analog of `setInterval(callback, interval)` but use visibility
        // state.
        //
        // It return timer ID, that you can use in `Visibility.stop(id)` to stop
        // timer (`clearInterval` analog).
        // Warning: timer ID is different from interval ID from `setInterval`,
        // so don’t use it in `clearInterval`.
        //
        // On change state from hidden to visible timers will be execute.
        Visibility.every = function (interval, hiddenInterval, callback) {
            Visibility._time();

            if ( !callback ) {
                callback = hiddenInterval;
                hiddenInterval = null;
            }

            lastTimer += 1;
            var number = lastTimer;

            Visibility._timers[number] = {
                visible:  interval,
                hidden:   hiddenInterval,
                callback: callback
            };
            Visibility._run(number, false);

            if ( Visibility.isSupported() ) {
                Visibility._listen();
            }
            return number;
        };

        // Stop timer from `every` method by it ID (`every` method return it).
        //
        //   slideshow = Visibility.every(5 * 1000, function () {
        //       changeSlide();
        //   });
        //   $('.stopSlideshow').click(function () {
        //       Visibility.stop(slideshow);
        //   });
        Visibility.stop = function(id) {
            if ( !Visibility._timers[id] ) {
                return false;
            }
            Visibility._stop(id);
            delete Visibility._timers[id];
            return true;
        };

        // Callbacks and intervals added by `every` method.
        Visibility._timers = { };

        // Initialize variables on page loading.
        Visibility._time = function () {
            if ( Visibility._timed ) {
                return;
            }
            Visibility._timed     = true;
            Visibility._wasHidden = Visibility.hidden();

            Visibility.change(function () {
                Visibility._stopRun();
                Visibility._wasHidden = Visibility.hidden();
            });
        };

        // Try to run timer from every method by it’s ID. It will be use
        // `interval` or `hiddenInterval` depending on visibility state.
        // If page is hidden and `hiddenInterval` is null,
        // it will not run timer.
        //
        // Argument `runNow` say, that timers must be execute now too.
        Visibility._run = function (id, runNow) {
            var interval,
                timer = Visibility._timers[id];

            if ( Visibility.hidden() ) {
                if ( null === timer.hidden ) {
                    return;
                }
                interval = timer.hidden;
            } else {
                interval = timer.visible;
            }

            var runner = function () {
                timer.last = new Date();
                timer.callback.call(window);
            }

            if ( runNow ) {
                var now  = new Date();
                var last = now - timer.last ;

                if ( interval > last ) {
                    timer.delay = setTimeout(function () {
                        timer.id = setInterval(runner, interval);
                        runner();
                    }, interval - last);
                } else {
                    timer.id = setInterval(runner, interval);
                    runner();
                }

            } else {
              timer.id = setInterval(runner, interval);
            }
        };

        // Stop timer from `every` method by it’s ID.
        Visibility._stop = function (id) {
            var timer = Visibility._timers[id];
            clearInterval(timer.id);
            clearTimeout(timer.delay);
            delete timer.id;
            delete timer.delay;
        };

        // Listener for `visibilitychange` event.
        Visibility._stopRun = function (event) {
            var isHidden  = Visibility.hidden(),
                wasHidden = Visibility._wasHidden;

            if ( (isHidden && !wasHidden) || (!isHidden && wasHidden) ) {
                for ( var i in Visibility._timers ) {
                    Visibility._stop(i);
                    Visibility._run(i, !isHidden);
                }
            }
        };

        return Visibility;
    }

    if ( typeof(module) != 'undefined' && module.exports ) {
        module.exports = install(require('./visibility.core'));
    } else {
        install(window.Visibility)
    }

})(window);

},{"./visibility.core":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/visibilityjs/lib/visibility.core.js"}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Dumper.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var Dumper, Inline, Utils;

Utils = require('./Utils');

Inline = require('./Inline');

Dumper = (function() {
  function Dumper() {}

  Dumper.indentation = 4;

  Dumper.prototype.dump = function(input, inline, indent, exceptionOnInvalidType, objectEncoder) {
    var i, key, len, output, prefix, value, willBeInlined;
    if (inline == null) {
      inline = 0;
    }
    if (indent == null) {
      indent = 0;
    }
    if (exceptionOnInvalidType == null) {
      exceptionOnInvalidType = false;
    }
    if (objectEncoder == null) {
      objectEncoder = null;
    }
    output = '';
    prefix = (indent ? Utils.strRepeat(' ', indent) : '');
    if (inline <= 0 || typeof input !== 'object' || input instanceof Date || Utils.isEmpty(input)) {
      output += prefix + Inline.dump(input, exceptionOnInvalidType, objectEncoder);
    } else {
      if (input instanceof Array) {
        for (i = 0, len = input.length; i < len; i++) {
          value = input[i];
          willBeInlined = inline - 1 <= 0 || typeof value !== 'object' || Utils.isEmpty(value);
          output += prefix + '-' + (willBeInlined ? ' ' : "\n") + this.dump(value, inline - 1, (willBeInlined ? 0 : indent + this.indentation), exceptionOnInvalidType, objectEncoder) + (willBeInlined ? "\n" : '');
        }
      } else {
        for (key in input) {
          value = input[key];
          willBeInlined = inline - 1 <= 0 || typeof value !== 'object' || Utils.isEmpty(value);
          output += prefix + Inline.dump(key, exceptionOnInvalidType, objectEncoder) + ':' + (willBeInlined ? ' ' : "\n") + this.dump(value, inline - 1, (willBeInlined ? 0 : indent + this.indentation), exceptionOnInvalidType, objectEncoder) + (willBeInlined ? "\n" : '');
        }
      }
    }
    return output;
  };

  return Dumper;

})();

module.exports = Dumper;

},{"./Inline":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Inline.js","./Utils":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Utils.js"}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Escaper.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var Escaper, Pattern;

Pattern = require('./Pattern');

Escaper = (function() {
  var ch;

  function Escaper() {}

  Escaper.LIST_ESCAPEES = ['\\', '\\\\', '\\"', '"', "\x00", "\x01", "\x02", "\x03", "\x04", "\x05", "\x06", "\x07", "\x08", "\x09", "\x0a", "\x0b", "\x0c", "\x0d", "\x0e", "\x0f", "\x10", "\x11", "\x12", "\x13", "\x14", "\x15", "\x16", "\x17", "\x18", "\x19", "\x1a", "\x1b", "\x1c", "\x1d", "\x1e", "\x1f", (ch = String.fromCharCode)(0x0085), ch(0x00A0), ch(0x2028), ch(0x2029)];

  Escaper.LIST_ESCAPED = ['\\\\', '\\"', '\\"', '\\"', "\\0", "\\x01", "\\x02", "\\x03", "\\x04", "\\x05", "\\x06", "\\a", "\\b", "\\t", "\\n", "\\v", "\\f", "\\r", "\\x0e", "\\x0f", "\\x10", "\\x11", "\\x12", "\\x13", "\\x14", "\\x15", "\\x16", "\\x17", "\\x18", "\\x19", "\\x1a", "\\e", "\\x1c", "\\x1d", "\\x1e", "\\x1f", "\\N", "\\_", "\\L", "\\P"];

  Escaper.MAPPING_ESCAPEES_TO_ESCAPED = (function() {
    var i, j, mapping, ref;
    mapping = {};
    for (i = j = 0, ref = Escaper.LIST_ESCAPEES.length; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      mapping[Escaper.LIST_ESCAPEES[i]] = Escaper.LIST_ESCAPED[i];
    }
    return mapping;
  })();

  Escaper.PATTERN_CHARACTERS_TO_ESCAPE = new Pattern('[\\x00-\\x1f]|\xc2\x85|\xc2\xa0|\xe2\x80\xa8|\xe2\x80\xa9');

  Escaper.PATTERN_MAPPING_ESCAPEES = new Pattern(Escaper.LIST_ESCAPEES.join('|').split('\\').join('\\\\'));

  Escaper.PATTERN_SINGLE_QUOTING = new Pattern('[\\s\'":{}[\\],&*#?]|^[-?|<>=!%@`]');

  Escaper.requiresDoubleQuoting = function(value) {
    return this.PATTERN_CHARACTERS_TO_ESCAPE.test(value);
  };

  Escaper.escapeWithDoubleQuotes = function(value) {
    var result;
    result = this.PATTERN_MAPPING_ESCAPEES.replace(value, (function(_this) {
      return function(str) {
        return _this.MAPPING_ESCAPEES_TO_ESCAPED[str];
      };
    })(this));
    return '"' + result + '"';
  };

  Escaper.requiresSingleQuoting = function(value) {
    return this.PATTERN_SINGLE_QUOTING.test(value);
  };

  Escaper.escapeWithSingleQuotes = function(value) {
    return "'" + value.replace(/'/g, "''") + "'";
  };

  return Escaper;

})();

module.exports = Escaper;

},{"./Pattern":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Pattern.js"}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Exception/DumpException.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var DumpException,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

DumpException = (function(superClass) {
  extend(DumpException, superClass);

  function DumpException(message, parsedLine, snippet) {
    this.message = message;
    this.parsedLine = parsedLine;
    this.snippet = snippet;
  }

  DumpException.prototype.toString = function() {
    if ((this.parsedLine != null) && (this.snippet != null)) {
      return '<DumpException> ' + this.message + ' (line ' + this.parsedLine + ': \'' + this.snippet + '\')';
    } else {
      return '<DumpException> ' + this.message;
    }
  };

  return DumpException;

})(Error);

module.exports = DumpException;

},{}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Exception/ParseException.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var ParseException,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ParseException = (function(superClass) {
  extend(ParseException, superClass);

  function ParseException(message, parsedLine, snippet) {
    this.message = message;
    this.parsedLine = parsedLine;
    this.snippet = snippet;
  }

  ParseException.prototype.toString = function() {
    if ((this.parsedLine != null) && (this.snippet != null)) {
      return '<ParseException> ' + this.message + ' (line ' + this.parsedLine + ': \'' + this.snippet + '\')';
    } else {
      return '<ParseException> ' + this.message;
    }
  };

  return ParseException;

})(Error);

module.exports = ParseException;

},{}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Exception/ParseMore.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var ParseMore,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ParseMore = (function(superClass) {
  extend(ParseMore, superClass);

  function ParseMore(message, parsedLine, snippet) {
    this.message = message;
    this.parsedLine = parsedLine;
    this.snippet = snippet;
  }

  ParseMore.prototype.toString = function() {
    if ((this.parsedLine != null) && (this.snippet != null)) {
      return '<ParseMore> ' + this.message + ' (line ' + this.parsedLine + ': \'' + this.snippet + '\')';
    } else {
      return '<ParseMore> ' + this.message;
    }
  };

  return ParseMore;

})(Error);

module.exports = ParseMore;

},{}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Inline.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var DumpException, Escaper, Inline, ParseException, ParseMore, Pattern, Unescaper, Utils,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Pattern = require('./Pattern');

Unescaper = require('./Unescaper');

Escaper = require('./Escaper');

Utils = require('./Utils');

ParseException = require('./Exception/ParseException');

ParseMore = require('./Exception/ParseMore');

DumpException = require('./Exception/DumpException');

Inline = (function() {
  function Inline() {}

  Inline.REGEX_QUOTED_STRING = '(?:"(?:[^"\\\\]*(?:\\\\.[^"\\\\]*)*)"|\'(?:[^\']*(?:\'\'[^\']*)*)\')';

  Inline.PATTERN_TRAILING_COMMENTS = new Pattern('^\\s*#.*$');

  Inline.PATTERN_QUOTED_SCALAR = new Pattern('^' + Inline.REGEX_QUOTED_STRING);

  Inline.PATTERN_THOUSAND_NUMERIC_SCALAR = new Pattern('^(-|\\+)?[0-9,]+(\\.[0-9]+)?$');

  Inline.PATTERN_SCALAR_BY_DELIMITERS = {};

  Inline.settings = {};

  Inline.configure = function(exceptionOnInvalidType, objectDecoder) {
    if (exceptionOnInvalidType == null) {
      exceptionOnInvalidType = null;
    }
    if (objectDecoder == null) {
      objectDecoder = null;
    }
    this.settings.exceptionOnInvalidType = exceptionOnInvalidType;
    this.settings.objectDecoder = objectDecoder;
  };

  Inline.parse = function(value, exceptionOnInvalidType, objectDecoder) {
    var context, result;
    if (exceptionOnInvalidType == null) {
      exceptionOnInvalidType = false;
    }
    if (objectDecoder == null) {
      objectDecoder = null;
    }
    this.settings.exceptionOnInvalidType = exceptionOnInvalidType;
    this.settings.objectDecoder = objectDecoder;
    if (value == null) {
      return '';
    }
    value = Utils.trim(value);
    if (0 === value.length) {
      return '';
    }
    context = {
      exceptionOnInvalidType: exceptionOnInvalidType,
      objectDecoder: objectDecoder,
      i: 0
    };
    switch (value.charAt(0)) {
      case '[':
        result = this.parseSequence(value, context);
        ++context.i;
        break;
      case '{':
        result = this.parseMapping(value, context);
        ++context.i;
        break;
      default:
        result = this.parseScalar(value, null, ['"', "'"], context);
    }
    if (this.PATTERN_TRAILING_COMMENTS.replace(value.slice(context.i), '') !== '') {
      throw new ParseException('Unexpected characters near "' + value.slice(context.i) + '".');
    }
    return result;
  };

  Inline.dump = function(value, exceptionOnInvalidType, objectEncoder) {
    var ref, result, type;
    if (exceptionOnInvalidType == null) {
      exceptionOnInvalidType = false;
    }
    if (objectEncoder == null) {
      objectEncoder = null;
    }
    if (value == null) {
      return 'null';
    }
    type = typeof value;
    if (type === 'object') {
      if (value instanceof Date) {
        return value.toISOString();
      } else if (objectEncoder != null) {
        result = objectEncoder(value);
        if (typeof result === 'string' || (result != null)) {
          return result;
        }
      }
      return this.dumpObject(value);
    }
    if (type === 'boolean') {
      return (value ? 'true' : 'false');
    }
    if (Utils.isDigits(value)) {
      return (type === 'string' ? "'" + value + "'" : String(parseInt(value)));
    }
    if (Utils.isNumeric(value)) {
      return (type === 'string' ? "'" + value + "'" : String(parseFloat(value)));
    }
    if (type === 'number') {
      return (value === 2e308 ? '.Inf' : (value === -2e308 ? '-.Inf' : (isNaN(value) ? '.NaN' : value)));
    }
    if (Escaper.requiresDoubleQuoting(value)) {
      return Escaper.escapeWithDoubleQuotes(value);
    }
    if (Escaper.requiresSingleQuoting(value)) {
      return Escaper.escapeWithSingleQuotes(value);
    }
    if ('' === value) {
      return '""';
    }
    if (Utils.PATTERN_DATE.test(value)) {
      return "'" + value + "'";
    }
    if ((ref = value.toLowerCase()) === 'null' || ref === '~' || ref === 'true' || ref === 'false') {
      return "'" + value + "'";
    }
    return value;
  };

  Inline.dumpObject = function(value, exceptionOnInvalidType, objectSupport) {
    var j, key, len1, output, val;
    if (objectSupport == null) {
      objectSupport = null;
    }
    if (value instanceof Array) {
      output = [];
      for (j = 0, len1 = value.length; j < len1; j++) {
        val = value[j];
        output.push(this.dump(val));
      }
      return '[' + output.join(', ') + ']';
    } else {
      output = [];
      for (key in value) {
        val = value[key];
        output.push(this.dump(key) + ': ' + this.dump(val));
      }
      return '{' + output.join(', ') + '}';
    }
  };

  Inline.parseScalar = function(scalar, delimiters, stringDelimiters, context, evaluate) {
    var i, joinedDelimiters, match, output, pattern, ref, ref1, strpos, tmp;
    if (delimiters == null) {
      delimiters = null;
    }
    if (stringDelimiters == null) {
      stringDelimiters = ['"', "'"];
    }
    if (context == null) {
      context = null;
    }
    if (evaluate == null) {
      evaluate = true;
    }
    if (context == null) {
      context = {
        exceptionOnInvalidType: this.settings.exceptionOnInvalidType,
        objectDecoder: this.settings.objectDecoder,
        i: 0
      };
    }
    i = context.i;
    if (ref = scalar.charAt(i), indexOf.call(stringDelimiters, ref) >= 0) {
      output = this.parseQuotedScalar(scalar, context);
      i = context.i;
      if (delimiters != null) {
        tmp = Utils.ltrim(scalar.slice(i), ' ');
        if (!(ref1 = tmp.charAt(0), indexOf.call(delimiters, ref1) >= 0)) {
          throw new ParseException('Unexpected characters (' + scalar.slice(i) + ').');
        }
      }
    } else {
      if (!delimiters) {
        output = scalar.slice(i);
        i += output.length;
        strpos = output.indexOf(' #');
        if (strpos !== -1) {
          output = Utils.rtrim(output.slice(0, strpos));
        }
      } else {
        joinedDelimiters = delimiters.join('|');
        pattern = this.PATTERN_SCALAR_BY_DELIMITERS[joinedDelimiters];
        if (pattern == null) {
          pattern = new Pattern('^(.+?)(' + joinedDelimiters + ')');
          this.PATTERN_SCALAR_BY_DELIMITERS[joinedDelimiters] = pattern;
        }
        if (match = pattern.exec(scalar.slice(i))) {
          output = match[1];
          i += output.length;
        } else {
          throw new ParseException('Malformed inline YAML string (' + scalar + ').');
        }
      }
      if (evaluate) {
        output = this.evaluateScalar(output, context);
      }
    }
    context.i = i;
    return output;
  };

  Inline.parseQuotedScalar = function(scalar, context) {
    var i, match, output;
    i = context.i;
    if (!(match = this.PATTERN_QUOTED_SCALAR.exec(scalar.slice(i)))) {
      throw new ParseMore('Malformed inline YAML string (' + scalar.slice(i) + ').');
    }
    output = match[0].substr(1, match[0].length - 2);
    if ('"' === scalar.charAt(i)) {
      output = Unescaper.unescapeDoubleQuotedString(output);
    } else {
      output = Unescaper.unescapeSingleQuotedString(output);
    }
    i += match[0].length;
    context.i = i;
    return output;
  };

  Inline.parseSequence = function(sequence, context) {
    var e, i, isQuoted, len, output, ref, value;
    output = [];
    len = sequence.length;
    i = context.i;
    i += 1;
    while (i < len) {
      context.i = i;
      switch (sequence.charAt(i)) {
        case '[':
          output.push(this.parseSequence(sequence, context));
          i = context.i;
          break;
        case '{':
          output.push(this.parseMapping(sequence, context));
          i = context.i;
          break;
        case ']':
          return output;
        case ',':
        case ' ':
        case "\n":
          break;
        default:
          isQuoted = ((ref = sequence.charAt(i)) === '"' || ref === "'");
          value = this.parseScalar(sequence, [',', ']'], ['"', "'"], context);
          i = context.i;
          if (!isQuoted && typeof value === 'string' && (value.indexOf(': ') !== -1 || value.indexOf(":\n") !== -1)) {
            try {
              value = this.parseMapping('{' + value + '}');
            } catch (error) {
              e = error;
            }
          }
          output.push(value);
          --i;
      }
      ++i;
    }
    throw new ParseMore('Malformed inline YAML string ' + sequence);
  };

  Inline.parseMapping = function(mapping, context) {
    var done, i, key, len, output, shouldContinueWhileLoop, value;
    output = {};
    len = mapping.length;
    i = context.i;
    i += 1;
    shouldContinueWhileLoop = false;
    while (i < len) {
      context.i = i;
      switch (mapping.charAt(i)) {
        case ' ':
        case ',':
        case "\n":
          ++i;
          context.i = i;
          shouldContinueWhileLoop = true;
          break;
        case '}':
          return output;
      }
      if (shouldContinueWhileLoop) {
        shouldContinueWhileLoop = false;
        continue;
      }
      key = this.parseScalar(mapping, [':', ' ', "\n"], ['"', "'"], context, false);
      i = context.i;
      done = false;
      while (i < len) {
        context.i = i;
        switch (mapping.charAt(i)) {
          case '[':
            value = this.parseSequence(mapping, context);
            i = context.i;
            if (output[key] === void 0) {
              output[key] = value;
            }
            done = true;
            break;
          case '{':
            value = this.parseMapping(mapping, context);
            i = context.i;
            if (output[key] === void 0) {
              output[key] = value;
            }
            done = true;
            break;
          case ':':
          case ' ':
          case "\n":
            break;
          default:
            value = this.parseScalar(mapping, [',', '}'], ['"', "'"], context);
            i = context.i;
            if (output[key] === void 0) {
              output[key] = value;
            }
            done = true;
            --i;
        }
        ++i;
        if (done) {
          break;
        }
      }
    }
    throw new ParseMore('Malformed inline YAML string ' + mapping);
  };

  Inline.evaluateScalar = function(scalar, context) {
    var cast, date, exceptionOnInvalidType, firstChar, firstSpace, firstWord, objectDecoder, raw, scalarLower, subValue, trimmedScalar;
    scalar = Utils.trim(scalar);
    scalarLower = scalar.toLowerCase();
    switch (scalarLower) {
      case 'null':
      case '':
      case '~':
        return null;
      case 'true':
        return true;
      case 'false':
        return false;
      case '.inf':
        return 2e308;
      case '.nan':
        return 0/0;
      case '-.inf':
        return 2e308;
      default:
        firstChar = scalarLower.charAt(0);
        switch (firstChar) {
          case '!':
            firstSpace = scalar.indexOf(' ');
            if (firstSpace === -1) {
              firstWord = scalarLower;
            } else {
              firstWord = scalarLower.slice(0, firstSpace);
            }
            switch (firstWord) {
              case '!':
                if (firstSpace !== -1) {
                  return parseInt(this.parseScalar(scalar.slice(2)));
                }
                return null;
              case '!str':
                return Utils.ltrim(scalar.slice(4));
              case '!!str':
                return Utils.ltrim(scalar.slice(5));
              case '!!int':
                return parseInt(this.parseScalar(scalar.slice(5)));
              case '!!bool':
                return Utils.parseBoolean(this.parseScalar(scalar.slice(6)), false);
              case '!!float':
                return parseFloat(this.parseScalar(scalar.slice(7)));
              case '!!timestamp':
                return Utils.stringToDate(Utils.ltrim(scalar.slice(11)));
              default:
                if (context == null) {
                  context = {
                    exceptionOnInvalidType: this.settings.exceptionOnInvalidType,
                    objectDecoder: this.settings.objectDecoder,
                    i: 0
                  };
                }
                objectDecoder = context.objectDecoder, exceptionOnInvalidType = context.exceptionOnInvalidType;
                if (objectDecoder) {
                  trimmedScalar = Utils.rtrim(scalar);
                  firstSpace = trimmedScalar.indexOf(' ');
                  if (firstSpace === -1) {
                    return objectDecoder(trimmedScalar, null);
                  } else {
                    subValue = Utils.ltrim(trimmedScalar.slice(firstSpace + 1));
                    if (!(subValue.length > 0)) {
                      subValue = null;
                    }
                    return objectDecoder(trimmedScalar.slice(0, firstSpace), subValue);
                  }
                }
                if (exceptionOnInvalidType) {
                  throw new ParseException('Custom object support when parsing a YAML file has been disabled.');
                }
                return null;
            }
            break;
          case '0':
            if ('0x' === scalar.slice(0, 2)) {
              return Utils.hexDec(scalar);
            } else if (Utils.isDigits(scalar)) {
              return Utils.octDec(scalar);
            } else if (Utils.isNumeric(scalar)) {
              return parseFloat(scalar);
            } else {
              return scalar;
            }
            break;
          case '+':
            if (Utils.isDigits(scalar)) {
              raw = scalar;
              cast = parseInt(raw);
              if (raw === String(cast)) {
                return cast;
              } else {
                return raw;
              }
            } else if (Utils.isNumeric(scalar)) {
              return parseFloat(scalar);
            } else if (this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(scalar)) {
              return parseFloat(scalar.replace(',', ''));
            }
            return scalar;
          case '-':
            if (Utils.isDigits(scalar.slice(1))) {
              if ('0' === scalar.charAt(1)) {
                return -Utils.octDec(scalar.slice(1));
              } else {
                raw = scalar.slice(1);
                cast = parseInt(raw);
                if (raw === String(cast)) {
                  return -cast;
                } else {
                  return -raw;
                }
              }
            } else if (Utils.isNumeric(scalar)) {
              return parseFloat(scalar);
            } else if (this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(scalar)) {
              return parseFloat(scalar.replace(',', ''));
            }
            return scalar;
          default:
            if (date = Utils.stringToDate(scalar)) {
              return date;
            } else if (Utils.isNumeric(scalar)) {
              return parseFloat(scalar);
            } else if (this.PATTERN_THOUSAND_NUMERIC_SCALAR.test(scalar)) {
              return parseFloat(scalar.replace(',', ''));
            }
            return scalar;
        }
    }
  };

  return Inline;

})();

module.exports = Inline;

},{"./Escaper":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Escaper.js","./Exception/DumpException":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Exception/DumpException.js","./Exception/ParseException":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Exception/ParseException.js","./Exception/ParseMore":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Exception/ParseMore.js","./Pattern":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Pattern.js","./Unescaper":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Unescaper.js","./Utils":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Utils.js"}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Parser.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var Inline, ParseException, ParseMore, Parser, Pattern, Utils;

Inline = require('./Inline');

Pattern = require('./Pattern');

Utils = require('./Utils');

ParseException = require('./Exception/ParseException');

ParseMore = require('./Exception/ParseMore');

Parser = (function() {
  Parser.prototype.PATTERN_FOLDED_SCALAR_ALL = new Pattern('^(?:(?<type>![^\\|>]*)\\s+)?(?<separator>\\||>)(?<modifiers>\\+|\\-|\\d+|\\+\\d+|\\-\\d+|\\d+\\+|\\d+\\-)?(?<comments> +#.*)?$');

  Parser.prototype.PATTERN_FOLDED_SCALAR_END = new Pattern('(?<separator>\\||>)(?<modifiers>\\+|\\-|\\d+|\\+\\d+|\\-\\d+|\\d+\\+|\\d+\\-)?(?<comments> +#.*)?$');

  Parser.prototype.PATTERN_SEQUENCE_ITEM = new Pattern('^\\-((?<leadspaces>\\s+)(?<value>.+?))?\\s*$');

  Parser.prototype.PATTERN_ANCHOR_VALUE = new Pattern('^&(?<ref>[^ ]+) *(?<value>.*)');

  Parser.prototype.PATTERN_COMPACT_NOTATION = new Pattern('^(?<key>' + Inline.REGEX_QUOTED_STRING + '|[^ \'"\\{\\[].*?) *\\:(\\s+(?<value>.+?))?\\s*$');

  Parser.prototype.PATTERN_MAPPING_ITEM = new Pattern('^(?<key>' + Inline.REGEX_QUOTED_STRING + '|[^ \'"\\[\\{].*?) *\\:(\\s+(?<value>.+?))?\\s*$');

  Parser.prototype.PATTERN_DECIMAL = new Pattern('\\d+');

  Parser.prototype.PATTERN_INDENT_SPACES = new Pattern('^ +');

  Parser.prototype.PATTERN_TRAILING_LINES = new Pattern('(\n*)$');

  Parser.prototype.PATTERN_YAML_HEADER = new Pattern('^\\%YAML[: ][\\d\\.]+.*\n', 'm');

  Parser.prototype.PATTERN_LEADING_COMMENTS = new Pattern('^(\\#.*?\n)+', 'm');

  Parser.prototype.PATTERN_DOCUMENT_MARKER_START = new Pattern('^\\-\\-\\-.*?\n', 'm');

  Parser.prototype.PATTERN_DOCUMENT_MARKER_END = new Pattern('^\\.\\.\\.\\s*$', 'm');

  Parser.prototype.PATTERN_FOLDED_SCALAR_BY_INDENTATION = {};

  Parser.prototype.CONTEXT_NONE = 0;

  Parser.prototype.CONTEXT_SEQUENCE = 1;

  Parser.prototype.CONTEXT_MAPPING = 2;

  function Parser(offset) {
    this.offset = offset != null ? offset : 0;
    this.lines = [];
    this.currentLineNb = -1;
    this.currentLine = '';
    this.refs = {};
  }

  Parser.prototype.parse = function(value, exceptionOnInvalidType, objectDecoder) {
    var alias, allowOverwrite, block, c, context, data, e, first, i, indent, isRef, j, k, key, l, lastKey, len, len1, len2, len3, lineCount, m, matches, mergeNode, n, name, parsed, parsedItem, parser, ref, ref1, ref2, refName, refValue, val, values;
    if (exceptionOnInvalidType == null) {
      exceptionOnInvalidType = false;
    }
    if (objectDecoder == null) {
      objectDecoder = null;
    }
    this.currentLineNb = -1;
    this.currentLine = '';
    this.lines = this.cleanup(value).split("\n");
    data = null;
    context = this.CONTEXT_NONE;
    allowOverwrite = false;
    while (this.moveToNextLine()) {
      if (this.isCurrentLineEmpty()) {
        continue;
      }
      if ("\t" === this.currentLine[0]) {
        throw new ParseException('A YAML file cannot contain tabs as indentation.', this.getRealCurrentLineNb() + 1, this.currentLine);
      }
      isRef = mergeNode = false;
      if (values = this.PATTERN_SEQUENCE_ITEM.exec(this.currentLine)) {
        if (this.CONTEXT_MAPPING === context) {
          throw new ParseException('You cannot define a sequence item when in a mapping');
        }
        context = this.CONTEXT_SEQUENCE;
        if (data == null) {
          data = [];
        }
        if ((values.value != null) && (matches = this.PATTERN_ANCHOR_VALUE.exec(values.value))) {
          isRef = matches.ref;
          values.value = matches.value;
        }
        if (!(values.value != null) || '' === Utils.trim(values.value, ' ') || Utils.ltrim(values.value, ' ').indexOf('#') === 0) {
          if (this.currentLineNb < this.lines.length - 1 && !this.isNextLineUnIndentedCollection()) {
            c = this.getRealCurrentLineNb() + 1;
            parser = new Parser(c);
            parser.refs = this.refs;
            data.push(parser.parse(this.getNextEmbedBlock(null, true), exceptionOnInvalidType, objectDecoder));
          } else {
            data.push(null);
          }
        } else {
          if (((ref = values.leadspaces) != null ? ref.length : void 0) && (matches = this.PATTERN_COMPACT_NOTATION.exec(values.value))) {
            c = this.getRealCurrentLineNb();
            parser = new Parser(c);
            parser.refs = this.refs;
            block = values.value;
            indent = this.getCurrentLineIndentation();
            if (this.isNextLineIndented(false)) {
              block += "\n" + this.getNextEmbedBlock(indent + values.leadspaces.length + 1, true);
            }
            data.push(parser.parse(block, exceptionOnInvalidType, objectDecoder));
          } else {
            data.push(this.parseValue(values.value, exceptionOnInvalidType, objectDecoder));
          }
        }
      } else if ((values = this.PATTERN_MAPPING_ITEM.exec(this.currentLine)) && values.key.indexOf(' #') === -1) {
        if (this.CONTEXT_SEQUENCE === context) {
          throw new ParseException('You cannot define a mapping item when in a sequence');
        }
        context = this.CONTEXT_MAPPING;
        if (data == null) {
          data = {};
        }
        Inline.configure(exceptionOnInvalidType, objectDecoder);
        try {
          key = Inline.parseScalar(values.key);
        } catch (error) {
          e = error;
          e.parsedLine = this.getRealCurrentLineNb() + 1;
          e.snippet = this.currentLine;
          throw e;
        }
        if ('<<' === key) {
          mergeNode = true;
          allowOverwrite = true;
          if (((ref1 = values.value) != null ? ref1.indexOf('*') : void 0) === 0) {
            refName = values.value.slice(1);
            if (this.refs[refName] == null) {
              throw new ParseException('Reference "' + refName + '" does not exist.', this.getRealCurrentLineNb() + 1, this.currentLine);
            }
            refValue = this.refs[refName];
            if (typeof refValue !== 'object') {
              throw new ParseException('YAML merge keys used with a scalar value instead of an object.', this.getRealCurrentLineNb() + 1, this.currentLine);
            }
            if (refValue instanceof Array) {
              for (i = j = 0, len = refValue.length; j < len; i = ++j) {
                value = refValue[i];
                if (data[name = String(i)] == null) {
                  data[name] = value;
                }
              }
            } else {
              for (key in refValue) {
                value = refValue[key];
                if (data[key] == null) {
                  data[key] = value;
                }
              }
            }
          } else {
            if ((values.value != null) && values.value !== '') {
              value = values.value;
            } else {
              value = this.getNextEmbedBlock();
            }
            c = this.getRealCurrentLineNb() + 1;
            parser = new Parser(c);
            parser.refs = this.refs;
            parsed = parser.parse(value, exceptionOnInvalidType);
            if (typeof parsed !== 'object') {
              throw new ParseException('YAML merge keys used with a scalar value instead of an object.', this.getRealCurrentLineNb() + 1, this.currentLine);
            }
            if (parsed instanceof Array) {
              for (l = 0, len1 = parsed.length; l < len1; l++) {
                parsedItem = parsed[l];
                if (typeof parsedItem !== 'object') {
                  throw new ParseException('Merge items must be objects.', this.getRealCurrentLineNb() + 1, parsedItem);
                }
                if (parsedItem instanceof Array) {
                  for (i = m = 0, len2 = parsedItem.length; m < len2; i = ++m) {
                    value = parsedItem[i];
                    k = String(i);
                    if (!data.hasOwnProperty(k)) {
                      data[k] = value;
                    }
                  }
                } else {
                  for (key in parsedItem) {
                    value = parsedItem[key];
                    if (!data.hasOwnProperty(key)) {
                      data[key] = value;
                    }
                  }
                }
              }
            } else {
              for (key in parsed) {
                value = parsed[key];
                if (!data.hasOwnProperty(key)) {
                  data[key] = value;
                }
              }
            }
          }
        } else if ((values.value != null) && (matches = this.PATTERN_ANCHOR_VALUE.exec(values.value))) {
          isRef = matches.ref;
          values.value = matches.value;
        }
        if (mergeNode) {

        } else if (!(values.value != null) || '' === Utils.trim(values.value, ' ') || Utils.ltrim(values.value, ' ').indexOf('#') === 0) {
          if (!(this.isNextLineIndented()) && !(this.isNextLineUnIndentedCollection())) {
            if (allowOverwrite || data[key] === void 0) {
              data[key] = null;
            }
          } else {
            c = this.getRealCurrentLineNb() + 1;
            parser = new Parser(c);
            parser.refs = this.refs;
            val = parser.parse(this.getNextEmbedBlock(), exceptionOnInvalidType, objectDecoder);
            if (allowOverwrite || data[key] === void 0) {
              data[key] = val;
            }
          }
        } else {
          val = this.parseValue(values.value, exceptionOnInvalidType, objectDecoder);
          if (allowOverwrite || data[key] === void 0) {
            data[key] = val;
          }
        }
      } else {
        lineCount = this.lines.length;
        if (1 === lineCount || (2 === lineCount && Utils.isEmpty(this.lines[1]))) {
          try {
            value = Inline.parse(this.lines[0], exceptionOnInvalidType, objectDecoder);
          } catch (error) {
            e = error;
            e.parsedLine = this.getRealCurrentLineNb() + 1;
            e.snippet = this.currentLine;
            throw e;
          }
          if (typeof value === 'object') {
            if (value instanceof Array) {
              first = value[0];
            } else {
              for (key in value) {
                first = value[key];
                break;
              }
            }
            if (typeof first === 'string' && first.indexOf('*') === 0) {
              data = [];
              for (n = 0, len3 = value.length; n < len3; n++) {
                alias = value[n];
                data.push(this.refs[alias.slice(1)]);
              }
              value = data;
            }
          }
          return value;
        } else if ((ref2 = Utils.ltrim(value).charAt(0)) === '[' || ref2 === '{') {
          try {
            return Inline.parse(value, exceptionOnInvalidType, objectDecoder);
          } catch (error) {
            e = error;
            e.parsedLine = this.getRealCurrentLineNb() + 1;
            e.snippet = this.currentLine;
            throw e;
          }
        }
        throw new ParseException('Unable to parse.', this.getRealCurrentLineNb() + 1, this.currentLine);
      }
      if (isRef) {
        if (data instanceof Array) {
          this.refs[isRef] = data[data.length - 1];
        } else {
          lastKey = null;
          for (key in data) {
            lastKey = key;
          }
          this.refs[isRef] = data[lastKey];
        }
      }
    }
    if (Utils.isEmpty(data)) {
      return null;
    } else {
      return data;
    }
  };

  Parser.prototype.getRealCurrentLineNb = function() {
    return this.currentLineNb + this.offset;
  };

  Parser.prototype.getCurrentLineIndentation = function() {
    return this.currentLine.length - Utils.ltrim(this.currentLine, ' ').length;
  };

  Parser.prototype.getNextEmbedBlock = function(indentation, includeUnindentedCollection) {
    var data, indent, isItUnindentedCollection, newIndent, removeComments, removeCommentsPattern, unindentedEmbedBlock;
    if (indentation == null) {
      indentation = null;
    }
    if (includeUnindentedCollection == null) {
      includeUnindentedCollection = false;
    }
    this.moveToNextLine();
    if (indentation == null) {
      newIndent = this.getCurrentLineIndentation();
      unindentedEmbedBlock = this.isStringUnIndentedCollectionItem(this.currentLine);
      if (!(this.isCurrentLineEmpty()) && 0 === newIndent && !unindentedEmbedBlock) {
        throw new ParseException('Indentation problem.', this.getRealCurrentLineNb() + 1, this.currentLine);
      }
    } else {
      newIndent = indentation;
    }
    data = [this.currentLine.slice(newIndent)];
    if (!includeUnindentedCollection) {
      isItUnindentedCollection = this.isStringUnIndentedCollectionItem(this.currentLine);
    }
    removeCommentsPattern = this.PATTERN_FOLDED_SCALAR_END;
    removeComments = !removeCommentsPattern.test(this.currentLine);
    while (this.moveToNextLine()) {
      indent = this.getCurrentLineIndentation();
      if (indent === newIndent) {
        removeComments = !removeCommentsPattern.test(this.currentLine);
      }
      if (removeComments && this.isCurrentLineComment()) {
        continue;
      }
      if (this.isCurrentLineBlank()) {
        data.push(this.currentLine.slice(newIndent));
        continue;
      }
      if (isItUnindentedCollection && !this.isStringUnIndentedCollectionItem(this.currentLine) && indent === newIndent) {
        this.moveToPreviousLine();
        break;
      }
      if (indent >= newIndent) {
        data.push(this.currentLine.slice(newIndent));
      } else if (Utils.ltrim(this.currentLine).charAt(0) === '#') {

      } else if (0 === indent) {
        this.moveToPreviousLine();
        break;
      } else {
        throw new ParseException('Indentation problem.', this.getRealCurrentLineNb() + 1, this.currentLine);
      }
    }
    return data.join("\n");
  };

  Parser.prototype.moveToNextLine = function() {
    if (this.currentLineNb >= this.lines.length - 1) {
      return false;
    }
    this.currentLine = this.lines[++this.currentLineNb];
    return true;
  };

  Parser.prototype.moveToPreviousLine = function() {
    this.currentLine = this.lines[--this.currentLineNb];
  };

  Parser.prototype.parseValue = function(value, exceptionOnInvalidType, objectDecoder) {
    var e, foldedIndent, matches, modifiers, pos, ref, ref1, val;
    if (0 === value.indexOf('*')) {
      pos = value.indexOf('#');
      if (pos !== -1) {
        value = value.substr(1, pos - 2);
      } else {
        value = value.slice(1);
      }
      if (this.refs[value] === void 0) {
        throw new ParseException('Reference "' + value + '" does not exist.', this.currentLine);
      }
      return this.refs[value];
    }
    if (matches = this.PATTERN_FOLDED_SCALAR_ALL.exec(value)) {
      modifiers = (ref = matches.modifiers) != null ? ref : '';
      foldedIndent = Math.abs(parseInt(modifiers));
      if (isNaN(foldedIndent)) {
        foldedIndent = 0;
      }
      val = this.parseFoldedScalar(matches.separator, this.PATTERN_DECIMAL.replace(modifiers, ''), foldedIndent);
      if (matches.type != null) {
        Inline.configure(exceptionOnInvalidType, objectDecoder);
        return Inline.parseScalar(matches.type + ' ' + val);
      } else {
        return val;
      }
    }
    if ((ref1 = value.charAt(0)) === '[' || ref1 === '{' || ref1 === '"' || ref1 === "'") {
      while (true) {
        try {
          return Inline.parse(value, exceptionOnInvalidType, objectDecoder);
        } catch (error) {
          e = error;
          if (e instanceof ParseMore && this.moveToNextLine()) {
            value += "\n" + Utils.trim(this.currentLine, ' ');
          } else {
            e.parsedLine = this.getRealCurrentLineNb() + 1;
            e.snippet = this.currentLine;
            throw e;
          }
        }
      }
    } else {
      if (this.isNextLineIndented()) {
        value += "\n" + this.getNextEmbedBlock();
      }
      return Inline.parse(value, exceptionOnInvalidType, objectDecoder);
    }
  };

  Parser.prototype.parseFoldedScalar = function(separator, indicator, indentation) {
    var isCurrentLineBlank, j, len, line, matches, newText, notEOF, pattern, ref, text;
    if (indicator == null) {
      indicator = '';
    }
    if (indentation == null) {
      indentation = 0;
    }
    notEOF = this.moveToNextLine();
    if (!notEOF) {
      return '';
    }
    isCurrentLineBlank = this.isCurrentLineBlank();
    text = '';
    while (notEOF && isCurrentLineBlank) {
      if (notEOF = this.moveToNextLine()) {
        text += "\n";
        isCurrentLineBlank = this.isCurrentLineBlank();
      }
    }
    if (0 === indentation) {
      if (matches = this.PATTERN_INDENT_SPACES.exec(this.currentLine)) {
        indentation = matches[0].length;
      }
    }
    if (indentation > 0) {
      pattern = this.PATTERN_FOLDED_SCALAR_BY_INDENTATION[indentation];
      if (pattern == null) {
        pattern = new Pattern('^ {' + indentation + '}(.*)$');
        Parser.prototype.PATTERN_FOLDED_SCALAR_BY_INDENTATION[indentation] = pattern;
      }
      while (notEOF && (isCurrentLineBlank || (matches = pattern.exec(this.currentLine)))) {
        if (isCurrentLineBlank) {
          text += this.currentLine.slice(indentation);
        } else {
          text += matches[1];
        }
        if (notEOF = this.moveToNextLine()) {
          text += "\n";
          isCurrentLineBlank = this.isCurrentLineBlank();
        }
      }
    } else if (notEOF) {
      text += "\n";
    }
    if (notEOF) {
      this.moveToPreviousLine();
    }
    if ('>' === separator) {
      newText = '';
      ref = text.split("\n");
      for (j = 0, len = ref.length; j < len; j++) {
        line = ref[j];
        if (line.length === 0 || line.charAt(0) === ' ') {
          newText = Utils.rtrim(newText, ' ') + line + "\n";
        } else {
          newText += line + ' ';
        }
      }
      text = newText;
    }
    if ('+' !== indicator) {
      text = Utils.rtrim(text);
    }
    if ('' === indicator) {
      text = this.PATTERN_TRAILING_LINES.replace(text, "\n");
    } else if ('-' === indicator) {
      text = this.PATTERN_TRAILING_LINES.replace(text, '');
    }
    return text;
  };

  Parser.prototype.isNextLineIndented = function(ignoreComments) {
    var EOF, currentIndentation, ret;
    if (ignoreComments == null) {
      ignoreComments = true;
    }
    currentIndentation = this.getCurrentLineIndentation();
    EOF = !this.moveToNextLine();
    if (ignoreComments) {
      while (!EOF && this.isCurrentLineEmpty()) {
        EOF = !this.moveToNextLine();
      }
    } else {
      while (!EOF && this.isCurrentLineBlank()) {
        EOF = !this.moveToNextLine();
      }
    }
    if (EOF) {
      return false;
    }
    ret = false;
    if (this.getCurrentLineIndentation() > currentIndentation) {
      ret = true;
    }
    this.moveToPreviousLine();
    return ret;
  };

  Parser.prototype.isCurrentLineEmpty = function() {
    var trimmedLine;
    trimmedLine = Utils.trim(this.currentLine, ' ');
    return trimmedLine.length === 0 || trimmedLine.charAt(0) === '#';
  };

  Parser.prototype.isCurrentLineBlank = function() {
    return '' === Utils.trim(this.currentLine, ' ');
  };

  Parser.prototype.isCurrentLineComment = function() {
    var ltrimmedLine;
    ltrimmedLine = Utils.ltrim(this.currentLine, ' ');
    return ltrimmedLine.charAt(0) === '#';
  };

  Parser.prototype.cleanup = function(value) {
    var count, i, indent, j, l, len, len1, line, lines, ref, ref1, ref2, smallestIndent, trimmedValue;
    if (value.indexOf("\r") !== -1) {
      value = value.split("\r\n").join("\n").split("\r").join("\n");
    }
    count = 0;
    ref = this.PATTERN_YAML_HEADER.replaceAll(value, ''), value = ref[0], count = ref[1];
    this.offset += count;
    ref1 = this.PATTERN_LEADING_COMMENTS.replaceAll(value, '', 1), trimmedValue = ref1[0], count = ref1[1];
    if (count === 1) {
      this.offset += Utils.subStrCount(value, "\n") - Utils.subStrCount(trimmedValue, "\n");
      value = trimmedValue;
    }
    ref2 = this.PATTERN_DOCUMENT_MARKER_START.replaceAll(value, '', 1), trimmedValue = ref2[0], count = ref2[1];
    if (count === 1) {
      this.offset += Utils.subStrCount(value, "\n") - Utils.subStrCount(trimmedValue, "\n");
      value = trimmedValue;
      value = this.PATTERN_DOCUMENT_MARKER_END.replace(value, '');
    }
    lines = value.split("\n");
    smallestIndent = -1;
    for (j = 0, len = lines.length; j < len; j++) {
      line = lines[j];
      if (Utils.trim(line, ' ').length === 0) {
        continue;
      }
      indent = line.length - Utils.ltrim(line).length;
      if (smallestIndent === -1 || indent < smallestIndent) {
        smallestIndent = indent;
      }
    }
    if (smallestIndent > 0) {
      for (i = l = 0, len1 = lines.length; l < len1; i = ++l) {
        line = lines[i];
        lines[i] = line.slice(smallestIndent);
      }
      value = lines.join("\n");
    }
    return value;
  };

  Parser.prototype.isNextLineUnIndentedCollection = function(currentIndentation) {
    var notEOF, ret;
    if (currentIndentation == null) {
      currentIndentation = null;
    }
    if (currentIndentation == null) {
      currentIndentation = this.getCurrentLineIndentation();
    }
    notEOF = this.moveToNextLine();
    while (notEOF && this.isCurrentLineEmpty()) {
      notEOF = this.moveToNextLine();
    }
    if (false === notEOF) {
      return false;
    }
    ret = false;
    if (this.getCurrentLineIndentation() === currentIndentation && this.isStringUnIndentedCollectionItem(this.currentLine)) {
      ret = true;
    }
    this.moveToPreviousLine();
    return ret;
  };

  Parser.prototype.isStringUnIndentedCollectionItem = function() {
    return this.currentLine === '-' || this.currentLine.slice(0, 2) === '- ';
  };

  return Parser;

})();

module.exports = Parser;

},{"./Exception/ParseException":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Exception/ParseException.js","./Exception/ParseMore":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Exception/ParseMore.js","./Inline":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Inline.js","./Pattern":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Pattern.js","./Utils":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Utils.js"}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Pattern.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var Pattern;

Pattern = (function() {
  Pattern.prototype.regex = null;

  Pattern.prototype.rawRegex = null;

  Pattern.prototype.cleanedRegex = null;

  Pattern.prototype.mapping = null;

  function Pattern(rawRegex, modifiers) {
    var _char, capturingBracketNumber, cleanedRegex, i, len, mapping, name, part, subChar;
    if (modifiers == null) {
      modifiers = '';
    }
    cleanedRegex = '';
    len = rawRegex.length;
    mapping = null;
    capturingBracketNumber = 0;
    i = 0;
    while (i < len) {
      _char = rawRegex.charAt(i);
      if (_char === '\\') {
        cleanedRegex += rawRegex.slice(i, +(i + 1) + 1 || 9e9);
        i++;
      } else if (_char === '(') {
        if (i < len - 2) {
          part = rawRegex.slice(i, +(i + 2) + 1 || 9e9);
          if (part === '(?:') {
            i += 2;
            cleanedRegex += part;
          } else if (part === '(?<') {
            capturingBracketNumber++;
            i += 2;
            name = '';
            while (i + 1 < len) {
              subChar = rawRegex.charAt(i + 1);
              if (subChar === '>') {
                cleanedRegex += '(';
                i++;
                if (name.length > 0) {
                  if (mapping == null) {
                    mapping = {};
                  }
                  mapping[name] = capturingBracketNumber;
                }
                break;
              } else {
                name += subChar;
              }
              i++;
            }
          } else {
            cleanedRegex += _char;
            capturingBracketNumber++;
          }
        } else {
          cleanedRegex += _char;
        }
      } else {
        cleanedRegex += _char;
      }
      i++;
    }
    this.rawRegex = rawRegex;
    this.cleanedRegex = cleanedRegex;
    this.regex = new RegExp(this.cleanedRegex, 'g' + modifiers.replace('g', ''));
    this.mapping = mapping;
  }

  Pattern.prototype.exec = function(str) {
    var index, matches, name, ref;
    this.regex.lastIndex = 0;
    matches = this.regex.exec(str);
    if (matches == null) {
      return null;
    }
    if (this.mapping != null) {
      ref = this.mapping;
      for (name in ref) {
        index = ref[name];
        matches[name] = matches[index];
      }
    }
    return matches;
  };

  Pattern.prototype.test = function(str) {
    this.regex.lastIndex = 0;
    return this.regex.test(str);
  };

  Pattern.prototype.replace = function(str, replacement) {
    this.regex.lastIndex = 0;
    return str.replace(this.regex, replacement);
  };

  Pattern.prototype.replaceAll = function(str, replacement, limit) {
    var count;
    if (limit == null) {
      limit = 0;
    }
    this.regex.lastIndex = 0;
    count = 0;
    while (this.regex.test(str) && (limit === 0 || count < limit)) {
      this.regex.lastIndex = 0;
      str = str.replace(this.regex, replacement);
      count++;
    }
    return [str, count];
  };

  return Pattern;

})();

module.exports = Pattern;

},{}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Unescaper.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var Pattern, Unescaper, Utils;

Utils = require('./Utils');

Pattern = require('./Pattern');

Unescaper = (function() {
  function Unescaper() {}

  Unescaper.PATTERN_ESCAPED_CHARACTER = new Pattern('\\\\([0abt\tnvfre "\\/\\\\N_LP]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})');

  Unescaper.unescapeSingleQuotedString = function(value) {
    return value.replace(/\'\'/g, '\'');
  };

  Unescaper.unescapeDoubleQuotedString = function(value) {
    if (this._unescapeCallback == null) {
      this._unescapeCallback = (function(_this) {
        return function(str) {
          return _this.unescapeCharacter(str);
        };
      })(this);
    }
    return this.PATTERN_ESCAPED_CHARACTER.replace(value, this._unescapeCallback);
  };

  Unescaper.unescapeCharacter = function(value) {
    var ch;
    ch = String.fromCharCode;
    switch (value.charAt(1)) {
      case '0':
        return ch(0);
      case 'a':
        return ch(7);
      case 'b':
        return ch(8);
      case 't':
        return "\t";
      case "\t":
        return "\t";
      case 'n':
        return "\n";
      case 'v':
        return ch(11);
      case 'f':
        return ch(12);
      case 'r':
        return ch(13);
      case 'e':
        return ch(27);
      case ' ':
        return ' ';
      case '"':
        return '"';
      case '/':
        return '/';
      case '\\':
        return '\\';
      case 'N':
        return ch(0x0085);
      case '_':
        return ch(0x00A0);
      case 'L':
        return ch(0x2028);
      case 'P':
        return ch(0x2029);
      case 'x':
        return Utils.utf8chr(Utils.hexDec(value.substr(2, 2)));
      case 'u':
        return Utils.utf8chr(Utils.hexDec(value.substr(2, 4)));
      case 'U':
        return Utils.utf8chr(Utils.hexDec(value.substr(2, 8)));
      default:
        return '';
    }
  };

  return Unescaper;

})();

module.exports = Unescaper;

},{"./Pattern":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Pattern.js","./Utils":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Utils.js"}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Utils.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var Pattern, Utils,
  hasProp = {}.hasOwnProperty;

Pattern = require('./Pattern');

Utils = (function() {
  function Utils() {}

  Utils.REGEX_LEFT_TRIM_BY_CHAR = {};

  Utils.REGEX_RIGHT_TRIM_BY_CHAR = {};

  Utils.REGEX_SPACES = /\s+/g;

  Utils.REGEX_DIGITS = /^\d+$/;

  Utils.REGEX_OCTAL = /[^0-7]/gi;

  Utils.REGEX_HEXADECIMAL = /[^a-f0-9]/gi;

  Utils.PATTERN_DATE = new Pattern('^' + '(?<year>[0-9][0-9][0-9][0-9])' + '-(?<month>[0-9][0-9]?)' + '-(?<day>[0-9][0-9]?)' + '(?:(?:[Tt]|[ \t]+)' + '(?<hour>[0-9][0-9]?)' + ':(?<minute>[0-9][0-9])' + ':(?<second>[0-9][0-9])' + '(?:\.(?<fraction>[0-9]*))?' + '(?:[ \t]*(?<tz>Z|(?<tz_sign>[-+])(?<tz_hour>[0-9][0-9]?)' + '(?::(?<tz_minute>[0-9][0-9]))?))?)?' + '$', 'i');

  Utils.LOCAL_TIMEZONE_OFFSET = new Date().getTimezoneOffset() * 60 * 1000;

  Utils.trim = function(str, _char) {
    var regexLeft, regexRight;
    if (_char == null) {
      _char = '\\s';
    }
    regexLeft = this.REGEX_LEFT_TRIM_BY_CHAR[_char];
    if (regexLeft == null) {
      this.REGEX_LEFT_TRIM_BY_CHAR[_char] = regexLeft = new RegExp('^' + _char + '' + _char + '*');
    }
    regexLeft.lastIndex = 0;
    regexRight = this.REGEX_RIGHT_TRIM_BY_CHAR[_char];
    if (regexRight == null) {
      this.REGEX_RIGHT_TRIM_BY_CHAR[_char] = regexRight = new RegExp(_char + '' + _char + '*$');
    }
    regexRight.lastIndex = 0;
    return str.replace(regexLeft, '').replace(regexRight, '');
  };

  Utils.ltrim = function(str, _char) {
    var regexLeft;
    if (_char == null) {
      _char = '\\s';
    }
    regexLeft = this.REGEX_LEFT_TRIM_BY_CHAR[_char];
    if (regexLeft == null) {
      this.REGEX_LEFT_TRIM_BY_CHAR[_char] = regexLeft = new RegExp('^' + _char + '' + _char + '*');
    }
    regexLeft.lastIndex = 0;
    return str.replace(regexLeft, '');
  };

  Utils.rtrim = function(str, _char) {
    var regexRight;
    if (_char == null) {
      _char = '\\s';
    }
    regexRight = this.REGEX_RIGHT_TRIM_BY_CHAR[_char];
    if (regexRight == null) {
      this.REGEX_RIGHT_TRIM_BY_CHAR[_char] = regexRight = new RegExp(_char + '' + _char + '*$');
    }
    regexRight.lastIndex = 0;
    return str.replace(regexRight, '');
  };

  Utils.isEmpty = function(value) {
    return !value || value === '' || value === '0' || (value instanceof Array && value.length === 0) || this.isEmptyObject(value);
  };

  Utils.isEmptyObject = function(value) {
    var k;
    return value instanceof Object && ((function() {
      var results;
      results = [];
      for (k in value) {
        if (!hasProp.call(value, k)) continue;
        results.push(k);
      }
      return results;
    })()).length === 0;
  };

  Utils.subStrCount = function(string, subString, start, length) {
    var c, i, j, len, ref, sublen;
    c = 0;
    string = '' + string;
    subString = '' + subString;
    if (start != null) {
      string = string.slice(start);
    }
    if (length != null) {
      string = string.slice(0, length);
    }
    len = string.length;
    sublen = subString.length;
    for (i = j = 0, ref = len; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
      if (subString === string.slice(i, sublen)) {
        c++;
        i += sublen - 1;
      }
    }
    return c;
  };

  Utils.isDigits = function(input) {
    this.REGEX_DIGITS.lastIndex = 0;
    return this.REGEX_DIGITS.test(input);
  };

  Utils.octDec = function(input) {
    this.REGEX_OCTAL.lastIndex = 0;
    return parseInt((input + '').replace(this.REGEX_OCTAL, ''), 8);
  };

  Utils.hexDec = function(input) {
    this.REGEX_HEXADECIMAL.lastIndex = 0;
    input = this.trim(input);
    if ((input + '').slice(0, 2) === '0x') {
      input = (input + '').slice(2);
    }
    return parseInt((input + '').replace(this.REGEX_HEXADECIMAL, ''), 16);
  };

  Utils.utf8chr = function(c) {
    var ch;
    ch = String.fromCharCode;
    if (0x80 > (c %= 0x200000)) {
      return ch(c);
    }
    if (0x800 > c) {
      return ch(0xC0 | c >> 6) + ch(0x80 | c & 0x3F);
    }
    if (0x10000 > c) {
      return ch(0xE0 | c >> 12) + ch(0x80 | c >> 6 & 0x3F) + ch(0x80 | c & 0x3F);
    }
    return ch(0xF0 | c >> 18) + ch(0x80 | c >> 12 & 0x3F) + ch(0x80 | c >> 6 & 0x3F) + ch(0x80 | c & 0x3F);
  };

  Utils.parseBoolean = function(input, strict) {
    var lowerInput;
    if (strict == null) {
      strict = true;
    }
    if (typeof input === 'string') {
      lowerInput = input.toLowerCase();
      if (!strict) {
        if (lowerInput === 'no') {
          return false;
        }
      }
      if (lowerInput === '0') {
        return false;
      }
      if (lowerInput === 'false') {
        return false;
      }
      if (lowerInput === '') {
        return false;
      }
      return true;
    }
    return !!input;
  };

  Utils.isNumeric = function(input) {
    this.REGEX_SPACES.lastIndex = 0;
    return typeof input === 'number' || typeof input === 'string' && !isNaN(input) && input.replace(this.REGEX_SPACES, '') !== '';
  };

  Utils.stringToDate = function(str) {
    var date, day, fraction, hour, info, minute, month, second, tz_hour, tz_minute, tz_offset, year;
    if (!(str != null ? str.length : void 0)) {
      return null;
    }
    info = this.PATTERN_DATE.exec(str);
    if (!info) {
      return null;
    }
    year = parseInt(info.year, 10);
    month = parseInt(info.month, 10) - 1;
    day = parseInt(info.day, 10);
    if (info.hour == null) {
      date = new Date(Date.UTC(year, month, day));
      return date;
    }
    hour = parseInt(info.hour, 10);
    minute = parseInt(info.minute, 10);
    second = parseInt(info.second, 10);
    if (info.fraction != null) {
      fraction = info.fraction.slice(0, 3);
      while (fraction.length < 3) {
        fraction += '0';
      }
      fraction = parseInt(fraction, 10);
    } else {
      fraction = 0;
    }
    if (info.tz != null) {
      tz_hour = parseInt(info.tz_hour, 10);
      if (info.tz_minute != null) {
        tz_minute = parseInt(info.tz_minute, 10);
      } else {
        tz_minute = 0;
      }
      tz_offset = (tz_hour * 60 + tz_minute) * 60000;
      if ('-' === info.tz_sign) {
        tz_offset *= -1;
      }
    }
    date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
    if (tz_offset) {
      date.setTime(date.getTime() - tz_offset);
    }
    return date;
  };

  Utils.strRepeat = function(str, number) {
    var i, res;
    res = '';
    i = 0;
    while (i < number) {
      res += str;
      i++;
    }
    return res;
  };

  Utils.getStringFromFile = function(path, callback) {
    var data, fs, j, len1, name, ref, req, xhr;
    if (callback == null) {
      callback = null;
    }
    xhr = null;
    if (typeof window !== "undefined" && window !== null) {
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        ref = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          name = ref[j];
          try {
            xhr = new ActiveXObject(name);
          } catch (error) {}
        }
      }
    }
    if (xhr != null) {
      if (callback != null) {
        xhr.onreadystatechange = function() {
          if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status === 0) {
              return callback(xhr.responseText);
            } else {
              return callback(null);
            }
          }
        };
        xhr.open('GET', path, true);
        return xhr.send(null);
      } else {
        xhr.open('GET', path, false);
        xhr.send(null);
        if (xhr.status === 200 || xhr.status === 0) {
          return xhr.responseText;
        }
        return null;
      }
    } else {
      req = require;
      fs = req('fs');
      if (callback != null) {
        return fs.readFile(path, function(err, data) {
          if (err) {
            return callback(null);
          } else {
            return callback(String(data));
          }
        });
      } else {
        data = fs.readFileSync(path);
        if (data != null) {
          return String(data);
        }
        return null;
      }
    }
  };

  return Utils;

})();

module.exports = Utils;

},{"./Pattern":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Pattern.js"}],"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Yaml.js":[function(require,module,exports){
// Generated by CoffeeScript 1.12.4
var Dumper, Parser, Utils, Yaml;

Parser = require('./Parser');

Dumper = require('./Dumper');

Utils = require('./Utils');

Yaml = (function() {
  function Yaml() {}

  Yaml.parse = function(input, exceptionOnInvalidType, objectDecoder) {
    if (exceptionOnInvalidType == null) {
      exceptionOnInvalidType = false;
    }
    if (objectDecoder == null) {
      objectDecoder = null;
    }
    return new Parser().parse(input, exceptionOnInvalidType, objectDecoder);
  };

  Yaml.parseFile = function(path, callback, exceptionOnInvalidType, objectDecoder) {
    var input;
    if (callback == null) {
      callback = null;
    }
    if (exceptionOnInvalidType == null) {
      exceptionOnInvalidType = false;
    }
    if (objectDecoder == null) {
      objectDecoder = null;
    }
    if (callback != null) {
      return Utils.getStringFromFile(path, (function(_this) {
        return function(input) {
          var result;
          result = null;
          if (input != null) {
            result = _this.parse(input, exceptionOnInvalidType, objectDecoder);
          }
          callback(result);
        };
      })(this));
    } else {
      input = Utils.getStringFromFile(path);
      if (input != null) {
        return this.parse(input, exceptionOnInvalidType, objectDecoder);
      }
      return null;
    }
  };

  Yaml.dump = function(input, inline, indent, exceptionOnInvalidType, objectEncoder) {
    var yaml;
    if (inline == null) {
      inline = 2;
    }
    if (indent == null) {
      indent = 4;
    }
    if (exceptionOnInvalidType == null) {
      exceptionOnInvalidType = false;
    }
    if (objectEncoder == null) {
      objectEncoder = null;
    }
    yaml = new Dumper();
    yaml.indentation = indent;
    return yaml.dump(input, inline, 0, exceptionOnInvalidType, objectEncoder);
  };

  Yaml.stringify = function(input, inline, indent, exceptionOnInvalidType, objectEncoder) {
    return this.dump(input, inline, indent, exceptionOnInvalidType, objectEncoder);
  };

  Yaml.load = function(path, callback, exceptionOnInvalidType, objectDecoder) {
    return this.parseFile(path, callback, exceptionOnInvalidType, objectDecoder);
  };

  return Yaml;

})();

if (typeof window !== "undefined" && window !== null) {
  window.YAML = Yaml;
}

if (typeof window === "undefined" || window === null) {
  this.YAML = Yaml;
}

module.exports = Yaml;

},{"./Dumper":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Dumper.js","./Parser":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Parser.js","./Utils":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Utils.js"}],"/Users/kelly.selden/code/tree-shaking/travis-web/tmp/core_object-input_staging-Sya2o8XW.tmp/browserify_stubs.js":[function(require,module,exports){
define('npm:ansiparse', function(){ return { 'default': require('ansiparse')};})
define('npm:lodash.intersection', function(){ return { 'default': require('lodash.intersection')};})
define('npm:lodash.pickby', function(){ return { 'default': require('lodash.pickby')};})
define('npm:visibilityjs', function(){ return { 'default': require('visibilityjs')};})
define('npm:yamljs', function(){ return { 'default': require('yamljs')};})
},{"ansiparse":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/ansiparse/lib/ansiparse.js","lodash.intersection":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/lodash.intersection/index.js","lodash.pickby":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/lodash.pickby/index.js","visibilityjs":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/visibilityjs/index.js","yamljs":"/Users/kelly.selden/code/tree-shaking/travis-web/node_modules/yamljs/lib/Yaml.js"}]},{},["/Users/kelly.selden/code/tree-shaking/travis-web/tmp/core_object-input_staging-Sya2o8XW.tmp/browserify_stubs.js"]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvYW5zaXBhcnNlL2xpYi9hbnNpcGFyc2UuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMvbG9kYXNoLmludGVyc2VjdGlvbi9pbmRleC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9sb2Rhc2gucGlja2J5L2luZGV4LmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3Zpc2liaWxpdHlqcy9pbmRleC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy92aXNpYmlsaXR5anMvbGliL3Zpc2liaWxpdHkuY29yZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy92aXNpYmlsaXR5anMvbGliL3Zpc2liaWxpdHkudGltZXJzLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3lhbWxqcy9saWIvRHVtcGVyLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3lhbWxqcy9saWIvRXNjYXBlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy95YW1sanMvbGliL0V4Y2VwdGlvbi9EdW1wRXhjZXB0aW9uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3lhbWxqcy9saWIvRXhjZXB0aW9uL1BhcnNlRXhjZXB0aW9uLmpzIiwiLi4vLi4vbm9kZV9tb2R1bGVzL3lhbWxqcy9saWIvRXhjZXB0aW9uL1BhcnNlTW9yZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy95YW1sanMvbGliL0lubGluZS5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy95YW1sanMvbGliL1BhcnNlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy95YW1sanMvbGliL1BhdHRlcm4uanMiLCIuLi8uLi9ub2RlX21vZHVsZXMveWFtbGpzL2xpYi9VbmVzY2FwZXIuanMiLCIuLi8uLi9ub2RlX21vZHVsZXMveWFtbGpzL2xpYi9VdGlscy5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy95YW1sanMvbGliL1lhbWwuanMiLCJicm93c2VyaWZ5X3N0dWJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDeExBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3ppQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDcjJFQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyZUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIGFuc2lwYXJzZShzdHIpIHtcbiAgLy9cbiAgLy8gSSdtIHRlcnJpYmxlIGF0IHdyaXRpbmcgcGFyc2Vycy5cbiAgLy9cbiAgdmFyIG1hdGNoaW5nQ29udHJvbCA9IG51bGwsXG4gICAgICBtYXRjaGluZ0RhdGEgPSBudWxsLFxuICAgICAgbWF0Y2hpbmdUZXh0ID0gJycsXG4gICAgICBhbnNpU3RhdGUgPSBbXSxcbiAgICAgIHJlc3VsdCA9IFtdLFxuICAgICAgc3RhdGUgPSB7fSxcbiAgICAgIGVyYXNlQ2hhcjtcblxuICAvL1xuICAvLyBHZW5lcmFsIHdvcmtmbG93IGZvciB0aGlzIHRoaW5nIGlzOlxuICAvLyBcXDAzM1xcWzMzbVRleHRcbiAgLy8gfCAgICAgfCAgfFxuICAvLyB8ICAgICB8ICBtYXRjaGluZ1RleHRcbiAgLy8gfCAgICAgbWF0Y2hpbmdEYXRhXG4gIC8vIG1hdGNoaW5nQ29udHJvbFxuICAvL1xuICAvLyBJbiBmdXJ0aGVyIHN0ZXBzIHdlIGhvcGUgaXQncyBhbGwgZ29pbmcgdG8gYmUgZmluZS4gSXQgdXN1YWxseSBpcy5cbiAgLy9cblxuICAvL1xuICAvLyBFcmFzZXMgYSBjaGFyIGZyb20gdGhlIG91dHB1dFxuICAvL1xuICBlcmFzZUNoYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGluZGV4LCB0ZXh0O1xuICAgIGlmIChtYXRjaGluZ1RleHQubGVuZ3RoKSB7XG4gICAgICBtYXRjaGluZ1RleHQgPSBtYXRjaGluZ1RleHQuc3Vic3RyKDAsIG1hdGNoaW5nVGV4dC5sZW5ndGggLSAxKTtcbiAgICB9XG4gICAgZWxzZSBpZiAocmVzdWx0Lmxlbmd0aCkge1xuICAgICAgaW5kZXggPSByZXN1bHQubGVuZ3RoIC0gMTtcbiAgICAgIHRleHQgPSByZXN1bHRbaW5kZXhdLnRleHQ7XG4gICAgICBpZiAodGV4dC5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gQSByZXN1bHQgYml0IHdhcyBmdWxseSBkZWxldGVkLCBwb3AgaXQgb3V0IHRvIHNpbXBsaWZ5IHRoZSBmaW5hbCBvdXRwdXRcbiAgICAgICAgLy9cbiAgICAgICAgcmVzdWx0LnBvcCgpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHJlc3VsdFtpbmRleF0udGV4dCA9IHRleHQuc3Vic3RyKDAsIHRleHQubGVuZ3RoIC0gMSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKG1hdGNoaW5nQ29udHJvbCAhPSBudWxsKSB7XG4gICAgICBpZiAobWF0Y2hpbmdDb250cm9sID09ICdcXDAzMycgJiYgc3RyW2ldID09ICdcXFsnKSB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIFdlJ3ZlIG1hdGNoZWQgZnVsbCBjb250cm9sIGNvZGUuIExldHMgc3RhcnQgbWF0Y2hpbmcgZm9ybWF0aW5nIGRhdGEuXG4gICAgICAgIC8vXG5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gXCJlbWl0XCIgbWF0Y2hlZCB0ZXh0IHdpdGggY29ycmVjdCBzdGF0ZVxuICAgICAgICAvL1xuICAgICAgICBpZiAobWF0Y2hpbmdUZXh0KSB7XG4gICAgICAgICAgc3RhdGUudGV4dCA9IG1hdGNoaW5nVGV4dDtcbiAgICAgICAgICByZXN1bHQucHVzaChzdGF0ZSk7XG4gICAgICAgICAgc3RhdGUgPSB7fTtcbiAgICAgICAgICBtYXRjaGluZ1RleHQgPSBcIlwiO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF0Y2hpbmdDb250cm9sID0gbnVsbDtcbiAgICAgICAgbWF0Y2hpbmdEYXRhID0gJyc7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gV2UgZmFpbGVkIHRvIG1hdGNoIGFueXRoaW5nIC0gbW9zdCBsaWtlbHkgYSBiYWQgY29udHJvbCBjb2RlLiBXZVxuICAgICAgICAvLyBnbyBiYWNrIHRvIG1hdGNoaW5nIHJlZ3VsYXIgc3RyaW5ncy5cbiAgICAgICAgLy9cbiAgICAgICAgbWF0Y2hpbmdUZXh0ICs9IG1hdGNoaW5nQ29udHJvbCArIHN0cltpXTtcbiAgICAgICAgbWF0Y2hpbmdDb250cm9sID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBlbHNlIGlmIChtYXRjaGluZ0RhdGEgIT0gbnVsbCkge1xuICAgICAgaWYgKHN0cltpXSA9PSAnOycpIHtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gYDtgIHNlcGFyYXRlcyBtYW55IGZvcm1hdHRpbmcgY29kZXMsIGZvciBleGFtcGxlOiBgXFwwMzNbMzM7NDNtYFxuICAgICAgICAvLyBtZWFucyB0aGF0IGJvdGggYDMzYCBhbmQgYDQzYCBzaG91bGQgYmUgYXBwbGllZC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gVE9ETzogdGhpcyBjYW4gYmUgc2ltcGxpZmllZCBieSBtb2RpZnlpbmcgc3RhdGUgaGVyZS5cbiAgICAgICAgLy9cbiAgICAgICAgYW5zaVN0YXRlLnB1c2gobWF0Y2hpbmdEYXRhKTtcbiAgICAgICAgbWF0Y2hpbmdEYXRhID0gJyc7XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChzdHJbaV0gPT0gJ20nKSB7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIGBtYCBmaW5pc2hlZCB3aG9sZSBmb3JtYXR0aW5nIGNvZGUuIFdlIGNhbiBwcm9jZWVkIHRvIG1hdGNoaW5nXG4gICAgICAgIC8vIGZvcm1hdHRlZCB0ZXh0LlxuICAgICAgICAvL1xuICAgICAgICBhbnNpU3RhdGUucHVzaChtYXRjaGluZ0RhdGEpO1xuICAgICAgICBtYXRjaGluZ0RhdGEgPSBudWxsO1xuICAgICAgICBtYXRjaGluZ1RleHQgPSAnJztcblxuICAgICAgICAvL1xuICAgICAgICAvLyBDb252ZXJ0IG1hdGNoZWQgZm9ybWF0dGluZyBkYXRhIGludG8gdXNlci1mcmllbmRseSBzdGF0ZSBvYmplY3QuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFRPRE86IERSWS5cbiAgICAgICAgLy9cbiAgICAgICAgYW5zaVN0YXRlLmZvckVhY2goZnVuY3Rpb24gKGFuc2lDb2RlKSB7XG4gICAgICAgICAgaWYgKGFuc2lwYXJzZS5mb3JlZ3JvdW5kQ29sb3JzW2Fuc2lDb2RlXSkge1xuICAgICAgICAgICAgc3RhdGUuZm9yZWdyb3VuZCA9IGFuc2lwYXJzZS5mb3JlZ3JvdW5kQ29sb3JzW2Fuc2lDb2RlXTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoYW5zaXBhcnNlLmJhY2tncm91bmRDb2xvcnNbYW5zaUNvZGVdKSB7XG4gICAgICAgICAgICBzdGF0ZS5iYWNrZ3JvdW5kID0gYW5zaXBhcnNlLmJhY2tncm91bmRDb2xvcnNbYW5zaUNvZGVdO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChhbnNpQ29kZSA9PSAzOSkge1xuICAgICAgICAgICAgZGVsZXRlIHN0YXRlLmZvcmVncm91bmQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGFuc2lDb2RlID09IDQ5KSB7XG4gICAgICAgICAgICBkZWxldGUgc3RhdGUuYmFja2dyb3VuZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoYW5zaXBhcnNlLnN0eWxlc1thbnNpQ29kZV0pIHtcbiAgICAgICAgICAgIHN0YXRlW2Fuc2lwYXJzZS5zdHlsZXNbYW5zaUNvZGVdXSA9IHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGFuc2lDb2RlID09IDIyKSB7XG4gICAgICAgICAgICBzdGF0ZS5ib2xkID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGFuc2lDb2RlID09IDIzKSB7XG4gICAgICAgICAgICBzdGF0ZS5pdGFsaWMgPSBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSBpZiAoYW5zaUNvZGUgPT0gMjQpIHtcbiAgICAgICAgICAgIHN0YXRlLnVuZGVybGluZSA9IGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGFuc2lTdGF0ZSA9IFtdO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIG1hdGNoaW5nRGF0YSArPSBzdHJbaV07XG4gICAgICB9XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoc3RyW2ldID09ICdcXDAzMycpIHtcbiAgICAgIG1hdGNoaW5nQ29udHJvbCA9IHN0cltpXTtcbiAgICB9XG4gICAgZWxzZSBpZiAoc3RyW2ldID09ICdcXHUwMDA4Jykge1xuICAgICAgZXJhc2VDaGFyKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgbWF0Y2hpbmdUZXh0ICs9IHN0cltpXTtcbiAgICB9XG4gIH1cblxuICBpZiAobWF0Y2hpbmdUZXh0KSB7XG4gICAgc3RhdGUudGV4dCA9IG1hdGNoaW5nVGV4dCArIChtYXRjaGluZ0NvbnRyb2wgPyBtYXRjaGluZ0NvbnRyb2wgOiAnJyk7XG4gICAgcmVzdWx0LnB1c2goc3RhdGUpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmFuc2lwYXJzZS5mb3JlZ3JvdW5kQ29sb3JzID0ge1xuICAnMzAnOiAnYmxhY2snLFxuICAnMzEnOiAncmVkJyxcbiAgJzMyJzogJ2dyZWVuJyxcbiAgJzMzJzogJ3llbGxvdycsXG4gICczNCc6ICdibHVlJyxcbiAgJzM1JzogJ21hZ2VudGEnLFxuICAnMzYnOiAnY3lhbicsXG4gICczNyc6ICd3aGl0ZScsXG4gICc5MCc6ICdncmV5J1xufTtcblxuYW5zaXBhcnNlLmJhY2tncm91bmRDb2xvcnMgPSB7XG4gICc0MCc6ICdibGFjaycsXG4gICc0MSc6ICdyZWQnLFxuICAnNDInOiAnZ3JlZW4nLFxuICAnNDMnOiAneWVsbG93JyxcbiAgJzQ0JzogJ2JsdWUnLFxuICAnNDUnOiAnbWFnZW50YScsXG4gICc0Nic6ICdjeWFuJyxcbiAgJzQ3JzogJ3doaXRlJ1xufTtcblxuYW5zaXBhcnNlLnN0eWxlcyA9IHtcbiAgJzEnOiAnYm9sZCcsXG4gICczJzogJ2l0YWxpYycsXG4gICc0JzogJ3VuZGVybGluZSdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gYW5zaXBhcnNlO1xuXG4iLCIvKipcbiAqIGxvZGFzaCAoQ3VzdG9tIEJ1aWxkKSA8aHR0cHM6Ly9sb2Rhc2guY29tLz5cbiAqIEJ1aWxkOiBgbG9kYXNoIG1vZHVsYXJpemUgZXhwb3J0cz1cIm5wbVwiIC1vIC4vYFxuICogQ29weXJpZ2h0IGpRdWVyeSBGb3VuZGF0aW9uIGFuZCBvdGhlciBjb250cmlidXRvcnMgPGh0dHBzOi8vanF1ZXJ5Lm9yZy8+XG4gKiBSZWxlYXNlZCB1bmRlciBNSVQgbGljZW5zZSA8aHR0cHM6Ly9sb2Rhc2guY29tL2xpY2Vuc2U+XG4gKiBCYXNlZCBvbiBVbmRlcnNjb3JlLmpzIDEuOC4zIDxodHRwOi8vdW5kZXJzY29yZWpzLm9yZy9MSUNFTlNFPlxuICogQ29weXJpZ2h0IEplcmVteSBBc2hrZW5hcywgRG9jdW1lbnRDbG91ZCBhbmQgSW52ZXN0aWdhdGl2ZSBSZXBvcnRlcnMgJiBFZGl0b3JzXG4gKi9cblxuLyoqIFVzZWQgdG8gc3RhbmQtaW4gZm9yIGB1bmRlZmluZWRgIGhhc2ggdmFsdWVzLiAqL1xudmFyIEhBU0hfVU5ERUZJTkVEID0gJ19fbG9kYXNoX2hhc2hfdW5kZWZpbmVkX18nO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGZ1bmNUYWcgPSAnW29iamVjdCBGdW5jdGlvbl0nLFxuICAgIGdlblRhZyA9ICdbb2JqZWN0IEdlbmVyYXRvckZ1bmN0aW9uXSc7XG5cbi8qKlxuICogVXNlZCB0byBtYXRjaCBgUmVnRXhwYFxuICogW3N5bnRheCBjaGFyYWN0ZXJzXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wYXR0ZXJucykuXG4gKi9cbnZhciByZVJlZ0V4cENoYXIgPSAvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYHNlbGZgLiAqL1xudmFyIGZyZWVTZWxmID0gdHlwZW9mIHNlbGYgPT0gJ29iamVjdCcgJiYgc2VsZiAmJiBzZWxmLk9iamVjdCA9PT0gT2JqZWN0ICYmIHNlbGY7XG5cbi8qKiBVc2VkIGFzIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWwgb2JqZWN0LiAqL1xudmFyIHJvb3QgPSBmcmVlR2xvYmFsIHx8IGZyZWVTZWxmIHx8IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cbi8qKlxuICogQSBmYXN0ZXIgYWx0ZXJuYXRpdmUgdG8gYEZ1bmN0aW9uI2FwcGx5YCwgdGhpcyBmdW5jdGlvbiBpbnZva2VzIGBmdW5jYFxuICogd2l0aCB0aGUgYHRoaXNgIGJpbmRpbmcgb2YgYHRoaXNBcmdgIGFuZCB0aGUgYXJndW1lbnRzIG9mIGBhcmdzYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaW52b2tlLlxuICogQHBhcmFtIHsqfSB0aGlzQXJnIFRoZSBgdGhpc2AgYmluZGluZyBvZiBgZnVuY2AuXG4gKiBAcGFyYW0ge0FycmF5fSBhcmdzIFRoZSBhcmd1bWVudHMgdG8gaW52b2tlIGBmdW5jYCB3aXRoLlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHJlc3VsdCBvZiBgZnVuY2AuXG4gKi9cbmZ1bmN0aW9uIGFwcGx5KGZ1bmMsIHRoaXNBcmcsIGFyZ3MpIHtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnKTtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jLmNhbGwodGhpc0FyZywgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuYy5jYWxsKHRoaXNBcmcsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmMuY2FsbCh0aGlzQXJnLCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgfVxuICByZXR1cm4gZnVuYy5hcHBseSh0aGlzQXJnLCBhcmdzKTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uaW5jbHVkZXNgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvclxuICogc3BlY2lmeWluZyBhbiBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB0YXJnZXRgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXMoYXJyYXksIHZhbHVlKSB7XG4gIHZhciBsZW5ndGggPSBhcnJheSA/IGFycmF5Lmxlbmd0aCA6IDA7XG4gIHJldHVybiAhIWxlbmd0aCAmJiBiYXNlSW5kZXhPZihhcnJheSwgdmFsdWUsIDApID4gLTE7XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlIGBhcnJheUluY2x1ZGVzYCBleGNlcHQgdGhhdCBpdCBhY2NlcHRzIGEgY29tcGFyYXRvci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdGFyZ2V0IFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGFyYXRvciBUaGUgY29tcGFyYXRvciBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB0YXJnZXRgIGlzIGZvdW5kLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5SW5jbHVkZXNXaXRoKGFycmF5LCB2YWx1ZSwgY29tcGFyYXRvcikge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGFycmF5ID8gYXJyYXkubGVuZ3RoIDogMDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIGlmIChjb21wYXJhdG9yKHZhbHVlLCBhcnJheVtpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgXy5tYXBgIGZvciBhcnJheXMgd2l0aG91dCBzdXBwb3J0IGZvciBpdGVyYXRlZVxuICogc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gW2FycmF5XSBUaGUgYXJyYXkgdG8gaXRlcmF0ZSBvdmVyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaXRlcmF0ZWUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IG1hcHBlZCBhcnJheS5cbiAqL1xuZnVuY3Rpb24gYXJyYXlNYXAoYXJyYXksIGl0ZXJhdGVlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwLFxuICAgICAgcmVzdWx0ID0gQXJyYXkobGVuZ3RoKTtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHJlc3VsdFtpbmRleF0gPSBpdGVyYXRlZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5maW5kSW5kZXhgIGFuZCBgXy5maW5kTGFzdEluZGV4YCB3aXRob3V0XG4gKiBzdXBwb3J0IGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHBhcmFtIHtudW1iZXJ9IGZyb21JbmRleCBUaGUgaW5kZXggdG8gc2VhcmNoIGZyb20uXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmcm9tUmlnaHRdIFNwZWNpZnkgaXRlcmF0aW5nIGZyb20gcmlnaHQgdG8gbGVmdC5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VGaW5kSW5kZXgoYXJyYXksIHByZWRpY2F0ZSwgZnJvbUluZGV4LCBmcm9tUmlnaHQpIHtcbiAgdmFyIGxlbmd0aCA9IGFycmF5Lmxlbmd0aCxcbiAgICAgIGluZGV4ID0gZnJvbUluZGV4ICsgKGZyb21SaWdodCA/IDEgOiAtMSk7XG5cbiAgd2hpbGUgKChmcm9tUmlnaHQgPyBpbmRleC0tIDogKytpbmRleCA8IGxlbmd0aCkpIHtcbiAgICBpZiAocHJlZGljYXRlKGFycmF5W2luZGV4XSwgaW5kZXgsIGFycmF5KSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaW5kZXhPZmAgd2l0aG91dCBgZnJvbUluZGV4YCBib3VuZHMgY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gaW5zcGVjdC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNlYXJjaCBmb3IuXG4gKiBAcGFyYW0ge251bWJlcn0gZnJvbUluZGV4IFRoZSBpbmRleCB0byBzZWFyY2ggZnJvbS5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIGluZGV4IG9mIHRoZSBtYXRjaGVkIHZhbHVlLCBlbHNlIGAtMWAuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJbmRleE9mKGFycmF5LCB2YWx1ZSwgZnJvbUluZGV4KSB7XG4gIGlmICh2YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICByZXR1cm4gYmFzZUZpbmRJbmRleChhcnJheSwgYmFzZUlzTmFOLCBmcm9tSW5kZXgpO1xuICB9XG4gIHZhciBpbmRleCA9IGZyb21JbmRleCAtIDEsXG4gICAgICBsZW5ndGggPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBpZiAoYXJyYXlbaW5kZXhdID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYU5gIHdpdGhvdXQgc3VwcG9ydCBmb3IgbnVtYmVyIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYE5hTmAsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmFOKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBjYWNoZSB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gY2FjaGUgVGhlIGNhY2hlIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGNhY2hlSGFzKGNhY2hlLCBrZXkpIHtcbiAgcmV0dXJuIGNhY2hlLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIHByb3BlcnR5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBnZXRWYWx1ZShvYmplY3QsIGtleSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB1bmRlZmluZWQgOiBvYmplY3Rba2V5XTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhIGhvc3Qgb2JqZWN0IGluIElFIDwgOS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGhvc3Qgb2JqZWN0LCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGlzSG9zdE9iamVjdCh2YWx1ZSkge1xuICAvLyBNYW55IGhvc3Qgb2JqZWN0cyBhcmUgYE9iamVjdGAgb2JqZWN0cyB0aGF0IGNhbiBjb2VyY2UgdG8gc3RyaW5nc1xuICAvLyBkZXNwaXRlIGhhdmluZyBpbXByb3Blcmx5IGRlZmluZWQgYHRvU3RyaW5nYCBtZXRob2RzLlxuICB2YXIgcmVzdWx0ID0gZmFsc2U7XG4gIGlmICh2YWx1ZSAhPSBudWxsICYmIHR5cGVvZiB2YWx1ZS50b1N0cmluZyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9ICEhKHZhbHVlICsgJycpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIGFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGUsXG4gICAgZnVuY1Byb3RvID0gRnVuY3Rpb24ucHJvdG90eXBlLFxuICAgIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG92ZXJyZWFjaGluZyBjb3JlLWpzIHNoaW1zLiAqL1xudmFyIGNvcmVKc0RhdGEgPSByb290WydfX2NvcmUtanNfc2hhcmVkX18nXTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1ldGhvZHMgbWFzcXVlcmFkaW5nIGFzIG5hdGl2ZS4gKi9cbnZhciBtYXNrU3JjS2V5ID0gKGZ1bmN0aW9uKCkge1xuICB2YXIgdWlkID0gL1teLl0rJC8uZXhlYyhjb3JlSnNEYXRhICYmIGNvcmVKc0RhdGEua2V5cyAmJiBjb3JlSnNEYXRhLmtleXMuSUVfUFJPVE8gfHwgJycpO1xuICByZXR1cm4gdWlkID8gKCdTeW1ib2woc3JjKV8xLicgKyB1aWQpIDogJyc7XG59KCkpO1xuXG4vKiogVXNlZCB0byByZXNvbHZlIHRoZSBkZWNvbXBpbGVkIHNvdXJjZSBvZiBmdW5jdGlvbnMuICovXG52YXIgZnVuY1RvU3RyaW5nID0gZnVuY1Byb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgb2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGlmIGEgbWV0aG9kIGlzIG5hdGl2ZS4gKi9cbnZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArXG4gIGZ1bmNUb1N0cmluZy5jYWxsKGhhc093blByb3BlcnR5KS5yZXBsYWNlKHJlUmVnRXhwQ2hhciwgJ1xcXFwkJicpXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJ1xuKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNYXggPSBNYXRoLm1heCxcbiAgICBuYXRpdmVNaW4gPSBNYXRoLm1pbjtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyksXG4gICAgbmF0aXZlQ3JlYXRlID0gZ2V0TmF0aXZlKE9iamVjdCwgJ2NyZWF0ZScpO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBoYXNoIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gSGFzaChlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA/IGVudHJpZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGhhc2guXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgSGFzaFxuICovXG5mdW5jdGlvbiBoYXNoQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBuYXRpdmVDcmVhdGUgPyBuYXRpdmVDcmVhdGUobnVsbCkgOiB7fTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtPYmplY3R9IGhhc2ggVGhlIGhhc2ggdG8gbW9kaWZ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc2hEZWxldGUoa2V5KSB7XG4gIHJldHVybiB0aGlzLmhhcyhrZXkpICYmIGRlbGV0ZSB0aGlzLl9fZGF0YV9fW2tleV07XG59XG5cbi8qKlxuICogR2V0cyB0aGUgaGFzaCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBoYXNoR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChuYXRpdmVDcmVhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0gZGF0YVtrZXldO1xuICAgIHJldHVybiByZXN1bHQgPT09IEhBU0hfVU5ERUZJTkVEID8gdW5kZWZpbmVkIDogcmVzdWx0O1xuICB9XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSkgPyBkYXRhW2tleV0gOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgaGFzaCB2YWx1ZSBmb3IgYGtleWAgZXhpc3RzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaEhhcyhrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fO1xuICByZXR1cm4gbmF0aXZlQ3JlYXRlID8gZGF0YVtrZXldICE9PSB1bmRlZmluZWQgOiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGRhdGEsIGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgaGFzaCBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGhhc2ggaW5zdGFuY2UuXG4gKi9cbmZ1bmN0aW9uIGhhc2hTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIGRhdGFba2V5XSA9IChuYXRpdmVDcmVhdGUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkgPyBIQVNIX1VOREVGSU5FRCA6IHZhbHVlO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYEhhc2hgLlxuSGFzaC5wcm90b3R5cGUuY2xlYXIgPSBoYXNoQ2xlYXI7XG5IYXNoLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBoYXNoRGVsZXRlO1xuSGFzaC5wcm90b3R5cGUuZ2V0ID0gaGFzaEdldDtcbkhhc2gucHJvdG90eXBlLmhhcyA9IGhhc2hIYXM7XG5IYXNoLnByb3RvdHlwZS5zZXQgPSBoYXNoU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gbGlzdCBjYWNoZSBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIExpc3RDYWNoZShlbnRyaWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gZW50cmllcyA/IGVudHJpZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLmNsZWFyKCk7XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgdmFyIGVudHJ5ID0gZW50cmllc1tpbmRleF07XG4gICAgdGhpcy5zZXQoZW50cnlbMF0sIGVudHJ5WzFdKTtcbiAgfVxufVxuXG4vKipcbiAqIFJlbW92ZXMgYWxsIGtleS12YWx1ZSBlbnRyaWVzIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUNsZWFyKCkge1xuICB0aGlzLl9fZGF0YV9fID0gW107XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIGxpc3QgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZURlbGV0ZShrZXkpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBsYXN0SW5kZXggPSBkYXRhLmxlbmd0aCAtIDE7XG4gIGlmIChpbmRleCA9PSBsYXN0SW5kZXgpIHtcbiAgICBkYXRhLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNwbGljZS5jYWxsKGRhdGEsIGluZGV4LCAxKTtcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlR2V0KGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIHJldHVybiBpbmRleCA8IDAgPyB1bmRlZmluZWQgOiBkYXRhW2luZGV4XVsxXTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBsaXN0IGNhY2hlIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBlbnRyeSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbiBlbnRyeSBmb3IgYGtleWAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGxpc3RDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGFzc29jSW5kZXhPZih0aGlzLl9fZGF0YV9fLCBrZXkpID4gLTE7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbGlzdCBjYWNoZSBga2V5YCB0byBgdmFsdWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBzZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbGlzdCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlU2V0KGtleSwgdmFsdWUpIHtcbiAgdmFyIGRhdGEgPSB0aGlzLl9fZGF0YV9fLFxuICAgICAgaW5kZXggPSBhc3NvY0luZGV4T2YoZGF0YSwga2V5KTtcblxuICBpZiAoaW5kZXggPCAwKSB7XG4gICAgZGF0YS5wdXNoKFtrZXksIHZhbHVlXSk7XG4gIH0gZWxzZSB7XG4gICAgZGF0YVtpbmRleF1bMV0gPSB2YWx1ZTtcbiAgfVxuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYExpc3RDYWNoZWAuXG5MaXN0Q2FjaGUucHJvdG90eXBlLmNsZWFyID0gbGlzdENhY2hlQ2xlYXI7XG5MaXN0Q2FjaGUucHJvdG90eXBlWydkZWxldGUnXSA9IGxpc3RDYWNoZURlbGV0ZTtcbkxpc3RDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbGlzdENhY2hlR2V0O1xuTGlzdENhY2hlLnByb3RvdHlwZS5oYXMgPSBsaXN0Q2FjaGVIYXM7XG5MaXN0Q2FjaGUucHJvdG90eXBlLnNldCA9IGxpc3RDYWNoZVNldDtcblxuLyoqXG4gKiBDcmVhdGVzIGEgbWFwIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIE1hcENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID8gZW50cmllcy5sZW5ndGggOiAwO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBjbGVhclxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSB7XG4gICAgJ2hhc2gnOiBuZXcgSGFzaCxcbiAgICAnbWFwJzogbmV3IChNYXAgfHwgTGlzdENhY2hlKSxcbiAgICAnc3RyaW5nJzogbmV3IEhhc2hcbiAgfTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbWFwLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBNYXBDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIG1hcENhY2hlRGVsZXRlKGtleSkge1xuICByZXR1cm4gZ2V0TWFwRGF0YSh0aGlzLCBrZXkpWydkZWxldGUnXShrZXkpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG1hcCB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVHZXQoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuZ2V0KGtleSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGEgbWFwIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVIYXMoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSkuaGFzKGtleSk7XG59XG5cbi8qKlxuICogU2V0cyB0aGUgbWFwIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG1hcCBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICBnZXRNYXBEYXRhKHRoaXMsIGtleSkuc2V0KGtleSwgdmFsdWUpO1xuICByZXR1cm4gdGhpcztcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYE1hcENhY2hlYC5cbk1hcENhY2hlLnByb3RvdHlwZS5jbGVhciA9IG1hcENhY2hlQ2xlYXI7XG5NYXBDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbWFwQ2FjaGVEZWxldGU7XG5NYXBDYWNoZS5wcm90b3R5cGUuZ2V0ID0gbWFwQ2FjaGVHZXQ7XG5NYXBDYWNoZS5wcm90b3R5cGUuaGFzID0gbWFwQ2FjaGVIYXM7XG5NYXBDYWNoZS5wcm90b3R5cGUuc2V0ID0gbWFwQ2FjaGVTZXQ7XG5cbi8qKlxuICpcbiAqIENyZWF0ZXMgYW4gYXJyYXkgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIHVuaXF1ZSB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW3ZhbHVlc10gVGhlIHZhbHVlcyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gU2V0Q2FjaGUodmFsdWVzKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gdmFsdWVzID8gdmFsdWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBNYXBDYWNoZTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB0aGlzLmFkZCh2YWx1ZXNbaW5kZXhdKTtcbiAgfVxufVxuXG4vKipcbiAqIEFkZHMgYHZhbHVlYCB0byB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGFkZFxuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAYWxpYXMgcHVzaFxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2FjaGUuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBjYWNoZSBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVBZGQodmFsdWUpIHtcbiAgdGhpcy5fX2RhdGFfXy5zZXQodmFsdWUsIEhBU0hfVU5ERUZJTkVEKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgaW4gdGhlIGFycmF5IGNhY2hlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBoYXNcbiAqIEBtZW1iZXJPZiBTZXRDYWNoZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2VhcmNoIGZvci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgZm91bmQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc2V0Q2FjaGVIYXModmFsdWUpIHtcbiAgcmV0dXJuIHRoaXMuX19kYXRhX18uaGFzKHZhbHVlKTtcbn1cblxuLy8gQWRkIG1ldGhvZHMgdG8gYFNldENhY2hlYC5cblNldENhY2hlLnByb3RvdHlwZS5hZGQgPSBTZXRDYWNoZS5wcm90b3R5cGUucHVzaCA9IHNldENhY2hlQWRkO1xuU2V0Q2FjaGUucHJvdG90eXBlLmhhcyA9IHNldENhY2hlSGFzO1xuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIG1ldGhvZHMgbGlrZSBgXy5pbnRlcnNlY3Rpb25gLCB3aXRob3V0IHN1cHBvcnRcbiAqIGZvciBpdGVyYXRlZSBzaG9ydGhhbmRzLCB0aGF0IGFjY2VwdHMgYW4gYXJyYXkgb2YgYXJyYXlzIHRvIGluc3BlY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5cyBUaGUgYXJyYXlzIHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbaXRlcmF0ZWVdIFRoZSBpdGVyYXRlZSBpbnZva2VkIHBlciBlbGVtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmF0b3JdIFRoZSBjb21wYXJhdG9yIGludm9rZWQgcGVyIGVsZW1lbnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIG5ldyBhcnJheSBvZiBzaGFyZWQgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBiYXNlSW50ZXJzZWN0aW9uKGFycmF5cywgaXRlcmF0ZWUsIGNvbXBhcmF0b3IpIHtcbiAgdmFyIGluY2x1ZGVzID0gY29tcGFyYXRvciA/IGFycmF5SW5jbHVkZXNXaXRoIDogYXJyYXlJbmNsdWRlcyxcbiAgICAgIGxlbmd0aCA9IGFycmF5c1swXS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBhcnJheXMubGVuZ3RoLFxuICAgICAgb3RoSW5kZXggPSBvdGhMZW5ndGgsXG4gICAgICBjYWNoZXMgPSBBcnJheShvdGhMZW5ndGgpLFxuICAgICAgbWF4TGVuZ3RoID0gSW5maW5pdHksXG4gICAgICByZXN1bHQgPSBbXTtcblxuICB3aGlsZSAob3RoSW5kZXgtLSkge1xuICAgIHZhciBhcnJheSA9IGFycmF5c1tvdGhJbmRleF07XG4gICAgaWYgKG90aEluZGV4ICYmIGl0ZXJhdGVlKSB7XG4gICAgICBhcnJheSA9IGFycmF5TWFwKGFycmF5LCBiYXNlVW5hcnkoaXRlcmF0ZWUpKTtcbiAgICB9XG4gICAgbWF4TGVuZ3RoID0gbmF0aXZlTWluKGFycmF5Lmxlbmd0aCwgbWF4TGVuZ3RoKTtcbiAgICBjYWNoZXNbb3RoSW5kZXhdID0gIWNvbXBhcmF0b3IgJiYgKGl0ZXJhdGVlIHx8IChsZW5ndGggPj0gMTIwICYmIGFycmF5Lmxlbmd0aCA+PSAxMjApKVxuICAgICAgPyBuZXcgU2V0Q2FjaGUob3RoSW5kZXggJiYgYXJyYXkpXG4gICAgICA6IHVuZGVmaW5lZDtcbiAgfVxuICBhcnJheSA9IGFycmF5c1swXTtcblxuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIHNlZW4gPSBjYWNoZXNbMF07XG5cbiAgb3V0ZXI6XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoICYmIHJlc3VsdC5sZW5ndGggPCBtYXhMZW5ndGgpIHtcbiAgICB2YXIgdmFsdWUgPSBhcnJheVtpbmRleF0sXG4gICAgICAgIGNvbXB1dGVkID0gaXRlcmF0ZWUgPyBpdGVyYXRlZSh2YWx1ZSkgOiB2YWx1ZTtcblxuICAgIHZhbHVlID0gKGNvbXBhcmF0b3IgfHwgdmFsdWUgIT09IDApID8gdmFsdWUgOiAwO1xuICAgIGlmICghKHNlZW5cbiAgICAgICAgICA/IGNhY2hlSGFzKHNlZW4sIGNvbXB1dGVkKVxuICAgICAgICAgIDogaW5jbHVkZXMocmVzdWx0LCBjb21wdXRlZCwgY29tcGFyYXRvcilcbiAgICAgICAgKSkge1xuICAgICAgb3RoSW5kZXggPSBvdGhMZW5ndGg7XG4gICAgICB3aGlsZSAoLS1vdGhJbmRleCkge1xuICAgICAgICB2YXIgY2FjaGUgPSBjYWNoZXNbb3RoSW5kZXhdO1xuICAgICAgICBpZiAoIShjYWNoZVxuICAgICAgICAgICAgICA/IGNhY2hlSGFzKGNhY2hlLCBjb21wdXRlZClcbiAgICAgICAgICAgICAgOiBpbmNsdWRlcyhhcnJheXNbb3RoSW5kZXhdLCBjb21wdXRlZCwgY29tcGFyYXRvcikpXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICBjb250aW51ZSBvdXRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHNlZW4pIHtcbiAgICAgICAgc2Vlbi5wdXNoKGNvbXB1dGVkKTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdC5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc05hdGl2ZWAgd2l0aG91dCBiYWQgc2hpbSBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBuYXRpdmUgZnVuY3Rpb24sXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNOYXRpdmUodmFsdWUpIHtcbiAgaWYgKCFpc09iamVjdCh2YWx1ZSkgfHwgaXNNYXNrZWQodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHZhciBwYXR0ZXJuID0gKGlzRnVuY3Rpb24odmFsdWUpIHx8IGlzSG9zdE9iamVjdCh2YWx1ZSkpID8gcmVJc05hdGl2ZSA6IHJlSXNIb3N0Q3RvcjtcbiAgcmV0dXJuIHBhdHRlcm4udGVzdCh0b1NvdXJjZSh2YWx1ZSkpO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnJlc3RgIHdoaWNoIGRvZXNuJ3QgdmFsaWRhdGUgb3IgY29lcmNlIGFyZ3VtZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gYXBwbHkgYSByZXN0IHBhcmFtZXRlciB0by5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9ZnVuYy5sZW5ndGgtMV0gVGhlIHN0YXJ0IHBvc2l0aW9uIG9mIHRoZSByZXN0IHBhcmFtZXRlci5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUmVzdChmdW5jLCBzdGFydCkge1xuICBzdGFydCA9IG5hdGl2ZU1heChzdGFydCA9PT0gdW5kZWZpbmVkID8gKGZ1bmMubGVuZ3RoIC0gMSkgOiBzdGFydCwgMCk7XG4gIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAgaW5kZXggPSAtMSxcbiAgICAgICAgbGVuZ3RoID0gbmF0aXZlTWF4KGFyZ3MubGVuZ3RoIC0gc3RhcnQsIDApLFxuICAgICAgICBhcnJheSA9IEFycmF5KGxlbmd0aCk7XG5cbiAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgYXJyYXlbaW5kZXhdID0gYXJnc1tzdGFydCArIGluZGV4XTtcbiAgICB9XG4gICAgaW5kZXggPSAtMTtcbiAgICB2YXIgb3RoZXJBcmdzID0gQXJyYXkoc3RhcnQgKyAxKTtcbiAgICB3aGlsZSAoKytpbmRleCA8IHN0YXJ0KSB7XG4gICAgICBvdGhlckFyZ3NbaW5kZXhdID0gYXJnc1tpbmRleF07XG4gICAgfVxuICAgIG90aGVyQXJnc1tzdGFydF0gPSBhcnJheTtcbiAgICByZXR1cm4gYXBwbHkoZnVuYywgdGhpcywgb3RoZXJBcmdzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBDYXN0cyBgdmFsdWVgIHRvIGFuIGVtcHR5IGFycmF5IGlmIGl0J3Mgbm90IGFuIGFycmF5IGxpa2Ugb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBpbnNwZWN0LlxuICogQHJldHVybnMge0FycmF5fE9iamVjdH0gUmV0dXJucyB0aGUgY2FzdCBhcnJheS1saWtlIG9iamVjdC5cbiAqL1xuZnVuY3Rpb24gY2FzdEFycmF5TGlrZU9iamVjdCh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpID8gdmFsdWUgOiBbXTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBkYXRhIGZvciBgbWFwYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUgcmVmZXJlbmNlIGtleS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBtYXAgZGF0YS5cbiAqL1xuZnVuY3Rpb24gZ2V0TWFwRGF0YShtYXAsIGtleSkge1xuICB2YXIgZGF0YSA9IG1hcC5fX2RhdGFfXztcbiAgcmV0dXJuIGlzS2V5YWJsZShrZXkpXG4gICAgPyBkYXRhW3R5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyAnc3RyaW5nJyA6ICdoYXNoJ11cbiAgICA6IGRhdGEubWFwO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIG5hdGl2ZSBmdW5jdGlvbiBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBtZXRob2QgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGZ1bmN0aW9uIGlmIGl0J3MgbmF0aXZlLCBlbHNlIGB1bmRlZmluZWRgLlxuICovXG5mdW5jdGlvbiBnZXROYXRpdmUob2JqZWN0LCBrZXkpIHtcbiAgdmFyIHZhbHVlID0gZ2V0VmFsdWUob2JqZWN0LCBrZXkpO1xuICByZXR1cm4gYmFzZUlzTmF0aXZlKHZhbHVlKSA/IHZhbHVlIDogdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHN1aXRhYmxlIGZvciB1c2UgYXMgdW5pcXVlIG9iamVjdCBrZXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXlhYmxlKHZhbHVlKSB7XG4gIHZhciB0eXBlID0gdHlwZW9mIHZhbHVlO1xuICByZXR1cm4gKHR5cGUgPT0gJ3N0cmluZycgfHwgdHlwZSA9PSAnbnVtYmVyJyB8fCB0eXBlID09ICdzeW1ib2wnIHx8IHR5cGUgPT0gJ2Jvb2xlYW4nKVxuICAgID8gKHZhbHVlICE9PSAnX19wcm90b19fJylcbiAgICA6ICh2YWx1ZSA9PT0gbnVsbCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBmdW5jYCBoYXMgaXRzIHNvdXJjZSBtYXNrZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBmdW5jYCBpcyBtYXNrZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNNYXNrZWQoZnVuYykge1xuICByZXR1cm4gISFtYXNrU3JjS2V5ICYmIChtYXNrU3JjS2V5IGluIGZ1bmMpO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBmdW5jYCB0byBpdHMgc291cmNlIGNvZGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBzb3VyY2UgY29kZS5cbiAqL1xuZnVuY3Rpb24gdG9Tb3VyY2UoZnVuYykge1xuICBpZiAoZnVuYyAhPSBudWxsKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBmdW5jVG9TdHJpbmcuY2FsbChmdW5jKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICAgIHRyeSB7XG4gICAgICByZXR1cm4gKGZ1bmMgKyAnJyk7XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB1bmlxdWUgdmFsdWVzIHRoYXQgYXJlIGluY2x1ZGVkIGluIGFsbCBnaXZlbiBhcnJheXNcbiAqIHVzaW5nIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBmb3IgZXF1YWxpdHkgY29tcGFyaXNvbnMuIFRoZSBvcmRlciBvZiByZXN1bHQgdmFsdWVzIGlzIGRldGVybWluZWQgYnkgdGhlXG4gKiBvcmRlciB0aGV5IG9jY3VyIGluIHRoZSBmaXJzdCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgQXJyYXlcbiAqIEBwYXJhbSB7Li4uQXJyYXl9IFthcnJheXNdIFRoZSBhcnJheXMgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGFycmF5IG9mIGludGVyc2VjdGluZyB2YWx1ZXMuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaW50ZXJzZWN0aW9uKFsyLCAxXSwgWzIsIDNdKTtcbiAqIC8vID0+IFsyXVxuICovXG52YXIgaW50ZXJzZWN0aW9uID0gYmFzZVJlc3QoZnVuY3Rpb24oYXJyYXlzKSB7XG4gIHZhciBtYXBwZWQgPSBhcnJheU1hcChhcnJheXMsIGNhc3RBcnJheUxpa2VPYmplY3QpO1xuICByZXR1cm4gKG1hcHBlZC5sZW5ndGggJiYgbWFwcGVkWzBdID09PSBhcnJheXNbMF0pXG4gICAgPyBiYXNlSW50ZXJzZWN0aW9uKG1hcHBlZClcbiAgICA6IFtdO1xufSk7XG5cbi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UuIEEgdmFsdWUgaXMgY29uc2lkZXJlZCBhcnJheS1saWtlIGlmIGl0J3NcbiAqIG5vdCBhIGZ1bmN0aW9uIGFuZCBoYXMgYSBgdmFsdWUubGVuZ3RoYCB0aGF0J3MgYW4gaW50ZWdlciBncmVhdGVyIHRoYW4gb3JcbiAqIGVxdWFsIHRvIGAwYCBhbmQgbGVzcyB0aGFuIG9yIGVxdWFsIHRvIGBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUmAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYXJyYXktbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKCdhYmMnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlKF8ubm9vcCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiBpc0xlbmd0aCh2YWx1ZS5sZW5ndGgpICYmICFpc0Z1bmN0aW9uKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGlzIG1ldGhvZCBpcyBsaWtlIGBfLmlzQXJyYXlMaWtlYCBleGNlcHQgdGhhdCBpdCBhbHNvIGNoZWNrcyBpZiBgdmFsdWVgXG4gKiBpcyBhbiBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXktbGlrZSBvYmplY3QsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChkb2N1bWVudC5ib2R5LmNoaWxkcmVuKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJyYXlMaWtlT2JqZWN0KCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpIHtcbiAgcmV0dXJuIGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgaXNBcnJheUxpa2UodmFsdWUpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgRnVuY3Rpb25gIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIGZ1bmN0aW9uLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNGdW5jdGlvbihfKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oL2FiYy8pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNGdW5jdGlvbih2YWx1ZSkge1xuICAvLyBUaGUgdXNlIG9mIGBPYmplY3QjdG9TdHJpbmdgIGF2b2lkcyBpc3N1ZXMgd2l0aCB0aGUgYHR5cGVvZmAgb3BlcmF0b3JcbiAgLy8gaW4gU2FmYXJpIDgtOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheSBhbmQgb3RoZXIgY29uc3RydWN0b3JzLlxuICB2YXIgdGFnID0gaXNPYmplY3QodmFsdWUpID8gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSkgOiAnJztcbiAgcmV0dXJuIHRhZyA9PSBmdW5jVGFnIHx8IHRhZyA9PSBnZW5UYWc7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGxlbmd0aC5cbiAqXG4gKiAqKk5vdGU6KiogVGhpcyBtZXRob2QgaXMgbG9vc2VseSBiYXNlZCBvblxuICogW2BUb0xlbmd0aGBdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXRvbGVuZ3RoKS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHZhbGlkIGxlbmd0aCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzTGVuZ3RoKDMpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNMZW5ndGgoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNMZW5ndGgoSW5maW5pdHkpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKCczJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0xlbmd0aCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdudW1iZXInICYmXG4gICAgdmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8PSBNQVhfU0FGRV9JTlRFR0VSO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuICEhdmFsdWUgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gISF2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW50ZXJzZWN0aW9uO1xuIiwiLyoqXG4gKiBsb2Rhc2ggKEN1c3RvbSBCdWlsZCkgPGh0dHBzOi8vbG9kYXNoLmNvbS8+XG4gKiBCdWlsZDogYGxvZGFzaCBtb2R1bGFyaXplIGV4cG9ydHM9XCJucG1cIiAtbyAuL2BcbiAqIENvcHlyaWdodCBqUXVlcnkgRm91bmRhdGlvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzIDxodHRwczovL2pxdWVyeS5vcmcvPlxuICogUmVsZWFzZWQgdW5kZXIgTUlUIGxpY2Vuc2UgPGh0dHBzOi8vbG9kYXNoLmNvbS9saWNlbnNlPlxuICogQmFzZWQgb24gVW5kZXJzY29yZS5qcyAxLjguMyA8aHR0cDovL3VuZGVyc2NvcmVqcy5vcmcvTElDRU5TRT5cbiAqIENvcHlyaWdodCBKZXJlbXkgQXNoa2VuYXMsIERvY3VtZW50Q2xvdWQgYW5kIEludmVzdGlnYXRpdmUgUmVwb3J0ZXJzICYgRWRpdG9yc1xuICovXG5cbi8qKiBVc2VkIGFzIHRoZSBzaXplIHRvIGVuYWJsZSBsYXJnZSBhcnJheSBvcHRpbWl6YXRpb25zLiAqL1xudmFyIExBUkdFX0FSUkFZX1NJWkUgPSAyMDA7XG5cbi8qKiBVc2VkIGFzIHRoZSBgVHlwZUVycm9yYCBtZXNzYWdlIGZvciBcIkZ1bmN0aW9uc1wiIG1ldGhvZHMuICovXG52YXIgRlVOQ19FUlJPUl9URVhUID0gJ0V4cGVjdGVkIGEgZnVuY3Rpb24nO1xuXG4vKiogVXNlZCB0byBzdGFuZC1pbiBmb3IgYHVuZGVmaW5lZGAgaGFzaCB2YWx1ZXMuICovXG52YXIgSEFTSF9VTkRFRklORUQgPSAnX19sb2Rhc2hfaGFzaF91bmRlZmluZWRfXyc7XG5cbi8qKiBVc2VkIHRvIGNvbXBvc2UgYml0bWFza3MgZm9yIGNvbXBhcmlzb24gc3R5bGVzLiAqL1xudmFyIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcgPSAxLFxuICAgIFBBUlRJQUxfQ09NUEFSRV9GTEFHID0gMjtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgSU5GSU5JVFkgPSAxIC8gMCxcbiAgICBNQVhfU0FGRV9JTlRFR0VSID0gOTAwNzE5OTI1NDc0MDk5MTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIGFyZ3NUYWcgPSAnW29iamVjdCBBcmd1bWVudHNdJyxcbiAgICBhcnJheVRhZyA9ICdbb2JqZWN0IEFycmF5XScsXG4gICAgYm9vbFRhZyA9ICdbb2JqZWN0IEJvb2xlYW5dJyxcbiAgICBkYXRlVGFnID0gJ1tvYmplY3QgRGF0ZV0nLFxuICAgIGVycm9yVGFnID0gJ1tvYmplY3QgRXJyb3JdJyxcbiAgICBmdW5jVGFnID0gJ1tvYmplY3QgRnVuY3Rpb25dJyxcbiAgICBnZW5UYWcgPSAnW29iamVjdCBHZW5lcmF0b3JGdW5jdGlvbl0nLFxuICAgIG1hcFRhZyA9ICdbb2JqZWN0IE1hcF0nLFxuICAgIG51bWJlclRhZyA9ICdbb2JqZWN0IE51bWJlcl0nLFxuICAgIG9iamVjdFRhZyA9ICdbb2JqZWN0IE9iamVjdF0nLFxuICAgIHByb21pc2VUYWcgPSAnW29iamVjdCBQcm9taXNlXScsXG4gICAgcmVnZXhwVGFnID0gJ1tvYmplY3QgUmVnRXhwXScsXG4gICAgc2V0VGFnID0gJ1tvYmplY3QgU2V0XScsXG4gICAgc3RyaW5nVGFnID0gJ1tvYmplY3QgU3RyaW5nXScsXG4gICAgc3ltYm9sVGFnID0gJ1tvYmplY3QgU3ltYm9sXScsXG4gICAgd2Vha01hcFRhZyA9ICdbb2JqZWN0IFdlYWtNYXBdJztcblxudmFyIGFycmF5QnVmZmVyVGFnID0gJ1tvYmplY3QgQXJyYXlCdWZmZXJdJyxcbiAgICBkYXRhVmlld1RhZyA9ICdbb2JqZWN0IERhdGFWaWV3XScsXG4gICAgZmxvYXQzMlRhZyA9ICdbb2JqZWN0IEZsb2F0MzJBcnJheV0nLFxuICAgIGZsb2F0NjRUYWcgPSAnW29iamVjdCBGbG9hdDY0QXJyYXldJyxcbiAgICBpbnQ4VGFnID0gJ1tvYmplY3QgSW50OEFycmF5XScsXG4gICAgaW50MTZUYWcgPSAnW29iamVjdCBJbnQxNkFycmF5XScsXG4gICAgaW50MzJUYWcgPSAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgdWludDhUYWcgPSAnW29iamVjdCBVaW50OEFycmF5XScsXG4gICAgdWludDhDbGFtcGVkVGFnID0gJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICB1aW50MTZUYWcgPSAnW29iamVjdCBVaW50MTZBcnJheV0nLFxuICAgIHVpbnQzMlRhZyA9ICdbb2JqZWN0IFVpbnQzMkFycmF5XSc7XG5cbi8qKiBVc2VkIHRvIG1hdGNoIHByb3BlcnR5IG5hbWVzIHdpdGhpbiBwcm9wZXJ0eSBwYXRocy4gKi9cbnZhciByZUlzRGVlcFByb3AgPSAvXFwufFxcWyg/OlteW1xcXV0qfChbXCInXSkoPzooPyFcXDEpW15cXFxcXXxcXFxcLikqP1xcMSlcXF0vLFxuICAgIHJlSXNQbGFpblByb3AgPSAvXlxcdyokLyxcbiAgICByZUxlYWRpbmdEb3QgPSAvXlxcLi8sXG4gICAgcmVQcm9wTmFtZSA9IC9bXi5bXFxdXSt8XFxbKD86KC0/XFxkKyg/OlxcLlxcZCspPyl8KFtcIiddKSgoPzooPyFcXDIpW15cXFxcXXxcXFxcLikqPylcXDIpXFxdfCg/PSg/OlxcLnxcXFtcXF0pKD86XFwufFxcW1xcXXwkKSkvZztcblxuLyoqXG4gKiBVc2VkIHRvIG1hdGNoIGBSZWdFeHBgXG4gKiBbc3ludGF4IGNoYXJhY3RlcnNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXBhdHRlcm5zKS5cbiAqL1xudmFyIHJlUmVnRXhwQ2hhciA9IC9bXFxcXF4kLiorPygpW1xcXXt9fF0vZztcblxuLyoqIFVzZWQgdG8gbWF0Y2ggYmFja3NsYXNoZXMgaW4gcHJvcGVydHkgcGF0aHMuICovXG52YXIgcmVFc2NhcGVDaGFyID0gL1xcXFwoXFxcXCk/L2c7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBob3N0IGNvbnN0cnVjdG9ycyAoU2FmYXJpKS4gKi9cbnZhciByZUlzSG9zdEN0b3IgPSAvXlxcW29iamVjdCAuKz9Db25zdHJ1Y3RvclxcXSQvO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgdW5zaWduZWQgaW50ZWdlciB2YWx1ZXMuICovXG52YXIgcmVJc1VpbnQgPSAvXig/OjB8WzEtOV1cXGQqKSQvO1xuXG4vKiogVXNlZCB0byBpZGVudGlmeSBgdG9TdHJpbmdUYWdgIHZhbHVlcyBvZiB0eXBlZCBhcnJheXMuICovXG52YXIgdHlwZWRBcnJheVRhZ3MgPSB7fTtcbnR5cGVkQXJyYXlUYWdzW2Zsb2F0MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbZmxvYXQ2NFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50OFRhZ10gPSB0eXBlZEFycmF5VGFnc1tpbnQxNlRhZ10gPVxudHlwZWRBcnJheVRhZ3NbaW50MzJUYWddID0gdHlwZWRBcnJheVRhZ3NbdWludDhUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQ4Q2xhbXBlZFRhZ10gPSB0eXBlZEFycmF5VGFnc1t1aW50MTZUYWddID1cbnR5cGVkQXJyYXlUYWdzW3VpbnQzMlRhZ10gPSB0cnVlO1xudHlwZWRBcnJheVRhZ3NbYXJnc1RhZ10gPSB0eXBlZEFycmF5VGFnc1thcnJheVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbYXJyYXlCdWZmZXJUYWddID0gdHlwZWRBcnJheVRhZ3NbYm9vbFRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZGF0YVZpZXdUYWddID0gdHlwZWRBcnJheVRhZ3NbZGF0ZVRhZ10gPVxudHlwZWRBcnJheVRhZ3NbZXJyb3JUYWddID0gdHlwZWRBcnJheVRhZ3NbZnVuY1RhZ10gPVxudHlwZWRBcnJheVRhZ3NbbWFwVGFnXSA9IHR5cGVkQXJyYXlUYWdzW251bWJlclRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbb2JqZWN0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3JlZ2V4cFRhZ10gPVxudHlwZWRBcnJheVRhZ3Nbc2V0VGFnXSA9IHR5cGVkQXJyYXlUYWdzW3N0cmluZ1RhZ10gPVxudHlwZWRBcnJheVRhZ3Nbd2Vha01hcFRhZ10gPSBmYWxzZTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBnbG9iYWxgIGZyb20gTm9kZS5qcy4gKi9cbnZhciBmcmVlR2xvYmFsID0gdHlwZW9mIGdsb2JhbCA9PSAnb2JqZWN0JyAmJiBnbG9iYWwgJiYgZ2xvYmFsLk9iamVjdCA9PT0gT2JqZWN0ICYmIGdsb2JhbDtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGV4cG9ydHNgLiAqL1xudmFyIGZyZWVFeHBvcnRzID0gdHlwZW9mIGV4cG9ydHMgPT0gJ29iamVjdCcgJiYgZXhwb3J0cyAmJiAhZXhwb3J0cy5ub2RlVHlwZSAmJiBleHBvcnRzO1xuXG4vKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYG1vZHVsZWAuICovXG52YXIgZnJlZU1vZHVsZSA9IGZyZWVFeHBvcnRzICYmIHR5cGVvZiBtb2R1bGUgPT0gJ29iamVjdCcgJiYgbW9kdWxlICYmICFtb2R1bGUubm9kZVR5cGUgJiYgbW9kdWxlO1xuXG4vKiogRGV0ZWN0IHRoZSBwb3B1bGFyIENvbW1vbkpTIGV4dGVuc2lvbiBgbW9kdWxlLmV4cG9ydHNgLiAqL1xudmFyIG1vZHVsZUV4cG9ydHMgPSBmcmVlTW9kdWxlICYmIGZyZWVNb2R1bGUuZXhwb3J0cyA9PT0gZnJlZUV4cG9ydHM7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgcHJvY2Vzc2AgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVQcm9jZXNzID0gbW9kdWxlRXhwb3J0cyAmJiBmcmVlR2xvYmFsLnByb2Nlc3M7XG5cbi8qKiBVc2VkIHRvIGFjY2VzcyBmYXN0ZXIgTm9kZS5qcyBoZWxwZXJzLiAqL1xudmFyIG5vZGVVdGlsID0gKGZ1bmN0aW9uKCkge1xuICB0cnkge1xuICAgIHJldHVybiBmcmVlUHJvY2VzcyAmJiBmcmVlUHJvY2Vzcy5iaW5kaW5nKCd1dGlsJyk7XG4gIH0gY2F0Y2ggKGUpIHt9XG59KCkpO1xuXG4vKiBOb2RlLmpzIGhlbHBlciByZWZlcmVuY2VzLiAqL1xudmFyIG5vZGVJc1R5cGVkQXJyYXkgPSBub2RlVXRpbCAmJiBub2RlVXRpbC5pc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQXBwZW5kcyB0aGUgZWxlbWVudHMgb2YgYHZhbHVlc2AgdG8gYGFycmF5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIG1vZGlmeS5cbiAqIEBwYXJhbSB7QXJyYXl9IHZhbHVlcyBUaGUgdmFsdWVzIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyBgYXJyYXlgLlxuICovXG5mdW5jdGlvbiBhcnJheVB1c2goYXJyYXksIHZhbHVlcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IHZhbHVlcy5sZW5ndGgsXG4gICAgICBvZmZzZXQgPSBhcnJheS5sZW5ndGg7XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICBhcnJheVtvZmZzZXQgKyBpbmRleF0gPSB2YWx1ZXNbaW5kZXhdO1xuICB9XG4gIHJldHVybiBhcnJheTtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYF8uc29tZWAgZm9yIGFycmF5cyB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlXG4gKiBzaG9ydGhhbmRzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBbYXJyYXldIFRoZSBhcnJheSB0byBpdGVyYXRlIG92ZXIuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcmVkaWNhdGUgVGhlIGZ1bmN0aW9uIGludm9rZWQgcGVyIGl0ZXJhdGlvbi5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBhbnkgZWxlbWVudCBwYXNzZXMgdGhlIHByZWRpY2F0ZSBjaGVjayxcbiAqICBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U29tZShhcnJheSwgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gYXJyYXkgPyBhcnJheS5sZW5ndGggOiAwO1xuXG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgaWYgKHByZWRpY2F0ZShhcnJheVtpbmRleF0sIGluZGV4LCBhcnJheSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucHJvcGVydHlgIHdpdGhvdXQgc3VwcG9ydCBmb3IgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBhY2Nlc3NvciBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZVByb3BlcnR5KGtleSkge1xuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG4gIH07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udGltZXNgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kc1xuICogb3IgbWF4IGFycmF5IGxlbmd0aCBjaGVja3MuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7bnVtYmVyfSBuIFRoZSBudW1iZXIgb2YgdGltZXMgdG8gaW52b2tlIGBpdGVyYXRlZWAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBpdGVyYXRlZSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgaXRlcmF0aW9uLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiByZXN1bHRzLlxuICovXG5mdW5jdGlvbiBiYXNlVGltZXMobiwgaXRlcmF0ZWUpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShuKTtcblxuICB3aGlsZSAoKytpbmRleCA8IG4pIHtcbiAgICByZXN1bHRbaW5kZXhdID0gaXRlcmF0ZWUoaW5kZXgpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udW5hcnlgIHdpdGhvdXQgc3VwcG9ydCBmb3Igc3RvcmluZyBtZXRhZGF0YS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2FwIGFyZ3VtZW50cyBmb3IuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBjYXBwZWQgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VVbmFyeShmdW5jKSB7XG4gIHJldHVybiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBmdW5jKHZhbHVlKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSB2YWx1ZSBhdCBga2V5YCBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IFtvYmplY3RdIFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBwcm9wZXJ0eSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gZ2V0VmFsdWUob2JqZWN0LCBrZXkpIHtcbiAgcmV0dXJuIG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogb2JqZWN0W2tleV07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBob3N0IG9iamVjdCBpbiBJRSA8IDkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBob3N0IG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0hvc3RPYmplY3QodmFsdWUpIHtcbiAgLy8gTWFueSBob3N0IG9iamVjdHMgYXJlIGBPYmplY3RgIG9iamVjdHMgdGhhdCBjYW4gY29lcmNlIHRvIHN0cmluZ3NcbiAgLy8gZGVzcGl0ZSBoYXZpbmcgaW1wcm9wZXJseSBkZWZpbmVkIGB0b1N0cmluZ2AgbWV0aG9kcy5cbiAgdmFyIHJlc3VsdCA9IGZhbHNlO1xuICBpZiAodmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUudG9TdHJpbmcgIT0gJ2Z1bmN0aW9uJykge1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSAhISh2YWx1ZSArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ29udmVydHMgYG1hcGAgdG8gaXRzIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG1hcCBUaGUgbWFwIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGtleS12YWx1ZSBwYWlycy5cbiAqL1xuZnVuY3Rpb24gbWFwVG9BcnJheShtYXApIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICByZXN1bHQgPSBBcnJheShtYXAuc2l6ZSk7XG5cbiAgbWFwLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgIHJlc3VsdFsrK2luZGV4XSA9IFtrZXksIHZhbHVlXTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIHVuYXJ5IGZ1bmN0aW9uIHRoYXQgaW52b2tlcyBgZnVuY2Agd2l0aCBpdHMgYXJndW1lbnQgdHJhbnNmb3JtZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZ1bmMgVGhlIGZ1bmN0aW9uIHRvIHdyYXAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0cmFuc2Zvcm0gVGhlIGFyZ3VtZW50IHRyYW5zZm9ybS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBvdmVyQXJnKGZ1bmMsIHRyYW5zZm9ybSkge1xuICByZXR1cm4gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIGZ1bmModHJhbnNmb3JtKGFyZykpO1xuICB9O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBzZXRgIHRvIGFuIGFycmF5IG9mIGl0cyB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBzZXQgVGhlIHNldCB0byBjb252ZXJ0LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIHNldFRvQXJyYXkoc2V0KSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gQXJyYXkoc2V0LnNpemUpO1xuXG4gIHNldC5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmVzdWx0WysraW5kZXhdID0gdmFsdWU7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgYXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZSxcbiAgICBmdW5jUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGUsXG4gICAgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb3ZlcnJlYWNoaW5nIGNvcmUtanMgc2hpbXMuICovXG52YXIgY29yZUpzRGF0YSA9IHJvb3RbJ19fY29yZS1qc19zaGFyZWRfXyddO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgbWV0aG9kcyBtYXNxdWVyYWRpbmcgYXMgbmF0aXZlLiAqL1xudmFyIG1hc2tTcmNLZXkgPSAoZnVuY3Rpb24oKSB7XG4gIHZhciB1aWQgPSAvW14uXSskLy5leGVjKGNvcmVKc0RhdGEgJiYgY29yZUpzRGF0YS5rZXlzICYmIGNvcmVKc0RhdGEua2V5cy5JRV9QUk9UTyB8fCAnJyk7XG4gIHJldHVybiB1aWQgPyAoJ1N5bWJvbChzcmMpXzEuJyArIHVpZCkgOiAnJztcbn0oKSk7XG5cbi8qKiBVc2VkIHRvIHJlc29sdmUgdGhlIGRlY29tcGlsZWQgc291cmNlIG9mIGZ1bmN0aW9ucy4gKi9cbnZhciBmdW5jVG9TdHJpbmcgPSBmdW5jUHJvdG8udG9TdHJpbmc7XG5cbi8qKiBVc2VkIHRvIGNoZWNrIG9iamVjdHMgZm9yIG93biBwcm9wZXJ0aWVzLiAqL1xudmFyIGhhc093blByb3BlcnR5ID0gb2JqZWN0UHJvdG8uaGFzT3duUHJvcGVydHk7XG5cbi8qKlxuICogVXNlZCB0byByZXNvbHZlIHRoZVxuICogW2B0b1N0cmluZ1RhZ2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmcpXG4gKiBvZiB2YWx1ZXMuXG4gKi9cbnZhciBvYmplY3RUb1N0cmluZyA9IG9iamVjdFByb3RvLnRvU3RyaW5nO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgaWYgYSBtZXRob2QgaXMgbmF0aXZlLiAqL1xudmFyIHJlSXNOYXRpdmUgPSBSZWdFeHAoJ14nICtcbiAgZnVuY1RvU3RyaW5nLmNhbGwoaGFzT3duUHJvcGVydHkpLnJlcGxhY2UocmVSZWdFeHBDaGFyLCAnXFxcXCQmJylcbiAgLnJlcGxhY2UoL2hhc093blByb3BlcnR5fChmdW5jdGlvbikuKj8oPz1cXFxcXFwoKXwgZm9yIC4rPyg/PVxcXFxcXF0pL2csICckMS4qPycpICsgJyQnXG4pO1xuXG4vKiogQnVpbHQtaW4gdmFsdWUgcmVmZXJlbmNlcy4gKi9cbnZhciBTeW1ib2wgPSByb290LlN5bWJvbCxcbiAgICBVaW50OEFycmF5ID0gcm9vdC5VaW50OEFycmF5LFxuICAgIGdldFByb3RvdHlwZSA9IG92ZXJBcmcoT2JqZWN0LmdldFByb3RvdHlwZU9mLCBPYmplY3QpLFxuICAgIHByb3BlcnR5SXNFbnVtZXJhYmxlID0gb2JqZWN0UHJvdG8ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gICAgc3BsaWNlID0gYXJyYXlQcm90by5zcGxpY2U7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVHZXRTeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgICBuYXRpdmVLZXlzID0gb3ZlckFyZyhPYmplY3Qua2V5cywgT2JqZWN0KTtcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgdGhhdCBhcmUgdmVyaWZpZWQgdG8gYmUgbmF0aXZlLiAqL1xudmFyIERhdGFWaWV3ID0gZ2V0TmF0aXZlKHJvb3QsICdEYXRhVmlldycpLFxuICAgIE1hcCA9IGdldE5hdGl2ZShyb290LCAnTWFwJyksXG4gICAgUHJvbWlzZSA9IGdldE5hdGl2ZShyb290LCAnUHJvbWlzZScpLFxuICAgIFNldCA9IGdldE5hdGl2ZShyb290LCAnU2V0JyksXG4gICAgV2Vha01hcCA9IGdldE5hdGl2ZShyb290LCAnV2Vha01hcCcpLFxuICAgIG5hdGl2ZUNyZWF0ZSA9IGdldE5hdGl2ZShPYmplY3QsICdjcmVhdGUnKTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG1hcHMsIHNldHMsIGFuZCB3ZWFrbWFwcy4gKi9cbnZhciBkYXRhVmlld0N0b3JTdHJpbmcgPSB0b1NvdXJjZShEYXRhVmlldyksXG4gICAgbWFwQ3RvclN0cmluZyA9IHRvU291cmNlKE1hcCksXG4gICAgcHJvbWlzZUN0b3JTdHJpbmcgPSB0b1NvdXJjZShQcm9taXNlKSxcbiAgICBzZXRDdG9yU3RyaW5nID0gdG9Tb3VyY2UoU2V0KSxcbiAgICB3ZWFrTWFwQ3RvclN0cmluZyA9IHRvU291cmNlKFdlYWtNYXApO1xuXG4vKiogVXNlZCB0byBjb252ZXJ0IHN5bWJvbHMgdG8gcHJpbWl0aXZlcyBhbmQgc3RyaW5ncy4gKi9cbnZhciBzeW1ib2xQcm90byA9IFN5bWJvbCA/IFN5bWJvbC5wcm90b3R5cGUgOiB1bmRlZmluZWQsXG4gICAgc3ltYm9sVmFsdWVPZiA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udmFsdWVPZiA6IHVuZGVmaW5lZCxcbiAgICBzeW1ib2xUb1N0cmluZyA9IHN5bWJvbFByb3RvID8gc3ltYm9sUHJvdG8udG9TdHJpbmcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhIGhhc2ggb2JqZWN0LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY29uc3RydWN0b3JcbiAqIEBwYXJhbSB7QXJyYXl9IFtlbnRyaWVzXSBUaGUga2V5LXZhbHVlIHBhaXJzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBIYXNoKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID8gZW50cmllcy5sZW5ndGggOiAwO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgaGFzaC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKi9cbmZ1bmN0aW9uIGhhc2hDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5hdGl2ZUNyZWF0ZSA/IG5hdGl2ZUNyZWF0ZShudWxsKSA6IHt9O1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBoYXNoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBIYXNoXG4gKiBAcGFyYW0ge09iamVjdH0gaGFzaCBUaGUgaGFzaCB0byBtb2RpZnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaGFzaERlbGV0ZShrZXkpIHtcbiAgcmV0dXJuIHRoaXMuaGFzKGtleSkgJiYgZGVsZXRlIHRoaXMuX19kYXRhX19ba2V5XTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBoYXNoIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgSGFzaFxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZW50cnkgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIGhhc2hHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgaWYgKG5hdGl2ZUNyZWF0ZSkge1xuICAgIHZhciByZXN1bHQgPSBkYXRhW2tleV07XG4gICAgcmV0dXJuIHJlc3VsdCA9PT0gSEFTSF9VTkRFRklORUQgPyB1bmRlZmluZWQgOiByZXN1bHQ7XG4gIH1cbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KSA/IGRhdGFba2V5XSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBoYXNoIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBoYXNoSGFzKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX187XG4gIHJldHVybiBuYXRpdmVDcmVhdGUgPyBkYXRhW2tleV0gIT09IHVuZGVmaW5lZCA6IGhhc093blByb3BlcnR5LmNhbGwoZGF0YSwga2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBoYXNoIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIEhhc2hcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgaGFzaCBpbnN0YW5jZS5cbiAqL1xuZnVuY3Rpb24gaGFzaFNldChrZXksIHZhbHVlKSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXztcbiAgZGF0YVtrZXldID0gKG5hdGl2ZUNyZWF0ZSAmJiB2YWx1ZSA9PT0gdW5kZWZpbmVkKSA/IEhBU0hfVU5ERUZJTkVEIDogdmFsdWU7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgSGFzaGAuXG5IYXNoLnByb3RvdHlwZS5jbGVhciA9IGhhc2hDbGVhcjtcbkhhc2gucHJvdG90eXBlWydkZWxldGUnXSA9IGhhc2hEZWxldGU7XG5IYXNoLnByb3RvdHlwZS5nZXQgPSBoYXNoR2V0O1xuSGFzaC5wcm90b3R5cGUuaGFzID0gaGFzaEhhcztcbkhhc2gucHJvdG90eXBlLnNldCA9IGhhc2hTZXQ7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBsaXN0IGNhY2hlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTGlzdENhY2hlKGVudHJpZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBlbnRyaWVzID8gZW50cmllcy5sZW5ndGggOiAwO1xuXG4gIHRoaXMuY2xlYXIoKTtcbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2luZGV4XTtcbiAgICB0aGlzLnNldChlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgY2xlYXJcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlQ2xlYXIoKSB7XG4gIHRoaXMuX19kYXRhX18gPSBbXTtcbn1cblxuLyoqXG4gKiBSZW1vdmVzIGBrZXlgIGFuZCBpdHMgdmFsdWUgZnJvbSB0aGUgbGlzdCBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZGVsZXRlXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlRGVsZXRlKGtleSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGxhc3RJbmRleCA9IGRhdGEubGVuZ3RoIC0gMTtcbiAgaWYgKGluZGV4ID09IGxhc3RJbmRleCkge1xuICAgIGRhdGEucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc3BsaWNlLmNhbGwoZGF0YSwgaW5kZXgsIDEpO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBnZXRcbiAqIEBtZW1iZXJPZiBMaXN0Q2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVHZXQoa2V5KSB7XG4gIHZhciBkYXRhID0gdGhpcy5fX2RhdGFfXyxcbiAgICAgIGluZGV4ID0gYXNzb2NJbmRleE9mKGRhdGEsIGtleSk7XG5cbiAgcmV0dXJuIGluZGV4IDwgMCA/IHVuZGVmaW5lZCA6IGRhdGFbaW5kZXhdWzFdO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIGxpc3QgY2FjaGUgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTGlzdENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbGlzdENhY2hlSGFzKGtleSkge1xuICByZXR1cm4gYXNzb2NJbmRleE9mKHRoaXMuX19kYXRhX18sIGtleSkgPiAtMTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBsaXN0IGNhY2hlIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIExpc3RDYWNoZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZXQuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBsaXN0IGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBsaXN0Q2FjaGVTZXQoa2V5LCB2YWx1ZSkge1xuICB2YXIgZGF0YSA9IHRoaXMuX19kYXRhX18sXG4gICAgICBpbmRleCA9IGFzc29jSW5kZXhPZihkYXRhLCBrZXkpO1xuXG4gIGlmIChpbmRleCA8IDApIHtcbiAgICBkYXRhLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfSBlbHNlIHtcbiAgICBkYXRhW2luZGV4XVsxXSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTGlzdENhY2hlYC5cbkxpc3RDYWNoZS5wcm90b3R5cGUuY2xlYXIgPSBsaXN0Q2FjaGVDbGVhcjtcbkxpc3RDYWNoZS5wcm90b3R5cGVbJ2RlbGV0ZSddID0gbGlzdENhY2hlRGVsZXRlO1xuTGlzdENhY2hlLnByb3RvdHlwZS5nZXQgPSBsaXN0Q2FjaGVHZXQ7XG5MaXN0Q2FjaGUucHJvdG90eXBlLmhhcyA9IGxpc3RDYWNoZUhhcztcbkxpc3RDYWNoZS5wcm90b3R5cGUuc2V0ID0gbGlzdENhY2hlU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYSBtYXAgY2FjaGUgb2JqZWN0IHRvIHN0b3JlIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbZW50cmllc10gVGhlIGtleS12YWx1ZSBwYWlycyB0byBjYWNoZS5cbiAqL1xuZnVuY3Rpb24gTWFwQ2FjaGUoZW50cmllcykge1xuICB2YXIgaW5kZXggPSAtMSxcbiAgICAgIGxlbmd0aCA9IGVudHJpZXMgPyBlbnRyaWVzLmxlbmd0aCA6IDA7XG5cbiAgdGhpcy5jbGVhcigpO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaW5kZXhdO1xuICAgIHRoaXMuc2V0KGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBSZW1vdmVzIGFsbCBrZXktdmFsdWUgZW50cmllcyBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IHtcbiAgICAnaGFzaCc6IG5ldyBIYXNoLFxuICAgICdtYXAnOiBuZXcgKE1hcCB8fCBMaXN0Q2FjaGUpLFxuICAgICdzdHJpbmcnOiBuZXcgSGFzaFxuICB9O1xufVxuXG4vKipcbiAqIFJlbW92ZXMgYGtleWAgYW5kIGl0cyB2YWx1ZSBmcm9tIHRoZSBtYXAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGRlbGV0ZVxuICogQG1lbWJlck9mIE1hcENhY2hlXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHJlbW92ZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgZW50cnkgd2FzIHJlbW92ZWQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gbWFwQ2FjaGVEZWxldGUoa2V5KSB7XG4gIHJldHVybiBnZXRNYXBEYXRhKHRoaXMsIGtleSlbJ2RlbGV0ZSddKGtleSk7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbWFwIHZhbHVlIGZvciBga2V5YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgZ2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gZ2V0LlxuICogQHJldHVybnMgeyp9IFJldHVybnMgdGhlIGVudHJ5IHZhbHVlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUdldChrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5nZXQoa2V5KTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYSBtYXAgdmFsdWUgZm9yIGBrZXlgIGV4aXN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgaGFzXG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgZW50cnkgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYW4gZW50cnkgZm9yIGBrZXlgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZUhhcyhrZXkpIHtcbiAgcmV0dXJuIGdldE1hcERhdGEodGhpcywga2V5KS5oYXMoa2V5KTtcbn1cblxuLyoqXG4gKiBTZXRzIHRoZSBtYXAgYGtleWAgdG8gYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgc2V0XG4gKiBAbWVtYmVyT2YgTWFwQ2FjaGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIGtleSBvZiB0aGUgdmFsdWUgdG8gc2V0LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gc2V0LlxuICogQHJldHVybnMge09iamVjdH0gUmV0dXJucyB0aGUgbWFwIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBtYXBDYWNoZVNldChrZXksIHZhbHVlKSB7XG4gIGdldE1hcERhdGEodGhpcywga2V5KS5zZXQoa2V5LCB2YWx1ZSk7XG4gIHJldHVybiB0aGlzO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgTWFwQ2FjaGVgLlxuTWFwQ2FjaGUucHJvdG90eXBlLmNsZWFyID0gbWFwQ2FjaGVDbGVhcjtcbk1hcENhY2hlLnByb3RvdHlwZVsnZGVsZXRlJ10gPSBtYXBDYWNoZURlbGV0ZTtcbk1hcENhY2hlLnByb3RvdHlwZS5nZXQgPSBtYXBDYWNoZUdldDtcbk1hcENhY2hlLnByb3RvdHlwZS5oYXMgPSBtYXBDYWNoZUhhcztcbk1hcENhY2hlLnByb3RvdHlwZS5zZXQgPSBtYXBDYWNoZVNldDtcblxuLyoqXG4gKlxuICogQ3JlYXRlcyBhbiBhcnJheSBjYWNoZSBvYmplY3QgdG8gc3RvcmUgdW5pcXVlIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNvbnN0cnVjdG9yXG4gKiBAcGFyYW0ge0FycmF5fSBbdmFsdWVzXSBUaGUgdmFsdWVzIHRvIGNhY2hlLlxuICovXG5mdW5jdGlvbiBTZXRDYWNoZSh2YWx1ZXMpIHtcbiAgdmFyIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSB2YWx1ZXMgPyB2YWx1ZXMubGVuZ3RoIDogMDtcblxuICB0aGlzLl9fZGF0YV9fID0gbmV3IE1hcENhY2hlO1xuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHRoaXMuYWRkKHZhbHVlc1tpbmRleF0pO1xuICB9XG59XG5cbi8qKlxuICogQWRkcyBgdmFsdWVgIHRvIHRoZSBhcnJheSBjYWNoZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQG5hbWUgYWRkXG4gKiBAbWVtYmVyT2YgU2V0Q2FjaGVcbiAqIEBhbGlhcyBwdXNoXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjYWNoZS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUFkZCh2YWx1ZSkge1xuICB0aGlzLl9fZGF0YV9fLnNldCh2YWx1ZSwgSEFTSF9VTkRFRklORUQpO1xuICByZXR1cm4gdGhpcztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBpbiB0aGUgYXJyYXkgY2FjaGUuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFNldENhY2hlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBzZWFyY2ggZm9yLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBmb3VuZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBzZXRDYWNoZUhhcyh2YWx1ZSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfXy5oYXModmFsdWUpO1xufVxuXG4vLyBBZGQgbWV0aG9kcyB0byBgU2V0Q2FjaGVgLlxuU2V0Q2FjaGUucHJvdG90eXBlLmFkZCA9IFNldENhY2hlLnByb3RvdHlwZS5wdXNoID0gc2V0Q2FjaGVBZGQ7XG5TZXRDYWNoZS5wcm90b3R5cGUuaGFzID0gc2V0Q2FjaGVIYXM7XG5cbi8qKlxuICogQ3JlYXRlcyBhIHN0YWNrIGNhY2hlIG9iamVjdCB0byBzdG9yZSBrZXktdmFsdWUgcGFpcnMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHtBcnJheX0gW2VudHJpZXNdIFRoZSBrZXktdmFsdWUgcGFpcnMgdG8gY2FjaGUuXG4gKi9cbmZ1bmN0aW9uIFN0YWNrKGVudHJpZXMpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGUoZW50cmllcyk7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBhbGwga2V5LXZhbHVlIGVudHJpZXMgZnJvbSB0aGUgc3RhY2suXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGNsZWFyXG4gKiBAbWVtYmVyT2YgU3RhY2tcbiAqL1xuZnVuY3Rpb24gc3RhY2tDbGVhcigpIHtcbiAgdGhpcy5fX2RhdGFfXyA9IG5ldyBMaXN0Q2FjaGU7XG59XG5cbi8qKlxuICogUmVtb3ZlcyBga2V5YCBhbmQgaXRzIHZhbHVlIGZyb20gdGhlIHN0YWNrLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAbmFtZSBkZWxldGVcbiAqIEBtZW1iZXJPZiBTdGFja1xuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSB2YWx1ZSB0byByZW1vdmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGVudHJ5IHdhcyByZW1vdmVkLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIHN0YWNrRGVsZXRlKGtleSkge1xuICByZXR1cm4gdGhpcy5fX2RhdGFfX1snZGVsZXRlJ10oa2V5KTtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBzdGFjayB2YWx1ZSBmb3IgYGtleWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGdldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSBlbnRyeSB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gc3RhY2tHZXQoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmdldChrZXkpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBhIHN0YWNrIHZhbHVlIGZvciBga2V5YCBleGlzdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIGhhc1xuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIGVudHJ5IHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGFuIGVudHJ5IGZvciBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gc3RhY2tIYXMoa2V5KSB7XG4gIHJldHVybiB0aGlzLl9fZGF0YV9fLmhhcyhrZXkpO1xufVxuXG4vKipcbiAqIFNldHMgdGhlIHN0YWNrIGBrZXlgIHRvIGB2YWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBuYW1lIHNldFxuICogQG1lbWJlck9mIFN0YWNrXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIHZhbHVlIHRvIHNldC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHNldC5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIHN0YWNrIGNhY2hlIGluc3RhbmNlLlxuICovXG5mdW5jdGlvbiBzdGFja1NldChrZXksIHZhbHVlKSB7XG4gIHZhciBjYWNoZSA9IHRoaXMuX19kYXRhX187XG4gIGlmIChjYWNoZSBpbnN0YW5jZW9mIExpc3RDYWNoZSkge1xuICAgIHZhciBwYWlycyA9IGNhY2hlLl9fZGF0YV9fO1xuICAgIGlmICghTWFwIHx8IChwYWlycy5sZW5ndGggPCBMQVJHRV9BUlJBWV9TSVpFIC0gMSkpIHtcbiAgICAgIHBhaXJzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBjYWNoZSA9IHRoaXMuX19kYXRhX18gPSBuZXcgTWFwQ2FjaGUocGFpcnMpO1xuICB9XG4gIGNhY2hlLnNldChrZXksIHZhbHVlKTtcbiAgcmV0dXJuIHRoaXM7XG59XG5cbi8vIEFkZCBtZXRob2RzIHRvIGBTdGFja2AuXG5TdGFjay5wcm90b3R5cGUuY2xlYXIgPSBzdGFja0NsZWFyO1xuU3RhY2sucHJvdG90eXBlWydkZWxldGUnXSA9IHN0YWNrRGVsZXRlO1xuU3RhY2sucHJvdG90eXBlLmdldCA9IHN0YWNrR2V0O1xuU3RhY2sucHJvdG90eXBlLmhhcyA9IHN0YWNrSGFzO1xuU3RhY2sucHJvdG90eXBlLnNldCA9IHN0YWNrU2V0O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIGVudW1lcmFibGUgcHJvcGVydHkgbmFtZXMgb2YgdGhlIGFycmF5LWxpa2UgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGluaGVyaXRlZCBTcGVjaWZ5IHJldHVybmluZyBpbmhlcml0ZWQgcHJvcGVydHkgbmFtZXMuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBhcnJheUxpa2VLZXlzKHZhbHVlLCBpbmhlcml0ZWQpIHtcbiAgLy8gU2FmYXJpIDguMSBtYWtlcyBgYXJndW1lbnRzLmNhbGxlZWAgZW51bWVyYWJsZSBpbiBzdHJpY3QgbW9kZS5cbiAgLy8gU2FmYXJpIDkgbWFrZXMgYGFyZ3VtZW50cy5sZW5ndGhgIGVudW1lcmFibGUgaW4gc3RyaWN0IG1vZGUuXG4gIHZhciByZXN1bHQgPSAoaXNBcnJheSh2YWx1ZSkgfHwgaXNBcmd1bWVudHModmFsdWUpKVxuICAgID8gYmFzZVRpbWVzKHZhbHVlLmxlbmd0aCwgU3RyaW5nKVxuICAgIDogW107XG5cbiAgdmFyIGxlbmd0aCA9IHJlc3VsdC5sZW5ndGgsXG4gICAgICBza2lwSW5kZXhlcyA9ICEhbGVuZ3RoO1xuXG4gIGZvciAodmFyIGtleSBpbiB2YWx1ZSkge1xuICAgIGlmICgoaW5oZXJpdGVkIHx8IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGtleSkpICYmXG4gICAgICAgICEoc2tpcEluZGV4ZXMgJiYgKGtleSA9PSAnbGVuZ3RoJyB8fCBpc0luZGV4KGtleSwgbGVuZ3RoKSkpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEdldHMgdGhlIGluZGV4IGF0IHdoaWNoIHRoZSBga2V5YCBpcyBmb3VuZCBpbiBgYXJyYXlgIG9mIGtleS12YWx1ZSBwYWlycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgVGhlIGFycmF5IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0geyp9IGtleSBUaGUga2V5IHRvIHNlYXJjaCBmb3IuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBpbmRleCBvZiB0aGUgbWF0Y2hlZCB2YWx1ZSwgZWxzZSBgLTFgLlxuICovXG5mdW5jdGlvbiBhc3NvY0luZGV4T2YoYXJyYXksIGtleSkge1xuICB2YXIgbGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobGVuZ3RoLS0pIHtcbiAgICBpZiAoZXEoYXJyYXlbbGVuZ3RoXVswXSwga2V5KSkge1xuICAgICAgcmV0dXJuIGxlbmd0aDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmdldGAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWZhdWx0IHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldChvYmplY3QsIHBhdGgpIHtcbiAgcGF0aCA9IGlzS2V5KHBhdGgsIG9iamVjdCkgPyBbcGF0aF0gOiBjYXN0UGF0aChwYXRoKTtcblxuICB2YXIgaW5kZXggPSAwLFxuICAgICAgbGVuZ3RoID0gcGF0aC5sZW5ndGg7XG5cbiAgd2hpbGUgKG9iamVjdCAhPSBudWxsICYmIGluZGV4IDwgbGVuZ3RoKSB7XG4gICAgb2JqZWN0ID0gb2JqZWN0W3RvS2V5KHBhdGhbaW5kZXgrK10pXTtcbiAgfVxuICByZXR1cm4gKGluZGV4ICYmIGluZGV4ID09IGxlbmd0aCkgPyBvYmplY3QgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldEFsbEtleXNgIGFuZCBgZ2V0QWxsS2V5c0luYCB3aGljaCB1c2VzXG4gKiBga2V5c0Z1bmNgIGFuZCBgc3ltYm9sc0Z1bmNgIHRvIGdldCB0aGUgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBhbmRcbiAqIHN5bWJvbHMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGtleXNGdW5jIFRoZSBmdW5jdGlvbiB0byBnZXQgdGhlIGtleXMgb2YgYG9iamVjdGAuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzeW1ib2xzRnVuYyBUaGUgZnVuY3Rpb24gdG8gZ2V0IHRoZSBzeW1ib2xzIG9mIGBvYmplY3RgLlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzRnVuYywgc3ltYm9sc0Z1bmMpIHtcbiAgdmFyIHJlc3VsdCA9IGtleXNGdW5jKG9iamVjdCk7XG4gIHJldHVybiBpc0FycmF5KG9iamVjdCkgPyByZXN1bHQgOiBhcnJheVB1c2gocmVzdWx0LCBzeW1ib2xzRnVuYyhvYmplY3QpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgZ2V0VGFnYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIHJldHVybiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5oYXNJbmAgd2l0aG91dCBzdXBwb3J0IGZvciBkZWVwIHBhdGhzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gW29iamVjdF0gVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBrZXkgVGhlIGtleSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBga2V5YCBleGlzdHMsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUhhc0luKG9iamVjdCwga2V5KSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBrZXkgaW4gT2JqZWN0KG9iamVjdCk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNFcXVhbGAgd2hpY2ggc3VwcG9ydHMgcGFydGlhbCBjb21wYXJpc29uc1xuICogYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY3VzdG9taXplcl0gVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2JpdG1hc2tdIFRoZSBiaXRtYXNrIG9mIGNvbXBhcmlzb24gZmxhZ3MuXG4gKiAgVGhlIGJpdG1hc2sgbWF5IGJlIGNvbXBvc2VkIG9mIHRoZSBmb2xsb3dpbmcgZmxhZ3M6XG4gKiAgICAgMSAtIFVub3JkZXJlZCBjb21wYXJpc29uXG4gKiAgICAgMiAtIFBhcnRpYWwgY29tcGFyaXNvblxuICogQHBhcmFtIHtPYmplY3R9IFtzdGFja10gVHJhY2tzIHRyYXZlcnNlZCBgdmFsdWVgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBiYXNlSXNFcXVhbCh2YWx1ZSwgb3RoZXIsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSB7XG4gIGlmICh2YWx1ZSA9PT0gb3RoZXIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodmFsdWUgPT0gbnVsbCB8fCBvdGhlciA9PSBudWxsIHx8ICghaXNPYmplY3QodmFsdWUpICYmICFpc09iamVjdExpa2Uob3RoZXIpKSkge1xuICAgIHJldHVybiB2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyO1xuICB9XG4gIHJldHVybiBiYXNlSXNFcXVhbERlZXAodmFsdWUsIG90aGVyLCBiYXNlSXNFcXVhbCwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxgIGZvciBhcnJheXMgYW5kIG9iamVjdHMgd2hpY2ggcGVyZm9ybXNcbiAqIGRlZXAgY29tcGFyaXNvbnMgYW5kIHRyYWNrcyB0cmF2ZXJzZWQgb2JqZWN0cyBlbmFibGluZyBvYmplY3RzIHdpdGggY2lyY3VsYXJcbiAqIHJlZmVyZW5jZXMgdG8gYmUgY29tcGFyZWQuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IFtiaXRtYXNrXSBUaGUgYml0bWFzayBvZiBjb21wYXJpc29uIGZsYWdzLiBTZWUgYGJhc2VJc0VxdWFsYFxuICogIGZvciBtb3JlIGRldGFpbHMuXG4gKiBAcGFyYW0ge09iamVjdH0gW3N0YWNrXSBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzRXF1YWxEZWVwKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spIHtcbiAgdmFyIG9iaklzQXJyID0gaXNBcnJheShvYmplY3QpLFxuICAgICAgb3RoSXNBcnIgPSBpc0FycmF5KG90aGVyKSxcbiAgICAgIG9ialRhZyA9IGFycmF5VGFnLFxuICAgICAgb3RoVGFnID0gYXJyYXlUYWc7XG5cbiAgaWYgKCFvYmpJc0Fycikge1xuICAgIG9ialRhZyA9IGdldFRhZyhvYmplY3QpO1xuICAgIG9ialRhZyA9IG9ialRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb2JqVGFnO1xuICB9XG4gIGlmICghb3RoSXNBcnIpIHtcbiAgICBvdGhUYWcgPSBnZXRUYWcob3RoZXIpO1xuICAgIG90aFRhZyA9IG90aFRhZyA9PSBhcmdzVGFnID8gb2JqZWN0VGFnIDogb3RoVGFnO1xuICB9XG4gIHZhciBvYmpJc09iaiA9IG9ialRhZyA9PSBvYmplY3RUYWcgJiYgIWlzSG9zdE9iamVjdChvYmplY3QpLFxuICAgICAgb3RoSXNPYmogPSBvdGhUYWcgPT0gb2JqZWN0VGFnICYmICFpc0hvc3RPYmplY3Qob3RoZXIpLFxuICAgICAgaXNTYW1lVGFnID0gb2JqVGFnID09IG90aFRhZztcblxuICBpZiAoaXNTYW1lVGFnICYmICFvYmpJc09iaikge1xuICAgIHN0YWNrIHx8IChzdGFjayA9IG5ldyBTdGFjayk7XG4gICAgcmV0dXJuIChvYmpJc0FyciB8fCBpc1R5cGVkQXJyYXkob2JqZWN0KSlcbiAgICAgID8gZXF1YWxBcnJheXMob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaylcbiAgICAgIDogZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCBvYmpUYWcsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spO1xuICB9XG4gIGlmICghKGJpdG1hc2sgJiBQQVJUSUFMX0NPTVBBUkVfRkxBRykpIHtcbiAgICB2YXIgb2JqSXNXcmFwcGVkID0gb2JqSXNPYmogJiYgaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsICdfX3dyYXBwZWRfXycpLFxuICAgICAgICBvdGhJc1dyYXBwZWQgPSBvdGhJc09iaiAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKG90aGVyLCAnX193cmFwcGVkX18nKTtcblxuICAgIGlmIChvYmpJc1dyYXBwZWQgfHwgb3RoSXNXcmFwcGVkKSB7XG4gICAgICB2YXIgb2JqVW53cmFwcGVkID0gb2JqSXNXcmFwcGVkID8gb2JqZWN0LnZhbHVlKCkgOiBvYmplY3QsXG4gICAgICAgICAgb3RoVW53cmFwcGVkID0gb3RoSXNXcmFwcGVkID8gb3RoZXIudmFsdWUoKSA6IG90aGVyO1xuXG4gICAgICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICAgICAgcmV0dXJuIGVxdWFsRnVuYyhvYmpVbndyYXBwZWQsIG90aFVud3JhcHBlZCwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spO1xuICAgIH1cbiAgfVxuICBpZiAoIWlzU2FtZVRhZykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBzdGFjayB8fCAoc3RhY2sgPSBuZXcgU3RhY2spO1xuICByZXR1cm4gZXF1YWxPYmplY3RzKG9iamVjdCwgb3RoZXIsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spO1xufVxuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLmlzTWF0Y2hgIHdpdGhvdXQgc3VwcG9ydCBmb3IgaXRlcmF0ZWUgc2hvcnRoYW5kcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGluc3BlY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHBhcmFtIHtBcnJheX0gbWF0Y2hEYXRhIFRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyB0byBtYXRjaC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjdXN0b21pemVyXSBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGBvYmplY3RgIGlzIGEgbWF0Y2gsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSwgY3VzdG9taXplcikge1xuICB2YXIgaW5kZXggPSBtYXRjaERhdGEubGVuZ3RoLFxuICAgICAgbGVuZ3RoID0gaW5kZXgsXG4gICAgICBub0N1c3RvbWl6ZXIgPSAhY3VzdG9taXplcjtcblxuICBpZiAob2JqZWN0ID09IG51bGwpIHtcbiAgICByZXR1cm4gIWxlbmd0aDtcbiAgfVxuICBvYmplY3QgPSBPYmplY3Qob2JqZWN0KTtcbiAgd2hpbGUgKGluZGV4LS0pIHtcbiAgICB2YXIgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgaWYgKChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSlcbiAgICAgICAgICA/IGRhdGFbMV0gIT09IG9iamVjdFtkYXRhWzBdXVxuICAgICAgICAgIDogIShkYXRhWzBdIGluIG9iamVjdClcbiAgICAgICAgKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHdoaWxlICgrK2luZGV4IDwgbGVuZ3RoKSB7XG4gICAgZGF0YSA9IG1hdGNoRGF0YVtpbmRleF07XG4gICAgdmFyIGtleSA9IGRhdGFbMF0sXG4gICAgICAgIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIHNyY1ZhbHVlID0gZGF0YVsxXTtcblxuICAgIGlmIChub0N1c3RvbWl6ZXIgJiYgZGF0YVsyXSkge1xuICAgICAgaWYgKG9ialZhbHVlID09PSB1bmRlZmluZWQgJiYgIShrZXkgaW4gb2JqZWN0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBzdGFjayA9IG5ldyBTdGFjaztcbiAgICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBjdXN0b21pemVyKG9ialZhbHVlLCBzcmNWYWx1ZSwga2V5LCBvYmplY3QsIHNvdXJjZSwgc3RhY2spO1xuICAgICAgfVxuICAgICAgaWYgKCEocmVzdWx0ID09PSB1bmRlZmluZWRcbiAgICAgICAgICAgID8gYmFzZUlzRXF1YWwoc3JjVmFsdWUsIG9ialZhbHVlLCBjdXN0b21pemVyLCBVTk9SREVSRURfQ09NUEFSRV9GTEFHIHwgUEFSVElBTF9DT01QQVJFX0ZMQUcsIHN0YWNrKVxuICAgICAgICAgICAgOiByZXN1bHRcbiAgICAgICAgICApKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXNOYXRpdmVgIHdpdGhvdXQgYmFkIHNoaW0gY2hlY2tzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgbmF0aXZlIGZ1bmN0aW9uLFxuICogIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzTmF0aXZlKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpIHx8IGlzTWFza2VkKHZhbHVlKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICB2YXIgcGF0dGVybiA9IChpc0Z1bmN0aW9uKHZhbHVlKSB8fCBpc0hvc3RPYmplY3QodmFsdWUpKSA/IHJlSXNOYXRpdmUgOiByZUlzSG9zdEN0b3I7XG4gIHJldHVybiBwYXR0ZXJuLnRlc3QodG9Tb3VyY2UodmFsdWUpKTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5pc1R5cGVkQXJyYXlgIHdpdGhvdXQgTm9kZS5qcyBvcHRpbWl6YXRpb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdHlwZWQgYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUlzVHlwZWRBcnJheSh2YWx1ZSkge1xuICByZXR1cm4gaXNPYmplY3RMaWtlKHZhbHVlKSAmJlxuICAgIGlzTGVuZ3RoKHZhbHVlLmxlbmd0aCkgJiYgISF0eXBlZEFycmF5VGFnc1tvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKV07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8uaXRlcmF0ZWVgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IFt2YWx1ZT1fLmlkZW50aXR5XSBUaGUgdmFsdWUgdG8gY29udmVydCB0byBhbiBpdGVyYXRlZS5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgaXRlcmF0ZWUuXG4gKi9cbmZ1bmN0aW9uIGJhc2VJdGVyYXRlZSh2YWx1ZSkge1xuICAvLyBEb24ndCBzdG9yZSB0aGUgYHR5cGVvZmAgcmVzdWx0IGluIGEgdmFyaWFibGUgdG8gYXZvaWQgYSBKSVQgYnVnIGluIFNhZmFyaSA5LlxuICAvLyBTZWUgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTE1NjAzNCBmb3IgbW9yZSBkZXRhaWxzLlxuICBpZiAodHlwZW9mIHZhbHVlID09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICByZXR1cm4gaWRlbnRpdHk7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBpc0FycmF5KHZhbHVlKVxuICAgICAgPyBiYXNlTWF0Y2hlc1Byb3BlcnR5KHZhbHVlWzBdLCB2YWx1ZVsxXSlcbiAgICAgIDogYmFzZU1hdGNoZXModmFsdWUpO1xuICB9XG4gIHJldHVybiBwcm9wZXJ0eSh2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ua2V5c2Agd2hpY2ggZG9lc24ndCB0cmVhdCBzcGFyc2UgYXJyYXlzIGFzIGRlbnNlLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBiYXNlS2V5cyhvYmplY3QpIHtcbiAgaWYgKCFpc1Byb3RvdHlwZShvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG4gIGZvciAodmFyIGtleSBpbiBPYmplY3Qob2JqZWN0KSkge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwga2V5KSAmJiBrZXkgIT0gJ2NvbnN0cnVjdG9yJykge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5rZXlzSW5gIHdoaWNoIGRvZXNuJ3QgdHJlYXQgc3BhcnNlIGFycmF5cyBhcyBkZW5zZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcy5cbiAqL1xuZnVuY3Rpb24gYmFzZUtleXNJbihvYmplY3QpIHtcbiAgaWYgKCFpc09iamVjdChvYmplY3QpKSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXNJbihvYmplY3QpO1xuICB9XG4gIHZhciBpc1Byb3RvID0gaXNQcm90b3R5cGUob2JqZWN0KSxcbiAgICAgIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAodmFyIGtleSBpbiBvYmplY3QpIHtcbiAgICBpZiAoIShrZXkgPT0gJ2NvbnN0cnVjdG9yJyAmJiAoaXNQcm90byB8fCAhaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIGtleSkpKSkge1xuICAgICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiBgXy5tYXRjaGVzYCB3aGljaCBkb2Vzbid0IGNsb25lIGBzb3VyY2VgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gc291cmNlIFRoZSBvYmplY3Qgb2YgcHJvcGVydHkgdmFsdWVzIHRvIG1hdGNoLlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgc3BlYyBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gYmFzZU1hdGNoZXMoc291cmNlKSB7XG4gIHZhciBtYXRjaERhdGEgPSBnZXRNYXRjaERhdGEoc291cmNlKTtcbiAgaWYgKG1hdGNoRGF0YS5sZW5ndGggPT0gMSAmJiBtYXRjaERhdGFbMF1bMl0pIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUobWF0Y2hEYXRhWzBdWzBdLCBtYXRjaERhdGFbMF1bMV0pO1xuICB9XG4gIHJldHVybiBmdW5jdGlvbihvYmplY3QpIHtcbiAgICByZXR1cm4gb2JqZWN0ID09PSBzb3VyY2UgfHwgYmFzZUlzTWF0Y2gob2JqZWN0LCBzb3VyY2UsIG1hdGNoRGF0YSk7XG4gIH07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ubWF0Y2hlc1Byb3BlcnR5YCB3aGljaCBkb2Vzbid0IGNsb25lIGBzcmNWYWx1ZWAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoIFRoZSBwYXRoIG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIGJhc2VNYXRjaGVzUHJvcGVydHkocGF0aCwgc3JjVmFsdWUpIHtcbiAgaWYgKGlzS2V5KHBhdGgpICYmIGlzU3RyaWN0Q29tcGFyYWJsZShzcmNWYWx1ZSkpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1N0cmljdENvbXBhcmFibGUodG9LZXkocGF0aCksIHNyY1ZhbHVlKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgdmFyIG9ialZhbHVlID0gZ2V0KG9iamVjdCwgcGF0aCk7XG4gICAgcmV0dXJuIChvYmpWYWx1ZSA9PT0gdW5kZWZpbmVkICYmIG9ialZhbHVlID09PSBzcmNWYWx1ZSlcbiAgICAgID8gaGFzSW4ob2JqZWN0LCBwYXRoKVxuICAgICAgOiBiYXNlSXNFcXVhbChzcmNWYWx1ZSwgb2JqVmFsdWUsIHVuZGVmaW5lZCwgVU5PUkRFUkVEX0NPTVBBUkVfRkxBRyB8IFBBUlRJQUxfQ09NUEFSRV9GTEFHKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBUaGUgYmFzZSBpbXBsZW1lbnRhdGlvbiBvZiAgYF8ucGlja0J5YCB3aXRob3V0IHN1cHBvcnQgZm9yIGl0ZXJhdGVlIHNob3J0aGFuZHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIHNvdXJjZSBvYmplY3QuXG4gKiBAcGFyYW0ge3N0cmluZ1tdfSBwcm9wcyBUaGUgcHJvcGVydHkgaWRlbnRpZmllcnMgdG8gcGljayBmcm9tLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcHJlZGljYXRlIFRoZSBmdW5jdGlvbiBpbnZva2VkIHBlciBwcm9wZXJ0eS5cbiAqIEByZXR1cm5zIHtPYmplY3R9IFJldHVybnMgdGhlIG5ldyBvYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGJhc2VQaWNrQnkob2JqZWN0LCBwcm9wcywgcHJlZGljYXRlKSB7XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgbGVuZ3RoID0gcHJvcHMubGVuZ3RoLFxuICAgICAgcmVzdWx0ID0ge307XG5cbiAgd2hpbGUgKCsraW5kZXggPCBsZW5ndGgpIHtcbiAgICB2YXIga2V5ID0gcHJvcHNbaW5kZXhdLFxuICAgICAgICB2YWx1ZSA9IG9iamVjdFtrZXldO1xuXG4gICAgaWYgKHByZWRpY2F0ZSh2YWx1ZSwga2V5KSkge1xuICAgICAgcmVzdWx0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBBIHNwZWNpYWxpemVkIHZlcnNpb24gb2YgYGJhc2VQcm9wZXJ0eWAgd2hpY2ggc3VwcG9ydHMgZGVlcCBwYXRocy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiBiYXNlUHJvcGVydHlEZWVwKHBhdGgpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHJldHVybiBiYXNlR2V0KG9iamVjdCwgcGF0aCk7XG4gIH07XG59XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8udG9TdHJpbmdgIHdoaWNoIGRvZXNuJ3QgY29udmVydCBudWxsaXNoXG4gKiB2YWx1ZXMgdG8gZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHN0cmluZy5cbiAqL1xuZnVuY3Rpb24gYmFzZVRvU3RyaW5nKHZhbHVlKSB7XG4gIC8vIEV4aXQgZWFybHkgZm9yIHN0cmluZ3MgdG8gYXZvaWQgYSBwZXJmb3JtYW5jZSBoaXQgaW4gc29tZSBlbnZpcm9ubWVudHMuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBzeW1ib2xUb1N0cmluZyA/IHN5bWJvbFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIH1cbiAgdmFyIHJlc3VsdCA9ICh2YWx1ZSArICcnKTtcbiAgcmV0dXJuIChyZXN1bHQgPT0gJzAnICYmICgxIC8gdmFsdWUpID09IC1JTkZJTklUWSkgPyAnLTAnIDogcmVzdWx0O1xufVxuXG4vKipcbiAqIENhc3RzIGB2YWx1ZWAgdG8gYSBwYXRoIGFycmF5IGlmIGl0J3Mgbm90IG9uZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gaW5zcGVjdC5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgY2FzdCBwcm9wZXJ0eSBwYXRoIGFycmF5LlxuICovXG5mdW5jdGlvbiBjYXN0UGF0aCh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheSh2YWx1ZSkgPyB2YWx1ZSA6IHN0cmluZ1RvUGF0aCh2YWx1ZSk7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBhcnJheXMgd2l0aCBzdXBwb3J0IGZvclxuICogcGFydGlhbCBkZWVwIGNvbXBhcmlzb25zLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBUaGUgYXJyYXkgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7QXJyYXl9IG90aGVyIFRoZSBvdGhlciBhcnJheSB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGBcbiAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYGFycmF5YCBhbmQgYG90aGVyYCBvYmplY3RzLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBhcnJheXMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxBcnJheXMoYXJyYXksIG90aGVyLCBlcXVhbEZ1bmMsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKSB7XG4gIHZhciBpc1BhcnRpYWwgPSBiaXRtYXNrICYgUEFSVElBTF9DT01QQVJFX0ZMQUcsXG4gICAgICBhcnJMZW5ndGggPSBhcnJheS5sZW5ndGgsXG4gICAgICBvdGhMZW5ndGggPSBvdGhlci5sZW5ndGg7XG5cbiAgaWYgKGFyckxlbmd0aCAhPSBvdGhMZW5ndGggJiYgIShpc1BhcnRpYWwgJiYgb3RoTGVuZ3RoID4gYXJyTGVuZ3RoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gIHZhciBzdGFja2VkID0gc3RhY2suZ2V0KGFycmF5KTtcbiAgaWYgKHN0YWNrZWQgJiYgc3RhY2suZ2V0KG90aGVyKSkge1xuICAgIHJldHVybiBzdGFja2VkID09IG90aGVyO1xuICB9XG4gIHZhciBpbmRleCA9IC0xLFxuICAgICAgcmVzdWx0ID0gdHJ1ZSxcbiAgICAgIHNlZW4gPSAoYml0bWFzayAmIFVOT1JERVJFRF9DT01QQVJFX0ZMQUcpID8gbmV3IFNldENhY2hlIDogdW5kZWZpbmVkO1xuXG4gIHN0YWNrLnNldChhcnJheSwgb3RoZXIpO1xuICBzdGFjay5zZXQob3RoZXIsIGFycmF5KTtcblxuICAvLyBJZ25vcmUgbm9uLWluZGV4IHByb3BlcnRpZXMuXG4gIHdoaWxlICgrK2luZGV4IDwgYXJyTGVuZ3RoKSB7XG4gICAgdmFyIGFyclZhbHVlID0gYXJyYXlbaW5kZXhdLFxuICAgICAgICBvdGhWYWx1ZSA9IG90aGVyW2luZGV4XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBhcnJWYWx1ZSwgaW5kZXgsIG90aGVyLCBhcnJheSwgc3RhY2spXG4gICAgICAgIDogY3VzdG9taXplcihhcnJWYWx1ZSwgb3RoVmFsdWUsIGluZGV4LCBhcnJheSwgb3RoZXIsIHN0YWNrKTtcbiAgICB9XG4gICAgaWYgKGNvbXBhcmVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmIChjb21wYXJlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHJlc3VsdCA9IGZhbHNlO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgYXJyYXlzIChzdXNjZXB0aWJsZSB0byBjYWxsIHN0YWNrIGxpbWl0cykuXG4gICAgaWYgKHNlZW4pIHtcbiAgICAgIGlmICghYXJyYXlTb21lKG90aGVyLCBmdW5jdGlvbihvdGhWYWx1ZSwgb3RoSW5kZXgpIHtcbiAgICAgICAgICAgIGlmICghc2Vlbi5oYXMob3RoSW5kZXgpICYmXG4gICAgICAgICAgICAgICAgKGFyclZhbHVlID09PSBvdGhWYWx1ZSB8fCBlcXVhbEZ1bmMoYXJyVmFsdWUsIG90aFZhbHVlLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzZWVuLmFkZChvdGhJbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkpIHtcbiAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoIShcbiAgICAgICAgICBhcnJWYWx1ZSA9PT0gb3RoVmFsdWUgfHxcbiAgICAgICAgICAgIGVxdWFsRnVuYyhhcnJWYWx1ZSwgb3RoVmFsdWUsIGN1c3RvbWl6ZXIsIGJpdG1hc2ssIHN0YWNrKVxuICAgICAgICApKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICBzdGFja1snZGVsZXRlJ10oYXJyYXkpO1xuICBzdGFja1snZGVsZXRlJ10ob3RoZXIpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUlzRXF1YWxEZWVwYCBmb3IgY29tcGFyaW5nIG9iamVjdHMgb2ZcbiAqIHRoZSBzYW1lIGB0b1N0cmluZ1RhZ2AuXG4gKlxuICogKipOb3RlOioqIFRoaXMgZnVuY3Rpb24gb25seSBzdXBwb3J0cyBjb21wYXJpbmcgdmFsdWVzIHdpdGggdGFncyBvZlxuICogYEJvb2xlYW5gLCBgRGF0ZWAsIGBFcnJvcmAsIGBOdW1iZXJgLCBgUmVnRXhwYCwgb3IgYFN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtPYmplY3R9IG90aGVyIFRoZSBvdGhlciBvYmplY3QgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0YWcgVGhlIGB0b1N0cmluZ1RhZ2Agb2YgdGhlIG9iamVjdHMgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGVxdWFsRnVuYyBUaGUgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lIGVxdWl2YWxlbnRzIG9mIHZhbHVlcy5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGN1c3RvbWl6ZXIgVGhlIGZ1bmN0aW9uIHRvIGN1c3RvbWl6ZSBjb21wYXJpc29ucy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBiaXRtYXNrIFRoZSBiaXRtYXNrIG9mIGNvbXBhcmlzb24gZmxhZ3MuIFNlZSBgYmFzZUlzRXF1YWxgXG4gKiAgZm9yIG1vcmUgZGV0YWlscy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdGFjayBUcmFja3MgdHJhdmVyc2VkIGBvYmplY3RgIGFuZCBgb3RoZXJgIG9iamVjdHMuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxCeVRhZyhvYmplY3QsIG90aGVyLCB0YWcsIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spIHtcbiAgc3dpdGNoICh0YWcpIHtcbiAgICBjYXNlIGRhdGFWaWV3VGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgIChvYmplY3QuYnl0ZU9mZnNldCAhPSBvdGhlci5ieXRlT2Zmc2V0KSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICBvYmplY3QgPSBvYmplY3QuYnVmZmVyO1xuICAgICAgb3RoZXIgPSBvdGhlci5idWZmZXI7XG5cbiAgICBjYXNlIGFycmF5QnVmZmVyVGFnOlxuICAgICAgaWYgKChvYmplY3QuYnl0ZUxlbmd0aCAhPSBvdGhlci5ieXRlTGVuZ3RoKSB8fFxuICAgICAgICAgICFlcXVhbEZ1bmMobmV3IFVpbnQ4QXJyYXkob2JqZWN0KSwgbmV3IFVpbnQ4QXJyYXkob3RoZXIpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGNhc2UgYm9vbFRhZzpcbiAgICBjYXNlIGRhdGVUYWc6XG4gICAgY2FzZSBudW1iZXJUYWc6XG4gICAgICAvLyBDb2VyY2UgYm9vbGVhbnMgdG8gYDFgIG9yIGAwYCBhbmQgZGF0ZXMgdG8gbWlsbGlzZWNvbmRzLlxuICAgICAgLy8gSW52YWxpZCBkYXRlcyBhcmUgY29lcmNlZCB0byBgTmFOYC5cbiAgICAgIHJldHVybiBlcSgrb2JqZWN0LCArb3RoZXIpO1xuXG4gICAgY2FzZSBlcnJvclRhZzpcbiAgICAgIHJldHVybiBvYmplY3QubmFtZSA9PSBvdGhlci5uYW1lICYmIG9iamVjdC5tZXNzYWdlID09IG90aGVyLm1lc3NhZ2U7XG5cbiAgICBjYXNlIHJlZ2V4cFRhZzpcbiAgICBjYXNlIHN0cmluZ1RhZzpcbiAgICAgIC8vIENvZXJjZSByZWdleGVzIHRvIHN0cmluZ3MgYW5kIHRyZWF0IHN0cmluZ3MsIHByaW1pdGl2ZXMgYW5kIG9iamVjdHMsXG4gICAgICAvLyBhcyBlcXVhbC4gU2VlIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG4gICAgICAvLyBmb3IgbW9yZSBkZXRhaWxzLlxuICAgICAgcmV0dXJuIG9iamVjdCA9PSAob3RoZXIgKyAnJyk7XG5cbiAgICBjYXNlIG1hcFRhZzpcbiAgICAgIHZhciBjb252ZXJ0ID0gbWFwVG9BcnJheTtcblxuICAgIGNhc2Ugc2V0VGFnOlxuICAgICAgdmFyIGlzUGFydGlhbCA9IGJpdG1hc2sgJiBQQVJUSUFMX0NPTVBBUkVfRkxBRztcbiAgICAgIGNvbnZlcnQgfHwgKGNvbnZlcnQgPSBzZXRUb0FycmF5KTtcblxuICAgICAgaWYgKG9iamVjdC5zaXplICE9IG90aGVyLnNpemUgJiYgIWlzUGFydGlhbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyBBc3N1bWUgY3ljbGljIHZhbHVlcyBhcmUgZXF1YWwuXG4gICAgICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICAgICAgaWYgKHN0YWNrZWQpIHtcbiAgICAgICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gICAgICB9XG4gICAgICBiaXRtYXNrIHw9IFVOT1JERVJFRF9DT01QQVJFX0ZMQUc7XG5cbiAgICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgICAgc3RhY2suc2V0KG9iamVjdCwgb3RoZXIpO1xuICAgICAgdmFyIHJlc3VsdCA9IGVxdWFsQXJyYXlzKGNvbnZlcnQob2JqZWN0KSwgY29udmVydChvdGhlciksIGVxdWFsRnVuYywgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spO1xuICAgICAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuXG4gICAgY2FzZSBzeW1ib2xUYWc6XG4gICAgICBpZiAoc3ltYm9sVmFsdWVPZikge1xuICAgICAgICByZXR1cm4gc3ltYm9sVmFsdWVPZi5jYWxsKG9iamVjdCkgPT0gc3ltYm9sVmFsdWVPZi5jYWxsKG90aGVyKTtcbiAgICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlSXNFcXVhbERlZXBgIGZvciBvYmplY3RzIHdpdGggc3VwcG9ydCBmb3JcbiAqIHBhcnRpYWwgZGVlcCBjb21wYXJpc29ucy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIGNvbXBhcmUuXG4gKiBAcGFyYW0ge09iamVjdH0gb3RoZXIgVGhlIG90aGVyIG9iamVjdCB0byBjb21wYXJlLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZXF1YWxGdW5jIFRoZSBmdW5jdGlvbiB0byBkZXRlcm1pbmUgZXF1aXZhbGVudHMgb2YgdmFsdWVzLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gY3VzdG9taXplciBUaGUgZnVuY3Rpb24gdG8gY3VzdG9taXplIGNvbXBhcmlzb25zLlxuICogQHBhcmFtIHtudW1iZXJ9IGJpdG1hc2sgVGhlIGJpdG1hc2sgb2YgY29tcGFyaXNvbiBmbGFncy4gU2VlIGBiYXNlSXNFcXVhbGBcbiAqICBmb3IgbW9yZSBkZXRhaWxzLlxuICogQHBhcmFtIHtPYmplY3R9IHN0YWNrIFRyYWNrcyB0cmF2ZXJzZWQgYG9iamVjdGAgYW5kIGBvdGhlcmAgb2JqZWN0cy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0cyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbE9iamVjdHMob2JqZWN0LCBvdGhlciwgZXF1YWxGdW5jLCBjdXN0b21pemVyLCBiaXRtYXNrLCBzdGFjaykge1xuICB2YXIgaXNQYXJ0aWFsID0gYml0bWFzayAmIFBBUlRJQUxfQ09NUEFSRV9GTEFHLFxuICAgICAgb2JqUHJvcHMgPSBrZXlzKG9iamVjdCksXG4gICAgICBvYmpMZW5ndGggPSBvYmpQcm9wcy5sZW5ndGgsXG4gICAgICBvdGhQcm9wcyA9IGtleXMob3RoZXIpLFxuICAgICAgb3RoTGVuZ3RoID0gb3RoUHJvcHMubGVuZ3RoO1xuXG4gIGlmIChvYmpMZW5ndGggIT0gb3RoTGVuZ3RoICYmICFpc1BhcnRpYWwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIGluZGV4ID0gb2JqTGVuZ3RoO1xuICB3aGlsZSAoaW5kZXgtLSkge1xuICAgIHZhciBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgaWYgKCEoaXNQYXJ0aWFsID8ga2V5IGluIG90aGVyIDogaGFzT3duUHJvcGVydHkuY2FsbChvdGhlciwga2V5KSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgLy8gQXNzdW1lIGN5Y2xpYyB2YWx1ZXMgYXJlIGVxdWFsLlxuICB2YXIgc3RhY2tlZCA9IHN0YWNrLmdldChvYmplY3QpO1xuICBpZiAoc3RhY2tlZCAmJiBzdGFjay5nZXQob3RoZXIpKSB7XG4gICAgcmV0dXJuIHN0YWNrZWQgPT0gb3RoZXI7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IHRydWU7XG4gIHN0YWNrLnNldChvYmplY3QsIG90aGVyKTtcbiAgc3RhY2suc2V0KG90aGVyLCBvYmplY3QpO1xuXG4gIHZhciBza2lwQ3RvciA9IGlzUGFydGlhbDtcbiAgd2hpbGUgKCsraW5kZXggPCBvYmpMZW5ndGgpIHtcbiAgICBrZXkgPSBvYmpQcm9wc1tpbmRleF07XG4gICAgdmFyIG9ialZhbHVlID0gb2JqZWN0W2tleV0sXG4gICAgICAgIG90aFZhbHVlID0gb3RoZXJba2V5XTtcblxuICAgIGlmIChjdXN0b21pemVyKSB7XG4gICAgICB2YXIgY29tcGFyZWQgPSBpc1BhcnRpYWxcbiAgICAgICAgPyBjdXN0b21pemVyKG90aFZhbHVlLCBvYmpWYWx1ZSwga2V5LCBvdGhlciwgb2JqZWN0LCBzdGFjaylcbiAgICAgICAgOiBjdXN0b21pemVyKG9ialZhbHVlLCBvdGhWYWx1ZSwga2V5LCBvYmplY3QsIG90aGVyLCBzdGFjayk7XG4gICAgfVxuICAgIC8vIFJlY3Vyc2l2ZWx5IGNvbXBhcmUgb2JqZWN0cyAoc3VzY2VwdGlibGUgdG8gY2FsbCBzdGFjayBsaW1pdHMpLlxuICAgIGlmICghKGNvbXBhcmVkID09PSB1bmRlZmluZWRcbiAgICAgICAgICA/IChvYmpWYWx1ZSA9PT0gb3RoVmFsdWUgfHwgZXF1YWxGdW5jKG9ialZhbHVlLCBvdGhWYWx1ZSwgY3VzdG9taXplciwgYml0bWFzaywgc3RhY2spKVxuICAgICAgICAgIDogY29tcGFyZWRcbiAgICAgICAgKSkge1xuICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgc2tpcEN0b3IgfHwgKHNraXBDdG9yID0ga2V5ID09ICdjb25zdHJ1Y3RvcicpO1xuICB9XG4gIGlmIChyZXN1bHQgJiYgIXNraXBDdG9yKSB7XG4gICAgdmFyIG9iakN0b3IgPSBvYmplY3QuY29uc3RydWN0b3IsXG4gICAgICAgIG90aEN0b3IgPSBvdGhlci5jb25zdHJ1Y3RvcjtcblxuICAgIC8vIE5vbiBgT2JqZWN0YCBvYmplY3QgaW5zdGFuY2VzIHdpdGggZGlmZmVyZW50IGNvbnN0cnVjdG9ycyBhcmUgbm90IGVxdWFsLlxuICAgIGlmIChvYmpDdG9yICE9IG90aEN0b3IgJiZcbiAgICAgICAgKCdjb25zdHJ1Y3RvcicgaW4gb2JqZWN0ICYmICdjb25zdHJ1Y3RvcicgaW4gb3RoZXIpICYmXG4gICAgICAgICEodHlwZW9mIG9iakN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBvYmpDdG9yIGluc3RhbmNlb2Ygb2JqQ3RvciAmJlxuICAgICAgICAgIHR5cGVvZiBvdGhDdG9yID09ICdmdW5jdGlvbicgJiYgb3RoQ3RvciBpbnN0YW5jZW9mIG90aEN0b3IpKSB7XG4gICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgc3RhY2tbJ2RlbGV0ZSddKG9iamVjdCk7XG4gIHN0YWNrWydkZWxldGUnXShvdGhlcik7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiBvd24gYW5kIGluaGVyaXRlZCBlbnVtZXJhYmxlIHByb3BlcnR5IG5hbWVzIGFuZFxuICogc3ltYm9scyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBhcnJheSBvZiBwcm9wZXJ0eSBuYW1lcyBhbmQgc3ltYm9scy5cbiAqL1xuZnVuY3Rpb24gZ2V0QWxsS2V5c0luKG9iamVjdCkge1xuICByZXR1cm4gYmFzZUdldEFsbEtleXMob2JqZWN0LCBrZXlzSW4sIGdldFN5bWJvbHNJbik7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgZGF0YSBmb3IgYG1hcGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBtYXAgVGhlIG1hcCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgVGhlIHJlZmVyZW5jZSBrZXkuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgbWFwIGRhdGEuXG4gKi9cbmZ1bmN0aW9uIGdldE1hcERhdGEobWFwLCBrZXkpIHtcbiAgdmFyIGRhdGEgPSBtYXAuX19kYXRhX187XG4gIHJldHVybiBpc0tleWFibGUoa2V5KVxuICAgID8gZGF0YVt0eXBlb2Yga2V5ID09ICdzdHJpbmcnID8gJ3N0cmluZycgOiAnaGFzaCddXG4gICAgOiBkYXRhLm1hcDtcbn1cblxuLyoqXG4gKiBHZXRzIHRoZSBwcm9wZXJ0eSBuYW1lcywgdmFsdWVzLCBhbmQgY29tcGFyZSBmbGFncyBvZiBgb2JqZWN0YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHJldHVybnMge0FycmF5fSBSZXR1cm5zIHRoZSBtYXRjaCBkYXRhIG9mIGBvYmplY3RgLlxuICovXG5mdW5jdGlvbiBnZXRNYXRjaERhdGEob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBrZXlzKG9iamVjdCksXG4gICAgICBsZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuXG4gIHdoaWxlIChsZW5ndGgtLSkge1xuICAgIHZhciBrZXkgPSByZXN1bHRbbGVuZ3RoXSxcbiAgICAgICAgdmFsdWUgPSBvYmplY3Rba2V5XTtcblxuICAgIHJlc3VsdFtsZW5ndGhdID0gW2tleSwgdmFsdWUsIGlzU3RyaWN0Q29tcGFyYWJsZSh2YWx1ZSldO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogR2V0cyB0aGUgbmF0aXZlIGZ1bmN0aW9uIGF0IGBrZXlgIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFRoZSBrZXkgb2YgdGhlIG1ldGhvZCB0byBnZXQuXG4gKiBAcmV0dXJucyB7Kn0gUmV0dXJucyB0aGUgZnVuY3Rpb24gaWYgaXQncyBuYXRpdmUsIGVsc2UgYHVuZGVmaW5lZGAuXG4gKi9cbmZ1bmN0aW9uIGdldE5hdGl2ZShvYmplY3QsIGtleSkge1xuICB2YXIgdmFsdWUgPSBnZXRWYWx1ZShvYmplY3QsIGtleSk7XG4gIHJldHVybiBiYXNlSXNOYXRpdmUodmFsdWUpID8gdmFsdWUgOiB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGVudW1lcmFibGUgc3ltYm9sIHByb3BlcnRpZXMgb2YgYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgYXJyYXkgb2Ygc3ltYm9scy5cbiAqL1xudmFyIGdldFN5bWJvbHMgPSBuYXRpdmVHZXRTeW1ib2xzID8gb3ZlckFyZyhuYXRpdmVHZXRTeW1ib2xzLCBPYmplY3QpIDogc3R1YkFycmF5O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gYXJyYXkgb2YgdGhlIG93biBhbmQgaW5oZXJpdGVkIGVudW1lcmFibGUgc3ltYm9sIHByb3BlcnRpZXNcbiAqIG9mIGBvYmplY3RgLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHN5bWJvbHMuXG4gKi9cbnZhciBnZXRTeW1ib2xzSW4gPSAhbmF0aXZlR2V0U3ltYm9scyA/IHN0dWJBcnJheSA6IGZ1bmN0aW9uKG9iamVjdCkge1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHdoaWxlIChvYmplY3QpIHtcbiAgICBhcnJheVB1c2gocmVzdWx0LCBnZXRTeW1ib2xzKG9iamVjdCkpO1xuICAgIG9iamVjdCA9IGdldFByb3RvdHlwZShvYmplY3QpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG4vKipcbiAqIEdldHMgdGhlIGB0b1N0cmluZ1RhZ2Agb2YgYHZhbHVlYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG52YXIgZ2V0VGFnID0gYmFzZUdldFRhZztcblxuLy8gRmFsbGJhY2sgZm9yIGRhdGEgdmlld3MsIG1hcHMsIHNldHMsIGFuZCB3ZWFrIG1hcHMgaW4gSUUgMTEsXG4vLyBmb3IgZGF0YSB2aWV3cyBpbiBFZGdlIDwgMTQsIGFuZCBwcm9taXNlcyBpbiBOb2RlLmpzLlxuaWYgKChEYXRhVmlldyAmJiBnZXRUYWcobmV3IERhdGFWaWV3KG5ldyBBcnJheUJ1ZmZlcigxKSkpICE9IGRhdGFWaWV3VGFnKSB8fFxuICAgIChNYXAgJiYgZ2V0VGFnKG5ldyBNYXApICE9IG1hcFRhZykgfHxcbiAgICAoUHJvbWlzZSAmJiBnZXRUYWcoUHJvbWlzZS5yZXNvbHZlKCkpICE9IHByb21pc2VUYWcpIHx8XG4gICAgKFNldCAmJiBnZXRUYWcobmV3IFNldCkgIT0gc2V0VGFnKSB8fFxuICAgIChXZWFrTWFwICYmIGdldFRhZyhuZXcgV2Vha01hcCkgIT0gd2Vha01hcFRhZykpIHtcbiAgZ2V0VGFnID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICB2YXIgcmVzdWx0ID0gb2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSksXG4gICAgICAgIEN0b3IgPSByZXN1bHQgPT0gb2JqZWN0VGFnID8gdmFsdWUuY29uc3RydWN0b3IgOiB1bmRlZmluZWQsXG4gICAgICAgIGN0b3JTdHJpbmcgPSBDdG9yID8gdG9Tb3VyY2UoQ3RvcikgOiB1bmRlZmluZWQ7XG5cbiAgICBpZiAoY3RvclN0cmluZykge1xuICAgICAgc3dpdGNoIChjdG9yU3RyaW5nKSB7XG4gICAgICAgIGNhc2UgZGF0YVZpZXdDdG9yU3RyaW5nOiByZXR1cm4gZGF0YVZpZXdUYWc7XG4gICAgICAgIGNhc2UgbWFwQ3RvclN0cmluZzogcmV0dXJuIG1hcFRhZztcbiAgICAgICAgY2FzZSBwcm9taXNlQ3RvclN0cmluZzogcmV0dXJuIHByb21pc2VUYWc7XG4gICAgICAgIGNhc2Ugc2V0Q3RvclN0cmluZzogcmV0dXJuIHNldFRhZztcbiAgICAgICAgY2FzZSB3ZWFrTWFwQ3RvclN0cmluZzogcmV0dXJuIHdlYWtNYXBUYWc7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBleGlzdHMgb24gYG9iamVjdGAuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEBwYXJhbSB7QXJyYXl8c3RyaW5nfSBwYXRoIFRoZSBwYXRoIHRvIGNoZWNrLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gaGFzRnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2sgcHJvcGVydGllcy5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgcGF0aGAgZXhpc3RzLCBlbHNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGhhc1BhdGgob2JqZWN0LCBwYXRoLCBoYXNGdW5jKSB7XG4gIHBhdGggPSBpc0tleShwYXRoLCBvYmplY3QpID8gW3BhdGhdIDogY2FzdFBhdGgocGF0aCk7XG5cbiAgdmFyIHJlc3VsdCxcbiAgICAgIGluZGV4ID0gLTEsXG4gICAgICBsZW5ndGggPSBwYXRoLmxlbmd0aDtcblxuICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgIHZhciBrZXkgPSB0b0tleShwYXRoW2luZGV4XSk7XG4gICAgaWYgKCEocmVzdWx0ID0gb2JqZWN0ICE9IG51bGwgJiYgaGFzRnVuYyhvYmplY3QsIGtleSkpKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gICAgb2JqZWN0ID0gb2JqZWN0W2tleV07XG4gIH1cbiAgaWYgKHJlc3VsdCkge1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgdmFyIGxlbmd0aCA9IG9iamVjdCA/IG9iamVjdC5sZW5ndGggOiAwO1xuICByZXR1cm4gISFsZW5ndGggJiYgaXNMZW5ndGgobGVuZ3RoKSAmJiBpc0luZGV4KGtleSwgbGVuZ3RoKSAmJlxuICAgIChpc0FycmF5KG9iamVjdCkgfHwgaXNBcmd1bWVudHMob2JqZWN0KSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSBwcm9wZXJ0eSBuYW1lIGFuZCBub3QgYSBwcm9wZXJ0eSBwYXRoLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb2JqZWN0XSBUaGUgb2JqZWN0IHRvIHF1ZXJ5IGtleXMgb24uXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3BlcnR5IG5hbWUsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNLZXkodmFsdWUsIG9iamVjdCkge1xuICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIGlmICh0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicgfHxcbiAgICAgIHZhbHVlID09IG51bGwgfHwgaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgcmV0dXJuIHJlSXNQbGFpblByb3AudGVzdCh2YWx1ZSkgfHwgIXJlSXNEZWVwUHJvcC50ZXN0KHZhbHVlKSB8fFxuICAgIChvYmplY3QgIT0gbnVsbCAmJiB2YWx1ZSBpbiBPYmplY3Qob2JqZWN0KSk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgc3VpdGFibGUgZm9yIHVzZSBhcyB1bmlxdWUgb2JqZWN0IGtleS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0tleWFibGUodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAodHlwZSA9PSAnc3RyaW5nJyB8fCB0eXBlID09ICdudW1iZXInIHx8IHR5cGUgPT0gJ3N5bWJvbCcgfHwgdHlwZSA9PSAnYm9vbGVhbicpXG4gICAgPyAodmFsdWUgIT09ICdfX3Byb3RvX18nKVxuICAgIDogKHZhbHVlID09PSBudWxsKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYGZ1bmNgIGhhcyBpdHMgc291cmNlIG1hc2tlZC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYGZ1bmNgIGlzIG1hc2tlZCwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc01hc2tlZChmdW5jKSB7XG4gIHJldHVybiAhIW1hc2tTcmNLZXkgJiYgKG1hc2tTcmNLZXkgaW4gZnVuYyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgbGlrZWx5IGEgcHJvdG90eXBlIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHByb3RvdHlwZSwgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1Byb3RvdHlwZSh2YWx1ZSkge1xuICB2YXIgQ3RvciA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yLFxuICAgICAgcHJvdG8gPSAodHlwZW9mIEN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBDdG9yLnByb3RvdHlwZSkgfHwgb2JqZWN0UHJvdG87XG5cbiAgcmV0dXJuIHZhbHVlID09PSBwcm90bztcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBzdWl0YWJsZSBmb3Igc3RyaWN0IGVxdWFsaXR5IGNvbXBhcmlzb25zLCBpLmUuIGA9PT1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlmIHN1aXRhYmxlIGZvciBzdHJpY3RcbiAqICBlcXVhbGl0eSBjb21wYXJpc29ucywgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc1N0cmljdENvbXBhcmFibGUodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSAmJiAhaXNPYmplY3QodmFsdWUpO1xufVxuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgbWF0Y2hlc1Byb3BlcnR5YCBmb3Igc291cmNlIHZhbHVlcyBzdWl0YWJsZVxuICogZm9yIHN0cmljdCBlcXVhbGl0eSBjb21wYXJpc29ucywgaS5lLiBgPT09YC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBUaGUga2V5IG9mIHRoZSBwcm9wZXJ0eSB0byBnZXQuXG4gKiBAcGFyYW0geyp9IHNyY1ZhbHVlIFRoZSB2YWx1ZSB0byBtYXRjaC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IHNwZWMgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uIG1hdGNoZXNTdHJpY3RDb21wYXJhYmxlKGtleSwgc3JjVmFsdWUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIGlmIChvYmplY3QgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gb2JqZWN0W2tleV0gPT09IHNyY1ZhbHVlICYmXG4gICAgICAoc3JjVmFsdWUgIT09IHVuZGVmaW5lZCB8fCAoa2V5IGluIE9iamVjdChvYmplY3QpKSk7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBpcyBsaWtlXG4gKiBbYE9iamVjdC5rZXlzYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LmtleXMpXG4gKiBleGNlcHQgdGhhdCBpdCBpbmNsdWRlcyBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0aWVzLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICovXG5mdW5jdGlvbiBuYXRpdmVLZXlzSW4ob2JqZWN0KSB7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKG9iamVjdCAhPSBudWxsKSB7XG4gICAgZm9yICh2YXIga2V5IGluIE9iamVjdChvYmplY3QpKSB7XG4gICAgICByZXN1bHQucHVzaChrZXkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGBzdHJpbmdgIHRvIGEgcHJvcGVydHkgcGF0aCBhcnJheS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtzdHJpbmd9IHN0cmluZyBUaGUgc3RyaW5nIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIHByb3BlcnR5IHBhdGggYXJyYXkuXG4gKi9cbnZhciBzdHJpbmdUb1BhdGggPSBtZW1vaXplKGZ1bmN0aW9uKHN0cmluZykge1xuICBzdHJpbmcgPSB0b1N0cmluZyhzdHJpbmcpO1xuXG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWYgKHJlTGVhZGluZ0RvdC50ZXN0KHN0cmluZykpIHtcbiAgICByZXN1bHQucHVzaCgnJyk7XG4gIH1cbiAgc3RyaW5nLnJlcGxhY2UocmVQcm9wTmFtZSwgZnVuY3Rpb24obWF0Y2gsIG51bWJlciwgcXVvdGUsIHN0cmluZykge1xuICAgIHJlc3VsdC5wdXNoKHF1b3RlID8gc3RyaW5nLnJlcGxhY2UocmVFc2NhcGVDaGFyLCAnJDEnKSA6IChudW1iZXIgfHwgbWF0Y2gpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59KTtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIGtleSBpZiBpdCdzIG5vdCBhIHN0cmluZyBvciBzeW1ib2wuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGluc3BlY3QuXG4gKiBAcmV0dXJucyB7c3RyaW5nfHN5bWJvbH0gUmV0dXJucyB0aGUga2V5LlxuICovXG5mdW5jdGlvbiB0b0tleSh2YWx1ZSkge1xuICBpZiAodHlwZW9mIHZhbHVlID09ICdzdHJpbmcnIHx8IGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gKHZhbHVlICsgJycpO1xuICByZXR1cm4gKHJlc3VsdCA9PSAnMCcgJiYgKDEgLyB2YWx1ZSkgPT0gLUlORklOSVRZKSA/ICctMCcgOiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ29udmVydHMgYGZ1bmNgIHRvIGl0cyBzb3VyY2UgY29kZS5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gcHJvY2Vzcy5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHNvdXJjZSBjb2RlLlxuICovXG5mdW5jdGlvbiB0b1NvdXJjZShmdW5jKSB7XG4gIGlmIChmdW5jICE9IG51bGwpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGZ1bmNUb1N0cmluZy5jYWxsKGZ1bmMpO1xuICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoZnVuYyArICcnKTtcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBtZW1vaXplcyB0aGUgcmVzdWx0IG9mIGBmdW5jYC4gSWYgYHJlc29sdmVyYCBpc1xuICogcHJvdmlkZWQsIGl0IGRldGVybWluZXMgdGhlIGNhY2hlIGtleSBmb3Igc3RvcmluZyB0aGUgcmVzdWx0IGJhc2VkIG9uIHRoZVxuICogYXJndW1lbnRzIHByb3ZpZGVkIHRvIHRoZSBtZW1vaXplZCBmdW5jdGlvbi4gQnkgZGVmYXVsdCwgdGhlIGZpcnN0IGFyZ3VtZW50XG4gKiBwcm92aWRlZCB0byB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24gaXMgdXNlZCBhcyB0aGUgbWFwIGNhY2hlIGtleS4gVGhlIGBmdW5jYFxuICogaXMgaW52b2tlZCB3aXRoIHRoZSBgdGhpc2AgYmluZGluZyBvZiB0aGUgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKlxuICogKipOb3RlOioqIFRoZSBjYWNoZSBpcyBleHBvc2VkIGFzIHRoZSBgY2FjaGVgIHByb3BlcnR5IG9uIHRoZSBtZW1vaXplZFxuICogZnVuY3Rpb24uIEl0cyBjcmVhdGlvbiBtYXkgYmUgY3VzdG9taXplZCBieSByZXBsYWNpbmcgdGhlIGBfLm1lbW9pemUuQ2FjaGVgXG4gKiBjb25zdHJ1Y3RvciB3aXRoIG9uZSB3aG9zZSBpbnN0YW5jZXMgaW1wbGVtZW50IHRoZVxuICogW2BNYXBgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1wcm9wZXJ0aWVzLW9mLXRoZS1tYXAtcHJvdG90eXBlLW9iamVjdClcbiAqIG1ldGhvZCBpbnRlcmZhY2Ugb2YgYGRlbGV0ZWAsIGBnZXRgLCBgaGFzYCwgYW5kIGBzZXRgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZnVuYyBUaGUgZnVuY3Rpb24gdG8gaGF2ZSBpdHMgb3V0cHV0IG1lbW9pemVkLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Jlc29sdmVyXSBUaGUgZnVuY3Rpb24gdG8gcmVzb2x2ZSB0aGUgY2FjaGUga2V5LlxuICogQHJldHVybnMge0Z1bmN0aW9ufSBSZXR1cm5zIHRoZSBuZXcgbWVtb2l6ZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSwgJ2InOiAyIH07XG4gKiB2YXIgb3RoZXIgPSB7ICdjJzogMywgJ2QnOiA0IH07XG4gKlxuICogdmFyIHZhbHVlcyA9IF8ubWVtb2l6ZShfLnZhbHVlcyk7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIHZhbHVlcyhvdGhlcik7XG4gKiAvLyA9PiBbMywgNF1cbiAqXG4gKiBvYmplY3QuYSA9IDI7XG4gKiB2YWx1ZXMob2JqZWN0KTtcbiAqIC8vID0+IFsxLCAyXVxuICpcbiAqIC8vIE1vZGlmeSB0aGUgcmVzdWx0IGNhY2hlLlxuICogdmFsdWVzLmNhY2hlLnNldChvYmplY3QsIFsnYScsICdiJ10pO1xuICogdmFsdWVzKG9iamVjdCk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddXG4gKlxuICogLy8gUmVwbGFjZSBgXy5tZW1vaXplLkNhY2hlYC5cbiAqIF8ubWVtb2l6ZS5DYWNoZSA9IFdlYWtNYXA7XG4gKi9cbmZ1bmN0aW9uIG1lbW9pemUoZnVuYywgcmVzb2x2ZXIpIHtcbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicgfHwgKHJlc29sdmVyICYmIHR5cGVvZiByZXNvbHZlciAhPSAnZnVuY3Rpb24nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoRlVOQ19FUlJPUl9URVhUKTtcbiAgfVxuICB2YXIgbWVtb2l6ZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgYXJncyA9IGFyZ3VtZW50cyxcbiAgICAgICAga2V5ID0gcmVzb2x2ZXIgPyByZXNvbHZlci5hcHBseSh0aGlzLCBhcmdzKSA6IGFyZ3NbMF0sXG4gICAgICAgIGNhY2hlID0gbWVtb2l6ZWQuY2FjaGU7XG5cbiAgICBpZiAoY2FjaGUuaGFzKGtleSkpIHtcbiAgICAgIHJldHVybiBjYWNoZS5nZXQoa2V5KTtcbiAgICB9XG4gICAgdmFyIHJlc3VsdCA9IGZ1bmMuYXBwbHkodGhpcywgYXJncyk7XG4gICAgbWVtb2l6ZWQuY2FjaGUgPSBjYWNoZS5zZXQoa2V5LCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIG1lbW9pemVkLmNhY2hlID0gbmV3IChtZW1vaXplLkNhY2hlIHx8IE1hcENhY2hlKTtcbiAgcmV0dXJuIG1lbW9pemVkO1xufVxuXG4vLyBBc3NpZ24gY2FjaGUgdG8gYF8ubWVtb2l6ZWAuXG5tZW1vaXplLkNhY2hlID0gTWFwQ2FjaGU7XG5cbi8qKlxuICogUGVyZm9ybXMgYVxuICogW2BTYW1lVmFsdWVaZXJvYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtc2FtZXZhbHVlemVybylcbiAqIGNvbXBhcmlzb24gYmV0d2VlbiB0d28gdmFsdWVzIHRvIGRldGVybWluZSBpZiB0aGV5IGFyZSBlcXVpdmFsZW50LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb21wYXJlLlxuICogQHBhcmFtIHsqfSBvdGhlciBUaGUgb3RoZXIgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgdmFsdWVzIGFyZSBlcXVpdmFsZW50LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICogdmFyIG90aGVyID0geyAnYSc6IDEgfTtcbiAqXG4gKiBfLmVxKG9iamVjdCwgb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKG9iamVjdCwgb3RoZXIpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKCdhJywgJ2EnKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmVxKCdhJywgT2JqZWN0KCdhJykpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmVxKE5hTiwgTmFOKTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gZXEodmFsdWUsIG90aGVyKSB7XG4gIHJldHVybiB2YWx1ZSA9PT0gb3RoZXIgfHwgKHZhbHVlICE9PSB2YWx1ZSAmJiBvdGhlciAhPT0gb3RoZXIpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGxpa2VseSBhbiBgYXJndW1lbnRzYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYGFyZ3VtZW50c2Agb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FyZ3VtZW50cyhmdW5jdGlvbigpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzQXJndW1lbnRzKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0FyZ3VtZW50cyh2YWx1ZSkge1xuICAvLyBTYWZhcmkgOC4xIG1ha2VzIGBhcmd1bWVudHMuY2FsbGVlYCBlbnVtZXJhYmxlIGluIHN0cmljdCBtb2RlLlxuICByZXR1cm4gaXNBcnJheUxpa2VPYmplY3QodmFsdWUpICYmIGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsICdjYWxsZWUnKSAmJlxuICAgICghcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh2YWx1ZSwgJ2NhbGxlZScpIHx8IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpID09IGFyZ3NUYWcpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYW4gYEFycmF5YCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYW4gYXJyYXksIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5KGRvY3VtZW50LmJvZHkuY2hpbGRyZW4pO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoJ2FiYycpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzQXJyYXkoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgaXMgbGlrZSBgXy5pc0FycmF5TGlrZWAgZXhjZXB0IHRoYXQgaXQgYWxzbyBjaGVja3MgaWYgYHZhbHVlYFxuICogaXMgYW4gb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIGFycmF5LWxpa2Ugb2JqZWN0LFxuICogIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZU9iamVjdCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICpcbiAqIF8uaXNBcnJheUxpa2VPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlT2JqZWN0KHZhbHVlKSB7XG4gIHJldHVybiBpc09iamVjdExpa2UodmFsdWUpICYmIGlzQXJyYXlMaWtlKHZhbHVlKTtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYEZ1bmN0aW9uYCBvYmplY3QuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSBmdW5jdGlvbiwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzRnVuY3Rpb24oXyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0Z1bmN0aW9uKC9hYmMvKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzRnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gVGhlIHVzZSBvZiBgT2JqZWN0I3RvU3RyaW5nYCBhdm9pZHMgaXNzdWVzIHdpdGggdGhlIGB0eXBlb2ZgIG9wZXJhdG9yXG4gIC8vIGluIFNhZmFyaSA4LTkgd2hpY2ggcmV0dXJucyAnb2JqZWN0JyBmb3IgdHlwZWQgYXJyYXkgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGlzT2JqZWN0KHZhbHVlKSA/IG9iamVjdFRvU3RyaW5nLmNhbGwodmFsdWUpIDogJyc7XG4gIHJldHVybiB0YWcgPT0gZnVuY1RhZyB8fCB0YWcgPT0gZ2VuVGFnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiAhIXZhbHVlICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UuIEEgdmFsdWUgaXMgb2JqZWN0LWxpa2UgaWYgaXQncyBub3QgYG51bGxgXG4gKiBhbmQgaGFzIGEgYHR5cGVvZmAgcmVzdWx0IG9mIFwib2JqZWN0XCIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgb2JqZWN0LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdExpa2Uoe30pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3RMaWtlKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoXy5ub29wKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc09iamVjdExpa2UobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdExpa2UodmFsdWUpIHtcbiAgcmV0dXJuICEhdmFsdWUgJiYgdHlwZW9mIHZhbHVlID09ICdvYmplY3QnO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBvYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSB0eXBlZCBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHR5cGVkIGFycmF5LCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNUeXBlZEFycmF5KG5ldyBVaW50OEFycmF5KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzVHlwZWRBcnJheShbXSk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG52YXIgaXNUeXBlZEFycmF5ID0gbm9kZUlzVHlwZWRBcnJheSA/IGJhc2VVbmFyeShub2RlSXNUeXBlZEFycmF5KSA6IGJhc2VJc1R5cGVkQXJyYXk7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZy4gQW4gZW1wdHkgc3RyaW5nIGlzIHJldHVybmVkIGZvciBgbnVsbGBcbiAqIGFuZCBgdW5kZWZpbmVkYCB2YWx1ZXMuIFRoZSBzaWduIG9mIGAtMGAgaXMgcHJlc2VydmVkLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgc3RyaW5nLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvU3RyaW5nKG51bGwpO1xuICogLy8gPT4gJydcbiAqXG4gKiBfLnRvU3RyaW5nKC0wKTtcbiAqIC8vID0+ICctMCdcbiAqXG4gKiBfLnRvU3RyaW5nKFsxLCAyLCAzXSk7XG4gKiAvLyA9PiAnMSwyLDMnXG4gKi9cbmZ1bmN0aW9uIHRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSA9PSBudWxsID8gJycgOiBiYXNlVG9TdHJpbmcodmFsdWUpO1xufVxuXG4vKipcbiAqIEdldHMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBgb2JqZWN0YC4gSWYgdGhlIHJlc29sdmVkIHZhbHVlIGlzXG4gKiBgdW5kZWZpbmVkYCwgdGhlIGBkZWZhdWx0VmFsdWVgIGlzIHJldHVybmVkIGluIGl0cyBwbGFjZS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuNy4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcGFyYW0ge0FycmF5fHN0cmluZ30gcGF0aCBUaGUgcGF0aCBvZiB0aGUgcHJvcGVydHkgdG8gZ2V0LlxuICogQHBhcmFtIHsqfSBbZGVmYXVsdFZhbHVlXSBUaGUgdmFsdWUgcmV0dXJuZWQgZm9yIGB1bmRlZmluZWRgIHJlc29sdmVkIHZhbHVlcy5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIHRoZSByZXNvbHZlZCB2YWx1ZS5cbiAqIEBleGFtcGxlXG4gKlxuICogdmFyIG9iamVjdCA9IHsgJ2EnOiBbeyAnYic6IHsgJ2MnOiAzIH0gfV0gfTtcbiAqXG4gKiBfLmdldChvYmplY3QsICdhWzBdLmIuYycpO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgWydhJywgJzAnLCAnYicsICdjJ10pO1xuICogLy8gPT4gM1xuICpcbiAqIF8uZ2V0KG9iamVjdCwgJ2EuYi5jJywgJ2RlZmF1bHQnKTtcbiAqIC8vID0+ICdkZWZhdWx0J1xuICovXG5mdW5jdGlvbiBnZXQob2JqZWN0LCBwYXRoLCBkZWZhdWx0VmFsdWUpIHtcbiAgdmFyIHJlc3VsdCA9IG9iamVjdCA9PSBudWxsID8gdW5kZWZpbmVkIDogYmFzZUdldChvYmplY3QsIHBhdGgpO1xuICByZXR1cm4gcmVzdWx0ID09PSB1bmRlZmluZWQgPyBkZWZhdWx0VmFsdWUgOiByZXN1bHQ7XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGBwYXRoYCBpcyBhIGRpcmVjdCBvciBpbmhlcml0ZWQgcHJvcGVydHkgb2YgYG9iamVjdGAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBUaGUgb2JqZWN0IHRvIHF1ZXJ5LlxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHBhdGhgIGV4aXN0cywgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0gXy5jcmVhdGUoeyAnYSc6IF8uY3JlYXRlKHsgJ2InOiAyIH0pIH0pO1xuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYScpO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYS5iJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5oYXNJbihvYmplY3QsIFsnYScsICdiJ10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaGFzSW4ob2JqZWN0LCAnYicpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaGFzSW4ob2JqZWN0LCBwYXRoKSB7XG4gIHJldHVybiBvYmplY3QgIT0gbnVsbCAmJiBoYXNQYXRoKG9iamVjdCwgcGF0aCwgYmFzZUhhc0luKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGFuIGFycmF5IG9mIHRoZSBvd24gZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy4gU2VlIHRoZVxuICogW0VTIHNwZWNdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLW9iamVjdC5rZXlzKVxuICogZm9yIG1vcmUgZGV0YWlscy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBtZW1iZXJPZiBfXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXMobmV3IEZvbyk7XG4gKiAvLyA9PiBbJ2EnLCAnYiddIChpdGVyYXRpb24gb3JkZXIgaXMgbm90IGd1YXJhbnRlZWQpXG4gKlxuICogXy5rZXlzKCdoaScpO1xuICogLy8gPT4gWycwJywgJzEnXVxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICByZXR1cm4gaXNBcnJheUxpa2Uob2JqZWN0KSA/IGFycmF5TGlrZUtleXMob2JqZWN0KSA6IGJhc2VLZXlzKG9iamVjdCk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBhcnJheSBvZiB0aGUgb3duIGFuZCBpbmhlcml0ZWQgZW51bWVyYWJsZSBwcm9wZXJ0eSBuYW1lcyBvZiBgb2JqZWN0YC5cbiAqXG4gKiAqKk5vdGU6KiogTm9uLW9iamVjdCB2YWx1ZXMgYXJlIGNvZXJjZWQgdG8gb2JqZWN0cy5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDMuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBvYmplY3QgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7QXJyYXl9IFJldHVybnMgdGhlIGFycmF5IG9mIHByb3BlcnR5IG5hbWVzLlxuICogQGV4YW1wbGVcbiAqXG4gKiBmdW5jdGlvbiBGb28oKSB7XG4gKiAgIHRoaXMuYSA9IDE7XG4gKiAgIHRoaXMuYiA9IDI7XG4gKiB9XG4gKlxuICogRm9vLnByb3RvdHlwZS5jID0gMztcbiAqXG4gKiBfLmtleXNJbihuZXcgRm9vKTtcbiAqIC8vID0+IFsnYScsICdiJywgJ2MnXSAoaXRlcmF0aW9uIG9yZGVyIGlzIG5vdCBndWFyYW50ZWVkKVxuICovXG5mdW5jdGlvbiBrZXlzSW4ob2JqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5TGlrZShvYmplY3QpID8gYXJyYXlMaWtlS2V5cyhvYmplY3QsIHRydWUpIDogYmFzZUtleXNJbihvYmplY3QpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYW4gb2JqZWN0IGNvbXBvc2VkIG9mIHRoZSBgb2JqZWN0YCBwcm9wZXJ0aWVzIGBwcmVkaWNhdGVgIHJldHVybnNcbiAqIHRydXRoeSBmb3IuIFRoZSBwcmVkaWNhdGUgaXMgaW52b2tlZCB3aXRoIHR3byBhcmd1bWVudHM6ICh2YWx1ZSwga2V5KS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IFRoZSBzb3VyY2Ugb2JqZWN0LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3ByZWRpY2F0ZT1fLmlkZW50aXR5XSBUaGUgZnVuY3Rpb24gaW52b2tlZCBwZXIgcHJvcGVydHkuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBSZXR1cm5zIHRoZSBuZXcgb2JqZWN0LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEsICdiJzogJzInLCAnYyc6IDMgfTtcbiAqXG4gKiBfLnBpY2tCeShvYmplY3QsIF8uaXNOdW1iZXIpO1xuICogLy8gPT4geyAnYSc6IDEsICdjJzogMyB9XG4gKi9cbmZ1bmN0aW9uIHBpY2tCeShvYmplY3QsIHByZWRpY2F0ZSkge1xuICByZXR1cm4gb2JqZWN0ID09IG51bGwgPyB7fSA6IGJhc2VQaWNrQnkob2JqZWN0LCBnZXRBbGxLZXlzSW4ob2JqZWN0KSwgYmFzZUl0ZXJhdGVlKHByZWRpY2F0ZSkpO1xufVxuXG4vKipcbiAqIFRoaXMgbWV0aG9kIHJldHVybnMgdGhlIGZpcnN0IGFyZ3VtZW50IGl0IHJlY2VpdmVzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBzaW5jZSAwLjEuMFxuICogQG1lbWJlck9mIF9cbiAqIEBjYXRlZ29yeSBVdGlsXG4gKiBAcGFyYW0geyp9IHZhbHVlIEFueSB2YWx1ZS5cbiAqIEByZXR1cm5zIHsqfSBSZXR1cm5zIGB2YWx1ZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIHZhciBvYmplY3QgPSB7ICdhJzogMSB9O1xuICpcbiAqIGNvbnNvbGUubG9nKF8uaWRlbnRpdHkob2JqZWN0KSA9PT0gb2JqZWN0KTtcbiAqIC8vID0+IHRydWVcbiAqL1xuZnVuY3Rpb24gaWRlbnRpdHkodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgdGhlIHZhbHVlIGF0IGBwYXRoYCBvZiBhIGdpdmVuIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDIuNC4wXG4gKiBAY2F0ZWdvcnkgVXRpbFxuICogQHBhcmFtIHtBcnJheXxzdHJpbmd9IHBhdGggVGhlIHBhdGggb2YgdGhlIHByb3BlcnR5IHRvIGdldC5cbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gUmV0dXJucyB0aGUgbmV3IGFjY2Vzc29yIGZ1bmN0aW9uLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0cyA9IFtcbiAqICAgeyAnYSc6IHsgJ2InOiAyIH0gfSxcbiAqICAgeyAnYSc6IHsgJ2InOiAxIH0gfVxuICogXTtcbiAqXG4gKiBfLm1hcChvYmplY3RzLCBfLnByb3BlcnR5KCdhLmInKSk7XG4gKiAvLyA9PiBbMiwgMV1cbiAqXG4gKiBfLm1hcChfLnNvcnRCeShvYmplY3RzLCBfLnByb3BlcnR5KFsnYScsICdiJ10pKSwgJ2EuYicpO1xuICogLy8gPT4gWzEsIDJdXG4gKi9cbmZ1bmN0aW9uIHByb3BlcnR5KHBhdGgpIHtcbiAgcmV0dXJuIGlzS2V5KHBhdGgpID8gYmFzZVByb3BlcnR5KHRvS2V5KHBhdGgpKSA6IGJhc2VQcm9wZXJ0eURlZXAocGF0aCk7XG59XG5cbi8qKlxuICogVGhpcyBtZXRob2QgcmV0dXJucyBhIG5ldyBlbXB0eSBhcnJheS5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMTMuMFxuICogQGNhdGVnb3J5IFV0aWxcbiAqIEByZXR1cm5zIHtBcnJheX0gUmV0dXJucyB0aGUgbmV3IGVtcHR5IGFycmF5LlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgYXJyYXlzID0gXy50aW1lcygyLCBfLnN0dWJBcnJheSk7XG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzKTtcbiAqIC8vID0+IFtbXSwgW11dXG4gKlxuICogY29uc29sZS5sb2coYXJyYXlzWzBdID09PSBhcnJheXNbMV0pO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gc3R1YkFycmF5KCkge1xuICByZXR1cm4gW107XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGlja0J5O1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL2xpYi92aXNpYmlsaXR5LnRpbWVycy5qcycpXG4iLCI7KGZ1bmN0aW9uIChnbG9iYWwpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBsYXN0SWQgPSAtMTtcblxuICAgIC8vIFZpc2liaWxpdHkuanMgYWxsb3cgeW91IHRvIGtub3csIHRoYXQgeW91ciB3ZWIgcGFnZSBpcyBpbiB0aGUgYmFja2dyb3VuZFxuICAgIC8vIHRhYiBhbmQgdGh1cyBub3QgdmlzaWJsZSB0byB0aGUgdXNlci4gVGhpcyBsaWJyYXJ5IGlzIHdyYXAgdW5kZXJcbiAgICAvLyBQYWdlIFZpc2liaWxpdHkgQVBJLiBJdCBmaXggcHJvYmxlbXMgd2l0aCBkaWZmZXJlbnQgdmVuZG9yIHByZWZpeGVzIGFuZFxuICAgIC8vIGFkZCBoaWdoLWxldmVsIHVzZWZ1bCBmdW5jdGlvbnMuXG4gICAgdmFyIHNlbGYgPSB7XG5cbiAgICAgICAgLy8gQ2FsbCBjYWxsYmFjayBvbmx5IHdoZW4gcGFnZSBiZWNvbWUgdG8gdmlzaWJsZSBmb3IgdXNlciBvclxuICAgICAgICAvLyBjYWxsIGl0IG5vdyBpZiBwYWdlIGlzIHZpc2libGUgbm93IG9yIFBhZ2UgVmlzaWJpbGl0eSBBUElcbiAgICAgICAgLy8gZG9lc27igJl0IHN1cHBvcnRlZC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gUmV0dXJuIGZhbHNlIGlmIEFQSSBpc27igJl0IHN1cHBvcnRlZCwgdHJ1ZSBpZiBwYWdlIGlzIGFscmVhZHkgdmlzaWJsZVxuICAgICAgICAvLyBvciBsaXN0ZW5lciBJRCAoeW91IGNhbiB1c2UgaXQgaW4gYHVuYmluZGAgbWV0aG9kKSBpZiBwYWdlIGlzbuKAmXRcbiAgICAgICAgLy8gdmlzaWJsZSBub3cuXG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgVmlzaWJpbGl0eS5vblZpc2libGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAgICAgICBzdGFydEludHJvQW5pbWF0aW9uKCk7XG4gICAgICAgIC8vICAgfSk7XG4gICAgICAgIG9uVmlzaWJsZTogZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB2YXIgc3VwcG9ydCA9IHNlbGYuaXNTdXBwb3J0ZWQoKTtcbiAgICAgICAgICAgIGlmICggIXN1cHBvcnQgfHwgIXNlbGYuaGlkZGVuKCkgKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VwcG9ydDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGxpc3RlbmVyID0gc2VsZi5jaGFuZ2UoZnVuY3Rpb24gKGUsIHN0YXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCAhc2VsZi5oaWRkZW4oKSApIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi51bmJpbmQobGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIENhbGwgY2FsbGJhY2sgd2hlbiB2aXNpYmlsaXR5IHdpbGwgYmUgY2hhbmdlZC4gRmlyc3QgYXJndW1lbnQgZm9yXG4gICAgICAgIC8vIGNhbGxiYWNrIHdpbGwgYmUgb3JpZ2luYWwgZXZlbnQgb2JqZWN0LCBzZWNvbmQgd2lsbCBiZSB2aXNpYmlsaXR5XG4gICAgICAgIC8vIHN0YXRlIG5hbWUuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIFJldHVybiBsaXN0ZW5lciBJRCB0byB1bmJpbmQgbGlzdGVuZXIgYnkgYHVuYmluZGAgbWV0aG9kLlxuICAgICAgICAvL1xuICAgICAgICAvLyBJZiBQYWdlIFZpc2liaWxpdHkgQVBJIGRvZXNu4oCZdCBzdXBwb3J0ZWQgbWV0aG9kIHdpbGwgYmUgcmV0dXJuIGZhbHNlXG4gICAgICAgIC8vIGFuZCBjYWxsYmFjayBuZXZlciB3aWxsIGJlIGNhbGxlZC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICBWaXNpYmlsaXR5LmNoYW5nZShmdW5jdGlvbihlLCBzdGF0ZSkge1xuICAgICAgICAvLyAgICAgICBTdGF0aXN0aWNzLnZpc2liaWxpdHlDaGFuZ2Uoc3RhdGUpO1xuICAgICAgICAvLyAgIH0pO1xuICAgICAgICAvL1xuICAgICAgICAvLyBJdCBpcyBqdXN0IHByb3h5IHRvIGB2aXNpYmlsaXR5Y2hhbmdlYCBldmVudCwgYnV0IHVzZSB2ZW5kb3IgcHJlZml4LlxuICAgICAgICBjaGFuZ2U6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgaWYgKCAhc2VsZi5pc1N1cHBvcnRlZCgpICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3RJZCArPSAxO1xuICAgICAgICAgICAgdmFyIG51bWJlciA9IGxhc3RJZDtcbiAgICAgICAgICAgIHNlbGYuX2NhbGxiYWNrc1tudW1iZXJdID0gY2FsbGJhY2s7XG4gICAgICAgICAgICBzZWxmLl9saXN0ZW4oKTtcbiAgICAgICAgICAgIHJldHVybiBudW1iZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gUmVtb3ZlIGBjaGFuZ2VgIGxpc3RlbmVyIGJ5IGl0IElELlxuICAgICAgICAvL1xuICAgICAgICAvLyAgIHZhciBpZCA9IFZpc2liaWxpdHkuY2hhbmdlKGZ1bmN0aW9uKGUsIHN0YXRlKSB7XG4gICAgICAgIC8vICAgICAgIGZpcnN0Q2hhbmdlQ2FsbGJhY2soKTtcbiAgICAgICAgLy8gICAgICAgVmlzaWJpbGl0eS51bmJpbmQoaWQpO1xuICAgICAgICAvLyAgIH0pO1xuICAgICAgICB1bmJpbmQ6IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgZGVsZXRlIHNlbGYuX2NhbGxiYWNrc1tpZF07XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gQ2FsbCBgY2FsbGJhY2tgIGluIGFueSBzdGF0ZSwgZXhwZWN0IOKAnHByZXJlbmRlcuKAnS4gSWYgY3VycmVudCBzdGF0ZVxuICAgICAgICAvLyBpcyDigJxwcmVyZW5kZXLigJ0gaXQgd2lsbCB3YWl0IHVudGlsIHN0YXRlIHdpbGwgYmUgY2hhbmdlZC5cbiAgICAgICAgLy8gSWYgUGFnZSBWaXNpYmlsaXR5IEFQSSBkb2VzbuKAmXQgc3VwcG9ydGVkLCBpdCB3aWxsIGNhbGwgYGNhbGxiYWNrYFxuICAgICAgICAvLyBpbW1lZGlhdGVseS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gUmV0dXJuIGZhbHNlIGlmIEFQSSBpc27igJl0IHN1cHBvcnRlZCwgdHJ1ZSBpZiBwYWdlIGlzIGFscmVhZHkgYWZ0ZXJcbiAgICAgICAgLy8gcHJlcmVuZGVyaW5nIG9yIGxpc3RlbmVyIElEICh5b3UgY2FuIHVzZSBpdCBpbiBgdW5iaW5kYCBtZXRob2QpXG4gICAgICAgIC8vIGlmIHBhZ2UgaXMgcHJlcmVuZGVkIG5vdy5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICBWaXNpYmlsaXR5LmFmdGVyUHJlcmVuZGVyaW5nKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gICAgICAgU3RhdGlzdGljcy5jb3VudFZpc2l0b3IoKTtcbiAgICAgICAgLy8gICB9KTtcbiAgICAgICAgYWZ0ZXJQcmVyZW5kZXJpbmc6IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgdmFyIHN1cHBvcnQgICA9IHNlbGYuaXNTdXBwb3J0ZWQoKTtcbiAgICAgICAgICAgIHZhciBwcmVyZW5kZXIgPSAncHJlcmVuZGVyJztcblxuICAgICAgICAgICAgaWYgKCAhc3VwcG9ydCB8fCBwcmVyZW5kZXIgIT0gc2VsZi5zdGF0ZSgpICkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cHBvcnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IHNlbGYuY2hhbmdlKGZ1bmN0aW9uIChlLCBzdGF0ZSkge1xuICAgICAgICAgICAgICAgIGlmICggcHJlcmVuZGVyICE9IHN0YXRlICkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnVuYmluZChsaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXR1cm4gbGlzdGVuZXI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gUmV0dXJuIHRydWUgaWYgcGFnZSBub3cgaXNu4oCZdCB2aXNpYmxlIHRvIHVzZXIuXG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgaWYgKCAhVmlzaWJpbGl0eS5oaWRkZW4oKSApIHtcbiAgICAgICAgLy8gICAgICAgVmlkZW9QbGF5ZXIucGxheSgpO1xuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gSXQgaXMganVzdCBwcm94eSB0byBgZG9jdW1lbnQuaGlkZGVuYCwgYnV0IHVzZSB2ZW5kb3IgcHJlZml4LlxuICAgICAgICBoaWRkZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAhIShzZWxmLl9kb2MuaGlkZGVuIHx8IHNlbGYuX2RvYy53ZWJraXRIaWRkZW4pO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIFJldHVybiB2aXNpYmlsaXR5IHN0YXRlOiAndmlzaWJsZScsICdoaWRkZW4nIG9yICdwcmVyZW5kZXInLlxuICAgICAgICAvL1xuICAgICAgICAvLyAgIGlmICggJ3ByZXJlbmRlcicgPT0gVmlzaWJpbGl0eS5zdGF0ZSgpICkge1xuICAgICAgICAvLyAgICAgICBTdGF0aXN0aWNzLnBhZ2VJc1ByZXJlbmRlcmluZygpO1xuICAgICAgICAvLyAgIH1cbiAgICAgICAgLy9cbiAgICAgICAgLy8gRG9u4oCZdCB1c2UgYFZpc2liaWxpdHkuc3RhdGUoKWAgdG8gZGV0ZWN0LCBpcyBwYWdlIHZpc2libGUsIGJlY2F1c2VcbiAgICAgICAgLy8gdmlzaWJpbGl0eSBzdGF0ZXMgY2FuIGV4dGVuZCBpbiBuZXh0IEFQSSB2ZXJzaW9ucy5cbiAgICAgICAgLy8gVXNlIG1vcmUgc2ltcGxlciBhbmQgZ2VuZXJhbCBgVmlzaWJpbGl0eS5oaWRkZW4oKWAgZm9yIHRoaXMgY2FzZXMuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIEl0IGlzIGp1c3QgcHJveHkgdG8gYGRvY3VtZW50LnZpc2liaWxpdHlTdGF0ZWAsIGJ1dCB1c2VcbiAgICAgICAgLy8gdmVuZG9yIHByZWZpeC5cbiAgICAgICAgc3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLl9kb2MudmlzaWJpbGl0eVN0YXRlICAgICAgIHx8XG4gICAgICAgICAgICAgICAgICAgc2VsZi5fZG9jLndlYmtpdFZpc2liaWxpdHlTdGF0ZSB8fFxuICAgICAgICAgICAgICAgICAgICd2aXNpYmxlJztcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBSZXR1cm4gdHJ1ZSBpZiBicm93c2VyIHN1cHBvcnQgUGFnZSBWaXNpYmlsaXR5IEFQSS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICBpZiAoIFZpc2liaWxpdHkuaXNTdXBwb3J0ZWQoKSApIHtcbiAgICAgICAgLy8gICAgICAgU3RhdGlzdGljcy5zdGFydFRyYWNraW5nVmlzaWJpbGl0eSgpO1xuICAgICAgICAvLyAgICAgICBWaXNpYmlsaXR5LmNoYW5nZShmdW5jdGlvbihlLCBzdGF0ZSkpIHtcbiAgICAgICAgLy8gICAgICAgICAgIFN0YXRpc3RpY3MudHJhY2tWaXNpYmlsaXR5KHN0YXRlKTtcbiAgICAgICAgLy8gICAgICAgfSk7XG4gICAgICAgIC8vICAgfVxuICAgICAgICBpc1N1cHBvcnRlZDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICEhKHNlbGYuX2RvYy52aXNpYmlsaXR5U3RhdGUgfHxcbiAgICAgICAgICAgICAgICAgICAgICBzZWxmLl9kb2Mud2Via2l0VmlzaWJpbGl0eVN0YXRlKTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyBMaW5rIHRvIGRvY3VtZW50IG9iamVjdCB0byBjaGFuZ2UgaXQgaW4gdGVzdHMuXG4gICAgICAgIF9kb2M6IGRvY3VtZW50IHx8IHt9LFxuXG4gICAgICAgIC8vIENhbGxiYWNrcyBmcm9tIGBjaGFuZ2VgIG1ldGhvZCwgdGhhdCB3YWl0IHZpc2liaWxpdHkgY2hhbmdlcy5cbiAgICAgICAgX2NhbGxiYWNrczogeyB9LFxuXG4gICAgICAgIC8vIExpc3RlbmVyIGZvciBgdmlzaWJpbGl0eWNoYW5nZWAgZXZlbnQuXG4gICAgICAgIF9jaGFuZ2U6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgc3RhdGUgPSBzZWxmLnN0YXRlKCk7XG5cbiAgICAgICAgICAgIGZvciAoIHZhciBpIGluIHNlbGYuX2NhbGxiYWNrcyApIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9jYWxsYmFja3NbaV0uY2FsbChzZWxmLl9kb2MsIGV2ZW50LCBzdGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gU2V0IGxpc3RlbmVyIGZvciBgdmlzaWJpbGl0eWNoYW5nZWAgZXZlbnQuXG4gICAgICAgIF9saXN0ZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICggc2VsZi5faW5pdCApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBldmVudCA9ICd2aXNpYmlsaXR5Y2hhbmdlJztcbiAgICAgICAgICAgIGlmICggc2VsZi5fZG9jLndlYmtpdFZpc2liaWxpdHlTdGF0ZSApIHtcbiAgICAgICAgICAgICAgICBldmVudCA9ICd3ZWJraXQnICsgZXZlbnQ7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZWxmLl9jaGFuZ2UuYXBwbHkoc2VsZiwgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoIHNlbGYuX2RvYy5hZGRFdmVudExpc3RlbmVyICkge1xuICAgICAgICAgICAgICAgIHNlbGYuX2RvYy5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBsaXN0ZW5lcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlbGYuX2RvYy5hdHRhY2hFdmVudChldmVudCwgbGlzdGVuZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VsZi5faW5pdCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBpZiAoIHR5cGVvZihtb2R1bGUpICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IHNlbGY7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgZ2xvYmFsLlZpc2liaWxpdHkgPSBzZWxmO1xuICAgIH1cblxufSkodGhpcyk7XG4iLCI7KGZ1bmN0aW9uICh3aW5kb3cpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIHZhciBsYXN0VGltZXIgPSAtMTtcblxuICAgIHZhciBpbnN0YWxsID0gZnVuY3Rpb24gKFZpc2liaWxpdHkpIHtcblxuICAgICAgICAvLyBSdW4gY2FsbGJhY2sgZXZlcnkgYGludGVydmFsYCBtaWxsaXNlY29uZHMgaWYgcGFnZSBpcyB2aXNpYmxlIGFuZFxuICAgICAgICAvLyBldmVyeSBgaGlkZGVuSW50ZXJ2YWxgIG1pbGxpc2Vjb25kcyBpZiBwYWdlIGlzIGhpZGRlbi5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICBWaXNpYmlsaXR5LmV2ZXJ5KDYwICogMTAwMCwgNSAqIDYwICogMTAwMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyAgICAgICBjaGVja05ld01haWxzKCk7XG4gICAgICAgIC8vICAgfSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIFlvdSBjYW4gc2tpcCBgaGlkZGVuSW50ZXJ2YWxgIGFuZCBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCBvbmx5IGlmXG4gICAgICAgIC8vIHBhZ2UgaXMgdmlzaWJsZS5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gICBWaXNpYmlsaXR5LmV2ZXJ5KDEwMDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gICAgICAgdXBkYXRlQ291bnRkb3duKCk7XG4gICAgICAgIC8vICAgfSk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vIEl0IGlzIGFuYWxvZyBvZiBgc2V0SW50ZXJ2YWwoY2FsbGJhY2ssIGludGVydmFsKWAgYnV0IHVzZSB2aXNpYmlsaXR5XG4gICAgICAgIC8vIHN0YXRlLlxuICAgICAgICAvL1xuICAgICAgICAvLyBJdCByZXR1cm4gdGltZXIgSUQsIHRoYXQgeW91IGNhbiB1c2UgaW4gYFZpc2liaWxpdHkuc3RvcChpZClgIHRvIHN0b3BcbiAgICAgICAgLy8gdGltZXIgKGBjbGVhckludGVydmFsYCBhbmFsb2cpLlxuICAgICAgICAvLyBXYXJuaW5nOiB0aW1lciBJRCBpcyBkaWZmZXJlbnQgZnJvbSBpbnRlcnZhbCBJRCBmcm9tIGBzZXRJbnRlcnZhbGAsXG4gICAgICAgIC8vIHNvIGRvbuKAmXQgdXNlIGl0IGluIGBjbGVhckludGVydmFsYC5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gT24gY2hhbmdlIHN0YXRlIGZyb20gaGlkZGVuIHRvIHZpc2libGUgdGltZXJzIHdpbGwgYmUgZXhlY3V0ZS5cbiAgICAgICAgVmlzaWJpbGl0eS5ldmVyeSA9IGZ1bmN0aW9uIChpbnRlcnZhbCwgaGlkZGVuSW50ZXJ2YWwsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBWaXNpYmlsaXR5Ll90aW1lKCk7XG5cbiAgICAgICAgICAgIGlmICggIWNhbGxiYWNrICkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrID0gaGlkZGVuSW50ZXJ2YWw7XG4gICAgICAgICAgICAgICAgaGlkZGVuSW50ZXJ2YWwgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsYXN0VGltZXIgKz0gMTtcbiAgICAgICAgICAgIHZhciBudW1iZXIgPSBsYXN0VGltZXI7XG5cbiAgICAgICAgICAgIFZpc2liaWxpdHkuX3RpbWVyc1tudW1iZXJdID0ge1xuICAgICAgICAgICAgICAgIHZpc2libGU6ICBpbnRlcnZhbCxcbiAgICAgICAgICAgICAgICBoaWRkZW46ICAgaGlkZGVuSW50ZXJ2YWwsXG4gICAgICAgICAgICAgICAgY2FsbGJhY2s6IGNhbGxiYWNrXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgVmlzaWJpbGl0eS5fcnVuKG51bWJlciwgZmFsc2UpO1xuXG4gICAgICAgICAgICBpZiAoIFZpc2liaWxpdHkuaXNTdXBwb3J0ZWQoKSApIHtcbiAgICAgICAgICAgICAgICBWaXNpYmlsaXR5Ll9saXN0ZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBudW1iZXI7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gU3RvcCB0aW1lciBmcm9tIGBldmVyeWAgbWV0aG9kIGJ5IGl0IElEIChgZXZlcnlgIG1ldGhvZCByZXR1cm4gaXQpLlxuICAgICAgICAvL1xuICAgICAgICAvLyAgIHNsaWRlc2hvdyA9IFZpc2liaWxpdHkuZXZlcnkoNSAqIDEwMDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gICAgICAgY2hhbmdlU2xpZGUoKTtcbiAgICAgICAgLy8gICB9KTtcbiAgICAgICAgLy8gICAkKCcuc3RvcFNsaWRlc2hvdycpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gICAgICAgVmlzaWJpbGl0eS5zdG9wKHNsaWRlc2hvdyk7XG4gICAgICAgIC8vICAgfSk7XG4gICAgICAgIFZpc2liaWxpdHkuc3RvcCA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgICAgICBpZiAoICFWaXNpYmlsaXR5Ll90aW1lcnNbaWRdICkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFZpc2liaWxpdHkuX3N0b3AoaWQpO1xuICAgICAgICAgICAgZGVsZXRlIFZpc2liaWxpdHkuX3RpbWVyc1tpZF07XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBDYWxsYmFja3MgYW5kIGludGVydmFscyBhZGRlZCBieSBgZXZlcnlgIG1ldGhvZC5cbiAgICAgICAgVmlzaWJpbGl0eS5fdGltZXJzID0geyB9O1xuXG4gICAgICAgIC8vIEluaXRpYWxpemUgdmFyaWFibGVzIG9uIHBhZ2UgbG9hZGluZy5cbiAgICAgICAgVmlzaWJpbGl0eS5fdGltZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICggVmlzaWJpbGl0eS5fdGltZWQgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgVmlzaWJpbGl0eS5fdGltZWQgICAgID0gdHJ1ZTtcbiAgICAgICAgICAgIFZpc2liaWxpdHkuX3dhc0hpZGRlbiA9IFZpc2liaWxpdHkuaGlkZGVuKCk7XG5cbiAgICAgICAgICAgIFZpc2liaWxpdHkuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBWaXNpYmlsaXR5Ll9zdG9wUnVuKCk7XG4gICAgICAgICAgICAgICAgVmlzaWJpbGl0eS5fd2FzSGlkZGVuID0gVmlzaWJpbGl0eS5oaWRkZW4oKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFRyeSB0byBydW4gdGltZXIgZnJvbSBldmVyeSBtZXRob2QgYnkgaXTigJlzIElELiBJdCB3aWxsIGJlIHVzZVxuICAgICAgICAvLyBgaW50ZXJ2YWxgIG9yIGBoaWRkZW5JbnRlcnZhbGAgZGVwZW5kaW5nIG9uIHZpc2liaWxpdHkgc3RhdGUuXG4gICAgICAgIC8vIElmIHBhZ2UgaXMgaGlkZGVuIGFuZCBgaGlkZGVuSW50ZXJ2YWxgIGlzIG51bGwsXG4gICAgICAgIC8vIGl0IHdpbGwgbm90IHJ1biB0aW1lci5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gQXJndW1lbnQgYHJ1bk5vd2Agc2F5LCB0aGF0IHRpbWVycyBtdXN0IGJlIGV4ZWN1dGUgbm93IHRvby5cbiAgICAgICAgVmlzaWJpbGl0eS5fcnVuID0gZnVuY3Rpb24gKGlkLCBydW5Ob3cpIHtcbiAgICAgICAgICAgIHZhciBpbnRlcnZhbCxcbiAgICAgICAgICAgICAgICB0aW1lciA9IFZpc2liaWxpdHkuX3RpbWVyc1tpZF07XG5cbiAgICAgICAgICAgIGlmICggVmlzaWJpbGl0eS5oaWRkZW4oKSApIHtcbiAgICAgICAgICAgICAgICBpZiAoIG51bGwgPT09IHRpbWVyLmhpZGRlbiApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpbnRlcnZhbCA9IHRpbWVyLmhpZGRlbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaW50ZXJ2YWwgPSB0aW1lci52aXNpYmxlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgcnVubmVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRpbWVyLmxhc3QgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHRpbWVyLmNhbGxiYWNrLmNhbGwod2luZG93KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBydW5Ob3cgKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5vdyAgPSBuZXcgRGF0ZSgpO1xuICAgICAgICAgICAgICAgIHZhciBsYXN0ID0gbm93IC0gdGltZXIubGFzdCA7XG5cbiAgICAgICAgICAgICAgICBpZiAoIGludGVydmFsID4gbGFzdCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGltZXIuZGVsYXkgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyLmlkID0gc2V0SW50ZXJ2YWwocnVubmVyLCBpbnRlcnZhbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBydW5uZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgaW50ZXJ2YWwgLSBsYXN0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aW1lci5pZCA9IHNldEludGVydmFsKHJ1bm5lciwgaW50ZXJ2YWwpO1xuICAgICAgICAgICAgICAgICAgICBydW5uZXIoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRpbWVyLmlkID0gc2V0SW50ZXJ2YWwocnVubmVyLCBpbnRlcnZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gU3RvcCB0aW1lciBmcm9tIGBldmVyeWAgbWV0aG9kIGJ5IGl04oCZcyBJRC5cbiAgICAgICAgVmlzaWJpbGl0eS5fc3RvcCA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgdmFyIHRpbWVyID0gVmlzaWJpbGl0eS5fdGltZXJzW2lkXTtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGltZXIuaWQpO1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVyLmRlbGF5KTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aW1lci5pZDtcbiAgICAgICAgICAgIGRlbGV0ZSB0aW1lci5kZWxheTtcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBMaXN0ZW5lciBmb3IgYHZpc2liaWxpdHljaGFuZ2VgIGV2ZW50LlxuICAgICAgICBWaXNpYmlsaXR5Ll9zdG9wUnVuID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgaXNIaWRkZW4gID0gVmlzaWJpbGl0eS5oaWRkZW4oKSxcbiAgICAgICAgICAgICAgICB3YXNIaWRkZW4gPSBWaXNpYmlsaXR5Ll93YXNIaWRkZW47XG5cbiAgICAgICAgICAgIGlmICggKGlzSGlkZGVuICYmICF3YXNIaWRkZW4pIHx8ICghaXNIaWRkZW4gJiYgd2FzSGlkZGVuKSApIHtcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaSBpbiBWaXNpYmlsaXR5Ll90aW1lcnMgKSB7XG4gICAgICAgICAgICAgICAgICAgIFZpc2liaWxpdHkuX3N0b3AoaSk7XG4gICAgICAgICAgICAgICAgICAgIFZpc2liaWxpdHkuX3J1bihpLCAhaXNIaWRkZW4pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gVmlzaWJpbGl0eTtcbiAgICB9XG5cbiAgICBpZiAoIHR5cGVvZihtb2R1bGUpICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzICkge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGluc3RhbGwocmVxdWlyZSgnLi92aXNpYmlsaXR5LmNvcmUnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaW5zdGFsbCh3aW5kb3cuVmlzaWJpbGl0eSlcbiAgICB9XG5cbn0pKHdpbmRvdyk7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTIuNFxudmFyIER1bXBlciwgSW5saW5lLCBVdGlscztcblxuVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cbklubGluZSA9IHJlcXVpcmUoJy4vSW5saW5lJyk7XG5cbkR1bXBlciA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gRHVtcGVyKCkge31cblxuICBEdW1wZXIuaW5kZW50YXRpb24gPSA0O1xuXG4gIER1bXBlci5wcm90b3R5cGUuZHVtcCA9IGZ1bmN0aW9uKGlucHV0LCBpbmxpbmUsIGluZGVudCwgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0RW5jb2Rlcikge1xuICAgIHZhciBpLCBrZXksIGxlbiwgb3V0cHV0LCBwcmVmaXgsIHZhbHVlLCB3aWxsQmVJbmxpbmVkO1xuICAgIGlmIChpbmxpbmUgPT0gbnVsbCkge1xuICAgICAgaW5saW5lID0gMDtcbiAgICB9XG4gICAgaWYgKGluZGVudCA9PSBudWxsKSB7XG4gICAgICBpbmRlbnQgPSAwO1xuICAgIH1cbiAgICBpZiAoZXhjZXB0aW9uT25JbnZhbGlkVHlwZSA9PSBudWxsKSB7XG4gICAgICBleGNlcHRpb25PbkludmFsaWRUeXBlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChvYmplY3RFbmNvZGVyID09IG51bGwpIHtcbiAgICAgIG9iamVjdEVuY29kZXIgPSBudWxsO1xuICAgIH1cbiAgICBvdXRwdXQgPSAnJztcbiAgICBwcmVmaXggPSAoaW5kZW50ID8gVXRpbHMuc3RyUmVwZWF0KCcgJywgaW5kZW50KSA6ICcnKTtcbiAgICBpZiAoaW5saW5lIDw9IDAgfHwgdHlwZW9mIGlucHV0ICE9PSAnb2JqZWN0JyB8fCBpbnB1dCBpbnN0YW5jZW9mIERhdGUgfHwgVXRpbHMuaXNFbXB0eShpbnB1dCkpIHtcbiAgICAgIG91dHB1dCArPSBwcmVmaXggKyBJbmxpbmUuZHVtcChpbnB1dCwgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0RW5jb2Rlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IGlucHV0Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgdmFsdWUgPSBpbnB1dFtpXTtcbiAgICAgICAgICB3aWxsQmVJbmxpbmVkID0gaW5saW5lIC0gMSA8PSAwIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcgfHwgVXRpbHMuaXNFbXB0eSh2YWx1ZSk7XG4gICAgICAgICAgb3V0cHV0ICs9IHByZWZpeCArICctJyArICh3aWxsQmVJbmxpbmVkID8gJyAnIDogXCJcXG5cIikgKyB0aGlzLmR1bXAodmFsdWUsIGlubGluZSAtIDEsICh3aWxsQmVJbmxpbmVkID8gMCA6IGluZGVudCArIHRoaXMuaW5kZW50YXRpb24pLCBleGNlcHRpb25PbkludmFsaWRUeXBlLCBvYmplY3RFbmNvZGVyKSArICh3aWxsQmVJbmxpbmVkID8gXCJcXG5cIiA6ICcnKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZm9yIChrZXkgaW4gaW5wdXQpIHtcbiAgICAgICAgICB2YWx1ZSA9IGlucHV0W2tleV07XG4gICAgICAgICAgd2lsbEJlSW5saW5lZCA9IGlubGluZSAtIDEgPD0gMCB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8IFV0aWxzLmlzRW1wdHkodmFsdWUpO1xuICAgICAgICAgIG91dHB1dCArPSBwcmVmaXggKyBJbmxpbmUuZHVtcChrZXksIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdEVuY29kZXIpICsgJzonICsgKHdpbGxCZUlubGluZWQgPyAnICcgOiBcIlxcblwiKSArIHRoaXMuZHVtcCh2YWx1ZSwgaW5saW5lIC0gMSwgKHdpbGxCZUlubGluZWQgPyAwIDogaW5kZW50ICsgdGhpcy5pbmRlbnRhdGlvbiksIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdEVuY29kZXIpICsgKHdpbGxCZUlubGluZWQgPyBcIlxcblwiIDogJycpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgcmV0dXJuIER1bXBlcjtcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBEdW1wZXI7XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTIuNFxudmFyIEVzY2FwZXIsIFBhdHRlcm47XG5cblBhdHRlcm4gPSByZXF1aXJlKCcuL1BhdHRlcm4nKTtcblxuRXNjYXBlciA9IChmdW5jdGlvbigpIHtcbiAgdmFyIGNoO1xuXG4gIGZ1bmN0aW9uIEVzY2FwZXIoKSB7fVxuXG4gIEVzY2FwZXIuTElTVF9FU0NBUEVFUyA9IFsnXFxcXCcsICdcXFxcXFxcXCcsICdcXFxcXCInLCAnXCInLCBcIlxceDAwXCIsIFwiXFx4MDFcIiwgXCJcXHgwMlwiLCBcIlxceDAzXCIsIFwiXFx4MDRcIiwgXCJcXHgwNVwiLCBcIlxceDA2XCIsIFwiXFx4MDdcIiwgXCJcXHgwOFwiLCBcIlxceDA5XCIsIFwiXFx4MGFcIiwgXCJcXHgwYlwiLCBcIlxceDBjXCIsIFwiXFx4MGRcIiwgXCJcXHgwZVwiLCBcIlxceDBmXCIsIFwiXFx4MTBcIiwgXCJcXHgxMVwiLCBcIlxceDEyXCIsIFwiXFx4MTNcIiwgXCJcXHgxNFwiLCBcIlxceDE1XCIsIFwiXFx4MTZcIiwgXCJcXHgxN1wiLCBcIlxceDE4XCIsIFwiXFx4MTlcIiwgXCJcXHgxYVwiLCBcIlxceDFiXCIsIFwiXFx4MWNcIiwgXCJcXHgxZFwiLCBcIlxceDFlXCIsIFwiXFx4MWZcIiwgKGNoID0gU3RyaW5nLmZyb21DaGFyQ29kZSkoMHgwMDg1KSwgY2goMHgwMEEwKSwgY2goMHgyMDI4KSwgY2goMHgyMDI5KV07XG5cbiAgRXNjYXBlci5MSVNUX0VTQ0FQRUQgPSBbJ1xcXFxcXFxcJywgJ1xcXFxcIicsICdcXFxcXCInLCAnXFxcXFwiJywgXCJcXFxcMFwiLCBcIlxcXFx4MDFcIiwgXCJcXFxceDAyXCIsIFwiXFxcXHgwM1wiLCBcIlxcXFx4MDRcIiwgXCJcXFxceDA1XCIsIFwiXFxcXHgwNlwiLCBcIlxcXFxhXCIsIFwiXFxcXGJcIiwgXCJcXFxcdFwiLCBcIlxcXFxuXCIsIFwiXFxcXHZcIiwgXCJcXFxcZlwiLCBcIlxcXFxyXCIsIFwiXFxcXHgwZVwiLCBcIlxcXFx4MGZcIiwgXCJcXFxceDEwXCIsIFwiXFxcXHgxMVwiLCBcIlxcXFx4MTJcIiwgXCJcXFxceDEzXCIsIFwiXFxcXHgxNFwiLCBcIlxcXFx4MTVcIiwgXCJcXFxceDE2XCIsIFwiXFxcXHgxN1wiLCBcIlxcXFx4MThcIiwgXCJcXFxceDE5XCIsIFwiXFxcXHgxYVwiLCBcIlxcXFxlXCIsIFwiXFxcXHgxY1wiLCBcIlxcXFx4MWRcIiwgXCJcXFxceDFlXCIsIFwiXFxcXHgxZlwiLCBcIlxcXFxOXCIsIFwiXFxcXF9cIiwgXCJcXFxcTFwiLCBcIlxcXFxQXCJdO1xuXG4gIEVzY2FwZXIuTUFQUElOR19FU0NBUEVFU19UT19FU0NBUEVEID0gKGZ1bmN0aW9uKCkge1xuICAgIHZhciBpLCBqLCBtYXBwaW5nLCByZWY7XG4gICAgbWFwcGluZyA9IHt9O1xuICAgIGZvciAoaSA9IGogPSAwLCByZWYgPSBFc2NhcGVyLkxJU1RfRVNDQVBFRVMubGVuZ3RoOyAwIDw9IHJlZiA/IGogPCByZWYgOiBqID4gcmVmOyBpID0gMCA8PSByZWYgPyArK2ogOiAtLWopIHtcbiAgICAgIG1hcHBpbmdbRXNjYXBlci5MSVNUX0VTQ0FQRUVTW2ldXSA9IEVzY2FwZXIuTElTVF9FU0NBUEVEW2ldO1xuICAgIH1cbiAgICByZXR1cm4gbWFwcGluZztcbiAgfSkoKTtcblxuICBFc2NhcGVyLlBBVFRFUk5fQ0hBUkFDVEVSU19UT19FU0NBUEUgPSBuZXcgUGF0dGVybignW1xcXFx4MDAtXFxcXHgxZl18XFx4YzJcXHg4NXxcXHhjMlxceGEwfFxceGUyXFx4ODBcXHhhOHxcXHhlMlxceDgwXFx4YTknKTtcblxuICBFc2NhcGVyLlBBVFRFUk5fTUFQUElOR19FU0NBUEVFUyA9IG5ldyBQYXR0ZXJuKEVzY2FwZXIuTElTVF9FU0NBUEVFUy5qb2luKCd8Jykuc3BsaXQoJ1xcXFwnKS5qb2luKCdcXFxcXFxcXCcpKTtcblxuICBFc2NhcGVyLlBBVFRFUk5fU0lOR0xFX1FVT1RJTkcgPSBuZXcgUGF0dGVybignW1xcXFxzXFwnXCI6e31bXFxcXF0sJiojP118XlstP3w8Pj0hJUBgXScpO1xuXG4gIEVzY2FwZXIucmVxdWlyZXNEb3VibGVRdW90aW5nID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5QQVRURVJOX0NIQVJBQ1RFUlNfVE9fRVNDQVBFLnRlc3QodmFsdWUpO1xuICB9O1xuXG4gIEVzY2FwZXIuZXNjYXBlV2l0aERvdWJsZVF1b3RlcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIHJlc3VsdDtcbiAgICByZXN1bHQgPSB0aGlzLlBBVFRFUk5fTUFQUElOR19FU0NBUEVFUy5yZXBsYWNlKHZhbHVlLCAoZnVuY3Rpb24oX3RoaXMpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbihzdHIpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLk1BUFBJTkdfRVNDQVBFRVNfVE9fRVNDQVBFRFtzdHJdO1xuICAgICAgfTtcbiAgICB9KSh0aGlzKSk7XG4gICAgcmV0dXJuICdcIicgKyByZXN1bHQgKyAnXCInO1xuICB9O1xuXG4gIEVzY2FwZXIucmVxdWlyZXNTaW5nbGVRdW90aW5nID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5QQVRURVJOX1NJTkdMRV9RVU9USU5HLnRlc3QodmFsdWUpO1xuICB9O1xuXG4gIEVzY2FwZXIuZXNjYXBlV2l0aFNpbmdsZVF1b3RlcyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIFwiJ1wiICsgdmFsdWUucmVwbGFjZSgvJy9nLCBcIicnXCIpICsgXCInXCI7XG4gIH07XG5cbiAgcmV0dXJuIEVzY2FwZXI7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gRXNjYXBlcjtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMi40XG52YXIgRHVtcEV4Y2VwdGlvbixcbiAgZXh0ZW5kID0gZnVuY3Rpb24oY2hpbGQsIHBhcmVudCkgeyBmb3IgKHZhciBrZXkgaW4gcGFyZW50KSB7IGlmIChoYXNQcm9wLmNhbGwocGFyZW50LCBrZXkpKSBjaGlsZFtrZXldID0gcGFyZW50W2tleV07IH0gZnVuY3Rpb24gY3RvcigpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGNoaWxkOyB9IGN0b3IucHJvdG90eXBlID0gcGFyZW50LnByb3RvdHlwZTsgY2hpbGQucHJvdG90eXBlID0gbmV3IGN0b3IoKTsgY2hpbGQuX19zdXBlcl9fID0gcGFyZW50LnByb3RvdHlwZTsgcmV0dXJuIGNoaWxkOyB9LFxuICBoYXNQcm9wID0ge30uaGFzT3duUHJvcGVydHk7XG5cbkR1bXBFeGNlcHRpb24gPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoRHVtcEV4Y2VwdGlvbiwgc3VwZXJDbGFzcyk7XG5cbiAgZnVuY3Rpb24gRHVtcEV4Y2VwdGlvbihtZXNzYWdlLCBwYXJzZWRMaW5lLCBzbmlwcGV0KSB7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB0aGlzLnBhcnNlZExpbmUgPSBwYXJzZWRMaW5lO1xuICAgIHRoaXMuc25pcHBldCA9IHNuaXBwZXQ7XG4gIH1cblxuICBEdW1wRXhjZXB0aW9uLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgodGhpcy5wYXJzZWRMaW5lICE9IG51bGwpICYmICh0aGlzLnNuaXBwZXQgIT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiAnPER1bXBFeGNlcHRpb24+ICcgKyB0aGlzLm1lc3NhZ2UgKyAnIChsaW5lICcgKyB0aGlzLnBhcnNlZExpbmUgKyAnOiBcXCcnICsgdGhpcy5zbmlwcGV0ICsgJ1xcJyknO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJzxEdW1wRXhjZXB0aW9uPiAnICsgdGhpcy5tZXNzYWdlO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gRHVtcEV4Y2VwdGlvbjtcblxufSkoRXJyb3IpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IER1bXBFeGNlcHRpb247XG4iLCIvLyBHZW5lcmF0ZWQgYnkgQ29mZmVlU2NyaXB0IDEuMTIuNFxudmFyIFBhcnNlRXhjZXB0aW9uLFxuICBleHRlbmQgPSBmdW5jdGlvbihjaGlsZCwgcGFyZW50KSB7IGZvciAodmFyIGtleSBpbiBwYXJlbnQpIHsgaWYgKGhhc1Byb3AuY2FsbChwYXJlbnQsIGtleSkpIGNoaWxkW2tleV0gPSBwYXJlbnRba2V5XTsgfSBmdW5jdGlvbiBjdG9yKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gY2hpbGQ7IH0gY3Rvci5wcm90b3R5cGUgPSBwYXJlbnQucHJvdG90eXBlOyBjaGlsZC5wcm90b3R5cGUgPSBuZXcgY3RvcigpOyBjaGlsZC5fX3N1cGVyX18gPSBwYXJlbnQucHJvdG90eXBlOyByZXR1cm4gY2hpbGQ7IH0sXG4gIGhhc1Byb3AgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuUGFyc2VFeGNlcHRpb24gPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUGFyc2VFeGNlcHRpb24sIHN1cGVyQ2xhc3MpO1xuXG4gIGZ1bmN0aW9uIFBhcnNlRXhjZXB0aW9uKG1lc3NhZ2UsIHBhcnNlZExpbmUsIHNuaXBwZXQpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMucGFyc2VkTGluZSA9IHBhcnNlZExpbmU7XG4gICAgdGhpcy5zbmlwcGV0ID0gc25pcHBldDtcbiAgfVxuXG4gIFBhcnNlRXhjZXB0aW9uLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgodGhpcy5wYXJzZWRMaW5lICE9IG51bGwpICYmICh0aGlzLnNuaXBwZXQgIT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiAnPFBhcnNlRXhjZXB0aW9uPiAnICsgdGhpcy5tZXNzYWdlICsgJyAobGluZSAnICsgdGhpcy5wYXJzZWRMaW5lICsgJzogXFwnJyArIHRoaXMuc25pcHBldCArICdcXCcpJztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICc8UGFyc2VFeGNlcHRpb24+ICcgKyB0aGlzLm1lc3NhZ2U7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBQYXJzZUV4Y2VwdGlvbjtcblxufSkoRXJyb3IpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlRXhjZXB0aW9uO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEyLjRcbnZhciBQYXJzZU1vcmUsXG4gIGV4dGVuZCA9IGZ1bmN0aW9uKGNoaWxkLCBwYXJlbnQpIHsgZm9yICh2YXIga2V5IGluIHBhcmVudCkgeyBpZiAoaGFzUHJvcC5jYWxsKHBhcmVudCwga2V5KSkgY2hpbGRba2V5XSA9IHBhcmVudFtrZXldOyB9IGZ1bmN0aW9uIGN0b3IoKSB7IHRoaXMuY29uc3RydWN0b3IgPSBjaGlsZDsgfSBjdG9yLnByb3RvdHlwZSA9IHBhcmVudC5wcm90b3R5cGU7IGNoaWxkLnByb3RvdHlwZSA9IG5ldyBjdG9yKCk7IGNoaWxkLl9fc3VwZXJfXyA9IHBhcmVudC5wcm90b3R5cGU7IHJldHVybiBjaGlsZDsgfSxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5QYXJzZU1vcmUgPSAoZnVuY3Rpb24oc3VwZXJDbGFzcykge1xuICBleHRlbmQoUGFyc2VNb3JlLCBzdXBlckNsYXNzKTtcblxuICBmdW5jdGlvbiBQYXJzZU1vcmUobWVzc2FnZSwgcGFyc2VkTGluZSwgc25pcHBldCkge1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gICAgdGhpcy5wYXJzZWRMaW5lID0gcGFyc2VkTGluZTtcbiAgICB0aGlzLnNuaXBwZXQgPSBzbmlwcGV0O1xuICB9XG5cbiAgUGFyc2VNb3JlLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICgodGhpcy5wYXJzZWRMaW5lICE9IG51bGwpICYmICh0aGlzLnNuaXBwZXQgIT0gbnVsbCkpIHtcbiAgICAgIHJldHVybiAnPFBhcnNlTW9yZT4gJyArIHRoaXMubWVzc2FnZSArICcgKGxpbmUgJyArIHRoaXMucGFyc2VkTGluZSArICc6IFxcJycgKyB0aGlzLnNuaXBwZXQgKyAnXFwnKSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAnPFBhcnNlTW9yZT4gJyArIHRoaXMubWVzc2FnZTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIFBhcnNlTW9yZTtcblxufSkoRXJyb3IpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlTW9yZTtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMi40XG52YXIgRHVtcEV4Y2VwdGlvbiwgRXNjYXBlciwgSW5saW5lLCBQYXJzZUV4Y2VwdGlvbiwgUGFyc2VNb3JlLCBQYXR0ZXJuLCBVbmVzY2FwZXIsIFV0aWxzLFxuICBpbmRleE9mID0gW10uaW5kZXhPZiB8fCBmdW5jdGlvbihpdGVtKSB7IGZvciAodmFyIGkgPSAwLCBsID0gdGhpcy5sZW5ndGg7IGkgPCBsOyBpKyspIHsgaWYgKGkgaW4gdGhpcyAmJiB0aGlzW2ldID09PSBpdGVtKSByZXR1cm4gaTsgfSByZXR1cm4gLTE7IH07XG5cblBhdHRlcm4gPSByZXF1aXJlKCcuL1BhdHRlcm4nKTtcblxuVW5lc2NhcGVyID0gcmVxdWlyZSgnLi9VbmVzY2FwZXInKTtcblxuRXNjYXBlciA9IHJlcXVpcmUoJy4vRXNjYXBlcicpO1xuXG5VdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxuUGFyc2VFeGNlcHRpb24gPSByZXF1aXJlKCcuL0V4Y2VwdGlvbi9QYXJzZUV4Y2VwdGlvbicpO1xuXG5QYXJzZU1vcmUgPSByZXF1aXJlKCcuL0V4Y2VwdGlvbi9QYXJzZU1vcmUnKTtcblxuRHVtcEV4Y2VwdGlvbiA9IHJlcXVpcmUoJy4vRXhjZXB0aW9uL0R1bXBFeGNlcHRpb24nKTtcblxuSW5saW5lID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBJbmxpbmUoKSB7fVxuXG4gIElubGluZS5SRUdFWF9RVU9URURfU1RSSU5HID0gJyg/OlwiKD86W15cIlxcXFxcXFxcXSooPzpcXFxcXFxcXC5bXlwiXFxcXFxcXFxdKikqKVwifFxcJyg/OlteXFwnXSooPzpcXCdcXCdbXlxcJ10qKSopXFwnKSc7XG5cbiAgSW5saW5lLlBBVFRFUk5fVFJBSUxJTkdfQ09NTUVOVFMgPSBuZXcgUGF0dGVybignXlxcXFxzKiMuKiQnKTtcblxuICBJbmxpbmUuUEFUVEVSTl9RVU9URURfU0NBTEFSID0gbmV3IFBhdHRlcm4oJ14nICsgSW5saW5lLlJFR0VYX1FVT1RFRF9TVFJJTkcpO1xuXG4gIElubGluZS5QQVRURVJOX1RIT1VTQU5EX05VTUVSSUNfU0NBTEFSID0gbmV3IFBhdHRlcm4oJ14oLXxcXFxcKyk/WzAtOSxdKyhcXFxcLlswLTldKyk/JCcpO1xuXG4gIElubGluZS5QQVRURVJOX1NDQUxBUl9CWV9ERUxJTUlURVJTID0ge307XG5cbiAgSW5saW5lLnNldHRpbmdzID0ge307XG5cbiAgSW5saW5lLmNvbmZpZ3VyZSA9IGZ1bmN0aW9uKGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdERlY29kZXIpIHtcbiAgICBpZiAoZXhjZXB0aW9uT25JbnZhbGlkVHlwZSA9PSBudWxsKSB7XG4gICAgICBleGNlcHRpb25PbkludmFsaWRUeXBlID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKG9iamVjdERlY29kZXIgPT0gbnVsbCkge1xuICAgICAgb2JqZWN0RGVjb2RlciA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuc2V0dGluZ3MuZXhjZXB0aW9uT25JbnZhbGlkVHlwZSA9IGV4Y2VwdGlvbk9uSW52YWxpZFR5cGU7XG4gICAgdGhpcy5zZXR0aW5ncy5vYmplY3REZWNvZGVyID0gb2JqZWN0RGVjb2RlcjtcbiAgfTtcblxuICBJbmxpbmUucGFyc2UgPSBmdW5jdGlvbih2YWx1ZSwgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0RGVjb2Rlcikge1xuICAgIHZhciBjb250ZXh0LCByZXN1bHQ7XG4gICAgaWYgKGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUgPT0gbnVsbCkge1xuICAgICAgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAob2JqZWN0RGVjb2RlciA9PSBudWxsKSB7XG4gICAgICBvYmplY3REZWNvZGVyID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5zZXR0aW5ncy5leGNlcHRpb25PbkludmFsaWRUeXBlID0gZXhjZXB0aW9uT25JbnZhbGlkVHlwZTtcbiAgICB0aGlzLnNldHRpbmdzLm9iamVjdERlY29kZXIgPSBvYmplY3REZWNvZGVyO1xuICAgIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIHZhbHVlID0gVXRpbHMudHJpbSh2YWx1ZSk7XG4gICAgaWYgKDAgPT09IHZhbHVlLmxlbmd0aCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBjb250ZXh0ID0ge1xuICAgICAgZXhjZXB0aW9uT25JbnZhbGlkVHlwZTogZXhjZXB0aW9uT25JbnZhbGlkVHlwZSxcbiAgICAgIG9iamVjdERlY29kZXI6IG9iamVjdERlY29kZXIsXG4gICAgICBpOiAwXG4gICAgfTtcbiAgICBzd2l0Y2ggKHZhbHVlLmNoYXJBdCgwKSkge1xuICAgICAgY2FzZSAnWyc6XG4gICAgICAgIHJlc3VsdCA9IHRoaXMucGFyc2VTZXF1ZW5jZSh2YWx1ZSwgY29udGV4dCk7XG4gICAgICAgICsrY29udGV4dC5pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3snOlxuICAgICAgICByZXN1bHQgPSB0aGlzLnBhcnNlTWFwcGluZyh2YWx1ZSwgY29udGV4dCk7XG4gICAgICAgICsrY29udGV4dC5pO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJlc3VsdCA9IHRoaXMucGFyc2VTY2FsYXIodmFsdWUsIG51bGwsIFsnXCInLCBcIidcIl0sIGNvbnRleHQpO1xuICAgIH1cbiAgICBpZiAodGhpcy5QQVRURVJOX1RSQUlMSU5HX0NPTU1FTlRTLnJlcGxhY2UodmFsdWUuc2xpY2UoY29udGV4dC5pKSwgJycpICE9PSAnJykge1xuICAgICAgdGhyb3cgbmV3IFBhcnNlRXhjZXB0aW9uKCdVbmV4cGVjdGVkIGNoYXJhY3RlcnMgbmVhciBcIicgKyB2YWx1ZS5zbGljZShjb250ZXh0LmkpICsgJ1wiLicpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuXG4gIElubGluZS5kdW1wID0gZnVuY3Rpb24odmFsdWUsIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdEVuY29kZXIpIHtcbiAgICB2YXIgcmVmLCByZXN1bHQsIHR5cGU7XG4gICAgaWYgKGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUgPT0gbnVsbCkge1xuICAgICAgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAob2JqZWN0RW5jb2RlciA9PSBudWxsKSB7XG4gICAgICBvYmplY3RFbmNvZGVyID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHZhbHVlID09IG51bGwpIHtcbiAgICAgIHJldHVybiAnbnVsbCc7XG4gICAgfVxuICAgIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gICAgaWYgKHR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XG4gICAgICAgIHJldHVybiB2YWx1ZS50b0lTT1N0cmluZygpO1xuICAgICAgfSBlbHNlIGlmIChvYmplY3RFbmNvZGVyICE9IG51bGwpIHtcbiAgICAgICAgcmVzdWx0ID0gb2JqZWN0RW5jb2Rlcih2YWx1ZSk7XG4gICAgICAgIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnc3RyaW5nJyB8fCAocmVzdWx0ICE9IG51bGwpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXMuZHVtcE9iamVjdCh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh0eXBlID09PSAnYm9vbGVhbicpIHtcbiAgICAgIHJldHVybiAodmFsdWUgPyAndHJ1ZScgOiAnZmFsc2UnKTtcbiAgICB9XG4gICAgaWYgKFV0aWxzLmlzRGlnaXRzKHZhbHVlKSkge1xuICAgICAgcmV0dXJuICh0eXBlID09PSAnc3RyaW5nJyA/IFwiJ1wiICsgdmFsdWUgKyBcIidcIiA6IFN0cmluZyhwYXJzZUludCh2YWx1ZSkpKTtcbiAgICB9XG4gICAgaWYgKFV0aWxzLmlzTnVtZXJpYyh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiAodHlwZSA9PT0gJ3N0cmluZycgPyBcIidcIiArIHZhbHVlICsgXCInXCIgOiBTdHJpbmcocGFyc2VGbG9hdCh2YWx1ZSkpKTtcbiAgICB9XG4gICAgaWYgKHR5cGUgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gKHZhbHVlID09PSAyZTMwOCA/ICcuSW5mJyA6ICh2YWx1ZSA9PT0gLTJlMzA4ID8gJy0uSW5mJyA6IChpc05hTih2YWx1ZSkgPyAnLk5hTicgOiB2YWx1ZSkpKTtcbiAgICB9XG4gICAgaWYgKEVzY2FwZXIucmVxdWlyZXNEb3VibGVRdW90aW5nKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIEVzY2FwZXIuZXNjYXBlV2l0aERvdWJsZVF1b3Rlcyh2YWx1ZSk7XG4gICAgfVxuICAgIGlmIChFc2NhcGVyLnJlcXVpcmVzU2luZ2xlUXVvdGluZyh2YWx1ZSkpIHtcbiAgICAgIHJldHVybiBFc2NhcGVyLmVzY2FwZVdpdGhTaW5nbGVRdW90ZXModmFsdWUpO1xuICAgIH1cbiAgICBpZiAoJycgPT09IHZhbHVlKSB7XG4gICAgICByZXR1cm4gJ1wiXCInO1xuICAgIH1cbiAgICBpZiAoVXRpbHMuUEFUVEVSTl9EQVRFLnRlc3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gXCInXCIgKyB2YWx1ZSArIFwiJ1wiO1xuICAgIH1cbiAgICBpZiAoKHJlZiA9IHZhbHVlLnRvTG93ZXJDYXNlKCkpID09PSAnbnVsbCcgfHwgcmVmID09PSAnficgfHwgcmVmID09PSAndHJ1ZScgfHwgcmVmID09PSAnZmFsc2UnKSB7XG4gICAgICByZXR1cm4gXCInXCIgKyB2YWx1ZSArIFwiJ1wiO1xuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG4gIH07XG5cbiAgSW5saW5lLmR1bXBPYmplY3QgPSBmdW5jdGlvbih2YWx1ZSwgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0U3VwcG9ydCkge1xuICAgIHZhciBqLCBrZXksIGxlbjEsIG91dHB1dCwgdmFsO1xuICAgIGlmIChvYmplY3RTdXBwb3J0ID09IG51bGwpIHtcbiAgICAgIG9iamVjdFN1cHBvcnQgPSBudWxsO1xuICAgIH1cbiAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgb3V0cHV0ID0gW107XG4gICAgICBmb3IgKGogPSAwLCBsZW4xID0gdmFsdWUubGVuZ3RoOyBqIDwgbGVuMTsgaisrKSB7XG4gICAgICAgIHZhbCA9IHZhbHVlW2pdO1xuICAgICAgICBvdXRwdXQucHVzaCh0aGlzLmR1bXAodmFsKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gJ1snICsgb3V0cHV0LmpvaW4oJywgJykgKyAnXSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dHB1dCA9IFtdO1xuICAgICAgZm9yIChrZXkgaW4gdmFsdWUpIHtcbiAgICAgICAgdmFsID0gdmFsdWVba2V5XTtcbiAgICAgICAgb3V0cHV0LnB1c2godGhpcy5kdW1wKGtleSkgKyAnOiAnICsgdGhpcy5kdW1wKHZhbCkpO1xuICAgICAgfVxuICAgICAgcmV0dXJuICd7JyArIG91dHB1dC5qb2luKCcsICcpICsgJ30nO1xuICAgIH1cbiAgfTtcblxuICBJbmxpbmUucGFyc2VTY2FsYXIgPSBmdW5jdGlvbihzY2FsYXIsIGRlbGltaXRlcnMsIHN0cmluZ0RlbGltaXRlcnMsIGNvbnRleHQsIGV2YWx1YXRlKSB7XG4gICAgdmFyIGksIGpvaW5lZERlbGltaXRlcnMsIG1hdGNoLCBvdXRwdXQsIHBhdHRlcm4sIHJlZiwgcmVmMSwgc3RycG9zLCB0bXA7XG4gICAgaWYgKGRlbGltaXRlcnMgPT0gbnVsbCkge1xuICAgICAgZGVsaW1pdGVycyA9IG51bGw7XG4gICAgfVxuICAgIGlmIChzdHJpbmdEZWxpbWl0ZXJzID09IG51bGwpIHtcbiAgICAgIHN0cmluZ0RlbGltaXRlcnMgPSBbJ1wiJywgXCInXCJdO1xuICAgIH1cbiAgICBpZiAoY29udGV4dCA9PSBudWxsKSB7XG4gICAgICBjb250ZXh0ID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKGV2YWx1YXRlID09IG51bGwpIHtcbiAgICAgIGV2YWx1YXRlID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKGNvbnRleHQgPT0gbnVsbCkge1xuICAgICAgY29udGV4dCA9IHtcbiAgICAgICAgZXhjZXB0aW9uT25JbnZhbGlkVHlwZTogdGhpcy5zZXR0aW5ncy5leGNlcHRpb25PbkludmFsaWRUeXBlLFxuICAgICAgICBvYmplY3REZWNvZGVyOiB0aGlzLnNldHRpbmdzLm9iamVjdERlY29kZXIsXG4gICAgICAgIGk6IDBcbiAgICAgIH07XG4gICAgfVxuICAgIGkgPSBjb250ZXh0Lmk7XG4gICAgaWYgKHJlZiA9IHNjYWxhci5jaGFyQXQoaSksIGluZGV4T2YuY2FsbChzdHJpbmdEZWxpbWl0ZXJzLCByZWYpID49IDApIHtcbiAgICAgIG91dHB1dCA9IHRoaXMucGFyc2VRdW90ZWRTY2FsYXIoc2NhbGFyLCBjb250ZXh0KTtcbiAgICAgIGkgPSBjb250ZXh0Lmk7XG4gICAgICBpZiAoZGVsaW1pdGVycyAhPSBudWxsKSB7XG4gICAgICAgIHRtcCA9IFV0aWxzLmx0cmltKHNjYWxhci5zbGljZShpKSwgJyAnKTtcbiAgICAgICAgaWYgKCEocmVmMSA9IHRtcC5jaGFyQXQoMCksIGluZGV4T2YuY2FsbChkZWxpbWl0ZXJzLCByZWYxKSA+PSAwKSkge1xuICAgICAgICAgIHRocm93IG5ldyBQYXJzZUV4Y2VwdGlvbignVW5leHBlY3RlZCBjaGFyYWN0ZXJzICgnICsgc2NhbGFyLnNsaWNlKGkpICsgJykuJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCFkZWxpbWl0ZXJzKSB7XG4gICAgICAgIG91dHB1dCA9IHNjYWxhci5zbGljZShpKTtcbiAgICAgICAgaSArPSBvdXRwdXQubGVuZ3RoO1xuICAgICAgICBzdHJwb3MgPSBvdXRwdXQuaW5kZXhPZignICMnKTtcbiAgICAgICAgaWYgKHN0cnBvcyAhPT0gLTEpIHtcbiAgICAgICAgICBvdXRwdXQgPSBVdGlscy5ydHJpbShvdXRwdXQuc2xpY2UoMCwgc3RycG9zKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGpvaW5lZERlbGltaXRlcnMgPSBkZWxpbWl0ZXJzLmpvaW4oJ3wnKTtcbiAgICAgICAgcGF0dGVybiA9IHRoaXMuUEFUVEVSTl9TQ0FMQVJfQllfREVMSU1JVEVSU1tqb2luZWREZWxpbWl0ZXJzXTtcbiAgICAgICAgaWYgKHBhdHRlcm4gPT0gbnVsbCkge1xuICAgICAgICAgIHBhdHRlcm4gPSBuZXcgUGF0dGVybignXiguKz8pKCcgKyBqb2luZWREZWxpbWl0ZXJzICsgJyknKTtcbiAgICAgICAgICB0aGlzLlBBVFRFUk5fU0NBTEFSX0JZX0RFTElNSVRFUlNbam9pbmVkRGVsaW1pdGVyc10gPSBwYXR0ZXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXRjaCA9IHBhdHRlcm4uZXhlYyhzY2FsYXIuc2xpY2UoaSkpKSB7XG4gICAgICAgICAgb3V0cHV0ID0gbWF0Y2hbMV07XG4gICAgICAgICAgaSArPSBvdXRwdXQubGVuZ3RoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IG5ldyBQYXJzZUV4Y2VwdGlvbignTWFsZm9ybWVkIGlubGluZSBZQU1MIHN0cmluZyAoJyArIHNjYWxhciArICcpLicpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZXZhbHVhdGUpIHtcbiAgICAgICAgb3V0cHV0ID0gdGhpcy5ldmFsdWF0ZVNjYWxhcihvdXRwdXQsIGNvbnRleHQpO1xuICAgICAgfVxuICAgIH1cbiAgICBjb250ZXh0LmkgPSBpO1xuICAgIHJldHVybiBvdXRwdXQ7XG4gIH07XG5cbiAgSW5saW5lLnBhcnNlUXVvdGVkU2NhbGFyID0gZnVuY3Rpb24oc2NhbGFyLCBjb250ZXh0KSB7XG4gICAgdmFyIGksIG1hdGNoLCBvdXRwdXQ7XG4gICAgaSA9IGNvbnRleHQuaTtcbiAgICBpZiAoIShtYXRjaCA9IHRoaXMuUEFUVEVSTl9RVU9URURfU0NBTEFSLmV4ZWMoc2NhbGFyLnNsaWNlKGkpKSkpIHtcbiAgICAgIHRocm93IG5ldyBQYXJzZU1vcmUoJ01hbGZvcm1lZCBpbmxpbmUgWUFNTCBzdHJpbmcgKCcgKyBzY2FsYXIuc2xpY2UoaSkgKyAnKS4nKTtcbiAgICB9XG4gICAgb3V0cHV0ID0gbWF0Y2hbMF0uc3Vic3RyKDEsIG1hdGNoWzBdLmxlbmd0aCAtIDIpO1xuICAgIGlmICgnXCInID09PSBzY2FsYXIuY2hhckF0KGkpKSB7XG4gICAgICBvdXRwdXQgPSBVbmVzY2FwZXIudW5lc2NhcGVEb3VibGVRdW90ZWRTdHJpbmcob3V0cHV0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0cHV0ID0gVW5lc2NhcGVyLnVuZXNjYXBlU2luZ2xlUXVvdGVkU3RyaW5nKG91dHB1dCk7XG4gICAgfVxuICAgIGkgKz0gbWF0Y2hbMF0ubGVuZ3RoO1xuICAgIGNvbnRleHQuaSA9IGk7XG4gICAgcmV0dXJuIG91dHB1dDtcbiAgfTtcblxuICBJbmxpbmUucGFyc2VTZXF1ZW5jZSA9IGZ1bmN0aW9uKHNlcXVlbmNlLCBjb250ZXh0KSB7XG4gICAgdmFyIGUsIGksIGlzUXVvdGVkLCBsZW4sIG91dHB1dCwgcmVmLCB2YWx1ZTtcbiAgICBvdXRwdXQgPSBbXTtcbiAgICBsZW4gPSBzZXF1ZW5jZS5sZW5ndGg7XG4gICAgaSA9IGNvbnRleHQuaTtcbiAgICBpICs9IDE7XG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgIGNvbnRleHQuaSA9IGk7XG4gICAgICBzd2l0Y2ggKHNlcXVlbmNlLmNoYXJBdChpKSkge1xuICAgICAgICBjYXNlICdbJzpcbiAgICAgICAgICBvdXRwdXQucHVzaCh0aGlzLnBhcnNlU2VxdWVuY2Uoc2VxdWVuY2UsIGNvbnRleHQpKTtcbiAgICAgICAgICBpID0gY29udGV4dC5pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICd7JzpcbiAgICAgICAgICBvdXRwdXQucHVzaCh0aGlzLnBhcnNlTWFwcGluZyhzZXF1ZW5jZSwgY29udGV4dCkpO1xuICAgICAgICAgIGkgPSBjb250ZXh0Lmk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ10nOlxuICAgICAgICAgIHJldHVybiBvdXRwdXQ7XG4gICAgICAgIGNhc2UgJywnOlxuICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgY2FzZSBcIlxcblwiOlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGlzUXVvdGVkID0gKChyZWYgPSBzZXF1ZW5jZS5jaGFyQXQoaSkpID09PSAnXCInIHx8IHJlZiA9PT0gXCInXCIpO1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5wYXJzZVNjYWxhcihzZXF1ZW5jZSwgWycsJywgJ10nXSwgWydcIicsIFwiJ1wiXSwgY29udGV4dCk7XG4gICAgICAgICAgaSA9IGNvbnRleHQuaTtcbiAgICAgICAgICBpZiAoIWlzUXVvdGVkICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycgJiYgKHZhbHVlLmluZGV4T2YoJzogJykgIT09IC0xIHx8IHZhbHVlLmluZGV4T2YoXCI6XFxuXCIpICE9PSAtMSkpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5wYXJzZU1hcHBpbmcoJ3snICsgdmFsdWUgKyAnfScpO1xuICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBvdXRwdXQucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgLS1pO1xuICAgICAgfVxuICAgICAgKytpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgUGFyc2VNb3JlKCdNYWxmb3JtZWQgaW5saW5lIFlBTUwgc3RyaW5nICcgKyBzZXF1ZW5jZSk7XG4gIH07XG5cbiAgSW5saW5lLnBhcnNlTWFwcGluZyA9IGZ1bmN0aW9uKG1hcHBpbmcsIGNvbnRleHQpIHtcbiAgICB2YXIgZG9uZSwgaSwga2V5LCBsZW4sIG91dHB1dCwgc2hvdWxkQ29udGludWVXaGlsZUxvb3AsIHZhbHVlO1xuICAgIG91dHB1dCA9IHt9O1xuICAgIGxlbiA9IG1hcHBpbmcubGVuZ3RoO1xuICAgIGkgPSBjb250ZXh0Lmk7XG4gICAgaSArPSAxO1xuICAgIHNob3VsZENvbnRpbnVlV2hpbGVMb29wID0gZmFsc2U7XG4gICAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICAgIGNvbnRleHQuaSA9IGk7XG4gICAgICBzd2l0Y2ggKG1hcHBpbmcuY2hhckF0KGkpKSB7XG4gICAgICAgIGNhc2UgJyAnOlxuICAgICAgICBjYXNlICcsJzpcbiAgICAgICAgY2FzZSBcIlxcblwiOlxuICAgICAgICAgICsraTtcbiAgICAgICAgICBjb250ZXh0LmkgPSBpO1xuICAgICAgICAgIHNob3VsZENvbnRpbnVlV2hpbGVMb29wID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnfSc6XG4gICAgICAgICAgcmV0dXJuIG91dHB1dDtcbiAgICAgIH1cbiAgICAgIGlmIChzaG91bGRDb250aW51ZVdoaWxlTG9vcCkge1xuICAgICAgICBzaG91bGRDb250aW51ZVdoaWxlTG9vcCA9IGZhbHNlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGtleSA9IHRoaXMucGFyc2VTY2FsYXIobWFwcGluZywgWyc6JywgJyAnLCBcIlxcblwiXSwgWydcIicsIFwiJ1wiXSwgY29udGV4dCwgZmFsc2UpO1xuICAgICAgaSA9IGNvbnRleHQuaTtcbiAgICAgIGRvbmUgPSBmYWxzZTtcbiAgICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICAgIGNvbnRleHQuaSA9IGk7XG4gICAgICAgIHN3aXRjaCAobWFwcGluZy5jaGFyQXQoaSkpIHtcbiAgICAgICAgICBjYXNlICdbJzpcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5wYXJzZVNlcXVlbmNlKG1hcHBpbmcsIGNvbnRleHQpO1xuICAgICAgICAgICAgaSA9IGNvbnRleHQuaTtcbiAgICAgICAgICAgIGlmIChvdXRwdXRba2V5XSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIG91dHB1dFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3snOlxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnBhcnNlTWFwcGluZyhtYXBwaW5nLCBjb250ZXh0KTtcbiAgICAgICAgICAgIGkgPSBjb250ZXh0Lmk7XG4gICAgICAgICAgICBpZiAob3V0cHV0W2tleV0gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICBvdXRwdXRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9uZSA9IHRydWU7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICc6JzpcbiAgICAgICAgICBjYXNlICcgJzpcbiAgICAgICAgICBjYXNlIFwiXFxuXCI6XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnBhcnNlU2NhbGFyKG1hcHBpbmcsIFsnLCcsICd9J10sIFsnXCInLCBcIidcIl0sIGNvbnRleHQpO1xuICAgICAgICAgICAgaSA9IGNvbnRleHQuaTtcbiAgICAgICAgICAgIGlmIChvdXRwdXRba2V5XSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIG91dHB1dFtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIC0taTtcbiAgICAgICAgfVxuICAgICAgICArK2k7XG4gICAgICAgIGlmIChkb25lKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhyb3cgbmV3IFBhcnNlTW9yZSgnTWFsZm9ybWVkIGlubGluZSBZQU1MIHN0cmluZyAnICsgbWFwcGluZyk7XG4gIH07XG5cbiAgSW5saW5lLmV2YWx1YXRlU2NhbGFyID0gZnVuY3Rpb24oc2NhbGFyLCBjb250ZXh0KSB7XG4gICAgdmFyIGNhc3QsIGRhdGUsIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIGZpcnN0Q2hhciwgZmlyc3RTcGFjZSwgZmlyc3RXb3JkLCBvYmplY3REZWNvZGVyLCByYXcsIHNjYWxhckxvd2VyLCBzdWJWYWx1ZSwgdHJpbW1lZFNjYWxhcjtcbiAgICBzY2FsYXIgPSBVdGlscy50cmltKHNjYWxhcik7XG4gICAgc2NhbGFyTG93ZXIgPSBzY2FsYXIudG9Mb3dlckNhc2UoKTtcbiAgICBzd2l0Y2ggKHNjYWxhckxvd2VyKSB7XG4gICAgICBjYXNlICdudWxsJzpcbiAgICAgIGNhc2UgJyc6XG4gICAgICBjYXNlICd+JzpcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICBjYXNlICd0cnVlJzpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlICdmYWxzZSc6XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIGNhc2UgJy5pbmYnOlxuICAgICAgICByZXR1cm4gMmUzMDg7XG4gICAgICBjYXNlICcubmFuJzpcbiAgICAgICAgcmV0dXJuIDAvMDtcbiAgICAgIGNhc2UgJy0uaW5mJzpcbiAgICAgICAgcmV0dXJuIDJlMzA4O1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgZmlyc3RDaGFyID0gc2NhbGFyTG93ZXIuY2hhckF0KDApO1xuICAgICAgICBzd2l0Y2ggKGZpcnN0Q2hhcikge1xuICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgZmlyc3RTcGFjZSA9IHNjYWxhci5pbmRleE9mKCcgJyk7XG4gICAgICAgICAgICBpZiAoZmlyc3RTcGFjZSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgZmlyc3RXb3JkID0gc2NhbGFyTG93ZXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmaXJzdFdvcmQgPSBzY2FsYXJMb3dlci5zbGljZSgwLCBmaXJzdFNwYWNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAoZmlyc3RXb3JkKSB7XG4gICAgICAgICAgICAgIGNhc2UgJyEnOlxuICAgICAgICAgICAgICAgIGlmIChmaXJzdFNwYWNlICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMucGFyc2VTY2FsYXIoc2NhbGFyLnNsaWNlKDIpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICBjYXNlICchc3RyJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gVXRpbHMubHRyaW0oc2NhbGFyLnNsaWNlKDQpKTtcbiAgICAgICAgICAgICAgY2FzZSAnISFzdHInOlxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5sdHJpbShzY2FsYXIuc2xpY2UoNSkpO1xuICAgICAgICAgICAgICBjYXNlICchIWludCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlSW50KHRoaXMucGFyc2VTY2FsYXIoc2NhbGFyLnNsaWNlKDUpKSk7XG4gICAgICAgICAgICAgIGNhc2UgJyEhYm9vbCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIFV0aWxzLnBhcnNlQm9vbGVhbih0aGlzLnBhcnNlU2NhbGFyKHNjYWxhci5zbGljZSg2KSksIGZhbHNlKTtcbiAgICAgICAgICAgICAgY2FzZSAnISFmbG9hdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQodGhpcy5wYXJzZVNjYWxhcihzY2FsYXIuc2xpY2UoNykpKTtcbiAgICAgICAgICAgICAgY2FzZSAnISF0aW1lc3RhbXAnOlxuICAgICAgICAgICAgICAgIHJldHVybiBVdGlscy5zdHJpbmdUb0RhdGUoVXRpbHMubHRyaW0oc2NhbGFyLnNsaWNlKDExKSkpO1xuICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGlmIChjb250ZXh0ID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnRleHQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGU6IHRoaXMuc2V0dGluZ3MuZXhjZXB0aW9uT25JbnZhbGlkVHlwZSxcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0RGVjb2RlcjogdGhpcy5zZXR0aW5ncy5vYmplY3REZWNvZGVyLFxuICAgICAgICAgICAgICAgICAgICBpOiAwXG4gICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBvYmplY3REZWNvZGVyID0gY29udGV4dC5vYmplY3REZWNvZGVyLCBleGNlcHRpb25PbkludmFsaWRUeXBlID0gY29udGV4dC5leGNlcHRpb25PbkludmFsaWRUeXBlO1xuICAgICAgICAgICAgICAgIGlmIChvYmplY3REZWNvZGVyKSB7XG4gICAgICAgICAgICAgICAgICB0cmltbWVkU2NhbGFyID0gVXRpbHMucnRyaW0oc2NhbGFyKTtcbiAgICAgICAgICAgICAgICAgIGZpcnN0U3BhY2UgPSB0cmltbWVkU2NhbGFyLmluZGV4T2YoJyAnKTtcbiAgICAgICAgICAgICAgICAgIGlmIChmaXJzdFNwYWNlID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0RGVjb2Rlcih0cmltbWVkU2NhbGFyLCBudWxsKTtcbiAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YlZhbHVlID0gVXRpbHMubHRyaW0odHJpbW1lZFNjYWxhci5zbGljZShmaXJzdFNwYWNlICsgMSkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShzdWJWYWx1ZS5sZW5ndGggPiAwKSkge1xuICAgICAgICAgICAgICAgICAgICAgIHN1YlZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0RGVjb2Rlcih0cmltbWVkU2NhbGFyLnNsaWNlKDAsIGZpcnN0U3BhY2UpLCBzdWJWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChleGNlcHRpb25PbkludmFsaWRUeXBlKSB7XG4gICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUGFyc2VFeGNlcHRpb24oJ0N1c3RvbSBvYmplY3Qgc3VwcG9ydCB3aGVuIHBhcnNpbmcgYSBZQU1MIGZpbGUgaGFzIGJlZW4gZGlzYWJsZWQuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnMCc6XG4gICAgICAgICAgICBpZiAoJzB4JyA9PT0gc2NhbGFyLnNsaWNlKDAsIDIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBVdGlscy5oZXhEZWMoc2NhbGFyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNEaWdpdHMoc2NhbGFyKSkge1xuICAgICAgICAgICAgICByZXR1cm4gVXRpbHMub2N0RGVjKHNjYWxhcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFV0aWxzLmlzTnVtZXJpYyhzY2FsYXIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHNjYWxhcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZXR1cm4gc2NhbGFyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnKyc6XG4gICAgICAgICAgICBpZiAoVXRpbHMuaXNEaWdpdHMoc2NhbGFyKSkge1xuICAgICAgICAgICAgICByYXcgPSBzY2FsYXI7XG4gICAgICAgICAgICAgIGNhc3QgPSBwYXJzZUludChyYXcpO1xuICAgICAgICAgICAgICBpZiAocmF3ID09PSBTdHJpbmcoY2FzdCkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FzdDtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmF3O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFV0aWxzLmlzTnVtZXJpYyhzY2FsYXIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHNjYWxhcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuUEFUVEVSTl9USE9VU0FORF9OVU1FUklDX1NDQUxBUi50ZXN0KHNjYWxhcikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoc2NhbGFyLnJlcGxhY2UoJywnLCAnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNjYWxhcjtcbiAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgIGlmIChVdGlscy5pc0RpZ2l0cyhzY2FsYXIuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICAgIGlmICgnMCcgPT09IHNjYWxhci5jaGFyQXQoMSkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gLVV0aWxzLm9jdERlYyhzY2FsYXIuc2xpY2UoMSkpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJhdyA9IHNjYWxhci5zbGljZSgxKTtcbiAgICAgICAgICAgICAgICBjYXN0ID0gcGFyc2VJbnQocmF3KTtcbiAgICAgICAgICAgICAgICBpZiAocmF3ID09PSBTdHJpbmcoY2FzdCkpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiAtY2FzdDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIC1yYXc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2UgaWYgKFV0aWxzLmlzTnVtZXJpYyhzY2FsYXIpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBwYXJzZUZsb2F0KHNjYWxhcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuUEFUVEVSTl9USE9VU0FORF9OVU1FUklDX1NDQUxBUi50ZXN0KHNjYWxhcikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoc2NhbGFyLnJlcGxhY2UoJywnLCAnJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNjYWxhcjtcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgaWYgKGRhdGUgPSBVdGlscy5zdHJpbmdUb0RhdGUoc2NhbGFyKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZGF0ZTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoVXRpbHMuaXNOdW1lcmljKHNjYWxhcikpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHBhcnNlRmxvYXQoc2NhbGFyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5QQVRURVJOX1RIT1VTQU5EX05VTUVSSUNfU0NBTEFSLnRlc3Qoc2NhbGFyKSkge1xuICAgICAgICAgICAgICByZXR1cm4gcGFyc2VGbG9hdChzY2FsYXIucmVwbGFjZSgnLCcsICcnKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gc2NhbGFyO1xuICAgICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBJbmxpbmU7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gSW5saW5lO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEyLjRcbnZhciBJbmxpbmUsIFBhcnNlRXhjZXB0aW9uLCBQYXJzZU1vcmUsIFBhcnNlciwgUGF0dGVybiwgVXRpbHM7XG5cbklubGluZSA9IHJlcXVpcmUoJy4vSW5saW5lJyk7XG5cblBhdHRlcm4gPSByZXF1aXJlKCcuL1BhdHRlcm4nKTtcblxuVXRpbHMgPSByZXF1aXJlKCcuL1V0aWxzJyk7XG5cblBhcnNlRXhjZXB0aW9uID0gcmVxdWlyZSgnLi9FeGNlcHRpb24vUGFyc2VFeGNlcHRpb24nKTtcblxuUGFyc2VNb3JlID0gcmVxdWlyZSgnLi9FeGNlcHRpb24vUGFyc2VNb3JlJyk7XG5cblBhcnNlciA9IChmdW5jdGlvbigpIHtcbiAgUGFyc2VyLnByb3RvdHlwZS5QQVRURVJOX0ZPTERFRF9TQ0FMQVJfQUxMID0gbmV3IFBhdHRlcm4oJ14oPzooPzx0eXBlPiFbXlxcXFx8Pl0qKVxcXFxzKyk/KD88c2VwYXJhdG9yPlxcXFx8fD4pKD88bW9kaWZpZXJzPlxcXFwrfFxcXFwtfFxcXFxkK3xcXFxcK1xcXFxkK3xcXFxcLVxcXFxkK3xcXFxcZCtcXFxcK3xcXFxcZCtcXFxcLSk/KD88Y29tbWVudHM+ICsjLiopPyQnKTtcblxuICBQYXJzZXIucHJvdG90eXBlLlBBVFRFUk5fRk9MREVEX1NDQUxBUl9FTkQgPSBuZXcgUGF0dGVybignKD88c2VwYXJhdG9yPlxcXFx8fD4pKD88bW9kaWZpZXJzPlxcXFwrfFxcXFwtfFxcXFxkK3xcXFxcK1xcXFxkK3xcXFxcLVxcXFxkK3xcXFxcZCtcXFxcK3xcXFxcZCtcXFxcLSk/KD88Y29tbWVudHM+ICsjLiopPyQnKTtcblxuICBQYXJzZXIucHJvdG90eXBlLlBBVFRFUk5fU0VRVUVOQ0VfSVRFTSA9IG5ldyBQYXR0ZXJuKCdeXFxcXC0oKD88bGVhZHNwYWNlcz5cXFxccyspKD88dmFsdWU+Lis/KSk/XFxcXHMqJCcpO1xuXG4gIFBhcnNlci5wcm90b3R5cGUuUEFUVEVSTl9BTkNIT1JfVkFMVUUgPSBuZXcgUGF0dGVybignXiYoPzxyZWY+W14gXSspICooPzx2YWx1ZT4uKiknKTtcblxuICBQYXJzZXIucHJvdG90eXBlLlBBVFRFUk5fQ09NUEFDVF9OT1RBVElPTiA9IG5ldyBQYXR0ZXJuKCdeKD88a2V5PicgKyBJbmxpbmUuUkVHRVhfUVVPVEVEX1NUUklORyArICd8W14gXFwnXCJcXFxce1xcXFxbXS4qPykgKlxcXFw6KFxcXFxzKyg/PHZhbHVlPi4rPykpP1xcXFxzKiQnKTtcblxuICBQYXJzZXIucHJvdG90eXBlLlBBVFRFUk5fTUFQUElOR19JVEVNID0gbmV3IFBhdHRlcm4oJ14oPzxrZXk+JyArIElubGluZS5SRUdFWF9RVU9URURfU1RSSU5HICsgJ3xbXiBcXCdcIlxcXFxbXFxcXHtdLio/KSAqXFxcXDooXFxcXHMrKD88dmFsdWU+Lis/KSk/XFxcXHMqJCcpO1xuXG4gIFBhcnNlci5wcm90b3R5cGUuUEFUVEVSTl9ERUNJTUFMID0gbmV3IFBhdHRlcm4oJ1xcXFxkKycpO1xuXG4gIFBhcnNlci5wcm90b3R5cGUuUEFUVEVSTl9JTkRFTlRfU1BBQ0VTID0gbmV3IFBhdHRlcm4oJ14gKycpO1xuXG4gIFBhcnNlci5wcm90b3R5cGUuUEFUVEVSTl9UUkFJTElOR19MSU5FUyA9IG5ldyBQYXR0ZXJuKCcoXFxuKikkJyk7XG5cbiAgUGFyc2VyLnByb3RvdHlwZS5QQVRURVJOX1lBTUxfSEVBREVSID0gbmV3IFBhdHRlcm4oJ15cXFxcJVlBTUxbOiBdW1xcXFxkXFxcXC5dKy4qXFxuJywgJ20nKTtcblxuICBQYXJzZXIucHJvdG90eXBlLlBBVFRFUk5fTEVBRElOR19DT01NRU5UUyA9IG5ldyBQYXR0ZXJuKCdeKFxcXFwjLio/XFxuKSsnLCAnbScpO1xuXG4gIFBhcnNlci5wcm90b3R5cGUuUEFUVEVSTl9ET0NVTUVOVF9NQVJLRVJfU1RBUlQgPSBuZXcgUGF0dGVybignXlxcXFwtXFxcXC1cXFxcLS4qP1xcbicsICdtJyk7XG5cbiAgUGFyc2VyLnByb3RvdHlwZS5QQVRURVJOX0RPQ1VNRU5UX01BUktFUl9FTkQgPSBuZXcgUGF0dGVybignXlxcXFwuXFxcXC5cXFxcLlxcXFxzKiQnLCAnbScpO1xuXG4gIFBhcnNlci5wcm90b3R5cGUuUEFUVEVSTl9GT0xERURfU0NBTEFSX0JZX0lOREVOVEFUSU9OID0ge307XG5cbiAgUGFyc2VyLnByb3RvdHlwZS5DT05URVhUX05PTkUgPSAwO1xuXG4gIFBhcnNlci5wcm90b3R5cGUuQ09OVEVYVF9TRVFVRU5DRSA9IDE7XG5cbiAgUGFyc2VyLnByb3RvdHlwZS5DT05URVhUX01BUFBJTkcgPSAyO1xuXG4gIGZ1bmN0aW9uIFBhcnNlcihvZmZzZXQpIHtcbiAgICB0aGlzLm9mZnNldCA9IG9mZnNldCAhPSBudWxsID8gb2Zmc2V0IDogMDtcbiAgICB0aGlzLmxpbmVzID0gW107XG4gICAgdGhpcy5jdXJyZW50TGluZU5iID0gLTE7XG4gICAgdGhpcy5jdXJyZW50TGluZSA9ICcnO1xuICAgIHRoaXMucmVmcyA9IHt9O1xuICB9XG5cbiAgUGFyc2VyLnByb3RvdHlwZS5wYXJzZSA9IGZ1bmN0aW9uKHZhbHVlLCBleGNlcHRpb25PbkludmFsaWRUeXBlLCBvYmplY3REZWNvZGVyKSB7XG4gICAgdmFyIGFsaWFzLCBhbGxvd092ZXJ3cml0ZSwgYmxvY2ssIGMsIGNvbnRleHQsIGRhdGEsIGUsIGZpcnN0LCBpLCBpbmRlbnQsIGlzUmVmLCBqLCBrLCBrZXksIGwsIGxhc3RLZXksIGxlbiwgbGVuMSwgbGVuMiwgbGVuMywgbGluZUNvdW50LCBtLCBtYXRjaGVzLCBtZXJnZU5vZGUsIG4sIG5hbWUsIHBhcnNlZCwgcGFyc2VkSXRlbSwgcGFyc2VyLCByZWYsIHJlZjEsIHJlZjIsIHJlZk5hbWUsIHJlZlZhbHVlLCB2YWwsIHZhbHVlcztcbiAgICBpZiAoZXhjZXB0aW9uT25JbnZhbGlkVHlwZSA9PSBudWxsKSB7XG4gICAgICBleGNlcHRpb25PbkludmFsaWRUeXBlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChvYmplY3REZWNvZGVyID09IG51bGwpIHtcbiAgICAgIG9iamVjdERlY29kZXIgPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLmN1cnJlbnRMaW5lTmIgPSAtMTtcbiAgICB0aGlzLmN1cnJlbnRMaW5lID0gJyc7XG4gICAgdGhpcy5saW5lcyA9IHRoaXMuY2xlYW51cCh2YWx1ZSkuc3BsaXQoXCJcXG5cIik7XG4gICAgZGF0YSA9IG51bGw7XG4gICAgY29udGV4dCA9IHRoaXMuQ09OVEVYVF9OT05FO1xuICAgIGFsbG93T3ZlcndyaXRlID0gZmFsc2U7XG4gICAgd2hpbGUgKHRoaXMubW92ZVRvTmV4dExpbmUoKSkge1xuICAgICAgaWYgKHRoaXMuaXNDdXJyZW50TGluZUVtcHR5KCkpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAoXCJcXHRcIiA9PT0gdGhpcy5jdXJyZW50TGluZVswXSkge1xuICAgICAgICB0aHJvdyBuZXcgUGFyc2VFeGNlcHRpb24oJ0EgWUFNTCBmaWxlIGNhbm5vdCBjb250YWluIHRhYnMgYXMgaW5kZW50YXRpb24uJywgdGhpcy5nZXRSZWFsQ3VycmVudExpbmVOYigpICsgMSwgdGhpcy5jdXJyZW50TGluZSk7XG4gICAgICB9XG4gICAgICBpc1JlZiA9IG1lcmdlTm9kZSA9IGZhbHNlO1xuICAgICAgaWYgKHZhbHVlcyA9IHRoaXMuUEFUVEVSTl9TRVFVRU5DRV9JVEVNLmV4ZWModGhpcy5jdXJyZW50TGluZSkpIHtcbiAgICAgICAgaWYgKHRoaXMuQ09OVEVYVF9NQVBQSU5HID09PSBjb250ZXh0KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFBhcnNlRXhjZXB0aW9uKCdZb3UgY2Fubm90IGRlZmluZSBhIHNlcXVlbmNlIGl0ZW0gd2hlbiBpbiBhIG1hcHBpbmcnKTtcbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0ID0gdGhpcy5DT05URVhUX1NFUVVFTkNFO1xuICAgICAgICBpZiAoZGF0YSA9PSBudWxsKSB7XG4gICAgICAgICAgZGF0YSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGlmICgodmFsdWVzLnZhbHVlICE9IG51bGwpICYmIChtYXRjaGVzID0gdGhpcy5QQVRURVJOX0FOQ0hPUl9WQUxVRS5leGVjKHZhbHVlcy52YWx1ZSkpKSB7XG4gICAgICAgICAgaXNSZWYgPSBtYXRjaGVzLnJlZjtcbiAgICAgICAgICB2YWx1ZXMudmFsdWUgPSBtYXRjaGVzLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKHZhbHVlcy52YWx1ZSAhPSBudWxsKSB8fCAnJyA9PT0gVXRpbHMudHJpbSh2YWx1ZXMudmFsdWUsICcgJykgfHwgVXRpbHMubHRyaW0odmFsdWVzLnZhbHVlLCAnICcpLmluZGV4T2YoJyMnKSA9PT0gMCkge1xuICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRMaW5lTmIgPCB0aGlzLmxpbmVzLmxlbmd0aCAtIDEgJiYgIXRoaXMuaXNOZXh0TGluZVVuSW5kZW50ZWRDb2xsZWN0aW9uKCkpIHtcbiAgICAgICAgICAgIGMgPSB0aGlzLmdldFJlYWxDdXJyZW50TGluZU5iKCkgKyAxO1xuICAgICAgICAgICAgcGFyc2VyID0gbmV3IFBhcnNlcihjKTtcbiAgICAgICAgICAgIHBhcnNlci5yZWZzID0gdGhpcy5yZWZzO1xuICAgICAgICAgICAgZGF0YS5wdXNoKHBhcnNlci5wYXJzZSh0aGlzLmdldE5leHRFbWJlZEJsb2NrKG51bGwsIHRydWUpLCBleGNlcHRpb25PbkludmFsaWRUeXBlLCBvYmplY3REZWNvZGVyKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRhdGEucHVzaChudWxsKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKCgocmVmID0gdmFsdWVzLmxlYWRzcGFjZXMpICE9IG51bGwgPyByZWYubGVuZ3RoIDogdm9pZCAwKSAmJiAobWF0Y2hlcyA9IHRoaXMuUEFUVEVSTl9DT01QQUNUX05PVEFUSU9OLmV4ZWModmFsdWVzLnZhbHVlKSkpIHtcbiAgICAgICAgICAgIGMgPSB0aGlzLmdldFJlYWxDdXJyZW50TGluZU5iKCk7XG4gICAgICAgICAgICBwYXJzZXIgPSBuZXcgUGFyc2VyKGMpO1xuICAgICAgICAgICAgcGFyc2VyLnJlZnMgPSB0aGlzLnJlZnM7XG4gICAgICAgICAgICBibG9jayA9IHZhbHVlcy52YWx1ZTtcbiAgICAgICAgICAgIGluZGVudCA9IHRoaXMuZ2V0Q3VycmVudExpbmVJbmRlbnRhdGlvbigpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNOZXh0TGluZUluZGVudGVkKGZhbHNlKSkge1xuICAgICAgICAgICAgICBibG9jayArPSBcIlxcblwiICsgdGhpcy5nZXROZXh0RW1iZWRCbG9jayhpbmRlbnQgKyB2YWx1ZXMubGVhZHNwYWNlcy5sZW5ndGggKyAxLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRhdGEucHVzaChwYXJzZXIucGFyc2UoYmxvY2ssIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdERlY29kZXIpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGF0YS5wdXNoKHRoaXMucGFyc2VWYWx1ZSh2YWx1ZXMudmFsdWUsIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdERlY29kZXIpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoKHZhbHVlcyA9IHRoaXMuUEFUVEVSTl9NQVBQSU5HX0lURU0uZXhlYyh0aGlzLmN1cnJlbnRMaW5lKSkgJiYgdmFsdWVzLmtleS5pbmRleE9mKCcgIycpID09PSAtMSkge1xuICAgICAgICBpZiAodGhpcy5DT05URVhUX1NFUVVFTkNFID09PSBjb250ZXh0KSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFBhcnNlRXhjZXB0aW9uKCdZb3UgY2Fubm90IGRlZmluZSBhIG1hcHBpbmcgaXRlbSB3aGVuIGluIGEgc2VxdWVuY2UnKTtcbiAgICAgICAgfVxuICAgICAgICBjb250ZXh0ID0gdGhpcy5DT05URVhUX01BUFBJTkc7XG4gICAgICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgICAgICBkYXRhID0ge307XG4gICAgICAgIH1cbiAgICAgICAgSW5saW5lLmNvbmZpZ3VyZShleGNlcHRpb25PbkludmFsaWRUeXBlLCBvYmplY3REZWNvZGVyKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBrZXkgPSBJbmxpbmUucGFyc2VTY2FsYXIodmFsdWVzLmtleSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGUucGFyc2VkTGluZSA9IHRoaXMuZ2V0UmVhbEN1cnJlbnRMaW5lTmIoKSArIDE7XG4gICAgICAgICAgZS5zbmlwcGV0ID0gdGhpcy5jdXJyZW50TGluZTtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9XG4gICAgICAgIGlmICgnPDwnID09PSBrZXkpIHtcbiAgICAgICAgICBtZXJnZU5vZGUgPSB0cnVlO1xuICAgICAgICAgIGFsbG93T3ZlcndyaXRlID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoKChyZWYxID0gdmFsdWVzLnZhbHVlKSAhPSBudWxsID8gcmVmMS5pbmRleE9mKCcqJykgOiB2b2lkIDApID09PSAwKSB7XG4gICAgICAgICAgICByZWZOYW1lID0gdmFsdWVzLnZhbHVlLnNsaWNlKDEpO1xuICAgICAgICAgICAgaWYgKHRoaXMucmVmc1tyZWZOYW1lXSA9PSBudWxsKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBQYXJzZUV4Y2VwdGlvbignUmVmZXJlbmNlIFwiJyArIHJlZk5hbWUgKyAnXCIgZG9lcyBub3QgZXhpc3QuJywgdGhpcy5nZXRSZWFsQ3VycmVudExpbmVOYigpICsgMSwgdGhpcy5jdXJyZW50TGluZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZWZWYWx1ZSA9IHRoaXMucmVmc1tyZWZOYW1lXTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcmVmVmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgIHRocm93IG5ldyBQYXJzZUV4Y2VwdGlvbignWUFNTCBtZXJnZSBrZXlzIHVzZWQgd2l0aCBhIHNjYWxhciB2YWx1ZSBpbnN0ZWFkIG9mIGFuIG9iamVjdC4nLCB0aGlzLmdldFJlYWxDdXJyZW50TGluZU5iKCkgKyAxLCB0aGlzLmN1cnJlbnRMaW5lKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWZWYWx1ZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgIGZvciAoaSA9IGogPSAwLCBsZW4gPSByZWZWYWx1ZS5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHJlZlZhbHVlW2ldO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhW25hbWUgPSBTdHJpbmcoaSldID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgIGRhdGFbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZvciAoa2V5IGluIHJlZlZhbHVlKSB7XG4gICAgICAgICAgICAgICAgdmFsdWUgPSByZWZWYWx1ZVtrZXldO1xuICAgICAgICAgICAgICAgIGlmIChkYXRhW2tleV0gPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgZGF0YVtrZXldID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICgodmFsdWVzLnZhbHVlICE9IG51bGwpICYmIHZhbHVlcy52YWx1ZSAhPT0gJycpIHtcbiAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZXMudmFsdWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMuZ2V0TmV4dEVtYmVkQmxvY2soKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGMgPSB0aGlzLmdldFJlYWxDdXJyZW50TGluZU5iKCkgKyAxO1xuICAgICAgICAgICAgcGFyc2VyID0gbmV3IFBhcnNlcihjKTtcbiAgICAgICAgICAgIHBhcnNlci5yZWZzID0gdGhpcy5yZWZzO1xuICAgICAgICAgICAgcGFyc2VkID0gcGFyc2VyLnBhcnNlKHZhbHVlLCBleGNlcHRpb25PbkludmFsaWRUeXBlKTtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VkICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICB0aHJvdyBuZXcgUGFyc2VFeGNlcHRpb24oJ1lBTUwgbWVyZ2Uga2V5cyB1c2VkIHdpdGggYSBzY2FsYXIgdmFsdWUgaW5zdGVhZCBvZiBhbiBvYmplY3QuJywgdGhpcy5nZXRSZWFsQ3VycmVudExpbmVOYigpICsgMSwgdGhpcy5jdXJyZW50TGluZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGFyc2VkIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgZm9yIChsID0gMCwgbGVuMSA9IHBhcnNlZC5sZW5ndGg7IGwgPCBsZW4xOyBsKyspIHtcbiAgICAgICAgICAgICAgICBwYXJzZWRJdGVtID0gcGFyc2VkW2xdO1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgcGFyc2VkSXRlbSAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBQYXJzZUV4Y2VwdGlvbignTWVyZ2UgaXRlbXMgbXVzdCBiZSBvYmplY3RzLicsIHRoaXMuZ2V0UmVhbEN1cnJlbnRMaW5lTmIoKSArIDEsIHBhcnNlZEl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAocGFyc2VkSXRlbSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKGkgPSBtID0gMCwgbGVuMiA9IHBhcnNlZEl0ZW0ubGVuZ3RoOyBtIDwgbGVuMjsgaSA9ICsrbSkge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlZEl0ZW1baV07XG4gICAgICAgICAgICAgICAgICAgIGsgPSBTdHJpbmcoaSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShrKSkge1xuICAgICAgICAgICAgICAgICAgICAgIGRhdGFba10gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICBmb3IgKGtleSBpbiBwYXJzZWRJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcGFyc2VkSXRlbVtrZXldO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgIGRhdGFba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBmb3IgKGtleSBpbiBwYXJzZWQpIHtcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHBhcnNlZFtrZXldO1xuICAgICAgICAgICAgICAgIGlmICghZGF0YS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgICBkYXRhW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoKHZhbHVlcy52YWx1ZSAhPSBudWxsKSAmJiAobWF0Y2hlcyA9IHRoaXMuUEFUVEVSTl9BTkNIT1JfVkFMVUUuZXhlYyh2YWx1ZXMudmFsdWUpKSkge1xuICAgICAgICAgIGlzUmVmID0gbWF0Y2hlcy5yZWY7XG4gICAgICAgICAgdmFsdWVzLnZhbHVlID0gbWF0Y2hlcy52YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAobWVyZ2VOb2RlKSB7XG5cbiAgICAgICAgfSBlbHNlIGlmICghKHZhbHVlcy52YWx1ZSAhPSBudWxsKSB8fCAnJyA9PT0gVXRpbHMudHJpbSh2YWx1ZXMudmFsdWUsICcgJykgfHwgVXRpbHMubHRyaW0odmFsdWVzLnZhbHVlLCAnICcpLmluZGV4T2YoJyMnKSA9PT0gMCkge1xuICAgICAgICAgIGlmICghKHRoaXMuaXNOZXh0TGluZUluZGVudGVkKCkpICYmICEodGhpcy5pc05leHRMaW5lVW5JbmRlbnRlZENvbGxlY3Rpb24oKSkpIHtcbiAgICAgICAgICAgIGlmIChhbGxvd092ZXJ3cml0ZSB8fCBkYXRhW2tleV0gPT09IHZvaWQgMCkge1xuICAgICAgICAgICAgICBkYXRhW2tleV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjID0gdGhpcy5nZXRSZWFsQ3VycmVudExpbmVOYigpICsgMTtcbiAgICAgICAgICAgIHBhcnNlciA9IG5ldyBQYXJzZXIoYyk7XG4gICAgICAgICAgICBwYXJzZXIucmVmcyA9IHRoaXMucmVmcztcbiAgICAgICAgICAgIHZhbCA9IHBhcnNlci5wYXJzZSh0aGlzLmdldE5leHRFbWJlZEJsb2NrKCksIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdERlY29kZXIpO1xuICAgICAgICAgICAgaWYgKGFsbG93T3ZlcndyaXRlIHx8IGRhdGFba2V5XSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgIGRhdGFba2V5XSA9IHZhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFsID0gdGhpcy5wYXJzZVZhbHVlKHZhbHVlcy52YWx1ZSwgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0RGVjb2Rlcik7XG4gICAgICAgICAgaWYgKGFsbG93T3ZlcndyaXRlIHx8IGRhdGFba2V5XSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICBkYXRhW2tleV0gPSB2YWw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsaW5lQ291bnQgPSB0aGlzLmxpbmVzLmxlbmd0aDtcbiAgICAgICAgaWYgKDEgPT09IGxpbmVDb3VudCB8fCAoMiA9PT0gbGluZUNvdW50ICYmIFV0aWxzLmlzRW1wdHkodGhpcy5saW5lc1sxXSkpKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHZhbHVlID0gSW5saW5lLnBhcnNlKHRoaXMubGluZXNbMF0sIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdERlY29kZXIpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICBlLnBhcnNlZExpbmUgPSB0aGlzLmdldFJlYWxDdXJyZW50TGluZU5iKCkgKyAxO1xuICAgICAgICAgICAgZS5zbmlwcGV0ID0gdGhpcy5jdXJyZW50TGluZTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICBmaXJzdCA9IHZhbHVlWzBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZm9yIChrZXkgaW4gdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBmaXJzdCA9IHZhbHVlW2tleV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmlyc3QgPT09ICdzdHJpbmcnICYmIGZpcnN0LmluZGV4T2YoJyonKSA9PT0gMCkge1xuICAgICAgICAgICAgICBkYXRhID0gW107XG4gICAgICAgICAgICAgIGZvciAobiA9IDAsIGxlbjMgPSB2YWx1ZS5sZW5ndGg7IG4gPCBsZW4zOyBuKyspIHtcbiAgICAgICAgICAgICAgICBhbGlhcyA9IHZhbHVlW25dO1xuICAgICAgICAgICAgICAgIGRhdGEucHVzaCh0aGlzLnJlZnNbYWxpYXMuc2xpY2UoMSldKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB2YWx1ZSA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgfSBlbHNlIGlmICgocmVmMiA9IFV0aWxzLmx0cmltKHZhbHVlKS5jaGFyQXQoMCkpID09PSAnWycgfHwgcmVmMiA9PT0gJ3snKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBJbmxpbmUucGFyc2UodmFsdWUsIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdERlY29kZXIpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBlID0gZXJyb3I7XG4gICAgICAgICAgICBlLnBhcnNlZExpbmUgPSB0aGlzLmdldFJlYWxDdXJyZW50TGluZU5iKCkgKyAxO1xuICAgICAgICAgICAgZS5zbmlwcGV0ID0gdGhpcy5jdXJyZW50TGluZTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBQYXJzZUV4Y2VwdGlvbignVW5hYmxlIHRvIHBhcnNlLicsIHRoaXMuZ2V0UmVhbEN1cnJlbnRMaW5lTmIoKSArIDEsIHRoaXMuY3VycmVudExpbmUpO1xuICAgICAgfVxuICAgICAgaWYgKGlzUmVmKSB7XG4gICAgICAgIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICB0aGlzLnJlZnNbaXNSZWZdID0gZGF0YVtkYXRhLmxlbmd0aCAtIDFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxhc3RLZXkgPSBudWxsO1xuICAgICAgICAgIGZvciAoa2V5IGluIGRhdGEpIHtcbiAgICAgICAgICAgIGxhc3RLZXkgPSBrZXk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucmVmc1tpc1JlZl0gPSBkYXRhW2xhc3RLZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChVdGlscy5pc0VtcHR5KGRhdGEpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuICB9O1xuXG4gIFBhcnNlci5wcm90b3R5cGUuZ2V0UmVhbEN1cnJlbnRMaW5lTmIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TGluZU5iICsgdGhpcy5vZmZzZXQ7XG4gIH07XG5cbiAgUGFyc2VyLnByb3RvdHlwZS5nZXRDdXJyZW50TGluZUluZGVudGF0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuY3VycmVudExpbmUubGVuZ3RoIC0gVXRpbHMubHRyaW0odGhpcy5jdXJyZW50TGluZSwgJyAnKS5sZW5ndGg7XG4gIH07XG5cbiAgUGFyc2VyLnByb3RvdHlwZS5nZXROZXh0RW1iZWRCbG9jayA9IGZ1bmN0aW9uKGluZGVudGF0aW9uLCBpbmNsdWRlVW5pbmRlbnRlZENvbGxlY3Rpb24pIHtcbiAgICB2YXIgZGF0YSwgaW5kZW50LCBpc0l0VW5pbmRlbnRlZENvbGxlY3Rpb24sIG5ld0luZGVudCwgcmVtb3ZlQ29tbWVudHMsIHJlbW92ZUNvbW1lbnRzUGF0dGVybiwgdW5pbmRlbnRlZEVtYmVkQmxvY2s7XG4gICAgaWYgKGluZGVudGF0aW9uID09IG51bGwpIHtcbiAgICAgIGluZGVudGF0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKGluY2x1ZGVVbmluZGVudGVkQ29sbGVjdGlvbiA9PSBudWxsKSB7XG4gICAgICBpbmNsdWRlVW5pbmRlbnRlZENvbGxlY3Rpb24gPSBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5tb3ZlVG9OZXh0TGluZSgpO1xuICAgIGlmIChpbmRlbnRhdGlvbiA9PSBudWxsKSB7XG4gICAgICBuZXdJbmRlbnQgPSB0aGlzLmdldEN1cnJlbnRMaW5lSW5kZW50YXRpb24oKTtcbiAgICAgIHVuaW5kZW50ZWRFbWJlZEJsb2NrID0gdGhpcy5pc1N0cmluZ1VuSW5kZW50ZWRDb2xsZWN0aW9uSXRlbSh0aGlzLmN1cnJlbnRMaW5lKTtcbiAgICAgIGlmICghKHRoaXMuaXNDdXJyZW50TGluZUVtcHR5KCkpICYmIDAgPT09IG5ld0luZGVudCAmJiAhdW5pbmRlbnRlZEVtYmVkQmxvY2spIHtcbiAgICAgICAgdGhyb3cgbmV3IFBhcnNlRXhjZXB0aW9uKCdJbmRlbnRhdGlvbiBwcm9ibGVtLicsIHRoaXMuZ2V0UmVhbEN1cnJlbnRMaW5lTmIoKSArIDEsIHRoaXMuY3VycmVudExpbmUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBuZXdJbmRlbnQgPSBpbmRlbnRhdGlvbjtcbiAgICB9XG4gICAgZGF0YSA9IFt0aGlzLmN1cnJlbnRMaW5lLnNsaWNlKG5ld0luZGVudCldO1xuICAgIGlmICghaW5jbHVkZVVuaW5kZW50ZWRDb2xsZWN0aW9uKSB7XG4gICAgICBpc0l0VW5pbmRlbnRlZENvbGxlY3Rpb24gPSB0aGlzLmlzU3RyaW5nVW5JbmRlbnRlZENvbGxlY3Rpb25JdGVtKHRoaXMuY3VycmVudExpbmUpO1xuICAgIH1cbiAgICByZW1vdmVDb21tZW50c1BhdHRlcm4gPSB0aGlzLlBBVFRFUk5fRk9MREVEX1NDQUxBUl9FTkQ7XG4gICAgcmVtb3ZlQ29tbWVudHMgPSAhcmVtb3ZlQ29tbWVudHNQYXR0ZXJuLnRlc3QodGhpcy5jdXJyZW50TGluZSk7XG4gICAgd2hpbGUgKHRoaXMubW92ZVRvTmV4dExpbmUoKSkge1xuICAgICAgaW5kZW50ID0gdGhpcy5nZXRDdXJyZW50TGluZUluZGVudGF0aW9uKCk7XG4gICAgICBpZiAoaW5kZW50ID09PSBuZXdJbmRlbnQpIHtcbiAgICAgICAgcmVtb3ZlQ29tbWVudHMgPSAhcmVtb3ZlQ29tbWVudHNQYXR0ZXJuLnRlc3QodGhpcy5jdXJyZW50TGluZSk7XG4gICAgICB9XG4gICAgICBpZiAocmVtb3ZlQ29tbWVudHMgJiYgdGhpcy5pc0N1cnJlbnRMaW5lQ29tbWVudCgpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuaXNDdXJyZW50TGluZUJsYW5rKCkpIHtcbiAgICAgICAgZGF0YS5wdXNoKHRoaXMuY3VycmVudExpbmUuc2xpY2UobmV3SW5kZW50KSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKGlzSXRVbmluZGVudGVkQ29sbGVjdGlvbiAmJiAhdGhpcy5pc1N0cmluZ1VuSW5kZW50ZWRDb2xsZWN0aW9uSXRlbSh0aGlzLmN1cnJlbnRMaW5lKSAmJiBpbmRlbnQgPT09IG5ld0luZGVudCkge1xuICAgICAgICB0aGlzLm1vdmVUb1ByZXZpb3VzTGluZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChpbmRlbnQgPj0gbmV3SW5kZW50KSB7XG4gICAgICAgIGRhdGEucHVzaCh0aGlzLmN1cnJlbnRMaW5lLnNsaWNlKG5ld0luZGVudCkpO1xuICAgICAgfSBlbHNlIGlmIChVdGlscy5sdHJpbSh0aGlzLmN1cnJlbnRMaW5lKS5jaGFyQXQoMCkgPT09ICcjJykge1xuXG4gICAgICB9IGVsc2UgaWYgKDAgPT09IGluZGVudCkge1xuICAgICAgICB0aGlzLm1vdmVUb1ByZXZpb3VzTGluZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBQYXJzZUV4Y2VwdGlvbignSW5kZW50YXRpb24gcHJvYmxlbS4nLCB0aGlzLmdldFJlYWxDdXJyZW50TGluZU5iKCkgKyAxLCB0aGlzLmN1cnJlbnRMaW5lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRhdGEuam9pbihcIlxcblwiKTtcbiAgfTtcblxuICBQYXJzZXIucHJvdG90eXBlLm1vdmVUb05leHRMaW5lID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudExpbmVOYiA+PSB0aGlzLmxpbmVzLmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgdGhpcy5jdXJyZW50TGluZSA9IHRoaXMubGluZXNbKyt0aGlzLmN1cnJlbnRMaW5lTmJdO1xuICAgIHJldHVybiB0cnVlO1xuICB9O1xuXG4gIFBhcnNlci5wcm90b3R5cGUubW92ZVRvUHJldmlvdXNMaW5lID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5jdXJyZW50TGluZSA9IHRoaXMubGluZXNbLS10aGlzLmN1cnJlbnRMaW5lTmJdO1xuICB9O1xuXG4gIFBhcnNlci5wcm90b3R5cGUucGFyc2VWYWx1ZSA9IGZ1bmN0aW9uKHZhbHVlLCBleGNlcHRpb25PbkludmFsaWRUeXBlLCBvYmplY3REZWNvZGVyKSB7XG4gICAgdmFyIGUsIGZvbGRlZEluZGVudCwgbWF0Y2hlcywgbW9kaWZpZXJzLCBwb3MsIHJlZiwgcmVmMSwgdmFsO1xuICAgIGlmICgwID09PSB2YWx1ZS5pbmRleE9mKCcqJykpIHtcbiAgICAgIHBvcyA9IHZhbHVlLmluZGV4T2YoJyMnKTtcbiAgICAgIGlmIChwb3MgIT09IC0xKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuc3Vic3RyKDEsIHBvcyAtIDIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5zbGljZSgxKTtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLnJlZnNbdmFsdWVdID09PSB2b2lkIDApIHtcbiAgICAgICAgdGhyb3cgbmV3IFBhcnNlRXhjZXB0aW9uKCdSZWZlcmVuY2UgXCInICsgdmFsdWUgKyAnXCIgZG9lcyBub3QgZXhpc3QuJywgdGhpcy5jdXJyZW50TGluZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5yZWZzW3ZhbHVlXTtcbiAgICB9XG4gICAgaWYgKG1hdGNoZXMgPSB0aGlzLlBBVFRFUk5fRk9MREVEX1NDQUxBUl9BTEwuZXhlYyh2YWx1ZSkpIHtcbiAgICAgIG1vZGlmaWVycyA9IChyZWYgPSBtYXRjaGVzLm1vZGlmaWVycykgIT0gbnVsbCA/IHJlZiA6ICcnO1xuICAgICAgZm9sZGVkSW5kZW50ID0gTWF0aC5hYnMocGFyc2VJbnQobW9kaWZpZXJzKSk7XG4gICAgICBpZiAoaXNOYU4oZm9sZGVkSW5kZW50KSkge1xuICAgICAgICBmb2xkZWRJbmRlbnQgPSAwO1xuICAgICAgfVxuICAgICAgdmFsID0gdGhpcy5wYXJzZUZvbGRlZFNjYWxhcihtYXRjaGVzLnNlcGFyYXRvciwgdGhpcy5QQVRURVJOX0RFQ0lNQUwucmVwbGFjZShtb2RpZmllcnMsICcnKSwgZm9sZGVkSW5kZW50KTtcbiAgICAgIGlmIChtYXRjaGVzLnR5cGUgIT0gbnVsbCkge1xuICAgICAgICBJbmxpbmUuY29uZmlndXJlKGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdERlY29kZXIpO1xuICAgICAgICByZXR1cm4gSW5saW5lLnBhcnNlU2NhbGFyKG1hdGNoZXMudHlwZSArICcgJyArIHZhbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoKHJlZjEgPSB2YWx1ZS5jaGFyQXQoMCkpID09PSAnWycgfHwgcmVmMSA9PT0gJ3snIHx8IHJlZjEgPT09ICdcIicgfHwgcmVmMSA9PT0gXCInXCIpIHtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmV0dXJuIElubGluZS5wYXJzZSh2YWx1ZSwgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0RGVjb2Rlcik7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZSA9IGVycm9yO1xuICAgICAgICAgIGlmIChlIGluc3RhbmNlb2YgUGFyc2VNb3JlICYmIHRoaXMubW92ZVRvTmV4dExpbmUoKSkge1xuICAgICAgICAgICAgdmFsdWUgKz0gXCJcXG5cIiArIFV0aWxzLnRyaW0odGhpcy5jdXJyZW50TGluZSwgJyAnKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZS5wYXJzZWRMaW5lID0gdGhpcy5nZXRSZWFsQ3VycmVudExpbmVOYigpICsgMTtcbiAgICAgICAgICAgIGUuc25pcHBldCA9IHRoaXMuY3VycmVudExpbmU7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5pc05leHRMaW5lSW5kZW50ZWQoKSkge1xuICAgICAgICB2YWx1ZSArPSBcIlxcblwiICsgdGhpcy5nZXROZXh0RW1iZWRCbG9jaygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIElubGluZS5wYXJzZSh2YWx1ZSwgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0RGVjb2Rlcik7XG4gICAgfVxuICB9O1xuXG4gIFBhcnNlci5wcm90b3R5cGUucGFyc2VGb2xkZWRTY2FsYXIgPSBmdW5jdGlvbihzZXBhcmF0b3IsIGluZGljYXRvciwgaW5kZW50YXRpb24pIHtcbiAgICB2YXIgaXNDdXJyZW50TGluZUJsYW5rLCBqLCBsZW4sIGxpbmUsIG1hdGNoZXMsIG5ld1RleHQsIG5vdEVPRiwgcGF0dGVybiwgcmVmLCB0ZXh0O1xuICAgIGlmIChpbmRpY2F0b3IgPT0gbnVsbCkge1xuICAgICAgaW5kaWNhdG9yID0gJyc7XG4gICAgfVxuICAgIGlmIChpbmRlbnRhdGlvbiA9PSBudWxsKSB7XG4gICAgICBpbmRlbnRhdGlvbiA9IDA7XG4gICAgfVxuICAgIG5vdEVPRiA9IHRoaXMubW92ZVRvTmV4dExpbmUoKTtcbiAgICBpZiAoIW5vdEVPRikge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBpc0N1cnJlbnRMaW5lQmxhbmsgPSB0aGlzLmlzQ3VycmVudExpbmVCbGFuaygpO1xuICAgIHRleHQgPSAnJztcbiAgICB3aGlsZSAobm90RU9GICYmIGlzQ3VycmVudExpbmVCbGFuaykge1xuICAgICAgaWYgKG5vdEVPRiA9IHRoaXMubW92ZVRvTmV4dExpbmUoKSkge1xuICAgICAgICB0ZXh0ICs9IFwiXFxuXCI7XG4gICAgICAgIGlzQ3VycmVudExpbmVCbGFuayA9IHRoaXMuaXNDdXJyZW50TGluZUJsYW5rKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICgwID09PSBpbmRlbnRhdGlvbikge1xuICAgICAgaWYgKG1hdGNoZXMgPSB0aGlzLlBBVFRFUk5fSU5ERU5UX1NQQUNFUy5leGVjKHRoaXMuY3VycmVudExpbmUpKSB7XG4gICAgICAgIGluZGVudGF0aW9uID0gbWF0Y2hlc1swXS5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChpbmRlbnRhdGlvbiA+IDApIHtcbiAgICAgIHBhdHRlcm4gPSB0aGlzLlBBVFRFUk5fRk9MREVEX1NDQUxBUl9CWV9JTkRFTlRBVElPTltpbmRlbnRhdGlvbl07XG4gICAgICBpZiAocGF0dGVybiA9PSBudWxsKSB7XG4gICAgICAgIHBhdHRlcm4gPSBuZXcgUGF0dGVybignXiB7JyArIGluZGVudGF0aW9uICsgJ30oLiopJCcpO1xuICAgICAgICBQYXJzZXIucHJvdG90eXBlLlBBVFRFUk5fRk9MREVEX1NDQUxBUl9CWV9JTkRFTlRBVElPTltpbmRlbnRhdGlvbl0gPSBwYXR0ZXJuO1xuICAgICAgfVxuICAgICAgd2hpbGUgKG5vdEVPRiAmJiAoaXNDdXJyZW50TGluZUJsYW5rIHx8IChtYXRjaGVzID0gcGF0dGVybi5leGVjKHRoaXMuY3VycmVudExpbmUpKSkpIHtcbiAgICAgICAgaWYgKGlzQ3VycmVudExpbmVCbGFuaykge1xuICAgICAgICAgIHRleHQgKz0gdGhpcy5jdXJyZW50TGluZS5zbGljZShpbmRlbnRhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dCArPSBtYXRjaGVzWzFdO1xuICAgICAgICB9XG4gICAgICAgIGlmIChub3RFT0YgPSB0aGlzLm1vdmVUb05leHRMaW5lKCkpIHtcbiAgICAgICAgICB0ZXh0ICs9IFwiXFxuXCI7XG4gICAgICAgICAgaXNDdXJyZW50TGluZUJsYW5rID0gdGhpcy5pc0N1cnJlbnRMaW5lQmxhbmsoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSBpZiAobm90RU9GKSB7XG4gICAgICB0ZXh0ICs9IFwiXFxuXCI7XG4gICAgfVxuICAgIGlmIChub3RFT0YpIHtcbiAgICAgIHRoaXMubW92ZVRvUHJldmlvdXNMaW5lKCk7XG4gICAgfVxuICAgIGlmICgnPicgPT09IHNlcGFyYXRvcikge1xuICAgICAgbmV3VGV4dCA9ICcnO1xuICAgICAgcmVmID0gdGV4dC5zcGxpdChcIlxcblwiKTtcbiAgICAgIGZvciAoaiA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGogPCBsZW47IGorKykge1xuICAgICAgICBsaW5lID0gcmVmW2pdO1xuICAgICAgICBpZiAobGluZS5sZW5ndGggPT09IDAgfHwgbGluZS5jaGFyQXQoMCkgPT09ICcgJykge1xuICAgICAgICAgIG5ld1RleHQgPSBVdGlscy5ydHJpbShuZXdUZXh0LCAnICcpICsgbGluZSArIFwiXFxuXCI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbmV3VGV4dCArPSBsaW5lICsgJyAnO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0ZXh0ID0gbmV3VGV4dDtcbiAgICB9XG4gICAgaWYgKCcrJyAhPT0gaW5kaWNhdG9yKSB7XG4gICAgICB0ZXh0ID0gVXRpbHMucnRyaW0odGV4dCk7XG4gICAgfVxuICAgIGlmICgnJyA9PT0gaW5kaWNhdG9yKSB7XG4gICAgICB0ZXh0ID0gdGhpcy5QQVRURVJOX1RSQUlMSU5HX0xJTkVTLnJlcGxhY2UodGV4dCwgXCJcXG5cIik7XG4gICAgfSBlbHNlIGlmICgnLScgPT09IGluZGljYXRvcikge1xuICAgICAgdGV4dCA9IHRoaXMuUEFUVEVSTl9UUkFJTElOR19MSU5FUy5yZXBsYWNlKHRleHQsICcnKTtcbiAgICB9XG4gICAgcmV0dXJuIHRleHQ7XG4gIH07XG5cbiAgUGFyc2VyLnByb3RvdHlwZS5pc05leHRMaW5lSW5kZW50ZWQgPSBmdW5jdGlvbihpZ25vcmVDb21tZW50cykge1xuICAgIHZhciBFT0YsIGN1cnJlbnRJbmRlbnRhdGlvbiwgcmV0O1xuICAgIGlmIChpZ25vcmVDb21tZW50cyA9PSBudWxsKSB7XG4gICAgICBpZ25vcmVDb21tZW50cyA9IHRydWU7XG4gICAgfVxuICAgIGN1cnJlbnRJbmRlbnRhdGlvbiA9IHRoaXMuZ2V0Q3VycmVudExpbmVJbmRlbnRhdGlvbigpO1xuICAgIEVPRiA9ICF0aGlzLm1vdmVUb05leHRMaW5lKCk7XG4gICAgaWYgKGlnbm9yZUNvbW1lbnRzKSB7XG4gICAgICB3aGlsZSAoIUVPRiAmJiB0aGlzLmlzQ3VycmVudExpbmVFbXB0eSgpKSB7XG4gICAgICAgIEVPRiA9ICF0aGlzLm1vdmVUb05leHRMaW5lKCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlICghRU9GICYmIHRoaXMuaXNDdXJyZW50TGluZUJsYW5rKCkpIHtcbiAgICAgICAgRU9GID0gIXRoaXMubW92ZVRvTmV4dExpbmUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKEVPRikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5nZXRDdXJyZW50TGluZUluZGVudGF0aW9uKCkgPiBjdXJyZW50SW5kZW50YXRpb24pIHtcbiAgICAgIHJldCA9IHRydWU7XG4gICAgfVxuICAgIHRoaXMubW92ZVRvUHJldmlvdXNMaW5lKCk7XG4gICAgcmV0dXJuIHJldDtcbiAgfTtcblxuICBQYXJzZXIucHJvdG90eXBlLmlzQ3VycmVudExpbmVFbXB0eSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0cmltbWVkTGluZTtcbiAgICB0cmltbWVkTGluZSA9IFV0aWxzLnRyaW0odGhpcy5jdXJyZW50TGluZSwgJyAnKTtcbiAgICByZXR1cm4gdHJpbW1lZExpbmUubGVuZ3RoID09PSAwIHx8IHRyaW1tZWRMaW5lLmNoYXJBdCgwKSA9PT0gJyMnO1xuICB9O1xuXG4gIFBhcnNlci5wcm90b3R5cGUuaXNDdXJyZW50TGluZUJsYW5rID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICcnID09PSBVdGlscy50cmltKHRoaXMuY3VycmVudExpbmUsICcgJyk7XG4gIH07XG5cbiAgUGFyc2VyLnByb3RvdHlwZS5pc0N1cnJlbnRMaW5lQ29tbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBsdHJpbW1lZExpbmU7XG4gICAgbHRyaW1tZWRMaW5lID0gVXRpbHMubHRyaW0odGhpcy5jdXJyZW50TGluZSwgJyAnKTtcbiAgICByZXR1cm4gbHRyaW1tZWRMaW5lLmNoYXJBdCgwKSA9PT0gJyMnO1xuICB9O1xuXG4gIFBhcnNlci5wcm90b3R5cGUuY2xlYW51cCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgdmFyIGNvdW50LCBpLCBpbmRlbnQsIGosIGwsIGxlbiwgbGVuMSwgbGluZSwgbGluZXMsIHJlZiwgcmVmMSwgcmVmMiwgc21hbGxlc3RJbmRlbnQsIHRyaW1tZWRWYWx1ZTtcbiAgICBpZiAodmFsdWUuaW5kZXhPZihcIlxcclwiKSAhPT0gLTEpIHtcbiAgICAgIHZhbHVlID0gdmFsdWUuc3BsaXQoXCJcXHJcXG5cIikuam9pbihcIlxcblwiKS5zcGxpdChcIlxcclwiKS5qb2luKFwiXFxuXCIpO1xuICAgIH1cbiAgICBjb3VudCA9IDA7XG4gICAgcmVmID0gdGhpcy5QQVRURVJOX1lBTUxfSEVBREVSLnJlcGxhY2VBbGwodmFsdWUsICcnKSwgdmFsdWUgPSByZWZbMF0sIGNvdW50ID0gcmVmWzFdO1xuICAgIHRoaXMub2Zmc2V0ICs9IGNvdW50O1xuICAgIHJlZjEgPSB0aGlzLlBBVFRFUk5fTEVBRElOR19DT01NRU5UUy5yZXBsYWNlQWxsKHZhbHVlLCAnJywgMSksIHRyaW1tZWRWYWx1ZSA9IHJlZjFbMF0sIGNvdW50ID0gcmVmMVsxXTtcbiAgICBpZiAoY291bnQgPT09IDEpIHtcbiAgICAgIHRoaXMub2Zmc2V0ICs9IFV0aWxzLnN1YlN0ckNvdW50KHZhbHVlLCBcIlxcblwiKSAtIFV0aWxzLnN1YlN0ckNvdW50KHRyaW1tZWRWYWx1ZSwgXCJcXG5cIik7XG4gICAgICB2YWx1ZSA9IHRyaW1tZWRWYWx1ZTtcbiAgICB9XG4gICAgcmVmMiA9IHRoaXMuUEFUVEVSTl9ET0NVTUVOVF9NQVJLRVJfU1RBUlQucmVwbGFjZUFsbCh2YWx1ZSwgJycsIDEpLCB0cmltbWVkVmFsdWUgPSByZWYyWzBdLCBjb3VudCA9IHJlZjJbMV07XG4gICAgaWYgKGNvdW50ID09PSAxKSB7XG4gICAgICB0aGlzLm9mZnNldCArPSBVdGlscy5zdWJTdHJDb3VudCh2YWx1ZSwgXCJcXG5cIikgLSBVdGlscy5zdWJTdHJDb3VudCh0cmltbWVkVmFsdWUsIFwiXFxuXCIpO1xuICAgICAgdmFsdWUgPSB0cmltbWVkVmFsdWU7XG4gICAgICB2YWx1ZSA9IHRoaXMuUEFUVEVSTl9ET0NVTUVOVF9NQVJLRVJfRU5ELnJlcGxhY2UodmFsdWUsICcnKTtcbiAgICB9XG4gICAgbGluZXMgPSB2YWx1ZS5zcGxpdChcIlxcblwiKTtcbiAgICBzbWFsbGVzdEluZGVudCA9IC0xO1xuICAgIGZvciAoaiA9IDAsIGxlbiA9IGxpbmVzLmxlbmd0aDsgaiA8IGxlbjsgaisrKSB7XG4gICAgICBsaW5lID0gbGluZXNbal07XG4gICAgICBpZiAoVXRpbHMudHJpbShsaW5lLCAnICcpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGluZGVudCA9IGxpbmUubGVuZ3RoIC0gVXRpbHMubHRyaW0obGluZSkubGVuZ3RoO1xuICAgICAgaWYgKHNtYWxsZXN0SW5kZW50ID09PSAtMSB8fCBpbmRlbnQgPCBzbWFsbGVzdEluZGVudCkge1xuICAgICAgICBzbWFsbGVzdEluZGVudCA9IGluZGVudDtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNtYWxsZXN0SW5kZW50ID4gMCkge1xuICAgICAgZm9yIChpID0gbCA9IDAsIGxlbjEgPSBsaW5lcy5sZW5ndGg7IGwgPCBsZW4xOyBpID0gKytsKSB7XG4gICAgICAgIGxpbmUgPSBsaW5lc1tpXTtcbiAgICAgICAgbGluZXNbaV0gPSBsaW5lLnNsaWNlKHNtYWxsZXN0SW5kZW50KTtcbiAgICAgIH1cbiAgICAgIHZhbHVlID0gbGluZXMuam9pbihcIlxcblwiKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9O1xuXG4gIFBhcnNlci5wcm90b3R5cGUuaXNOZXh0TGluZVVuSW5kZW50ZWRDb2xsZWN0aW9uID0gZnVuY3Rpb24oY3VycmVudEluZGVudGF0aW9uKSB7XG4gICAgdmFyIG5vdEVPRiwgcmV0O1xuICAgIGlmIChjdXJyZW50SW5kZW50YXRpb24gPT0gbnVsbCkge1xuICAgICAgY3VycmVudEluZGVudGF0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKGN1cnJlbnRJbmRlbnRhdGlvbiA9PSBudWxsKSB7XG4gICAgICBjdXJyZW50SW5kZW50YXRpb24gPSB0aGlzLmdldEN1cnJlbnRMaW5lSW5kZW50YXRpb24oKTtcbiAgICB9XG4gICAgbm90RU9GID0gdGhpcy5tb3ZlVG9OZXh0TGluZSgpO1xuICAgIHdoaWxlIChub3RFT0YgJiYgdGhpcy5pc0N1cnJlbnRMaW5lRW1wdHkoKSkge1xuICAgICAgbm90RU9GID0gdGhpcy5tb3ZlVG9OZXh0TGluZSgpO1xuICAgIH1cbiAgICBpZiAoZmFsc2UgPT09IG5vdEVPRikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXQgPSBmYWxzZTtcbiAgICBpZiAodGhpcy5nZXRDdXJyZW50TGluZUluZGVudGF0aW9uKCkgPT09IGN1cnJlbnRJbmRlbnRhdGlvbiAmJiB0aGlzLmlzU3RyaW5nVW5JbmRlbnRlZENvbGxlY3Rpb25JdGVtKHRoaXMuY3VycmVudExpbmUpKSB7XG4gICAgICByZXQgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLm1vdmVUb1ByZXZpb3VzTGluZSgpO1xuICAgIHJldHVybiByZXQ7XG4gIH07XG5cbiAgUGFyc2VyLnByb3RvdHlwZS5pc1N0cmluZ1VuSW5kZW50ZWRDb2xsZWN0aW9uSXRlbSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmN1cnJlbnRMaW5lID09PSAnLScgfHwgdGhpcy5jdXJyZW50TGluZS5zbGljZSgwLCAyKSA9PT0gJy0gJztcbiAgfTtcblxuICByZXR1cm4gUGFyc2VyO1xuXG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBhcnNlcjtcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMi40XG52YXIgUGF0dGVybjtcblxuUGF0dGVybiA9IChmdW5jdGlvbigpIHtcbiAgUGF0dGVybi5wcm90b3R5cGUucmVnZXggPSBudWxsO1xuXG4gIFBhdHRlcm4ucHJvdG90eXBlLnJhd1JlZ2V4ID0gbnVsbDtcblxuICBQYXR0ZXJuLnByb3RvdHlwZS5jbGVhbmVkUmVnZXggPSBudWxsO1xuXG4gIFBhdHRlcm4ucHJvdG90eXBlLm1hcHBpbmcgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIFBhdHRlcm4ocmF3UmVnZXgsIG1vZGlmaWVycykge1xuICAgIHZhciBfY2hhciwgY2FwdHVyaW5nQnJhY2tldE51bWJlciwgY2xlYW5lZFJlZ2V4LCBpLCBsZW4sIG1hcHBpbmcsIG5hbWUsIHBhcnQsIHN1YkNoYXI7XG4gICAgaWYgKG1vZGlmaWVycyA9PSBudWxsKSB7XG4gICAgICBtb2RpZmllcnMgPSAnJztcbiAgICB9XG4gICAgY2xlYW5lZFJlZ2V4ID0gJyc7XG4gICAgbGVuID0gcmF3UmVnZXgubGVuZ3RoO1xuICAgIG1hcHBpbmcgPSBudWxsO1xuICAgIGNhcHR1cmluZ0JyYWNrZXROdW1iZXIgPSAwO1xuICAgIGkgPSAwO1xuICAgIHdoaWxlIChpIDwgbGVuKSB7XG4gICAgICBfY2hhciA9IHJhd1JlZ2V4LmNoYXJBdChpKTtcbiAgICAgIGlmIChfY2hhciA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIGNsZWFuZWRSZWdleCArPSByYXdSZWdleC5zbGljZShpLCArKGkgKyAxKSArIDEgfHwgOWU5KTtcbiAgICAgICAgaSsrO1xuICAgICAgfSBlbHNlIGlmIChfY2hhciA9PT0gJygnKSB7XG4gICAgICAgIGlmIChpIDwgbGVuIC0gMikge1xuICAgICAgICAgIHBhcnQgPSByYXdSZWdleC5zbGljZShpLCArKGkgKyAyKSArIDEgfHwgOWU5KTtcbiAgICAgICAgICBpZiAocGFydCA9PT0gJyg/OicpIHtcbiAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgIGNsZWFuZWRSZWdleCArPSBwYXJ0O1xuICAgICAgICAgIH0gZWxzZSBpZiAocGFydCA9PT0gJyg/PCcpIHtcbiAgICAgICAgICAgIGNhcHR1cmluZ0JyYWNrZXROdW1iZXIrKztcbiAgICAgICAgICAgIGkgKz0gMjtcbiAgICAgICAgICAgIG5hbWUgPSAnJztcbiAgICAgICAgICAgIHdoaWxlIChpICsgMSA8IGxlbikge1xuICAgICAgICAgICAgICBzdWJDaGFyID0gcmF3UmVnZXguY2hhckF0KGkgKyAxKTtcbiAgICAgICAgICAgICAgaWYgKHN1YkNoYXIgPT09ICc+Jykge1xuICAgICAgICAgICAgICAgIGNsZWFuZWRSZWdleCArPSAnKCc7XG4gICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIGlmIChuYW1lLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgIGlmIChtYXBwaW5nID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgbWFwcGluZyA9IHt9O1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgbWFwcGluZ1tuYW1lXSA9IGNhcHR1cmluZ0JyYWNrZXROdW1iZXI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG5hbWUgKz0gc3ViQ2hhcjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNsZWFuZWRSZWdleCArPSBfY2hhcjtcbiAgICAgICAgICAgIGNhcHR1cmluZ0JyYWNrZXROdW1iZXIrKztcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2xlYW5lZFJlZ2V4ICs9IF9jaGFyO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjbGVhbmVkUmVnZXggKz0gX2NoYXI7XG4gICAgICB9XG4gICAgICBpKys7XG4gICAgfVxuICAgIHRoaXMucmF3UmVnZXggPSByYXdSZWdleDtcbiAgICB0aGlzLmNsZWFuZWRSZWdleCA9IGNsZWFuZWRSZWdleDtcbiAgICB0aGlzLnJlZ2V4ID0gbmV3IFJlZ0V4cCh0aGlzLmNsZWFuZWRSZWdleCwgJ2cnICsgbW9kaWZpZXJzLnJlcGxhY2UoJ2cnLCAnJykpO1xuICAgIHRoaXMubWFwcGluZyA9IG1hcHBpbmc7XG4gIH1cblxuICBQYXR0ZXJuLnByb3RvdHlwZS5leGVjID0gZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIGluZGV4LCBtYXRjaGVzLCBuYW1lLCByZWY7XG4gICAgdGhpcy5yZWdleC5sYXN0SW5kZXggPSAwO1xuICAgIG1hdGNoZXMgPSB0aGlzLnJlZ2V4LmV4ZWMoc3RyKTtcbiAgICBpZiAobWF0Y2hlcyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMubWFwcGluZyAhPSBudWxsKSB7XG4gICAgICByZWYgPSB0aGlzLm1hcHBpbmc7XG4gICAgICBmb3IgKG5hbWUgaW4gcmVmKSB7XG4gICAgICAgIGluZGV4ID0gcmVmW25hbWVdO1xuICAgICAgICBtYXRjaGVzW25hbWVdID0gbWF0Y2hlc1tpbmRleF07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBtYXRjaGVzO1xuICB9O1xuXG4gIFBhdHRlcm4ucHJvdG90eXBlLnRlc3QgPSBmdW5jdGlvbihzdHIpIHtcbiAgICB0aGlzLnJlZ2V4Lmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHRoaXMucmVnZXgudGVzdChzdHIpO1xuICB9O1xuXG4gIFBhdHRlcm4ucHJvdG90eXBlLnJlcGxhY2UgPSBmdW5jdGlvbihzdHIsIHJlcGxhY2VtZW50KSB7XG4gICAgdGhpcy5yZWdleC5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiBzdHIucmVwbGFjZSh0aGlzLnJlZ2V4LCByZXBsYWNlbWVudCk7XG4gIH07XG5cbiAgUGF0dGVybi5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uKHN0ciwgcmVwbGFjZW1lbnQsIGxpbWl0KSB7XG4gICAgdmFyIGNvdW50O1xuICAgIGlmIChsaW1pdCA9PSBudWxsKSB7XG4gICAgICBsaW1pdCA9IDA7XG4gICAgfVxuICAgIHRoaXMucmVnZXgubGFzdEluZGV4ID0gMDtcbiAgICBjb3VudCA9IDA7XG4gICAgd2hpbGUgKHRoaXMucmVnZXgudGVzdChzdHIpICYmIChsaW1pdCA9PT0gMCB8fCBjb3VudCA8IGxpbWl0KSkge1xuICAgICAgdGhpcy5yZWdleC5sYXN0SW5kZXggPSAwO1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2UodGhpcy5yZWdleCwgcmVwbGFjZW1lbnQpO1xuICAgICAgY291bnQrKztcbiAgICB9XG4gICAgcmV0dXJuIFtzdHIsIGNvdW50XTtcbiAgfTtcblxuICByZXR1cm4gUGF0dGVybjtcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBQYXR0ZXJuO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEyLjRcbnZhciBQYXR0ZXJuLCBVbmVzY2FwZXIsIFV0aWxzO1xuXG5VdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxuUGF0dGVybiA9IHJlcXVpcmUoJy4vUGF0dGVybicpO1xuXG5VbmVzY2FwZXIgPSAoZnVuY3Rpb24oKSB7XG4gIGZ1bmN0aW9uIFVuZXNjYXBlcigpIHt9XG5cbiAgVW5lc2NhcGVyLlBBVFRFUk5fRVNDQVBFRF9DSEFSQUNURVIgPSBuZXcgUGF0dGVybignXFxcXFxcXFwoWzBhYnRcXHRudmZyZSBcIlxcXFwvXFxcXFxcXFxOX0xQXXx4WzAtOWEtZkEtRl17Mn18dVswLTlhLWZBLUZdezR9fFVbMC05YS1mQS1GXXs4fSknKTtcblxuICBVbmVzY2FwZXIudW5lc2NhcGVTaW5nbGVRdW90ZWRTdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5yZXBsYWNlKC9cXCdcXCcvZywgJ1xcJycpO1xuICB9O1xuXG4gIFVuZXNjYXBlci51bmVzY2FwZURvdWJsZVF1b3RlZFN0cmluZyA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuX3VuZXNjYXBlQ2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgdGhpcy5fdW5lc2NhcGVDYWxsYmFjayA9IChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oc3RyKSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLnVuZXNjYXBlQ2hhcmFjdGVyKHN0cik7XG4gICAgICAgIH07XG4gICAgICB9KSh0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuUEFUVEVSTl9FU0NBUEVEX0NIQVJBQ1RFUi5yZXBsYWNlKHZhbHVlLCB0aGlzLl91bmVzY2FwZUNhbGxiYWNrKTtcbiAgfTtcblxuICBVbmVzY2FwZXIudW5lc2NhcGVDaGFyYWN0ZXIgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBjaDtcbiAgICBjaCA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG4gICAgc3dpdGNoICh2YWx1ZS5jaGFyQXQoMSkpIHtcbiAgICAgIGNhc2UgJzAnOlxuICAgICAgICByZXR1cm4gY2goMCk7XG4gICAgICBjYXNlICdhJzpcbiAgICAgICAgcmV0dXJuIGNoKDcpO1xuICAgICAgY2FzZSAnYic6XG4gICAgICAgIHJldHVybiBjaCg4KTtcbiAgICAgIGNhc2UgJ3QnOlxuICAgICAgICByZXR1cm4gXCJcXHRcIjtcbiAgICAgIGNhc2UgXCJcXHRcIjpcbiAgICAgICAgcmV0dXJuIFwiXFx0XCI7XG4gICAgICBjYXNlICduJzpcbiAgICAgICAgcmV0dXJuIFwiXFxuXCI7XG4gICAgICBjYXNlICd2JzpcbiAgICAgICAgcmV0dXJuIGNoKDExKTtcbiAgICAgIGNhc2UgJ2YnOlxuICAgICAgICByZXR1cm4gY2goMTIpO1xuICAgICAgY2FzZSAncic6XG4gICAgICAgIHJldHVybiBjaCgxMyk7XG4gICAgICBjYXNlICdlJzpcbiAgICAgICAgcmV0dXJuIGNoKDI3KTtcbiAgICAgIGNhc2UgJyAnOlxuICAgICAgICByZXR1cm4gJyAnO1xuICAgICAgY2FzZSAnXCInOlxuICAgICAgICByZXR1cm4gJ1wiJztcbiAgICAgIGNhc2UgJy8nOlxuICAgICAgICByZXR1cm4gJy8nO1xuICAgICAgY2FzZSAnXFxcXCc6XG4gICAgICAgIHJldHVybiAnXFxcXCc7XG4gICAgICBjYXNlICdOJzpcbiAgICAgICAgcmV0dXJuIGNoKDB4MDA4NSk7XG4gICAgICBjYXNlICdfJzpcbiAgICAgICAgcmV0dXJuIGNoKDB4MDBBMCk7XG4gICAgICBjYXNlICdMJzpcbiAgICAgICAgcmV0dXJuIGNoKDB4MjAyOCk7XG4gICAgICBjYXNlICdQJzpcbiAgICAgICAgcmV0dXJuIGNoKDB4MjAyOSk7XG4gICAgICBjYXNlICd4JzpcbiAgICAgICAgcmV0dXJuIFV0aWxzLnV0ZjhjaHIoVXRpbHMuaGV4RGVjKHZhbHVlLnN1YnN0cigyLCAyKSkpO1xuICAgICAgY2FzZSAndSc6XG4gICAgICAgIHJldHVybiBVdGlscy51dGY4Y2hyKFV0aWxzLmhleERlYyh2YWx1ZS5zdWJzdHIoMiwgNCkpKTtcbiAgICAgIGNhc2UgJ1UnOlxuICAgICAgICByZXR1cm4gVXRpbHMudXRmOGNocihVdGlscy5oZXhEZWModmFsdWUuc3Vic3RyKDIsIDgpKSk7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gJyc7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBVbmVzY2FwZXI7XG5cbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gVW5lc2NhcGVyO1xuIiwiLy8gR2VuZXJhdGVkIGJ5IENvZmZlZVNjcmlwdCAxLjEyLjRcbnZhciBQYXR0ZXJuLCBVdGlscyxcbiAgaGFzUHJvcCA9IHt9Lmhhc093blByb3BlcnR5O1xuXG5QYXR0ZXJuID0gcmVxdWlyZSgnLi9QYXR0ZXJuJyk7XG5cblV0aWxzID0gKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiBVdGlscygpIHt9XG5cbiAgVXRpbHMuUkVHRVhfTEVGVF9UUklNX0JZX0NIQVIgPSB7fTtcblxuICBVdGlscy5SRUdFWF9SSUdIVF9UUklNX0JZX0NIQVIgPSB7fTtcblxuICBVdGlscy5SRUdFWF9TUEFDRVMgPSAvXFxzKy9nO1xuXG4gIFV0aWxzLlJFR0VYX0RJR0lUUyA9IC9eXFxkKyQvO1xuXG4gIFV0aWxzLlJFR0VYX09DVEFMID0gL1teMC03XS9naTtcblxuICBVdGlscy5SRUdFWF9IRVhBREVDSU1BTCA9IC9bXmEtZjAtOV0vZ2k7XG5cbiAgVXRpbHMuUEFUVEVSTl9EQVRFID0gbmV3IFBhdHRlcm4oJ14nICsgJyg/PHllYXI+WzAtOV1bMC05XVswLTldWzAtOV0pJyArICctKD88bW9udGg+WzAtOV1bMC05XT8pJyArICctKD88ZGF5PlswLTldWzAtOV0/KScgKyAnKD86KD86W1R0XXxbIFxcdF0rKScgKyAnKD88aG91cj5bMC05XVswLTldPyknICsgJzooPzxtaW51dGU+WzAtOV1bMC05XSknICsgJzooPzxzZWNvbmQ+WzAtOV1bMC05XSknICsgJyg/OlxcLig/PGZyYWN0aW9uPlswLTldKikpPycgKyAnKD86WyBcXHRdKig/PHR6Plp8KD88dHpfc2lnbj5bLStdKSg/PHR6X2hvdXI+WzAtOV1bMC05XT8pJyArICcoPzo6KD88dHpfbWludXRlPlswLTldWzAtOV0pKT8pKT8pPycgKyAnJCcsICdpJyk7XG5cbiAgVXRpbHMuTE9DQUxfVElNRVpPTkVfT0ZGU0VUID0gbmV3IERhdGUoKS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAgKiAxMDAwO1xuXG4gIFV0aWxzLnRyaW0gPSBmdW5jdGlvbihzdHIsIF9jaGFyKSB7XG4gICAgdmFyIHJlZ2V4TGVmdCwgcmVnZXhSaWdodDtcbiAgICBpZiAoX2NoYXIgPT0gbnVsbCkge1xuICAgICAgX2NoYXIgPSAnXFxcXHMnO1xuICAgIH1cbiAgICByZWdleExlZnQgPSB0aGlzLlJFR0VYX0xFRlRfVFJJTV9CWV9DSEFSW19jaGFyXTtcbiAgICBpZiAocmVnZXhMZWZ0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuUkVHRVhfTEVGVF9UUklNX0JZX0NIQVJbX2NoYXJdID0gcmVnZXhMZWZ0ID0gbmV3IFJlZ0V4cCgnXicgKyBfY2hhciArICcnICsgX2NoYXIgKyAnKicpO1xuICAgIH1cbiAgICByZWdleExlZnQubGFzdEluZGV4ID0gMDtcbiAgICByZWdleFJpZ2h0ID0gdGhpcy5SRUdFWF9SSUdIVF9UUklNX0JZX0NIQVJbX2NoYXJdO1xuICAgIGlmIChyZWdleFJpZ2h0ID09IG51bGwpIHtcbiAgICAgIHRoaXMuUkVHRVhfUklHSFRfVFJJTV9CWV9DSEFSW19jaGFyXSA9IHJlZ2V4UmlnaHQgPSBuZXcgUmVnRXhwKF9jaGFyICsgJycgKyBfY2hhciArICcqJCcpO1xuICAgIH1cbiAgICByZWdleFJpZ2h0Lmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4TGVmdCwgJycpLnJlcGxhY2UocmVnZXhSaWdodCwgJycpO1xuICB9O1xuXG4gIFV0aWxzLmx0cmltID0gZnVuY3Rpb24oc3RyLCBfY2hhcikge1xuICAgIHZhciByZWdleExlZnQ7XG4gICAgaWYgKF9jaGFyID09IG51bGwpIHtcbiAgICAgIF9jaGFyID0gJ1xcXFxzJztcbiAgICB9XG4gICAgcmVnZXhMZWZ0ID0gdGhpcy5SRUdFWF9MRUZUX1RSSU1fQllfQ0hBUltfY2hhcl07XG4gICAgaWYgKHJlZ2V4TGVmdCA9PSBudWxsKSB7XG4gICAgICB0aGlzLlJFR0VYX0xFRlRfVFJJTV9CWV9DSEFSW19jaGFyXSA9IHJlZ2V4TGVmdCA9IG5ldyBSZWdFeHAoJ14nICsgX2NoYXIgKyAnJyArIF9jaGFyICsgJyonKTtcbiAgICB9XG4gICAgcmVnZXhMZWZ0Lmxhc3RJbmRleCA9IDA7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKHJlZ2V4TGVmdCwgJycpO1xuICB9O1xuXG4gIFV0aWxzLnJ0cmltID0gZnVuY3Rpb24oc3RyLCBfY2hhcikge1xuICAgIHZhciByZWdleFJpZ2h0O1xuICAgIGlmIChfY2hhciA9PSBudWxsKSB7XG4gICAgICBfY2hhciA9ICdcXFxccyc7XG4gICAgfVxuICAgIHJlZ2V4UmlnaHQgPSB0aGlzLlJFR0VYX1JJR0hUX1RSSU1fQllfQ0hBUltfY2hhcl07XG4gICAgaWYgKHJlZ2V4UmlnaHQgPT0gbnVsbCkge1xuICAgICAgdGhpcy5SRUdFWF9SSUdIVF9UUklNX0JZX0NIQVJbX2NoYXJdID0gcmVnZXhSaWdodCA9IG5ldyBSZWdFeHAoX2NoYXIgKyAnJyArIF9jaGFyICsgJyokJyk7XG4gICAgfVxuICAgIHJlZ2V4UmlnaHQubGFzdEluZGV4ID0gMDtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UocmVnZXhSaWdodCwgJycpO1xuICB9O1xuXG4gIFV0aWxzLmlzRW1wdHkgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiAhdmFsdWUgfHwgdmFsdWUgPT09ICcnIHx8IHZhbHVlID09PSAnMCcgfHwgKHZhbHVlIGluc3RhbmNlb2YgQXJyYXkgJiYgdmFsdWUubGVuZ3RoID09PSAwKSB8fCB0aGlzLmlzRW1wdHlPYmplY3QodmFsdWUpO1xuICB9O1xuXG4gIFV0aWxzLmlzRW1wdHlPYmplY3QgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgIHZhciBrO1xuICAgIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIE9iamVjdCAmJiAoKGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlc3VsdHM7XG4gICAgICByZXN1bHRzID0gW107XG4gICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcbiAgICAgICAgaWYgKCFoYXNQcm9wLmNhbGwodmFsdWUsIGspKSBjb250aW51ZTtcbiAgICAgICAgcmVzdWx0cy5wdXNoKGspO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdHM7XG4gICAgfSkoKSkubGVuZ3RoID09PSAwO1xuICB9O1xuXG4gIFV0aWxzLnN1YlN0ckNvdW50ID0gZnVuY3Rpb24oc3RyaW5nLCBzdWJTdHJpbmcsIHN0YXJ0LCBsZW5ndGgpIHtcbiAgICB2YXIgYywgaSwgaiwgbGVuLCByZWYsIHN1YmxlbjtcbiAgICBjID0gMDtcbiAgICBzdHJpbmcgPSAnJyArIHN0cmluZztcbiAgICBzdWJTdHJpbmcgPSAnJyArIHN1YlN0cmluZztcbiAgICBpZiAoc3RhcnQgIT0gbnVsbCkge1xuICAgICAgc3RyaW5nID0gc3RyaW5nLnNsaWNlKHN0YXJ0KTtcbiAgICB9XG4gICAgaWYgKGxlbmd0aCAhPSBudWxsKSB7XG4gICAgICBzdHJpbmcgPSBzdHJpbmcuc2xpY2UoMCwgbGVuZ3RoKTtcbiAgICB9XG4gICAgbGVuID0gc3RyaW5nLmxlbmd0aDtcbiAgICBzdWJsZW4gPSBzdWJTdHJpbmcubGVuZ3RoO1xuICAgIGZvciAoaSA9IGogPSAwLCByZWYgPSBsZW47IDAgPD0gcmVmID8gaiA8IHJlZiA6IGogPiByZWY7IGkgPSAwIDw9IHJlZiA/ICsraiA6IC0taikge1xuICAgICAgaWYgKHN1YlN0cmluZyA9PT0gc3RyaW5nLnNsaWNlKGksIHN1YmxlbikpIHtcbiAgICAgICAgYysrO1xuICAgICAgICBpICs9IHN1YmxlbiAtIDE7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjO1xuICB9O1xuXG4gIFV0aWxzLmlzRGlnaXRzID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICB0aGlzLlJFR0VYX0RJR0lUUy5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0aGlzLlJFR0VYX0RJR0lUUy50ZXN0KGlucHV0KTtcbiAgfTtcblxuICBVdGlscy5vY3REZWMgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgIHRoaXMuUkVHRVhfT0NUQUwubGFzdEluZGV4ID0gMDtcbiAgICByZXR1cm4gcGFyc2VJbnQoKGlucHV0ICsgJycpLnJlcGxhY2UodGhpcy5SRUdFWF9PQ1RBTCwgJycpLCA4KTtcbiAgfTtcblxuICBVdGlscy5oZXhEZWMgPSBmdW5jdGlvbihpbnB1dCkge1xuICAgIHRoaXMuUkVHRVhfSEVYQURFQ0lNQUwubGFzdEluZGV4ID0gMDtcbiAgICBpbnB1dCA9IHRoaXMudHJpbShpbnB1dCk7XG4gICAgaWYgKChpbnB1dCArICcnKS5zbGljZSgwLCAyKSA9PT0gJzB4Jykge1xuICAgICAgaW5wdXQgPSAoaW5wdXQgKyAnJykuc2xpY2UoMik7XG4gICAgfVxuICAgIHJldHVybiBwYXJzZUludCgoaW5wdXQgKyAnJykucmVwbGFjZSh0aGlzLlJFR0VYX0hFWEFERUNJTUFMLCAnJyksIDE2KTtcbiAgfTtcblxuICBVdGlscy51dGY4Y2hyID0gZnVuY3Rpb24oYykge1xuICAgIHZhciBjaDtcbiAgICBjaCA9IFN0cmluZy5mcm9tQ2hhckNvZGU7XG4gICAgaWYgKDB4ODAgPiAoYyAlPSAweDIwMDAwMCkpIHtcbiAgICAgIHJldHVybiBjaChjKTtcbiAgICB9XG4gICAgaWYgKDB4ODAwID4gYykge1xuICAgICAgcmV0dXJuIGNoKDB4QzAgfCBjID4+IDYpICsgY2goMHg4MCB8IGMgJiAweDNGKTtcbiAgICB9XG4gICAgaWYgKDB4MTAwMDAgPiBjKSB7XG4gICAgICByZXR1cm4gY2goMHhFMCB8IGMgPj4gMTIpICsgY2goMHg4MCB8IGMgPj4gNiAmIDB4M0YpICsgY2goMHg4MCB8IGMgJiAweDNGKTtcbiAgICB9XG4gICAgcmV0dXJuIGNoKDB4RjAgfCBjID4+IDE4KSArIGNoKDB4ODAgfCBjID4+IDEyICYgMHgzRikgKyBjaCgweDgwIHwgYyA+PiA2ICYgMHgzRikgKyBjaCgweDgwIHwgYyAmIDB4M0YpO1xuICB9O1xuXG4gIFV0aWxzLnBhcnNlQm9vbGVhbiA9IGZ1bmN0aW9uKGlucHV0LCBzdHJpY3QpIHtcbiAgICB2YXIgbG93ZXJJbnB1dDtcbiAgICBpZiAoc3RyaWN0ID09IG51bGwpIHtcbiAgICAgIHN0cmljdCA9IHRydWU7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgaW5wdXQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsb3dlcklucHV0ID0gaW5wdXQudG9Mb3dlckNhc2UoKTtcbiAgICAgIGlmICghc3RyaWN0KSB7XG4gICAgICAgIGlmIChsb3dlcklucHV0ID09PSAnbm8nKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobG93ZXJJbnB1dCA9PT0gJzAnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChsb3dlcklucHV0ID09PSAnZmFsc2UnKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChsb3dlcklucHV0ID09PSAnJykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuICEhaW5wdXQ7XG4gIH07XG5cbiAgVXRpbHMuaXNOdW1lcmljID0gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICB0aGlzLlJFR0VYX1NQQUNFUy5sYXN0SW5kZXggPSAwO1xuICAgIHJldHVybiB0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInIHx8IHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycgJiYgIWlzTmFOKGlucHV0KSAmJiBpbnB1dC5yZXBsYWNlKHRoaXMuUkVHRVhfU1BBQ0VTLCAnJykgIT09ICcnO1xuICB9O1xuXG4gIFV0aWxzLnN0cmluZ1RvRGF0ZSA9IGZ1bmN0aW9uKHN0cikge1xuICAgIHZhciBkYXRlLCBkYXksIGZyYWN0aW9uLCBob3VyLCBpbmZvLCBtaW51dGUsIG1vbnRoLCBzZWNvbmQsIHR6X2hvdXIsIHR6X21pbnV0ZSwgdHpfb2Zmc2V0LCB5ZWFyO1xuICAgIGlmICghKHN0ciAhPSBudWxsID8gc3RyLmxlbmd0aCA6IHZvaWQgMCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpbmZvID0gdGhpcy5QQVRURVJOX0RBVEUuZXhlYyhzdHIpO1xuICAgIGlmICghaW5mbykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHllYXIgPSBwYXJzZUludChpbmZvLnllYXIsIDEwKTtcbiAgICBtb250aCA9IHBhcnNlSW50KGluZm8ubW9udGgsIDEwKSAtIDE7XG4gICAgZGF5ID0gcGFyc2VJbnQoaW5mby5kYXksIDEwKTtcbiAgICBpZiAoaW5mby5ob3VyID09IG51bGwpIHtcbiAgICAgIGRhdGUgPSBuZXcgRGF0ZShEYXRlLlVUQyh5ZWFyLCBtb250aCwgZGF5KSk7XG4gICAgICByZXR1cm4gZGF0ZTtcbiAgICB9XG4gICAgaG91ciA9IHBhcnNlSW50KGluZm8uaG91ciwgMTApO1xuICAgIG1pbnV0ZSA9IHBhcnNlSW50KGluZm8ubWludXRlLCAxMCk7XG4gICAgc2Vjb25kID0gcGFyc2VJbnQoaW5mby5zZWNvbmQsIDEwKTtcbiAgICBpZiAoaW5mby5mcmFjdGlvbiAhPSBudWxsKSB7XG4gICAgICBmcmFjdGlvbiA9IGluZm8uZnJhY3Rpb24uc2xpY2UoMCwgMyk7XG4gICAgICB3aGlsZSAoZnJhY3Rpb24ubGVuZ3RoIDwgMykge1xuICAgICAgICBmcmFjdGlvbiArPSAnMCc7XG4gICAgICB9XG4gICAgICBmcmFjdGlvbiA9IHBhcnNlSW50KGZyYWN0aW9uLCAxMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZyYWN0aW9uID0gMDtcbiAgICB9XG4gICAgaWYgKGluZm8udHogIT0gbnVsbCkge1xuICAgICAgdHpfaG91ciA9IHBhcnNlSW50KGluZm8udHpfaG91ciwgMTApO1xuICAgICAgaWYgKGluZm8udHpfbWludXRlICE9IG51bGwpIHtcbiAgICAgICAgdHpfbWludXRlID0gcGFyc2VJbnQoaW5mby50el9taW51dGUsIDEwKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHR6X21pbnV0ZSA9IDA7XG4gICAgICB9XG4gICAgICB0el9vZmZzZXQgPSAodHpfaG91ciAqIDYwICsgdHpfbWludXRlKSAqIDYwMDAwO1xuICAgICAgaWYgKCctJyA9PT0gaW5mby50el9zaWduKSB7XG4gICAgICAgIHR6X29mZnNldCAqPSAtMTtcbiAgICAgIH1cbiAgICB9XG4gICAgZGF0ZSA9IG5ldyBEYXRlKERhdGUuVVRDKHllYXIsIG1vbnRoLCBkYXksIGhvdXIsIG1pbnV0ZSwgc2Vjb25kLCBmcmFjdGlvbikpO1xuICAgIGlmICh0el9vZmZzZXQpIHtcbiAgICAgIGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSAtIHR6X29mZnNldCk7XG4gICAgfVxuICAgIHJldHVybiBkYXRlO1xuICB9O1xuXG4gIFV0aWxzLnN0clJlcGVhdCA9IGZ1bmN0aW9uKHN0ciwgbnVtYmVyKSB7XG4gICAgdmFyIGksIHJlcztcbiAgICByZXMgPSAnJztcbiAgICBpID0gMDtcbiAgICB3aGlsZSAoaSA8IG51bWJlcikge1xuICAgICAgcmVzICs9IHN0cjtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfTtcblxuICBVdGlscy5nZXRTdHJpbmdGcm9tRmlsZSA9IGZ1bmN0aW9uKHBhdGgsIGNhbGxiYWNrKSB7XG4gICAgdmFyIGRhdGEsIGZzLCBqLCBsZW4xLCBuYW1lLCByZWYsIHJlcSwgeGhyO1xuICAgIGlmIChjYWxsYmFjayA9PSBudWxsKSB7XG4gICAgICBjYWxsYmFjayA9IG51bGw7XG4gICAgfVxuICAgIHhociA9IG51bGw7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93ICE9PSBudWxsKSB7XG4gICAgICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgfSBlbHNlIGlmICh3aW5kb3cuQWN0aXZlWE9iamVjdCkge1xuICAgICAgICByZWYgPSBbXCJNc3htbDIuWE1MSFRUUC42LjBcIiwgXCJNc3htbDIuWE1MSFRUUC4zLjBcIiwgXCJNc3htbDIuWE1MSFRUUFwiLCBcIk1pY3Jvc29mdC5YTUxIVFRQXCJdO1xuICAgICAgICBmb3IgKGogPSAwLCBsZW4xID0gcmVmLmxlbmd0aDsgaiA8IGxlbjE7IGorKykge1xuICAgICAgICAgIG5hbWUgPSByZWZbal07XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHhociA9IG5ldyBBY3RpdmVYT2JqZWN0KG5hbWUpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7fVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh4aHIgIT0gbnVsbCkge1xuICAgICAgaWYgKGNhbGxiYWNrICE9IG51bGwpIHtcbiAgICAgICAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT09IDIwMCB8fCB4aHIuc3RhdHVzID09PSAwKSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHhoci5vcGVuKCdHRVQnLCBwYXRoLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuIHhoci5zZW5kKG51bGwpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIHBhdGgsIGZhbHNlKTtcbiAgICAgICAgeGhyLnNlbmQobnVsbCk7XG4gICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDAgfHwgeGhyLnN0YXR1cyA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiB4aHIucmVzcG9uc2VUZXh0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXEgPSByZXF1aXJlO1xuICAgICAgZnMgPSByZXEoJ2ZzJyk7XG4gICAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZnMucmVhZEZpbGUocGF0aCwgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XG4gICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soU3RyaW5nKGRhdGEpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGF0YSA9IGZzLnJlYWRGaWxlU3luYyhwYXRoKTtcbiAgICAgICAgaWYgKGRhdGEgIT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBTdHJpbmcoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBVdGlscztcblxufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBVdGlscztcbiIsIi8vIEdlbmVyYXRlZCBieSBDb2ZmZWVTY3JpcHQgMS4xMi40XG52YXIgRHVtcGVyLCBQYXJzZXIsIFV0aWxzLCBZYW1sO1xuXG5QYXJzZXIgPSByZXF1aXJlKCcuL1BhcnNlcicpO1xuXG5EdW1wZXIgPSByZXF1aXJlKCcuL0R1bXBlcicpO1xuXG5VdGlscyA9IHJlcXVpcmUoJy4vVXRpbHMnKTtcblxuWWFtbCA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gWWFtbCgpIHt9XG5cbiAgWWFtbC5wYXJzZSA9IGZ1bmN0aW9uKGlucHV0LCBleGNlcHRpb25PbkludmFsaWRUeXBlLCBvYmplY3REZWNvZGVyKSB7XG4gICAgaWYgKGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUgPT0gbnVsbCkge1xuICAgICAgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAob2JqZWN0RGVjb2RlciA9PSBudWxsKSB7XG4gICAgICBvYmplY3REZWNvZGVyID0gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBQYXJzZXIoKS5wYXJzZShpbnB1dCwgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0RGVjb2Rlcik7XG4gIH07XG5cbiAgWWFtbC5wYXJzZUZpbGUgPSBmdW5jdGlvbihwYXRoLCBjYWxsYmFjaywgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0RGVjb2Rlcikge1xuICAgIHZhciBpbnB1dDtcbiAgICBpZiAoY2FsbGJhY2sgPT0gbnVsbCkge1xuICAgICAgY2FsbGJhY2sgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoZXhjZXB0aW9uT25JbnZhbGlkVHlwZSA9PSBudWxsKSB7XG4gICAgICBleGNlcHRpb25PbkludmFsaWRUeXBlID0gZmFsc2U7XG4gICAgfVxuICAgIGlmIChvYmplY3REZWNvZGVyID09IG51bGwpIHtcbiAgICAgIG9iamVjdERlY29kZXIgPSBudWxsO1xuICAgIH1cbiAgICBpZiAoY2FsbGJhY2sgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFV0aWxzLmdldFN0cmluZ0Zyb21GaWxlKHBhdGgsIChmdW5jdGlvbihfdGhpcykge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24oaW5wdXQpIHtcbiAgICAgICAgICB2YXIgcmVzdWx0O1xuICAgICAgICAgIHJlc3VsdCA9IG51bGw7XG4gICAgICAgICAgaWYgKGlucHV0ICE9IG51bGwpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IF90aGlzLnBhcnNlKGlucHV0LCBleGNlcHRpb25PbkludmFsaWRUeXBlLCBvYmplY3REZWNvZGVyKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FsbGJhY2socmVzdWx0KTtcbiAgICAgICAgfTtcbiAgICAgIH0pKHRoaXMpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5wdXQgPSBVdGlscy5nZXRTdHJpbmdGcm9tRmlsZShwYXRoKTtcbiAgICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBhcnNlKGlucHV0LCBleGNlcHRpb25PbkludmFsaWRUeXBlLCBvYmplY3REZWNvZGVyKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfTtcblxuICBZYW1sLmR1bXAgPSBmdW5jdGlvbihpbnB1dCwgaW5saW5lLCBpbmRlbnQsIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdEVuY29kZXIpIHtcbiAgICB2YXIgeWFtbDtcbiAgICBpZiAoaW5saW5lID09IG51bGwpIHtcbiAgICAgIGlubGluZSA9IDI7XG4gICAgfVxuICAgIGlmIChpbmRlbnQgPT0gbnVsbCkge1xuICAgICAgaW5kZW50ID0gNDtcbiAgICB9XG4gICAgaWYgKGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUgPT0gbnVsbCkge1xuICAgICAgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAob2JqZWN0RW5jb2RlciA9PSBudWxsKSB7XG4gICAgICBvYmplY3RFbmNvZGVyID0gbnVsbDtcbiAgICB9XG4gICAgeWFtbCA9IG5ldyBEdW1wZXIoKTtcbiAgICB5YW1sLmluZGVudGF0aW9uID0gaW5kZW50O1xuICAgIHJldHVybiB5YW1sLmR1bXAoaW5wdXQsIGlubGluZSwgMCwgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0RW5jb2Rlcik7XG4gIH07XG5cbiAgWWFtbC5zdHJpbmdpZnkgPSBmdW5jdGlvbihpbnB1dCwgaW5saW5lLCBpbmRlbnQsIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdEVuY29kZXIpIHtcbiAgICByZXR1cm4gdGhpcy5kdW1wKGlucHV0LCBpbmxpbmUsIGluZGVudCwgZXhjZXB0aW9uT25JbnZhbGlkVHlwZSwgb2JqZWN0RW5jb2Rlcik7XG4gIH07XG5cbiAgWWFtbC5sb2FkID0gZnVuY3Rpb24ocGF0aCwgY2FsbGJhY2ssIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdERlY29kZXIpIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZUZpbGUocGF0aCwgY2FsbGJhY2ssIGV4Y2VwdGlvbk9uSW52YWxpZFR5cGUsIG9iamVjdERlY29kZXIpO1xuICB9O1xuXG4gIHJldHVybiBZYW1sO1xuXG59KSgpO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cgIT09IG51bGwpIHtcbiAgd2luZG93LllBTUwgPSBZYW1sO1xufVxuXG5pZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJ1bmRlZmluZWRcIiB8fCB3aW5kb3cgPT09IG51bGwpIHtcbiAgdGhpcy5ZQU1MID0gWWFtbDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBZYW1sO1xuIiwiZGVmaW5lKCducG06YW5zaXBhcnNlJywgZnVuY3Rpb24oKXsgcmV0dXJuIHsgJ2RlZmF1bHQnOiByZXF1aXJlKCdhbnNpcGFyc2UnKX07fSlcbmRlZmluZSgnbnBtOmxvZGFzaC5pbnRlcnNlY3Rpb24nLCBmdW5jdGlvbigpeyByZXR1cm4geyAnZGVmYXVsdCc6IHJlcXVpcmUoJ2xvZGFzaC5pbnRlcnNlY3Rpb24nKX07fSlcbmRlZmluZSgnbnBtOmxvZGFzaC5waWNrYnknLCBmdW5jdGlvbigpeyByZXR1cm4geyAnZGVmYXVsdCc6IHJlcXVpcmUoJ2xvZGFzaC5waWNrYnknKX07fSlcbmRlZmluZSgnbnBtOnZpc2liaWxpdHlqcycsIGZ1bmN0aW9uKCl7IHJldHVybiB7ICdkZWZhdWx0JzogcmVxdWlyZSgndmlzaWJpbGl0eWpzJyl9O30pXG5kZWZpbmUoJ25wbTp5YW1sanMnLCBmdW5jdGlvbigpeyByZXR1cm4geyAnZGVmYXVsdCc6IHJlcXVpcmUoJ3lhbWxqcycpfTt9KSJdfQ==
