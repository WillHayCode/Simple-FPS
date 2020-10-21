import * as BABYLON from 'babylonjs';
import { Loader } from './Loader';
import { Mesh } from './Asset';
import { Actor } from './Actor';
import { Stage } from './Stage';
import { Camera } from './Camera';

export class Player extends Actor {
  private meshName = 'medium';
  private speed = 3.0;
  private head: BABYLON.Nullable<BABYLON.Bone> = null;
  public camera: BABYLON.Nullable<Camera> = null;

  constructor(name: string, scene: Stage) {

    super(name, scene);

    this.setMesh('character', this.meshName).then((skin: Mesh) => {
      console.log('loaded ' + name);
      if (name == 'player' && skin.skeleton) {
        console.log('Player head status:');
        const headIndex = skin.skeleton.getBoneIndexByName('Head');
        if (headIndex >= 0) {
          console.log('Has head');
          this.head = skin.skeleton.bones[headIndex];
          const engine = scene.getEngine();
          const x = this.head.position.x;
          const y = this.head.position.y;
          const z = this.head.position.z;
          //this.camera = camera;
        }
      }
    });
;
    this.setSkin();
  }

  public tick(delta: number) {
    super.tick(delta);
    if (this.name == 'player') {
      const calculatedSpeed = this.speed * delta;

      const forwardKey = this.scene.input.key['w'];
      const backwardKey = this.scene.input.key['s'];
      const leftKey = this.scene.input.key['a'];
      const rightKey = this.scene.input.key['d'];

      const zAxis = forwardKey.value - backwardKey.value;
      const xAxis = rightKey.value - leftKey.value;

      const zSpeed = zAxis * calculatedSpeed;
      const xSpeed = xAxis * calculatedSpeed;

      this.z = this.z + zSpeed;
      this.x = this.x + xSpeed;

      if (this.camera != null) {
        if (this.head != null) {
          const tfHead = this.head.getTransformNode();
          if (tfHead) {
            /*this.camera.mo
            this.camera.position.x = tfHead.position.x;
            this.camera.position.y = tfHead.position.y;
            this.camera.position.z = tfHead.position.z;*/
           //this.camera.parent = tfHead;
            if (this.scene.input.mouse.justMoved) {
              const deltaX = this.scene.input.mouse.deltaX;
              const deltaY = this.scene.input.mouse.deltaY;
              //this.camera.absoluteRotation
            }
          }
        }
      }
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
