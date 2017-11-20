define("ember-scrollable/templates/components/ember-scrollable", ["exports"], function (exports) {
  "use strict";

  exports.__esModule = true;
  exports.default = Ember.HTMLBars.template({ "id": "XaUCsF2h", "block": "{\"symbols\":[\"&default\"],\"statements\":[[1,[25,\"resize-detector\",[[25,\"concat\",[\"#\",[20,[\"elementId\"]]],null]],[[\"on-resize\"],[[25,\"action\",[[19,0,[]],\"recalculate\"],null]]]],false],[0,\"\\n\"],[4,\"if\",[[20,[\"horizontal\"]]],null,{\"statements\":[[0,\"  \"],[1,[25,\"ember-scrollbar\",null,[[\"handleOffset\",\"handleSize\",\"horizontal\",\"showHandle\",\"isDragging\",\"mouseOffset\",\"onJumpTo\",\"onDrag\",\"onDragStart\",\"onDragEnd\"],[[20,[\"horizontalHandleOffset\"]],[20,[\"horizontalHandleSize\"]],true,[20,[\"showHandle\"]],[20,[\"isHorizontalDragging\"]],[20,[\"horizontalMouseOffset\"]],[25,\"action\",[[19,0,[]],\"horizontalJumpTo\"],null],[25,\"action\",[[19,0,[]],\"horizontalDrag\"],null],[25,\"action\",[[19,0,[]],\"horizontalDragBoundary\",true],null],[25,\"action\",[[19,0,[]],\"horizontalDragBoundary\",false],null]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"if\",[[20,[\"vertical\"]]],null,{\"statements\":[[0,\"  \"],[1,[25,\"ember-scrollbar\",null,[[\"handleOffset\",\"handleSize\",\"horizontal\",\"showHandle\",\"isDragging\",\"mouseOffset\",\"onJumpTo\",\"onDrag\",\"onDragStart\",\"onDragEnd\"],[[20,[\"verticalHandleOffset\"]],[20,[\"verticalHandleSize\"]],false,[20,[\"showHandle\"]],[20,[\"isVerticalDragging\"]],[20,[\"verticalMouseOffset\"]],[25,\"action\",[[19,0,[]],\"verticalJumpTo\"],null],[25,\"action\",[[19,0,[]],\"verticalDrag\"],null],[25,\"action\",[[19,0,[]],\"verticalBoundaryEvent\",true],null],[25,\"action\",[[19,0,[]],\"verticalBoundaryEvent\",false],null]]]],false],[0,\"\\n\"]],\"parameters\":[]},null],[4,\"scroll-content-element\",null,[[\"height\",\"width\",\"scrollToX\",\"scrollToY\",\"onScroll\"],[[20,[\"scrollContentHeight\"]],[20,[\"scrollContentWidth\"]],[20,[\"scrollToX\"]],[20,[\"scrollToY\"]],[25,\"action\",[[19,0,[]],\"scrolled\"],null]]],{\"statements\":[[0,\"  \"],[6,\"div\"],[9,\"class\",\"tse-content scrollable-content\"],[7],[0,\"\\n    \"],[11,1,[[25,\"hash\",null,[[\"recalculate\",\"update\",\"scrollTop\"],[[25,\"action\",[[19,0,[]],\"recalculate\"],null],[25,\"action\",[[19,0,[]],\"update\"],null],[25,\"action\",[[19,0,[]],\"scrollTop\"],null]]]]]],[0,\"\\n  \"],[8],[0,\"\\n\"]],\"parameters\":[]},null]],\"hasEval\":false}", "meta": { "moduleName": "ember-scrollable/templates/components/ember-scrollable.hbs" } });
});