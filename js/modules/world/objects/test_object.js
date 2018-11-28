/**
 ** Test object.
 **/

import { GravityParticle } from '../../physics';

class TestObject {
  constructor(root, p) {
    this.root = root;
    this.sceneRef = root.root;
    this.active = true;

    // mesh
    this.group = new THREE.Group();
    this.mesh = new THREE.Mesh(new THREE.SphereBufferGeometry(0.5, 24, 24), new THREE.MeshBasicMaterial({}));
    this.group.add(this.mesh);
    this.sceneRef.scene.add(this.group);

    // physics
    this.position = this.group.position;
    this.position.copy(p);
    this.velocity = new THREE.Vector3(0, 0, 8);
    this.node = new GravityParticle(this.position);
    this.node.setVelocity(this.velocity);
  }

  update(delta) {
    this.node.update(delta, this.sceneRef.gravityNodes);

    if (this.position.z < this.root.plane.position.z - 16) {
      this.destroy();
    }
  }

  destroy() {
    this.sceneRef.scene.remove(this.group);
    this.active = false;
  }
}

export { TestObject };
