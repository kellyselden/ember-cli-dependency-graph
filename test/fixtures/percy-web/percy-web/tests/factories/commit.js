define('percy-web/tests/factories/commit', ['ember-data-factory-guy', 'faker'], function (_emberDataFactoryGuy, _faker) {
  'use strict';

  _emberDataFactoryGuy.default.define('commit', {
    default: {
      committerName: function committerName() {
        return _faker.default.name.findName();
      },
      authorName: function authorName() {
        return _faker.default.name.findName();
      },
      committedAt: function committedAt() {
        return new Date();
      },
      createdAt: function createdAt() {
        return new Date();
      },
      updatedAt: function updatedAt() {
        return new Date();
      },
      sha: '01cb4be6f5dc5a3d19d57bbf840328fd0eb3a01f',
      shaShort: '01cb4be',
      message: function message() {
        return _faker.default.lorem.sentence(5);
      }
    },
    traits: {
      longMessage: { message: function message() {
          return _faker.default.lorem.sentence(30);
        } },
      noSpacesMessage: { message: function message() {
          return _faker.default.lorem.slug;
        } }
    }
  });
});