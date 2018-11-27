/**
 ** Interact with gravity nodes.
 **/

class GravityParticle {
  constructor(position) {
    this.position = position;
    this.gravity = 8;
    this.terminalVelocity = 20;
    this.force = new THREE.Vector3();
    this.up = new THREE.Vector3(0, 1, 0);
    this.floor = new THREE.Vector3();
    this.vector = new THREE.Vector3();
  }

  boost(x, y, z) {
    this.force.set(x, y, z);
  }

  update(delta, nodes) {
    // move
    this.position.x += this.vector.x * delta;
    this.position.y += this.vector.y * delta;
    this.position.z += this.vector.z * delta;

    // get floor
    let y = 0;
    let res = null;
    nodes.forEach(node => {
      const newY = node.getFloorAtPoint(this.position);
      if (newY < y) {
        y = newY;
        res = node;
      }
    });

    // snap
    if (res) {
      this.position.y = y;
      this.floor = res.getVectorAtPoint(this.position);
    } else {
      this.floor.set(0, 0, 0);
    }

    // get new vector
    this.vector.copy(this.force);
    this.vector.add(this.floor);
    this.vector.y += this.up.y * -this.gravity;

    // limit
    this.vector.clampLength(-this.terminalVelocity, this.terminalVelocity);
  }
}

export { GravityParticle };
