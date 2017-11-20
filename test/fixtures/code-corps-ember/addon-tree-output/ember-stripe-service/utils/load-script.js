define('ember-stripe-service/utils/load-script', ['exports', 'ember'], function (exports, _ember) {
  exports['default'] = loadScript;

  /*
   * loadScript will load a JavaScript asset. Subsequent load
   * calls with a already requested URL will just chain off the
   * already existing promise.
   */

  var loadedScripts = {};

  function loadScript(url) {
    var promise = loadedScripts[url];
    if (!promise) {
      promise = new _ember['default'].RSVP.Promise(function (resolve, reject) {
        var element = document.createElement('script');
        element.type = 'text/javascript';
        element.async = false;
        element.addEventListener('load', function () {
          _ember['default'].run(function () {
            resolve();
          });
        }, false);
        element.addEventListener('error', function () {
          var error = new Error('Could not load script ' + url);
          _ember['default'].run(function () {
            reject(error);
          });
        }, false);

        element.src = url;

        var firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(element, firstScript);
      });

      loadedScripts[url] = promise;
    }

    return promise;
  }
});