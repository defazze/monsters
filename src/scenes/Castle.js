import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "CastleScene" });
  }
  init() {}
  preload() {}

  create() {
    this.cameras.main.setBackgroundColor(0x34c70e);

    const battlefield = this.add
      .sprite(150, 50, "battlefield")
      .setInteractive();
    battlefield.on("pointerdown", () => this.scene.switch("GameScene"));

    this.add.sprite(528, 432, "castle-big");
  }
}
