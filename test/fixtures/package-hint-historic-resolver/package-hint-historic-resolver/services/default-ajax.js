define('package-hint-historic-resolver/services/default-ajax', ['exports', 'ember-ajax/services/ajax', 'package-hint-historic-resolver/config/environment'], function (exports, _ajax, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _config$APP = _environment.default.APP,
      host = _config$APP.host,
      namespace = _config$APP.namespace;
  exports.default = _ajax.default.extend({
    host: host,
    namespace: namespace
  });
});