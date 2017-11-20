define('ember-infinity/components/infinity-loader', ['exports', 'ember', 'ember-version-is'], function (exports, _ember, _emberVersionIs) {

  var InfinityLoaderComponent = _ember['default'].Component.extend({
    classNames: ["infinity-loader"],
    classNameBindings: ["infinityModel.reachedInfinity"],
    guid: null,
    eventDebounce: 10,
    loadMoreAction: 'infinityLoad',
    loadingText: 'Loading Infinite Model...',
    loadedText: 'Infinite Model Entirely Loaded.',
    destroyOnInfinity: false,
    developmentMode: false,
    scrollable: null,
    triggerOffset: 0,

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);
      this._setupScrollable();
      this.set('guid', _ember['default'].guidFor(this));
      this._bindEvent('scroll');
      this._bindEvent('resize');
      this._loadMoreIfNeeded();
    },

    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      this._unbindEvent('scroll');
      this._unbindEvent('resize');
    },

    _bindEvent: function _bindEvent(eventName) {
      var _this = this;

      this.get('_scrollable').on(eventName + '.' + this.get('guid'), function () {
        _ember['default'].run.debounce(_this, _this._loadMoreIfNeeded, _this.get('eventDebounce'));
      });
    },

    _unbindEvent: function _unbindEvent(eventName) {
      var scrollable = this.get('_scrollable');
      if (scrollable) {
        scrollable.off(eventName + '.' + this.get('guid'));
      }
    },

    _selfOffset: function _selfOffset() {
      if (this.get('_customScrollableIsDefined')) {
        return this.$().offset().top - this.get("_scrollable").offset().top + this.get("_scrollable").scrollTop();
      } else {
        return this.$().offset().top;
      }
    },

    _bottomOfScrollableOffset: function _bottomOfScrollableOffset() {
      return this.get('_scrollable').height() + this.get("_scrollable").scrollTop();
    },

    _triggerOffset: function _triggerOffset() {
      return this._selfOffset() - this.get('triggerOffset');
    },

    _shouldLoadMore: function _shouldLoadMore() {
      if (this.get('developmentMode') || typeof FastBoot !== 'undefined' || this.isDestroying || this.isDestroyed) {
        return false;
      }

      return this._bottomOfScrollableOffset() > this._triggerOffset();
    },

    _loadMoreIfNeeded: function _loadMoreIfNeeded() {
      if (this._shouldLoadMore()) {
        this.sendAction('loadMoreAction', this.get('infinityModel'));
      }
    },

    _setupScrollable: function _setupScrollable() {
      var scrollable = this.get('scrollable');
      if (_ember['default'].typeOf(scrollable) === 'string') {
        var items = _ember['default'].$(scrollable);
        if (items.length === 1) {
          this.set('_scrollable', items.eq(0));
        } else if (items.length > 1) {
          throw new Error("Ember Infinity: Multiple scrollable elements found for: " + scrollable);
        } else {
          throw new Error("Ember Infinity: No scrollable element found for: " + scrollable);
        }
        this.set('_customScrollableIsDefined', true);
      } else if (scrollable === undefined || scrollable === null) {
        this.set('_scrollable', _ember['default'].$(window));
        this.set('_customScrollableIsDefined', false);
      } else {
        throw new Error("Ember Infinity: Scrollable must either be a css selector string or left empty to default to window");
      }
    },

    loadedStatusDidChange: _ember['default'].observer('infinityModel.reachedInfinity', 'destroyOnInfinity', function () {
      if (this.get('infinityModel.reachedInfinity') && this.get('destroyOnInfinity')) {
        this.destroy();
      }
    }),

    infinityModelPushed: _ember['default'].observer('infinityModel.length', function () {
      _ember['default'].run.scheduleOnce('afterRender', this, this._loadMoreIfNeeded);
    })
  });

  if ((0, _emberVersionIs['default'])('lessThan', '1.13.0')) {
    InfinityLoaderComponent.reopen({
      hasBlock: _ember['default'].computed.alias('template')
    });
  }

  exports['default'] = InfinityLoaderComponent;
});