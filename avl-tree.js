class AVLTree {
  #root = null;

  insert(data) {
    if (data === null || data === undefined) {
      // if data is undefined or null
      return false;
    }

    this.#root = this.#insertHelper(this.#root, data);
    return true;
  }

  // deletes first occurence of node
  delete(data) {
    if (data !== null || data !== undefined) {
      this.#root = this.#deleteHelper(this.#root, data);
      return true;
    }

    return false;
  }

  #rightShift(node) {
    let leftNode = node.left;

    node.left = leftNode.right;
    leftNode.right = node;

    /* The parent node becomes the right child of of its previous left node. 
       Two heights are affected. The parent node's and the previous left node's. */
    this.#adjustNodeHeight(node);
    this.#adjustNodeHeight(leftNode);

    return leftNode;
  }

  #leftShift(node) {
    let rightNode = node.right;

    node.right = rightNode.left;
    rightNode.left = node;

    /* The parent node becomes the left child of of its previous right node. 
       Two heights are affected. The parent node's and the previous right node's. */
    this.#adjustNodeHeight(node);
    this.#adjustNodeHeight(rightNode);

    return rightNode;
  }

  /* Perform a right shift on right child node and a left shift
     on main node. */
  #rightLeftShift(node) {
    node.right = this.#rightShift(node.right);
    return this.#leftShift(node);
  }

  /* Perform a left shift on left child node and a right shift
     on main node. */
  #leftRightShift(node) {
    node.left = this.#leftShift(node.left);
    return this.#rightShift(node);
  }

  test() {
    return this.#root;
  }

  #createNode(data) {
    let node = {};
    node.data = data;
    node.height = 0;

    node.left = null;
    node.right = null;

    return node;
  }

  #insertHelper(node, data) {
    // If there's no node at current position, insert node here
    if (node === null) {
      return this.#createNode(data);
    }

    // If data is smaller than current node, go to left node,
    // else move to right node
    if (data < node.data) {
      node.left = this.#insertHelper(node.left, data);
    } else {
      node.right = this.#insertHelper(node.right, data);
    }

    /* Checking and fixing node balance */
    node = this.#adjustBalance(node);

    /* Updating height of current node */
    this.#adjustNodeHeight(node);

    return node;
  }

  #deleteHelper(node, data) {
    if (node === null) return node;

    // If data is smaller than current node, go to left node
    if (data < node.data) {
      node.left = this.#deleteHelper(node.left, data);
    } else if (data > node.data) {
      // Else move to right node
      node.right = this.#deleteHelper(node.right, data);
    } else {
      /* If data is same as node. */
      // if node has both children
      if (node.left && node.right) {
        /* Find the smallest node in right sub-tree and replace current node's data with it.
           Then delete that node from right sub-tree. */
        let tempNode = node.right;
        while (tempNode.left) {
          tempNode = tempNode.left;
        }
        node.data = tempNode.data;
        node.right = this.#deleteHelper(node.right, tempNode.data);
      } else if (!node.left && !node.right) {
        // if node has no children
        node = null;
      } else {
        /* if node has only one child, return that child */
        node = node.right ? node.right : node.left;
      }
    }

    node = this.#adjustBalance(node);
    this.#adjustNodeHeight(node);

    return node;
  }

  #getNodeHeight(node) {
    if (node === null) return -1;
    return node.height;
  }

  // corrects the height of a node
  #adjustNodeHeight(node) {
    if(node === null) return;

    node.height =
      Math.max(
        this.#getNodeHeight(node.left),
        this.#getNodeHeight(node.right)
      ) + 1;
  }

  // performs leftShifts and rightShifts and returns the balanced subtree
  #adjustBalance(node) {
    if(node === null) return node;

    let balance =
      this.#getNodeHeight(node.right) - this.#getNodeHeight(node.left);

    // If node is 'left heavy'
    if (balance < -1) {
      // If left child is 'right heavy', perform 'left right' shift
      // else do a right shift
      if (
        this.#getNodeHeight(node.left.right) -
        this.#getNodeHeight(node.left.left) >
        0
        ) {
          node = this.#leftRightShift(node);
        } else {
          node = this.#rightShift(node);
        }
      } else if (balance > 1) {
        // If right child is 'left heavy', perform 'right left' shift
        // else do a left shift
      if (
        this.#getNodeHeight(node.right.right) -
          this.#getNodeHeight(node.right.left) <
        0
      ) {
        node = this.#rightLeftShift(node);
      } else {
        node = this.#leftShift(node);
      }
    }

    return node;
  }
}
