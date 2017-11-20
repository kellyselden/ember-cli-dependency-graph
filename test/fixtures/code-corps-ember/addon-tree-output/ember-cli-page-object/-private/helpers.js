define('ember-cli-page-object/-private/helpers', ['exports', 'ember', 'ceibo'], function (exports, _ember, _ceibo) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  exports.guardMultiple = guardMultiple;
  exports.buildSelector = buildSelector;
  exports.normalizeText = normalizeText;
  exports.every = every;
  exports.map = map;
  exports.getContext = getContext;
  exports.fullScope = fullScope;
  exports.findClosestValue = findClosestValue;
  exports.objectHasProperty = objectHasProperty;
  exports.getProperty = getProperty;

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var $ = _ember['default'].$;
  var assert = _ember['default'].assert;
  var get = _ember['default'].get;
  var isPresent = _ember['default'].isPresent;

  var Selector = (function () {
    function Selector(node, scope, selector, filters) {
      _classCallCheck(this, Selector);

      this.targetNode = node;
      this.targetScope = scope || '';
      this.targetSelector = selector || '';
      this.targetFilters = filters;
    }

    _createClass(Selector, [{
      key: 'toString',
      value: function toString() {
        var scope = undefined;
        var filters = undefined;

        if (this.targetFilters.resetScope) {
          scope = this.targetScope;
        } else {
          scope = this.calculateScope(this.targetNode, this.targetScope);
        }

        filters = this.calculateFilters(this.targetFilters);

        var selector = $.trim(scope + ' ' + this.targetSelector + filters);

        if (!selector.length) {
          // When an empty selector is resolved take the first direct child of the
          // testing container.
          selector = ':first';
        }

        return selector;
      }
    }, {
      key: 'calculateFilters',
      value: function calculateFilters() {
        var filters = [];

        if (this.targetFilters.visible) {
          filters.push(':visible');
        }

        if (this.targetFilters.contains) {
          filters.push(':contains("' + this.targetFilters.contains + '")');
        }

        if (typeof this.targetFilters.at === 'number') {
          filters.push(':eq(' + this.targetFilters.at + ')');
        } else if (this.targetFilters.last) {
          filters.push(':last');
        }

        return filters.join('');
      }
    }, {
      key: 'calculateScope',
      value: function calculateScope(node, targetScope) {
        var scopes = this.getScopes(node);

        scopes.reverse();
        scopes.push(targetScope);

        return $.trim(scopes.join(' '));
      }
    }, {
      key: 'getScopes',
      value: function getScopes(node) {
        var scopes = [];

        if (node.scope) {
          scopes.push(node.scope);
        }

        if (!node.resetScope && _ceibo['default'].parent(node)) {
          scopes = scopes.concat(this.calculateScope(_ceibo['default'].parent(node)));
        }

        return scopes;
      }
    }]);

    return Selector;
  })();

  function guardMultiple(items, selector, supportMultiple) {
    assert('"' + selector + '" matched more than one element. If this is not an error use { multiple: true }', supportMultiple || items.length <= 1);
  }

  /**
   * @public
   *
   * Builds a CSS selector from a target selector and a PageObject or a node in a PageObject, along with optional parameters.
   *
   * @example
   *
   * const component = PageObject.create({ scope: '.component'});
   *
   * buildSelector(component, '.my-element');
   * // returns '.component .my-element'
   *
   * @example
   *
   * const page = PageObject.create({});
   *
   * buildSelector(page, '.my-element', { at: 0 });
   * // returns '.my-element:eq(0)'
   *
   * @example
   *
   * const page = PageObject.create({});
   *
   * buildSelector(page, '.my-element', { contains: "Example" });
   * // returns ".my-element :contains('Example')"
   *
   * @example
   *
   * const page = PageObject.create({});
   *
   * buildSelector(page, '.my-element', { last: true });
   * // returns '.my-element:last'
   *
   * @param {Ceibo} node - Node of the tree
   * @param {string} targetSelector - CSS selector
   * @param {Object} options - Additional options
   * @param {boolean} options.resetScope - Do not use inherited scope
   * @param {string} options.contains - Filter by using :contains('foo') pseudo-class
   * @param {number} options.at - Filter by index using :eq(x) pseudo-class
   * @param {boolean} options.last - Filter by using :last pseudo-class
   * @param {boolean} options.visible - Filter by using :visible pseudo-class
   * @return {string} Fully qualified selector
   */

  function buildSelector(node, targetSelector, options) {
    return new Selector(node, options.scope, targetSelector, options).toString();
  }

  /**
   * @private
   *
   * Trim whitespaces at both ends and normalize whitespaces inside `text`
   *
   * Due to variations in the HTML parsers in different browsers, the text
   * returned may vary in newlines and other white space.
   *
   * @see http://api.jquery.com/text/
   */

  function normalizeText(text) {
    return $.trim(text).replace(/\n/g, ' ').replace(/\s\s*/g, ' ');
  }

  function every(jqArray, cb) {
    var arr = jqArray.get();

    return _ember['default'].A(arr).every(function (element) {
      return cb($(element));
    });
  }

  function map(jqArray, cb) {
    var arr = jqArray.get();

    return _ember['default'].A(arr).map(function (element) {
      return cb($(element));
    });
  }

  /**
   * @private
   *
   * Return the root of a node's tree
   *
   * @param {Ceibo} node - Node of the tree
   * @return {Ceibo} node - Root node of the tree
   */
  function getRoot(node) {
    var parent = _ceibo['default'].parent(node);
    var root = node;

    while (parent) {
      root = parent;
      parent = _ceibo['default'].parent(parent);
    }

    return root;
  }

  /**
   * @public
   *
   * Return a test context if one was provided during `create()`
   *
   * @param {Ceibo} node - Node of the tree
   * @return {?Object} The test's `this` context, or null
   */

  function getContext(node) {
    var root = getRoot(node);
    var context = root.context;

    if (typeof context === 'object' && typeof context.$ === 'function') {
      return context;
    } else {
      return null;
    }
  }

  function getAllValuesForProperty(node, property) {
    var iterator = node;
    var values = [];

    while (_ember['default'].isPresent(iterator)) {
      if (_ember['default'].isPresent(iterator[property])) {
        values.push(iterator[property]);
      }

      iterator = _ceibo['default'].parent(iterator);
    }

    return values;
  }

  /**
   * @public
   *
   * Return full scope of node (includes all ancestors scopes)
   *
   * @param {Ceibo} node - Node of the tree
   * @return {?Object} Full scope of node
   */

  function fullScope(node) {
    var scopes = getAllValuesForProperty(node, 'scope');

    return scopes.reverse().join(' ');
  }

  /**
   * @public
   *
   * Returns the value of property defined on the closest ancestor of given
   * node.
   *
   * @param {Ceibo} node - Node of the tree
   * @param {string} property - Property to look for
   * @return {?Object} The value of property on closest node to the given node
   */

  function findClosestValue(_x, _x2) {
    var _again = true;

    _function: while (_again) {
      var node = _x,
          property = _x2;
      _again = false;

      if (isPresent(node[property])) {
        return node[property];
      }

      var parent = _ceibo['default'].parent(node);

      if (isPresent(parent)) {
        _x = parent;
        _x2 = property;
        _again = true;
        parent = undefined;
        continue _function;
      }
    }
  }

  /**
   * @public
   *
   * Returns a boolean indicating whether an object contains a given property.
   * The path to a nested property should be indicated by a dot-separated string.
   *
   * @param {Object} object - object to check for the target property
   * @param {string} pathToProp - dot-separated path to property
   * @return {Boolean}
   */

  function objectHasProperty(object, pathToProp) {
    var pathSegments = pathToProp.split('.');

    for (var i = 0; i < pathSegments.length; i++) {
      var key = pathSegments[i];
      if (object === null || object === undefined || !object.hasOwnProperty(key)) {
        return false;
      } else {
        object = object[key];
      }
    }

    return true;
  }

  /**
   * @public
   *
   * Returns the value of an object property. If the property is a function,
   * the return value is that function bound to its "owner."
   *
   * @param {Object} object - object on which to look up the target property
   * @param {string} pathToProp - dot-separated path to property
   * @return {Boolean|String|Number|Function|Null|Undefined} - value of property
   */

  function getProperty(object, pathToProp) {
    var pathSegments = pathToProp.split('.');

    if (pathSegments.length === 1) {
      var _value = get(object, pathToProp);
      return typeof _value === 'function' ? _value.bind(object) : _value;
    }

    var pathToPropOwner = pathSegments.slice(0, -1).join('.');
    var propOwner = get(object, pathToPropOwner);

    if (propOwner === null || propOwner === undefined) {
      return undefined;
    }

    var propKey = pathSegments[pathSegments.length - 1];
    var value = get(propOwner, propKey);

    return typeof value === 'function' ? value.bind(propOwner) : value;
  }

  var assign = _ember['default'].assign || _ember['default'].merge;
  exports.assign = assign;
});