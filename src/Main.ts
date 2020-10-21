import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { Player } from './Player';
import { Stage } from './Stage';
import { Camera } from './Camera';

class Main {
  private engine: BABYLON.Engine;
  private scene: Stage;

  constructor(canvasID: string) {
    const canvas = <HTMLCanvasElement> document.getElementById(canvasID);
    this.engine = new BABYLON.Engine(canvas);
    this.scene = new Stage(this.engine);
    this.scene.actionManager = new BABYLON.ActionManager(this.scene);

    this.createScene();
    this.startRender();
  }

  private async createScene() {
    //TODO: For split screen later https://doc.babylonjs.com/how_to/how_to_use_multi-views
    let camera = new Camera('camera', new BABYLON.Vector3(0, 0, 0), this.scene);
    camera.inertia = 0;

    new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0,1,0), this.scene);


    const player = new Player('player', this.scene);
    this.scene.add(player);
    const other = new Player('other', this.scene);
    other.z = 5;
    this.scene.add(other);

    //TODO: Set timeout
    setTimeout(() => {
      const skel = player?.skeleton;
      //alert('a');
      if (skel) {
      //alert('b');
        player.camera = camera;
        const index = skel.getBoneIndexByName('Head');
        const head = skel.bones[index];
        const headNode = head.getTransformNode();
        if (headNode) {
          //const headPos = headNode.position.clone();
          const headPos = new BABYLON.Vector3(3, 3, 3);
          const camNode = new BABYLON.TransformNode('camnode', this.scene);
          //camNode.setParent
          camNode.position = headPos;
          //camera.parent = camNode;
          //alert('Set');
        }
      }
    }, 10);

    this.scene.registerBeforeRender(() => {
      this.scene.tick();
    });


  }

  private startRender() {
    var renderer = this.scene.enableDepthRenderer();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }

  private tick(delta: number) {

  }

}

window.addEventListener('DOMContentLoaded', () => {
  new Main('render');
});
