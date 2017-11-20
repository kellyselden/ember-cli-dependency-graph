define('code-corps-ember/utils/records-list', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  exports.default = {
    /**
      Returns `true` or `false` depending on whether an array of models contains
      the target model instance.
      @method contains
      @param {[DS.Model]} records The records to search
      @param {DS.Model} target The target model
      @return {Boolean} `true` if found, otherwise `false`
      @public
    */
    includes: function includes(records, target) {
      if (records) {
        return records.any(function (found) {
          var targetId = get(target, 'id');
          var targetModelName = get(target, 'constructor.modelName') || get(target, 'content.constructor.modelName');
          var foundId = found.belongsTo(targetModelName).id();

          return foundId === targetId;
        });
      } else {
        false;
      }
    },


    /**
      Returns the first record within an array of join model relationships
      for the given target and relationship. For example given `user-skill`
      records, we can pass in a `skill` as `target` and a `user` as the
      relationship.
      @method find
      @param {[DS.Model]} records The relationship records to search
      @param {DS.Model} target The target model
      @param {DS.Model} relationship The relationship model
      @return {DS.Model} Found item or `undefined`
      @public
    */
    find: function find(records, target, relationship) {
      if (records) {
        return records.find(function (found) {
          // Get relationship id and model name
          var relationshipId = get(relationship, 'id');
          var relationshipModelName = get(relationship, 'constructor.modelName') || get(relationship, 'content.constructor.modelName');

          // Get target id and model name
          var targetId = get(target, 'id');
          var targetModelName = get(target, 'constructor.modelName') || get(target, 'content.constructor.modelName');

          // Exit early with `false` if we're missing values
          if (!(relationshipId && relationshipModelName && targetId && targetModelName)) {
            return false;
          }

          // Get the id of the found model instance and
          // get the id of the found model's relationship model instance
          var foundId = found.belongsTo(targetModelName.camelize()).id();
          var foundRelationshipId = found.belongsTo(relationshipModelName.camelize()).id();

          return foundRelationshipId === relationshipId && // relationships match
          foundId === targetId; // found matches target
        });
      }
    }
  };
});