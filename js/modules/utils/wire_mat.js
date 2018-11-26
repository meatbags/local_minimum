const wireMat = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0 }
  },
  vertexShader: `
    attribute vec3 centre;
    varying vec3 vC;

    void main() {
      vC = centre;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vC;

    float edgeFactorTri(float sstep) {
      vec3 d = fwidth(vC.xyz);
      vec3 a3 = smoothstep(vec3(0.0), d * sstep, vC.xyz);
      return min(min(a3.x, a3.y), a3.z);
    }

    void main() {
      gl_FragColor.rgb = mix(vec3(1.0), vec3(0.0, 0.0, 0.25), edgeFactorTri(2.0));
      gl_FragColor.a = clamp(1.0 - edgeFactorTri(5.0), 0.5, 1.0);
    }
  `
});

export { wireMat };
