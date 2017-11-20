define('ember-infinity/mixins/route', ['exports', 'ember', 'ember-version-is'], function (exports, _ember, _emberVersionIs) {

  var keys = Object.keys || _ember['default'].keys;
  var assign = _ember['default'].assign || _ember['default'].merge;
  /**
    The Ember Infinity Route Mixin enables an application route to load paginated
    records for the route `model` as triggered by the controller (or Infinity Loader
    component).
  
    @class RouteMixin
    @namespace EmberInfinity
    @module ember-infinity/mixins/route
    @extends Ember.Mixin
  */
  var RouteMixin = _ember['default'].Mixin.create({

    /**
      @private
      @property _perPage
      @type Integer
      @default 25
    */
    _perPage: 25,

    /**
      @private
      @property currentPage
      @type Integer
      @default 0
    */
    currentPage: 0,

    /**
      @private
      @property _extraParams
      @type Object
      @default {}
    */
    _extraParams: {},

    /**
      @private
      @property _boundParams
      @type Object
      @default {}
    */
    _boundParams: {},

    /**
      @private
      @property _loadingMore
      @type Boolean
      @default false
    */
    _loadingMore: false,

    /**
      @private
      @property _totalPages
      @type Integer
      @default 0
    */
    _totalPages: 0,

    /**
      @private
      @property _infinityModelName
      @type String
      @default null
    */
    _infinityModelName: null,

    /**
      @private
      @property _modelPath
      @type String
      @default 'controller.model'
    */
    _modelPath: 'controller.model',

    /**
     * Name of the "per page" param in the
     * resource request payload
     * @type {String}
     * @default  "per_page"
     */
    perPageParam: 'per_page',

    /**
     * Name of the "page" param in the
     * resource request payload
     * @type {String}
     * @default "page"
     */
    pageParam: 'page',

    /**
     * Path of the "total pages" param in
     * the HTTP response
     * @type {String}
     * @default "meta.total_pages"
     */
    totalPagesParam: 'meta.total_pages',

    actions: {
      infinityLoad: function infinityLoad(infinityModel) {
        if (infinityModel === this._infinityModel()) {
          this._infinityLoad();
        } else {
          return true;
        }
      }
    },

    /**
     * The supported findMethod name for
     * the developers Ember Data version.
     * Provided here for backwards compat.
     * @type {String}
     * @default "query"
     */
    _storeFindMethod: 'query',

    _firstPageLoaded: false,

    /**
      @private
      @property _canLoadMore
      @type Boolean
      @default false
    */
    _canLoadMore: _ember['default'].computed('_totalPages', 'currentPage', function () {
      var totalPages = this.get('_totalPages');
      var currentPage = this.get('currentPage');

      return totalPages && currentPage !== undefined ? currentPage < totalPages : false;
    }),

    /**
     @private
     @method _infinityModel
     @return {DS.RecordArray} the model
    */
    _infinityModel: function _infinityModel() {
      return this.get(this.get('_modelPath'));
    },

    _ensureCompatibility: function _ensureCompatibility() {
      if ((0, _emberVersionIs.emberDataVersionIs)('greaterThan', '1.0.0-beta.19.2') && (0, _emberVersionIs.emberDataVersionIs)('lessThan', '1.13.4')) {
        throw new _ember['default'].Error("Ember Infinity: You are using an unsupported version of Ember Data.  Please upgrade to at least 1.13.4 or downgrade to 1.0.0-beta.19.2");
      }

      if (_ember['default'].isEmpty(this.get('store')) || _ember['default'].isEmpty(this.get('store')[this._storeFindMethod])) {
        throw new _ember['default'].Error("Ember Infinity: Ember Data store is not available to infinityModel");
      }

      if (this.get('_infinityModelName') === undefined) {
        throw new _ember['default'].Error("Ember Infinity: You must pass a Model Name to infinityModel");
      }
    },

    /**
      Use the infinityModel method in the place of `this.store.find('model')` to
      initialize the Infinity Model for your route.
       @method infinityModel
      @param {String} modelName The name of the model.
      @param {Object} options Optional, the perPage and startingPage to load from.
      @param {Object} boundParams Optional, any route properties to be included as additional params.
      @return {Ember.RSVP.Promise}
    */
    infinityModel: function infinityModel(modelName, options, boundParams) {
      if ((0, _emberVersionIs.emberDataVersionIs)('lessThan', '1.13.0')) {
        this.set('_storeFindMethod', 'find');
      }

      this.set('_infinityModelName', modelName);

      this._ensureCompatibility();

      options = options ? assign({}, options) : {};
      var startingPage = options.startingPage === undefined ? 0 : options.startingPage - 1;

      var perPage = options.perPage || this.get('_perPage');
      var modelPath = options.modelPath || this.get('_modelPath');

      delete options.startingPage;
      delete options.perPage;
      delete options.modelPath;

      this.setProperties({
        currentPage: startingPage,
        _firstPageLoaded: false,
        _perPage: perPage,
        _modelPath: modelPath,
        _extraParams: options
      });

      if (typeof boundParams === 'object') {
        this.set('_boundParams', boundParams);
      }

      return this._loadNextPage();
    },

    /**
     Call additional functions after finding the infinityModel in the Ember data store.
     @private
     @method _afterInfinityModel
     @param {Function} infinityModelPromise The resolved result of the Ember store find method. Passed in automatically.
     @return {Ember.RSVP.Promise}
    */
    _afterInfinityModel: function _afterInfinityModel(_this) {
      return function (infinityModelPromiseResult) {
        if (typeof _this.afterInfinityModel === 'function') {
          var result = _this.afterInfinityModel(infinityModelPromiseResult);
          if (result) {
            return result;
          }
        }

        return infinityModelPromiseResult;
      };
    },

    /**
     Trigger a load of the next page of results.
      @private
     @method _infinityLoad
     */
    _infinityLoad: function _infinityLoad() {
      if (this.get('_loadingMore') || !this.get('_canLoadMore')) {
        return;
      }

      this._loadNextPage();
    },

    /**
     load the next page from the adapter and update the model
      @private
     @method _loadNextPage
     @return {Ember.RSVP.Promise} A Promise that resolves the model
     */
    _loadNextPage: function _loadNextPage() {
      var _this2 = this;

      this.set('_loadingMore', true);

      return this._requestNextPage().then(function (newObjects) {
        _this2._nextPageLoaded(newObjects);

        return newObjects;
      })['finally'](function () {
        _this2.set('_loadingMore', false);
      });
    },

    /**
     request the next page from the adapter
      @private
     @method _requestNextPage
     @returns {Ember.RSVP.Promise} A Promise that resolves the next page of objects
     */
    _requestNextPage: function _requestNextPage() {
      var modelName = this.get('_infinityModelName');
      var nextPage = this.incrementProperty('currentPage');
      var params = this._buildParams(nextPage);

      return this.get('store')[this._storeFindMethod](modelName, params).then(this._afterInfinityModel(this));
    },

    /**
     build the params for the next page request
      @private
     @method _buildParams
     @param {Number} nextPage the page number for the current request
     @return {Object} The query params for the next page of results
     */
    _buildParams: function _buildParams(nextPage) {
      var _this3 = this;

      var pageParams = {};

      if (this.get('perPageParam')) {
        pageParams[this.get('perPageParam')] = this.get('_perPage');
      }

      if (this.get('pageParam')) {
        pageParams[this.get('pageParam')] = nextPage;
      }

      var params = assign(pageParams, this.get('_extraParams'));

      var boundParams = this.get('_boundParams');
      if (!_ember['default'].isEmpty(boundParams)) {
        keys(boundParams).forEach(function (k) {
          return params[k] = _this3.get(boundParams[k]);
        });
      }

      return params;
    },

    /**
     Update the infinity model with new objects
     Only called on the second page and following
      @deprecated
     @method updateInfinityModel
     @param {Ember.Enumerable} newObjects The new objects to add to the model
     @return {Ember.Array} returns the new objects
     */
    updateInfinityModel: function updateInfinityModel(newObjects) {
      return this._doUpdate(newObjects);
    },

    _doUpdate: function _doUpdate(newObjects) {
      var infinityModel = this._infinityModel();
      return infinityModel.pushObjects(newObjects.get('content'));
    },

    /**
      @method _nextPageLoaded
     @param {Ember.Enumerable} newObjects The new objects to add to the model
     @return {DS.RecordArray} returns the updated infinity model
     @private
     */
    _nextPageLoaded: function _nextPageLoaded(newObjects) {
      var totalPages = newObjects.get(this.get('totalPagesParam'));
      this.set('_totalPages', totalPages);

      var infinityModel = newObjects;

      if (this.get('_firstPageLoaded')) {
        if (typeof this.updateInfinityModel === 'function' && this.updateInfinityModel !== _ember['default'].Object.extend(RouteMixin).create().updateInfinityModel) {
          _ember['default'].deprecate("EmberInfinity.updateInfinityModel is deprecated. " + "Please use EmberInfinity.afterInfinityModel.", false, { id: 'ember-infinity.updateInfinityModel', until: '2.1' });

          infinityModel = this.updateInfinityModel(newObjects);
        } else {
          infinityModel = this._doUpdate(newObjects);
        }
      }

      this.set('_firstPageLoaded', true);
      this._notifyInfinityModelUpdated(newObjects);

      var canLoadMore = this.get('_canLoadMore');
      infinityModel.set('reachedInfinity', !canLoadMore);

      if (!canLoadMore) {
        this._notifyInfinityModelLoaded();
      }

      return infinityModel;
    },

    /**
     notify that the infinity model has been updated
      @private
     @method _notifyInfinityModelUpdated
     */
    _notifyInfinityModelUpdated: function _notifyInfinityModelUpdated(newObjects) {
      if (!this.infinityModelUpdated) {
        return;
      }

      _ember['default'].run.scheduleOnce('afterRender', this, 'infinityModelUpdated', {
        lastPageLoaded: this.get('currentPage'),
        totalPages: this.get('_totalPages'),
        newObjects: newObjects
      });
    },

    /**
     finish the loading cycle by notifying that infinity has been reached
      @private
     @method _notifyInfinityModelLoaded
     */
    _notifyInfinityModelLoaded: function _notifyInfinityModelLoaded() {
      if (!this.infinityModelLoaded) {
        return;
      }

      var totalPages = this.get('_totalPages');
      _ember['default'].run.scheduleOnce('afterRender', this, 'infinityModelLoaded', { totalPages: totalPages });
    }
  });

  exports['default'] = RouteMixin;
});