define('ember-light-table/classes/Column', ['exports', 'ember'], function (exports, _ember) {
  var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  var guidFor = _ember['default'].guidFor;
  var isEmpty = _ember['default'].isEmpty;
  var makeArray = _ember['default'].makeArray;
  var computed = _ember['default'].computed;
  var emberArray = _ember['default'].A;

  /**
   * @module Table
   * @class Column
   */

  var Column = (function (_Ember$Object$extend) {
    _inherits(Column, _Ember$Object$extend);

    /**
     * @class Column
     * @constructor
     * @param {Object} options
     */

    function Column() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _classCallCheck(this, Column);

      if (options instanceof Column) {
        return options;
      }

      _get(Object.getPrototypeOf(Column.prototype), 'constructor', this).call(this);
      this.setProperties(options);

      var subColumns = options.subColumns;

      subColumns = emberArray(makeArray(subColumns).map(function (sc) {
        return new Column(sc);
      }));
      subColumns.setEach('parent', this);

      this.set('subColumns', subColumns);
    }

    return Column;
  })(_ember['default'].Object.extend({
    /**
     * Whether the column can be hidden.
     *
     * CSS Classes:
     *  - `is-hideable`
     *
     * @property hideable
     * @type {Boolean}
     * @default true
     */
    hideable: true,

    /**
     * Whether the column can is hidden.
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
     * If true, this column has been hidden due to the responsive behavior
     *
     * @property responsiveHidden
     * @type {Boolean}
     * @default false
     */
    responsiveHidden: false,

    /**
     * @property ascending
     * @type {Boolean}
     * @default true
     */
    ascending: true,

    /**
     * Whether the column can be sorted.
     *
     * CSS Classes:
     *  - `is-sortable`
     *
     * @property sortable
     * @type {Boolean}
     * @default true
     */
    sortable: true,

    /**
     * Whether the column can be resized.
     *
     * CSS Classes:
     *  - `is-resizable`
     *  - `is-resizing`
     *
     * @property resizable
     * @type {Boolean}
     * @default false
     */
    resizable: false,

    /**
     * Whether the column can be reorder via drag and drop.
     *
     * CSS Classes:
     *  - `is-draggable`
     *  - `is-dragging`
     *  - `is-drag-target`
     *    - `drag-left`
     *    - `drag-right`
     *
     * @property draggable
     * @type {Boolean}
     * @default false
     */
    draggable: false,

    /**
     * Whether the column is a valid drop target.
     *
     * @property droppable
     * @type {Boolean}
     * @default true
     */
    droppable: true,

    /**
     * Whether the column is sorted.
     *
     * CSS Classes:
     *  - `is-sorted`
     *
     * @property sorted
     * @type {Boolean}
     * @default false
     */
    sorted: false,

    /**
     * Column header label
     * @property label
     * @type {String}
     * @default ''
     */
    label: '',

    /**
     * Text alignment. Possible values are ['left', 'right', 'center']
     * @property align
     * @type {String}
     * @default 'left'
     */
    align: 'left',

    /**
     * The minimum width (in px) that this column can be resized to.
     * @property minResizeWidth
     * @type {Number}
     * @default 0
     */
    minResizeWidth: 0,

    /**
     * The parent column (or group) for this sub-column.
     * This will only have a value if this column is a sub-column.
     * Note: this doesn't update if you move this sub-column to another parent after instantiation.
     *
     * @property parent
     * @type Column
     * @optional
     */
    parent: null,

    /**
     * An array of sub columns to be grouped together
     * @property subColumns
     * @type {Array}
     * @optional
     */
    subColumns: null,

    /**
     * An array of media breakpoints that determine when this column will be shown
     *
     * If we have the following breakpoints defined in `app/breakpoints.js`:
     *
     * - mobile
     * - tablet
     * - desktop
     *
     * And we want to show this column only for tablet and desktop media, the following
     * array should be specified: `['tablet', 'desktop']`.
     *
     * If this property is `null`, `undefined`, or `[]`, then this column will always
     * be shown, regardless of the current media type.
     *
     * @property breakpoints
     * @type {Array}
     * @optional
     */
    breakpoints: null,

    /**
     * Type of column component
     *
     * You can create your own column types by running the blueprint:
     * `ember g column-type my-column-type`
     *
     * This will generate a component for you which represents the `<th>`
     * element for the column. If you want to apply custom actions to the `th`,
     * or do some custom styling of the `th` with classNameBindings, all of that is
     * available to you in this component.
     *
     * You can then specify the custom type you created as a string here, to use it.
     *
     *
     * @property type
     * @type {String}
     * @default 'base'
     */
    type: 'base',

    /**
     * Type of cell component
     *
     * You can create your own cell types by running the blueprint:
     * `ember g cell-type my-cell-type`
     *
     * This will generate a component for you which represents the `<td>`
     * cells in the column. If you want to apply custom actions to the `td`,
     * or do some custom styling of the `td` with classNameBindings, all of that is
     * available to you in this component.
     *
     * You can then specify the custom type you created as a string here, to use it.
     *
     * @property cellType
     * @type {String}
     * @default 'base'
     */
    cellType: 'base',

    /**
     * Component name for the column
     * @property component
     * @type {String}
     * @optional
     */
    component: null,

    /**
     * Component name for the column cells. This component is automatically passed row,
     * column, and value variables, and you can specify a valuePath to set what property
     * the value is set to.
     * @property cellComponent
     * @type {String}
     * @optional
     */
    cellComponent: null,

    /**
     * @property valuePath
     * @type {String}
     */
    valuePath: null,

    /**
     * @property width
     * @type {String}
     */
    width: null,

    /**
     * Class names to be applied to header and footer cells of this column
     *
     * @property classNames
     * @type {String | Array}
     */
    classNames: null,

    /**
     * Class names to be applied to all cells of this column
     *
     * @property cellClassNames
     * @type {String | Array}
     */
    cellClassNames: null,

    /**
     * A format function used to calculate a cell's value. This method will be passed
     * the raw value if `valuePath` is specified.
     *
     * @property format
     * @type {Function}
     */
    format: null,

    /**
     * Column's unique ID.
     *
     * @property columnId
     * @type {String}
     * @private
     */
    columnId: computed(function () {
      return guidFor(this);
    }).readOnly(),

    /**
     * True if `hidden` or `responsiveHidden` is true.
     * @property isHidden
     * @type {Boolean}
     */
    isHidden: computed.or('hidden', 'responsiveHidden').readOnly(),

    /**
     * @property isGroupColumn
     * @type {Boolean}
     * @private
     */
    isGroupColumn: computed.notEmpty('subColumns').readOnly(),

    /**
     * @property isVisibleGroupColumn
     * @type {Boolean}
     * @private
     */
    isVisibleGroupColumn: computed('visibleSubColumns.[]', 'isHidden', function () {
      return !isEmpty(this.get('visibleSubColumns')) && !this.get('isHidden');
    }).readOnly(),

    /**
     * @property visibleSubColumns
     * @type {Array}
     * @private
     */
    visibleSubColumns: computed('subColumns.[]', 'subColumns.@each.isHidden', 'isHidden', function () {
      var subColumns = this.get('subColumns');
      var isHidden = this.get('isHidden');

      return emberArray(isHidden ? [] : subColumns.filterBy('isHidden', false));
    }).readOnly()
  }));

  exports['default'] = Column;
});