define('percy-web/initializers/ember-data-factory-guy', ['exports', 'ember-data-factory-guy/utils/manual-setup'], function (exports, _manualSetup) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data-factory-guy',
    after: 'ember-data',

    initialize: function initialize(application) {
      if (arguments.length > 1) {
        application = arguments[1];
      }
      var container = application.__container__;
      if (container) {
        // in fastboot container is null
        (0, _manualSetup.default)(container);
      }
    }
  };
});