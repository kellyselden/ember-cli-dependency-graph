define('ember-light-table/components/lt-scrollable', ['exports', 'ember', 'ember-light-table/templates/components/lt-scrollable'], function (exports, _ember, _emberLightTableTemplatesComponentsLtScrollable) {
  var Component = _ember['default'].Component;
  exports['default'] = Component.extend({
    layout: _emberLightTableTemplatesComponentsLtScrollable['default'],
    tagName: '',
    vertical: true,
    horizontal: false
  });
});