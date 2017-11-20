define('ember-basic-dropdown/utils/calculate-position', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (_, _2, _destination, _ref) {
    var renderInPlace = _ref.renderInPlace;

    if (renderInPlace) {
      return calculateInPlacePosition.apply(undefined, arguments);
    } else {
      return calculateWormholedPosition.apply(undefined, arguments);
    }
  };

  exports.calculateWormholedPosition = calculateWormholedPosition;
  exports.calculateInPlacePosition = calculateInPlacePosition;
  exports.getScrollParent = getScrollParent;
  function calculateWormholedPosition(trigger, content, destination, _ref2) {
    var horizontalPosition = _ref2.horizontalPosition,
        verticalPosition = _ref2.verticalPosition,
        matchTriggerWidth = _ref2.matchTriggerWidth,
        previousHorizontalPosition = _ref2.previousHorizontalPosition,
        previousVerticalPosition = _ref2.previousVerticalPosition;

    // Collect information about all the involved DOM elements
    var scroll = { left: window.pageXOffset, top: window.pageYOffset };

    var _trigger$getBoundingC = trigger.getBoundingClientRect(),
        triggerLeft = _trigger$getBoundingC.left,
        triggerTop = _trigger$getBoundingC.top,
        triggerWidth = _trigger$getBoundingC.width,
        triggerHeight = _trigger$getBoundingC.height;

    var _content$getBoundingC = content.getBoundingClientRect(),
        dropdownHeight = _content$getBoundingC.height,
        dropdownWidth = _content$getBoundingC.width;

    var viewportWidth = self.document.body.clientWidth || self.window.innerWidth;
    var style = {};

    // Apply containers' offset
    var anchorElement = destination.parentNode;
    var anchorPosition = window.getComputedStyle(anchorElement).position;
    while (anchorPosition !== 'relative' && anchorPosition !== 'absolute' && anchorElement.tagName.toUpperCase() !== 'BODY' && destination.parentNode) {
      anchorElement = anchorElement.parentNode;
      anchorPosition = window.getComputedStyle(anchorElement).position;
    }
    if (anchorPosition === 'relative' || anchorPosition === 'absolute') {
      var rect = anchorElement.getBoundingClientRect();
      triggerLeft = triggerLeft - rect.left;
      triggerTop = triggerTop - rect.top;
      var _anchorElement = anchorElement,
          offsetParent = _anchorElement.offsetParent;

      if (offsetParent) {
        triggerLeft -= anchorElement.offsetParent.scrollLeft;
        triggerTop -= anchorElement.offsetParent.scrollTop;
      }
    }

    // Calculate drop down width
    dropdownWidth = matchTriggerWidth ? triggerWidth : dropdownWidth;
    if (matchTriggerWidth) {
      style.width = dropdownWidth;
    }

    // Calculate horizontal position
    var triggerLeftWithScroll = triggerLeft + scroll.left;
    if (horizontalPosition === 'auto' || horizontalPosition === 'auto-left') {
      // Calculate the number of visible horizontal pixels if we were to place the
      // dropdown on the left and right
      var leftVisible = Math.min(viewportWidth, triggerLeft + dropdownWidth) - Math.max(0, triggerLeft);
      var rightVisible = Math.min(viewportWidth, triggerLeft + triggerWidth) - Math.max(0, triggerLeft + triggerWidth - dropdownWidth);

      if (dropdownWidth > leftVisible && rightVisible > leftVisible) {
        // If the drop down won't fit left-aligned, and there is more space on the
        // right than on the left, then force right-aligned
        horizontalPosition = 'right';
      } else if (dropdownWidth > rightVisible && leftVisible > rightVisible) {
        // If the drop down won't fit right-aligned, and there is more space on
        // the left than on the right, then force left-aligned
        horizontalPosition = 'left';
      } else {
        // Keep same position as previous
        horizontalPosition = previousHorizontalPosition || 'left';
      }
    } else if (horizontalPosition === 'auto-right') {
      // Calculate the number of visible horizontal pixels if we were to place the
      // dropdown on the left and right
      var _leftVisible = Math.min(viewportWidth, triggerLeft + dropdownWidth) - Math.max(0, triggerLeft);
      var _rightVisible = Math.min(viewportWidth, triggerLeft + triggerWidth) - Math.max(0, triggerLeft + triggerWidth - dropdownWidth);

      if (dropdownWidth > _rightVisible && _leftVisible > _rightVisible) {
        // If the drop down won't fit right-aligned, and there is more space on the
        // left than on the right, then force left-aligned
        horizontalPosition = 'left';
      } else if (dropdownWidth > _leftVisible && _rightVisible > _leftVisible) {
        // If the drop down won't fit left-aligned, and there is more space on
        // the right than on the left, then force right-aligned
        horizontalPosition = 'right';
      } else {
        // Keep same position as previous
        horizontalPosition = previousHorizontalPosition || 'right';
      }
    }
    if (horizontalPosition === 'right') {
      style.right = viewportWidth - (triggerLeftWithScroll + triggerWidth);
    } else if (horizontalPosition === 'center') {
      style.left = triggerLeftWithScroll + (triggerWidth - dropdownWidth) / 2;
    } else {
      style.left = triggerLeftWithScroll;
    }

    // Calculate vertical position
    var triggerTopWithScroll = triggerTop;

    /**
     * Fixes bug where the dropdown always stays on the same position on the screen when
     * the <body> is relatively positioned
     */
    var isBodyPositionRelative = window.getComputedStyle(document.body).getPropertyValue('position') === 'relative';
    if (!isBodyPositionRelative) {
      triggerTopWithScroll += scroll.top;
    }

    if (verticalPosition === 'above') {
      style.top = triggerTopWithScroll - dropdownHeight;
    } else if (verticalPosition === 'below') {
      style.top = triggerTopWithScroll + triggerHeight;
    } else {
      var viewportBottom = scroll.top + self.window.innerHeight;
      var enoughRoomBelow = triggerTopWithScroll + triggerHeight + dropdownHeight < viewportBottom;
      var enoughRoomAbove = triggerTop > dropdownHeight;

      if (previousVerticalPosition === 'below' && !enoughRoomBelow && enoughRoomAbove) {
        verticalPosition = 'above';
      } else if (previousVerticalPosition === 'above' && !enoughRoomAbove && enoughRoomBelow) {
        verticalPosition = 'below';
      } else if (!previousVerticalPosition) {
        verticalPosition = enoughRoomBelow ? 'below' : 'above';
      } else {
        verticalPosition = previousVerticalPosition;
      }
      style.top = triggerTopWithScroll + (verticalPosition === 'below' ? triggerHeight : -dropdownHeight);
    }

    return { horizontalPosition: horizontalPosition, verticalPosition: verticalPosition, style: style };
  } /**
      Function used to calculate the position of the content of the dropdown.
      @public
      @method calculatePosition
      @param {DomElement} trigger The trigger of the dropdown
      @param {DomElement} content The content of the dropdown
      @param {DomElement} destination The element in which the content is going to be placed.
      @param {Object} options The directives that define how the position is calculated
        - {String} horizontalPosition How the users want the dropdown to be positioned horizontally. Values: right | center | left
        - {String} verticalPosition How the users want the dropdown to be positioned vertically. Values: above | below
        - {Boolean} matchTriggerWidth If the user wants the width of the dropdown to match the width of the trigger
        - {String} previousHorizontalPosition How the dropdown was positioned for the last time. Same values than horizontalPosition, but can be null the first time.
        - {String} previousVerticalPosition How the dropdown was positioned for the last time. Same values than verticalPosition, but can be null the first time.
        - {Boolean} renderInPlace Boolean flat that is truthy if the component is rendered in place.
      @return {Object} How the component is going to be positioned.
        - {String} horizontalPosition The new horizontal position.
        - {String} verticalPosition The new vertical position.
        - {Object} CSS properties to be set on the dropdown. It supports `top`, `left`, `right` and `width`.
    */
  function calculateInPlacePosition(trigger, content, destination, _ref3) {
    var horizontalPosition = _ref3.horizontalPosition,
        verticalPosition = _ref3.verticalPosition;

    var dropdownRect = void 0;
    var positionData = {};
    if (horizontalPosition === 'auto') {
      var triggerRect = trigger.getBoundingClientRect();
      dropdownRect = content.getBoundingClientRect();
      var viewportRight = window.pageXOffset + self.window.innerWidth;
      positionData.horizontalPosition = triggerRect.left + dropdownRect.width > viewportRight ? 'right' : 'left';
    } else if (horizontalPosition === 'center') {
      var _trigger$getBoundingC2 = trigger.getBoundingClientRect(),
          triggerWidth = _trigger$getBoundingC2.width;

      var _content$getBoundingC2 = content.getBoundingClientRect(),
          dropdownWidth = _content$getBoundingC2.width;

      positionData.style = { left: (triggerWidth - dropdownWidth) / 2 };
    }
    if (verticalPosition === 'above') {
      positionData.verticalPosition = verticalPosition;
      dropdownRect = dropdownRect || content.getBoundingClientRect();
      positionData.style = { top: -dropdownRect.height };
    } else {
      positionData.verticalPosition = 'below';
    }
    return positionData;
  }

  function getScrollParent(element) {
    var style = self.window.getComputedStyle(element);
    var excludeStaticParent = style.position === "absolute";
    var overflowRegex = /(auto|scroll)/;

    if (style.position === "fixed") return document.body;
    for (var parent = element; parent = parent.parentElement;) {
      style = self.window.getComputedStyle(parent);
      if (excludeStaticParent && style.position === "static") {
        continue;
      }
      if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) {
        return parent;
      }
    }

    return document.body;
  }
});