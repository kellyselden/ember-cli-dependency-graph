define("ember-simple-auth/utils/inject", ["exports"], function (exports) {
  exports["default"] = function (registry, factoryNameOrType, property, injectionName) {
    var inject = registry.inject || registry.injection;
    inject.call(registry, factoryNameOrType, property, injectionName);
  };
});