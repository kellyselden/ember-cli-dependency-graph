define("liquid-fire/tabbable", [], function () {
  "use strict";

  var $ = Ember.$;


  function focusable(element, isTabIndexNotNaN) {
    var nodeName = element.nodeName.toLowerCase();
    return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" === nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN) && visible(element);
  }

  function visible(element) {
    var $el = $(element);
    return $.expr.filters.visible(element) && !$($el, $el.parents()).filter(function () {
      return $.css(this, "visibility") === "hidden";
    }).length;
  }

  if (!$.expr[':'].tabbable) {
    $.expr[':'].tabbable = function (element) {
      var tabIndex = $.attr(element, "tabindex"),
          isTabIndexNaN = isNaN(tabIndex);
      return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
    };
  }
});