define('code-corps-ember/services/page-title-list', ['exports', 'ember-page-title/services/page-title-list', 'code-corps-ember/config/environment'], function (exports, _pageTitleList, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  function capitalize(key) {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  var defaults = {};
  ['separator', 'prepend', 'replace'].forEach(function (key) {
    if (_environment.default.pageTitle && _environment.default.pageTitle[key]) {
      defaults['default' + capitalize(key)] = _environment.default.pageTitle[key];
    }
  });

  exports.default = _pageTitleList.default.extend(defaults);
});