define('ember-computed-decorators/ember-data', ['exports', 'ember-data', 'ember-computed-decorators/macro-alias'], function (exports, _emberData, _emberComputedDecoratorsMacroAlias) {
  var attr = (0, _emberComputedDecoratorsMacroAlias['default'])(_emberData['default'].attr);
  exports.attr = attr;
  var hasMany = (0, _emberComputedDecoratorsMacroAlias['default'])(_emberData['default'].hasMany);
  exports.hasMany = hasMany;
  var belongsTo = (0, _emberComputedDecoratorsMacroAlias['default'])(_emberData['default'].belongsTo);
  exports.belongsTo = belongsTo;
});