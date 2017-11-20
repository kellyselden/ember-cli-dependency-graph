define('travis/serializers/v3', ['exports', 'ember-data/serializers/json', 'travis/utils/wrap-with-array', 'travis/utils/traverse-payload'], function (exports, _json, _wrapWithArray, _traversePayload) {
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

  var underscore = Ember.String.underscore;
  var isArray = Ember.isArray;
  var isNone = Ember.isNone;
  var typeOf = Ember.typeOf;
  exports.default = _json.default.extend({
    extractRelationships: function extractRelationships(modelClass, resourceHash) {
      var _this = this;

      var relationships = {};

      modelClass.eachRelationship(function (key, relationshipMeta) {
        var relationship = null;
        var relationshipKey = _this.keyForRelationship(key, relationshipMeta.kind, 'deserialize');
        var relationshipHash = resourceHash[relationshipKey];

        if (relationshipHash) {
          var data = null;
          if (relationshipMeta.kind === 'belongsTo') {
            if (relationshipMeta.options.polymorphic) {
              // extracting a polymorphic belongsTo may need more information
              // than the type and the hash (which might only be an id) for the
              // relationship, hence we pass the key, resource and
              // relationshipMeta too
              var options = {
                key: key,
                resourceHash: resourceHash,
                relationshipMeta: relationshipMeta
              };
              data = _this.extractPolymorphicRelationship(relationshipMeta.type, relationshipHash, options);
            } else {
              data = _this.extractRelationship(relationshipMeta.type, relationshipHash);
            }
          } else if (relationshipMeta.kind === 'hasMany') {
            if (!isNone(relationshipHash)) {
              data = new Array(relationshipHash.length);
              for (var i = 0, l = relationshipHash.length; i < l; i++) {
                var item = relationshipHash[i];
                data[i] = _this.extractRelationship(relationshipMeta.type, item);
              }
            }
          }
          relationship = data;
        }

        if (relationship) {
          relationships[key] = relationship;
        }
      });

      return relationships;
    },
    extractRelationship: function extractRelationship(type, hash) {
      if (hash && !hash.id && hash['@href']) {
        hash.id = hash['@href'];
      }

      var relationshipHash = this._super.apply(this, arguments);
      if (relationshipHash && relationshipHash['@type']) {
        relationshipHash.type = this.getType(relationshipHash['@type']);
      } else if (relationshipHash && !relationshipHash.type) {
        relationshipHash.type = type;
      }

      var modelClass = this.store.modelFor(relationshipHash.type);
      var serializer = this.store.serializerFor(relationshipHash.type);
      return serializer.normalize(modelClass, relationshipHash);
    },
    keyForRelationship: function keyForRelationship(key /* , typeClass, method*/) {
      if (key === 'repo') {
        return 'repository';
      } else if (key && key.underscore) {
        return key.underscore();
      } else {
        return key;
      }
    },
    extractAttributes: function extractAttributes() /* modelClass,resourceHash*/{
      var attributes = this._super.apply(this, arguments);
      for (var key in attributes) {
        if (key.startsWith('@')) {
          delete attributes.key;
        }
      }

      return attributes;
    },
    normalizeResponse: function normalizeResponse(store, primaryModelClass, payload /* , id, requestType*/) {
      this._fixReferences(payload);
      return this._super.apply(this, arguments);
    },
    normalizeArrayResponse: function normalizeArrayResponse(store, primaryModelClass, payload /* , id, requestType*/) {
      var _this2 = this;

      var documentHash = {
        data: null,
        included: []
      };

      var meta = this.extractMeta(store, primaryModelClass, payload) || {},
          pagination = payload['@pagination'];

      if (pagination) {
        meta.pagination = pagination;
      }

      var metaType = typeOf(meta);
      var metaIsObject = metaType == 'object';
      var errorMessage = 'The \'meta\' returned from \'extractMeta\' has to be an object, not ' + metaType + '.';
      (true && !(metaIsObject) && Ember.assert(errorMessage, metaIsObject));

      documentHash.meta = meta;

      var items = void 0;
      var type = payload['@type'];
      if (type) {
        items = payload[type];
      } else {
        var plural = primaryModelClass.modelName.underscore() + 's';
        items = payload[plural];
      }

      documentHash.data = items.map(function (item) {
        var _normalize = _this2.normalize(primaryModelClass, item),
            data = _normalize.data,
            included = _normalize.included;

        if (included) {
          var _documentHash$include;

          (_documentHash$include = documentHash.included).push.apply(_documentHash$include, _toConsumableArray(included));
        }
        return data;
      });

      return documentHash;
    },
    normalize: function normalize(modelClass, resourceHash) {
      var _super = this._super.apply(this, arguments),
          data = _super.data,
          meta = _super.meta,
          included = _super.included;

      if (!resourceHash['@type']) {
        return { data: data, included: included, meta: meta };
      }

      meta = meta || {};
      included = included || [];

      if (!meta['representation']) {
        meta.representation = resourceHash['@representation'];
      }

      // if we have relationship data, attempt to include those as sideloaded
      // records by adding them to the included array.
      // We must have both relationships *and* included specified for this to
      // work.
      if (data.relationships) {
        Object.keys(data.relationships).forEach(function (key) {
          var relationship = data.relationships[key];
          var relationshipHashes = (0, _wrapWithArray.default)(relationship);

          relationshipHashes.forEach(function (relationshipHash) {
            var meta = relationshipHash.meta || {};
            var relationshipIncluded = relationshipHash.included || [];

            if (meta.representation === 'standard') {
              included.push(relationshipHash.data);
            }

            relationshipIncluded.forEach(function (item) {
              return included.push(item);
            });
          });

          if (isArray(relationship)) {
            data.relationships[key] = {
              data: relationship.map(function (_ref) {
                var data = _ref.data;
                var id = data.id,
                    type = data.type;

                return { id: id, type: type };
              })
            };
          } else {
            data.relationships[key] = {
              data: {
                id: relationship.data.id, type: relationship.data.type
              }
            };
          }
        });
      }

      return { data: data, included: included, meta: meta };
    },
    keyForAttribute: function keyForAttribute(key) {
      return underscore(key);
    },
    getType: function getType(type) {
      return type === 'repository' ? 'repo' : type;
    },
    _fixReferences: function _fixReferences(payload) {
      var byHref = {},
          records = void 0;
      if (payload['@type']) {
        // API V3 doesn't return all of the objects in a full representation
        // If an object is present in one place in the response, all of the
        // other occurences will be just references of a kind - they will just
        // include @href property.
        //
        // I don't want to identify records by href in ember-data, so here I'll
        // set an id and a @type field on all of the references.
        //
        // First we need to group all of the items in the response by href:
        (0, _traversePayload.default)(payload, function (item) {
          var href = item['@href'];
          if (href) {
            var _records = byHref[href];
            if (_records) {
              _records.push(item);
            } else {
              byHref[href] = [item];
            }
          }
        });

        // Then we can choose a record with an id for each href and put the id
        // in all of the other occurences.
        for (var href in byHref) {
          records = byHref[href];
          var recordWithAnId = records.find(function (record) {
            return record.id;
          });
          if (recordWithAnId) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = records[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var record = _step.value;

                record.id = recordWithAnId.id;
                // record['@type'] = recordWithAnId['@type'];
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }
        }
      }

      return payload;
    }
  });
});