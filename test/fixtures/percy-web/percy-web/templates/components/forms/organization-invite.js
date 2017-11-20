define("percy-web/templates/components/forms/organization-invite", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "R83WBRbN", "block": "{\"symbols\":[],\"statements\":[[6,\"form\"],[9,\"action\",\"javascript:;\"],[7],[0,\"\\n  \"],[1,[25,\"form-fields/textarea\",null,[[\"property\",\"title\",\"changeset\",\"autofocus\",\"validateProperty\"],[\"emails\",\"Email addresses\",[20,[\"changeset\"]],true,[25,\"action\",[[19,0,[]],\"validateProperty\",[20,[\"changeset\"]],\"emails\"],null]]]],false],[0,\"\\n  \"],[6,\"p\"],[7],[0,\"\\n    Separate each email with a space or a new line. Invitations expire after one week.\\n  \"],[8],[0,\"\\n  \"],[1,[25,\"form-fields/checkbox\",null,[[\"property\",\"checkedValue\",\"title\",\"changeset\",\"validateProperty\"],[\"role\",\"admin\",\"Administrator\",[20,[\"changeset\"]],[25,\"action\",[[19,0,[]],\"validateProperty\",[20,[\"changeset\"]],\"role\"],null]]]],false],[0,\"\\n  \"],[6,\"p\"],[7],[0,\"\\n    Allow these people to edit organization details, billing information, and invite new members. All normal members can create and manage projects.\\n  \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"errorMessage\"]]],null,{\"statements\":[[0,\"    \"],[6,\"div\"],[9,\"class\",\"Form-errors\"],[7],[0,\"\\n      \"],[1,[18,\"errorMessage\"],false],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[1,[25,\"form-fields/submit\",null,[[\"value\",\"classes\",\"isSaving\",\"isSaveSuccessful\",\"submit\"],[\"Send Invites\",\"Button Button--primary\",[20,[\"isSaving\"]],[20,[\"isSaveSuccessful\"]],[25,\"action\",[[19,0,[]],\"save\"],null]]]],false],[0,\"\\n\"],[8]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/components/forms/organization-invite.hbs" } });
});