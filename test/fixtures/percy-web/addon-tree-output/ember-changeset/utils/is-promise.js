define('ember-changeset/utils/is-promise', ['exports', 'ember', 'ember-changeset/utils/is-object'], function (exports, _ember, _emberChangesetUtilsIsObject) {
  exports['default'] = isPromise;
  var typeOf = _ember['default'].typeOf;

  function isPromiseLike() {
    var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    return typeOf(obj.then) === 'function' && typeOf(obj['catch']) === 'function' && typeOf(obj['finally']) === 'function';
  }

  function isPromise(obj) {
    return (0, _emberChangesetUtilsIsObject['default'])(obj) && isPromiseLike(obj);
  }
});