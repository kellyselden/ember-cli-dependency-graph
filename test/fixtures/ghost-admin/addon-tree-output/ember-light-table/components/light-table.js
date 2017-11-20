define('ember-light-table/components/light-table', ['exports', 'ember', 'ember-light-table/templates/components/light-table', 'ember-light-table/classes/Table', 'ember-light-table/utils/css-styleify'], function (exports, _ember, _emberLightTableTemplatesComponentsLightTable, _emberLightTableClassesTable, _emberLightTableUtilsCssStyleify) {
  var _slice = Array.prototype.slice;
  var assert = _ember['default'].assert;
  var Component = _ember['default'].Component;
  var computed = _ember['default'].computed;
  var inject = _ember['default'].inject;
  var observer = _ember['default'].observer;
  var on = _ember['default'].on;
  var isNone = _ember['default'].isNone;
  var isEmpty = _ember['default'].isEmpty;
  var emberArray = _ember['default'].A;

  function intersections(array1, array2) {
    return array1.filter(function (n) {
      return array2.indexOf(n) > -1;
    });
  }

  /**
   * @module Light Table
   * @main light-table
   */

  /**
   * ```hbs
   * {{#light-table table as |t|}}
   *   {{t.head}}
   *   {{t.body}}
   *   {{t.foot}}
   * {{/light-table}}
   * ```
   *
   * Please see the documentation for the [Head](../classes/t.head.html), [Body](../classes/t.body.html), and [Foot](../classes/t.foot.html) components
   * for more details on all possible options and actions.
   *
   * @class light-table
   * @main Components
   */

  var LightTable = Component.extend({
    layout: _emberLightTableTemplatesComponentsLightTable['default'],
    classNameBindings: [':ember-light-table'],
    attributeBindings: ['style'],

    media: inject.service(),

    /**
     * @property table
     * @type {Table}
     */
    table: null,

    /**
     * This is used to propate custom user defined actions to custom cell and header components.
     * As an example, lets say I have a table with a column defined with `cellComponent: 'delete-user'`
     *
     * ```hbs
     * {{#light-table table tableActions=(hash
     *   deleteUser=(action 'deleteUser')
     *  ) as |t|}}
     *   {{t.head}}
     *   {{t.body}}
     *   {{t.foot}}
     * {{/light-table}}
     * ```
     *
     * Now in the `delete-user` component, we can access that `deleteUser` action and pass it the
     * row object which will bubble all the way to where you defined that action.
     *
     * ```hbs
     * <button {{action tableActions.deleteUser row}}>Delete Me</button>
     * ```
     *
     *
     * @property tableActions
     * @type {Object}
     */
    tableActions: null,

    /**
     * Table height.
     *
     * @property height
     * @type {String}
     * @default null
     */
    height: null,

    /**
     * Class names that will be added to all <table> tags
     *
     * @property tableClassNames
     * @type {String}
     * @default ''
     */
    tableClassNames: '',

    /**
     * Enable responsive behavior
     *
     * @property responsive
     * @type {Boolean}
     * @default false
     */
    responsive: false,

    /**
     * A hash to determine the number of columns to show per given breakpoint.
     * If this is specified, it will override any column specific breakpoints.
     *
     * If we have the following breakpoints defined in `app/breakpoints.js`:
     *
     * - mobile
     * - tablet
     * - desktop
     *
     * The following hash can be passed in:
     *
     * ```js
     * {
     *  mobile: 2,
     *  tablet: 4
     * }
     * ```
     *
     * If there is no rule specified for a given breakpoint (i.e. `desktop`),
     * all columns will be shown.
     *
     * @property breakpoints
     * @type {Object}
     * @default null
     */
    breakpoints: null,

    /**
     * Table component shared options
     *
     * @property sharedOptions
     * @type {Object}
     * @private
     */
    sharedOptions: computed(function () {
      return {
        height: this.get('height'),
        fixedHeader: false,
        fixedFooter: false
      };
    }).readOnly(),

    visibleColumns: computed.readOnly('table.visibleColumns'),

    /**
     * Calculates the total width of the visible columns via their `width`
     * propert.
     *
     * Returns 0 for the following conditions
     *  - All widths are not set
     *  - Widths are not the same unit
     *  - Unit cannot be determined
     *
     * @property totalWidth
     * @type {Number}
     * @private
     */
    totalWidth: computed('visibleColumns.[]', 'visibleColumns.@each.width', function () {
      var visibleColumns = this.get('visibleColumns');
      var widths = visibleColumns.getEach('width');
      var unit = (widths[0] || '').match(/\D+$/);
      var totalWidth = 0;

      if (isEmpty(unit)) {
        return 0;
      }

      unit = unit[0];

      /*
        1. Check if all widths are present
        2. Check if all widths are the same unit
       */
      for (var i = 0; i < widths.length; i++) {
        var width = widths[i];

        if (isNone(width) || width.indexOf(unit) === -1) {
          return 0;
        }

        totalWidth += parseInt(width, 10);
      }

      return '' + totalWidth + unit;
    }),

    style: computed('totalWidth', 'height', function () {
      var totalWidth = this.get('totalWidth');
      var style = this.getProperties(['height']);

      if (totalWidth) {
        style.width = totalWidth;
        style.overflowX = 'auto';
      }

      return (0, _emberLightTableUtilsCssStyleify['default'])(style);
    }),

    init: function init() {
      this._super.apply(this, arguments);

      var table = this.get('table');
      var media = this.get('media');

      assert('[ember-light-table] table must be an instance of Table', table instanceof _emberLightTableClassesTable['default']);

      if (isNone(media)) {
        this.set('responsive', false);
      }
    },

    onMediaChange: on('init', observer('media.matches.[]', 'table.allColumns.[]', function () {
      var responsive = this.get('responsive');
      var matches = this.get('media.matches');
      var breakpoints = this.get('breakpoints');
      var table = this.get('table');
      var numColumns = 0;

      if (!responsive) {
        return;
      }

      this.send('onBeforeResponsiveChange', matches);

      if (!isNone(breakpoints)) {
        Object.keys(breakpoints).forEach(function (b) {
          if (matches.indexOf(b) > -1) {
            numColumns = Math.max(numColumns, breakpoints[b]);
          }
        });

        this._displayColumns(numColumns);
      } else {
        table.get('allColumns').forEach(function (c) {
          var breakpoints = c.get('breakpoints');
          var isMatch = isEmpty(breakpoints) || intersections(matches, breakpoints).length > 0;
          c.set('responsiveHidden', !isMatch);
        });
      }

      this.send('onAfterResponsiveChange', matches);
    })),

    _displayColumns: function _displayColumns(numColumns) {
      var table = this.get('table');
      var hiddenColumns = table.get('responsiveHiddenColumns');
      var visibleColumns = table.get('visibleColumns');

      if (!numColumns) {
        hiddenColumns.setEach('responsiveHidden', false);
      } else if (visibleColumns.length > numColumns) {
        emberArray(visibleColumns.slice(numColumns, visibleColumns.length)).setEach('responsiveHidden', true);
      } else if (visibleColumns.length < numColumns) {
        emberArray(hiddenColumns.slice(0, numColumns - visibleColumns.length)).setEach('responsiveHidden', false);
      }
    },

    actions: {
      /**
       * onBeforeResponsiveChange action.
       * Called before any column visibility is altered.
       *
       * @event onBeforeResponsiveChange
       * @param  {Array} matches list of matching breakpoints
       */
      onBeforeResponsiveChange: function onBeforeResponsiveChange() /* matches */{
        this.sendAction.apply(this, ['onBeforeResponsiveChange'].concat(_slice.call(arguments)));
      },

      /**
       * onAfterResponsiveChange action.
       * Called after all column visibility has been altered.
       *
       * @event onAfterResponsiveChange
       * @param  {Array} matches list of matching breakpoints
       */
      onAfterResponsiveChange: function onAfterResponsiveChange() /* matches */{
        this.sendAction.apply(this, ['onAfterResponsiveChange'].concat(_slice.call(arguments)));
      }
    }
  });

  LightTable.reopenClass({
    positionalParams: ['table']
  });

  exports['default'] = LightTable;
});