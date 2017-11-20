define("code-corps-ember/templates/components/task-details", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "XeUgn1IC", "block": "{\"symbols\":[\"error\"],\"statements\":[[6,\"div\"],[9,\"class\",\"timeline-comment-wrapper task-body\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"avatar-container timeline-comment-avatar\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"slugged-route\",[19,0,[\"task\",\"user\",\"username\"]]],null,{\"statements\":[[0,\"      \"],[6,\"img\"],[9,\"class\",\"icon avatar avatar__parent\"],[10,\"src\",[20,[\"task\",\"user\",\"photoThumbUrl\"]],null],[7],[8],[0,\"\\n\"],[4,\"if\",[[25,\"eq\",[[19,0,[\"task\",\"createdFrom\"]],\"github\"],null]],null,{\"statements\":[[0,\"        \"],[6,\"img\"],[9,\"class\",\"avatar avatar__child\"],[9,\"src\",\"/assets/images/icons/integration-github@2x.png\"],[9,\"height\",\"20\"],[9,\"width\",\"20\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"comment-content-wrapper\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"comment-info\"],[7],[0,\"\\n      \"],[1,[25,\"user-byline\",null,[[\"createdAt\",\"createdFrom\",\"user\"],[[19,0,[\"task\",\"createdAt\"]],[19,0,[\"task\",\"createdFrom\"]],[19,0,[\"task\",\"user\"]]]]],false],[0,\"\\n\"],[4,\"if\",[[19,0,[\"canEdit\"]]],null,{\"statements\":[[0,\"        \"],[6,\"a\"],[9,\"class\",\"edit\"],[3,\"action\",[[19,0,[]],\"editTaskBody\"]],[7],[0,\"edit\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[19,0,[\"task\",\"containsCode\"]]],null,{\"statements\":[[0,\"        \"],[1,[18,\"code-theme-selector\"],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"comment-content\"],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"isEditingBody\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"input-group\"],[7],[0,\"\\n          \"],[1,[25,\"editor-with-preview\",null,[[\"input\",\"isLoading\",\"autofocus\"],[[19,0,[\"task\",\"markdown\"]],[19,0,[\"task\",\"isSaving\"]],true]]],false],[0,\"\\n\"],[4,\"each\",[[19,0,[\"task\",\"errors\",\"markdown\"]]],null,{\"statements\":[[0,\"            \"],[6,\"p\"],[9,\"class\",\"error\"],[7],[1,[19,1,[\"message\"]],false],[8],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"input-group\"],[7],[0,\"\\n          \"],[6,\"button\"],[9,\"class\",\"default small right save\"],[3,\"action\",[[19,0,[]],\"applyEditTask\"]],[7],[0,\"Save\"],[8],[0,\"\\n          \"],[6,\"button\"],[9,\"class\",\"clear small right cancel\"],[3,\"action\",[[19,0,[]],\"cancelEditingTaskBody\"]],[7],[0,\"Cancel\"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"comment-body markdown-body\"],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"taskBodyWithMentions\"]]],null,{\"statements\":[[0,\"            \"],[1,[18,\"taskBodyWithMentions\"],true],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"            \"],[6,\"em\"],[9,\"class\",\"markdown-body--empty\"],[9,\"data-test-markdown-body-empty\",\"\"],[7],[0,\"No description provided.\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "code-corps-ember/templates/components/task-details.hbs" } });
});