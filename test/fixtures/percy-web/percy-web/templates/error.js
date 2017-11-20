define("percy-web/templates/error", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "oRCRrGe0", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"page-title\",[\"Error\"],null],false],[0,\"\\n\"],[1,[18,\"fixed-top-header\"],false],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"container container--fixedWidth container--forContent\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"eq\",[[20,[\"model\",\"errors\",\"firstObject\",\"status\"]],\"forbidden\"],null]],null,{\"statements\":[[0,\"    \"],[6,\"h2\"],[7],[0,\"Forbidden\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"You do not have access to this resource or the resource does not exist in Percy. Feel free to \"],[6,\"a\"],[9,\"href\",\"mailto:hello@percy.io\"],[3,\"action\",[[19,0,[]],\"showSupport\"]],[7],[0,\"contact us\"],[8],[0,\" if you believe you have reached this in error.\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[6,\"strong\"],[7],[0,\"An administrator can send you an invite to join this organization.\"],[8],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[25,\"eq\",[[20,[\"model\",\"errors\",\"firstObject\",\"status\"]],\"not_found\"],null]],null,{\"statements\":[[0,\"    \"],[6,\"h2\"],[7],[0,\"Not Found\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"This resource was not found in Percy.\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"Feel free to \"],[6,\"a\"],[9,\"href\",\"mailto:hello@percy.io\"],[3,\"action\",[[19,0,[]],\"showSupport\"]],[7],[0,\"contact us\"],[8],[0,\" if you believe you have reached this in error.\"],[8],[0,\"\\n    \"],[6,\"hr\"],[7],[8],[0,\"\\n    \"],[6,\"strong\"],[7],[0,\"Error details:\"],[8],[0,\"\\n    \"],[6,\"pre\"],[9,\"class\",\"u-text-small\"],[7],[1,[20,[\"model\",\"message\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"h2\"],[7],[0,\"Error\"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"\\n      Something went wrong, sorry! This error has been reported and we will look into it.\\n    \"],[8],[0,\"\\n    \"],[6,\"p\"],[7],[0,\"\\n      Feel free to \"],[6,\"a\"],[9,\"href\",\"mailto:hello@percy.io\"],[3,\"action\",[[19,0,[]],\"showSupport\"]],[7],[0,\"contact us\"],[8],[0,\" if you believe you have reached this in error.\\n    \"],[8],[0,\"\\n    \"],[6,\"hr\"],[7],[8],[0,\"\\n    \"],[6,\"strong\"],[7],[0,\"Error details:\"],[8],[0,\"\\n    \"],[6,\"pre\"],[9,\"class\",\"u-text-small\"],[7],[1,[20,[\"model\",\"message\"]],false],[8],[0,\"\\n  \"]],\"parameters\":[]}]],\"parameters\":[]}],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/error.hbs" } });
});