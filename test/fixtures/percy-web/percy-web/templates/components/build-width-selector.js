define("percy-web/templates/components/build-width-selector", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "i8nXdgmL", "block": "{\"symbols\":[\"width\"],\"statements\":[[6,\"select\"],[10,\"onChange\",[25,\"action\",[[19,0,[]],\"updateSelectedWidth\"],[[\"value\"],[\"target.value\"]]],null],[7],[0,\"\\n  \"],[6,\"option\"],[10,\"selected\",[18,\"noWidthSelected\"],null],[9,\"value\",\"select-width\"],[7],[0,\"Select width\"],[8],[0,\"\\n\"],[4,\"each\",[[20,[\"widths\"]]],null,{\"statements\":[[0,\"    \"],[6,\"option\"],[10,\"value\",[19,1,[]],null],[10,\"selected\",[25,\"if\",[[25,\"eq\",[[20,[\"selectedWidth\"]],[19,1,[]]],null],\"selected\"],null],null],[7],[1,[19,1,[]],false],[0,\"px\"],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/components/build-width-selector.hbs" } });
});