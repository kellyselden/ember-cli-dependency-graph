define("travis/templates/builds", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "t1s7Kps1", "block": "{\"symbols\":[\"build\"],\"statements\":[[4,\"if\",[[19,0,[\"model\",\"isLoaded\"]]],null,{\"statements\":[[0,\"  \"],[6,\"ul\"],[9,\"class\",\"build-list\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"builds\"]]],null,{\"statements\":[[0,\"      \"],[1,[25,\"builds-item\",null,[[\"build\"],[[19,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"      \"],[1,[18,\"no-builds\"],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"  \"],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"displayShowMoreButton\"]]],null,{\"statements\":[[0,\"    \"],[6,\"p\"],[7],[0,\"\\n      \"],[1,[25,\"show-more-button\",null,[[\"isLoading\",\"showMore\"],[[19,0,[\"isLoading\"]],[25,\"action\",[[19,0,[]],\"showMoreBuilds\"],null]]]],false],[0,\"\\n\"],[4,\"if\",[[19,0,[\"model\",\"isLoading\"]]],null,{\"statements\":[[0,\"        \"],[1,[18,\"loading-indicator\"],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"  \"],[1,[18,\"loading-indicator\"],false],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "travis/templates/builds.hbs" } });
});