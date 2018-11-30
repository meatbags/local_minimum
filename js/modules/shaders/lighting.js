/**
 * Load lighting.
 **/

class Lighting {
  constructor(root) {
    this.sceneRef = root;

    // lighting
    this.lights = {point: {}, ambient: {}, directional: {}, hemisphere: {}};
    this.lights.ambient.a = new THREE.AmbientLight(0xffffff, 0.1);
    this.lights.point.a = new THREE.PointLight(0xffffff, 1, 32, 2);
    this.lights.point.a.position.set(-18, 2, 0);

    // add to scene
    Object.keys(this.lights).forEach(type => {
      Object.keys(this.lights[type]).forEach(light => {
        this.sceneRef.scene.add(this.lights[type][light]);
      });
    });
  }

  update(delta) {
    this.lights.point.a.position.z = this.sceneRef.map.z;
  }
}

export { Lighting };
