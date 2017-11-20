define('ember-light-table/components/lt-spanned-row', ['exports', 'ember', 'ember-light-table/templates/components/lt-spanned-row'], function (exports, _ember, _emberLightTableTemplatesComponentsLtSpannedRow) {
  var Component = _ember['default'].Component;
  exports['default'] = Component.extend({
    layout: _emberLightTableTemplatesComponentsLtSpannedRow['default'],
    colspan: 1,
    tagName: '',
    visible: true
  });
});