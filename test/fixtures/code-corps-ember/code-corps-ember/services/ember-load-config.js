define('code-corps-ember/services/ember-load-config', ['exports', 'ember-load/services/ember-load-config', 'code-corps-ember/config/environment'], function (exports, _emberLoadConfig, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var userConfig = _environment.default['ember-load'] || {};

  exports.default = _emberLoadConfig.default.extend({
    loadingIndicatorClass: userConfig.loadingIndicatorClass
  });
});