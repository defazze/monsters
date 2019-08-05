import Phaser from "phaser";

export default class extends Phaser.GameObjects.Sprite {
  constructor({ scene, x, y }) {
    super(scene, x, y, "mushroom");

    this.angleDelta = 1;
    this.setInteractive();
    this.on("pointerdown", this.onClick, this);
  }

  onClick() {
    this.angleDelta = -this.angleDelta;
  }

  update() {
    this.angle += this.angleDelta;
  }
}
