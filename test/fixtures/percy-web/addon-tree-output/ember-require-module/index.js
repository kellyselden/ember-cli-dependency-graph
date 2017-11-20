define('ember-require-module/index', ['exports'], function (exports) {
  exports['default'] = requireModule;
  /* globals requirejs, require */

  function requireModule(module) {
    var exportName = arguments.length <= 1 || arguments[1] === undefined ? 'default' : arguments[1];

    var rjs = requirejs;

    if (rjs.has && rjs.has(module) || !rjs.has && (rjs.entries[module] || rjs.entries[module + '/index'])) {
      return require(module)[exportName];
    }
  }
});