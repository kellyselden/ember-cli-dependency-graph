define('ember-weakmap/index', ['exports', 'ember-weakmap/weak-map'], function (exports, _emberWeakmapWeakMap) {
  exports['default'] = typeof WeakMap !== 'undefined' ? WeakMap : _emberWeakmapWeakMap['default'];
});