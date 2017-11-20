define('ember-light-table/-private/global-options', ['exports', 'ember', 'ember-get-config'], function (exports, _ember, _emberGetConfig) {
  exports.mergeOptionsWithGlobals = mergeOptionsWithGlobals;

  var assign = _ember['default'].assign || _ember['default'].merge;
  var globalOptions = _emberGetConfig['default']['ember-light-table'] || {};

  exports['default'] = globalOptions;

  function mergeOptionsWithGlobals(options) {
    return assign(assign({}, globalOptions), options);
  }
});