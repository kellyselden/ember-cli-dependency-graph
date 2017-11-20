define("travis/templates/components/limit-concurrent-builds", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "m/+W0UHE", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"travis-switch\",null,[[\"active\",\"description\",\"action\"],[[19,0,[\"enabled\"]],[19,0,[\"description\"]],[25,\"perform\",[[19,0,[\"toggle\"]]],null]]]],false],[0,\"\\n\"],[6,\"a\"],[9,\"href\",\"https://docs.travis-ci.com/user/customizing-the-build/#Limiting-Concurrent-Jobs\"],[9,\"title\",\"about the concurrency setting\"],[7],[0,\"\\n  \"],[1,[25,\"tooltip-on-element\",null,[[\"text\"],[\"Read more about concurrent jobs\"]]],false],[0,\"\\n  \"],[1,[25,\"svg-jar\",[\"icon-help\"],[[\"class\"],[\"icon-help\"]]],false],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"enabled\"]]],null,{\"statements\":[[0,\"  \"],[6,\"input\"],[10,\"value\",[18,\"value\"],null],[10,\"onchange\",[25,\"action\",[[19,0,[]],[19,0,[\"limitChanged\"]]],[[\"value\"],[\"target.value\"]]],null],[9,\"pattern\",\"/^[0-9]+$/\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[19,0,[\"toggle\",\"isRunning\"]]],null,{\"statements\":[[1,[25,\"loading-indicator\",null,[[\"inline\"],[true]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "travis/templates/components/limit-concurrent-builds.hbs" } });
});