/**
 ** Record the canvas.
 **/

class Recorder {
  constructor(root) {
    this.target = root.renderer.renderer.domElement;
    this.frameRate = 30;
    this.recordButton = document.querySelector('#record-button');
    this.recordButton.addEventListener('click', () => { this.record(); });
    this.recordDisplay = document.querySelector('#record-display');
  }

  record() {
    if (!this.recordButton.classList.contains('active')) {
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
      this.capturer.capture(this.target);
      this.framesRecorded += 1;
      const secs = Math.floor(this.framesRecorded / this.frameRate * 100) / 100;
      this.recordDisplay.innerHTML = `${this.framesRecorded} @ ${this.frameRate}fps (${secs}s)`;
    }
  }
}

export { Recorder };
