define('ember-light-table/components/lt-body', ['exports', 'ember', 'ember-light-table/templates/components/lt-body', 'ember-light-table/classes/Row'], function (exports, _ember, _emberLightTableTemplatesComponentsLtBody, _emberLightTableClassesRow) {
  var _slice = Array.prototype.slice;
  var Component = _ember['default'].Component;
  var computed = _ember['default'].computed;
  var run = _ember['default'].run;
  var observer = _ember['default'].observer;

  /**
   * @module Light Table
   */

  /**
   * ```hbs
   * {{#light-table table as |t|}}
   *   {{#t.body multiSelect=true onRowClick=(action 'rowClicked')}}
   *     {{#body.expanded-row as |row|}}
   *       Hello <b>{{row.firstName}}</b>
   *     {{/body.expanded-row}}
   *
   *     {{#if isLoading}}
   *       {{#body.loader}}
   *         Loading...
   *       {{/body.loader}}
   *     {{/if}}
   *
   *     {{#if table.isEmpty}}
   *       {{#body.no-data}}
   *         No users found.
   *       {{/body.no-data}}
   *     {{/if}}
   *   {{/t.body}}
   * {{/light-table}}
   * ```
   *
   * @class t.body
   */

  exports['default'] = Component.extend({
    layout: _emberLightTableTemplatesComponentsLtBody['default'],
    classNames: ['lt-body-wrap'],
    classNameBindings: ['canSelect', 'multiSelect', 'canExpand'],

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
     * Allows a user to select a row on click. All this will do is apply the necessary
     * CSS classes and add the row to `table.selectedRows`. If `multiSelect` is disabled
     * only one row will be selected at a time.
     *
     * @property canSelect
     * @type {Boolean}
     * @default true
     */
    canSelect: true,

    /**
     * Select a row on click. If this is set to `false` and multiSelect is
     * enabled, using click + `shift`, `cmd`, or `ctrl` will still work as
     * intended, while clicking on the row will not set the row as selected.
     *
     * @property selectOnClick
     * @type {Boolean}
     * @default true
     */
    selectOnClick: true,

    /**
     * Allows for expanding row. This will create a new row under the row that was
     * clicked with the template provided by `body.expanded-row`.
     *
     * ```hbs
     * {{#body.expanded-row as |row|}}
     *  This is the content of the expanded row for {{row.firstName}}
     * {{/body.expanded-row}}
     * ```
     *
     * @property canExpand
     * @type {Boolean}
     * @default false
     */
    canExpand: false,

    /**
     * Allows a user to select multiple rows with the `ctrl`, `cmd`, and `shift` keys.
     * These rows can be easily accessed via `table.get('selectedRows')`
     *
     * @property multiSelect
     * @type {Boolean}
     * @default false
     */
    multiSelect: false,

    /**
     * When multiSelect is true, this property determines whether or not `ctrl`
     * (or `cmd`) is required to select additional rows, one by one. When false,
     * simply clicking on subsequent rows will select or deselect them.
     *
     * `shift` to select many consecutive rows is unaffected by this property.
     *
     * @property multiSelectRequiresKeyboard
     * @type {Boolean}
     * @default true
     */
    multiSelectRequiresKeyboard: true,

    /**
     * Hide scrollbar when not scrolling
     *
     * @property autoHideScrollbar
     * @type {Boolean}
     * @default true
     */
    autoHideScrollbar: true,

    /**
     * Allows multiple rows to be expanded at once
     *
     * @property multiRowExpansion
     * @type {Boolean}
     * @default true
     */
    multiRowExpansion: true,

    /**
     * Expand a row on click
     *
     * @property expandOnClick
     * @type {Boolean}
     * @default true
     */
    expandOnClick: true,

    /**
     * If true, the body block will yield columns and rows, allowing you
     * to define your own table body
     *
     * @property overwrite
     * @type {Boolean}
     * @default false
     */
    overwrite: false,

    /**
     * ID of main table component. Used to generate divs for ember-wormhole
     *
     * @property tableId
     * @type {String}
     * @private
     */
    tableId: null,

    /**
     * @property scrollBuffer
     * @type {Number}
     * @default 500
     */
    scrollBuffer: 500,

    /**
     * @property useVirtualScrollbar
     * @type {Boolean}
     * @default false
     * @private
     */
    useVirtualScrollbar: false,

    /**
     * Set this property to scroll to a specific px offset.
     *
     * This only works when `useVirtualScrollbar` is `true`, i.e. when you are
     * using fixed headers / footers.
     *
     * @property scrollTo
     * @type {Number}
     * @default null
     */
    scrollTo: null,
    _scrollTo: null,

    /**
     * Set this property to a `Row` to scroll that `Row` into view.
     *
     * This only works when `useVirtualScrollbar` is `true`, i.e. when you are
     * using fixed headers / footers.
     *
     * @property scrollToRow
     * @type {Row}
     * @default null
     */
    scrollToRow: null,
    _scrollToRow: null,

    /**
     * @property targetScrollOffset
     * @type {Number}
     * @default 0
     * @private
     */
    targetScrollOffset: 0,

    /**
     * @property currentScrollOffset
     * @type {Number}
     * @default 0
     * @private
     */
    currentScrollOffset: 0,

    /**
     * @property hasReachedTargetScrollOffset
     * @type {Boolean}
     * @default true
     * @private
     */
    hasReachedTargetScrollOffset: true,

    /**
     * Allows to customize the component used to render rows
     *
     * ```hbs
     * {{#light-table table as |t|}}
     *    {{t.body rowComponent=(component 'my-row')}}
     * {{/light-table}}
     * ```
     * @property rowComponent
     * @type {Ember.Component}
     * @default null
     */
    rowComponent: null,

    /**
     * Allows to customize the component used to render spanned rows
     *
     * ```hbs
     * {{#light-table table as |t|}}
     *    {{t.body spannedRowComponent=(component 'my-spanned-row')}}
     * {{/light-table}}
     * ```
     * @property spannedRowComponent
     * @type {Ember.Component}
     * @default null
     */
    spannedRowComponent: null,

    /**
     * Allows to customize the component used to render infinite loader
     *
     * ```hbs
     * {{#light-table table as |t|}}
     *    {{t.body infinityComponent=(component 'my-infinity')}}
     * {{/light-table}}
     * ```
     * @property infinityComponent
     * @type {Ember.Component}
     * @default null
     */
    infinityComponent: null,

    rows: computed.readOnly('table.visibleRows'),
    columns: computed.readOnly('table.visibleColumns'),
    colspan: computed.readOnly('columns.length'),

    _prevSelectedIndex: -1,

    init: function init() {
      this._super.apply(this, arguments);

      /*
        We can only set `useVirtualScrollbar` once all contextual components have
        been initialized since fixedHeader and fixedFooter are set on t.head and t.foot
        initialization.
       */
      run.once(this, this._setupVirtualScrollbar);
    },

    didReceiveAttrs: function didReceiveAttrs() {
      this._super.apply(this, arguments);
      this.setupScrollOffset();
    },

    destroy: function destroy() {
      this._super.apply(this, arguments);
      run.cancel(this._checkTargetOffsetTimer);
      run.cancel(this._setTargetOffsetTimer);
    },

    _setupVirtualScrollbar: function _setupVirtualScrollbar() {
      var _get = this.get('sharedOptions');

      var fixedHeader = _get.fixedHeader;
      var fixedFooter = _get.fixedFooter;

      this.set('useVirtualScrollbar', fixedHeader || fixedFooter);
    },

    onRowsChange: observer('rows.[]', function () {
      this._checkTargetOffsetTimer = run.scheduleOnce('afterRender', this, this.checkTargetScrollOffset);
    }),

    setupScrollOffset: function setupScrollOffset() {
      var _getProperties = this.getProperties(['scrollTo', '_scrollTo', 'scrollToRow', '_scrollToRow']);

      var scrollTo = _getProperties.scrollTo;
      var _scrollTo = _getProperties._scrollTo;
      var scrollToRow = _getProperties.scrollToRow;
      var _scrollToRow = _getProperties._scrollToRow;

      var targetScrollOffset = null;

      this.setProperties({ _scrollTo: scrollTo, _scrollToRow: scrollToRow });

      if (scrollTo !== _scrollTo) {
        targetScrollOffset = Number.parseInt(scrollTo, 10);

        if (Number.isNaN(targetScrollOffset)) {
          targetScrollOffset = null;
        }

        this.setProperties({
          targetScrollOffset: targetScrollOffset,
          hasReachedTargetScrollOffset: targetScrollOffset <= 0
        });
      } else if (scrollToRow !== _scrollToRow) {
        if (scrollToRow instanceof _emberLightTableClassesRow['default']) {
          var rowElement = document.getElementById(scrollToRow.get('rowId'));

          if (rowElement instanceof Element) {
            targetScrollOffset = rowElement.offsetTop;
          }
        }

        this.setProperties({ targetScrollOffset: targetScrollOffset, hasReachedTargetScrollOffset: true });
      }
    },

    checkTargetScrollOffset: function checkTargetScrollOffset() {
      var _this = this;

      if (!this.get('hasReachedTargetScrollOffset')) {
        (function () {
          var targetScrollOffset = _this.get('targetScrollOffset');
          var currentScrollOffset = _this.get('currentScrollOffset');

          if (targetScrollOffset > currentScrollOffset) {
            _this.set('targetScrollOffset', null);
            _this._setTargetOffsetTimer = run.schedule('render', null, function () {
              _this.set('targetScrollOffset', targetScrollOffset);
            });
          } else {
            _this.set('hasReachedTargetScrollOffset', true);
          }
        })();
      }
    },

    toggleExpandedRow: function toggleExpandedRow(row) {
      var multiRowExpansion = this.get('multiRowExpansion');
      var shouldExpand = !row.expanded;

      if (multiRowExpansion) {
        row.toggleProperty('expanded');
      } else {
        this.get('table.expandedRows').setEach('expanded', false);
        row.set('expanded', shouldExpand);
      }
    },

    actions: {
      /**
       * onRowClick action. Handles selection, and row expansion.
       * @event onRowClick
       * @param  {Row}   row The row that was clicked
       * @param  {Event}   event   The click event
       */
      onRowClick: function onRowClick(row, e) {
        var _this2 = this;

        var rows = this.get('table.rows');
        var multiSelect = this.get('multiSelect');
        var multiSelectRequiresKeyboard = this.get('multiSelectRequiresKeyboard');
        var canSelect = this.get('canSelect');
        var selectOnClick = this.get('selectOnClick');
        var canExpand = this.get('canExpand');
        var expandOnClick = this.get('expandOnClick');
        var isSelected = row.get('selected');
        var currIndex = rows.indexOf(row);
        var prevIndex = this._prevSelectedIndex === -1 ? currIndex : this._prevSelectedIndex;

        this._prevSelectedIndex = currIndex;

        var toggleExpandedRow = function toggleExpandedRow() {
          if (canExpand && expandOnClick) {
            _this2.toggleExpandedRow(row);
          }
        };

        if (canSelect) {
          if (e.shiftKey && multiSelect) {
            rows.slice(Math.min(currIndex, prevIndex), Math.max(currIndex, prevIndex) + 1).forEach(function (r) {
              return r.set('selected', !isSelected);
            });
          } else if ((!multiSelectRequiresKeyboard || e.ctrlKey || e.metaKey) && multiSelect) {
            row.toggleProperty('selected');
          } else {
            if (selectOnClick) {
              this.get('table.selectedRows').setEach('selected', false);
              row.set('selected', !isSelected);
            }

            toggleExpandedRow();
          }
        } else {
          toggleExpandedRow();
        }

        this.sendAction.apply(this, ['onRowClick'].concat(_slice.call(arguments)));
      },

      /**
       * onRowDoubleClick action.
       * @event onRowDoubleClick
       * @param  {Row}   row The row that was clicked
       * @param  {Event}   event   The click event
       */
      onRowDoubleClick: function onRowDoubleClick() /* row */{
        this.sendAction.apply(this, ['onRowDoubleClick'].concat(_slice.call(arguments)));
      },

      /**
       * onScroll action - sent when user scrolls in the Y direction
       *
       * This only works when `useVirtualScrollbar` is `true`, i.e. when you are
       * using fixed headers / footers.
       *
       * @event onScroll
       * @param {Number} scrollOffset The scroll offset in px
       * @param {Event} event The scroll event
       */
      onScroll: function onScroll(scrollOffset /* , event */) {
        this.set('currentScrollOffset', scrollOffset);
        this.sendAction.apply(this, ['onScroll'].concat(_slice.call(arguments)));
      },

      /**
       * onScrolledToBottom action - sent when user scrolls to the bottom
       *
       * @event onScrolledToBottom
       */
      onScrolledToBottom: function onScrolledToBottom() {
        this.sendAction('onScrolledToBottom');
      }
    }
  });
});