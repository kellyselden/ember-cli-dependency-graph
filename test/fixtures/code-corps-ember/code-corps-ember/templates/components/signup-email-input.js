define("code-corps-ember/templates/components/signup-email-input", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Yx4paBty", "block": "{\"symbols\":[\"error\"],\"statements\":[[1,[25,\"input\",null,[[\"name\",\"autocapitalize\",\"type\",\"placeholder\",\"value\",\"key-down\"],[\"email\",\"off\",\"text\",\"Your email\",[19,0,[\"user\",\"email\"]],\"keyDown\"]]],false],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"suggestions\"],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"canShowValidations\"]]],null,{\"statements\":[[4,\"if\",[[19,0,[\"isOkay\"]]],null,{\"statements\":[[0,\"    \"],[6,\"p\"],[9,\"class\",\"ok\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[19,0,[\"isInvalid\"]]],null,{\"statements\":[[0,\"    \"],[6,\"p\"],[9,\"class\",\"not-ok simple\"],[7],[0,\"\\n      \"],[6,\"ul\"],[7],[0,\"\\n        \"],[6,\"li\"],[7],[0,\"\\n          Please enter a valid email.\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[19,0,[\"isUnavailable\"]]],null,{\"statements\":[[0,\"    \"],[6,\"p\"],[9,\"class\",\"not-ok\"],[7],[0,\"\\n      \"],[6,\"ul\"],[7],[0,\"\\n        \"],[6,\"li\"],[7],[0,\"\\n          This email is already registered. Want to \"],[4,\"link-to\",[\"login\"],null,{\"statements\":[[0,\"login\"]],\"parameters\":[]},null],[0,\"?\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[8],[0,\"\\n\"],[4,\"each\",[[19,0,[\"user\",\"errors\",\"email\"]]],null,{\"statements\":[[0,\"  \"],[6,\"p\"],[9,\"class\",\"error\"],[7],[0,\"Your email \"],[1,[19,1,[\"message\"]],false],[0,\".\"],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "code-corps-ember/templates/components/signup-email-input.hbs" } });
});