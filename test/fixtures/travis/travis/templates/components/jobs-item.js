define("travis/templates/components/jobs-item", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "qhv+JRNA", "block": "{\"symbols\":[],\"statements\":[[4,\"link-to\",[\"job\",[19,0,[\"repo\"]],[19,0,[\"job\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[10,\"class\",[26,[\"job-state \",[20,[\"job\",\"state\"]]]]],[7],[0,\"\\n    \"],[1,[25,\"status-icon\",null,[[\"status\"],[[19,0,[\"job\",\"state\"]]]]],false],[0,\"\\n  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[10,\"class\",[26,[\"job-number \",[20,[\"job\",\"state\"]]]]],[7],[0,\"\\n    \"],[1,[25,\"svg-jar\",[\"icon-hash\"],[[\"class\"],[\"icon\"]]],false],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"label-align\"],[9,\"aria-label\",\"Job number\"],[7],[1,[20,[\"job\",\"number\"]],false],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[10,\"class\",[26,[\"job-os \",[20,[\"job\",\"config\",\"content\",\"os\"]]]]],[7],[0,\"\\n    \"],[1,[25,\"tooltip-on-element\",null,[[\"text\"],[[19,0,[\"job\",\"config\",\"content\",\"os\"]]]]],false],[0,\"\\n\"],[4,\"if\",[[19,0,[\"job\",\"config\",\"content\",\"os\"]]],null,{\"statements\":[[0,\"    \"],[1,[25,\"svg-jar\",[\"icon-linux\"],[[\"class\"],[\"icon linux\"]]],false],[0,\"\\n    \"],[1,[25,\"svg-jar\",[\"icon-mac\"],[[\"class\"],[\"icon mac\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n\\n  \"],[6,\"div\"],[9,\"class\",\"job-lang\"],[7],[0,\"\\n    \"],[1,[25,\"svg-jar\",[\"icon-language\"],[[\"class\"],[\"icon\"]]],false],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"label-align\"],[9,\"aria-label\",\"Language\"],[7],[4,\"if\",[[19,0,[\"languages\"]]],null,{\"statements\":[[1,[18,\"languages\"],false]],\"parameters\":[]},{\"statements\":[[0,\"no language set\"]],\"parameters\":[]}],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n\"],[4,\"if\",[[19,0,[\"environment\"]]],null,{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"job-env\"],[7],[0,\"\\n    \"],[1,[25,\"svg-jar\",[\"icon-environment\"],[[\"class\"],[\"icon\"]]],false],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"label-align\"],[9,\"aria-label\",\"Environment variables\"],[7],[1,[18,\"environment\"],false],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"job-env is-empty\"],[7],[0,\"\\n    \"],[1,[25,\"svg-jar\",[\"icon-environment\"],[[\"class\"],[\"icon\"]]],false],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"label-align\"],[9,\"aria-label\",\"Environment variables\"],[7],[0,\"no environment variables set\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]}],[0,\"\\n  \"],[6,\"div\"],[9,\"class\",\"job-duration\"],[10,\"title\",[26,[\"Started \",[25,\"pretty-date\",[[19,0,[\"job\",\"startedAt\"]]],null]]]],[7],[0,\"\\n    \"],[1,[25,\"svg-jar\",[\"icon-clock\"],[[\"class\"],[\"icon\"]]],false],[0,\"\\n    \"],[6,\"time\"],[9,\"class\",\"label-align\"],[9,\"aria-label\",\"Job duration\"],[10,\"datetime\",[26,[\"PT\",[20,[\"job\",\"duration\"]],\"S\"]]],[7],[1,[25,\"format-duration\",[[19,0,[\"job\",\"duration\"]]],null],false],[8],[0,\"\\n  \"],[8],[0,\"\\n\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[1,[25,\"repo-actions\",null,[[\"job\",\"repo\",\"labelless\"],[[19,0,[\"job\"]],[19,0,[\"job\",\"repo\"]],true]]],false],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "travis/templates/components/jobs-item.hbs" } });
});