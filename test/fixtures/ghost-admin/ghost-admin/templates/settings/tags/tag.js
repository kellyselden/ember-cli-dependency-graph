define("ghost-admin/templates/settings/tags/tag", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "XvagaCOt", "block": "{\"symbols\":[],\"statements\":[[1,[25,\"gh-tag-settings-form\",null,[[\"tag\",\"setProperty\",\"showDeleteTagModal\"],[[20,[\"tag\"]],[25,\"action\",[[19,0,[]],\"setProperty\"],null],[25,\"action\",[[19,0,[]],\"toggleDeleteTagModal\"],null]]]],false],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"showDeleteTagModal\"]]],null,{\"statements\":[[0,\"    \"],[1,[25,\"gh-fullscreen-modal\",[\"delete-tag\"],[[\"model\",\"confirm\",\"close\",\"modifier\"],[[20,[\"tag\"]],[25,\"action\",[[19,0,[]],\"deleteTag\"],null],[25,\"action\",[[19,0,[]],\"toggleDeleteTagModal\"],null],\"action wide\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "ghost-admin/templates/settings/tags/tag.hbs" } });
});