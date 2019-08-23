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
    battlefield,
    player
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
    this.onAttack = onAttack;
    this.player = player;

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, 96, 96),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: "url(assets/cursors/sword.cur), pointer"
    });

    this.on("pointerdown", () => onClick(this));
    this.on("destroy", this.onDestroy);

    scene.time.delayedCall(500, this.onTimerStart);
  }

  onTimerStart = () => {
    const { attackInterval = 1000 } = this.monsterInfo;
    this.timer = this.scene.time.addEvent({
      delay: attackInterval,
      callback: this.attack,
      callbackScope: this,
      loop: true
    });
  };

  attack = () => {
    const lineDistance = Math.abs(
      this.monsterInfo.lineIndex - this.player.playerInfo.lineIndex
    );

    if (this.monsterInfo.isRanged && lineDistance > 1) {
      const start = {
        x: this.x,
        y: this.y + CELL_SIZE / 2
      };
      const end = {
        x: this.player.x + CELL_SIZE / 2,
        y: this.player.y + CELL_SIZE / 2
      };
      const arrow = this.scene.physics.add.sprite(start.x, start.y, "arrow");
      const angle = Phaser.Math.Angle.Between(end.x, end.y, start.x, start.y);
      const distance = Phaser.Math.Distance.Between(
        end.x,
        end.y,
        start.x,
        start.y
      );
      const speed = 0.2;
      arrow.rotation = angle;

      this.scene.tweens.add({
        targets: arrow,
        x: end.x,
        y: end.y,
        duration: distance / speed
      });

      this.scene.physics.add.overlap(
        this.player.sprite,
        arrow,
        this.onRangeHit,
        null,
        this
      );
    } else {
      this.onAttack(this);
    }
  };

  onDestroy = () => {
    if (this.timer) {
      this.timer.remove();
    }
  };

  moveForward() {
    this.monsterInfo.lineIndex--;
    this.scene.tweens.add({
      targets: this,
      x: this.x - CELL_SIZE,
      ease: "Sine.easeInOut",
      duration: 1000
    });
  }

  onRangeHit = (player, arrow) => {
    this.onAttack(this);
    arrow.destroy();
  };
}
