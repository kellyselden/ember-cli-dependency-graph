define('package-hint-historic-resolver/adapters/application', ['exports', 'ember-data', 'package-hint-historic-resolver/config/environment'], function (exports, _emberData, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var JSONAPIAdapter = _emberData.default.JSONAPIAdapter;
  var _config$APP = _environment.default.APP,
      host = _config$APP.host,
      namespace = _config$APP.namespace;
  exports.default = JSONAPIAdapter.extend({
    host: host,
    namespace: namespace
  });
});