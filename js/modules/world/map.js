/**
 ** Handle map logic.
 **/

import { Materials } from './materials';
import { Loader } from '../utils';

class Map {
  constructor(root) {
    this.root = root;
    this.materials = new Materials(this, 'assets');
    this.loader = new Loader('assets');
    this.offset = new THREE.Vector3(0, 0, 12);
    this.loadScene();
  }

  loadScene() {
    // load maps
    this.plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(32, 32, 128, 128), this.materials.mat.grid);
    this.plane.rotation.x = Math.PI / -2;
    this.plane.updateMatrix();
    this.plane.geometry.applyMatrix(this.plane.matrix);
    this.plane.rotation.x = 0;
    this.root.scene.add(this.plane);

    // reference
    this.ref = new THREE.Mesh(new THREE.BoxBufferGeometry(0.2, 10, 0.2), new THREE.MeshBasicMaterial({color: 0x0000ff}));
    this.ref.position.set(1, 5, 0);
    this.root.scene.add(this.ref);
  }

  update(delta) {
    this.materials.update(delta);
    this.plane.position.z = this.root.player.position.z + this.offset.z;
  }
}

export { Map };
