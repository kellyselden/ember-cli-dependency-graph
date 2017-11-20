define('ember-data-factory-guy/converter/fixture-converter', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _class = function () {
    function _class(store) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { transformKeys: true, serializeMode: false };

      _classCallCheck(this, _class);

      this.transformKeys = options.transformKeys;
      this.serializeMode = options.serializeMode;
      this.store = store;
      this.listType = false;
      this.noTransformFn = function (x) {
        return x;
      };
      this.defaultValueTransformFn = this.noTransformFn;
    }

    /**
     Convert an initial fixture into a final payload.
     This raw fixture can contain other json in relationships that were
     built by FactoryGuy ( build, buildList ) methods
      @param modelName
     @param fixture
     @returns {*} converted fixture
     */


    _createClass(_class, [{
      key: 'convert',
      value: function convert(modelName, fixture) {
        var _this = this;

        var data = void 0;

        if (Ember.typeOf(fixture) === 'array') {
          this.listType = true;
          data = fixture.map(function (single) {
            return _this.convertSingle(modelName, single);
          });
        } else {
          data = this.convertSingle(modelName, fixture);
        }

        var payload = this.createPayload(modelName, data);

        this.addIncludedArray(payload);

        return payload;
      }
    }, {
      key: 'emptyResponse',
      value: function emptyResponse(_) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        return options.useValue || null;
      }
    }, {
      key: 'addPrimaryKey',
      value: function addPrimaryKey(modelName, data, fixture) {
        var primaryKey = this.store.serializerFor(modelName).get('primaryKey'),
            primaryKeyValue = fixture[primaryKey] || fixture.id;
        // model fragments will have no primaryKey and don't want them to have id
        if (primaryKeyValue) {
          // need to set the id for all as a baseline
          data.id = primaryKeyValue;
          // if the id is NOT the primary key, need to make sure that the primaryKey
          // has the primaryKey value
          data[primaryKey] = primaryKeyValue;
        }
      }
    }, {
      key: 'transformRelationshipKey',
      value: function transformRelationshipKey(relationship) {
        var transformFn = this.getTransformKeyFunction(relationship.type, 'Relationship');
        return transformFn(relationship.key, relationship.kind);
      }
    }, {
      key: 'getRelationshipType',
      value: function getRelationshipType(relationship, fixture) {
        var isPolymorphic = relationship.options.polymorphic;
        return isPolymorphic ? this.polymorphicTypeTransformFn(fixture.type) : relationship.type;
      }
    }, {
      key: 'attributeIncluded',
      value: function attributeIncluded(attribute, modelName) {
        if (!this.serializeMode) {
          return true;
        }
        var serializer = this.store.serializerFor(modelName),
            attrOptions = this.attrsOption(serializer, attribute);
        if (attrOptions && attrOptions.serialize === false) {
          return false;
        }
        return true;
      }
    }, {
      key: 'getTransformKeyFunction',
      value: function getTransformKeyFunction(modelName, type) {
        var _this2 = this;

        if (!this.transformKeys) {
          return this.noTransformFn;
        }

        var serializer = this.store.serializerFor(modelName),
            keyFn = serializer['keyFor' + type] || this.defaultKeyTransformFn;

        return function (attribute, method) {
          // if there is an attrs override in serializer, return that first
          var attrOptions = _this2.attrsOption(serializer, attribute),
              attrName = void 0;
          if (attrOptions) {
            if (attrOptions.key) {
              attrName = attrOptions.key;
            }
            if (Ember.typeOf(attrOptions) === "string") {
              attrName = attrOptions;
            }
          }
          return attrName || keyFn.apply(_this2, [attribute, method]);
        };
      }
    }, {
      key: 'getTransformValueFunction',
      value: function getTransformValueFunction(type) {
        if (!this.transformKeys || type && type.match('-mf')) {
          return this.noTransformFn;
        }
        if (!type) {
          return this.defaultValueTransformFn;
        }
        var container = Ember.getOwner ? Ember.getOwner(this.store) : this.store.container,
            transform = container.lookup('transform:' + type);

        Ember.assert('[ember-data-factory-guy] could not find\n    the [ ' + type + ' ] transform. If you are in a unit test, be sure \n    to include it in the list of needs as [ transform:' + type + ' ],  Or set your \n    unit test to be [ integration: true ] and include everything.', transform);

        var transformer = container.lookup('transform:' + type);
        return transformer.serialize.bind(transformer);
      }
    }, {
      key: 'extractAttributes',
      value: function extractAttributes(modelName, fixture) {
        var _this3 = this;

        var attributes = {},
            transformKeyFunction = this.getTransformKeyFunction(modelName, 'Attribute');

        this.store.modelFor(modelName).eachAttribute(function (attribute, meta) {
          if (_this3.attributeIncluded(attribute, modelName)) {
            var attributeKey = transformKeyFunction(attribute),
                transformValueFunction = _this3.getTransformValueFunction(meta.type);

            if (fixture.hasOwnProperty(attribute)) {
              attributes[attributeKey] = transformValueFunction(fixture[attribute]);
            } else if (fixture.hasOwnProperty(attributeKey)) {
              attributes[attributeKey] = transformValueFunction(fixture[attributeKey]);
            }
          }
        });
        return attributes;
      }
    }, {
      key: 'extractRelationships',
      value: function extractRelationships(modelName, fixture) {
        var _this4 = this;

        var relationships = {};

        this.store.modelFor(modelName).eachRelationship(function (key, relationship) {
          if (fixture.hasOwnProperty(key)) {
            if (relationship.kind === 'belongsTo') {
              _this4.extractBelongsTo(fixture, relationship, modelName, relationships);
            } else if (relationship.kind === 'hasMany') {
              _this4.extractHasMany(fixture, relationship, modelName, relationships);
            }
          }
        });

        return relationships;
      }
    }, {
      key: 'extractBelongsTo',
      value: function extractBelongsTo(fixture, relationship, parentModelName, relationships) {
        var belongsToRecord = fixture[relationship.key],
            isEmbedded = this.isEmbeddedRelationship(parentModelName, relationship.key),
            data = this.extractSingleRecord(belongsToRecord, relationship, isEmbedded),
            relationshipKey = isEmbedded ? relationship.key : this.transformRelationshipKey(relationship);

        relationships[relationshipKey] = this.assignRelationship(data);
      }
    }, {
      key: 'isEmbeddedRelationship',
      value: function isEmbeddedRelationship(modelName, attr) {
        var serializer = this.store.serializerFor(modelName),
            option = this.attrsOption(serializer, attr);
        return option && (option.embedded === 'always' || option.deserialize === 'records');
      }
    }, {
      key: 'attrsOption',
      value: function attrsOption(serializer, attr) {
        var attrs = serializer.get('attrs'),
            option = attrs && (attrs[Ember.String.camelize(attr)] || attrs[attr]);
        return option;
        //    return (option && option.key) ? option.key : option;
      }
    }, {
      key: 'extractHasMany',
      value: function extractHasMany(fixture, relationship, parentModelName, relationships) {
        var _this5 = this;

        var hasManyRecords = fixture[relationship.key],
            relationshipKey = this.transformRelationshipKey(relationship),
            isEmbedded = this.isEmbeddedRelationship(parentModelName, relationshipKey);

        if (hasManyRecords.isProxy) {
          return this.addListProxyData(hasManyRecords, relationship, relationships, isEmbedded);
        }

        if (Ember.typeOf(hasManyRecords) !== 'array') {
          return;
        }

        var records = hasManyRecords.map(function (hasManyRecord) {
          return _this5.extractSingleRecord(hasManyRecord, relationship, isEmbedded);
        });

        relationships[relationshipKey] = this.assignRelationship(records);
      }
    }, {
      key: 'extractSingleRecord',
      value: function extractSingleRecord(record, relationship, isEmbedded) {
        var data = void 0;
        switch (Ember.typeOf(record)) {

          case 'object':
            if (record.isProxy) {
              data = this.addProxyData(record, relationship, isEmbedded);
            } else {
              data = this.addData(record, relationship, isEmbedded);
            }
            break;

          case 'instance':
            data = this.normalizeAssociation(record, relationship);
            break;

          case 'number':
          case 'string':
            Ember.assert('Polymorphic relationships cannot be specified by id you\n          need to supply an object with id and type', !relationship.options.polymorphic);
            record = { id: record, type: relationship.type };
            data = this.normalizeAssociation(record, relationship);
        }

        return data;
      }
    }, {
      key: 'assignRelationship',
      value: function assignRelationship(object) {
        return object;
      }
    }, {
      key: 'addData',
      value: function addData(embeddedFixture, relationship, isEmbedded) {
        var relationshipType = this.getRelationshipType(relationship, embeddedFixture),

        // find possibly more embedded fixtures
        data = this.convertSingle(relationshipType, embeddedFixture);
        if (isEmbedded) {
          return data;
        }
        this.addToIncluded(data, relationshipType);
        return this.normalizeAssociation(data, relationship);
      }
    }, {
      key: 'addProxyData',
      value: function addProxyData(jsonProxy, relationship, isEmbedded) {
        var data = jsonProxy.getModelPayload(),
            relationshipType = this.getRelationshipType(relationship, data);
        if (isEmbedded) {
          this.addToIncludedFromProxy(jsonProxy);
          return data;
        }
        this.addToIncluded(data, relationshipType);
        this.addToIncludedFromProxy(jsonProxy);
        return this.normalizeAssociation(data, relationship);
      }
    }, {
      key: 'addListProxyData',
      value: function addListProxyData(jsonProxy, relationship, relationships, isEmbedded) {
        var _this6 = this;

        var relationshipKey = this.transformRelationshipKey(relationship);

        var records = jsonProxy.getModelPayload().map(function (data) {
          if (isEmbedded) {
            return data;
          }
          var relationshipType = _this6.getRelationshipType(relationship, data);
          _this6.addToIncluded(data, relationshipType);
          return _this6.normalizeAssociation(data, relationship);
        });

        this.addToIncludedFromProxy(jsonProxy);

        relationships[relationshipKey] = this.assignRelationship(records);
      }
    }]);

    return _class;
  }();

  exports.default = _class;
});