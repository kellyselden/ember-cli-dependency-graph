define("percy-web/templates/components/project-container", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "0CMk69JW", "block": "{\"symbols\":[\"build\"],\"statements\":[[6,\"div\"],[9,\"class\",\"container container--fixedWidth\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"container container--forContent ProjectContainer\"],[7],[0,\"\\n    \"],[6,\"a\"],[9,\"href\",\"#\"],[9,\"class\",\"Button Button--withLeftIcon u-pull-right\"],[3,\"action\",[[19,0,[]],\"refresh\"]],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"isRefreshing\"]]],null,{\"statements\":[[0,\"        \"],[1,[25,\"fa-icon\",[\"refresh\"],[[\"classNames\"],[\"fa--left fa-spin\"]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"        \"],[1,[25,\"fa-icon\",[\"refresh\"],[[\"classNames\"],[\"fa--left\"]]],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"      Refresh\\n    \"],[8],[0,\"\\n\"],[4,\"link-to\",[\"organization.project.settings\",[20,[\"project\",\"organization\",\"slug\"]],[20,[\"project\",\"slug\"]]],[[\"classNames\"],[\"Button  u-pull-right\"]],{\"statements\":[[0,\"      Settings\\n\"]],\"parameters\":[]},null],[0,\"    \"],[6,\"header\"],[7],[0,\"\\n      \"],[6,\"h3\"],[7],[0,\"\\n        \"],[1,[20,[\"project\",\"name\"]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"project\",\"isDisabled\"]]],null,{\"statements\":[[0,\"          \"],[6,\"span\"],[9,\"class\",\"ProjectContainer-state\"],[7],[0,\"(disabled)\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"      \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"project\",\"organization\",\"isGithubIntegrated\"]]],null,{\"statements\":[[4,\"if\",[[20,[\"project\",\"repo\"]]],null,{\"statements\":[[0,\"          Linked to \"],[6,\"a\"],[10,\"href\",[26,[[20,[\"project\",\"repo\",\"htmlUrl\"]]]]],[7],[1,[20,[\"project\",\"repo\",\"slug\"]],false],[8],[0,\" \"],[1,[25,\"fa-icon\",[\"github\"],null],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"    \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"project\",\"builds\",\"isPending\"]]],null,{\"statements\":[[0,\"      \"],[1,[18,\"loading-page\"],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"project\",\"builds\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[7],[0,\"\\n\"],[4,\"each\",[[20,[\"project\",\"builds\"]]],null,{\"statements\":[[0,\"            \"],[1,[25,\"build-card\",null,[[\"build\"],[[19,1,[]]]]],false],[0,\"\\n\"]],\"parameters\":[1]},null],[0,\"        \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[20,[\"project\",\"isEnabled\"]]],null,{\"statements\":[[0,\"          \"],[6,\"div\"],[9,\"class\",\"Alert Alert--warning\"],[7],[0,\"\\n            \"],[6,\"strong\"],[7],[0,\"Waiting for first snapshot:\"],[8],[0,\" complete setup below to generate first snapshot.\\n          \"],[8],[0,\"\\n          \"],[6,\"h5\"],[7],[0,\"Getting started\"],[8],[0,\"\\n          \"],[6,\"p\"],[7],[0,\"Here's an overview of how to get started:\"],[8],[0,\"\\n\\n          \"],[6,\"ol\"],[7],[0,\"\\n          \"],[6,\"li\"],[7],[0,\"Set \"],[6,\"code\"],[7],[0,\"PERCY_TOKEN\"],[8],[0,\" and \"],[6,\"code\"],[7],[0,\"PERCY_PROJECT\"],[8],[0,\" environment variables in your CI environment.\"],[8],[0,\"\\n          \"],[6,\"li\"],[7],[0,\"Integrate Percy's client library to take snapshots in your test suite.\"],[8],[0,\"\\n          \"],[6,\"li\"],[7],[0,\"Run your tests in CI or create a GitHub PR.\"],[8],[0,\"\\n          \"],[8],[0,\"\\n\\n          \"],[6,\"p\"],[7],[0,\"\\n            \"],[4,\"link-to\",[\"docs.index\"],[[\"class\"],[\"Button\"]],{\"statements\":[[0,\"View setup documentation\"]],\"parameters\":[]},null],[0,\"\\n          \"],[8],[0,\"\\n\\n          \"],[6,\"h5\"],[7],[0,\"Environment variables\"],[8],[0,\"\\n          \"],[1,[25,\"projects/env-vars\",null,[[\"project\"],[[20,[\"project\"]]]]],false],[0,\"\\n\\n          \"],[6,\"h5\"],[7],[0,\"Just want to see a demo?\"],[8],[0,\"\\n          \"],[6,\"p\"],[7],[0,\"\\n            \"],[1,[25,\"quickstart-button\",null,[[\"showQuickstart\"],[[20,[\"showQuickstart\"]]]]],false],[0,\"\\n          \"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"showQuickstart\"]]],null,{\"statements\":[[0,\"            \"],[1,[25,\"projects/quickstart-code\",null,[[\"project\"],[[20,[\"project\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"p\"],[7],[0,\"No builds yet, and this project is disabled.\"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]}]],\"parameters\":[]}],[0,\"  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/components/project-container.hbs" } });
});