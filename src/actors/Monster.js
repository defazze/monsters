import Phaser from "phaser";
import Actor from "./Actor";

export class Monster extends Actor {
  constructor({ scene, x, y, asset, name, totalLife, onClick, onAttack }) {
    super({ scene, x, y, asset, name, totalLife });

    this.attackInterval = 500;
    this.damage = 75;
    this.lastAttackTime = 0;
    this.onAttack = onAttack;

    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, 96, 96),
      Phaser.Geom.Rectangle.Contains
    );

    this.on("pointerdown", () => onClick(this));
  }

  update(time) {
    if (!this.isDead) {
      if (time > this.lastAttackTime + this.attackInterval) {
        this.lastAttackTime = time;
        this.onAttack(this);
      }
    }
  }
}
