/**
 ** Handle materials and shaders.
 **/

import { WarpShader } from './shaders';

class Materials {
  constructor(root, path) {
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

    /*
    this.mat.default = new THREE.MeshPhysicalMaterial({emissive: 0, roughness: 1, envMapIntensity: 0.25});

    // environment
    const envMapSources = ['posx', 'negx', 'posy', 'negy', 'posz', 'negz'].map(filename => `${this.path}envmap/${filename}.jpg`);
    this.envMap = new THREE.CubeTextureLoader().load(envMapSources);
    this.normalMap = new THREE.TextureLoader().load(this.path + 'textures/noise.jpg');
    this.normalMap.wrapS = this.normalMap.wrapT = THREE.RepeatWrapping;
    this.normalMap.repeat.set(32, 32);

    // set envmaps
    Object.keys(this.mat).forEach(key => {
      if (this.mat[key].type && this.mat[key].type === 'MeshPhysicalMaterial') {
        this.mat[key].envMap = this.envMap;
      }
    });

    // reference file-loaded materials
    this.loaded = {};
    */
  }

  update(delta) {
    this.uniforms.time.value += delta;
    this.uniforms.offset.value.y += delta * 5;

    // pass points to shader
    const len = this.scene.points.length;
    for (var i=0, lim=this.uniforms.points.value.length; i<lim; ++i) {
      if (i < len) {
        this.uniforms.points.value[i].copy(this.scene.points[i].position);
      } else {
        // nullify
        this.uniforms.points.value[i].y = 0;
      }
    }
  }

  /*
  conformObjectMaterials(obj) {
    // recursively conform all mesh materials in a given object or group
    if (obj.type === 'Mesh') {
      this.conform(obj.material);
    } else if (obj.children) {
      obj.children.forEach(child => { this.conformObjectMaterials(child); });
    }
  }

  conform(mat) {
    if (!this.loaded[mat.name]) {
      this.loaded[mat.name] = mat;
    }
    mat.envMap = this.envMap;
    mat.envMapIntensity = 0.5;
    // switch (mat.name) {}
  }
  */
}

export { Materials };
