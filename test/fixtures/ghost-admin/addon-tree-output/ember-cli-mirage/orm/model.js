define('ember-cli-mirage/orm/model', ['exports', 'ember-cli-mirage/utils/normalize-name', 'ember-cli-mirage/utils/extend', 'ember-cli-mirage/assert', 'ember-cli-mirage/orm/collection'], function (exports, _emberCliMirageUtilsNormalizeName, _emberCliMirageUtilsExtend, _emberCliMirageAssert, _emberCliMirageOrmCollection) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  /*
    The Model class. Notes:
  
    - We need to pass in modelName, because models are created with
      .extend and anonymous functions, so you cannot use
      reflection to find the name of the constructor.
  */

  /*
    Constructor
  */

  var Model = (function () {
    function Model(schema, modelName, attrs, fks) {
      _classCallCheck(this, Model);

      (0, _emberCliMirageAssert['default'])(schema, 'A model requires a schema');
      (0, _emberCliMirageAssert['default'])(modelName, 'A model requires a modelName');

      this._schema = schema;
      this.modelName = modelName;
      this.fks = fks || [];
      attrs = attrs || {};

      this._setupAttrs(attrs);
      this._setupRelationships(attrs);

      return this;
    }

    /**
     * Creates or saves the model.
     * @method save
     * @return this
     * @public
     */

    _createClass(Model, [{
      key: 'save',
      value: function save() {
        var collection = (0, _emberCliMirageUtilsNormalizeName.toCollectionName)(this.modelName);

        if (this.isNew()) {
          // Update the attrs with the db response
          this.attrs = this._schema.db[collection].insert(this.attrs);

          // Ensure the id getter/setter is set
          this._definePlainAttribute('id');
        } else {
          this._schema.db[collection].update(this.attrs.id, this.attrs);
        }

        // Update associated children
        this._saveAssociations();

        return this;
      }

      /**
       * Update the record in the db.
       * @method update
       * @param {String} key
       * @param {String} val
       * @return this
       * @public
       */
    }, {
      key: 'update',
      value: function update(key, val) {
        var attrs = undefined;
        if (key == null) {
          return this;
        }

        if (typeof key === 'object') {
          attrs = key;
        } else {
          (attrs = {})[key] = val;
        }

        Object.keys(attrs).forEach(function (attr) {
          this._definePlainAttribute(attr);
          this[attr] = attrs[attr];
        }, this);

        this.save();

        return this;
      }

      /**
       * Destroys the db record
       * @method destroy
       * @public
       */
    }, {
      key: 'destroy',
      value: function destroy() {
        var collection = (0, _emberCliMirageUtilsNormalizeName.toCollectionName)(this.modelName);
        this._schema.db[collection].remove(this.attrs.id);
      }

      /**
       * Boolean, true if the model has not been persisted yet to the db.
       *
       * Originally this method simply checked if the model had an id; however,
       * we let people create models with pre-specified ids. So, we have to
       * check whether the record is in the actual databse or not.
       *
       * @method isNew
       * @return {Boolean}
       * @public
       */
    }, {
      key: 'isNew',
      value: function isNew() {
        var hasDbRecord = false;
        var hasId = this.attrs.id !== undefined && this.attrs.id !== null;

        if (hasId) {
          var collectionName = (0, _emberCliMirageUtilsNormalizeName.toCollectionName)(this.modelName);
          var record = this._schema.db[collectionName].find(this.attrs.id);
          if (record) {
            hasDbRecord = true;
          }
        }

        return !hasDbRecord;
      }

      /**
       * Boolean, opposite of `isNew`
       * @method isSaved
       * @return {Boolean}
       * @public
       */
    }, {
      key: 'isSaved',
      value: function isSaved() {
        return !this.isNew();
      }

      /**
       * Reload a model’s data from the database.
       * @method reload
       * @return this
       * @public
       */
    }, {
      key: 'reload',
      value: function reload() {
        var collection = (0, _emberCliMirageUtilsNormalizeName.toCollectionName)(this.modelName);
        var attrs = this._schema.db[collection].find(this.id);

        Object.keys(attrs).filter(function (attr) {
          return attr !== 'id';
        }).forEach(function (attr) {
          this[attr] = attrs[attr];
        }, this);

        return this;
      }
    }, {
      key: 'toJSON',
      value: function toJSON() {
        return this.attrs;
      }

      // Private

      /**
       * model.attrs represents the persistable attributes, i.e. your db
       * table fields.
       * @method _setupAttrs
       * @param attrs
       * @private
       */
    }, {
      key: '_setupAttrs',
      value: function _setupAttrs(attrs) {
        var _this = this;

        // Verify no undefined associations are passed in
        Object.keys(attrs).filter(function (key) {
          var value = attrs[key];
          return value instanceof Model || value instanceof _emberCliMirageOrmCollection['default'];
        }).forEach(function (key) {
          var modelOrCollection = attrs[key];

          (0, _emberCliMirageAssert['default'])(_this.associationKeys.indexOf(key) > -1, 'You\'re trying to create a ' + _this.modelName + ' model and you passed in a ' + modelOrCollection.toString() + ' under the ' + key + ' key, but you haven\'t defined that key as an association on your model.');
        });

        // Filter out association keys
        var hash = Object.keys(attrs).reduce(function (memo, key) {
          if (_this.associationKeys.indexOf(key) === -1 && _this.associationIdKeys.indexOf(key) === -1) {
            memo[key] = attrs[key];
          }
          return memo;
        }, {});

        // Ensure fks are there
        this.fks.map(function (fk) {
          hash[fk] = attrs[fk] || null;
        });

        this.attrs = hash;

        // define plain getter/setters for non-association keys
        Object.keys(hash).forEach(function (attr) {
          if (this.associationKeys.indexOf(attr) === -1 && this.associationIdKeys.indexOf(attr) === -1) {
            this._definePlainAttribute(attr);
          }
        }, this);
      }

      /**
       * Define getter/setter for a plain attribute
       * @method _definePlainAttribute
       * @param attr
       * @private
       */
    }, {
      key: '_definePlainAttribute',
      value: function _definePlainAttribute(attr) {

        // Ensure the property hasn't already been defined
        var existingProperty = Object.getOwnPropertyDescriptor(this, attr);
        if (existingProperty && existingProperty.get) {
          return;
        }

        // Ensure the attribute is on the attrs hash
        if (!this.attrs.hasOwnProperty(attr)) {
          this.attrs[attr] = null;
        }

        // Define the getter/setter
        Object.defineProperty(this, attr, {
          get: function get() {
            return this.attrs[attr];
          },
          set: function set(val) {
            this.attrs[attr] = val;
            return this;
          }
        });
      }

      /**
       * @method _setupRelationships
       * @param attrs
       * @private
       */
    }, {
      key: '_setupRelationships',
      value: function _setupRelationships(attrs) {
        var _this2 = this;

        // Only want association keys and fks
        var hash = Object.keys(attrs).reduce(function (memo, attr) {
          if (_this2.associationKeys.indexOf(attr) > -1 || _this2.associationIdKeys.indexOf(attr) > -1 || _this2.fks.indexOf(attr) > -1) {
            memo[attr] = attrs[attr];
          }
          return memo;
        }, {});

        Object.keys(hash).forEach(function (attr) {
          this[attr] = hash[attr];
        }, this);
      }

      /**
       * Update associated children when saving a collection
       * @method _saveAssociations
       * @private
       */
    }, {
      key: '_saveAssociations',
      value: function _saveAssociations() {
        var _this3 = this;

        Object.keys(this.belongsToAssociations).forEach(function (key) {
          var association = _this3.belongsToAssociations[key];
          var parent = _this3[key];
          if (parent && parent.isNew()) {
            var fk = association.getForeignKey();
            parent.save();
            _this3.update(fk, parent.id);
          }
        });

        Object.keys(this.hasManyAssociations).forEach(function (key) {
          var association = _this3.hasManyAssociations[key];
          var children = _this3[key];
          children.update(association.getForeignKey(), _this3.id);
        });
      }

      /**
       * Simple string representation of the model and id.
       * @method toString
       * @return {String}
       * @public
       */
    }, {
      key: 'toString',
      value: function toString() {
        return 'model:' + this.modelName + '(' + this.id + ')';
      }
    }]);

    return Model;
  })();

  Model.extend = _emberCliMirageUtilsExtend['default'];
  Model.findBelongsToAssociation = function (associationType) {
    return this.prototype.belongsToAssociations[associationType];
  };

  exports['default'] = Model;
});