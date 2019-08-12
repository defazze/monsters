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
    this.load.image("hedgehog", "assets/images/hedgehog2.png");
    this.load.image("undead_archer", "assets/images/undead_archer.png");
    this.load.image("arrow", "assets/images/arrow.png");
    this.load.image("chest", "assets/images/chest.png");
    this.load.image("hero", "assets/images/hero.png");
    this.load.image("hp-potion", "assets/images/hp-potion2.png");
    this.load.image("castle", "assets/images/castle.png");
    this.load.image("castle-big", "assets/images/castle-big.png");
    this.load.image("battlefield", "assets/images/battlefield.png");
    this.load.image("inventory", "assets/images/inventory.png");
    this.load.image("inventory-icon", "assets/images/inventory-icon.png");
    this.load.spritesheet("coin", "assets/images/coin.png", {
      frameWidth: 16,
      frameHeight: 16
    });
  }

  create() {
    this.scene.start("GameScene");
  }

  update() {}
}
