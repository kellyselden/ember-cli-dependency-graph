define('code-corps-ember/components/project-long-description', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Component = Ember.Component;
  var or = Ember.computed.or;
  var isPresent = Ember.isPresent;
  var set = Ember.set;
  var get = Ember.get;
  exports.default = Component.extend({
    classNames: ['project-long-description'],

    /**
      Property that holds the edit mode status.
       @property isEditing
      @type Boolean
     */
    isEditing: false,

    /**
      Property that holds whether the project has a description or not.
       @property descriptionIsBlank
      @type Boolean
     */
    descriptionIsBlank: false,

    /**
      Returns whether the editor should be displayed or not based on having no
      description or being toggled into edit mode.
       @property shouldDisplayEditor
      @type Boolean
     */
    shouldDisplayEditor: or('isEditing', 'descriptionIsBlank'),

    didReceiveAttrs: function didReceiveAttrs() {
      this._inferIfNeedsDescription();
      return this._super.apply(this, arguments);
    },


    actions: {

      /**
        Action that leaves edit mode without saving changes.
         @method cancel
       */
      cancel: function cancel() {
        this._enterReadMode();
      },


      /**
        Action that toggles edit mode.
         @method edit
       */
      edit: function edit() {
        this._enterEditMode();
      },


      /**
        Action that saves changes and leaves edit mode.
         @method save
       */
      save: function save() {
        var _this = this;

        get(this, 'project').save().then(function () {
          _this._enterReadMode();
          _this._inferIfNeedsDescription();
        });
      }
    },

    _enterEditMode: function _enterEditMode() {
      set(this, 'isEditing', true);
    },
    _enterReadMode: function _enterReadMode() {
      set(this, 'isEditing', false);
    },
    _inferIfNeedsDescription: function _inferIfNeedsDescription() {
      if (isPresent(get(this, 'project.longDescriptionBody'))) {
        set(this, 'descriptionIsBlank', false);
      } else {
        set(this, 'descriptionIsBlank', true);
      }
    }
  });
});