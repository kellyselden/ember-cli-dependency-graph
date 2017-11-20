define("ghost-admin/templates/components/gh-timezone-select", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "CK8y60O2", "block": "{\"symbols\":[],\"statements\":[[6,\"span\"],[9,\"class\",\"gh-select\"],[10,\"data-select-text\",[26,[[20,[\"selectedTimezone\",\"label\"]]]]],[9,\"tabindex\",\"0\"],[7],[0,\"\\n    \"],[1,[25,\"one-way-select\",null,[[\"id\",\"name\",\"options\",\"optionValuePath\",\"optionLabelPath\",\"value\",\"update\"],[\"activeTimezone\",\"general[activeTimezone]\",[20,[\"selectableTimezones\"]],\"name\",\"label\",[20,[\"selectedTimezone\"]],[25,\"action\",[[19,0,[]],\"setTimezone\"],null]]]],false],[0,\"\\n    \"],[1,[25,\"inline-svg\",[\"arrow-down-small\"],null],false],[0,\"\\n\"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"hasTimezoneOverride\"]]],null,{\"statements\":[[0,\"    \"],[6,\"p\"],[7],[0,\"Your timezone has been automatically set to \"],[1,[18,\"activeTimezone\"],false],[0,\".\"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[6,\"p\"],[7],[0,\"The local time here is currently \"],[1,[18,\"localTime\"],false],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "ghost-admin/templates/components/gh-timezone-select.hbs" } });
});