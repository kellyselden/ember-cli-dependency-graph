define("travis/templates/account/repositories", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "hCr0SYrk", "block": "{\"symbols\":[\"repository\"],\"statements\":[[6,\"div\"],[9,\"id\",\"administerable-repositories\"],[7],[0,\"\\n  \"],[6,\"ul\"],[9,\"class\",\"profile-repositorylist\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"sortedRepositories\"]]],null,{\"statements\":[[0,\"      \"],[1,[25,\"repository-status-toggle\",null,[[\"repository\"],[[19,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"      \"],[6,\"li\"],[7],[0,\"Sorry, it seems like we couldn't find any repositories you have access to on GitHub.\"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"sortedRepositories\",\"length\"]]],null,{\"statements\":[[0,\"  \"],[1,[25,\"pagination-navigation\",null,[[\"collection\",\"route\",\"inner\",\"outer\"],[[19,0,[\"model\"]],\"account.repositories\",6,2]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "travis/templates/account/repositories.hbs" } });
});