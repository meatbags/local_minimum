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
  }

  update(delta) {
    this.materials.update(delta);
    this.plane.position.z = this.root.player.position.z + this.root.player.offset.z;
  }
}

export { Map };
