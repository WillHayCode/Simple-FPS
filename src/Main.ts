import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';

class Main {
  private engine: BABYLON.Engine;
  private scene: BABYLON.Scene;

  constructor(canvasID: string) {
    const canvas = <HTMLCanvasElement> document.getElementById(canvasID);
    this.engine = new BABYLON.Engine(canvas);
    this.scene = new BABYLON.Scene(this.engine);

    this.createScene();
    this.startRender();
  }

  private createScene() {
    let camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(3, 3, 5), this.scene);
    camera.setTarget(new BABYLON.Vector3(0, 3, 0));
    camera.attachControl(this.engine.getRenderingCanvas() as HTMLCanvasElement, false);

    new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0,1,0), this.scene);

    const ground = BABYLON.MeshBuilder.CreateGround('ground', {
      width: 6,
      height: 6,
      subdivisions: 2
    }, this.scene);


    const assetManager = new BABYLON.AssetsManager(this.scene);
    const texturesFiles = ['alienA','alienB','astroFemaleA','astroFemaleB','astroMaleA','astroMaleB','athleteFemaleBlue','athleteFemaleGreen','athleteFemaleRed','athleteFemaleYellow','athleteMaleBlue','athleteMaleGreen','athleteMaleRed','athleteMaleYellow','businessMaleA','businessMaleB','casualFemaleA','casualFemaleB','casualMaleA','casualMaleB','cyborg','fantasyFemaleA','fantasyFemaleB','fantasyMaleA','fantasyMaleB','farmerA','farmerB','militaryFemaleA','militaryFemaleB','militaryMaleA','militaryMaleB','racerBlueFemale','racerBlueMale','racerGreenFemale','racerGreenMale','racerOrangeFemale','racerOrangeMale','racerPurpleFemale','racerPurpleMale','racerRedFemale','racerRedMale','robot2','robot3','robot','survivorFemaleA','survivorFemaleB','survivorMaleA','survivorMaleB','zombieA','zombieB','zombieC']
    const textures: BABYLON.Texture[] = [];
    const materials: BABYLON.StandardMaterial[] = [];
    for (let i = 0; i < texturesFiles.length; i++) {
      const texture = new BABYLON.Texture('textures/skins/' + texturesFiles[i] + '.png', this.scene) 
      texture.vScale = -1;
      textures.push(texture);
      const material = new BABYLON.StandardMaterial(texturesFiles[i], this.scene);
      materials.push(material);

      material.diffuseTexture = texture;
      material.specularTexture = texture;
      material.emissiveTexture = texture;
      material.ambientTexture = texture;
    }

    const getRandomMaterial = () => {
      const index = Math.floor(Math.random() * textures.length);
      return materials[index];
    }
    //meshTask.run(this.scene, () => null, () => null);
    const meshTask = assetManager.addMeshTask('loadChar', '', 'models/characters/', 'medium.glb');
    meshTask.onSuccess = (task: BABYLON.MeshAssetTask) => {
      console.log(task);
      const mesh = task.loadedMeshes[1];
      let mat = getRandomMaterial();
      mesh.material = mat;
      task.loadedMeshes[0].material = mat;
      window.addEventListener('keydown', (evt: KeyboardEvent) => {
        if (evt.key == 'r') {
          mat = getRandomMaterial();
          mesh.material = mat;
          task.loadedMeshes[0].material = mat;
        }
      });
    };

    meshTask.onError = (task: BABYLON.MeshAssetTask) => {
      console.log(task.errorObject);
    };
    assetManager.load();
    //BABYLON.SceneLoader.Append('./characterMedium/', 'characterMedium.gltf', this.scene);

    const material = new BABYLON.StandardMaterial("material", this.scene);
    material.diffuseColor = new BABYLON.Color3(1, 1, 1);
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
  new Main('render');
});
