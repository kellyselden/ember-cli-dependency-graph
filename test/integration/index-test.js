'use strict';

const expect = require('chai').expect;
const path = require('path');
const Graph = require('../../src');
const Node = require('../../src/node');

describe('Integration - index', function() {
  this.timeout('5000');

  it('my-app', function() {
    let appPath = path.join(__dirname, '../fixtures/my-app');

    let graph = Graph.build(appPath, 'my-app');

    expect(graph).to.be.an.instanceof(Graph);
    expect(graph.root).to.be.an.instanceof(Node);
    expect(graph.flattened.length).to.equal(69);
    expect(graph.calculateDead().length).to.equal(13);
  });

  it('package-hint-historic-resolver', function() {
    let appPath = path.join(__dirname, '../fixtures/package-hint-historic-resolver');

    let graph = Graph.build(appPath, 'package-hint-historic-resolver', {
      include: ['ember-metrics/metrics-adapters/google-analytics.js']
    });

    expect(graph).to.be.an.instanceof(Graph);
    expect(graph.root).to.be.an.instanceof(Node);
    expect(graph.flattened.length).to.equal(465);
    expect(graph.calculateDead().length).to.equal(655);
  });

  it('percy-web', function() {
    let appPath = path.join(__dirname, '../fixtures/percy-web');

    let graph = Graph.build(appPath, 'percy-web');

    expect(graph).to.be.an.instanceof(Graph);
    expect(graph.root).to.be.an.instanceof(Node);
    expect(graph.flattened.length).to.equal(1478);
    expect(graph.calculateDead().length).to.equal(75);
  });

  it('ghost-admin', function() {
    let appPath = path.join(__dirname, '../fixtures/ghost-admin');

    let graph = Graph.build(appPath, 'ghost-admin');

    expect(graph).to.be.an.instanceof(Graph);
    expect(graph.root).to.be.an.instanceof(Node);
    expect(graph.flattened.length).to.equal(1803);
    expect(graph.calculateDead().length).to.equal(75);
  });

  it('travis', function() {
    let appPath = path.join(__dirname, '../fixtures/travis');

    let graph = Graph.build(appPath, 'travis');

    expect(graph).to.be.an.instanceof(Graph);
    expect(graph.root).to.be.an.instanceof(Node);
    expect(graph.flattened.length).to.equal(1392);
    expect(graph.calculateDead().length).to.equal(91);
  });

  it('code-corps-ember', function() {
    let appPath = path.join(__dirname, '../fixtures/code-corps-ember');

    let graph = Graph.build(appPath, 'code-corps-ember', {
      include: ['ember-test-selectors/utils/bind-data-test-attributes.js']
    });

    expect(graph).to.be.an.instanceof(Graph);
    expect(graph.root).to.be.an.instanceof(Node);
    expect(graph.flattened.length).to.equal(1830);
    expect(graph.calculateDead().length).to.equal(142);
  });
});
