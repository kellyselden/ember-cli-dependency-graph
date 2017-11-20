define("travis/templates/dashboard/repositories", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "6gq+Bm5K", "block": "{\"symbols\":[\"repo\",\"repo\"],\"statements\":[[6,\"div\"],[9,\"class\",\"dashboard-repos\"],[7],[0,\"\\n  \"],[6,\"section\"],[9,\"class\",\"dashboard-section dashboard-starred\"],[7],[0,\"\\n    \"],[6,\"h2\"],[9,\"class\",\"small-title\"],[7],[0,\"Starred repositories\"],[8],[0,\"\\n    \"],[6,\"ul\"],[9,\"class\",\"repo-list\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"starredRepos\"]]],null,{\"statements\":[[0,\"        \"],[1,[25,\"dashboard-row\",null,[[\"repo\",\"star\",\"unstar\"],[[19,2,[]],[19,0,[\"star\"]],[19,0,[\"unstar\"]]]]],false],[0,\"\\n\"]],\"parameters\":[2]},{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"starred-empty\"],[7],[0,\"\\n          \"],[1,[25,\"svg-jar\",[\"icon-star\"],[[\"class\"],[\"icon--m\"]]],false],[0,\" You can keep track of your favorite repositories here once you start starring!\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n  \"],[6,\"section\"],[9,\"class\",\"dashboard-section dashboard-active\"],[7],[0,\"\\n    \"],[6,\"h2\"],[9,\"class\",\"small-title\"],[7],[0,\"All active repositories\"],[8],[0,\"\\n    \"],[6,\"ul\"],[9,\"class\",\"repo-list\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"filteredRepos\"]]],null,{\"statements\":[[0,\"        \"],[1,[25,\"dashboard-row\",null,[[\"repo\",\"star\",\"unstar\"],[[19,1,[]],[19,0,[\"star\"]],[19,0,[\"unstar\"]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},{\"statements\":[[0,\"        \"],[1,[18,\"no-repos\"],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n\\n    \"],[1,[25,\"pagination-navigation\",null,[[\"collection\",\"route\"],[[19,0,[\"model\",\"repos\"]],\"dashboard.repositories\"]]],false],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "travis/templates/dashboard/repositories.hbs" } });
});