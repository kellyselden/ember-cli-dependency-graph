define("ghost-admin/templates/components/gh-profile-image", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "QGQwkr9+", "block": "{\"symbols\":[],\"statements\":[[6,\"figure\"],[9,\"class\",\"account-image\"],[7],[0,\"\\n\\n\"],[4,\"unless\",[[20,[\"previewDataURL\"]]],null,{\"statements\":[[0,\"        \"],[6,\"div\"],[9,\"class\",\"placeholder-img\"],[10,\"style\",[18,\"placeholderStyle\"],null],[7],[8],[0,\"\\n        \"],[6,\"div\"],[9,\"id\",\"account-image\"],[9,\"class\",\"gravatar-img\"],[10,\"style\",[18,\"avatarStyle\"],null],[7],[0,\"\\n            \"],[6,\"span\"],[9,\"class\",\"sr-only\"],[7],[0,\"User image\"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"previewDataURL\"]]],null,{\"statements\":[[0,\"        \"],[6,\"img\"],[10,\"src\",[18,\"previewDataURL\"],null],[9,\"class\",\"gravatar-img\"],[7],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n    \"],[6,\"span\"],[9,\"class\",\"edit-account-image\"],[10,\"onclick\",[25,\"action\",[[19,0,[]],\"openFileDialog\"],null],null],[9,\"role\",\"button\"],[7],[0,\"\\n        \"],[1,[25,\"inline-svg\",[\"photos\"],null],false],[0,\"\\n        \"],[6,\"span\"],[9,\"class\",\"sr-only\"],[7],[0,\"Upload an image\"],[8],[0,\"\\n    \"],[8],[0,\"\\n\\n    \"],[1,[25,\"gh-file-input\",null,[[\"alt\",\"name\",\"multiple\",\"action\",\"accept\"],[null,\"uploadimage\",false,[25,\"action\",[[19,0,[]],\"imageSelected\"],null],[20,[\"imageMimeTypes\"]]]]],false],[0,\"\\n\"],[8],[0,\"\\n\"]],\"hasEval\":false}", "meta": { "moduleName": "ghost-admin/templates/components/gh-profile-image.hbs" } });
});