import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "GameOverScene" });
  }
  init() {}
  preload() {}

  create() {
    this.cameras.main.setBackgroundColor(0x68228b);

    this.add.text(250, 250, "Game Over", {
      font: "64px Bangers",
      fill: "#ffd700"
    });
  }
}
