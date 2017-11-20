define('ghost-admin/controllers/editor/edit', ['exports', 'ghost-admin/mixins/editor-base-controller'], function (exports, _editorBaseController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var Controller = Ember.Controller;
  exports.default = Controller.extend(_editorBaseController.default);
});