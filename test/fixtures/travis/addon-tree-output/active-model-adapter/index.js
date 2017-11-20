define('active-model-adapter/index', ['exports', 'active-model-adapter/active-model-adapter', 'active-model-adapter/active-model-serializer'], function (exports, _activeModelAdapterActiveModelAdapter, _activeModelAdapterActiveModelSerializer) {
  exports['default'] = _activeModelAdapterActiveModelAdapter['default'];
  exports.ActiveModelAdapter = _activeModelAdapterActiveModelAdapter['default'];
  exports.ActiveModelSerializer = _activeModelAdapterActiveModelSerializer['default'];
});