define('ember-cli-page-object/-private/properties/collection', ['exports', 'ember', 'ember-cli-page-object/-private/helpers', 'ember-cli-page-object/-private/create', 'ember-cli-page-object/-private/properties/count', 'ceibo'], function (exports, _ember, _emberCliPageObjectPrivateHelpers, _emberCliPageObjectPrivateCreate, _emberCliPageObjectPrivatePropertiesCount, _ceibo) {
  exports.collection = collection;

  var arrayDelegateMethods = ['map', 'filter', 'mapBy', 'filterBy', 'forEach'];

  function merge(target) {
    for (var _len = arguments.length, objects = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      objects[_key - 1] = arguments[_key];
    }

    objects.forEach(function (o) {
      return (0, _emberCliPageObjectPrivateHelpers.assign)(target, o);
    });

    return target;
  }

  function generateEnumerable(node, definition, item, key) {
    var enumerable = merge({}, definition);

    if (typeof enumerable.count === 'undefined') {
      enumerable.count = (0, _emberCliPageObjectPrivatePropertiesCount.count)(item.itemScope);
    }

    if (typeof enumerable.toArray === 'undefined') {
      enumerable.toArray = toArrayMethod(node, item, key);
      arrayDelegateMethods.forEach(function (method) {
        return delegateToArray(enumerable, method);
      });
    }

    var collection = (0, _emberCliPageObjectPrivateCreate.create)(enumerable, { parent: node });

    if (typeof Symbol !== 'undefined' && Symbol.iterator) {
      collection[Symbol.iterator] = iteratorMethod;
    }

    // Change the key of the root node
    _ceibo['default'].meta(collection).key = key + '()';

    return collection;
  }

  function generateItem(node, index, definition, key) {
    var filters = merge({}, { scope: definition.scope, at: index });
    var scope = (0, _emberCliPageObjectPrivateHelpers.buildSelector)({}, definition.itemScope, filters);

    var tree = (0, _emberCliPageObjectPrivateCreate.create)(merge({
      testContainer: definition.testContainer
    }, definition.item, {
      scope: scope,
      resetScope: definition.resetScope
    }), { parent: node });

    // Change the key of the root node
    _ceibo['default'].meta(tree).key = key + '(' + index + ')';

    return tree;
  }

  function toArrayMethod(node, definition, key) {
    return function () {
      var array = _ember['default'].A();
      var index = undefined;
      var count = undefined;

      for (index = 0, count = this.count; index < count; index++) {
        array.push(generateItem(node, index, definition, key));
      }

      return array;
    };
  }

  function delegateToArray(enumerable, method) {
    if (typeof enumerable[method] === 'undefined') {
      enumerable[method] = function () {
        var _toArray;

        return (_toArray = this.toArray())[method].apply(_toArray, arguments);
      };
    }
  }

  function iteratorMethod() {
    var i = 0;
    var items = this.toArray();
    var next = function next() {
      return { done: i >= items.length, value: items[i++] };
    };

    return { next: next };
  }

  /**
   * @public
   *
   * Creates a component that represents a collection of items. The collection is zero-indexed.
   *
   * When called with an index, the method returns the matching item.
   *
   * When called without an index, the the object returned behaves as a regular PageObject with a few additional properties and methods:
   *
   * - `count` - the number of items in the collection
   * - `toArray()` - returns an array containing all the items in the collection
   * - `[Symbol.iterator]()` - if supported by the environment, this allows the collection to be iterated with `for/of` and spread with `...` like a normal array
   *
   * Collection objects also delegate the following methods to `toArray()` for ease of consumption:
   * - `map`
   * - `mapBy`
   * - `filter`
   * - `filterBy`
   * - `forEach`
   *
   * @example
   *
   * // <table>
   * //   <caption>List of users</caption>
   * //   <tbody>
   * //     <tr>
   * //       <td>Mary<td>
   * //       <td>Watson</td>
   * //     </tr>
   * //     <tr>
   * //       <td>John<td>
   * //       <td>Doe</td>
   * //     </tr>
   * //   </tbody>
   * // </table>
   *
   * const page = PageObject.create({
   *   users: collection({
   *     itemScope: 'table tr',
   *
   *     item: {
   *       firstName: text('td', { at: 0 }),
   *       lastName: text('td', { at: 1 })
   *     },
   *
   *     caption: text('caption')
   *   })
   * });
   *
   * assert.equal(page.users().count, 2);
   * assert.equal(page.users().caption, 'List of users');
   * assert.equal(page.users(1).firstName, 'John');
   * assert.equal(page.users(1).lastName, 'Doe');
   *
   * @example
   *
   * // <div class="admins">
   * //   <table>
   * //     <tbody>
   * //       <tr>
   * //         <td>Mary<td>
   * //         <td>Watson</td>
   * //       </tr>
   * //       <tr>
   * //         <td>John<td>
   * //         <td>Doe</td>
   * //       </tr>
   * //     </tbody>
   * //   </table>
   * // </div>
   *
   * // <div class="normal">
   * //   <table>
   * //   </table>
   * // </div>
   *
   * const page = PageObject.create({
   *   users: collection({
   *     scope: '.admins',
   *
   *     itemScope: 'table tr',
   *
   *     item: {
   *       firstName: text('td', { at: 0 }),
   *       lastName: text('td', { at: 1 })
   *     }
   *   })
   * });
   *
   * assert.equal(page.users().count, 2);
   *
   * @example
   *
   * // <table>
   * //   <caption>User Index</caption>
   * //   <tbody>
   * //     <tr>
   * //       <td>Doe</td>
   * //     </tr>
   * //   </tbody>
   * // </table>
   *
   * const page = PageObject.create({
   *   users: PageObject.collection({
   *     scope: 'table',
   *     itemScope: 'tr',
   *
   *     item: {
   *       firstName: text('td', { at: 0 })
   *     },
   *
   *     caption: PageObject.text('caption')
   *   })
   * });
   *
   * assert.equal(page.users().caption, 'User Index');
   *
   * @param {Object} definition - Collection definition
   * @param {string} definition.scope - Nests provided scope within parent's scope
   * @param {boolean} definition.resetScope - Override parent's scope
   * @param {string} definition.itemScope - CSS selector
   * @param {Object} definition.item - Item definition
   * @return {Descriptor}
   */

  function collection(definition) {
    definition = (0, _emberCliPageObjectPrivateHelpers.assign)({}, definition);

    var item = {
      scope: definition.scope,
      itemScope: definition.itemScope,
      resetScope: definition.resetScope,
      item: definition.item,
      testContainer: definition.testContainer
    };

    delete definition.item;
    delete definition.itemScope;

    return {
      isDescriptor: true,

      get: function get(key) {
        var _this = this;

        return function (index) {
          if (typeof index === 'number') {
            return generateItem(_this, index, item, key);
          } else {
            return generateEnumerable(_this, definition, item, key);
          }
        };
      }
    };
  }
});