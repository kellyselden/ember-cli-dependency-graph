define("travis/templates/components/sync-button", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "NTzybHj6", "block": "{\"symbols\":[],\"statements\":[[4,\"if\",[[19,0,[\"user\",\"isSyncing\"]]],null,{\"statements\":[[0,\"   \"],[6,\"div\"],[9,\"class\",\"button is-syncing\"],[7],[0,\"\\n     \"],[6,\"span\"],[9,\"class\",\"loading-indicator--white label-align\"],[7],[6,\"i\"],[7],[8],[6,\"i\"],[7],[8],[6,\"i\"],[7],[8],[8],[0,\"\\n     \"],[6,\"span\"],[9,\"class\",\"label-align\"],[7],[0,\"Syncing from GitHub\"],[8],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"  \"],[6,\"button\"],[9,\"class\",\"button\"],[9,\"type\",\"button\"],[3,\"action\",[[19,0,[]],\"sync\"]],[7],[0,\"\\n    \"],[1,[25,\"svg-jar\",[\"icon-restart\"],[[\"class\"],[\"icon white\"]]],false],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"label-align\"],[7],[0,\"Sync account\"],[8],[0,\"\\n  \"],[8],[0,\"\\n  \"],[6,\"p\"],[9,\"class\",\"sync-last\"],[7],[0,\"Last synced \"],[1,[25,\"format-time\",[[19,0,[\"user\",\"syncedAt\"]]],null],false],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "travis/templates/components/sync-button.hbs" } });
});