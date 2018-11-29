/**
 ** App entry point.
 **/

import { Scene, Renderer, Renderer2D, Recorder, HUD } from './modules';

class App {
  constructor() {
    this.scene = new Scene();
    this.renderer = new Renderer(this.scene);
    this.hud = new HUD(this.scene);
    this.now = performance.now();
    this.recorder = new Recorder(this);
    this.loop();
  }

  loop() {
    requestAnimationFrame(() => { this.loop(); });
    const t = performance.now();
    const delta = Math.min((t - this.now) / 1000, 0.5);
    this.now = t;
    this.scene.update(delta);
    this.renderer.draw(delta);
    this.hud.draw(delta);
    this.recorder.update();
  }
}

window.onload = () => {
  const app = new App();
};
