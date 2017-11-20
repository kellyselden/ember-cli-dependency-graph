define('ember-test-selectors/utils/bind-data-test-attributes', ['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = bindDataTestAttributes;
  var isArray = Ember.isArray;


  var TEST_SELECTOR_PREFIX = /data-test-.*/;

  function bindDataTestAttributes(component) {
    var dataTestProperties = [];
    for (var attr in component) {
      if (TEST_SELECTOR_PREFIX.test(attr)) {
        dataTestProperties.push(attr);
      }
    }

    if (dataTestProperties.length === 0) {
      return;
    }

    var tagName = component.get('tagName');
    if (tagName === '') {
      var message = 'ember-test-selectors could not bind data-test-* properties on ' + component + ' ' + 'automatically because tagName is empty.';

      (true && Ember.warn(message, false, {
        id: 'ember-test-selectors.empty-tag-name'
      }));


      return;
    }

    var computedBindings = component.attributeBindings && component.attributeBindings.isDescriptor;
    if (computedBindings) {
      var _message = 'ember-test-selectors could not bind data-test-* properties on ' + component + ' ' + 'automatically because attributeBindings is a computed property.';

      (true && Ember.warn(_message, false, {
        id: 'ember-test-selectors.computed-attribute-bindings'
      }));


      return;
    }

    var attributeBindings = component.getWithDefault('attributeBindings', []);
    if (!isArray(attributeBindings)) {
      attributeBindings = [attributeBindings];
    } else {
      attributeBindings = attributeBindings.slice();
    }

    dataTestProperties.forEach(function (it) {
      return attributeBindings.push(it);
    });

    component.set('attributeBindings', attributeBindings);
  }
});