import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Vector3, Color3 } from "@babylonjs/core/Maths/math";
import { FreeCamera } from "@babylonjs/core/Cameras/freeCamera";
import { HemisphericLight } from "@babylonjs/core/Lights/hemisphericLight";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

class Main {
  private engine: Engine;
  private scene: Scene;

  constructor(canvasID: string) {
    const canvas = <HTMLCanvasElement> document.getElementById(canvasID);
    this.engine = new Engine(canvas);
    this.scene = new Scene(this.engine);

    this.createScene();
    this.startRender();
  }

  private createScene() {
    let camera = new FreeCamera('camera', new Vector3(0, 5,-10), this.scene);
    camera.setTarget(Vector3.Zero());
    camera.attachControl(this.engine.getRenderingCanvas() as HTMLCanvasElement, false);

    new HemisphericLight('light', new Vector3(0,1,0), this.scene);


    let sphere = MeshBuilder.CreateSphere('sphere', {segments: 16, diameter: 2}, this.scene);
    sphere.position.y = 1;

    let ground = MeshBuilder.CreateGround('ground', {
      width: 6,
      height: 6,
      subdivisions: 2
    }, this.scene);

    let material = new StandardMaterial("material", this.scene);
    material.diffuseColor = new Color3(1, 1, 1);
    sphere.material = material;
    ground.material = material;
  }

  private startRender() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }


}

window.addEventListener('DOMContentLoaded', () => {
  const main = new Main('render');
});
