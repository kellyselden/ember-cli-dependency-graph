define('percy-web/models/comparison', ['exports', 'ember-data', 'moment'], function (exports, _emberData, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var and = Ember.computed.and;
  var equal = Ember.computed.equal;
  var computed = Ember.computed;
  exports.default = _emberData.default.Model.extend({
    state: _emberData.default.attr(),
    width: _emberData.default.attr('number'),

    headBuild: _emberData.default.belongsTo('build', { async: false }),
    headSnapshot: _emberData.default.belongsTo('snapshot', { async: false }),
    baseSnapshot: _emberData.default.belongsTo('snapshot', { async: false }),

    // If headScreenshot is null, the comparison was removed (compared to the base build).
    headScreenshot: _emberData.default.belongsTo('screenshot', { async: false }),
    // If baseScreenshot is null, the comparison was added and is new (compared to the base build).
    baseScreenshot: _emberData.default.belongsTo('screenshot', { async: false }),
    diffImage: _emberData.default.belongsTo('image', { async: false }),
    diffRatio: _emberData.default.attr('number'),

    startedProcessingAt: _emberData.default.attr('date'),
    finishedProcessingAt: _emberData.default.attr('date'),
    processingDurationSeconds: computed('startedProcessingAt', 'finishedProcessingAt', function () {
      var finished = this.get('finishedProcessingAt');
      var started = this.get('startedProcessingAt');
      var milliseconds = (0, _moment.default)(finished).diff(started);
      return milliseconds / 1000;
    }),
    createdAt: _emberData.default.attr('date'),
    updatedAt: _emberData.default.attr('date'),

    wasAdded: computed('headScreenshot', 'baseScreenshot', function () {
      return !!this.get('headScreenshot') && !this.get('baseScreenshot');
    }),
    wasRemoved: computed('headScreenshot', 'baseScreenshot', function () {
      return !!this.get('baseScreenshot') && !this.get('headScreenshot');
    }),
    wasCompared: and('diffImage'),

    // Comparison is guaranteed 100% different if head was added or head was removed.
    // Otherwise, rely on the diff ratio to tell us if pixels changed.
    isDifferent: computed('wasAdded', 'wasRemoved', 'isSame', function () {
      return this.get('wasAdded') || this.get('wasRemoved') || !this.get('isSame');
    }),
    isSame: equal('diffRatio', 0),
    smartDiffRatio: computed('wasAdded', 'wasRemoved', 'diffRatio', function () {
      if (this.get('wasAdded') || this.get('wasRemoved')) {
        // 100% changed pixels if added or removed.
        return 1;
      } else {
        return this.get('diffRatio');
      }
    })
  });
});