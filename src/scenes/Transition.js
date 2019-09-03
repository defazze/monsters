import Phaser from "phaser";

export default class extends Phaser.Scene {
  constructor() {
    super({ key: "TransitionScene" });
  }
  init() {}
  preload() {}

  create(gameData) {
    gameData.playerInfo.health = gameData.playerInfo.totalHealth;
    gameData.currentWave = 1;

    const { x, y } = gameData.knight;
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0)");
    const knight = this.add.image(x, y, "knight-dead");
    knight.setAlpha(0);

    this.tweens.addCounter({
      duration: 5000,
      onUpdate: (tween, target, params) => {
        this.cameras.main.setBackgroundColor(
          "rgba(0,0,0," + target.value + ")"
        );
        knight.setAlpha(target.value);
      },
      onComplete: () => {
        this.scene.stop("GameScene");
        this.tweens.add({
          targets: knight,
          y: 0,
          alpha: 0,
          duration: 3000,
          onComplete: () => this.scene.start("CastleScene", gameData)
        });
      }
    });
  }
}
