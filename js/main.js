/**
 ** App entry point.
 **/

import { Scene, Renderer, Recorder } from './modules';

class App {
  constructor() {
    this.scene = new Scene();
    this.renderer = new Renderer(this.scene);
    this.now = performance.now();
    this.recorder = new Recorder(this);
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });
    const t = performance.now();
    const delta = (t - this.now) / 1000;
    this.now = t;
    this.scene.update(delta);
    this.renderer.draw(delta);
    this.recorder.update();
  }
}

window.onload = () => {
  const app = new App();
};
