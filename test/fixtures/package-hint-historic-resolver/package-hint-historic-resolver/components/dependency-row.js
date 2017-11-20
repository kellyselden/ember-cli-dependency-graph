define('package-hint-historic-resolver/components/dependency-row', ['exports', 'ember-macro-helpers/computed', 'ember-awesome-macros'], function (exports, _computed, _emberAwesomeMacros) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var readOnly = Ember.computed.readOnly;
  exports.default = Component.extend({
    tagName: '',

    module: readOnly('dependency.module'),
    versionsError: readOnly('dependency.versionsError'),
    firstVersionHint: readOnly('dependency.firstVersionHint'),
    secondVersionHint: readOnly('dependency.secondVersionHint'),
    firstVersion: readOnly('dependency.firstVersion'),
    secondVersion: readOnly('dependency.secondVersion'),
    hasFirstCircularReference: readOnly('dependency.hasFirstCircularReference'),
    hasSecondCircularReference: readOnly('dependency.hasSecondCircularReference'),
    firstDependenciesError: readOnly('dependency.firstDependenciesError'),
    secondDependenciesError: readOnly('dependency.secondDependenciesError'),
    dependencies: readOnly('dependency.dependencies'),
    areVersionsDifferent: readOnly('dependency.areVersionsDifferent'),
    isFirstVersionHintMissing: readOnly('dependency.isFirstVersionHintMissing'),
    isSecondVersionHintMissing: readOnly('dependency.isSecondVersionHintMissing'),
    isFirstVersionMissing: readOnly('dependency.isFirstVersionMissing'),
    isSecondVersionMissing: readOnly('dependency.isSecondVersionMissing'),
    isOneHintMissing: readOnly('dependency.isOneHintMissing'),
    isOneMissing: readOnly('dependency.isOneMissing'),
    isSomethingWrong: readOnly('dependency.isSomethingWrong'),
    numberOfDifferences: readOnly('dependency.numberOfDifferences'),

    nestingLevel: 0,

    nestingItems: (0, _computed.default)('nestingLevel', function (nestingLevel) {
      return new Array(nestingLevel);
    }),

    childNestingLevel: (0, _emberAwesomeMacros.sum)('nestingLevel', 1),

    areVersionHintsDifferent: (0, _emberAwesomeMacros.and)('firstVersionHint', 'secondVersionHint', (0, _emberAwesomeMacros.neq)('firstVersionHint', 'secondVersionHint')),

    shouldHideRow: (0, _emberAwesomeMacros.and)('shouldOnlyShowDifferent', (0, _emberAwesomeMacros.not)('isSomethingWrong'), (0, _emberAwesomeMacros.not)('numberOfDifferences'))
  });
});