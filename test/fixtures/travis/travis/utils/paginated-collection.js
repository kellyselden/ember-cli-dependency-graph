define('travis/utils/paginated-collection', ['exports', 'ember-decorators/object', 'ember-decorators/object/computed'], function (exports, _object, _computed) {
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

  var _dec, _dec2, _desc, _value, _obj, _init;

  var ArrayProxy = Ember.ArrayProxy;
  var emberComputed = Ember.computed;
  exports.default = ArrayProxy.extend((_dec = (0, _computed.alias)('content'), _dec2 = (0, _object.computed)('content.meta.pagination'), (_obj = { arrangedContent: null,

    pagination: function pagination(paginationData) {
      return {
        total: paginationData.count,
        perPage: paginationData.limit,
        offset: paginationData.offset,
        isFirst: paginationData.is_first,
        isLast: paginationData.is_last,
        prev: paginationData.prev,
        next: paginationData.next,
        first: paginationData.first,
        last: paginationData.last,
        currentPage: emberComputed(function () {
          var offset = paginationData.offset,
              limit = paginationData.limit;

          return offset / limit + 1;
        }),
        numberOfPages: emberComputed(function () {
          var count = paginationData.count,
              limit = paginationData.limit;

          return Math.ceil(count / limit);
        })
      };
    }
  }, (_applyDecoratedDescriptor(_obj, 'arrangedContent', [_dec], (_init = Object.getOwnPropertyDescriptor(_obj, 'arrangedContent'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj), _applyDecoratedDescriptor(_obj, 'pagination', [_dec2], Object.getOwnPropertyDescriptor(_obj, 'pagination'), _obj)), _obj)));
});