define("percy-web/templates/components/projects/env-vars", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "ht0cJH8J", "block": "{\"symbols\":[\"token\"],\"statements\":[[4,\"if\",[[20,[\"project\",\"tokens\",\"isPending\"]]],null,{\"statements\":[[0,\"  \"],[4,\"code-block\",null,null,{\"statements\":[[6,\"em\"],[7],[0,\"Loading...\"],[8]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"with\",[[20,[\"project\",\"writeOnlyToken\",\"token\"]]],null,{\"statements\":[[4,\"code-block\",null,[[\"lang\"],[\"nohighlight\"]],{\"statements\":[[0,\"PERCY_TOKEN=\"],[1,[19,1,[]],false],[0,\"\\nPERCY_PROJECT=\"],[1,[20,[\"project\",\"fullSlug\"]],false]],\"parameters\":[]},null],[0,\"\\n\"]],\"parameters\":[1]},null]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/components/projects/env-vars.hbs" } });
});