import * as BABYLON from 'babylonjs';
import { Stage } from './Stage';

export class Camera extends BABYLON.UniversalCamera {
  constructor(name: string, position: BABYLON.Vector3, scene: Stage) {
    super(name, position, scene);
    this.inertia = 0;
    //this.fov = 2 * Math.PI; //One day...
    const engine = scene.getEngine();
    if (engine) {
      this.attachControl(engine.getRenderingCanvas() as HTMLCanvasElement, false);
    }
  }

}
