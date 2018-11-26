/**
 ** Perspective camera.
 **/

import { blend } from '../utils/maths';

class Camera {
  constructor(root) {
    this.root = root;
    this.player = root.player;

    // set up three camera
    this.position = new THREE.Vector3();
    this.positionBlend = 0.1;
    this.offset = new THREE.Vector3(0, 25, -15);
    this.aspectRatio = this.root.width / this.root.height;
    //this.orthoHeight = 5;
    //this.orthoWidth = this.orthoHeight * this.aspectRatio;
    //this.camera = new THREE.OrthographicCamera(-this.orthoWidth, this.orthoWidth, this.orthoHeight, -this.orthoHeight, 0.1, 1000);
    this.camera = new THREE.PerspectiveCamera(45, this.aspectRatio, 1, 1000);
    this.camera.position.set(this.offset.x, this.offset.y, this.offset.z);
    this.camera.lookAt(new THREE.Vector3());
  }

  resize(w, h) {
    this.aspectRatio = this.root.width / this.root.height;
    if (this.camera.isPerspectiveCamera) {
      this.camera.aspect = this.aspectRatio;
      this.camera.updateProjectionMatrix();
    } else {
      this.orthoWidth = this.orthoHeight * this.aspectRatio;
      this.camera.left = -this.orthoWidth;
      this.camera.right = this.orthoWidth;
      this.camera.top = this.orthoHeight;
      this.camera.bottom = -this.orthoHeight;
      this.camera.updateProjectionMatrix();
    }
  }

  update(delta) {
    this.position.x = blend(this.position.x, this.player.position.x, this.positionBlend);
    //this.position.y = blend(this.position.y, this.player.position.y, this.positionBlend);
    this.position.z = blend(this.position.z, this.player.position.z, this.positionBlend);
    this.camera.position.x = this.position.x + this.offset.x;
    this.camera.position.y = 0 + this.offset.y;
    this.camera.position.z = this.position.z + this.offset.z;
  }
}

export { Camera };
