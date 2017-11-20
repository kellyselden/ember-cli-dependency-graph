define('ember-i18n/instance-initializers/ember-i18n', ['exports'], function (exports) {
  // As of 4.3.0 using the ember-i18n instance initializer is no longer
  // necessary.
  //
  // This is a no-op initializer to prevent applications that relied on the
  // 'ember-i18n' instance initializer in their own workflow from breaking.
  exports['default'] = {
    name: 'ember-i18n',
    initialize: function initialize() {
      // No-op.
    }
  };
});