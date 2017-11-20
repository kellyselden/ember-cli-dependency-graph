define('ember-light-table/classes/Row', ['exports', 'ember'], function (exports, _ember) {
  var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var computed = _ember['default'].computed;
  var guidFor = _ember['default'].guidFor;

  /**
   * @module Table
   * @extends Ember.ObjectProxy
   * @class Row
   */

  var Row = (function (_Ember$ObjectProxy$extend) {
    _inherits(Row, _Ember$ObjectProxy$extend);

    /**
     * @class Row
     * @constructor
     * @param {Object} content
     * @param {Object} options
     */

    function Row(content) {
      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      _classCallCheck(this, Row);

      if (content instanceof Row) {
        return content;
      }

      _get(Object.getPrototypeOf(Row.prototype), 'constructor', this).call(this);
      this.setProperties(options);
      this.set('content', content);
    }

    return Row;
  })(_ember['default'].ObjectProxy.extend({
    /**
     * Whether the row is hidden.
     *
     * CSS Classes:
     *  - `is-hidden`
     *
     * @property hidden
     * @type {Boolean}
     * @default false
     */
    hidden: false,

    /**
     * Whether the row is expanded.
     *
     * CSS Classes:
     *  - `is-expanded`
     *
     * @property expanded
     * @type {Boolean}
     * @default false
     */
    expanded: false,

    /**
     * Whether the row is selected.
     *
     * CSS Classes:
     *  - `is-selected`
     *
     * @property selected
     * @type {Boolean}
     * @default false
     */
    selected: false,

    /**
     * Class names to be applied to this row
     *
     * @property classNames
     * @type {String | Array}
     */
    classNames: null,

    /**
     * Data content for this row. Since this class extends Ember.ObjectProxy,
     * all properties are forwarded to the content. This means that instead of
     * `row.content.foo` you can just do `row.foo`. Please note that methods are
     * not forwarded. You will not be able to do `row.save()`, instead, you would have
     * to do `row.content.save()`.
     *
     * @property content
     * @type {Object}
     */
    content: null,

    /**
     * Rows's unique ID.
     *
     * Note: named `rowId` in order to not shadow the `content.id` property.
     *
     * @property rowId
     * @type {String}
     * @readOnly
     */
    rowId: computed(function () {
      return guidFor(this);
    }).readOnly()
  }));

  exports['default'] = Row;
});