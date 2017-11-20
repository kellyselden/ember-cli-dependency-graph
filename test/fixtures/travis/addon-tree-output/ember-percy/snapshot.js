define('ember-percy/snapshot', ['exports', 'ember', 'ember-percy/native-xhr', 'ember-percy/mockjax-wrapper'], function (exports, _ember, _emberPercyNativeXhr, _emberPercyMockjaxWrapper) {
  exports.percySnapshot = percySnapshot;

  function getDoctype() {
    var doctypeNode = document.doctype;
    if (!doctypeNode || !doctypeNode.name) {
      return '<!DOCTYPE html>';
    }
    var doctype = "<!DOCTYPE " + doctypeNode.name + (doctypeNode.publicId ? ' PUBLIC "' + doctypeNode.publicId + '"' : '') + (!doctypeNode.publicId && doctypeNode.systemId ? ' SYSTEM' : '') + (doctypeNode.systemId ? ' "' + doctypeNode.systemId + '"' : '') + '>';
    return doctype;
  }

  // Set the property value into the attribute value for snapshotting inputs
  function setAttributeValues(dom) {
    // Limit scope to inputs only as textareas do not retain their value when cloned
    var elems = dom.find('input[type=text], input[type=checkbox], input[type=radio]');

    _ember['default'].$(elems).each(function () {
      var elem = _ember['default'].$(this);
      switch (elem.attr('type')) {
        case 'checkbox':
        case 'radio':
          if (elem.is(':checked')) {
            elem.attr('checked', '');
          }
          break;
        default:
          elem.attr('value', elem.val());
      }
    });

    return dom;
  }

  function percySnapshot(name, options) {
    // Skip if Testem is not available (we're probably running from `ember server` and Percy is not
    // enabled anyway).
    if (!window.Testem) {
      return;
    }

    // Automatic name generation for QUnit tests by passing in the `assert` object.
    if (name.test && name.test.module && name.test.module.name && name.test.testName) {
      name = name.test.module.name + ' | ' + name.test.testName;
    } else if (name.fullTitle) {
      // Automatic name generation for Mocha tests by passing in the `this.test` object.
      name = name.fullTitle();
    }

    var snapshotRoot = undefined;
    options = options || {};
    var scope = options.scope;

    // Create a full-page DOM snapshot from the current testing page.
    // TODO(fotinakis): more memory-efficient way to do this?
    var domCopy = _ember['default'].$('html').clone();
    var testingContainer = domCopy.find('#ember-testing');

    if (scope) {
      snapshotRoot = testingContainer.find(scope);
    } else {
      snapshotRoot = testingContainer;
    }

    var snapshotHtml = setAttributeValues(snapshotRoot).html();

    // Hoist the testing container contents up to the body.
    // We need to use the original DOM to keep the head stylesheet around.
    domCopy.find('body').html(snapshotHtml);

    _ember['default'].run(function () {
      (0, _emberPercyMockjaxWrapper.maybeDisableMockjax)();
      _ember['default'].$.ajax('/_percy/snapshot', {
        xhr: _emberPercyNativeXhr.getNativeXhr,
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
          name: name,
          content: getDoctype() + domCopy[0].outerHTML,
          widths: options.widths,
          breakpoints: options.breakpoints,
          enableJavaScript: options.enableJavaScript
        }),
        statusCode: {
          400: function _(jqXHR) {
            // Bubble up 400 errors, ie. when given options are invalid.
            throw jqXHR.responseText;
          }
        }
      });
      (0, _emberPercyMockjaxWrapper.maybeResetMockjax)();
    });
  }
});