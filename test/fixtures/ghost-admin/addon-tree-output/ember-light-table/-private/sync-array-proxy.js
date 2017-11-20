define('ember-light-table/-private/sync-array-proxy', ['exports', 'ember'], function (exports, _ember) {
  var assert = _ember['default'].assert;
  var isArray = _ember['default'].isArray;

  var EMPTY_ARRAY = [];

  exports['default'] = _ember['default'].ArrayProxy.extend({
    /**
     * The model that will be synchronized to the content of this proxy
     * @property syncArray
     * @type {Array}
     */
    syncArray: null,

    /**
     * @property syncEnabled
     * @type {Boolean}
     */
    syncEnabled: true,

    init: function init() {
      this._super.apply(this, arguments);

      var syncArray = this.get('syncArray');

      assert('[ember-light-table] enableSync requires the passed array to be an instance of Ember.A', isArray(syncArray) && typeof syncArray.addArrayObserver === 'function');

      syncArray.addArrayObserver(this, {
        willChange: 'syncArrayWillChange',
        didChange: 'syncArrayDidChange'
      });
    },

    destroy: function destroy() {
      this.get('syncArray').removeArrayObserver(this, {
        willChange: 'syncArrayWillChange',
        didChange: 'syncArrayDidChange'
      });

      this.setProperties({
        syncArray: null,
        content: null
      });
    },

    /**
     * Serialize objects before they are inserted into the content array
     * @method serializeContentObjects
     * @param {Array} objects
     * @return {Array}
     */
    serializeContentObjects: function serializeContentObjects(objects) {
      return objects;
    },

    /**
     * Serialize objects before they are inserted into the sync array
     * @method serializeSyncArrayObjects
     * @param {Array} objects
     * @return {Array}
     */
    serializeSyncArrayObjects: function serializeSyncArrayObjects(objects) {
      return objects;
    },

    syncArrayWillChange: function syncArrayWillChange() {/* Not needed */},

    syncArrayDidChange: function syncArrayDidChange(syncArray, start, removeCount, addCount) {
      var content = this.get('content');
      var objectsToAdd = EMPTY_ARRAY;

      if (!this.get('syncEnabled')) {
        return;
      }

      if (addCount > 0) {
        objectsToAdd = this.serializeContentObjects(syncArray.slice(start, start + addCount));
      }

      content.replace(start, removeCount, objectsToAdd);
    },

    replaceContent: function replaceContent(start, removeCount, objectsToAdd) {
      var syncArray = this.get('syncArray');

      if (!this.get('syncEnabled')) {
        return this._super.apply(this, arguments);
      }

      syncArray.replace(start, removeCount, this.serializeSyncArrayObjects(objectsToAdd));
    }
  });
});