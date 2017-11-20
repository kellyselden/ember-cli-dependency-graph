define("ember-data/-private/system/references/reference", ["exports"], function (exports) {
  var Reference = function Reference(store, internalModel) {
    this.store = store;
    this.internalModel = internalModel;
  };

  Reference.prototype = {
    constructor: Reference
  };

  exports["default"] = Reference;
});