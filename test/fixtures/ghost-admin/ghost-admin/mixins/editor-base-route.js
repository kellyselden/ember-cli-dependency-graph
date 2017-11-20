define('ghost-admin/mixins/editor-base-route', ['exports', 'ghost-admin/mixins/shortcuts-route', 'ghost-admin/utils/ctrl-or-cmd', 'ghost-admin/mixins/style-body'], function (exports, _shortcutsRoute, _ctrlOrCmd, _styleBody) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var $ = Ember.$;
    var Mixin = Ember.Mixin;
    var run = Ember.run;


    var generalShortcuts = {};
    generalShortcuts[_ctrlOrCmd.default + '+alt+p'] = 'publish';

    exports.default = Mixin.create(_styleBody.default, _shortcutsRoute.default, {
        classNames: ['editor'],

        shortcuts: generalShortcuts,

        actions: {
            save: function save() {
                var selectedElement = $(document.activeElement);

                if (selectedElement.is('input[type="text"]')) {
                    selectedElement.trigger('focusout');
                }

                run.scheduleOnce('actions', this, function () {
                    this.get('controller').send('save');
                });
            },
            publish: function publish() {
                var controller = this.get('controller');

                controller.send('setSaveType', 'publish');
                controller.send('save');
            },
            willTransition: function willTransition(transition) {
                var controller = this.get('controller');
                var scratch = controller.get('model.scratch');
                var controllerIsDirty = controller.get('hasDirtyAttributes');
                var model = controller.get('model');
                var state = model.getProperties('isDeleted', 'isSaving', 'hasDirtyAttributes', 'isNew');

                if (this.get('upgradeStatus.isRequired')) {
                    return this._super.apply(this, arguments);
                }

                var fromNewToEdit = this.get('routeName') === 'editor.new' && transition.targetName === 'editor.edit' && transition.intent.contexts && transition.intent.contexts[0] && transition.intent.contexts[0].id === model.get('id');

                var deletedWithoutChanges = state.isDeleted && (state.isSaving || !state.hasDirtyAttributes);

                if (!fromNewToEdit && !deletedWithoutChanges && controllerIsDirty) {
                    transition.abort();
                    controller.send('toggleLeaveEditorModal', transition);
                    return;
                }

                // The controller may hold model state that will be lost in the
                // new->edit transition, so we need to apply it now.
                if (fromNewToEdit && controllerIsDirty) {
                    if (scratch !== model.get('mobiledoc')) {
                        model.set('mobiledoc', scratch);
                    }
                }

                // make sure the save tasks aren't still running in the background
                // after leaving the edit route
                // TODO: the edit screen should really be a component so that we get
                // automatic state cleanup and task cancellation
                controller.send('cancelAutosave');

                if (state.isNew) {
                    model.deleteRecord();
                }

                // since the transition is now certain to complete..
                window.onbeforeunload = null;

                // remove model-related listeners created in editor-base-route
                this.detachModelHooks(controller, model);
            }
        },

        attachModelHooks: function attachModelHooks(controller, model) {
            // this will allow us to track when the model is saved and update the controller
            // so that we can be sure controller.hasDirtyAttributes is correct, without having to update the
            // controller on each instance of `model.save()`.
            //
            // another reason we can't do this on `model.save().then()` is because the post-settings-menu
            // also saves the model, and passing messages is difficult because we have two
            // types of editor controllers, and the PSM also exists on the posts.post route.
            //
            // The reason we can't just keep this functionality in the editor controller is
            // because we need to remove these handlers on `willTransition` in the editor route.
            model.on('didCreate', controller, controller.get('modelSaved'));
            model.on('didUpdate', controller, controller.get('modelSaved'));
        },
        detachModelHooks: function detachModelHooks(controller, model) {
            model.off('didCreate', controller, controller.get('modelSaved'));
            model.off('didUpdate', controller, controller.get('modelSaved'));
        },
        setupController: function setupController(controller, model) {
            var tags = model.get('tags');

            model.set('scratch', model.get('mobiledoc'));
            model.set('titleScratch', model.get('title'));

            // reset the leave editor transition so new->edit will still work
            controller.set('leaveEditorTransition', null);

            this._super.apply(this, arguments);

            if (tags) {
                // used to check if anything has changed in the editor
                controller.set('previousTagNames', tags.mapBy('name'));
            } else {
                controller.set('previousTagNames', []);
            }

            // trigger an immediate autosave timeout if model has changed between
            // new->edit (typical as first save will only contain the first char)
            // so that leaving the route waits for save instead of showing the
            // "Are you sure you want to leave?" modal unexpectedly
            if (!model.get('isNew') && model.get('hasDirtyAttributes')) {
                controller.get('_autosave').perform();
            }

            // reset save-on-first-change (gh-koenig specific)
            // controller._hasChanged = false;

            // attach model-related listeners created in editor-base-route
            this.attachModelHooks(controller, model);
        }
    });
});