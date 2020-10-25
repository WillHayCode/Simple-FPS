import * as BABYLON from 'babylonjs';
import { Loader } from './Loader';
import { Actor } from './Actor';
import { Stage } from './Stage';
import { Camera } from './Camera';

export class Player extends Actor {
  private meshName = 'medium';
  private speed = 5.0;
  private runSpeed = 7.0;
  public camera: BABYLON.Nullable<Camera> = null;

  private sensitivity = 0.1;

  constructor(name: string, scene: Stage) {

    super(name, scene);

    this.setMesh('character', this.meshName);

    window.addEventListener('keydown', (evt: KeyboardEvent) => {
      if (evt.key == 'q') {
        console.log(this.node.rotation.y, this.headNode.rotation.y);
      }
    });
    this.setSkin();
  }

  public tick(delta: number) {
    super.tick(delta);
    if (this.name == 'player') {
      let calculatedSpeed = delta;
      if (this.scene.input.key['shift'].pressed) {
        calculatedSpeed *= this.runSpeed;
      } else {
        calculatedSpeed *= this.speed;
      }

      const forwardKey = this.scene.input.key['w'];
      const backwardKey = this.scene.input.key['s'];
      const leftKey = this.scene.input.key['a'];
      const rightKey = this.scene.input.key['d'];

      const zAxis = forwardKey.value - backwardKey.value;
      const xAxis = rightKey.value - leftKey.value;

      const zSpeed = zAxis * calculatedSpeed;
      const xSpeed = xAxis * calculatedSpeed;

      if (this.camera != null) {
        if (this.scene.input.mouse.justMoved) {
          const deltaX = this.scene.input.mouse.deltaX;
          const deltaY = this.scene.input.mouse.deltaY;

          // Note: X and Y have to swap from mouse to axis
          this.headNode.rotation.x += deltaY * delta * this.sensitivity; //TODO: Cap these values
          this.node.rotation.y += deltaX * delta * this.sensitivity; // Change root node 
        }
      }

      let rotation = this.node.rotation.y;

      let zMove = zSpeed * Math.cos(rotation);
      let xMove = zSpeed * Math.sin(rotation);
      this.z = this.z + zMove;
      this.x = this.x + xMove; 

      rotation += Math.PI / 2; // Turn to right
      
      zMove = xSpeed * Math.cos(rotation);
      xMove = xSpeed * Math.sin(rotation);
      this.z = this.z + zMove;
      this.x = this.x + xMove;

    } else {
      //this.node.rotation.y += delta * 1;
    }
  }

  public setSkin(skin?: string) {
      if (!skin) {
        const skins = Loader.skins;
        const index = Math.floor(Math.random() * skins.length);
        skin = skins[index];
      }
      this.setTexture('skin', skin);
  }

  public set accessory(accessory: BABYLON.Mesh) {
    if (this.skin.skeleton) {
      const headIndex = this.skin.skeleton.getBoneIndexByName('Head');
      if (headIndex >= 0) {

        console.log(this.root.getChildMeshes());
        const head = this.skin.skeleton.bones[headIndex];
        const headTFNode = head.getTransformNode();
        if (!headTFNode) {
          return;
        }
        console.log(headTFNode);
        headTFNode.position.y = -headTFNode.position.y ;
        accessory.attachToBone(head, headTFNode);
      }
    }
  }

  public get skeleton(): BABYLON.Nullable<BABYLON.Skeleton> {
    return this.skin.skeleton;
  }
}
