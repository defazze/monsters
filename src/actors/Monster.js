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

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, 96, 96),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: "url(assets/cursors/sword.cur), pointer"
    });

    this.on("pointerdown", () => onClick(this));
  }

  update(time) {
    super.update(time);

    if (!this.isDead) {
      if (!this.monsterInfo.attackInterval) {
        this.monsterInfo.attackInterval = 500;
      }
      if (this.lastAttackTime == 0) {
        this.lastAttackTime = time + this.monsterInfo.attackInterval;
      }

      if (time > this.lastAttackTime + this.monsterInfo.attackInterval) {
        this.lastAttackTime = time;
        this.onAttack(this.monsterInfo);
      }
    }
  }
}
