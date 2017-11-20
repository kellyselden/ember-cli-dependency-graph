define('ember-light-table/components/lt-row', ['exports', 'ember', 'ember-light-table/templates/components/lt-row'], function (exports, _ember, _emberLightTableTemplatesComponentsLtRow) {
  var Component = _ember['default'].Component;
  var computed = _ember['default'].computed;

  var Row = Component.extend({
    layout: _emberLightTableTemplatesComponentsLtRow['default'],
    tagName: 'tr',
    classNames: ['lt-row'],
    classNameBindings: ['isSelected', 'isExpanded', 'canExpand:is-expandable', 'canSelect:is-selectable', 'row.classNames'],
    attributeBindings: ['colspan'],

    columns: null,
    row: null,
    tableActions: null,
    canExpand: false,
    canSelect: false,
    colspan: 1,

    isSelected: computed.readOnly('row.selected'),
    isExpanded: computed.readOnly('row.expanded')
  });

  Row.reopenClass({
    positionalParams: ['row', 'columns']
  });

  exports['default'] = Row;
});