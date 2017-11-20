define('ghost-admin/adapters/tag', ['exports', 'ghost-admin/adapters/application', 'ghost-admin/mixins/slug-url'], function (exports, _application, _slugUrl) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _application.default.extend(_slugUrl.default);
});