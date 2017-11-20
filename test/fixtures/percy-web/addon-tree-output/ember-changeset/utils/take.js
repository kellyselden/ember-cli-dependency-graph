define("ember-changeset/utils/take", ["exports"], function (exports) {
  exports["default"] = take;

  function take() {
    var originalObj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var keysToTake = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];

    var newObj = {};

    for (var key in originalObj) {
      if (keysToTake.indexOf(key) !== -1) {
        newObj[key] = originalObj[key];
      }
    }

    return newObj;
  }
});