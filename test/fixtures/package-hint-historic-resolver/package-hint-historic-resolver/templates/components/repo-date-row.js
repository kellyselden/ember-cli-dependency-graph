define("package-hint-historic-resolver/templates/components/repo-date-row", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "X1V6Wm1o", "block": "{\"symbols\":[],\"statements\":[[6,\"td\"],[9,\"class\",\"title\"],[7],[1,[18,\"title\"],false],[8],[0,\"\\n\"],[6,\"td\"],[7],[0,\"\\n  \"],[1,[25,\"date-time-picker\",[[20,[\"repoDate\"]]],[[\"action\"],[[25,\"action\",[[19,0,[]],[20,[\"changeRepoDate\"]]],null]]]],false],[0,\"\\n\"],[8],[0,\"\\n\"],[6,\"td\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"commitError\"]]],null,{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"commit-error\"],[7],[0,\"Error getting commit: \"],[1,[18,\"commitError\"],false],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"commit\"],[7],[0,\"Latest commit \"],[1,[18,\"commit\"],false],[0,\" on \"],[1,[18,\"commitDate\"],false],[8],[0,\"\\n\"]],\"parameters\":[]}],[4,\"if\",[[20,[\"repoDateError\"]]],null,{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"repo-date-error\"],[7],[0,\"Error getting package.json: \"],[1,[18,\"repoDateError\"],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[8]],\"hasEval\":false}", "meta": { "moduleName": "package-hint-historic-resolver/templates/components/repo-date-row.hbs" } });
});