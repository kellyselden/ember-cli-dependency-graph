define('ember-data-factory-guy/index', ['exports', 'ember-data-factory-guy/factory-guy', 'ember-data-factory-guy/mocks/exposed-request-functions', 'ember-data-factory-guy/utils/manual-setup', 'ember-data-factory-guy/builder/jsonapi-fixture-builder', 'ember-data-factory-guy/builder/rest-fixture-builder', 'ember-data-factory-guy/builder/json-fixture-builder', 'ember-data-factory-guy/scenario'], function (exports, _factoryGuy, _exposedRequestFunctions, _manualSetup, _jsonapiFixtureBuilder, _restFixtureBuilder, _jsonFixtureBuilder, _scenario) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.mock = exports.mockDelete = exports.mockUpdate = exports.mockCreate = exports.mockQueryRecord = exports.mockQuery = exports.mockReload = exports.mockFindAll = exports.mockFindRecord = exports.mockFind = exports.mockTeardown = exports.mockSetup = exports.Scenario = exports.manualSetup = exports.clearStore = exports.buildList = exports.build = exports.makeList = exports.makeNew = exports.make = exports.JSONAPIFixtureBuilder = exports.RESTFixtureBuilder = exports.JSONFixtureBuilder = undefined;
  exports.default = _factoryGuy.default;
  exports.JSONFixtureBuilder = _jsonFixtureBuilder.default;
  exports.RESTFixtureBuilder = _restFixtureBuilder.default;
  exports.JSONAPIFixtureBuilder = _jsonapiFixtureBuilder.default;
  exports.make = _factoryGuy.make;
  exports.makeNew = _factoryGuy.makeNew;
  exports.makeList = _factoryGuy.makeList;
  exports.build = _factoryGuy.build;
  exports.buildList = _factoryGuy.buildList;
  exports.clearStore = _factoryGuy.clearStore;
  exports.manualSetup = _manualSetup.default;
  exports.Scenario = _scenario.default;
  exports.mockSetup = _exposedRequestFunctions.mockSetup;
  exports.mockTeardown = _exposedRequestFunctions.mockTeardown;
  exports.mockFind = _exposedRequestFunctions.mockFind;
  exports.mockFindRecord = _exposedRequestFunctions.mockFindRecord;
  exports.mockFindAll = _exposedRequestFunctions.mockFindAll;
  exports.mockReload = _exposedRequestFunctions.mockReload;
  exports.mockQuery = _exposedRequestFunctions.mockQuery;
  exports.mockQueryRecord = _exposedRequestFunctions.mockQueryRecord;
  exports.mockCreate = _exposedRequestFunctions.mockCreate;
  exports.mockUpdate = _exposedRequestFunctions.mockUpdate;
  exports.mockDelete = _exposedRequestFunctions.mockDelete;
  exports.mock = _exposedRequestFunctions.mock;
});