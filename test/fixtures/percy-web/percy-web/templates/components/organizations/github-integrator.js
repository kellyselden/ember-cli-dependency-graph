define("percy-web/templates/components/organizations/github-integrator", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "oAtgbs0/", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"currentIntegration\"]]],null,{\"statements\":[[0,\"  \"],[1,[25,\"organizations/github-integration\",null,[[\"organization\"],[[20,[\"organization\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"organization\",\"githubIntegrationRequest\"]]],null,{\"statements\":[[0,\"    \"],[1,[25,\"organizations/github-integration\",null,[[\"organization\",\"cancelIntegrationRequest\"],[[20,[\"organization\"]],\"cancelIntegrationRequest\"]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"p\"],[7],[0,\"\\n      \"],[6,\"a\"],[10,\"href\",[26,[[18,\"githubIntegrationUrl\"]]]],[9,\"class\",\"Button Button--primary Button--withLeftIcon\"],[9,\"target\",\"_blank\"],[3,\"action\",[[19,0,[]],\"triggerInstallation\"]],[7],[0,\"\\n        \"],[1,[25,\"fa-icon\",[\"github\"],[[\"classNames\"],[\"fa--left\"]]],false],[0,\"\\n        Install GitHub Integration\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"\\n      \"],[6,\"strong\"],[7],[0,\"Tip:\"],[8],[0,\" GitHub requires that you have the \\\"owner\\\" role in an organization to add integrations.\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/components/organizations/github-integrator.hbs" } });
});