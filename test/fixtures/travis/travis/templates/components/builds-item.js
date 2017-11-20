define("travis/templates/components/builds-item", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "Wk2hCtXv", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[9,\"class\",\"two-line fade-out\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row-item build-info\"],[7],[0,\"\\n    \"],[6,\"h2\"],[10,\"class\",[26,[\"row-branch \",[20,[\"build\",\"state\"]]]]],[7],[0,\"\\n      \"],[1,[25,\"status-icon\",null,[[\"status\"],[[19,0,[\"build\",\"state\"]]]]],false],[0,\"\\n\"],[4,\"if\",[[19,0,[\"build\",\"isPullRequest\"]]],null,{\"statements\":[[4,\"link-to\",[\"build\",[19,0,[\"build\",\"repo\"]],[19,0,[\"build\"]]],[[\"title\"],[[25,\"concat\",[\"PR #\",[19,0,[\"build\",\"pullRequestNumber\"]],\" \",[19,0,[\"build\",\"pullRequestTitle\"]]],null]]],{\"statements\":[[0,\"          \"],[6,\"small\"],[7],[0,\"PR #\"],[1,[20,[\"build\",\"pullRequestNumber\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},{\"statements\":[[4,\"if\",[[19,0,[\"build\",\"isTag\"]]],null,{\"statements\":[[4,\"link-to\",[\"build\",[19,0,[\"build\",\"repo\"]],[19,0,[\"build\"]]],[[\"title\"],[[19,0,[\"build\",\"tag\",\"name\"]]]],{\"statements\":[[0,\"            \"],[1,[20,[\"build\",\"tag\",\"name\"]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},{\"statements\":[[4,\"link-to\",[\"build\",[19,0,[\"build\",\"repo\"]],[19,0,[\"build\"]]],[[\"title\"],[[19,0,[\"build\",\"branchName\"]]]],{\"statements\":[[0,\"            \"],[1,[20,[\"build\",\"branchName\"]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n\"],[4,\"if\",[[19,0,[\"build\",\"isPullRequest\"]]],null,{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"row-message\"],[7],[0,\"\\n        \"],[1,[25,\"format-message\",[[19,0,[\"build\",\"pullRequestTitle\"]]],[[\"short\",\"repo\"],[\"true\",[19,0,[\"build\",\"repo\"]]]]],true],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"      \"],[6,\"div\"],[9,\"class\",\"row-message\"],[7],[0,\"\\n        \"],[1,[25,\"format-message\",[[19,0,[\"build\",\"commit\",\"message\"]]],[[\"short\",\"repo\",\"eventType\"],[\"true\",[19,0,[\"build\",\"repo\"]],[19,0,[\"build\",\"eventType\"]]]]],true],[0,\"\\n      \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row-item row-committer\"],[7],[0,\"\\n    \"],[1,[25,\"user-avatar\",null,[[\"url\",\"name\",\"small\",\"size\"],[[19,0,[\"build\",\"commit\",\"authorAvatarUrl\"]],[19,0,[\"build\",\"commit\",\"authorName\"]],true,18]]],false],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"label-align\"],[7],[1,[20,[\"build\",\"commit\",\"authorName\"]],false],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"two-line\"],[7],[0,\"\\n  \"],[6,\"h3\"],[10,\"class\",[26,[\"row-item request \",[20,[\"build\",\"state\"]]]]],[7],[0,\"\\n\"],[4,\"if\",[[19,0,[\"build\",\"id\"]]],null,{\"statements\":[[4,\"link-to\",[\"build\",[19,0,[\"build\",\"repo\"]],[19,0,[\"build\"]]],[[\"class\"],[\"inner-underline\"]],{\"statements\":[[4,\"if\",[[19,0,[\"build\",\"isTag\"]]],null,{\"statements\":[[0,\"          \"],[1,[25,\"svg-jar\",[\"icon-tag\"],[[\"class\"],[[25,\"concat\",[[19,0,[\"build\",\"state\"]],\" icon\"],null]]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"          \"],[1,[25,\"request-icon\",null,[[\"event\",\"state\"],[[19,0,[\"build\",\"eventType\"]],[19,0,[\"build\",\"state\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]}],[0,\"        \"],[6,\"span\"],[9,\"class\",\"label-align inner-underline\"],[7],[0,\"#\"],[1,[20,[\"build\",\"number\"]],false],[0,\" \"],[1,[20,[\"build\",\"state\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row-item row-commit\"],[7],[0,\"\\n\"],[4,\"external-link-to\",null,[[\"href\"],[[19,0,[\"urlGithubCommit\"]]]],{\"statements\":[[0,\"      \"],[1,[25,\"tooltip-on-element\",null,[[\"text\"],[\"View commit on GitHub\"]]],false],[0,\"\\n      \"],[1,[25,\"svg-jar\",[\"icon-commit\"],[[\"class\"],[\"icon\"]]],false],[0,\"\\n      \"],[6,\"span\"],[9,\"class\",\"label-align inner-underline\"],[7],[1,[25,\"format-sha\",[[19,0,[\"build\",\"commit\",\"sha\"]]],null],false],[8],[0,\"\\n      \"],[1,[25,\"svg-jar\",[\"icon-external-link\"],[[\"class\"],[\"icon\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"two-line\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row-item row-duration\"],[7],[0,\"\\n    \"],[6,\"div\"],[10,\"title\",[26,[[25,\"format-duration\",[[19,0,[\"build\",\"duration\"]]],null]]]],[7],[0,\"\\n      \"],[1,[25,\"svg-jar\",[\"icon-clock\"],[[\"class\"],[\"icon\"]]],false],[0,\"\\n      \"],[6,\"time\"],[9,\"class\",\"label-align\"],[10,\"datetime\",[26,[\"PT\",[20,[\"build\",\"duration\"]],\"S\"]]],[7],[1,[25,\"format-duration\",[[19,0,[\"build\",\"duration\"]]],null],false],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row-item row-calendar\"],[7],[0,\"\\n    \"],[6,\"div\"],[10,\"title\",[26,[[25,\"pretty-date\",[[19,0,[\"build\",\"formattedFinishedAt\"]]],null]]]],[7],[0,\"\\n      \"],[1,[25,\"svg-jar\",[\"icon-calendar\"],[[\"class\"],[\"icon\"]]],false],[0,\"\\n      \"],[6,\"time\"],[9,\"class\",\"label-align\"],[10,\"datetime\",[20,[\"build\",\"finishedAt\"]],null],[7],[1,[25,\"format-time\",[[19,0,[\"build\",\"finishedAt\"]]],null],false],[8],[0,\"\\n    \"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\\n\"],[6,\"div\"],[9,\"class\",\"two-line actions\"],[7],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row-item actions\"],[7],[0,\"\\n    \"],[1,[25,\"repo-actions\",null,[[\"build\",\"repo\",\"labelless\"],[[19,0,[\"build\"]],[19,0,[\"build\",\"repo\"]],true]]],false],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"row-item\"],[7],[0,\" \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "travis/templates/components/builds-item.hbs" } });
});