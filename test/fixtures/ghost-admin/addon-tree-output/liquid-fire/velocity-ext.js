define('liquid-fire/velocity-ext', ['velocity'], function (_velocity) {
  'use strict';

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  if ((typeof FastBoot === 'undefined' ? 'undefined' : _typeof(FastBoot)) === undefined) {

    var VCSS = _velocity.default.CSS;

    var augmentDimension = function augmentDimension(name, element) {
      var sides = name === 'width' ? ['Left', 'Right'] : ['Top', 'Bottom'];

      if (VCSS.getPropertyValue(element, "boxSizing").toString().toLowerCase() === 'border-box') {
        /* in box-sizing mode, the VCSS width / height accessors already give the outerWidth / outerHeight. */
        return 0;
      } else {
        var augment = 0;
        var fields = ['padding' + sides[0], 'padding' + sides[1], 'border' + sides[0] + 'Width', 'border' + sides[1] + 'Width'];
        for (var i = 0; i < fields.length; i++) {
          var value = parseFloat(VCSS.getPropertyValue(element, fields[i]));
          if (!isNaN(value)) {
            augment += value;
          }
        }
        return augment;
      }
    };

    var outerDimension = function outerDimension(name) {
      return function (type, element, propertyValue) {
        switch (type) {
          case "name":
            return name;
          case "extract":
            return parseFloat(propertyValue) + augmentDimension(name, element);
          case "inject":
            return parseFloat(propertyValue) - augmentDimension(name, element) + "px";
        }
      };
    };

    VCSS.Normalizations.registered.outerWidth = outerDimension('width');
    VCSS.Normalizations.registered.outerHeight = outerDimension('height');
  }
});