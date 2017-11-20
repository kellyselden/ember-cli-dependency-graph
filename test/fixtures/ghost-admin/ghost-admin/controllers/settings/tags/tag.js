define('ghost-admin/controllers/settings/tags/tag', ['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    var Controller = Ember.Controller;
    var controller = Ember.inject.controller;
    var alias = Ember.computed.alias;
    var service = Ember.inject.service;
    exports.default = Controller.extend({

        showDeleteTagModal: false,

        tag: alias('model'),
        isMobile: alias('tagsController.isMobile'),

        applicationController: controller('application'),
        tagsController: controller('settings.tags'),
        notifications: service(),

        _saveTagProperty: function _saveTagProperty(propKey, newValue) {
            var _this = this;

            var tag = this.get('tag');
            var currentValue = tag.get(propKey);

            if (newValue) {
                newValue = newValue.trim();
            }

            // Quit if there was no change
            if (newValue === currentValue) {
                return;
            }

            tag.set(propKey, newValue);
            // TODO: This is required until .validate/.save mark fields as validated
            tag.get('hasValidated').addObject(propKey);

            tag.save().then(function (savedTag) {
                // replace 'new' route with 'tag' route
                _this.replaceRoute('settings.tags.tag', savedTag);
            }).catch(function (error) {
                if (error) {
                    _this.get('notifications').showAPIError(error, { key: 'tag.save' });
                }
            });
        },
        _deleteTag: function _deleteTag() {
            var _this2 = this;

            var tag = this.get('tag');

            return tag.destroyRecord().then(function () {
                _this2._deleteTagSuccess();
            }, function (error) {
                _this2._deleteTagFailure(error);
            });
        },
        _deleteTagSuccess: function _deleteTagSuccess() {
            var currentRoute = this.get('applicationController.currentRouteName') || '';

            if (currentRoute.match(/^settings\.tags/)) {
                this.transitionToRoute('settings.tags.index');
            }
        },
        _deleteTagFailure: function _deleteTagFailure(error) {
            this.get('notifications').showAPIError(error, { key: 'tag.delete' });
        },


        actions: {
            setProperty: function setProperty(propKey, value) {
                this._saveTagProperty(propKey, value);
            },
            toggleDeleteTagModal: function toggleDeleteTagModal() {
                this.toggleProperty('showDeleteTagModal');
            },
            deleteTag: function deleteTag() {
                return this._deleteTag();
            }
        }
    });
});