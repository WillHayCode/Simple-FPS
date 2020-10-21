import * as BABYLON from 'babylonjs';
import { Actor } from './Actor';
import { Loader } from './Loader';
import { Input } from './Input';


export class Stage extends BABYLON.Scene {
  public loader: Loader;
  public input: Input;
  private actors: Actor[]; 

  private lastTick: number;

  constructor(engine: BABYLON.Engine) {
    super(engine);

    this.loader = new Loader(this);
    this.input = new Input(this);
    this.actors = [];
    this.lastTick = 0;
  }

  public tick() {
    // Calculate delta
    if (this.lastTick == 0) {
      this.lastTick = Date.now();
    }
    const newTick = Date.now();
    let delta = newTick - this.lastTick;
    delta /= 1000;
    this.lastTick = newTick;

    // Actors act
    for (let i = 0; i < this.actors.length; i++) {
      const actor = this.actors[i];
      actor.tick(delta);
    }

    // Load queued assets
    if (this.loader.state == 1) {
      this.loader.start();
    }

    // Reset input
    this.input.tick(delta);

  }

  public add(actor: Actor) {
    this.actors.push(actor);
  }
}
