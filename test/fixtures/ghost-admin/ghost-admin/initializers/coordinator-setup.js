define("ghost-admin/initializers/coordinator-setup", ["exports", "ghost-admin/models/coordinator"], function (exports, _coordinator) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "setup coordinator",

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];
      app.register("drag:coordinator", _coordinator.default);
      app.inject("component", "coordinator", "drag:coordinator");
    }
  };
});