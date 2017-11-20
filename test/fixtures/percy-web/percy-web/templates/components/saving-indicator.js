define("percy-web/templates/components/saving-indicator", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "MHBmmFtO", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"isSaving\"]]],null,{\"statements\":[[0,\"  \"],[1,[25,\"fa-icon\",[\"fa-spinner fa-pulse\"],null],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"isSaveSuccessful\"]]],null,{\"statements\":[[0,\"  \"],[1,[25,\"fa-icon\",[\"check-circle\"],null],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"eq\",[[20,[\"isSaveSuccessful\"]],false],null]],null,{\"statements\":[[0,\"  \"],[1,[25,\"fa-icon\",[\"times-circle\"],null],false],[0,\" \"],[6,\"strong\"],[7],[0,\"Failed!\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/components/saving-indicator.hbs" } });
});