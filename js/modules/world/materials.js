/**
 ** Handle materials and shaders.
 **/

class Materials {
  constructor(root, path) {
    this.scene = root.root;
    this.path = `./${path}/`;
    this.mat = {};
    this.mat.default = new THREE.MeshPhysicalMaterial({emissive: 0, roughness: 1, envMapIntensity: 0.25});

    // environment
    //const envMapSources = ['posx', 'negx', 'posy', 'negy', 'posz', 'negz'].map(filename => `${this.path}envmap/${filename}.jpg`);
    //this.envMap = new THREE.CubeTextureLoader().load(envMapSources);
    //this.normalMap = new THREE.TextureLoader().load(this.path + 'textures/noise.jpg');
    //this.normalMap.wrapS = this.normalMap.wrapT = THREE.RepeatWrapping;
    //this.normalMap.repeat.set(32, 32);

    // set envmaps
    Object.keys(this.mat).forEach(key => {
      if (this.mat[key].type && this.mat[key].type === 'MeshPhysicalMaterial') {
        //this.mat[key].envMap = this.envMap;
      }
    });

    // custom shader uniforms
    this.uniforms = {
      time: { value: 0 },
      uPoints: new THREE.Uniform([])
    };
    for (var i=0; i<16; ++i) {
      this.uniforms.uPoints.value.push(new THREE.Vector3());
    }
    console.log(this.uniforms);

    // custom shader
    this.mat.grid = new THREE.MeshBasicMaterial({});
    //this.mat.grid.light
    this.mat.grid.map = new THREE.TextureLoader().load(`${this.path}textures/grid.jpg`);
    this.mat.grid.map.wrapS = THREE.RepeatWrapping;
    this.mat.grid.map.wrapT = THREE.RepeatWrapping;
    this.mat.grid = this.getCustomMaterial(this.mat.grid);

    // reference file-loaded materials
    this.loaded = {};
  }

  getCustomMaterial(inputMat) {
    const mat = inputMat.clone();
    mat.onBeforeCompile = (shader) => {
      const uniforms = `
        uniform float time;
        uniform vec3 uPoints[16];
      `;
      const funcs = `
        float easing(float t) {
          if (t < 0.5) {
            return 2.0 * t * t;
          } else {
            return -1.0 + (4.0 - 2.0 * t) * t;
          }
        }

        float computeHeight(vec3 p0, vec3 p1) {
          if (p1.y == 0.0) {
            return 0.0;
          } else {
            float mag = sqrt(pow(p1.x - p0.x, 2.0) + pow(p1.z - p0.z, 2.0));
            float dMax = abs(p1.y) * 2.0;
            return (mag < dMax) ? easing(1.0 - mag / dMax) * p1.y : 0.0;
          }
        }
      `;
      const vs = `
        vec3 p = position;
        float y = 0.0;
        for (int i=0; i<16; ++i) {
          y = min(y, computeHeight(p, uPoints[i]));
        }
        vec3 transformed = vec3(p.x, y, p.z);
      `;
      shader.vertexShader = `${uniforms}\n${funcs}${shader.vertexShader}`;
      shader.vertexShader = shader.vertexShader.replace('#include <begin_vertex>', vs);
      shader.uniforms.time = this.uniforms.time;
      shader.uniforms.uPoints = this.uniforms.uPoints;
    };
    return mat;
  }

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

  update(delta) {
    this.uniforms.time.value += delta;
    this.mat.grid.map.offset.y -= delta * 0.05;

    // pass points to shader
    const len = this.scene.points.length;
    for (var i=0, lim=this.uniforms.uPoints.value.length; i<lim; ++i) {
      if (i < len) {
        this.uniforms.uPoints.value[i].copy(this.scene.points[i].position);
      } else {
        // nullify
        this.uniforms.uPoints.value[i].y = 0;
      }
    }
  }
}

export { Materials };
