define('ember-simple-auth/instance-initializers/setup-session-restoration', ['exports', 'ember-simple-auth/utils/lookup'], function (exports, _emberSimpleAuthUtilsLookup) {
  exports['default'] = setupSessionRestoration;

  function setupSessionRestoration(instance) {
    var applicationRoute = (0, _emberSimpleAuthUtilsLookup['default'])(instance, 'route:application');
    var session = (0, _emberSimpleAuthUtilsLookup['default'])(instance, 'session:main');
    var originalBeforeModel = applicationRoute.beforeModel;
    var applyOriginalBeforeModel = function applyOriginalBeforeModel() {
      return originalBeforeModel.apply(applicationRoute, arguments);
    };
    applicationRoute.reopen({
      beforeModel: function beforeModel() {
        var _arguments = arguments;

        return session.restore().then(function () {
          return applyOriginalBeforeModel.apply(undefined, _arguments);
        }, function () {
          return applyOriginalBeforeModel.apply(undefined, _arguments);
        });
      }
    });
  }
});