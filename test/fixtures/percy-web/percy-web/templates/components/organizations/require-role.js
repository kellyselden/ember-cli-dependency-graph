define("percy-web/templates/components/organizations/require-role", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "SavS2jBu", "block": "{\"symbols\":[\"&default\"],\"statements\":[[4,\"if\",[[25,\"eq\",[[20,[\"role\"]],[20,[\"organization\",\"currentUserMembership\",\"role\"]]],null]],null,{\"statements\":[[0,\"  \"],[11,1],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"Alert Alert--error\"],[7],[0,\"\\n    \"],[6,\"strong\"],[7],[0,\"This feature requires organization admin permissions.\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/components/organizations/require-role.hbs" } });
});