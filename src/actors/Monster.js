import Phaser from "phaser";
import Actor from "./Actor";

export class Monster extends Actor {
  constructor({ scene, x, y, onClick, onAttack, health, monsterInfo }) {
    super({
      scene,
      x,
      y,
      health,
      asset: monsterInfo.asset,
      name: monsterInfo.name
    });

    this.monsterInfo = monsterInfo;
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
      if (!this.monsterInfo.attackInterval) {
        this.monsterInfo.attackInterval = 500;
      }
      if (time > this.lastAttackTime + this.monsterInfo.attackInterval) {
        this.lastAttackTime = time;
        this.onAttack(this.monsterInfo);
      }
    }
  }
}
