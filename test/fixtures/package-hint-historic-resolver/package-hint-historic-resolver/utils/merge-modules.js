define('package-hint-historic-resolver/utils/merge-modules', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = mergeModules;
  var emberA = Ember.A;
  var EmberObject = Ember.Object;
  var set = Ember.set;
  var get = Ember.get;
  function mergeModules(firstDependencies, secondDependencies) {
    var dependencies = emberA();
    if (firstDependencies && secondDependencies) {
      firstDependencies.forEach(function (dep1) {
        var module = get(dep1, 'module');
        var dep = EmberObject.create({
          module: module,
          firstVersionHint: get(dep1, 'version')
        });
        var dep2 = secondDependencies.filterBy('module', module)[0];
        if (dep2) {
          set(dep, 'secondVersionHint', get(dep2, 'version'));
        }
        dependencies.pushObject(dep);
      });
      secondDependencies.forEach(function (dep2) {
        var module = get(dep2, 'module');
        var dep1 = firstDependencies.filterBy('module', module)[0];
        if (dep1) {
          return;
        }
        dependencies.pushObject(EmberObject.create({
          module: module,
          secondVersionHint: get(dep2, 'version')
        }));
      });
    }
    return dependencies;
  }
});