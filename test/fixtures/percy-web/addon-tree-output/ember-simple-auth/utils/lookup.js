define("ember-simple-auth/utils/lookup", ["exports"], function (exports) {
  exports["default"] = function (instance, factoryName) {
    if (instance.lookup) {
      return instance.lookup(factoryName);
    } else {
      return instance.container.lookup(factoryName);
    }
  };
});