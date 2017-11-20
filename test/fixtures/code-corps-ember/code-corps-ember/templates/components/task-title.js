define("code-corps-ember/templates/components/task-title", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6tgef8uk", "block": "{\"symbols\":[\"error\"],\"statements\":[[4,\"if\",[[19,0,[\"isEditing\"]]],null,{\"statements\":[[0,\"  \"],[1,[25,\"input\",null,[[\"type\",\"value\",\"name\"],[\"text\",[19,0,[\"newTitle\"]],\"title\"]]],false],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"title-actions input-group\"],[7],[0,\"\\n    \"],[6,\"button\"],[9,\"class\",\"default save\"],[3,\"action\",[[19,0,[]],\"applyEdit\"]],[7],[0,\"Save\"],[8],[0,\"\\n    \"],[6,\"button\"],[9,\"class\",\"clear cancel\"],[3,\"action\",[[19,0,[]],\"cancel\"]],[7],[0,\"Cancel\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[4,\"each\",[[19,0,[\"task\",\"errors\",\"title\"]]],null,{\"statements\":[[0,\"    \"],[6,\"p\"],[9,\"class\",\"error\"],[7],[1,[19,1,[\"message\"]],false],[8],[0,\"\\n\"]],\"parameters\":[1]},null]],\"parameters\":[]},{\"statements\":[[0,\"  \"],[6,\"h2\"],[9,\"class\",\"title\"],[7],[1,[20,[\"task\",\"title\"]],false],[0,\" \"],[6,\"span\"],[9,\"class\",\"task-number\"],[7],[0,\"#\"],[1,[20,[\"task\",\"number\"]],false],[8],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"canEdit\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"title-actions\"],[7],[0,\"\\n    \"],[6,\"button\"],[9,\"class\",\"clear right edit\"],[3,\"action\",[[19,0,[]],\"edit\"]],[7],[0,\"Edit Title\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "code-corps-ember/templates/components/task-title.hbs" } });
});