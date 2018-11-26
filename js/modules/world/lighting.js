/**
 * Load lighting.
 **/

class Lighting {
  constructor(root) {
    this.scene = root.scene;

    // lighting
    this.lights = {point: {}, ambient: {}, directional: {}, hemisphere: {}};
    this.lights.ambient.a = new THREE.AmbientLight(0xffffff, 0.1);

    // add to scene
    Object.keys(this.lights).forEach(type => {
      Object.keys(this.lights[type]).forEach(light => {
        this.scene.add(this.lights[type][light]);
      });
    });
  }
}

export { Lighting };
