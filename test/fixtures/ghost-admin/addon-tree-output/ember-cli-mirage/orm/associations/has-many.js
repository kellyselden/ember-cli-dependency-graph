define('ember-cli-mirage/orm/associations/has-many', ['exports', 'ember-cli-mirage/orm/associations/association', 'ember-cli-mirage/orm/collection', 'lodash/assign', 'lodash/compact', 'ember-cli-mirage/utils/inflector', 'ember-cli-mirage/utils/normalize-name', 'ember-cli-mirage/assert'], function (exports, _emberCliMirageOrmAssociationsAssociation, _emberCliMirageOrmCollection, _lodashAssign, _lodashCompact, _emberCliMirageUtilsInflector, _emberCliMirageUtilsNormalizeName, _emberCliMirageAssert) {
  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

  /**
   * @class HasMany
   * @extends Association
   * @constructor
   * @public
   */

  var HasMany = (function (_Association) {
    _inherits(HasMany, _Association);

    function HasMany() {
      _classCallCheck(this, HasMany);

      _get(Object.getPrototypeOf(HasMany.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(HasMany, [{
      key: 'getForeignKeyArray',

      /**
       * @method getForeignKeyArray
       * @return {Array} Array of camelized model name of associated objects
       * and foreign key for the object owning the association
       * @public
       */
      value: function getForeignKeyArray() {
        return [(0, _emberCliMirageUtilsInflector.camelize)(this.modelName), this.getForeignKey()];
      }

      /**
       * @method getForeignKey
       * @return {String} Foreign key for the object owning the association
       * @public
       */
    }, {
      key: 'getForeignKey',
      value: function getForeignKey() {
        return (this.opts.inverse || (0, _emberCliMirageUtilsInflector.camelize)(this.ownerModelName)) + 'Id';
      }

      /**
       * Registers has-many association defined by given key on given model,
       * defines getters / setters for associated records and associated records' ids,
       * adds methods for creating unsaved child records and creating saved ones
       *
       * @method addMethodsToModelClass
       * @param {Function} ModelClass
       * @param {String} key
       * @param {Schema} schema
       * @public
       */
    }, {
      key: 'addMethodsToModelClass',
      value: function addMethodsToModelClass(ModelClass, key, schema) {
        var modelPrototype = ModelClass.prototype;
        this._model = modelPrototype;
        this._key = key;

        var association = this;
        var foreignKey = this.getForeignKey();
        var relationshipIdsKey = (0, _emberCliMirageUtilsInflector.camelize)((0, _emberCliMirageUtilsInflector.singularize)(association.key)) + 'Ids';
        var associationHash = _defineProperty({}, key, this);

        modelPrototype.hasManyAssociations = (0, _lodashAssign['default'])(modelPrototype.hasManyAssociations, associationHash);
        modelPrototype.associationKeys.push(key);
        modelPrototype.associationIdKeys.push(relationshipIdsKey);

        Object.defineProperty(modelPrototype, relationshipIdsKey, {

          /*
            object.childrenIds
              - returns an array of the associated children's ids
          */
          get: function get() {
            var children = association._cachedChildren || new _emberCliMirageOrmCollection['default'](association.modelName);

            if (!this.isNew()) {
              var query = _defineProperty({}, foreignKey, this.id);
              var savedChildren = schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].where(query);

              children.mergeCollection(savedChildren);
            }

            return children.models.map(function (model) {
              return model.id;
            });
          },

          /*
            object.childrenIds = ([childrenIds...])
              - sets the associated parent (via id)
          */
          set: function set(ids) {
            ids = ids || [];

            if (this.isNew()) {
              association._cachedChildren = schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].find(ids);
            } else {
              // Set current children's fk to null
              var query = _defineProperty({}, foreignKey, this.id);
              schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].where(query).update(foreignKey, null);

              // Associate the new childrens to this model
              schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].find(ids).update(foreignKey, this.id);

              // Clear out any old cached children
              association._cachedChildren = new _emberCliMirageOrmCollection['default'](association.modelName);
            }

            return this;
          }
        });

        Object.defineProperty(modelPrototype, key, {

          /*
            object.children
              - returns an array of associated children
          */
          get: function get() {
            var temporaryChildren = association._cachedChildren || new _emberCliMirageOrmCollection['default'](association.modelName);

            if (this.isNew()) {
              return temporaryChildren;
            } else {
              var query = _defineProperty({}, foreignKey, this.id);
              var savedChildren = schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].where(query);

              return savedChildren.mergeCollection(temporaryChildren);
            }
          },

          /*
            object.children = [model1, model2, ...]
              - sets the associated children (via array of models)
              - note: this method will persist unsaved chidren
                + (why? because rails does)
          */
          set: function set(models) {
            models = models ? (0, _lodashCompact['default'])(models) : [];

            if (this.isNew()) {
              association._cachedChildren = models instanceof _emberCliMirageOrmCollection['default'] ? models : new _emberCliMirageOrmCollection['default'](association.modelName, models);
            } else {

              // Set current children's fk to null
              var query = _defineProperty({}, foreignKey, this.id);
              schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].where(query).update(foreignKey, null);

              // Save any children that are new
              models.filter(function (model) {
                return model.isNew();
              }).forEach(function (model) {
                return model.save();
              });

              // Associate the new children to this model
              schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].find(models.map(function (m) {
                return m.id;
              })).update(foreignKey, this.id);

              // Clear out any old cached children
              association._cachedChildren = new _emberCliMirageOrmCollection['default'](association.modelName);
            }
          }
        });

        /*
          object.newChild
            - creates a new unsaved associated child
        */
        modelPrototype['new' + (0, _emberCliMirageUtilsInflector.capitalize)((0, _emberCliMirageUtilsInflector.camelize)((0, _emberCliMirageUtilsInflector.singularize)(association.key)))] = function () {
          var attrs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          if (!this.isNew()) {
            attrs = (0, _lodashAssign['default'])(attrs, _defineProperty({}, foreignKey, this.id));
          }

          var child = schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)]['new'](attrs);

          association._cachedChildren = association._cachedChildren || new _emberCliMirageOrmCollection['default'](association.modelName);
          association._cachedChildren.models.push(child);

          return child;
        };

        /*
          object.createChild
            - creates an associated child, persists directly to db, and
              updates the association's foreign key
            - parent must be saved
        */
        modelPrototype['create' + (0, _emberCliMirageUtilsInflector.capitalize)((0, _emberCliMirageUtilsInflector.camelize)((0, _emberCliMirageUtilsInflector.singularize)(association.key)))] = function () {
          var attrs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

          (0, _emberCliMirageAssert['default'])(!this.isNew(), 'You cannot call create unless the parent is saved');

          var augmentedAttrs = (0, _lodashAssign['default'])(attrs, _defineProperty({}, foreignKey, this.id));
          var child = schema[(0, _emberCliMirageUtilsNormalizeName.toCollectionName)(association.modelName)].create(augmentedAttrs);

          return child;
        };
      }
    }]);

    return HasMany;
  })(_emberCliMirageOrmAssociationsAssociation['default']);

  exports['default'] = HasMany;
});