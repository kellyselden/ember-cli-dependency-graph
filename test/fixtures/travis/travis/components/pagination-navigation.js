define('travis/components/pagination-navigation', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _object, _computed) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  var _dec, _dec2, _dec3, _dec4, _desc, _value, _obj, _init;

  var Component = Ember.Component;
  exports.default = Component.extend((_dec = (0, _computed.alias)('collection.pagination'), _dec2 = (0, _object.computed)('outer'), _dec3 = (0, _object.computed)('inner'), _dec4 = (0, _object.computed)('pagination.{numberOfPages,perPage,currentPage,offset}', 'innerWindow', 'outerWindow'), (_obj = {
    tagName: 'nav',
    classNames: ['pagination-navigation'],
    pagination: null,

    outerWindow: function outerWindow(outer) {
      return outer || 1;
    },
    innerWindow: function innerWindow(inner) {
      return inner || 2;
    },
    pages: function pages(numberOfPages, perPage, currentPage, offset, innerWindow, outerWindow) {
      var thresholdDisplayAll = (outerWindow + 1) * 2 + (innerWindow + 1);
      var pageArray = [];

      // display all pages if there is only a few
      if (numberOfPages <= thresholdDisplayAll) {
        for (var i = 0; i < numberOfPages; i++) {
          pageArray.push({
            num: i + 1,
            offset: perPage * i
          });
        }
        // else stack together pagination
      } else {
        var innerHalf = Math.ceil(innerWindow / 2);
        var lowerInnerBoundary = currentPage - innerHalf;
        if (lowerInnerBoundary < 0) {
          lowerInnerBoundary = 0;
        }
        var upperInnerBoundary = currentPage + innerHalf;
        var lowerOuterBoundary = 1 + outerWindow;
        var upperOuterBoundary = numberOfPages - outerWindow;

        pageArray.push({
          num: 1,
          offset: 0
        });
        // outerwindow first page
        for (var _i = 1; _i <= outerWindow; _i++) {
          var index = _i + 1;
          if (_i !== currentPage && index < lowerOuterBoundary) {
            pageArray.push({
              num: index,
              offset: perPage * _i
            });
          }
        }

        // ... devider unit
        if (lowerInnerBoundary - pageArray.length > outerWindow) {
          pageArray.push({});
        }

        // innerwindow < current page
        for (var _i2 = lowerInnerBoundary; _i2 < currentPage; _i2++) {
          if (_i2 > lowerOuterBoundary) {
            pageArray.push({
              num: _i2,
              offset: perPage * (_i2 - 1)
            });
          }
        }

        if (currentPage > lowerOuterBoundary && currentPage < upperOuterBoundary) {
          // current page
          pageArray.push({
            num: currentPage,
            offset: offset
          });
        }

        // innerwindow > current page
        for (var _i3 = currentPage + 1; _i3 <= upperInnerBoundary; _i3++) {
          if (_i3 < upperOuterBoundary) {
            pageArray.push({
              num: _i3,
              offset: perPage * (_i3 - 1)
            });
          }
        }

        // ... devider unit
        if (upperOuterBoundary - upperInnerBoundary > 1) {
          pageArray.push({});
        }

        // outerwindow last page
        for (var _i4 = upperOuterBoundary; _i4 < numberOfPages; _i4++) {
          if (!(_i4 < currentPage)) {
            pageArray.push({
              num: _i4,
              offset: perPage * (_i4 - 1)
            });
          }
        }

        pageArray.push({
          num: numberOfPages,
          offset: this.get('pagination.last.offset')
        });
      }
      return pageArray;
    }
  }, (_applyDecoratedDescriptor(_obj, 'pagination', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'pagination'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'outerWindow', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'outerWindow'), _obj), _applyDecoratedDescriptor(_obj, 'innerWindow', [_dec3], Object.getOwnPropertyDescriptor(_obj, 'innerWindow'), _obj), _applyDecoratedDescriptor(_obj, 'pages', [_dec4], Object.getOwnPropertyDescriptor(_obj, 'pages'), _obj)), _obj)));
});