define('ember-awesome-macros/array/group-by', ['exports', 'ember-awesome-macros/array/-utils'], function (exports, _utils) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var get = Ember.get;
  var emberA = Ember.A;


  function getCurrentGroup(groups, value, comparator) {
    if (comparator) {
      return groups.find(function (group) {
        return comparator(get(group, 'value'), value);
      });
    }

    return groups.findBy('value', value);
  }

  exports.default = (0, _utils.normalizeArray3)({
    firstDefault: function firstDefault() {
      return [];
    },
    func: function func(array, key, comparator) {
      var groups = emberA();
      array.forEach(function (item) {
        var value = get(item, key);
        var currentGroup = getCurrentGroup(groups, value, comparator);

        if (currentGroup) {
          currentGroup.items.push(item);
        } else {
          groups.push({
            key: key,
            value: value,
            items: [item]
          });
        }
      });

      return groups;
    }
  });
});