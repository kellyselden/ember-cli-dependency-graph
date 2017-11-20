'use strict';

class Node {
  constructor(parent, name) {
    this._parent = parent;
    this._name = name;
    this._children = [];
  }

  get parent() {
    return this._parent;
  }

  get name() {
    return this._name;
  }

  get children() {
    return this._children;
  }

  addChild(node) {
    this._children.push(node);
  }
}

module.exports = Node;
