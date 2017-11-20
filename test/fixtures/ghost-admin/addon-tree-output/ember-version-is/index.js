define('ember-version-is/index', ['exports', 'ember', 'ember-data'], function (exports, _ember, _emberData) {

  var is = function is(value, operation, version) {
    if (arguments.length === 2 || _ember['default'].isNone(version)) {
      _ember['default'].assert('range must be a valid semver range', semver.validRange(operation));
      return semver.satisfies(value, operation);
    }

    switch (operation) {
      case 'equalTo':
        return semver.eq(value, version);
      case 'greaterThan':
        return semver.gt(value, version);
      case 'greaterThanOrEqualTo':
        return semver.gte(value, version);
      case 'lessThan':
        return semver.lt(value, version);
      case 'lessThanOrEqualTo':
        return semver.lte(value, version);
      default:
        throw new Error("Ember Version Is: Please pass either 'equalTo', 'lessThan', 'lessThanOrEqualTo', 'greaterThan' or 'greatThanOrEqualTo' as the operation argument.");
    }
  };

  var emberVersionIs = function emberVersionIs(operation, value) {
    return is(_ember['default'].VERSION, operation, value);
  };

  var emberDataVersionIs = function emberDataVersionIs(operation, value) {
    return is(_emberData['default'].VERSION, operation, value);
  };

  exports.is = is;
  exports.emberVersionIs = emberVersionIs;
  exports.emberDataVersionIs = emberDataVersionIs;
  exports['default'] = emberVersionIs;
});
/*global semver*/