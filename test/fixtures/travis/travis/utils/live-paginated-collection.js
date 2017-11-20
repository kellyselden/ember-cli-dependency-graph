define('travis/utils/live-paginated-collection', ['exports', 'ember-decorators/object/computed', 'ember-decorators/object', 'travis/utils/computed-limit'], function (exports, _computed, _object, _computedLimit) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var _slicedToArray = function () {
    function sliceIterator(arr, i) {
      var _arr = [];
      var _n = true;
      var _d = false;
      var _e = undefined;

      try {
        for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
          _arr.push(_s.value);

          if (i && _arr.length === i) break;
        }
      } catch (err) {
        _d = true;
        _e = err;
      } finally {
        try {
          if (!_n && _i["return"]) _i["return"]();
        } finally {
          if (_d) throw _e;
        }
      }

      return _arr;
    }

    return function (arr, i) {
      if (Array.isArray(arr)) {
        return arr;
      } else if (Symbol.iterator in Object(arr)) {
        return sliceIterator(arr, i);
      } else {
        throw new TypeError("Invalid attempt to destructure non-iterable instance");
      }
    };
  }();

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

  var defineProperty = Ember.defineProperty;
  var emberComputed = Ember.computed;
  var ArrayProxy = Ember.ArrayProxy;


  // LivePaginatedCollection is an interface for a first page of paginated set of
  // results.
  var LivePaginatedCollection = ArrayProxy.extend((_dec = (0, _object.computed)('paginationData'), _dec2 = (0, _computed.alias)('limited'), (_obj = {
    pagination: function pagination(paginationData) {
      if (!paginationData) return;

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
        currentPage: paginationData.offset / paginationData.limit + 1,
        numberOfPages: Math.ceil(paginationData.count / paginationData.limit)
      };
    },
    arrangedContent: null,

    setPaginationData: function setPaginationData(queryResult) {
      this.set('paginationData', queryResult.get('meta.pagination'));
    }
  }, (_applyDecoratedDescriptor(_obj, 'pagination', [_dec], Object.getOwnPropertyDescriptor(_obj, 'pagination'), _obj), _applyDecoratedDescriptor(_obj, 'arrangedContent', [_dec2], (_init = Object.getOwnPropertyDescriptor(_obj, 'arrangedContent'), _init = _init ? _init.value : undefined, {
    enumerable: true,
    configurable: true,
    writable: true,
    initializer: function initializer() {
      return _init;
    }
  }), _obj)), _obj)));

  LivePaginatedCollection.reopenClass({
    create: function create(properties) {
      var instance = this._super.apply(this, arguments);
      instance.setPaginationData(properties.content.get('queryResult'));

      this.defineSortByFunction(instance, properties.store, properties.modelName, properties.sort, properties.dependencies);

      return instance;
    },
    defineSortByFunction: function defineSortByFunction(instance, store, modelName) {
      var sort = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'id:desc';
      var dependencies = arguments[4];

      var sortByFunction = void 0,
          sortKey = void 0,
          order = void 0;
      if (typeof sort === 'function') {
        sortByFunction = sort;
      } else {
        var _sort$split = sort.split(':');

        var _sort$split2 = _slicedToArray(_sort$split, 2);

        sortKey = _sort$split2[0];
        order = _sort$split2[1];

        order = order || 'desc';
        // TODO: we need to deal with paths, like for example
        // defaultBranch.lastBuild

        if (store.modelFor(modelName).typeForRelationship(sortKey, store)) {
          // it's a relationship, so sort by id by default
          sortKey = sortKey + '.id';
        }

        sortByFunction = function sortByFunction(a, b) {
          var aValue = a.get(sortKey),
              bValue = b.get(sortKey);

          var result = void 0;
          // TODO: this should check types, not only if it's id or not
          if (sortKey.endsWith('id') || sortKey.endsWith('Id')) {
            result = parseInt(aValue) - parseInt(bValue);
          } else {
            if (aValue < bValue) {
              result = -1;
            } else if (aValue > bValue) {
              result = 1;
            } else {
              result = 0;
            }
          }

          if (order === 'desc') {
            result = -result;
          }

          return result;
        };
      }

      var sortDependencies = dependencies.slice(0); // clone

      if (sortKey && !sortDependencies.includes(sortKey)) {
        sortDependencies.push(sortKey);
      }

      sortDependencies = sortDependencies.map(function (dep) {
        return 'content.@each.' + dep;
      });
      sortDependencies.push('content.[]');

      defineProperty(instance, 'sorted', emberComputed.apply(undefined, _toConsumableArray(sortDependencies).concat([function () {
        return this.get('content').toArray().sort(sortByFunction);
      }])));

      defineProperty(instance, 'limited', (0, _computedLimit.default)('sorted', 'pagination.perPage'));
    }
  });

  exports.default = LivePaginatedCollection;
});