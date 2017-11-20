define('ember-light-table/components/cells/base', ['exports', 'ember', 'ember-light-table/templates/components/cells/base', 'ember-light-table/utils/css-styleify'], function (exports, _ember, _emberLightTableTemplatesComponentsCellsBase, _emberLightTableUtilsCssStyleify) {
  var Component = _ember['default'].Component;
  var computed = _ember['default'].computed;

  /**
   * @module Light Table
   * @submodule Cell Types
   */

  /**
   * @module Cell Types
   * @class Base Cell
   */

  var Cell = Component.extend({
    layout: _emberLightTableTemplatesComponentsCellsBase['default'],
    tagName: 'td',
    classNames: ['lt-cell'],
    attributeBindings: ['style'],
    classNameBindings: ['align', 'isSorted', 'column.cellClassNames'],

    isSorted: computed.readOnly('column.sorted'),

    style: computed('column.width', function () {
      return (0, _emberLightTableUtilsCssStyleify['default'])(this.get('column').getProperties(['width']));
    }),

    align: computed('column.align', function () {
      return 'align-' + this.get('column.align');
    }),

    /**
     * @property table
     * @type {Table}
     */
    table: null,

    /**
     * @property column
     * @type {Column}
     */
    column: null,

    /**
     * @property row
     * @type {Row}
     */
    row: null,

    /**
     * @property tableActions
     * @type {Object}
     */
    tableActions: null,

    /**
     * @property rawValue
     * @type {Mixed}
     */
    rawValue: null,

    /**
     * @property value
     * @type {Mixed}
     */
    value: computed('rawValue', function () {
      var rawValue = this.get('rawValue');
      var format = this.get('column.format');

      if (format && typeof format === 'function') {
        return format.call(this, rawValue);
      }
      return rawValue;
    })
  });

  Cell.reopenClass({
    positionalParams: ['column', 'row']
  });

  exports['default'] = Cell;
});