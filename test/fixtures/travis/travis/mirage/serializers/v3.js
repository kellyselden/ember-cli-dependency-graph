define('travis/mirage/serializers/v3', ['exports', 'ember-cli-mirage', 'ember-inflector', 'travis/mirage/api-spec'], function (exports, _emberCliMirage, _emberInflector, _apiSpec) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  exports.default = _emberCliMirage.JSONAPISerializer.extend({
    serialize: function serialize(data, request) {
      var result = void 0;

      if (!request._processedRecords) {
        request._processedRecords = [];
      }

      if (data.models) {
        result = this.serializeCollection(data, request, { topLevel: true });
      } else {
        result = this.serializeSingle(data, request, { topLevel: true });
      }

      return result;
    },
    serializeCollection: function serializeCollection(data, request, options) {
      var _this = this;

      var type = (0, _emberInflector.pluralize)(data.modelName),
          pagination = void 0;

      if (!request.noPagination) {
        var count = data.models.length,
            offset = request.queryParams.offset || 0,
            limit = request.queryParams.limit || 10,
            isFirst = false,
            isLast = offset + limit >= count,
            next = void 0,
            prev = void 0;

        if (offset == 0) {
          isFirst = true;
        }

        if (!isLast) {
          next = {
            offset: offset + limit,
            limit: limit
          };
        }

        if (!isFirst) {
          var prevOffset = offset - limit;
          prev = {
            offset: prevOffset < 0 ? 0 : prevOffset,
            limit: limit
          };
        }

        pagination = {
          count: count,
          offset: offset,
          limit: limit,
          is_first: isFirst,
          is_last: isLast,
          next: next,
          prev: prev
        };

        if (offset) {
          data = data.slice(offset);
        }

        if (limit) {
          data = data.slice(0, limit);
        }
      }

      return _defineProperty({
        '@href': this.hrefForCollection(type, data, request),
        '@representation': 'standard',
        '@type': type,
        '@pagination': pagination
      }, type, data.models.map(function (model) {
        return _this.serializeSingle(model, request, options);
      }));
    },
    serializeSingle: function serializeSingle(model, request) {
      var _this2 = this;

      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var type = model.modelName;
      var representation = this.representation(model, request, options);

      if (this.alreadyProcessed(model, request)) {
        return {
          '@href': this.hrefForSingle(type, model, request)
        };
      } else if (representation === 'standard') {
        request._processedRecords.push(model);
      }

      var result = {
        '@href': this.hrefForSingle(type, model, request),
        '@representation': representation,
        '@type': type
      };

      var permissions = model.attrs.permissions;
      if (permissions) {
        delete model.attrs.permissions;

        result['@permissions'] = permissions;
      }

      this.getAttributes(type, representation, request).forEach(function (attributeName) {
        var relationship = model[Ember.String.camelize(attributeName)];

        if (attributeName === 'id') {
          result['id'] = _this2.normalizeId(model, model.attrs.id);
        } else if (relationship && relationship.modelName) {
          // we're dealing with relationship
          var relationType = (0, _emberInflector.singularize)(relationship.modelName);
          var serializer = _this2.serializerFor(relationType);

          var serializeOptions = {};

          if (_this2.isIncluded(type, attributeName, request)) {
            serializeOptions.representation = 'standard';
          }

          if (relationship.attrs) {
            // belongsTo
            var serialized = serializer.serializeSingle(relationship, request, serializeOptions);
            result[attributeName] = serialized;
          } else {
            // hasMany
            result[attributeName] = relationship.models.map(function (m) {
              return serializer.serializeSingle(m, request, serializeOptions);
            });
          }
        } else {
          result[attributeName] = model.attrs[attributeName];
        }
      });

      return result;
    },
    getAttributes: function getAttributes(type, representation, request) {
      var attributes = _apiSpec.default.resources[type].representations[representation],
          include = request.queryParams.include;

      if (include) {
        include.split(',').forEach(function (includeSegment) {
          var _includeSegment$split = includeSegment.split('.'),
              _includeSegment$split2 = _slicedToArray(_includeSegment$split, 2),
              includeType = _includeSegment$split2[0],
              includeAttribute = _includeSegment$split2[1];

          if (includeType === type && !attributes.includes(includeAttribute)) {
            attributes.push(includeAttribute);
          }
        });
      }

      return attributes;
    },
    isIncluded: function isIncluded(type, key, request) {
      var include = request.queryParams.include;

      if (include) {
        return !!include.split(',').map(function (s) {
          return s.split('.');
        }).filter(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              includeType = _ref3[0],
              includeAttribute = _ref3[1];

          return includeType === type && includeAttribute === key;
        }).length;
      }
    },
    includeAttribute: function includeAttribute(key, type, representation) {
      return this.getAttributes(key, type, representation).includes(key);
    },
    relationships: function relationships() {
      return [];
    },
    serializerFor: function serializerFor(type) {
      var serializersMap = {
        'commit': 'commit-v3',
        'user': 'user-v3'
      };
      type = serializersMap[type] || type;

      return this.registry.serializerFor(type);
    },
    hrefForCollection: function hrefForCollection(type /* , collection, request */) {
      return '/' + type;
    },
    hrefForSingle: function hrefForSingle(type, model) {
      return '/' + type + '/' + model.id;
    },
    alreadyProcessed: function alreadyProcessed(model, request) {
      var findFn = function findFn(r) {
        return r.id === model.id && r.modelName === model.modelName;
      };
      return request._processedRecords.find(findFn);
    },
    normalizeId: function normalizeId(_model, id) {
      return parseInt(id);
    },
    representation: function representation(model, request, options) {
      if (options.representation) {
        return options.representation;
      } else if (options.topLevel) {
        return 'standard';
      } else {
        return 'minimal';
      }
    }
  });
});