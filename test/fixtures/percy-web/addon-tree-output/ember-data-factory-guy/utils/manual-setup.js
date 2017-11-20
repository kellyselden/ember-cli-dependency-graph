define('ember-data-factory-guy/utils/manual-setup', ['exports', 'ember-data-factory-guy/factory-guy', 'ember-data-factory-guy/utils/load-factories', 'ember-data-factory-guy/utils/load-scenarios'], function (exports, _factoryGuy, _loadFactories, _loadScenarios) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (ownerOrContainer) {
    var owner = ownerOrContainer.owner || ownerOrContainer;

    _factoryGuy.default.setStore(owner.lookup('service:store'));
    _factoryGuy.default.reset();
    (0, _loadFactories.default)();
    (0, _loadScenarios.default)(owner);
  };
});