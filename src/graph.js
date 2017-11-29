'use strict';

const fs = require('fs');
const path = require('path');
const resolve = require('resolve');
const Node = require('./node');
const walkSync = require('walk-sync');
const mrDepWalk = require('mr-dep-walk');
const debug = require('debug')('ember-cli-dependency-graph');

function recurse(node, entryPath, entryName, visited) {
  let deps = mrDepWalk.depsFromFile(path.join(entryPath, node.name), {
    sourceType: 'script'
  });
  let parent = node;
  deps.forEach(dep => {
    let parts = dep.match(/^([^/]*)\/?(.*)$/) || [];
    let root = parts[1];
    let rest = parts[2];
    let attempts = [];
    let original = dep;
    if (root === entryName) {
      if (rest === 'config/environment') {
        dep = path.join(entryName, 'config/environments');
        fs.readdirSync(path.join(entryPath, dep)).forEach(file => {
          let child = new Node(parent, path.join(dep, file));
          if (visited.has(child.name)) {
            return;
          }
          visited.add(child.name);
          parent.addChild(child);
        });
        return;
      }
      attempts.push({ dep, original });
    } else if (root === 'module') {
      return;
    } else if (root === 'ember') {
      dep = path.join('vendor', dep);
      let files = walkSync(path.join(entryPath, dep), {
        directories: false,
        globs: ['**/*.js']
      });
      files.forEach(file => {
        let child = new Node(parent, path.join(dep, file));
        if (visited.has(child.name)) {
          return;
        }
        visited.add(child.name);
        parent.addChild(child);
      });
      return;
    } else {
      let parts = dep.match(/^npm:(.*)$/) || [];
      let browserify = parts[1];
      if (browserify) {
        dep = 'browserify/browserify.js';
        attempts.push({ dep, original });
      } else if (root === 'ember-data') {
        // if (rest === '-private') {
        //   dep = rest;
        // }
        attempts.push({ dep: path.join('addon-tree-output/modules', dep), original });
        // older ember-data
        attempts.push({ dep: path.join('addon-tree-output', dep), original });
      } else {
        dep = path.join('addon-tree-output', dep);
        attempts.push({ dep, original });
      }
    }
    let resolvedPath;
    for (let i = 0; i < attempts.length; i++) {
      let attempt = attempts[i];
      try {
        // resolvedPath = require.resolve(path.join(entryPath, attempt));
        // resolvedPath = require.resolve(attempt, { paths: [entryPath] });
        // resolvedPath = resolve.sync(attempt, { basedir: entryPath, preserveSymlinks: true });
        resolvedPath = resolve.sync(path.join(entryPath, attempt.dep), { preserveSymlinks: true });
        break;
      } catch (err) {
        if (i === attempts.length - 1) {
          // throw err;
          // could be a vendor shim
          if (!visited.has(attempt.original)) {
            debug(`Could not resolve "${attempt.original}". Perhaps a vendor shim?`);
            visited.add(attempt.original);
          }
          return;
        }
      }
    }
    dep = resolvedPath.replace(entryPath, '').substr(1);
    let child = new Node(parent, dep);
    if (visited.has(child.name)) {
      return;
    }
    visited.add(child.name);
    recurse(child, entryPath, entryName, visited);
    parent.addChild(child);
  });
}

class Graph {
  static build(treePath, entryName, options) {
    options = options || {};
    let includes = options.include || [];
    let entryPath = path.join(treePath, entryName);

    let files = walkSync(entryPath, {
      directories: false,
      globs: ['**/*.js']
    });

    files = new Set(files.map(file => path.join(entryName, file)));

    for (let include of includes) {
      files.add(path.join('addon-tree-output', include));
    }

    let entryNode = new Node();
    let visited = new Set();

    for (let file of files) {
      let node = new Node(entryNode, file);
      visited.add(node.name);
      recurse(node, treePath, entryName, visited);
      entryNode.addChild(node);
    }

    return new Graph(treePath, entryNode, visited);
  }

  constructor(treePath, root, flattened) {
    this._treePath = treePath;
    this._root = root;
    this._flattened = flattened;
  }

  get root() {
    return this._root;
  }

  get flattened() {
    return Array.from(this._flattened);
  }

  calculateDead() {
    let files = walkSync(this._treePath, {
      directories: false,
      globs: ['**/*.js'],
      ignore: [
        'bower_components',
        'node_modules',
        'vendor'
      ]
    });

    let dead = new Set(files.map(path.normalize));

    for (let name of this._flattened) {
      dead.delete(name);
    }

    return Array.from(dead);
  }
}

module.exports = Graph;
