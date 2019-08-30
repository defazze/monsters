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

    this.scene = scene;
    this.monsterInfo = monsterInfo;
    this.onAttack = onAttack;
    this.player = player;

    this.setInteractive({
      hitArea: new Phaser.Geom.Rectangle(0, 0, 96, 96),
      hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      cursor: "url(assets/cursors/sword.cur), pointer"
    });

    if (monsterInfo.isChampion) {
      this.sprite.setTint(0xda1820);
    }

    if (monsterInfo.champion) {
      this.sprite.setTint(0xea4cc0);
    }

    this.on("pointerdown", () => onClick(this));
    this.on("destroy", this.onDestroy);

    scene.time.delayedCall(500, this.onTimerStart);
  }

  onTimerStart = () => {
    if (this.scene) {
      const { attackInterval = 1000 } = this.monsterInfo;
      this.timer = this.scene.time.addEvent({
        delay: attackInterval,
        callback: this.attack,
        callbackScope: this,
        loop: true
      });
    }
  };

  attack = () => {
    const lineDistance = Math.abs(
      this.monsterInfo.lineIndex - this.player.playerInfo.lineIndex
    );

    if (this.monsterInfo.isRanged && lineDistance > 1) {
      const targetX = this.player.x;
      const targetY = this.player.y;

      const a = this.x - targetX;
      const b = targetY - this.y;
      const B = (this.x * b) / a;
      const arrowY = this.y + B;

      const start = {
        x: this.x - CELL_SIZE / 2,
        y: this.y
      };
      const end = {
        x: 0,
        y: arrowY
      };

      const arrow = this.scene.physics.add.sprite(start.x, start.y, "arrow");

      const angle = Phaser.Math.Angle.Between(end.x, end.y, start.x, start.y);

      arrow.rotation = angle;
      const bounds = arrow.getBounds();
      arrow.setSize(bounds.width, bounds.height);
      const distance = Phaser.Math.Distance.Between(
        end.x,
        end.y,
        start.x,
        start.y
      );
      const speed = 0.2;

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

      arrow.setCollideWorldBounds(true);
      arrow.body.onWorldBounds = true;
      arrow.isArrow = true;
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
