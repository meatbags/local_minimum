/**
 ** Handle materials and shaders.
 **/

import { WarpShader } from './shaders';

class Materials {
  constructor(root, path) {
    this.root = root;
    this.scene = root.root;
    this.path = `./${path}/`;
    this.mat = {};

    // warped grid shader
    this.mat.grid = WarpShader;
    this.mat.grid.transparent = true;
    this.uniforms = this.mat.grid.uniforms;
    for (var i=0; i<16; ++i) {
      this.uniforms.points.value.push(new THREE.Vector3());
    }
  }

  update(delta) {
    this.uniforms.time.value += delta;
    this.uniforms.offset.value.y = -this.root.plane.position.z;

    // pass points to shader
    const nodeCount = this.scene.gravityNodes.length;
    for (var i=0, lim=this.uniforms.points.value.length; i<lim; ++i) {
      if (i < nodeCount) {
        this.uniforms.points.value[i].copy(this.scene.gravityNodes[i].position);
      } else {
        // nullify
        this.uniforms.points.value[i].y = 0;
      }
    }
  }
}

export { Materials };
