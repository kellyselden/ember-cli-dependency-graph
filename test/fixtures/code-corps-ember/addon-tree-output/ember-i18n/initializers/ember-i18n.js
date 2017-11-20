define('ember-i18n/initializers/ember-i18n', ['exports'], function (exports) {
  // As of 4.3.0 using the ember-i18n initializer is no longer necessary.
  //
  // This is a no-op initializer to prevent applications that relied on the
  // 'ember-i18n' initializer in their own workflow from breaking.
  exports['default'] = {
    name: 'ember-i18n',
    initialize: function initialize() {
      // No-op.
    }
  };
});