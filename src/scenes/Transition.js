import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "TransitionScene" });
  }
  init() {}
  preload() {}

  create() {
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0)");

    this.tweens.addCounter({
      duration: 5000,
      onUpdate: (tween, target, params) => {
        this.cameras.main.setBackgroundColor(
          "rgba(0,0,0," + target.value + ")"
        );
      },
      onComplete: () => {
        this.scene.stop("GameScene");
        this.scene.start("CastleScene");
      }
    });
  }
}
