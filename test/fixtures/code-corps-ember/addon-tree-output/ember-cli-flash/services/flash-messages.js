define('ember-cli-flash/services/flash-messages', ['exports', 'ember-cli-flash/flash/object', 'ember-cli-flash/utils/object-without'], function (exports, _object, _objectWithout) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Service = Ember.Service,
      assert = Ember.assert,
      copy = Ember.copy,
      getWithDefault = Ember.getWithDefault,
      isNone = Ember.isNone,
      setProperties = Ember.setProperties,
      typeOf = Ember.typeOf,
      warn = Ember.warn,
      get = Ember.get,
      set = Ember.set,
      computed = Ember.computed,
      classify = Ember.String.classify,
      emberArray = Ember.A;
  var equal = computed.equal,
      sort = computed.sort,
      mapBy = computed.mapBy;


  var merge = Ember.assign || Ember.merge;

  exports.default = Service.extend({
    isEmpty: equal('queue.length', 0).readOnly(),
    _guids: mapBy('queue', '_guid').readOnly(),

    arrangedQueue: sort('queue', function (a, b) {
      if (a.priority < b.priority) {
        return 1;
      } else if (a.priority > b.priority) {
        return -1;
      }
      return 0;
    }).readOnly(),

    init: function init() {
      this._super.apply(this, arguments);
      this._setDefaults();
      this.queue = emberArray();
    },
    add: function add() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._enqueue(this._newFlashMessage(options));

      return this;
    },
    clearMessages: function clearMessages() {
      var flashes = get(this, 'queue');

      if (isNone(flashes)) {
        return;
      }

      flashes.clear();

      return this;
    },
    registerTypes: function registerTypes() {
      var _this = this;

      var types = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : emberArray();

      types.forEach(function (type) {
        return _this._registerType(type);
      });

      return this;
    },
    peekFirst: function peekFirst() {
      return get(this, 'queue.firstObject');
    },
    peekLast: function peekLast() {
      return get(this, 'queue.lastObject');
    },
    getFlashObject: function getFlashObject() {
      var errorText = 'A flash message must be added before it can be returned';
      assert(errorText, get(this, 'queue').length);

      return this.peekLast();
    },
    _newFlashMessage: function _newFlashMessage() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      assert('The flash message cannot be empty.', options.message);

      var flashService = this;
      var allDefaults = getWithDefault(this, 'flashMessageDefaults', {});
      var defaults = (0, _objectWithout.default)(allDefaults, ['types', 'injectionFactories', 'preventDuplicates']);

      var flashMessageOptions = merge(copy(defaults), { flashService: flashService });

      for (var key in options) {
        var value = get(options, key);
        var option = this._getOptionOrDefault(key, value);

        set(flashMessageOptions, key, option);
      }

      return _object.default.create(flashMessageOptions);
    },
    _getOptionOrDefault: function _getOptionOrDefault(key, value) {
      var defaults = getWithDefault(this, 'flashMessageDefaults', {});
      var defaultOption = get(defaults, key);

      if (typeOf(value) === 'undefined') {
        return defaultOption;
      }

      return value;
    },
    _setDefaults: function _setDefaults() {
      var defaults = getWithDefault(this, 'flashMessageDefaults', {});

      for (var key in defaults) {
        var classifiedKey = classify(key);
        var defaultKey = 'default' + classifiedKey;

        set(this, defaultKey, defaults[key]);
      }

      this.registerTypes(getWithDefault(this, 'defaultTypes', emberArray()));
    },
    _registerType: function _registerType(type) {
      var _this2 = this;

      assert('The flash type cannot be undefined', type);

      this[type] = function (message) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        var flashMessageOptions = copy(options);
        setProperties(flashMessageOptions, { message: message, type: type });

        return _this2.add(flashMessageOptions);
      };
    },
    _hasDuplicate: function _hasDuplicate(guid) {
      return get(this, '_guids').includes(guid);
    },
    _enqueue: function _enqueue(flashInstance) {
      var preventDuplicates = get(this, 'defaultPreventDuplicates');
      var guid = get(flashInstance, '_guid');

      if (preventDuplicates && this._hasDuplicate(guid)) {
        warn('Attempting to add a duplicate message to the Flash Messages Service', false, {
          id: 'ember-cli-flash.duplicate-message'
        });
        return;
      }

      return get(this, 'queue').pushObject(flashInstance);
    }
  });
});