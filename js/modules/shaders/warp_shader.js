const WarpShader = new THREE.ShaderMaterial({
  uniforms: {
    time: {value: 0.0},
    points: {value: []},
    step: {value: new THREE.Vector2(2, 1.5)},
    offset: {value: new THREE.Vector2()}
  },
  vertexShader: `
    #define DEPTH_TO_RADIUS 1.0;
    uniform float time;
    uniform vec3 points[16];
    varying vec3 vP;
    varying vec2 vUV;

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
      vUV = uv;
      vP.y = 0.0;
      for (int i=0; i<16; ++i) {
        vP.y = min(vP.y, computeHeight(position, points[i]));
      }
      gl_Position = projectionMatrix * modelViewMatrix * vec4(vP, 1.0);
    }
  `,
  fragmentShader: `
    #define GRID_THRESHOLD 0.08
    #define GRID_ALIAS 0.04
    #define ODD_COLOUR 0.125
    #define PI 3.14159
    uniform vec2 offset;
    uniform vec2 step;
    uniform float time;
    varying vec3 vP;
    varying vec2 vUV;

    float computeGridAlpha() {
      float cx = (vP.x + offset.x) / step.x;
      float cz = (vP.z + offset.y) / step.y;
      float cell = floor(cx) + floor(cz);
      float base = (mod(cell, 2.0) > 0.5) ? ODD_COLOUR : 0.0;
      float x = mod(vP.x + offset.x, step.x);
      float z = mod(vP.z + offset.y, step.y);
      x = x > step.x / 2.0 ? step.x - x : x;
      z = z > step.y / 2.0 ? step.y - z : z;
      float xres = x < GRID_THRESHOLD ? ((GRID_THRESHOLD - x) / GRID_ALIAS) : 0.0;
      float zres = z < GRID_THRESHOLD ? ((GRID_THRESHOLD - z) / GRID_ALIAS) : 0.0;
      return min(1.0, max(base, xres + zres));
    }

    void main() {
      float r = vUV.y;
      float b = 0.25 + (1.0 - vUV.y) * 0.75;
      float phase = 0.55 + 0.45 * sin(time * PI * 0.25);
      float t = clamp(-(vP.y / 10.0), 0.0, 1.0);
      vec3 res = mix(vec3(0.33, 0.33, b), vec3(phase, 1.0 - phase, 0.0), t);
      gl_FragColor = vec4(res, computeGridAlpha());
    }
  `
});

export { WarpShader };
