import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "SplashScene" });
  }

  preload() {
    //
    // load your assets
    //
    this.load.image("mushroom", "assets/images/mushroom2.png");
    this.load.image("pokemon", "assets/images/Pokemon2.jpg");
    this.load.image("bat", "assets/images/bat1.png");
    this.load.image("hero", "assets/images/hero.png");
    this.load.image("hp-potion", "assets/images/hp-potion.png");
    this.load.image("castle", "assets/images/castle.png");
    this.load.image("castle-big", "assets/images/castle-big.png");
    this.load.image("battlefield", "assets/images/battlefield.png");
  }

  create() {
    this.scene.start("GameScene");
  }

  update() {}
}
