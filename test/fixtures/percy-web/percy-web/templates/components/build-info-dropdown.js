define("percy-web/templates/components/build-info-dropdown", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "o1dIV47g", "block": "{\"symbols\":[],\"statements\":[[6,\"button\"],[9,\"id\",\"BuildInfo\"],[9,\"class\",\"Button Button--small u-pull-right\"],[3,\"action\",[[19,0,[]],\"toggleModal\"]],[7],[0,\"\\n  Build Info\\n\"],[8],[0,\"\\n\"],[4,\"if\",[[20,[\"isShowingModal\"]]],null,{\"statements\":[[4,\"modal-dialog\",null,[[\"onClose\",\"hasOverlay\",\"clickOutsideToClose\",\"translucentOverlay\",\"targetAttachment\",\"attachment\",\"tetherTarget\",\"containerClass\",\"renderInPlace\",\"build\"],[\"toggleModal\",false,true,true,\"bottom right\",\"top right\",\"#BuildInfo\",\"BuildInfoDropdown-modal\",[20,[\"renderInPlace\"]],[20,[\"build\"]]]],{\"statements\":[[0,\"\\n    \"],[1,[25,\"fa-icon\",[\"caret-up\"],null],false],[0,\"\\n\\n    \"],[1,[25,\"build-state-badge\",null,[[\"build\"],[[20,[\"build\"]]]]],false],[0,\"\\n\\n    \"],[6,\"h3\"],[7],[1,[20,[\"build\",\"buildTitle\"]],false],[8],[0,\"\\n    \"],[6,\"table\"],[7],[0,\"\\n      \"],[6,\"tr\"],[7],[0,\"\\n        \"],[6,\"td\"],[7],[0,\"Created\"],[8],[0,\"\\n        \"],[6,\"td\"],[7],[1,[25,\"build-started\",null,[[\"build\"],[[20,[\"build\"]]]]],false],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"tr\"],[7],[0,\"\\n        \"],[6,\"td\"],[7],[0,\"Build time\"],[8],[0,\"\\n        \"],[6,\"td\"],[7],[1,[25,\"build-duration\",null,[[\"build\"],[[20,[\"build\"]]]]],false],[8],[0,\"\\n      \"],[8],[0,\"\\n      \"],[6,\"tr\"],[7],[0,\"\\n        \"],[6,\"td\"],[7],[0,\"Baseline build\"],[8],[0,\"\\n        \"],[6,\"td\"],[7],[1,[25,\"build-comparison-info\",null,[[\"build\"],[[20,[\"build\"]]]]],false],[8],[0,\"\\n      \"],[8],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"build\",\"isGithubPullRequest\"]]],null,{\"statements\":[[0,\"        \"],[6,\"tr\"],[7],[0,\"\\n          \"],[6,\"td\"],[7],[0,\"Pull Request\"],[8],[0,\"\\n          \"],[6,\"td\"],[7],[0,\"\\n            \"],[1,[25,\"build-overview-icon\",null,[[\"icon\"],[\"pull-request\"]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"build\",\"pullRequestTitle\"]]],null,{\"statements\":[[0,\"              \"],[6,\"a\"],[10,\"href\",[26,[[20,[\"build\",\"repo\",\"htmlUrl\"]],\"/pull/\",[20,[\"build\",\"pullRequestNumber\"]]]]],[7],[1,[20,[\"build\",\"pullRequestTitle\"]],false],[8],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"build\",\"pullRequestNumber\"]]],null,{\"statements\":[[0,\"              \"],[6,\"span\"],[9,\"class\",\"BuildOverviewInfo-prNumber\"],[7],[0,\"\\n\"],[4,\"if\",[[20,[\"build\",\"pullRequestTitle\"]]],null,{\"statements\":[[0,\"                  #\"],[1,[20,[\"build\",\"pullRequestNumber\"]],false],[0,\"\\n\"]],\"parameters\":[]},{\"statements\":[[0,\"                  \"],[6,\"a\"],[10,\"href\",[26,[[20,[\"build\",\"repo\",\"htmlUrl\"]],\"/pull/\",[20,[\"build\",\"pullRequestNumber\"]]]]],[7],[0,\"#\"],[1,[20,[\"build\",\"pullRequestNumber\"]],false],[8],[0,\"                  \\n\"]],\"parameters\":[]}],[0,\"              \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"          \"],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"build\",\"userAgent\"]]],null,{\"statements\":[[0,\"        \"],[6,\"tr\"],[9,\"class\",\"BuildInfoDropdown-fullWidthLabel\"],[7],[0,\"\\n          \"],[6,\"td\"],[9,\"colspan\",\"2\"],[7],[0,\"Environment\"],[8],[0,\"\\n        \"],[8],[0,\"\\n        \"],[6,\"tr\"],[9,\"class\",\"BuildInfoDropdown-fullWidthValue\"],[7],[0,\"\\n          \"],[6,\"td\"],[9,\"colspan\",\"2\"],[7],[6,\"pre\"],[7],[1,[20,[\"build\",\"userAgent\"]],false],[8],[8],[0,\"\\n        \"],[8],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"    \"],[8],[0,\"\\n\\n\"],[4,\"if\",[[20,[\"build\",\"commit\"]]],null,{\"statements\":[[0,\"      \"],[6,\"hr\"],[7],[8],[0,\"\\n      \"],[6,\"h4\"],[7],[0,\"Head commit\"],[8],[0,\"\\n      \"],[1,[25,\"commit-table\",null,[[\"build\",\"commit\"],[[20,[\"build\"]],[20,[\"build\",\"commit\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[0,\"\\n\"],[4,\"if\",[[20,[\"build\",\"baseBuild\",\"commit\"]]],null,{\"statements\":[[0,\"      \"],[6,\"hr\"],[7],[8],[0,\"\\n      \"],[6,\"h4\"],[7],[0,\"Base commit\"],[8],[0,\"\\n      \"],[1,[25,\"commit-table\",null,[[\"build\",\"commit\"],[[20,[\"build\",\"baseBuild\"]],[20,[\"build\",\"baseBuild\",\"commit\"]]]]],false],[0,\"\\n\"]],\"parameters\":[]},null]],\"parameters\":[]},null]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "percy-web/templates/components/build-info-dropdown.hbs" } });
});