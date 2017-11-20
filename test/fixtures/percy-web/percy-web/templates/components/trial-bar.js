define("percy-web/templates/components/trial-bar", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "veAmHCwJ", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[20,[\"organization\",\"subscription\",\"isTrialOrFree\"]]],null,{\"statements\":[[4,\"if\",[[20,[\"organization\",\"subscription\",\"plan\",\"isFree\"]]],null,{\"statements\":[[0,\"    \"],[6,\"strong\"],[7],[0,\"Your trial has expired.\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[25,\"eq\",[[20,[\"organization\",\"subscription\",\"trialDaysRemaining\"]],0],null]],null,{\"statements\":[[0,\"      \"],[6,\"strong\"],[7],[0,\"Trial ends today!\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"      \"],[6,\"strong\"],[7],[0,\"\\n        \"],[1,[25,\"pluralize\",[[20,[\"organization\",\"subscription\",\"trialDaysRemaining\"]],\"day\"],null],false],[0,\"\\n      \"],[8],[0,\" left in trial.\\n\"]],\"parameters\":[]}]],\"parameters\":[]}],[4,\"link-to\",[\"organizations.organization.billing\",[20,[\"organization\",\"slug\"]]],[[\"class\"],[\"Button Button--small\"]],{\"statements\":[[0,\"    See plans\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/components/trial-bar.hbs" } });
});