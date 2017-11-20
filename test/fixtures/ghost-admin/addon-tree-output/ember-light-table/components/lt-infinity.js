define('ember-light-table/components/lt-infinity', ['exports', 'ember', 'ember-light-table/templates/components/lt-infinity', 'ember-in-viewport'], function (exports, _ember, _emberLightTableTemplatesComponentsLtInfinity, _emberInViewport) {
  var Component = _ember['default'].Component;
  var observer = _ember['default'].observer;
  var run = _ember['default'].run;
  exports['default'] = Component.extend(_emberInViewport['default'], {
    classNames: ['lt-infinity'],
    classNameBindings: ['viewportEntered:in-viewport'],
    layout: _emberLightTableTemplatesComponentsLtInfinity['default'],

    rows: null,
    scrollBuffer: null,

    didInsertElement: function didInsertElement() {
      this._super.apply(this, arguments);

      var scrollBuffer = this.get('scrollBuffer');
      var width = this.$().width();

      this.setProperties({
        viewportSpy: true,
        viewportTolerance: {
          left: width,
          right: width,
          bottom: scrollBuffer,
          top: 0
        }
      });
    },

    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);
      this._cancelTimers();
    },

    didEnterViewport: function didEnterViewport() {
      this._debounceScrolledToBottom();
    },

    didExitViewport: function didExitViewport() {
      this._cancelTimers();
    },

    scheduleScrolledToBottom: observer('rows.[]', 'viewportEntered', function () {
      if (this.get('viewportEntered')) {
        /*
          Continue scheduling onScrolledToBottom until no longer in viewport
         */
        this._scheduleScrolledToBottom();
      }
    }),

    _scheduleScrolledToBottom: function _scheduleScrolledToBottom() {
      this._schedulerTimer = run.scheduleOnce('afterRender', this, this._debounceScrolledToBottom);
    },

    _debounceScrolledToBottom: function _debounceScrolledToBottom() {
      var delay = arguments.length <= 0 || arguments[0] === undefined ? 100 : arguments[0];

      /*
        This debounce is needed when there is not enough delay between onScrolledToBottom calls.
        Without this debounce, all rows will be rendered causing immense performance problems
       */
      this._debounceTimer = run.debounce(this, this.sendAction, 'onScrolledToBottom', delay);
    },

    _cancelTimers: function _cancelTimers() {
      run.cancel(this._schedulerTimer);
      run.cancel(this._debounceTimer);
    }
  });
});