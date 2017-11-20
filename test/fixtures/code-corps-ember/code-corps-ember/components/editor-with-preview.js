define('code-corps-ember/components/editor-with-preview', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var service = Ember.inject.service;
  var isEmpty = Ember.isEmpty;
  var run = Ember.run;
  var set = Ember.set;
  var get = Ember.get;
  var computed = Ember.computed;
  var equal = Ember.computed.equal;
  var or = Ember.computed.or;
  var String = Ember.String;
  exports.default = Component.extend({
    attributeBindings: ['style'],
    classNames: ['editor-with-preview'],
    classNameBindings: ['mode'],

    /**
      The mode that the editor is in. (example: 'preview', 'editing')
       @property mode
      @type String
     */
    mode: null,

    /**
      The default message that is shown when previewing empty content.
       @property nothingToPreviewMessage
      @type String
     */
    nothingToPreviewMessage: '<p>Nothing to preview.</p>',

    /**
      Returns `true` if the content has been previewed more than once.
       @property previewedOnce
      @type Boolean
     */
    previewedOnce: false,

    /**
      Returns if the text area is in focus.
       @property textareaFocused
      @type Boolean
     */
    textareaFocused: false,

    /**
      @property currentUser
      @type Ember.Service
     */
    currentUser: service(),

    /**
      @property mentionFetcher
      @type Ember.Service
     */
    mentionFetcher: service(),

    /**
      @property store
      @type Ember.Service
     */
    store: service(),

    /**
      Returns if the editor is in editing mode.
       @property editing
      @type Boolean
     */
    editing: equal('mode', 'editing'),

    /**
      Returns if the editor is in preview mode.
       @property previewing
      @type Boolean
     */
    previewing: equal('mode', 'previewing'),

    /**
      Returns true if the `autofocus` or `previewedOnce` properties are true.
       @property shouldFocus
      @type Boolean
     */
    shouldFocus: or('autofocus', 'previewedOnce'),

    /**
      The style attribute for the `editor-with-preview` component
       @property style
      @type String
     */
    style: computed('height', function () {
      var height = get(this, 'height');

      if (height) {
        var css = 'min-height: ' + height + ';';
        return String.htmlSafe(css);
      }
    }),

    /**
      Sets the `mode` property to 'editing' and the `previewedOnce` property to
      `false` on init.
       @method init
     */
    init: function init() {
      this._super.apply(this, arguments);
      this.setProperties({ mode: 'editing', previewedOnce: false });
    },


    /**
      Attempts to focus the textarea after the component has rendered.
       @method didRender
     */
    didRender: function didRender() {
      this._super.apply(this, arguments);
      run.scheduleOnce('afterRender', this, '_attemptFocus');
    },


    /**
      After updating the attributes on a rerender, this resets the height
      if the `isLoading` property is `false`.
       @method didUpdateAttrs
     */
    didUpdateAttrs: function didUpdateAttrs() {
      this._super.apply(this, arguments);
      if (!get(this, 'isLoading')) {
        this._resetHeight();
      }
    },


    actions: {
      /**
        Action that sets the `textareaFocused` property to `false`.
         @method blurTextarea
       */
      blurTextarea: function blurTextarea() {
        set(this, 'textareaFocused', false);
      },


      /**
        Action that resets the editor height and sets the `mode` property to
        `editing`
         @method edit
       */
      edit: function edit() {
        this._resetHeight();
        set(this, 'mode', 'editing');
      },


      /**
        Action that forwards the `modifiedSubmit` action.
         @method modifiedSubmit
       */
      modifiedSubmit: function modifiedSubmit() {
        this.sendAction('modifiedSubmit');
      },


      /**
        Action that prepares and previews the contents of the editor.
         @method preview
       */
      preview: function preview() {
        this._setHeight();
        set(this, 'mode', 'previewing');
        set(this, 'previewedOnce', true);
        this._fetchPreview();
      }
    },

    _fetchPreview: function _fetchPreview() {
      var _this = this;

      set(this, 'fetchingPreview', true);

      var markdown = this.get('input');
      set(this, 'preview', '');

      if (isEmpty(markdown)) {
        set(this, 'preview', this.get('nothingToPreviewMessage'));
        set(this, 'fetchingPreview', false);
      } else {
        var preview = get(this, 'store').createRecord('preview', {
          markdown: markdown,
          user: this.get('currentUser.user')
        });
        preview.save().then(function (preview) {
          _this.get('mentionFetcher').fetchBodyWithMentions(preview, 'preview').then(function (body) {
            set(_this, 'preview', body);
            set(_this, 'fetchingPreview', false);
          });
        });
      }
    },
    _setHeight: function _setHeight() {
      var height = this.$().css('height');
      set(this, 'height', height);
    },
    _resetHeight: function _resetHeight() {
      set(this, 'height', null);
    },
    _attemptFocus: function _attemptFocus() {
      if (get(this, 'shouldFocus')) {
        this._focusTextarea();
      }
    },
    _focusTextarea: function _focusTextarea() {
      this.$('textarea').focus();
      set(this, 'textareaFocused', true);
    }
  });
});