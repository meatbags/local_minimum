/**
 ** Handle materials and shaders.
 **/

import { WarpShader } from './warp_shader';

class Materials {
  constructor(root, path) {
    this.root = root;
    this.scene = root.root;
    this.path = `./${path}/`;
    this.mat = {
      loaded: {}
    };

    // load envmap
    const envMapSources = ['posx', 'negx', 'posy', 'negy', 'posz', 'negz'].map(filename => `${this.path}envmap/${filename}.jpg`);
    this.envMap = new THREE.CubeTextureLoader().load(envMapSources);

    // warped grid shader
    this.mat.grid = WarpShader;
    this.mat.grid.transparent = true;
    this.uniforms = this.mat.grid.uniforms;
    for (var i=0; i<16; ++i) {
      this.uniforms.points.value.push(new THREE.Vector3());
    }
  }

  conformObject(obj) {
    // recursively conform object material/s
    if (obj.type === 'Mesh') {
      this.conformMaterial(obj.material);
    } else if (obj.children) {
      obj.children.forEach(child => {
        this.conformObject(child);
      });
    }
  }

  conformMaterial(mat) {
    // register material
    if (this.mat.loaded[mat.name] === undefined) {
      this.mat.loaded[mat.name] = mat;
    }

    // apply envmap
    mat.envMap = this.envMap;
    mat.envMapIntensity - 0.5;
  }

  update(delta) {
    this.uniforms.time.value += delta;
    this.uniforms.offset.value.y = this.root.plane.position.z;

    // pass points to shader
    const nodeCount = this.scene.gravityNodes.length;
    const offsetX = this.root.plane.position.x;
    const offsetZ = this.root.plane.position.z;
    for (var i=0, lim=this.uniforms.points.value.length; i<lim; ++i) {
      if (i < nodeCount) {
        const p = this.scene.gravityNodes[i].position;
        this.uniforms.points.value[i].set(p.x - offsetX, p.y, p.z - offsetZ);
      } else {
        // nullify
        this.uniforms.points.value[i].set(0, 0, 0);
      }
    }
  }
}

export { Materials };
