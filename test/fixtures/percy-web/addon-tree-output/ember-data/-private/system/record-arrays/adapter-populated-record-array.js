define("ember-data/-private/system/record-arrays/adapter-populated-record-array", ["exports", "ember", "ember-data/-private/system/record-arrays/record-array", "ember-data/-private/system/clone-null"], function (exports, _ember, _emberDataPrivateSystemRecordArraysRecordArray, _emberDataPrivateSystemCloneNull) {

  /**
    @module ember-data
  */

  var get = _ember["default"].get;

  /**
    Represents an ordered list of records whose order and membership is
    determined by the adapter. For example, a query sent to the adapter
    may trigger a search on the server, whose results would be loaded
    into an instance of the `AdapterPopulatedRecordArray`.
  
    ---
  
    If you want to update the array and get the latest records from the
    adapter, you can invoke [`update()`](#method_update):
  
    Example
  
    ```javascript
    // GET /users?isAdmin=true
    var admins = store.query('user', { isAdmin: true });
  
    admins.then(function() {
      console.log(admins.get("length")); // 42
    });
  
    // somewhere later in the app code, when new admins have been created
    // in the meantime
    //
    // GET /users?isAdmin=true
    admins.update().then(function() {
      admins.get('isUpdating'); // false
      console.log(admins.get("length")); // 123
    });
  
    admins.get('isUpdating'); // true
    ```
  
    @class AdapterPopulatedRecordArray
    @namespace DS
    @extends DS.RecordArray
  */
  exports["default"] = _emberDataPrivateSystemRecordArraysRecordArray["default"].extend({
    init: function init() {
      // yes we are touching `this` before super, but ArrayProxy has a bug that requires this.
      this.set('content', this.get('content') || _ember["default"].A());

      this._super.apply(this, arguments);
      this.query = this.query || null;
      this.links = null;
    },

    replace: function replace() {
      var type = get(this, 'type').toString();
      throw new Error("The result of a server query (on " + type + ") is immutable.");
    },

    _update: function _update() {
      var store = get(this, 'store');
      var modelName = get(this, 'type.modelName');
      var query = get(this, 'query');

      return store._query(modelName, query, this);
    },

    /**
      @method _setInternalModels
      @param {Array} internalModels
      @param {Object} payload normalized payload
      @private
    */
    _setInternalModels: function _setInternalModels(internalModels, payload) {
      var _this = this;

      // TODO: initial load should not cause change events at all, only
      // subsequent. This requires changing the public api of adapter.query, but
      // hopefully we can do that soon.
      this.get('content').setObjects(internalModels);

      this.setProperties({
        isLoaded: true,
        isUpdating: false,
        meta: (0, _emberDataPrivateSystemCloneNull["default"])(payload.meta),
        links: (0, _emberDataPrivateSystemCloneNull["default"])(payload.links)
      });

      internalModels.forEach(function (record) {
        return _this.manager.recordArraysForRecord(record).add(_this);
      });

      // TODO: should triggering didLoad event be the last action of the runLoop?
      _ember["default"].run.once(this, 'trigger', 'didLoad');
    }
  });
});