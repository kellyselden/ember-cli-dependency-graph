define('ember-light-table/mixins/table-header', ['exports', 'ember'], function (exports, _ember) {
  var _slice = Array.prototype.slice;
  var computed = _ember['default'].computed;

  /**
   * @module Light Table
   */

  /**
   * @class TableHeaderMixin
   * @extends Ember.Mixin
   * @private
   */

  exports['default'] = _ember['default'].Mixin.create({
    /**
     * @property table
     * @type {Table}
     * @private
     */
    table: null,

    /**
     * @property sharedOptions
     * @type {Object}
     * @private
     */
    sharedOptions: null,

    /**
     * @property tableActions
     * @type {Object}
     */
    tableActions: null,

    /**
     * @property fixed
     * @type {Boolean}
     * @default false
     */
    fixed: false,

    /**
     * @property sortOnClick
     * @type {Boolean}
     * @default true
     */
    sortOnClick: true,

    /**
     * @property multiColumnSort
     * @type {Boolean}
     * @default false
     */
    multiColumnSort: false,

    /**
     * Resize all cells in the column instead of just the header / footer
     *
     * @property resizeOnDrag
     * @type {Boolean}
     * @default false
     */
    resizeOnDrag: false,

    /**
     * @property iconAscending
     * @type {String}
     * @default ''
     */
    iconAscending: '',

    /**
     * @property iconDescending
     * @type {String}
     * @default ''
     */
    iconDescending: '',

    /**
     * ID of main table component. Used to generate divs for ember-wormhole
     * @type {String}
     */
    tableId: null,

    renderInPlace: computed.oneWay('fixed'),
    columnGroups: computed.readOnly('table.visibleColumnGroups'),
    subColumns: computed.readOnly('table.visibleSubColumns'),
    columns: computed.readOnly('table.visibleColumns'),

    sortIcons: computed('iconAscending', 'iconDescending', function () {
      return this.getProperties(['iconAscending', 'iconDescending']);
    }).readOnly(),

    actions: {
      /**
       * onColumnClick action. Handles column sorting.
       *
       * @event onColumnClick
       * @param  {Column} column The column that was clicked
       * @param  {Event} event The click event
       */
      onColumnClick: function onColumnClick(column) {
        if (column.sortable && this.get('sortOnClick')) {
          if (column.sorted) {
            column.toggleProperty('ascending');
          } else {
            if (!this.get('multiColumnSort')) {
              this.get('table.sortedColumns').setEach('sorted', false);
            }
            column.set('sorted', true);
          }
        }
        this.sendAction.apply(this, ['onColumnClick'].concat(_slice.call(arguments)));
      },

      /**
       * onColumnDoubleClick action.
       *
       * @event onColumnDoubleClick
       * @param  {Column} column The column that was clicked
       * @param  {Event} event   The click event
       */
      onColumnDoubleClick: function onColumnDoubleClick() /* column */{
        this.sendAction.apply(this, ['onColumnDoubleClick'].concat(_slice.call(arguments)));
      },

      /**
       * onColumnResized action.
       *
       * @event onColumnResized
       * @param  {Column} column The column that was resized
       * @param  {String} width  The final width of the column
       */
      onColumnResized: function onColumnResized() /* column, width */{
        this.sendAction.apply(this, ['onColumnResized'].concat(_slice.call(arguments)));
      },

      /**
       * onColumnDrag action.
       *
       * @event onColumnDrag
       * @param  {Column} column The column that is being dragged
       */
      onColumnDrag: function onColumnDrag() /* column */{
        this.sendAction.apply(this, ['onColumnDrag'].concat(_slice.call(arguments)));
      },

      /**
       * onColumnDrop action.
       *
       * @event onColumnDrop
       * @param  {Column} column The column that was dropped
       * @param  {Boolean} isSuccess The column was successfully dropped and sorted
       */
      onColumnDrop: function onColumnDrop() /* column, isSuccess */{
        this.sendAction.apply(this, ['onColumnDrop'].concat(_slice.call(arguments)));
      }
    }
  });
});