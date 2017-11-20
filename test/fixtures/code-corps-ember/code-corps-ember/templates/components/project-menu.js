define("code-corps-ember/templates/components/project-menu", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "cdSPszAM", "block": "{\"symbols\":[],\"statements\":[[6,\"div\"],[10,\"class\",[26,[[25,\"if\",[[19,0,[\"wide\"]],\"container--wide\",\"container\"],null],\" container--full-on-mobile\"]]],[7],[0,\"\\n  \"],[6,\"ul\"],[7],[0,\"\\n    \"],[6,\"li\"],[7],[0,\"\\n      \"],[4,\"link-to\",[\"project.index\",[19,0,[\"project\"]]],null,{\"statements\":[[0,\"About\"]],\"parameters\":[]},null],[0,\"\\n    \"],[8],[0,\"\\n\\n\"],[4,\"unless\",[[19,0,[\"project\",\"shouldLinkExternally\"]]],null,{\"statements\":[[0,\"    \"],[6,\"li\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"project.tasks\",[19,0,[\"project\"]]],null,{\"statements\":[[0,\"        Tasks\\n\"]],\"parameters\":[]},null],[0,\"    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[19,0,[\"session\",\"isAuthenticated\"]]],null,{\"statements\":[[4,\"if\",[[25,\"can\",[\"manage project\",[19,0,[\"project\"]]],null]],null,{\"statements\":[[0,\"        \"],[6,\"li\"],[9,\"class\",\"contributors\"],[7],[0,\"\\n\"],[4,\"link-to\",[\"project.settings.contributors\",[19,0,[\"project\"]]],null,{\"statements\":[[0,\"            Contributors\\n\"],[4,\"if\",[[19,0,[\"projectHasPendingUsers\"]]],null,{\"statements\":[[0,\"              \"],[6,\"span\"],[9,\"class\",\"info\"],[7],[6,\"strong\"],[7],[1,[18,\"projectPendingUsersCount\"],false],[8],[0,\" pending\"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"        \"],[8],[0,\"\\n\\n        \"],[6,\"li\"],[7],[0,\"\\n          \"],[4,\"link-to\",[\"project.settings.donations.goals\",[19,0,[\"project\"]]],null,{\"statements\":[[0,\"Donations\"]],\"parameters\":[]},null],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"li\"],[7],[0,\"\\n          \"],[4,\"link-to\",[\"project.settings.donations.payments\",[19,0,[\"project\"]]],null,{\"statements\":[[0,\"Payments\"]],\"parameters\":[]},null],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"li\"],[7],[0,\"\\n          \"],[4,\"link-to\",[\"project.settings.integrations\",[19,0,[\"project\"]]],null,{\"statements\":[[0,\"Integrations\"]],\"parameters\":[]},null],[0,\"\\n        \"],[8],[0,\"\\n\\n        \"],[6,\"li\"],[7],[0,\"\\n          \"],[4,\"link-to\",[\"project.settings.profile\",[19,0,[\"project\"]]],null,{\"statements\":[[0,\"Settings\"]],\"parameters\":[]},null],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null],[0,\"  \"],[8],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "code-corps-ember/templates/components/project-menu.hbs" } });
});