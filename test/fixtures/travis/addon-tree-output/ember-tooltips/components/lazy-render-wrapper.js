define('ember-tooltips/components/lazy-render-wrapper', ['exports', 'ember-tooltips/templates/components/lazy-render-wrapper'], function (exports, _lazyRenderWrapper) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.TARGET_EVENT_NAMESPACE = undefined;

  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }

      return arr2;
    } else {
      return Array.from(arr);
    }
  }

  var Component = Ember.Component,
      ViewUtils = Ember.ViewUtils,
      $ = Ember.$,
      computed = Ember.computed,
      get = Ember.get,
      isNone = Ember.isNone,
      warn = Ember.warn;
  var TARGET_EVENT_NAMESPACE = exports.TARGET_EVENT_NAMESPACE = 'target-lazy-render-wrapper';

  /* Beware: use of private API! :(
  
  https://github.com/emberjs/rfcs/issues/168
  https://github.com/emberjs/ember.js/pull/12500
  */

  function getParent(view) {
    if (get(view, 'tagName') === '') {
      if (ViewUtils && ViewUtils.getViewBounds) {
        return $(ViewUtils.getViewBounds(view).parentElement);
      } else {
        return $(view._renderNode.contextualElement);
      }
    } else {
      return view.$().parent();
    }
  }

  var PASSABLE_PROPERTIES = ['delay', 'delayOnChange', 'duration', 'effect', 'event', 'hideOn', 'keepInWindow', 'side', 'showOn', 'spacing', 'isShown', 'tooltipIsVisible', 'hideDelay', 'target', 'text',

  /* Non-publicized attributes */

  'updateFor', 'targetAttachment', 'attachment', 'role', 'tabindex', '_shouldTargetGrandparentView'];

  var PASSABLE_ACTIONS = ['onDestroy', 'onHide', 'onRender', 'onShow',

  /* Deprecated lifecycle actions */

  'onTooltipDestroy', 'onTooltipHide', 'onTooltipRender', 'onTooltipShow'];

  var PASSABLE_OPTIONS = PASSABLE_PROPERTIES.concat(PASSABLE_ACTIONS);

  exports.default = Component.extend({

    /* 1. Services */

    /* 2. Defaults */

    tagName: '',
    layout: _lazyRenderWrapper.default,
    enableLazyRendering: false,
    event: 'hover', // Options are: hover, click, focus, none
    _childView: null, // This is set during the childView's didRender and is needed for the hide action

    _hasUserInteracted: false,
    _hasRendered: false,
    _shouldShowOnRender: false,

    /* 3. Single line Computed Property */

    /* 4. Multiline Computed Property */

    passedPropertiesObject: computed.apply(undefined, _toConsumableArray(PASSABLE_OPTIONS).concat([function () {
      var _this = this;

      return PASSABLE_OPTIONS.reduce(function (passablePropertiesObject, key) {

        /* If a property has been declared by Component extension ( TooltipOnElement.extend )
        or by handlebars instantiation ( {{tooltip-on-element}} ) then that property needs
        to be passed from this wrapper to the lazy-rendered tooltip or popover component
        */

        var value = _this.get(key);

        if (!isNone(value)) {
          if (PASSABLE_ACTIONS.indexOf(key) >= 0) {

            /* If a user has declared a lifecycle action property (onShow='someFunc')
            then we must pass down the correctly-scoped action instead of value
            */

            passablePropertiesObject[key] = function () {
              return _this.sendAction(key);
            };
          } else {
            passablePropertiesObject[key] = value;
          }
        }

        return passablePropertiesObject;
      }, {});
    }])),

    /**
     * A jQuery element that the _lazyRenderEvents will be
     * attached to during didInsertElement and
     * removed from during willDestroyElement
     *
     * @public
     * @property $target
     * @type jQuery element
     * @default the parent jQuery element
     */

    $target: computed('target', 'tetherComponentName', function () {
      var target = this.get('target'); // #some-id
      var $target = void 0;

      if (target) {
        $target = $(target);
      } else if (this.get('tetherComponentName').indexOf('-on-component') >= 0) {

        /* TODO(Andrew)
         Refactor this once we've gotten rid of the -on-component approach
        share the functionality with `onComponentTarget`
        */

        var targetView = this.get('parentView');

        if (!targetView) {
          warn('No targetView found');

          return null;
        } else if (!targetView.get('elementId')) {
          warn('No targetView.elementId');

          return null;
        }

        var targetViewElementId = targetView.get('elementId');

        $target = $('#' + targetViewElementId);
      } else {
        $target = getParent(this);
      }

      return $target;
    }),

    _shouldRender: computed('isShown', 'tooltipIsVisible', 'enableLazyRendering', '_hasUserInteracted', function () {

      /* If isShown, tooltipIsVisible, !enableLazyRendering, or _hasUserInteracted then
      we return true and set _hasRendered to true because
      there is never a scenario where this wrapper should destroy the tooltip
      */

      if (this.get('_hasRendered')) {
        return true;
      } else if (this.get('isShown') || this.get('tooltipIsVisible')) {

        this.set('_hasRendered', true);

        return true;
      } else if (!this.get('enableLazyRendering')) {

        this.set('_hasRendered', true);

        return true;
      } else if (this.get('_hasUserInteracted')) {

        this.set('_hasRendered', true);

        return true;
      }

      return false;
    }),

    _lazyRenderEvents: computed('event', function () {

      /* The lazy-render wrapper will only render the tooltip when
      the $target element is interacted with. This CP defines which
      events will trigger the rendering. Unless event="none" we always
      include focusin to keep the component accessible.
      */

      var event = this.get('event');

      if (event === 'none') {
        return [];
      }

      var _lazyRenderEvents = ['focusin'];

      if (event === 'hover') {
        _lazyRenderEvents.push('mouseenter');
      } else if (event === 'click') {
        _lazyRenderEvents.push('click');
      }

      return _lazyRenderEvents;
    }),

    /* 5. Observers */

    /* 6. Lifecycle Hooks */

    didInsertElement: function didInsertElement() {
      var _this2 = this;

      this._super.apply(this, arguments);

      if (this.get('_shouldRender')) {

        /* If the tooltip _shouldRender then we don't need
        any special $target event handling
        */

        return;
      }

      var $target = this.get('$target');

      if (this.get('event') === 'hover') {

        /* We've seen instances where a user quickly mouseenter and mouseleave the $target.
        By providing this event handler we ensure that the tooltip will only *show*
        if the user has mouseenter and not mouseleave immediately afterwards.
        */

        $target.on('mouseleave.' + TARGET_EVENT_NAMESPACE, function () {
          _this2.set('_shouldShowOnRender', false);
        });
      }

      this.get('_lazyRenderEvents').forEach(function (_lazyRenderEvent) {
        $target.on(_lazyRenderEvent + '.' + TARGET_EVENT_NAMESPACE, function () {
          if (_this2.get('_hasUserInteracted')) {
            $target.off(_lazyRenderEvent + '.' + TARGET_EVENT_NAMESPACE);
          } else {
            _this2.set('_hasUserInteracted', true);
            _this2.set('_shouldShowOnRender', true);
            _this2.set('_isInProcessOfShowing', true);
          }
        });
      });
    },
    willDestroyElement: function willDestroyElement() {
      this._super.apply(this, arguments);

      var $target = this.get('$target');

      this.get('_lazyRenderEvents').forEach(function (_lazyRenderEvent) {
        $target.off(_lazyRenderEvent + '.' + TARGET_EVENT_NAMESPACE);
      });

      $target.off('mouseleave.' + TARGET_EVENT_NAMESPACE);
    },


    /* 7. All actions */

    actions: {
      hide: function hide() {
        var _childView = this.get('_childView');

        /* The _childView.actions property is not available in Ember 1.13
        We will use _childView._actions until we drop support for Ember 1.13
        */

        if (_childView && _childView._actions && _childView._actions.hide) {
          _childView.send('hide');
        }
      }
    }

    /* 8. Custom / private methods */

  });
});