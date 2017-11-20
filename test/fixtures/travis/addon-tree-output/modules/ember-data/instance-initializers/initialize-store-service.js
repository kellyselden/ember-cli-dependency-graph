define('ember-data/instance-initializers/initialize-store-service', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = initializeStoreService;


  var deprecateOldEmberDataInitializers = void 0;

  /*
    Configures a registry for use with an Ember-Data
    store.
  
    @method initializeStoreService
    @param {Ember.ApplicationInstance | Ember.EngineInstance} instance
  */
  function initializeStoreService(instance) {
    // instance.lookup supports Ember 2.1 and higher
    // instance.container supports Ember 1.11 - 2.0
    var container = instance.lookup ? instance : instance.container;

    // Eagerly generate the store so defaultStore is populated.
    container.lookup('service:store');

    if (true) {
      // In Ember 2.4+ instance.base is the `Ember.Application` or `Ember.Engine` instance
      // In Ember 1.11 - 2.3 we fallback to `instance.application`
      var base = instance.base || instance.application;
      deprecateOldEmberDataInitializers(base.constructor.initializers);
    }
  }

  if (true) {
    var DEPRECATED_INITIALIZER_NAMES = ['data-adapter', 'injectStore', 'transforms', 'store'];

    var matchesDeprecatedInititalizer = function matchesDeprecatedInititalizer(name) {
      return DEPRECATED_INITIALIZER_NAMES.indexOf(name) !== -1;
    };

    var warnForDeprecatedInitializers = function warnForDeprecatedInitializers(initializer) {
      var deprecatedBeforeInitializer = matchesDeprecatedInititalizer(initializer.before);
      var deprecatedAfterInitializer = matchesDeprecatedInititalizer(initializer.after);
      var deprecatedProp = deprecatedBeforeInitializer ? 'before' : 'after';

      (true && !(!(deprecatedBeforeInitializer || deprecatedAfterInitializer)) && Ember.deprecate('The initializer `' + initializer[deprecatedProp] + '` has been deprecated. Please update your `' + initializer.name + '` initializer to use use `' + deprecatedProp + ': \'ember-data\'` instead.', !(deprecatedBeforeInitializer || deprecatedAfterInitializer), {
        id: 'ds.deprecated-initializers',
        until: '3.0.0'
      }));
    };

    deprecateOldEmberDataInitializers = function deprecateOldEmberDataInitializers(initializers) {
      // collect all of the initializers
      var keys = Object.keys(initializers);

      for (var i = 0; i < keys.length; i++) {
        var name = keys[i];

        // filter out all of the Ember Data initializer. We have some
        // deprecated initializers that depend on other deprecated
        // initializers which may trigger the deprecation warning
        // unintentionally.
        if (!matchesDeprecatedInititalizer(name)) {
          warnForDeprecatedInitializers(initializers[name]);
        }
      }
    };
  }
});