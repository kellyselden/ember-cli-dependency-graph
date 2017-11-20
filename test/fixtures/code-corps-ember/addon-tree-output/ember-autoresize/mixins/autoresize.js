define("ember-autoresize/mixins/autoresize", ["exports", "ember", "dom-ruler", "ember-autoresize/system/font-loaded"], function (exports, _ember, _domRuler, _emberAutoresizeSystemFontLoaded) {
  var get = _ember["default"].get;
  var set = _ember["default"].set;
  var _Ember$run = _ember["default"].run;
  var scheduleOnce = _Ember$run.scheduleOnce;
  var once = _Ember$run.once;
  var isEmpty = _ember["default"].isEmpty;
  var computed = _ember["default"].computed;
  var alias = _ember["default"].computed.alias;
  var observer = _ember["default"].observer;
  var on = _ember["default"].on;

  // jQuery is not loaded in fastboot
  var trim = function trim(str) {
    if (str !== null && str !== undefined) {
      return str.trim();
    }
  };

  function withUnits(number) {
    var unitlessNumber = parseFloat(number + '', 10) + '';
    if (unitlessNumber === number + '') {
      return number + "px";
    }
    return number;
  }

  /**
    This mixin provides common functionality for automatically
    resizing view depending on the contents of the view. To
    make your view resize, you need to set the `autoresize`
    property to `true`, and let the mixin know whether it
    can resize the height of width.
  
    In addition, `autoResizeText` is a required property for
    this mixin. It is already provided for `Ember.TextField` and
    `Ember.TextArea`.
  
    @class AutoResize
    @extends Ember.Mixin
    @since Ember 1.0.0-rc3
   */
  exports["default"] = _ember["default"].Mixin.create( /** @scope AutoResize.prototype */{

    /**
      Add `ember-auto-resize` so additional
      styling can be applied indicating that
      the text field will automatically resize.
       @property classNameBindings
     */
    classNameBindings: ['autoresize:ember-auto-resize'],

    /**
      Whether the view using this mixin should
      autoresize it's contents. To enable autoresizing
      using the view's default resizing, set
      the attribute in your template.
       ```handlebars
      {{input autoresize=true}}
      ```
       @property autoresize
      @type Boolean
      @default false
     */
    autoresize: computed({
      get: function get() {},
      set: function set(_, value) {
        if (typeof document === 'undefined') {
          return false;
        }
        return value;
      }
    }),

    /**
      The DOM element that should be targeted
      for autoresizing. This defaults to the
      component's element, but may be used
      to autoresize a child element in cases
      where you may be using raw HTML elements.
       This element *must* be observable to trigger
      proper resizing.
       @property autoresizeElement
      @default element
      @type DOMElement
     */
    autoresizeElement: null,

    autoresizeElementDidChange: on('didInsertElement', function () {
      set(this, 'autoresizeElement', get(this, 'element'));
    }),

    /**
      The current dimensions of the view being
      resized in terms of an object hash that
      includes a `width` and `height` property.
       @property dimensions
      @default null
      @type Object
     */
    dimensions: null,

    /**
      Whether the auto resize mixin should resize
      the width of this view.
       @property shouldResizeWidth
      @default false
      @type Boolean
     */
    shouldResizeWidth: false,

    /**
      Whether the auto resize mixin should resize
      the height of this view.
       @property shouldResizeHeight
      @default false
      @type Boolean
     */
    shouldResizeHeight: false,

    /**
      If set, this property will dictate how much
      the view is allowed to resize horizontally
      until it either falls back to scrolling or
      resizing vertically.
       @property maxWidth
      @default null
      @type Number
     */
    maxWidth: alias('max-width'),

    /**
      If set, this property dictates how much
      the view is allowed to resize vertically.
      If this is not set and the view is allowed
      to resize vertically, it will do so infinitely.
       @property maxHeight
      @default null
      @type Number
     */
    maxHeight: alias('max-height'),

    /**
      A required property that should alias the
      property that should trigger recalculating
      the dimensions of the view.
       @property autoResizeText
      @required
      @type String
     */
    autoResizeText: null,

    /**
      Whether the autoResizeText has been sanitized
      and should be treated as HTML.
       @property ignoreEscape
      @default false
      @type Boolean
     */
    ignoreEscape: false,

    /**
      Whether whitespace should be treated as significant
      contrary to any styles on the view.
       @property significantWhitespace
      @default false
      @type Boolean
     */
    significantWhitespace: false,

    /**
      Schedule measuring the view's size.
      This happens automatically when the
      `autoResizeText` property changes.
       @method scheduleMeasurement
     */
    scheduleMeasurement: on('init', observer('autoResizeText', function () {
      if (get(this, 'autoresize') && !get(this, 'isDestroyed')) {
        once(this, 'measureSize');
      }
    })),

    /**
      Detect when a font is loaded and resize the box.
       @private
      @method fontFamilyLoaded
     */
    fontFamilyLoaded: observer('autoresizeElement', function () {
      var _this = this;

      var styles = (0, _domRuler.getStyles)(get(this, 'autoresizeElement'));
      var fontFamilies = styles.fontFamily.split(',');
      _ember["default"].A(fontFamilies).forEach(function (fontFamily) {
        (0, _emberAutoresizeSystemFontLoaded["default"])(trim(fontFamily)).then(function () {
          _this.scheduleMeasurement();
        }, function () {});
      });
    }),

    /**
      Measures the size of the text of the element.
       @method measureSize
     */
    measureSize: function measureSize() {
      var element = get(this, 'autoresizeElement');
      if (element == null) {
        return;
      }

      var text = get(this, 'autoResizeText');

      if (isEmpty(text) || get(this, 'isDestroying')) {
        set(this, 'measuredSize', { width: 0, height: 0 });
      }

      // Provide extra styles that will restrict
      // width / height growth
      var styles = {};

      if (get(this, 'shouldResizeWidth')) {
        if (get(this, 'maxWidth') != null) {
          styles.maxWidth = withUnits(get(this, 'maxWidth'));
        }
      } else {
        styles.maxWidth = (0, _domRuler.getLayout)(element).width + 'px';
      }

      if (get(this, 'shouldResizeHeight')) {
        if (get(this, 'maxHeight') != null) {
          styles.maxHeight = withUnits(get(this, 'maxHeight'));
        }
      } else {
        styles.maxHeight = (0, _domRuler.getLayout)(element).height + 'px';
      }

      function measureRows(rows) {
        var html = '';
        for (var i = 0, len = parseInt(rows, 10); i < len; i++) {
          html += '<br>';
        }
        return (0, _domRuler.measureText)(html, styles, { template: element, escape: false }).height;
      }

      // Handle 'rows' attribute on <textarea>s
      if (get(this, 'rows')) {
        styles.minHeight = measureRows(get(this, 'rows')) + 'px';
      }

      // Handle 'max-rows' attribute on <textarea>s
      if (get(this, 'max-rows') && get(this, 'maxHeight') == null) {
        set(this, 'maxHeight', measureRows(get(this, 'max-rows')));
        styles.maxHeight = get(this, 'maxHeight') + 'px';
      }

      // Force white-space to pre-wrap to make
      // whitespace significant
      if (get(this, 'significantWhitespace')) {
        styles.whiteSpace = 'pre-wrap';
      }

      // Create a signature so we can cache the max width and height
      var signature = styles.maxWidth + styles.maxHeight;
      if (signature !== this._signature) {
        var maxDimensions = (0, _domRuler.measureText)('', {
          width: styles.maxWidth,
          height: styles.maxHeight
        }, { template: element });
        this._signature = signature;
        this._maxWidth = maxDimensions.width;
        this._maxHeight = maxDimensions.height;
      }

      var size = (0, _domRuler.measureText)(text, styles, {
        template: element,
        escape: !get(this, 'ignoreEscape')
      });

      if (styles.maxWidth) {
        size.maxWidth = this._maxWidth;
      }
      if (styles.maxHeight) {
        size.maxHeight = this._maxHeight;
      }
      set(this, 'measuredSize', size);
    },

    /**
      Alter the `dimensions` property of the
      view to conform to the measured size of
      the view.
       @method measuredSizeDidChange
     */
    measuredSizeDidChange: observer('measuredSize', 'autoresizeElement', function () {
      var size = get(this, 'measuredSize');
      if (size == null) {
        return;
      }

      var maxWidth = size.maxWidth;
      var maxHeight = size.maxHeight;

      var layoutDidChange = false;
      var dimensions = {};

      if (get(this, 'shouldResizeWidth')) {
        // Account for off-by-one error in FireFox
        // (specifically, input elements have 1px
        //  of scroll when this isn't applied)
        // TODO: sniff for this bug and fix it!
        size.width += 1;

        if (maxWidth != null && size.width > maxWidth) {
          dimensions.width = maxWidth;
        } else {
          dimensions.width = size.width;
        }
        layoutDidChange = true;
      }

      if (get(this, 'shouldResizeHeight')) {
        if (maxHeight != null && size.height > maxHeight) {
          dimensions.height = maxHeight;
        } else {
          dimensions.height = size.height;
        }
        layoutDidChange = true;
      }

      set(this, 'dimensions', dimensions);

      if (layoutDidChange) {
        scheduleOnce('render', this, 'dimensionsDidChange');
      }
    }),

    /**
      Retiles the view at the end of the render queue.
      @method dimensionsDidChange
     */
    dimensionsDidChange: function dimensionsDidChange() {
      var dimensions = get(this, 'dimensions');
      var styles = {};

      for (var key in dimensions) {
        if (!dimensions.hasOwnProperty(key)) {
          continue;
        }
        styles[key] = dimensions[key] + 'px';
      }

      if (get(this, 'maxHeight') == null) {
        styles.overflow = 'hidden';
      }
      var element = get(this, 'autoresizeElement');
      if (element) {
        for (var prop in styles) {
          element.style[prop] = styles[prop];
        }
      }
    }
  });
});