define('ember-metrics/services/metrics', ['exports'], function (exports) {
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

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var Service = Ember.Service,
      getWithDefault = Ember.getWithDefault,
      assert = Ember.assert,
      get = Ember.get,
      set = Ember.set,
      copy = Ember.copy,
      makeArray = Ember.makeArray,
      emberArray = Ember.A,
      dasherize = Ember.String.dasherize,
      getOwner = Ember.getOwner;
  var keys = Object.keys;

  var assign = Ember.assign || Ember.merge;

  exports.default = Service.extend({
    /**
     * Cached adapters to reduce multiple expensive lookups.
     *
     * @property _adapters
     * @private
     * @type Object
     * @default null
     */
    _adapters: null,

    /**
     * Contextual information attached to each call to an adapter. Often you'll
     * want to include things like `currentUser.name` with every event or page
     * view  that's tracked. Any properties that you bind to `metrics.context`
     * will be merged into the options for every service call.
     *
     * @property context
     * @type Object
     * @default null
     */
    context: null,

    /**
     * Indicates whether calls to the service will be forwarded to the adapters
     *
     * @property enabled
     * @type Boolean
     * @default true
     */
    enabled: true,

    /**
     * When the Service is created, activate adapters that were specified in the
     * configuration. This config is injected into the Service as
     * `options`.
     *
     * @method init
     * @param {Void}
     * @return {Void}
     */
    init: function init() {
      var adapters = getWithDefault(this, 'options.metricsAdapters', emberArray());
      var owner = getOwner(this);
      owner.registerOptionsForType('ember-metrics@metrics-adapter', { instantiate: false });
      owner.registerOptionsForType('metrics-adapter', { instantiate: false });
      set(this, 'appEnvironment', getWithDefault(this, 'options.environment', 'development'));
      set(this, '_adapters', {});
      set(this, 'context', {});
      this.activateAdapters(adapters);
      this._super.apply(this, arguments);
    },
    identify: function identify() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      this.invoke.apply(this, ['identify'].concat(_toConsumableArray(args)));
    },
    alias: function alias() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.invoke.apply(this, ['alias'].concat(_toConsumableArray(args)));
    },
    trackEvent: function trackEvent() {
      for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }

      this.invoke.apply(this, ['trackEvent'].concat(_toConsumableArray(args)));
    },
    trackPage: function trackPage() {
      for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }

      this.invoke.apply(this, ['trackPage'].concat(_toConsumableArray(args)));
    },


    /**
     * Instantiates the adapters specified in the configuration and caches them
     * for future retrieval.
     *
     * @method activateAdapters
     * @param {Array} adapterOptions
     * @return {Object} instantiated adapters
     */
    activateAdapters: function activateAdapters() {
      var _this = this;

      var adapterOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var appEnvironment = get(this, 'appEnvironment');
      var cachedAdapters = get(this, '_adapters');
      var activatedAdapters = {};

      adapterOptions.filter(function (adapterOption) {
        return _this._filterEnvironments(adapterOption, appEnvironment);
      }).forEach(function (adapterOption) {
        var name = adapterOption.name;

        var adapter = cachedAdapters[name] ? cachedAdapters[name] : _this._activateAdapter(adapterOption);

        set(activatedAdapters, name, adapter);
      });

      return set(this, '_adapters', activatedAdapters);
    },


    /**
     * Invokes a method on the passed adapter, or across all activated adapters if not passed.
     *
     * @method invoke
     * @param {String} methodName
     * @param {Rest} args
     * @return {Void}
     */
    invoke: function invoke(methodName) {
      if (!get(this, 'enabled')) {
        return;
      }

      var cachedAdapters = get(this, '_adapters');
      var allAdapterNames = keys(cachedAdapters);

      var _ref = (arguments.length <= 1 ? 0 : arguments.length - 1) > 1 ? [makeArray(arguments.length <= 1 ? undefined : arguments[1]), arguments.length <= 2 ? undefined : arguments[2]] : [allAdapterNames, arguments.length <= 1 ? undefined : arguments[1]],
          _ref2 = _slicedToArray(_ref, 2),
          selectedAdapterNames = _ref2[0],
          options = _ref2[1];

      var context = copy(get(this, 'context'));
      var mergedOptions = assign(context, options);

      selectedAdapterNames.map(function (adapterName) {
        return get(cachedAdapters, adapterName);
      }).forEach(function (adapter) {
        return adapter && adapter[methodName](mergedOptions);
      });
    },


    /**
     * On teardown, destroy cached adapters together with the Service.
     *
     * @method willDestroy
     * @param {Void}
     * @return {Void}
     */
    willDestroy: function willDestroy() {
      var cachedAdapters = get(this, '_adapters');

      for (var adapterName in cachedAdapters) {
        get(cachedAdapters, adapterName).destroy();
      }
    },


    /**
     * Instantiates an adapter if one is found.
     *
     * @method _activateAdapter
     * @param {Object}
     * @private
     * @return {Adapter}
     */
    _activateAdapter: function _activateAdapter() {
      var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          name = _ref3.name,
          config = _ref3.config;

      var Adapter = this._lookupAdapter(name);
      assert('[ember-metrics] Could not find metrics adapter ' + name + '.', Adapter);

      return Adapter.create(getOwner(this).ownerInjection(), { this: this, config: config });
    },


    /**
     * Looks up the adapter from the container. Prioritizes the consuming app's
     * adapters over the addon's adapters.
     *
     * @method _lookupAdapter
     * @param {String} adapterName
     * @private
     * @return {Adapter} a local adapter or an adapter from the addon
     */
    _lookupAdapter: function _lookupAdapter(adapterName) {
      assert('[ember-metrics] Could not find metrics adapter without a name.', adapterName);

      var dasherizedAdapterName = dasherize(adapterName);
      var availableAdapter = getOwner(this).lookup('ember-metrics@metrics-adapter:' + dasherizedAdapterName);
      var localAdapter = getOwner(this).lookup('metrics-adapter:' + dasherizedAdapterName);

      return localAdapter ? localAdapter : availableAdapter;
    },


    /**
     * Predicate that Filters out adapters that should not be activated in the
     * current application environment. Defaults to all environments if the option
     * is `all` or undefined.
     *
     * @method _filterEnvironments
     * @param {Object} adapterOption
     * @param {String} appEnvironment
     * @private
     * @return {Boolean} should an adapter be activated
     */
    _filterEnvironments: function _filterEnvironments(adapterOption, appEnvironment) {
      var environments = adapterOption.environments;

      environments = environments || ['all'];
      var wrappedEnvironments = emberArray(environments);

      return wrappedEnvironments.indexOf('all') > -1 || wrappedEnvironments.indexOf(appEnvironment) > -1;
    }
  });
});