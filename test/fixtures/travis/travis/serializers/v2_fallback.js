define('travis/serializers/v2_fallback', ['exports', 'travis/serializers/v3', 'travis/utils/wrap-with-array'], function (exports, _v, _wrapWithArray) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var isArray = Ember.isArray;
  exports.default = _v.default.extend({
    extractRelationships: function extractRelationships(modelClass, resourceHash) {
      var _this = this;

      if (resourceHash['@type']) {
        return this._super.apply(this, arguments);
      } else {
        var relationships = {};

        modelClass.eachRelationship(function (key, relationshipMeta) {
          // V2 API payload
          var relationship = null;
          var relationshipKey = _this.keyForV2Relationship(key, relationshipMeta.kind, 'deserialize');
          var alternativeRelationshipKey = key.underscore();
          var hashWithAltRelKey = resourceHash[alternativeRelationshipKey];
          var hashWithRelKey = resourceHash[relationshipKey];

          if (hashWithAltRelKey || hashWithRelKey) {
            var data = null;
            var relationshipHash = resourceHash[alternativeRelationshipKey] || resourceHash[relationshipKey];
            if (relationshipMeta.kind === 'belongsTo') {
              data = _this.extractRelationship(relationshipMeta.type, relationshipHash);
            } else if (relationshipMeta.kind === 'hasMany') {
              var type = relationshipMeta.type;

              data = relationshipHash.map(function (item) {
                return _this.extractRelationship(type, item);
              });
            }
            relationship = data;
          }

          if (relationship) {
            relationships[key] = relationship;
          }
        });

        return relationships;
      }
    },
    normalize: function normalize(modelClass, resourceHash) {
      if (resourceHash['@type']) {
        return this._super.apply(this, arguments);
      } else {
        var modelKey = modelClass.modelName;
        var attributes = resourceHash[modelKey];
        if (attributes) {
          for (var key in attributes) {
            resourceHash[key] = attributes[key];
          }

          resourceHash['type'] = modelKey;
          delete resourceHash[modelKey];
        }

        var _super = this._super.apply(this, arguments),
            data = _super.data,
            included = _super.included;

        if (!included) {
          included = [];
        }

        if (data.relationships) {
          Object.keys(data.relationships).forEach(function (key) {
            var relationship = data.relationships[key];
            var relationshipHashes = (0, _wrapWithArray.default)(relationship);

            relationshipHashes.forEach(function (relationshipHash) {
              var relationshipIncluded = relationshipHash.included || [];

              if (Object.keys(relationshipHash.data.attributes || {}).length === 0) {
                return;
              }

              included.push(relationshipHash.data);
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

        return { data: data, included: included };
      }
    },
    keyForV2Relationship: function keyForV2Relationship(key /* , typeClass, method*/) {
      if (key === 'repo') {
        return 'repository';
      }
      return key.underscore() + '_id';
    }
  });
});