define("ember-data/-private/system/relationships/state/relationship", ["exports", "ember-data/-private/debug", "ember-data/-private/system/ordered-set", "ember-data/-private/system/normalize-link"], function (exports, _emberDataPrivateDebug, _emberDataPrivateSystemOrderedSet, _emberDataPrivateSystemNormalizeLink) {
  exports["default"] = Relationship;

  function Relationship(store, record, inverseKey, relationshipMeta) {
    var async = relationshipMeta.options.async;
    this.members = new _emberDataPrivateSystemOrderedSet["default"]();
    this.canonicalMembers = new _emberDataPrivateSystemOrderedSet["default"]();
    this.store = store;
    this.key = relationshipMeta.key;
    this.inverseKey = inverseKey;
    this.record = record;
    this.isAsync = typeof async === 'undefined' ? true : async;
    this.relationshipMeta = relationshipMeta;
    //This probably breaks for polymorphic relationship in complex scenarios, due to
    //multiple possible modelNames
    this.inverseKeyForImplicit = this.record.constructor.modelName + this.key;
    this.linkPromise = null;
    this.meta = null;
    this.hasData = false;
    this.hasLoaded = false;
  }

  Relationship.prototype = {
    constructor: Relationship,

    destroy: function destroy() {},

    updateMeta: function updateMeta(meta) {
      this.meta = meta;
    },

    clear: function clear() {
      var members = this.members.list;
      var member;

      while (members.length > 0) {
        member = members[0];
        this.removeRecord(member);
      }
    },

    removeRecords: function removeRecords(records) {
      var _this = this;

      records.forEach(function (record) {
        return _this.removeRecord(record);
      });
    },

    addRecords: function addRecords(records, idx) {
      var _this2 = this;

      records.forEach(function (record) {
        _this2.addRecord(record, idx);
        if (idx !== undefined) {
          idx++;
        }
      });
    },

    addCanonicalRecords: function addCanonicalRecords(records, idx) {
      for (var i = 0; i < records.length; i++) {
        if (idx !== undefined) {
          this.addCanonicalRecord(records[i], i + idx);
        } else {
          this.addCanonicalRecord(records[i]);
        }
      }
    },

    addCanonicalRecord: function addCanonicalRecord(record, idx) {
      if (!this.canonicalMembers.has(record)) {
        this.canonicalMembers.add(record);
        if (this.inverseKey) {
          record._relationships.get(this.inverseKey).addCanonicalRecord(this.record);
        } else {
          if (!record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit] = new Relationship(this.store, record, this.key, { options: {} });
          }
          record._implicitRelationships[this.inverseKeyForImplicit].addCanonicalRecord(this.record);
        }
      }
      this.flushCanonicalLater();
      this.setHasData(true);
    },

    removeCanonicalRecords: function removeCanonicalRecords(records, idx) {
      for (var i = 0; i < records.length; i++) {
        if (idx !== undefined) {
          this.removeCanonicalRecord(records[i], i + idx);
        } else {
          this.removeCanonicalRecord(records[i]);
        }
      }
    },

    removeCanonicalRecord: function removeCanonicalRecord(record, idx) {
      if (this.canonicalMembers.has(record)) {
        this.removeCanonicalRecordFromOwn(record);
        if (this.inverseKey) {
          this.removeCanonicalRecordFromInverse(record);
        } else {
          if (record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit].removeCanonicalRecord(this.record);
          }
        }
      }
      this.flushCanonicalLater();
    },

    addRecord: function addRecord(record, idx) {
      if (!this.members.has(record)) {
        this.members.addWithIndex(record, idx);
        this.notifyRecordRelationshipAdded(record, idx);
        if (this.inverseKey) {
          record._relationships.get(this.inverseKey).addRecord(this.record);
        } else {
          if (!record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit] = new Relationship(this.store, record, this.key, { options: {} });
          }
          record._implicitRelationships[this.inverseKeyForImplicit].addRecord(this.record);
        }
        this.record.updateRecordArraysLater();
      }
      this.setHasData(true);
    },

    removeRecord: function removeRecord(record) {
      if (this.members.has(record)) {
        this.removeRecordFromOwn(record);
        if (this.inverseKey) {
          this.removeRecordFromInverse(record);
        } else {
          if (record._implicitRelationships[this.inverseKeyForImplicit]) {
            record._implicitRelationships[this.inverseKeyForImplicit].removeRecord(this.record);
          }
        }
      }
    },

    removeRecordFromInverse: function removeRecordFromInverse(record) {
      var inverseRelationship = record._relationships.get(this.inverseKey);
      //Need to check for existence, as the record might unloading at the moment
      if (inverseRelationship) {
        inverseRelationship.removeRecordFromOwn(this.record);
      }
    },

    removeRecordFromOwn: function removeRecordFromOwn(record) {
      this.members["delete"](record);
      this.notifyRecordRelationshipRemoved(record);
      this.record.updateRecordArrays();
    },

    removeCanonicalRecordFromInverse: function removeCanonicalRecordFromInverse(record) {
      var inverseRelationship = record._relationships.get(this.inverseKey);
      //Need to check for existence, as the record might unloading at the moment
      if (inverseRelationship) {
        inverseRelationship.removeCanonicalRecordFromOwn(this.record);
      }
    },

    removeCanonicalRecordFromOwn: function removeCanonicalRecordFromOwn(record) {
      this.canonicalMembers["delete"](record);
      this.flushCanonicalLater();
    },

    flushCanonical: function flushCanonical() {
      this.willSync = false;
      //a hack for not removing new records
      //TODO remove once we have proper diffing
      var newRecords = [];
      for (var i = 0; i < this.members.list.length; i++) {
        if (this.members.list[i].isNew()) {
          newRecords.push(this.members.list[i]);
        }
      }
      //TODO(Igor) make this less abysmally slow
      this.members = this.canonicalMembers.copy();
      for (i = 0; i < newRecords.length; i++) {
        this.members.add(newRecords[i]);
      }
    },

    flushCanonicalLater: function flushCanonicalLater() {
      var _this3 = this;

      if (this.willSync) {
        return;
      }
      this.willSync = true;
      this.store._backburner.join(function () {
        return _this3.store._backburner.schedule('syncRelationships', _this3, _this3.flushCanonical);
      });
    },

    updateLink: function updateLink(link) {
      (0, _emberDataPrivateDebug.warn)("You pushed a record of type '" + this.record.type.modelName + "' with a relationship '" + this.key + "' configured as 'async: false'. You've included a link but no primary data, this may be an error in your payload.", this.isAsync || this.hasData, {
        id: 'ds.store.push-link-for-sync-relationship'
      });
      (0, _emberDataPrivateDebug.assert)("You have pushed a record of type '" + this.record.type.modelName + "' with '" + this.key + "' as a link, but the value of that link is not a string.", typeof link === 'string' || link === null);

      this.link = link;
      this.linkPromise = null;
      this.record.notifyPropertyChange(this.key);
    },

    findLink: function findLink() {
      if (this.linkPromise) {
        return this.linkPromise;
      } else {
        var promise = this.fetchLink();
        this.linkPromise = promise;
        return promise.then(function (result) {
          return result;
        });
      }
    },

    updateRecordsFromAdapter: function updateRecordsFromAdapter(records) {
      //TODO(Igor) move this to a proper place
      //TODO Once we have adapter support, we need to handle updated and canonical changes
      this.computeChanges(records);
    },

    notifyRecordRelationshipAdded: function notifyRecordRelationshipAdded() {},
    notifyRecordRelationshipRemoved: function notifyRecordRelationshipRemoved() {},

    /*
      `hasData` for a relationship is a flag to indicate if we consider the
      content of this relationship "known". Snapshots uses this to tell the
      difference between unknown (`undefined`) or empty (`null`). The reason for
      this is that we wouldn't want to serialize unknown relationships as `null`
      as that might overwrite remote state.
       All relationships for a newly created (`store.createRecord()`) are
      considered known (`hasData === true`).
     */
    setHasData: function setHasData(value) {
      this.hasData = value;
    },

    /*
      `hasLoaded` is a flag to indicate if we have gotten data from the adapter or
      not when the relationship has a link.
       This is used to be able to tell when to fetch the link and when to return
      the local data in scenarios where the local state is considered known
      (`hasData === true`).
       Updating the link will automatically set `hasLoaded` to `false`.
     */
    setHasLoaded: function setHasLoaded(value) {
      this.hasLoaded = value;
    },

    /*
      `push` for a relationship allows the store to push a JSON API Relationship
      Object onto the relationship. The relationship will then extract and set the
      meta, data and links of that relationship.
       `push` use `updateMeta`, `updateData` and `updateLink` to update the state
      of the relationship.
     */
    push: function push(payload) {

      var hasData = false;
      var hasLink = false;

      if (payload.meta) {
        this.updateMeta(payload.meta);
      }

      if (payload.data !== undefined) {
        hasData = true;
        this.updateData(payload.data);
      }

      if (payload.links && payload.links.related) {
        var relatedLink = (0, _emberDataPrivateSystemNormalizeLink["default"])(payload.links.related);
        if (relatedLink && relatedLink.href && relatedLink.href !== this.link) {
          hasLink = true;
          this.updateLink(relatedLink.href);
        }
      }

      /*
        Data being pushed into the relationship might contain only data or links,
        or a combination of both.
         If we got data we want to set both hasData and hasLoaded to true since
        this would indicate that we should prefer the local state instead of
        trying to fetch the link or call findRecord().
         If we have no data but a link is present we want to set hasLoaded to false
        without modifying the hasData flag. This will ensure we fetch the updated
        link next time the relationship is accessed.
       */
      if (hasData) {
        this.setHasData(true);
        this.setHasLoaded(true);
      } else if (hasLink) {
        this.setHasLoaded(false);
      }
    },

    updateData: function updateData() {}
  };
});
/* global heimdall */