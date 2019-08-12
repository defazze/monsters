import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "WinScene" });
  }
  init() {}
  preload() {}

  create() {
    this.cameras.main.setBackgroundColor(0x104e8b);

    this.add.text(250, 250, "You are WINNER!!", {
      font: "64px Bangers",
      fill: "#ffd700"
    });
  }
}
