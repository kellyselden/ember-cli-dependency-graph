define('percy-web/tests/factories/user', ['ember-data-factory-guy', 'faker'], function (_emberDataFactoryGuy, _faker) {
  'use strict';

  _emberDataFactoryGuy.default.define('user', {
    default: {
      login: function login() {
        return _faker.default.internet.userName();
      },
      name: function name() {
        return _faker.default.name.firstName() + ' ' + _faker.default.name.lastName();
      },
      email: function email() {
        return _faker.default.internet.email();
      },
      avatarUrl: function avatarUrl() {
        return _faker.default.internet.avatar();
      },
      githuId: function githuId() {
        return _faker.default.random.number();
      },
      lastSyncedAt: function lastSyncedAt() {
        return _faker.default.date.past();
      },
      lastPrivateSyncedAt: function lastPrivateSyncedAt() {
        return _faker.default.date.past();
      },
      userHash: function userHash() {
        return _faker.default.random.number();
      },
      createdAt: function createdAt() {
        return new Date();
      },
      updatedAt: function updatedAt() {
        return new Date();
      }

      // add this when we need it
      // orgainzations: FactoryGuy.belongsTo('organization'),
    },
    traits: {}
  });
});