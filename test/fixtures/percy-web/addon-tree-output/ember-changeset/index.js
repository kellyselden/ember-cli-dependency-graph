define('ember-changeset/index', ['exports', 'ember', 'ember-changeset/utils/computed/object-to-array', 'ember-changeset/utils/computed/is-empty-object', 'ember-changeset/utils/is-promise', 'ember-changeset/utils/is-object', 'ember-changeset/utils/assign', 'ember-changeset/utils/object-without', 'ember-changeset/utils/includes', 'ember-changeset/utils/take', 'ember-changeset/utils/is-changeset'], function (exports, _ember, _emberChangesetUtilsComputedObjectToArray, _emberChangesetUtilsComputedIsEmptyObject, _emberChangesetUtilsIsPromise, _emberChangesetUtilsIsObject, _emberChangesetUtilsAssign, _emberChangesetUtilsObjectWithout, _emberChangesetUtilsIncludes, _emberChangesetUtilsTake, _emberChangesetUtilsIsChangeset) {
  exports.changeset = changeset;

  function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var EmberObject = _ember['default'].Object;
  var _Ember$RSVP = _ember['default'].RSVP;
  var all = _Ember$RSVP.all;
  var resolve = _Ember$RSVP.resolve;
  var _Ember$computed = _ember['default'].computed;
  var not = _Ember$computed.not;
  var readOnly = _Ember$computed.readOnly;
  var Evented = _ember['default'].Evented;
  var emberArray = _ember['default'].A;
  var assert = _ember['default'].assert;
  var get = _ember['default'].get;
  var isArray = _ember['default'].isArray;
  var isEmpty = _ember['default'].isEmpty;
  var isEqual = _ember['default'].isEqual;
  var isNone = _ember['default'].isNone;
  var isPresent = _ember['default'].isPresent;
  var set = _ember['default'].set;
  var setProperties = _ember['default'].setProperties;
  var typeOf = _ember['default'].typeOf;
  var keys = Object.keys;

  var CONTENT = '_content';
  var CHANGES = '_changes';
  var ERRORS = '_errors';
  var VALIDATOR = '_validator';
  var OPTIONS = '_options';
  var RUNNING_VALIDATIONS = '_runningValidations';
  var BEFORE_VALIDATION_EVENT = 'beforeValidation';
  var AFTER_VALIDATION_EVENT = 'afterValidation';

  function defaultValidatorFn() {
    return true;
  }

  var defaultOptions = { skipValidate: false };

  /**
   * Creates new changesets.
   *
   * @uses Ember.Evented
   * @param  {Object} obj
   * @param  {Function} validateFn
   * @param  {Object} validationMap
   * @param  {Object}  options
   * @return {Ember.Object}
   */

  function changeset(obj) {
    var validateFn = arguments.length <= 1 || arguments[1] === undefined ? defaultValidatorFn : arguments[1];
    var validationMap = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
    var options = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    assert('Underlying object for changeset is missing', isPresent(obj));

    return EmberObject.extend(Evented, {
      /**
       * Internal descriptor for changeset identification
       *
       * @private
       * @property __changeset__
       * @type {String}
       */
      __changeset__: _emberChangesetUtilsIsChangeset.CHANGESET,

      changes: (0, _emberChangesetUtilsComputedObjectToArray['default'])(CHANGES, false),
      errors: (0, _emberChangesetUtilsComputedObjectToArray['default'])(ERRORS, true),
      change: readOnly(CHANGES),
      error: readOnly(ERRORS),

      isValid: (0, _emberChangesetUtilsComputedIsEmptyObject['default'])(ERRORS),
      isPristine: (0, _emberChangesetUtilsComputedIsEmptyObject['default'])(CHANGES),
      isInvalid: not('isValid').readOnly(),
      isDirty: not('isPristine').readOnly(),

      init: function init() {
        this._super.apply(this, arguments);
        this[CONTENT] = obj;
        this[CHANGES] = {};
        this[ERRORS] = {};
        this[VALIDATOR] = validateFn;
        this[OPTIONS] = (0, _emberChangesetUtilsAssign['default'])(defaultOptions, options);
        this[RUNNING_VALIDATIONS] = {};
      },

      /**
       * Proxies `get` to the underlying content or changed value, if present.
       *
       * @public
       * @param  {String} key
       * @return {Any}
       */
      unknownProperty: function unknownProperty(key) {
        return this._valueFor(key);
      },

      /**
       * Stores change on the changeset.
       *
       * @public
       * @param  {String} key
       * @param  {Any} value
       * @return {Any}
       */
      setUnknownProperty: function setUnknownProperty(key, value) {
        var changesetOptions = get(this, OPTIONS);
        var skipValidate = get(changesetOptions, 'skipValidate');
        if (skipValidate) {
          return this._setProperty(true, { key: key, value: value });
        }
        return this._validateAndSet(key, value);
      },

      /**
       * String representation for the changeset.
       *
       * @public
       * @return {String}
       */
      toString: function toString() {
        var normalisedContent = (0, _emberChangesetUtilsAssign['default'])(get(this, CONTENT), {});
        return 'changeset:' + normalisedContent.toString();
      },

      /**
       * Provides a function to run before emitting changes to the model. The
       * callback function must return a hash in the same shape:
       *
       * ```
       * changeset
       *   .prepare((changes) => {
       *     let modified = {};
       *
       *     for (let key in changes) {
       *       modified[underscore(key)] = changes[key];
       *     }
       *
       *    return modified; // { first_name: "Jim", last_name: "Bob" }
       *  })
       *  .execute(); // execute the changes
       * ```
       *
       * @public
       * @chainable
       * @param  {Function} prepareChangesFn
       * @return {Changeset}
       */
      prepare: function prepare(prepareChangesFn) {
        var changes = (0, _emberChangesetUtilsAssign['default'])(get(this, CHANGES));
        var preparedChanges = prepareChangesFn(changes);

        assert('Callback to `changeset.prepare` must return an object', (0, _emberChangesetUtilsIsObject['default'])(preparedChanges));

        set(this, CHANGES, preparedChanges);

        return this;
      },

      /**
       * Executes the changeset if in a valid state.
       *
       * @public
       * @chainable
       * @return {Changeset}
       */
      execute: function execute() {
        if (get(this, 'isValid') && get(this, 'isDirty')) {
          var content = get(this, CONTENT);
          var changes = get(this, CHANGES);
          setProperties(content, changes);
        }

        return this;
      },

      /**
       * Executes the changeset and saves the underlying content.
       *
       * @async
       * @public
       * @param  {Object} options optional object to pass to content save method
       * @return {Promise}
       */
      save: function save(options) {
        var _this = this;

        var content = get(this, CONTENT);
        var savePromise = resolve(this);

        this.execute();

        if (typeOf(content.save) === 'function') {
          savePromise = content.save(options);
        }

        return savePromise.then(function (result) {
          _this.rollback();
          return result;
        });
      },

      /**
       * Returns the changeset to its pristine state, and discards changes and
       * errors.
       *
       * @public
       * @chainable
       * @return {Changeset}
       */
      rollback: function rollback() {
        this._notifyVirtualProperties();
        set(this, CHANGES, {});
        set(this, ERRORS, {});

        return this;
      },

      /**
       * Merges 2 valid changesets and returns a new changeset. Both changesets
       * must point to the same underlying object. The changeset target is the
       * origin. For example:
       *
       * ```
       * let changesetA = new Changeset(user, validatorFn);
       * let changesetB = new Changeset(user, validatorFn);
       * changesetA.set('firstName', 'Jim');
       * changesetB.set('firstName', 'Jimmy');
       * changesetB.set('lastName', 'Fallon');
       * let changesetC = changesetA.merge(changesetB);
       * changesetC.execute();
       * user.get('firstName'); // "Jimmy"
       * user.get('lastName'); // "Fallon"
       * ```
       *
       * @public
       * @chainable
       * @param  {Changeset} changeset
       * @return {Changeset}
       */
      merge: function merge(changeset) {
        var content = get(this, CONTENT);
        assert('Cannot merge with a non-changeset', (0, _emberChangesetUtilsIsChangeset['default'])(changeset));
        assert('Cannot merge with a changeset of different content', get(changeset, CONTENT) === content);

        if (get(this, 'isPristine') && get(changeset, 'isPristine')) {
          return this;
        }

        var changesA = get(this, CHANGES);
        var changesB = get(changeset, CHANGES);
        var errorsA = get(this, ERRORS);
        var errorsB = get(changeset, ERRORS);
        var newChangeset = new Changeset(content, get(this, VALIDATOR));
        var newErrors = (0, _emberChangesetUtilsObjectWithout['default'])(keys(changesB), errorsA);
        var newChanges = (0, _emberChangesetUtilsObjectWithout['default'])(keys(errorsB), changesA);
        var mergedChanges = (0, _emberChangesetUtilsAssign['default'])(newChanges, changesB);
        var mergedErrors = (0, _emberChangesetUtilsAssign['default'])(newErrors, errorsB);

        newChangeset[CHANGES] = mergedChanges;
        newChangeset[ERRORS] = mergedErrors;
        newChangeset._notifyVirtualProperties();

        return newChangeset;
      },

      /**
       * Validates the changeset immediately against the validationMap passed in.
       * If no key is passed into this method, it will validate all fields on the
       * validationMap and set errors accordingly. Will throw an error if no
       * validationMap is present.
       *
       * @async
       * @public
       * @param  {String|Undefined} key
       * @return {Promise}
       */
      validate: function validate(key) {
        var _this2 = this;

        if (keys(validationMap).length === 0) {
          return resolve(null);
        }

        if (isNone(key)) {
          var maybePromise = keys(validationMap).map(function (validationKey) {
            return _this2._validateAndSet(validationKey, _this2._valueFor(validationKey));
          });

          return all(maybePromise);
        }

        return resolve(this._validateAndSet(key, this._valueFor(key)));
      },

      /**
       * Checks to see if async validator for a given key has not resolved.
       * If no key is provided it will check to see if any async validator is running.
       *
       * @public
       * @param  {String|Undefined} key
       * @return {boolean}
       */
      isValidating: function isValidating(key) {
        var runningValidations = get(this, RUNNING_VALIDATIONS);
        var ks = emberArray(keys(runningValidations));
        if (key) {
          return ks.includes(key);
        }

        return !isEmpty(ks);
      },

      /**
       * Manually add an error to the changeset. If there is an existing error or
       * change for `key`, it will be overwritten.
       *
       * @public
       * @param {String} key
       * @param {Any} options.value
       * @param {Any} options.validation Validation message
       * @return {Any}
       */
      addError: function addError(key, options) {
        var errors = get(this, ERRORS);

        if (!(0, _emberChangesetUtilsIsObject['default'])(options)) {
          var value = get(this, key);
          options = { value: value, validation: options };
        }

        this._deleteKey(CHANGES, key);
        this.notifyPropertyChange(ERRORS);
        this.notifyPropertyChange(key);

        return set(errors, key, options);
      },

      /**
       * Manually push multiple errors to the changeset as an array. If there is
       * an existing error or change for `key`. it will be overwritten.
       *
       * @param  {String} key
       * @param  {...[String]} newErrors
       * @return {Any}
       */
      pushErrors: function pushErrors(key) {
        var errors = get(this, ERRORS);
        var existingError = get(errors, key) || { validation: [] };
        var validation = existingError.validation;

        var value = get(this, key);

        if (!isArray(validation) && isPresent(validation)) {
          existingError.validation = [existingError.validation];
        }

        for (var _len = arguments.length, newErrors = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          newErrors[_key - 1] = arguments[_key];
        }

        validation = [].concat(_toConsumableArray(existingError.validation), newErrors);

        this._deleteKey(CHANGES, key);
        this.notifyPropertyChange(ERRORS);
        this.notifyPropertyChange(key);

        return set(errors, key, { value: value, validation: validation });
      },

      /**
       * Creates a snapshot of the changeset's errors and changes.
       *
       * @public
       * @return {Object} snapshot
       */
      snapshot: function snapshot() {
        return {
          changes: (0, _emberChangesetUtilsAssign['default'])(get(this, CHANGES)),
          errors: (0, _emberChangesetUtilsAssign['default'])(get(this, ERRORS))
        };
      },

      /**
       * Restores a snapshot of changes and errors. This overrides existing
       * changes and errors.
       *
       * @public
       * @chainable
       * @param  {Object} options.changes
       * @param  {Object} options.errors
       * @return {Changeset}
       */
      restore: function restore(_ref) {
        var changes = _ref.changes;
        var errors = _ref.errors;

        set(this, CHANGES, changes);
        set(this, ERRORS, errors);
        this._notifyVirtualProperties();

        return this;
      },

      /**
       * Unlike `Ecto.Changeset.cast`, `cast` will take allowed keys and
       * remove unwanted keys off of the changeset. For example, this method
       * can be used to only allow specified changes through prior to saving.
       *
       * @public
       * @chainable
       * @param  {Array} allowed Array of allowed keys
       * @return {Changeset}
       */
      cast: function cast() {
        var allowed = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

        var changes = get(this, CHANGES);

        if (isArray(allowed) && allowed.length === 0) {
          return changes;
        }

        var changeKeys = keys(changes);
        var validKeys = emberArray(changeKeys).filter(function (key) {
          return (0, _emberChangesetUtilsIncludes['default'])(allowed, key);
        });
        var casted = (0, _emberChangesetUtilsTake['default'])(changes, validKeys);

        set(this, CHANGES, casted);

        return this;
      },

      /**
       * For a given key and value, set error or change.
       *
       * @private
       * @param  {String} key
       * @param  {Any} value
       * @return {Any}
       */
      _validateAndSet: function _validateAndSet(key, value) {
        var _this3 = this;

        var content = get(this, CONTENT);
        var oldValue = get(content, key);
        var validation = this._validate(key, value, oldValue);

        if ((0, _emberChangesetUtilsIsPromise['default'])(validation)) {
          this._setIsValidating(key, true);
          this.trigger(BEFORE_VALIDATION_EVENT, key);
          return validation.then(function (resolvedValidation) {
            _this3._setIsValidating(key, false);
            _this3.trigger(AFTER_VALIDATION_EVENT, key);
            return _this3._setProperty(resolvedValidation, { key: key, value: value, oldValue: oldValue });
          });
        }

        this.trigger(BEFORE_VALIDATION_EVENT, key);
        this.trigger(AFTER_VALIDATION_EVENT, key);
        return this._setProperty(validation, { key: key, value: value, oldValue: oldValue });
      },

      /**
       * Validates a given key and value.
       *
       * @private
       * @param {String} key
       * @param {Any} newValue
       * @param {Any} oldValue
       * @return {Boolean|String}
       */
      _validate: function _validate(key, newValue, oldValue) {
        var changes = get(this, CHANGES);
        var validator = get(this, VALIDATOR);
        var content = get(this, CONTENT);

        if (typeOf(validator) === 'function') {
          var isValid = validator({
            key: key,
            newValue: newValue,
            oldValue: oldValue,
            changes: (0, _emberChangesetUtilsAssign['default'])(changes),
            content: content
          });

          return isPresent(isValid) ? isValid : true;
        }

        return true;
      },

      /**
       * Sets property or error on the changeset.
       *
       * @private
       * @param {Boolean|Array|String} validation
       * @param {String} options.key
       * @param {Any} options.value
       * @return {Any}
       */
      _setProperty: function _setProperty(validation) {
        var _ref2 = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        var key = _ref2.key;
        var value = _ref2.value;
        var oldValue = _ref2.oldValue;

        var changes = get(this, CHANGES);
        var isSingleValidationArray = isArray(validation) && validation.length === 1 && validation[0] === true;

        if (validation === true || isSingleValidationArray) {
          this._deleteKey(ERRORS, key);

          if (!isEqual(oldValue, value)) {
            set(changes, key, value);
          } else if (key in changes) {
            delete changes[key];
          }
          this.notifyPropertyChange(CHANGES);
          this.notifyPropertyChange(key);

          var errors = get(this, ERRORS);
          if (errors['__ember_meta__'] && errors['__ember_meta__']['values']) {
            delete errors['__ember_meta__']['values'][key];
            set(this, ERRORS, errors);
          }

          return value;
        }

        return this.addError(key, { value: value, validation: validation });
      },

      /**
       * Updates the cache that stores the number of running validations
       * for a given key.
       *
       * @private
       * @param {String} key
       * @param {Boolean} value
       */
      _setIsValidating: function _setIsValidating(key, value) {
        var runningValidations = get(this, RUNNING_VALIDATIONS);
        var count = get(runningValidations, key) || 0;

        if (value) {
          set(runningValidations, key, count + 1);
        } else {
          if (count === 1) {
            delete runningValidations[key];
          } else {
            set(runningValidations, key, count - 1);
          }
        }
      },

      /**
       * Value for change or the original value.
       *
       * @private
       * @param  {String} key
       * @return {Any}
       */
      _valueFor: function _valueFor(key) {
        var changes = get(this, CHANGES);
        var errors = get(this, ERRORS);
        var content = get(this, CONTENT);

        if (errors.hasOwnProperty(key)) {
          return get(errors, key + '.value');
        }

        if (changes.hasOwnProperty(key)) {
          return get(changes, key);
        }

        return get(content, key);
      },

      /**
       * Notifies all virtual properties set on the changeset of a change.
       *
       * @private
       * @return {Void}
       */
      _notifyVirtualProperties: function _notifyVirtualProperties() {
        var rollbackKeys = [].concat(_toConsumableArray(keys(get(this, CHANGES))), _toConsumableArray(keys(get(this, ERRORS))));

        for (var i = 0; i < rollbackKeys.length; i++) {
          this.notifyPropertyChange(rollbackKeys[i]);
        }
      },

      /**
       * Deletes a key off an object and notifies observers.
       *
       * @private
       * @param  {String} objName
       * @param  {String} key
       * @return {Void}
       */
      _deleteKey: function _deleteKey(objName, key) {
        var obj = get(this, objName);

        if (isNone(obj)) {
          return;
        }

        if (obj.hasOwnProperty(key)) {
          delete obj[key];
          this.notifyPropertyChange(objName + '.' + key);
          this.notifyPropertyChange(objName);
        }
      }
    });
  }

  var Changeset =
  /**
   * Changeset factory
   *
   * @class Changeset
   * @constructor
   */
  function Changeset() {
    _classCallCheck(this, Changeset);

    return changeset.apply(undefined, arguments).create();
  };

  exports['default'] = Changeset;
});