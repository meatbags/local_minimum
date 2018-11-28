/**
 ** Record the canvas.
 **/

class Recorder {
  constructor(root) {
    this.cvs = document.createElement('canvas');
    this.ctx = this.cvs.getContext('2d');
    this.target = {
      canvasWebGL: root.renderer.renderer.domElement,
      canvas2D: root.hud.renderer.cvs
    };
    this.frameRate = 30;
    this.recordButton = document.querySelector('#record-button');
    this.recordButton.addEventListener('click', () => { this.record(); });
    this.recordDisplay = document.querySelector('#record-display');
  }

  resize() {
    this.cvs.width = window.innerWidth;
    this.cvs.height = window.innerHeight;
  }

  record() {
    if (!this.recordButton.classList.contains('active')) {
      this.resize();
      this.framesRecorded = 0;
      this.capturer = new CCapture({framerate: this.frameRate, format: 'png'}); //verbose: true, motionBlurFrames: true
      this.capturer.start();
      this.recording = true;
      this.recordButton.classList.add('active');
    } else {
      this.recording = false;
      this.capturer.stop();
      this.capturer.save();
      this.recordButton.classList.remove('active');
    }
  }

  update() {
    if (this.recording) {
      this.ctx.clearRect(0, 0, this.cvs.width, this.cvs.height);
      this.ctx.drawImage(this.target.canvasWebGL, 0, 0);
      this.ctx.drawImage(this.target.canvas2D, 0, 0);
      this.capturer.capture(this.cvs);
      this.framesRecorded += 1;
      const secs = Math.floor(this.framesRecorded / this.frameRate * 100) / 100;
      this.recordDisplay.innerHTML = `${this.framesRecorded} @ ${this.frameRate}fps (${secs}s)`;
    }
  }
}

export { Recorder };
