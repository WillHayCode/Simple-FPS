import * as BABYLON from 'babylonjs';
import { Stage } from './Stage';
import { Mesh } from './Asset';

export class Actor {
  protected name: string;
  protected scene: Stage;

  public node: BABYLON.TransformNode;
  public headNode: BABYLON.TransformNode;

  protected root: BABYLON.Mesh;
  protected skin: BABYLON.Mesh;

  constructor(name: string, scene: Stage) {
    this.name = name;
    this.scene = scene;

    this.root = this.scene.loader.EmptyMesh;
    this.skin = this.scene.loader.EmptyMesh;

    this.node = new BABYLON.TransformNode('rootNode', scene);
    this.headNode = new BABYLON.TransformNode('camNode', scene);
    this.headNode.parent = this.node;
  }

  public set x(x: number) {
    this.node.position.x = x;
    //this.root.position.x = x;
    //this.skin.position.x = x;
  }

  public get x(): number {
    return this.node.position.x;
  }

  public set y(y: number) {
    this.node.position.y = y;
    //this.root.position.y = y;
    //this.skin.position.y = y;
  }

  public get y(): number {
    return this.node.position.y;
  }

  public set z(z: number) {
    this.node.position.z = z;
    //this.root.position.z = z;
    //this.skin.position.z = z;
  }

  public get z(): number {
    return this.node.position.z;
  }

  public tick(delta: number) {
  }

  public setMesh(type: string, mesh: string): Promise<Mesh> {
    const promise = new Promise<Mesh> (
      (resolve: (value?: Mesh) => void, 
       reject: (reason: {
        message?: string,
        exception?: unknown
      }) => void) => {
        this.scene.loader.getMesh(type, mesh).then((root: Mesh) => {
          root.hasVertexAlpha = false;
          const prevRoot = this.root;

          root.position.set(prevRoot.position.x, prevRoot.position.y, prevRoot.position.z);
          this.root = root;
          prevRoot.dispose();

          const skin = <BABYLON.Nullable<BABYLON.Mesh>> root.getChildMeshes()[0];
          if (!skin) {
            console.log('No skin for ' + name);
            return;
          }
          const skinOld = this.skin;

          this.skin = skin;
          this.skin.hasVertexAlpha = false;
          this.skin.material = skinOld.material;
          this.skin.position.set(skinOld.position.x, skinOld.position.y, skinOld.position.z);
          root.parent = this.node;
          if (skin.skeleton) {
            const headBoneIndex = skin.skeleton.getBoneIndexByName('Head');
            if (headBoneIndex >= 0) {
              const headBone = skin.skeleton.bones[headBoneIndex];
              const headPos = headBone.getAbsolutePosition();
              this.headNode.position.set(headPos.x, headPos.y, headPos.z);
              console.log('Head node', headPos, skin.skeleton);
            }
          }
          resolve(skin);
        });
      });
    return promise;

    /*const meshTask = this.scene.loader.addMeshTask(this.name + 'mesh', '', 'mesh/' + type + '/', mesh + '.glb');
    meshTask.onSuccess = (task: BABYLON.MeshAssetTask) => {
      const root = <BABYLON.Nullable<BABYLON.Mesh>> task.loadedMeshes[0]; 
      if (!root) {
        console.log('No root for ' + name);
        return;
      }
      root.hasVertexAlpha = false;
      console.log('Root Skeleton', root.skeleton);

      const rootOld = this.root;
      


      root.position.set(rootOld.position.x, rootOld.position.y, rootOld.position.z);
      this.root = root;
      rootOld.dispose();

      const skin = <BABYLON.Nullable<BABYLON.Mesh>> task.loadedMeshes[1]; 
      if (!skin) {
        console.log('No skin for ' + name);
        return;
      }
      const skinOld = this.skin;

      this.skin = skin;
      this.skin.hasVertexAlpha = false;
      this.skin.material = skinOld.material;
      this.skin.position.set(skinOld.position.x, skinOld.position.y, skinOld.position.z);

      const skeleton = this.skin.skeleton;

      if (!skeleton) {
        return;
      }
      console.log(skeleton);

      /*const skeletonViewer = new BABYLON.SkeletonViewer(skeleton, this.skin, this.scene, true);
      //skeletonViewer.isEnabled = false;
      skeletonViewer.changeDisplayMode(BABYLON.SkeletonViewer.DISPLAY_SPHERE_AND_SPURS);
      const targetBoneIndex = skeleton.getBoneIndexByName('Head');

      const shader = BABYLON.SkeletonViewer.CreateBoneWeightShader(
          {
              skeleton,
              targetBoneIndex
          }, this.scene
      );*/
      //skin.material = shader;
      //root.material = shader;
    /*}

    meshTask.onError = (task: BABYLON.AbstractAssetTask) => {
      console.log("Error", task.errorObject);
    }
    */
  }

  public setTexture(type: string, texture: string) {

    /*const textureTask = this.scene.loader.addTextureTask(name + 'texture', 'textures/' + type + '/' + texture + '.png', false, false);
    //const skinTask = this.scene.loader.addTextureTask(name + 'skin', 'textures/skins/cyborg.png', false, true);
      //TODO: CRYborg

    textureTask.onSuccess = (task: BABYLON.TextureAssetTask) => {
      const mat = new BABYLON.StandardMaterial(name + 'skin', this.scene);
      const text = task.texture;
      if (!text) {
        console.log('Could not load skin');
        return;
      }
      mat.diffuseTexture = text;
      mat.specularTexture = text;
      mat.emissiveTexture = text;
      mat.ambientTexture = text;
      //mat.depthFunction
      //this.skin.mustDepthSortFacets
      this.skin.material = mat;
      
    };

    textureTask.onError = (task: BABYLON.TextureAssetTask) => {
      console.log('Error', task.errorObject);
    }*/

    this.scene.loader.getTexture(type, texture).then((text: BABYLON.Texture) => {
      const mat = new BABYLON.StandardMaterial(name + 'skin', this.scene);
      mat.diffuseTexture = text;
      mat.specularTexture = text;
      mat.emissiveTexture = text;
      mat.ambientTexture = text;
      //mat.depthFunction
      //this.skin.mustDepthSortFacets
      this.skin.material = mat;
    
    });
  }

}
