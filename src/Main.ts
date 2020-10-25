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


    canvas.addEventListener('click', () => {

      canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock;
      if (canvas.requestPointerLock) {
          canvas.requestPointerLock();
      }
    });
    this.createScene();
    this.startRender();
  }

  private async createScene() {
    //TODO: For split screen later https://doc.babylonjs.com/how_to/how_to_use_multi-views
    let camera = new Camera('camera', new BABYLON.Vector3(0, 0, 0), this.scene);
    //camera.setTarget(BABYLON.Vector3.Zero());

    new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0,1,0), this.scene);


    const player = new Player('player', this.scene);
    this.scene.add(player);
    //camera.parent = player.node;
    camera.parent = player.headNode;
    const other = new Player('other', this.scene);
    other.z = 5;
    this.scene.add(other);

    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:1000.0}, this.scene);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", this.scene);
    const extensions = ['_px.png', '_py.png', '_pz.png', '_nx.png', '_ny.png', '_nz.png']
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("texture/sky/sky", this.scene, extensions);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;



    this.scene.start();
  }

  private startRender() {
    //TODO: Move to stage?
    var renderer = this.scene.enableDepthRenderer();
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });

    window.addEventListener('resize', () => {
      this.engine.resize();
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new Main('render');
});
