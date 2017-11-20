define('percy-web/tests/factories/repo', ['ember-data-factory-guy', 'faker'], function (_emberDataFactoryGuy, _faker) {
  'use strict';

  _emberDataFactoryGuy.default.define('repo', {
    default: {
      name: function name() {
        return _faker.default.lorem.slug(20);
      },
      htmlUrl: function htmlUrl() {
        return _faker.default.internet.url();
      },
      isPrivate: false
    }
  });
});