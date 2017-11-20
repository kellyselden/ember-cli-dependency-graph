define('ember-deferred-content/components/deferred-content', ['exports', 'ember', 'ember-deferred-content/templates/components/deferred-content'], function (exports, _ember, _emberDeferredContentTemplatesComponentsDeferredContent) {
  var Component = _ember['default'].Component;
  var computed = _ember['default'].computed;
  var not = _ember['default'].computed.not;
  var get = _ember['default'].get;
  var _set = _ember['default'].set;

  var DeferredContentComponent = Component.extend({
    layout: _emberDeferredContentTemplatesComponentsDeferredContent['default'],
    isPending: not('isSettled'),
    promise: computed({
      set: function set(key, promise) {
        var _this = this;

        _set(this, 'isRejected', false);
        _set(this, 'isFulfilled', false);
        _set(this, 'isSettled', false);
        _set(this, 'content', null);

        promise.then(function (result) {
          if (!get(_this, 'isDestroyed')) {
            _set(_this, 'isFulfilled', true);
            _set(_this, 'content', result);
          }
        }, function (result) {
          if (!get(_this, 'isDestroyed')) {
            _set(_this, 'isRejected', true);
            _set(_this, 'content', result);
          }
        })['finally'](function () {
          if (!get(_this, 'isDestroyed')) {
            _set(_this, 'isSettled', true);
          }
        });

        return promise;
      }
    })
  });

  DeferredContentComponent.reopenClass({
    positionalParams: ['promise']
  });

  exports['default'] = DeferredContentComponent;
});