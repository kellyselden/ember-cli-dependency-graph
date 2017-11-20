define('ember-modal-dialog/initializers/add-modals-container', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (App) {
    var emberModalDialog = App.emberModalDialog || {};
    var modalContainerElId = emberModalDialog.modalRootElementId || 'modal-overlays';

    App.register('config:modals-container-id', modalContainerElId, { instantiate: false });

    App.inject('service:modal-dialog', 'destinationElementId', 'config:modals-container-id');

    appendContainerElement(App.rootElement, modalContainerElId);
  };

  /*globals document */
  var hasDOM = typeof document !== 'undefined';

  function appendContainerElement(rootElementId, id) {
    if (!hasDOM) {
      return;
    }

    if (document.getElementById(id)) {
      return;
    }

    var rootEl = document.querySelector(rootElementId);
    var modalContainerEl = document.createElement('div');
    modalContainerEl.id = id;
    rootEl.appendChild(modalContainerEl);
  }
});