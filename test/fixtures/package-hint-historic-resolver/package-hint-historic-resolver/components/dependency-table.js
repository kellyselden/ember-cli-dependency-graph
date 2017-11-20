define('package-hint-historic-resolver/components/dependency-table', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var readOnly = Ember.computed.readOnly;
  exports.default = Component.extend({
    title: readOnly('dependencyGroup.title'),
    dependencies: readOnly('dependencyGroup.dependencies')
  });
});