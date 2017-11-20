define("percy-web/templates/components/comparison-switcher", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Idp0hrPR", "block": "{\"symbols\":[\"width\"],\"statements\":[[4,\"if\",[[20,[\"isMultiColumnMode\"]]],null,{\"statements\":[[0,\"  \"],[1,[25,\"comparison-switcher-item\",null,[[\"selectedWidth\",\"width\",\"comparisons\"],[[20,[\"selectedWidth\"]],[20,[\"selectedWidth\"]],[20,[\"comparisons\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"each\",[[20,[\"buildWidths\"]]],null,{\"statements\":[[0,\"    \"],[1,[25,\"comparison-switcher-item\",null,[[\"selectedWidth\",\"width\",\"comparisons\",\"updateSelectedWidth\"],[[20,[\"selectedWidth\"]],[19,1,[]],[20,[\"comparisons\"]],[25,\"action\",[[19,0,[]],\"updateSelectedWidth\"],null]]]],false],[0,\"\\n\"]],\"parameters\":[1]},null]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/components/comparison-switcher.hbs" } });
});