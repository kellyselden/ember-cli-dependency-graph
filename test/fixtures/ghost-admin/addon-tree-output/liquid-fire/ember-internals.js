define('liquid-fire/ember-internals', ['exports', 'liquid-fire/ember-internals/common', 'liquid-fire/ember-internals/version-specific'], function (exports, _common, _versionSpecific) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'childRoute', {
    enumerable: true,
    get: function () {
      return _common.childRoute;
    }
  });
  Object.defineProperty(exports, 'routeName', {
    enumerable: true,
    get: function () {
      return _common.routeName;
    }
  });
  Object.defineProperty(exports, 'routeModel', {
    enumerable: true,
    get: function () {
      return _common.routeModel;
    }
  });
  Object.defineProperty(exports, 'routeIsStable', {
    enumerable: true,
    get: function () {
      return _common.routeIsStable;
    }
  });
  Object.defineProperty(exports, 'modelIsStable', {
    enumerable: true,
    get: function () {
      return _common.modelIsStable;
    }
  });
  Object.defineProperty(exports, 'containingElement', {
    enumerable: true,
    get: function () {
      return _versionSpecific.containingElement;
    }
  });
  Object.defineProperty(exports, 'initialize', {
    enumerable: true,
    get: function () {
      return _versionSpecific.initialize;
    }
  });
  Object.defineProperty(exports, 'getOutletStateTemplate', {
    enumerable: true,
    get: function () {
      return _versionSpecific.getOutletStateTemplate;
    }
  });
});