import Phaser from "phaser";

export default class extends Phaser.GameObjects.Sprite {
  constructor({ scene, x, y, onClick }) {
    super(scene, x, y, "hp-potion");

    this.setInteractive();
    this.on("pointerdown", () => onClick(this));
  }
}
