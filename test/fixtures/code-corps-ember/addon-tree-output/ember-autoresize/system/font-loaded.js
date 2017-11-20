define('ember-autoresize/system/font-loaded', ['exports', 'ember', 'ember-autoresize/system/adobe-blank', 'dom-ruler'], function (exports, _ember, _emberAutoresizeSystemAdobeBlank, _domRuler) {
  var RSVP = _ember['default'].RSVP;
  var run = _ember['default'].run;

  function injectAdobeBlankToElement(element) {
    var sheet;
    // Find the stylesheet object created by the DOM element
    for (var i = document.styleSheets.length - 1; i >= 0; i--) {
      var stylesheet = document.styleSheets[i];
      if (stylesheet.ownerNode === element) {
        sheet = stylesheet;
        break;
      }
    }

    if (!sheet) {
      return false;
    }

    if (sheet.insertRule) {
      sheet.insertRule('@font-face { ' + _emberAutoresizeSystemAdobeBlank['default'] + ' }', 0);
    } else {
      sheet.addRule('@font-face', _emberAutoresizeSystemAdobeBlank['default'], 0);
    }
    return true;
  }

  var _injectAdobeBlankPromise;
  function injectAdobeBlank() {
    if (!_injectAdobeBlankPromise) {
      _injectAdobeBlankPromise = new RSVP.Promise(function (resolve) {
        var element = document.createElement('style');
        var parent = document.head || document.body;
        parent.appendChild(element);

        // Under memory pressure or in some other cases Chrome may not update
        // the document.styleSheets property synchronously. Here we poll to
        // be sure it has updated.
        //
        // See: https://github.com/tim-evans/ember-autoresize/issues/27
        //
        function checkInjection() {
          var injected = injectAdobeBlankToElement(element);
          if (injected) {
            run(null, resolve);
          } else {
            window.setTimeout(checkInjection, 0);
          }
        }
        checkInjection();
      });
    }
    return _injectAdobeBlankPromise;
  }

  var SPECIMEN = " !\"\\#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~";
  var referenceSize;

  function getReferenceSize() {
    if (referenceSize) {
      return referenceSize;
    }
    return referenceSize = (0, _domRuler.measureText)(SPECIMEN, {
      fontFamily: '"AdobeBlank"'
    }, {});
  }

  function checkIfFontLoaded(fontFamily, options, resolve, reject) {
    var blankSize = getReferenceSize();
    var size = (0, _domRuler.measureText)(SPECIMEN, {
      "font-family": fontFamily + ', "AdobeBlank"'
    }, {});

    if (size.width !== blankSize.width || size.height !== blankSize.height) {
      resolve();
    } else if (options.timeout <= 0) {
      reject();
    } else {
      setTimeout(function () {
        options.timeout -= 50;
        checkIfFontLoaded(fontFamily, options, resolve, reject);
      }, 50);
    }
  }

  var loadedFonts = {};

  exports['default'] = function (fontFamily) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? { timeout: 3000 } : arguments[1];

    if (loadedFonts[fontFamily] == null) {
      loadedFonts[fontFamily] = injectAdobeBlank().then(function () {
        return new RSVP.Promise(function (resolve, reject) {
          checkIfFontLoaded(fontFamily, _ember['default'].copy(options, true), run.bind(resolve), run.bind(reject));
        });
      });
    }

    return loadedFonts[fontFamily];
  };
});