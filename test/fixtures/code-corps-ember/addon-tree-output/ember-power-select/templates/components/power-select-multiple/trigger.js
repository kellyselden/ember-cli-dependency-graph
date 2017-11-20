define("ember-power-select/templates/components/power-select-multiple/trigger", ["exports"], function (exports) {
  "use strict";

  exports.__esModule = true;
  exports.default = Ember.HTMLBars.template({ "id": "JmYWBTFp", "block": "{\"symbols\":[\"opt\",\"idx\",\"&default\"],\"statements\":[[6,\"ul\"],[10,\"id\",[26,[\"ember-power-select-multiple-options-\",[20,[\"select\",\"uniqueId\"]]]]],[9,\"class\",\"ember-power-select-multiple-options\"],[7],[0,\"\\n\"],[4,\"each\",[[19,0,[\"select\",\"selected\"]]],null,{\"statements\":[[0,\"    \"],[6,\"li\"],[10,\"class\",[26,[\"ember-power-select-multiple-option \",[25,\"if\",[[19,1,[\"disabled\"]],\"ember-power-select-multiple-option--disabled\"],null]]]],[7],[0,\"\\n\"],[4,\"unless\",[[19,0,[\"select\",\"disabled\"]]],null,{\"statements\":[[0,\"        \"],[6,\"span\"],[9,\"role\",\"button\"],[9,\"aria-label\",\"remove element\"],[9,\"class\",\"ember-power-select-multiple-remove-btn\"],[10,\"data-selected-index\",[19,2,[]],null],[7],[0,\"\\n          ×\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[19,0,[\"selectedItemComponent\"]]],null,{\"statements\":[[0,\"        \"],[1,[25,\"component\",[[19,0,[\"selectedItemComponent\"]]],[[\"option\",\"select\"],[[25,\"readonly\",[[19,1,[]]],null],[25,\"readonly\",[[19,0,[\"select\"]]],null]]]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"        \"],[11,3,[[19,1,[]],[19,0,[\"select\"]]]],[0,\"\\n\"]],\"parameters\":[]}],[0,\"    \"],[8],[0,\"\\n\"]],\"parameters\":[1,2]},{\"statements\":[[4,\"if\",[[25,\"and\",[[19,0,[\"placeholder\"]],[25,\"not\",[[19,0,[\"searchEnabled\"]]],null]],null]],null,{\"statements\":[[0,\"      \"],[6,\"span\"],[9,\"class\",\"ember-power-select-placeholder\"],[7],[1,[18,\"placeholder\"],false],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]}],[4,\"if\",[[19,0,[\"searchEnabled\"]]],null,{\"statements\":[[0,\"    \"],[6,\"input\"],[9,\"type\",\"search\"],[9,\"class\",\"ember-power-select-trigger-multiple-input\"],[9,\"tabindex\",\"0\"],[9,\"autocomplete\",\"off\"],[9,\"autocorrect\",\"off\"],[9,\"autocapitalize\",\"off\"],[9,\"spellcheck\",\"false\"],[10,\"id\",[26,[\"ember-power-select-trigger-multiple-input-\",[20,[\"select\",\"uniqueId\"]]]]],[10,\"value\",[20,[\"select\",\"searchText\"]],null],[10,\"aria-controls\",[18,\"listboxId\"],null],[10,\"style\",[18,\"triggerMultipleInputStyle\"],null],[10,\"placeholder\",[18,\"maybePlaceholder\"],null],[10,\"disabled\",[20,[\"select\",\"disabled\"]],null],[10,\"oninput\",[25,\"action\",[[19,0,[]],\"onInput\"],null],null],[10,\"onFocus\",[18,\"onFocus\"],null],[10,\"onBlur\",[18,\"onBlur\"],null],[10,\"tabindex\",[18,\"tabindex\"],null],[10,\"onkeydown\",[25,\"action\",[[19,0,[]],\"onKeydown\"],null],null],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[8],[0,\"\\n\"],[6,\"span\"],[9,\"class\",\"ember-power-select-status-icon\"],[7],[8]],\"hasEval\":false}", "meta": { "moduleName": "ember-power-select/templates/components/power-select-multiple/trigger.hbs" } });
});