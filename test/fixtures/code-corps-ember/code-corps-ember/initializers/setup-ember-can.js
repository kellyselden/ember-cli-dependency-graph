define('code-corps-ember/initializers/setup-ember-can', ['exports', 'require'], function (exports, _require2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var Resolver;

  // This is a bit of a hack, but there is no way to detect
  // which module is needed via normal `import` statements
  /* globals requirejs */
  if (requirejs.entries['ember-resolver'] || requirejs.entries['ember-resolver/index']) {
    // ember-resolver is provided when the consuming
    // application uses ember-resolver@^2.0.0 from NPM
    Resolver = (0, _require2.default)('ember-resolver')['default'];
  } else {
    // ember/resolver is provided when the consuming
    // application uses ember-resolver@^0.1.x from Bower
    Resolver = (0, _require2.default)('ember/resolver')['default'];
  }

  Resolver.reopen({
    pluralizedTypes: {
      ability: 'abilities'
    }
  });

  exports.default = {
    name: 'setup-ember-can',
    initialize: function initialize(application) {
      // make sure we create new ability instances each time, otherwise we stomp on each other's models
      if (application.optionsForType) {
        // it's a container / registry in 1.13.x
        application.optionsForType('ability', { singleton: false });
      } else {
        // Ember 2.0.x
        application.registerOptionsForType('ability', { singleton: false });
      }
    }
  };
});