import Phaser from "phaser";
import Actor from "./Actor";
import { CELL_SIZE } from "../constants/common";

export class Monster extends Actor {
  constructor({
    scene,
    x,
    y,
    onClick,
    onAttack,
    onDead,
    health,
    monsterInfo,
    battlefield
  }) {
    super({
      scene,
      x,
      y,
      health,
      asset: monsterInfo.asset,
      name: monsterInfo.name,
      onDead
    });

    this.battlefield = battlefield;
    this.scene = scene;
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

  update(time, delta) {
    super.update(time, delta);

    if (!this.isDead) {
      if (!this.monsterInfo.attackInterval) {
        this.monsterInfo.attackInterval = 1000;
      }

      /*
      if (this.lastAttackTime == 0) {
        this.lastAttackTime = time + this.monsterInfo.attackInterval/2;
      }*/

      if (time > this.lastAttackTime + this.monsterInfo.attackInterval) {
        this.lastAttackTime = time;
        this.onAttack(this);
      }
    }
  }

  moveForward() {
    this.battlefield.setCell(
      this.monsterInfo.lineIndex,
      this.monsterInfo.rowIndex,
      null
    );

    this.monsterInfo.lineIndex--;
    this.battlefield.setCell(
      this.monsterInfo.lineIndex,
      this.monsterInfo.rowIndex,
      this.monsterInfo
    );

    this.scene.tweens.add({
      targets: this,
      x: this.x - CELL_SIZE,
      ease: "Sine.easeInOut",
      duration: 1000
    });
  }
}
