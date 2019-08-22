import Phaser from "phaser";
import { GOLD } from "../constants/drop";
import { CELL_SIZE } from "../constants/common";

export default class {
  constructor(scene) {
    this.scene = scene;

    scene.anims.create({
      key: "flip",
      frames: scene.anims.generateFrameNumbers("coin"),
      frameRate: 30,
      repeat: 1,
      hideOnComplete: true
    });
  }

  animate(drops, x, y) {
    drops.forEach(d => {
      if (d.code == GOLD) {
        const coin = this.scene.add.sprite(
          x + CELL_SIZE / 2,
          y + CELL_SIZE / 2,
          "coin"
        );
        coin.anims.play("flip");
        coin.once("animationcomplete", () => {
          coin.destroy();
        });

        this.scene.tweens.add({
          targets: coin,
          y: y + CELL_SIZE / 2 - 30,
          ease: "Sine.easeInOut",
          duration: 400
        });
      } else {
        const item = this.scene.add.sprite(
          x + CELL_SIZE / 2,
          y + CELL_SIZE / 2,
          d.asset
        );

        item.setScale(0.8);
        this.scene.tweens.add({
          targets: item,
          y: y + CELL_SIZE / 2 - 30,
          ease: "Sine.easeInOut",
          duration: 300,
          onComplete: () => item.destroy()
        });
      }
    });
  }
}
