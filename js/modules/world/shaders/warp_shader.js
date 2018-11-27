const WarpShader = new THREE.ShaderMaterial({
  uniforms: {
    time: {value: 0.0},
    points: {value: []},
    step: {value: new THREE.Vector2(2, 1)},
    offset: {value: new THREE.Vector2()}
  },
  vertexShader: `
    #define DEPTH_TO_RADIUS 1.0;
    uniform float time;
    uniform vec3 points[16];
    varying vec3 vP;

    float computeHeight(vec3 p0, vec3 p1) {
      if (p1.y == 0.0) {
        return 0.0;
      } else {
        float mag = sqrt(pow(p1.x - p0.x, 2.0) + pow(p1.z - p0.z, 2.0));
        float magMax = abs(p1.y) * DEPTH_TO_RADIUS;
        if (mag < magMax) {
          float t = 1.0 - mag / magMax;
          float easing = (t < 0.5) ? 2.0 * t * t : -1.0 + (4.0 - 2.0 * t) * t;
          return easing * p1.y;
        } else {
          return 0.0;
        }
      }
    }

    void main() {
      vP = position;
      vP.y = 0.0;
      for (int i=0; i<16; ++i) {
        vP.y = min(vP.y, computeHeight(position, points[i]));
      }
      gl_Position = projectionMatrix * modelViewMatrix * vec4(vP, 1.0);
    }
  `,
  fragmentShader: `
    #define GRID_THRESHOLD 0.08
    #define GRID_ALIAS 0.08
    uniform vec2 offset;
    uniform vec2 step;
    varying vec3 vP;

    float computeGridAlpha() {
      float x = mod(vP.x + offset.x, step.x);
      float z = mod(vP.z + offset.y, step.y);
      x = x > step.x / 2.0 ? step.x - x : x;
      z = z > step.y / 2.0 ? step.y - z : z;
      float xres = x < GRID_THRESHOLD ? ((GRID_THRESHOLD - x) / GRID_ALIAS) : 0.0;
      float zres = z < GRID_THRESHOLD ? ((GRID_THRESHOLD - z) / GRID_ALIAS) : 0.0;
      return min(1.0, xres + zres);
    }

    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, computeGridAlpha());
    }
  `
});

export { WarpShader };
