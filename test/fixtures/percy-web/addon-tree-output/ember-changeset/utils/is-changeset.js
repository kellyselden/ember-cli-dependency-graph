define('ember-changeset/utils/is-changeset', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = isChangeset;
  var get = _ember['default'].get;
  var CHANGESET = '__CHANGESET__';

  exports.CHANGESET = CHANGESET;

  function isChangeset(changeset) {
    return get(changeset, '__changeset__') === CHANGESET;
  }
});