/* globals __DEV__ */
import Phaser from "phaser";

import Mushroom from "../sprites/Mushroom";
import LiveBar from "../graphics/LiveBar";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }
  init() {}
  preload() {}

  create() {
    this.currentLife = 1000;
    this.cameras.main.setBackgroundColor(0xf0f8ff);

    this.mushroom = new Mushroom({
      scene: this,
      x: 150,
      y: 300
    });

    this.liveBar = new LiveBar({ scene: this, x: 50, y: 400, totalLife: 1000 });

    this.add.existing(this.mushroom);
    this.add.existing(this.liveBar);

    this.mushroom2 = new Mushroom({
      scene: this,
      x: 550,
      y: 300
    });

    this.liveBar2 = new LiveBar({ scene: this, x: 450, y: 400 });

    this.add.existing(this.mushroom2);
    this.add.existing(this.liveBar2);

    this.add.text(100, 100, "Great Mushrooms War!", {
      font: "64px Bangers",
      fill: "#7744ff"
    });
  }

  update() {
    this.currentLife--;
    this.liveBar.setCurrentLife(this.currentLife);
    //this.mushroom2.update();
  }
}
