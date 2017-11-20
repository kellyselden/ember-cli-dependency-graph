define("ghost-admin/templates/components/gh-navitem", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "xNGZbluE", "block": "{\"symbols\":[],\"statements\":[[4,\"unless\",[[20,[\"navItem\",\"isNew\"]]],null,{\"statements\":[[0,\"    \"],[6,\"span\"],[9,\"class\",\"gh-blognav-grab\"],[7],[0,\"\\n        \"],[1,[25,\"inline-svg\",[\"grab\"],null],false],[0,\"\\n        \"],[6,\"span\"],[9,\"class\",\"sr-only\"],[7],[0,\"Reorder\"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[6,\"div\"],[9,\"class\",\"gh-blognav-line\"],[7],[0,\"\\n\"],[4,\"gh-validation-status-container\",null,[[\"tagName\",\"class\",\"errors\",\"property\",\"hasValidated\"],[\"span\",\"gh-blognav-label\",[20,[\"navItem\",\"errors\"]],\"label\",[20,[\"navItem\",\"hasValidated\"]]]],{\"statements\":[[0,\"        \"],[1,[25,\"gh-trim-focus-input\",[[20,[\"navItem\",\"label\"]]],[[\"shouldFocus\",\"placeholder\",\"keyPress\",\"focusOut\",\"update\"],[[20,[\"navItem\",\"last\"]],\"Label\",[25,\"action\",[[19,0,[]],\"clearLabelErrors\"],null],[25,\"action\",[[19,0,[]],\"updateLabel\",[20,[\"navItem\",\"label\"]]],null],[25,\"action\",[[19,0,[]],[25,\"mut\",[[20,[\"navItem\",\"label\"]]],null]],null]]]],false],[0,\"\\n        \"],[1,[25,\"gh-error-message\",null,[[\"errors\",\"property\"],[[20,[\"navItem\",\"errors\"]],\"label\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"gh-validation-status-container\",null,[[\"tagName\",\"class\",\"errors\",\"property\",\"hasValidated\"],[\"span\",\"gh-blognav-url\",[20,[\"navItem\",\"errors\"]],\"url\",[20,[\"navItem\",\"hasValidated\"]]]],{\"statements\":[[0,\"        \"],[1,[25,\"gh-navitem-url-input\",null,[[\"baseUrl\",\"url\",\"isNew\",\"change\",\"clearErrors\"],[[20,[\"baseUrl\"]],[20,[\"navItem\",\"url\"]],[20,[\"navItem\",\"isNew\"]],\"updateUrl\",[25,\"action\",[[19,0,[]],\"clearUrlErrors\"],null]]]],false],[0,\"\\n        \"],[1,[25,\"gh-error-message\",null,[[\"errors\",\"property\"],[[20,[\"navItem\",\"errors\"]],\"url\"]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[8],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"navItem\",\"isNew\"]]],null,{\"statements\":[[0,\"    \"],[6,\"button\"],[9,\"type\",\"button\"],[9,\"class\",\"gh-blognav-add\"],[3,\"action\",[[19,0,[]],\"addItem\"]],[7],[0,\"\\n        \"],[1,[25,\"inline-svg\",[\"add\"],null],false],[6,\"span\"],[9,\"class\",\"sr-only\"],[7],[0,\"Add\"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"    \"],[6,\"button\"],[9,\"type\",\"button\"],[9,\"class\",\"gh-blognav-delete\"],[3,\"action\",[[19,0,[]],\"deleteItem\",[20,[\"navItem\"]]]],[7],[0,\"\\n        \"],[1,[25,\"inline-svg\",[\"trash\"],null],false],[6,\"span\"],[9,\"class\",\"sr-only\"],[7],[0,\"Delete\"],[8],[0,\"\\n    \"],[8],[0,\"\\n\"]],\"parameters\":[]}]],\"hasEval\":false}", "meta": { "moduleName": "ghost-admin/templates/components/gh-navitem.hbs" } });
});