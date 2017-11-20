define("code-corps-ember/templates/components/github-repo", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "fuq0aILb", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[25,\"and\",[[19,0,[\"githubRepo\",\"isLoaded\"]],[25,\"or\",[[19,0,[\"githubRepo\",\"project\",\"isLoaded\"]],[25,\"not\",[[19,0,[\"isConnected\"]]],null]],null]],null]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"github-repo__content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"github-repo__name\"],[9,\"data-test-github-repo-name\",\"\"],[7],[0,\"\\n      \"],[1,[25,\"svg/sprite-icon\",null,[[\"icon\"],[[19,0,[\"repoIcon\"]]]]],false],[0,\" \"],[1,[20,[\"githubRepo\",\"name\"]],false],[0,\"\\n    \"],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"github-repo__actions\"],[9,\"data-test-github-repo-actions\",\"\"],[7],[0,\"\\n\"],[4,\"if\",[[25,\"not\",[[19,0,[\"isConnected\"]]],null]],null,{\"statements\":[[4,\"if\",[[19,0,[\"showSettings\"]]],null,{\"statements\":[[0,\"          \"],[6,\"a\"],[9,\"data-test-close-repo-settings\",\"\"],[7],[0,\"Collapse\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"a\"],[9,\"data-test-open-repo-settings-connect\",\"\"],[7],[0,\"Connect\"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]},null],[4,\"if\",[[25,\"and\",[[19,0,[\"belongsToProject\"]],[19,0,[\"syncComplete\"]]],null]],null,{\"statements\":[[4,\"if\",[[19,0,[\"showSettings\"]]],null,{\"statements\":[[0,\"          \"],[6,\"a\"],[9,\"data-test-close-repo-settings\",\"\"],[7],[0,\"Collapse\"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[6,\"a\"],[9,\"data-test-open-repo-settings-edit\",\"\"],[7],[0,\"Edit settings\"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"parameters\":[]},null],[4,\"if\",[[19,0,[\"belongsToOtherProject\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"data-test-repo-project\",\"\"],[9,\"class\",\"github-repo__project\"],[7],[0,\"\\n          \"],[6,\"span\"],[7],[0,\"Connected to\"],[8],[0,\"\\n          \"],[6,\"span\"],[7],[6,\"img\"],[9,\"class\",\"icon\"],[10,\"src\",[20,[\"githubRepo\",\"project\",\"iconThumbUrl\"]],null],[7],[8],[8],[0,\"\\n          \"],[6,\"span\"],[7],[1,[20,[\"githubRepo\",\"project\",\"title\"]],false],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"showSettings\"]]],null,{\"statements\":[[4,\"if\",[[25,\"and\",[[19,0,[\"belongsToProject\"]],[19,0,[\"syncComplete\"]]],null]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"data-test-callout\",\"\"],[9,\"class\",\"callout callout--danger\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"callout__content\"],[7],[0,\"\\n          \"],[6,\"div\"],[7],[0,\"\\n            \"],[6,\"p\"],[9,\"class\",\"callout__content__title\"],[7],[0,\"\\n              Disconnect from \"],[1,[20,[\"githubRepo\",\"name\"]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"p\"],[9,\"class\",\"callout__content__description\"],[7],[0,\"\\n              Your tasks will no longer sync between your Code Corps project and all your GitHub pull requests, issues, and comments.\\n            \"],[8],[0,\"\\n            \"],[6,\"p\"],[9,\"class\",\"callout__content__description\"],[7],[0,\"\\n              Disconnecting is \"],[6,\"strong\"],[7],[0,\"strongly\"],[8],[0,\" discouraged.\\n            \"],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"\\n              \"],[1,[25,\"github/repo-disconnect-confirm-modal\",null,[[\"disconnect\",\"githubRepo\"],[[25,\"action\",[[19,0,[]],\"disconnectRepo\",[19,0,[\"githubRepo\"]],[19,0,[\"hasProject\"]]],null],[19,0,[\"githubRepo\"]]]]],false],[0,\"\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[25,\"not\",[[19,0,[\"isConnected\"]]],null]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"data-test-callout\",\"\"],[9,\"class\",\"callout\"],[7],[0,\"\\n        \"],[6,\"div\"],[9,\"class\",\"callout__content\"],[7],[0,\"\\n          \"],[6,\"div\"],[7],[0,\"\\n            \"],[6,\"p\"],[9,\"data-test-callout-title\",\"\"],[9,\"class\",\"callout__content__title\"],[7],[0,\"\\n              Connect to \"],[1,[20,[\"githubRepo\",\"name\"]],false],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"p\"],[9,\"class\",\"callout__content__description\"],[7],[0,\"\\n              Your tasks will sync between your Code Corps project and all your GitHub pull requests, issues, and comments.\\n            \"],[8],[0,\"\\n            \"],[6,\"p\"],[7],[0,\"\\n              \"],[6,\"button\"],[9,\"data-test-connect-repo\",\"\"],[9,\"class\",\"default\"],[3,\"action\",[[19,0,[]],\"connectRepo\",[19,0,[\"githubRepo\"]],[19,0,[\"project\"]]]],[7],[0,\"Start syncing\"],[8],[0,\"\\n            \"],[8],[0,\"\\n            \"],[6,\"p\"],[9,\"class\",\"callout__content__description\"],[7],[0,\"\\n              Syncing your repo could take some time. You can connect more repos while you wait.\\n            \"],[8],[0,\"\\n          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[4,\"if\",[[25,\"and\",[[19,0,[\"belongsToProject\"]],[19,0,[\"syncInProgress\"]]],null]],null,{\"statements\":[[0,\"    \"],[1,[25,\"github/repo-sync\",null,[[\"githubRepo\"],[[19,0,[\"githubRepo\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"data-test-loading\",\"\"],[9,\"class\",\"github-repo__content\"],[7],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"loading loading--col-2 loading--left\"],[7],[8],[0,\"\\n    \"],[6,\"div\"],[9,\"class\",\"loading loading--col-1 loading--right\"],[7],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "code-corps-ember/templates/components/github-repo.hbs" } });
});