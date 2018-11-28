/**
 ** Record mouse input on element.
 **/

class Mouse {
  constructor(domElement) {
    this.active = false;
    this.x = 0;
    this.y = 0;
    this.domElement = domElement;
    this.domElement.addEventListener('mousemove', e => { this.onMove(e); });
    this.domElement.addEventListener('mousedown', e => { this.onDown(e); });
    this.domElement.addEventListener('mouseup', e => { this.onUp(e); });
    this.domElement.addEventListener('mouseleave', e => { this.onUp(e); });
  }

  onDown(e) {
    this.active = true;
    this.onMove(e);
  }

  onUp(e) {
    this.active = false;
  }

  onMove(e) {
    this.x = e.clientX;
    this.y = e.clientY;
  }
}

export { Mouse };
