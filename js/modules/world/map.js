/**
 ** Handle map logic.
 **/

import { Materials } from './materials';
import { Loader } from '../utils';

class Map {
  constructor(root) {
    this.root = root;
    this.scene = root.scene;
    this.materials = new Materials(this, 'assets');
    this.loader = new Loader('assets');
    this.loadScene();
  }

  loadScene() {
    // load maps
    const mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(32, 32, 128, 128), this.materials.mat.grid);
    mesh.rotation.x = Math.PI / -2;
    mesh.updateMatrix();
    mesh.geometry.applyMatrix(mesh.matrix);
    mesh.rotation.x = 0;
    this.scene.add(mesh);

    /*
    this.loader.loadFBX('map').then((map) => {
      this.materials.conformObjectMaterials(map);
      this.scene.add(map);
    }, (err) => { console.log(err); });
    */
  }

  update(delta) {
    this.materials.update(delta);
  }
}

export { Map };
