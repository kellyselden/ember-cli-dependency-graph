define('ember-cli-page-object/macros', ['exports', 'ember-cli-page-object/-private/properties/alias', 'ember-cli-page-object/-private/properties/getter'], function (exports, _emberCliPageObjectPrivatePropertiesAlias, _emberCliPageObjectPrivatePropertiesGetter) {
  Object.defineProperty(exports, 'alias', {
    enumerable: true,
    get: function get() {
      return _emberCliPageObjectPrivatePropertiesAlias.alias;
    }
  });
  Object.defineProperty(exports, 'getter', {
    enumerable: true,
    get: function get() {
      return _emberCliPageObjectPrivatePropertiesGetter.getter;
    }
  });
});